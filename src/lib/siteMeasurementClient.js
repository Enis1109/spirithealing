import { SITE_CONSENT_KEY, SITE_CONSENT_VERSION, SITE_FLOW_MS, validSiteChoice, validSiteReceipt, sitePage, siteCode } from '../../shared/siteMeasurement.js';
// Cross-tab changes require Web Locks and confirmed shared storage. Only consent
// metadata and unresolved receipts are stored, never form data or flow history.
export function createSiteMeasurementClient({ enabled = false, environment = 'local', storage, send, random, uuid, withLock,
    clock = () => Date.now(), privacySignal = () => false, changed = () => {} }) {
    let choice = null, ready = false, current = null, flow = null, generation = 0, route = null;
    const seen = new Set(), outstanding = new Map();
    let flowStarted=()=>{};
    const entries = value => {
        const result = new Map();
        const add = (receipt, at) => {
            // A bad/skewed timestamp must never make a known receipt disappear
            // from an explicit withdrawal. Capture still requires valid choice time.
            if (validSiteReceipt(receipt)) {
                const originalAt = Number.isFinite(at) ? at : clock();
                result.set(receipt, Math.min(result.get(receipt) ?? originalAt, originalAt));
            }
        };
        add(value?.receipt, value?.at);
        for (const item of Array.isArray(value?.pendingReceipts) ? value.pendingReceipts : [])
            typeof item === 'string' ? add(item, value.at) : add(item?.receipt, item?.at);
        return [...result].map(([receipt, at]) => ({ receipt, at }));
    };
    const merge = (...lists) => {
        const result = new Map();
        // Explicit withdrawal needs server acknowledgement for every known receipt,
        // even when the browser clock has advanced beyond its apparent lifetime.
        // Passive expiry pruning applies only to decisions without pending revokes.
        for (const item of lists.flat()) result.set(item.receipt, Math.min(result.get(item.receipt) ?? item.at, item.at));
        return [...result].map(([receipt, at]) => ({ receipt, at })).sort((a,b) => a.at-b.at);
    };
    const raw = () => {
        try { const value = JSON.parse(storage?.getItem(SITE_CONSENT_KEY)); return value && typeof value === 'object' ? value : null; }
        catch { return null; }
    };
    const save = value => {
        choice = value; changed(value);
        try {
            if (!storage) return false;
            if (value === null) { storage.removeItem(SITE_CONSENT_KEY); return storage.getItem(SITE_CONSENT_KEY) == null; }
            const text = JSON.stringify(value); storage.setItem(SITE_CONSENT_KEY, text);
            return storage.getItem(SITE_CONSENT_KEY) === text;
        } catch { return false; }
    };
    const disabled = list => ({ version: SITE_CONSENT_VERSION, at: list[0]?.at ?? clock(), enabled: false,
        ...(list.length ? { receipt: list[0].receipt, pending: true, pendingReceipts: list } : {}) });
    const normalize = value => {
        if (!value) return null;
        // An unresolved withdrawal is an obligation, not a time-limited grant.
        // Preserve it across reload, storage sync and recovery until server ack,
        // regardless of local clock or the version of the original decision.
        if (value.pending === true) { const remaining = entries(value); return remaining.length ? disabled(remaining) : null; }
        if (value.version !== SITE_CONSENT_VERSION) {
            // A broader measurement contract requires fresh permission. Retain the
            // old receipt as a stopped withdrawal until the old data is confirmed gone.
            const previous=entries(value);return previous.length?disabled(previous):null;
        }
        return validSiteChoice(value, clock()) ? value : null;
    };
    const stop = () => { ++generation; ready = false; flow = null; seen.clear(); };
    const sync = () => { stop(); choice = normalize(raw()); changed(choice); };
    const exclusive = task => typeof withLock === 'function' ? withLock(task) : Promise.reject(new Error('Cross-tab lock unavailable'));
    const context = () => enabled && ready && !privacySignal() && current && flow && validSiteChoice(choice, clock())
        && choice.enabled && clock()-flow.startedAt < SITE_FLOW_MS ? { receipt: choice.receipt, ...flow } : null;
    const track = async (event, kind) => {
        const c = context(); if (!c) return false;
        const key = event + ':' + (kind || ''); if (seen.has(key)) return false;
        seen.add(key);
        try { return await send('event', { context: c, event_name: event, schema_version: 1, environment, ...(kind ? { error_class: kind } : {}) }); }
        catch { return false; }
    };
    const enter = (pathname, search = '') => {
        route = { pathname, search }; current = sitePage(pathname);
        if (!current) { flow = null; seen.clear(); return; }
        if (!context()) {
            flow = null;
            if (enabled && ready && choice?.enabled && validSiteChoice(choice, clock()) && !privacySignal()) {
                flow = { flow: uuid(), code: siteCode(search,current), entry: current, startedAt: Math.floor(clock()/60000)*60000 }; seen.clear();
                try { flowStarted(current); } catch { /* optional activity never blocks consent */ }
            }
        }
        void track('landing_view'); if (['p_offer','p_booking'].includes(current)) void track('offer_view');
    };
    const revoke = async receipt => {
        try { return await send('revoke', { receipt, schema_version: 1, environment }); }
        catch { return false; }
    };
    const localOutstanding = () => [...outstanding].map(([receipt,at]) => ({receipt,at}));
    // Caller holds the cross-tab lock. Never discard an unconfirmed receipt.
    const withdrawLocked = async initial => {
        let remaining = merge(initial, entries(choice), entries(raw()), localOutstanding());
        let persisted = save(disabled(remaining));
        for (const item of [...remaining]) {
            if (await revoke(item.receipt)) {
                outstanding.delete(item.receipt); remaining = remaining.filter(value => value.receipt !== item.receipt);
                persisted = save(disabled(remaining)) && persisted;
            }
        }
        if (!remaining.length) persisted = save(disabled([])) && persisted;
        return !remaining.length && persisted;
    };
    const grantBody = value => ({ version: value.version, at: value.at, enabled: true,
        receipt: value.receipt, schema_version: 1, environment });
    const choose = async (accept, pathname, search = '') => {
        const initial = entries(choice); stop(); const turn = generation; enter(pathname, search);
        try { return await exclusive(async () => {
            choice = normalize(raw()) || choice;
            if (!await withdrawLocked(initial)) return false;
            if (!accept) return true;
            if (turn !== generation || !enabled || privacySignal()) return false;
            const next = { version: SITE_CONSENT_VERSION, at: clock(), enabled: true, receipt: random() };
            outstanding.set(next.receipt, next.at);
            if (!save(disabled([{receipt:next.receipt,at:next.at}]))) return false;
            let accepted = false;
            try { accepted = await send('consent', grantBody(next)); } catch { /* uncertain grant must be withdrawn */ }
            if (!accepted || turn !== generation || privacySignal()) {
                await withdrawLocked([{receipt:next.receipt,at:next.at}]); return false;
            }
            if (!save(next)) { await withdrawLocked([{receipt:next.receipt,at:next.at}]); return false; }
            outstanding.delete(next.receipt); ready = true; enter(route.pathname, route.search); return true;
        }); } catch {
            ready = false; flow = null; choice = normalize(raw()) || choice; changed(choice); return false;
        }
    };
    const recover = async () => {
        try { return await exclusive(async () => {
            const stored = raw(), normalized = normalize(stored);
            if (stored && !normalized) {
                stop(); const removed = save(null);
                // Expiry cleanup is not a claim of confirmed server withdrawal.
                return removed && entries(stored).length === 0;
            }
            if (normalized?.pending) {
                stop(); choice = normalized; changed(choice);
                return withdrawLocked(entries(normalized));
            }
            return true;
        }); } catch { return false; }
    };
    const restore = async (pathname, search = '') => {
        stop(); const turn = generation; enter(pathname, search);
        choice = normalize(raw()); changed(choice);
        if (!choice) return recover();
        if (choice.pending || privacySignal() || !enabled) return choose(false, pathname, search);
        if (!choice.enabled) return true;
        try { return await exclusive(async () => {
            const shared = normalize(raw()); choice = shared; changed(choice);
            if (!shared || shared.pending || !shared.enabled || turn !== generation) return false;
            let accepted = false;
            try { accepted = await send('consent', grantBody(shared)); } catch { /* remain stopped */ }
            if (!accepted) { await withdrawLocked(entries(shared)); return false; }
            if (turn !== generation || privacySignal()) return false;
            ready = true; enter(route.pathname, route.search); return true;
        }); } catch { return false; }
    };
    const activity = async (state, expected) => {
        const c=context();if(!c || c.receipt!==expected?.receipt || c.flow!==expected?.flow)return false;
        try{return await send('activity',{context:c,state,schema_version:1,environment});}catch{return false;}
    };
    return { context, track, activity, enter, choose, restore, recover, sync, stop,
        onFlowStart:handler=>{flowStarted=typeof handler==='function'?handler:()=>{};},
        snapshot: () => ({ enabled, ready, choice, hasFlow: Boolean(flow) }) };
}
