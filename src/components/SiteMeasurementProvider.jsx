import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SiteMeasurementContext } from '../lib/siteMeasurementContext';
import { useLanguage } from '../i18n/LanguageContext';
import { siteMeasurementCopy } from '../../shared/siteMeasurementCopy';
import { createSiteActivityClient } from '../lib/siteActivityClient';
import { createSiteMeasurementClient } from '../lib/siteMeasurementClient';
import { SITE_CONSENT_KEY, sitePage } from '../../shared/siteMeasurement';
export function SiteMeasurementProvider({ children, environment = import.meta.env.VITE_SITE_MEASUREMENT_ENVIRONMENT,
    enabled = import.meta.env.VITE_SITE_MEASUREMENT_ENABLED === 'true' }) {
    const {language}=useLanguage();const copy=siteMeasurementCopy[language==='tr'?'tr':'de'];
    const configured = enabled && ['local','staging','production'].includes(environment);
    const location = useLocation();
    const [choice, setChoice] = useState(null), [open, setOpen] = useState(false), [busy, setBusy] = useState(false), [failed, setFailed] = useState(false);
    const [client] = useState(() => createSiteMeasurementClient({ enabled: configured, environment: environment || 'production', changed: value => {
        setChoice(value); setFailed(value?.pending === true);
        if (value?.pending) setOpen(true);
    },
        get storage() { try { return window.localStorage; } catch { return null; } },
        random: () => [...crypto.getRandomValues(new Uint8Array(32))].map(x => x.toString(16).padStart(2,'0')).join(''),
        uuid: () => crypto.randomUUID(), privacySignal: () => navigator.globalPrivacyControl === true || navigator.doNotTrack === '1',
        withLock: task => navigator.locks?.request
            ? navigator.locks.request(SITE_CONSENT_KEY, { mode: 'exclusive' }, task)
            : Promise.reject(new Error('Cross-tab lock unavailable')),
        send: async (action, body) => {
            const response = await fetch('/api/site-measurement/' + action, { method: 'POST', credentials: 'omit',
                referrerPolicy: 'no-referrer', cache: 'no-store', signal: AbortSignal.timeout(3000),
                keepalive: action==='activity', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            return response.ok && (await response.json()).ok === true;
        } }));
    const [activity]=useState(()=>createSiteActivityClient({context:()=>client.context(),page:()=>sitePage(window.location.pathname),
        visible:()=>document.visibilityState==='visible'&&document.hasFocus(),send:(state,c)=>client.activity(state,c)}));
    useEffect(() => {
        client.onFlowStart(page=>activity.start(page));
        const timer=setInterval(activity.tick,1000);
        const input=()=>activity.activity();
        const scroll=()=>{const h=document.documentElement.scrollHeight;activity.scroll(h<=innerHeight?100:100*(scrollY+innerHeight)/h);};
        const visibility=()=>{activity.tick();void activity.flush();};
        const hide=()=>{void activity.close();};
        const show=e=>{if(e.persisted){activity.reset();client.stop();void client.restore(window.location.pathname,window.location.search);}};
        for(const event of ['pointerdown','keydown','touchstart','touchmove','wheel','focus'])window.addEventListener(event,input,{passive:true});
        window.addEventListener('scroll',scroll,{passive:true});document.addEventListener('visibilitychange',visibility);
        window.addEventListener('pagehide',hide);window.addEventListener('pageshow',show);
        return ()=>{client.onFlowStart(null);clearInterval(timer);activity.reset();for(const event of ['pointerdown','keydown','touchstart','touchmove','wheel','focus'])window.removeEventListener(event,input);
            window.removeEventListener('scroll',scroll);document.removeEventListener('visibilitychange',visibility);window.removeEventListener('pagehide',hide);window.removeEventListener('pageshow',show);};
    },[activity,client]);
    useEffect(() => {
        void client.restore(window.location.pathname, window.location.search);
        const sync = event => { if (event.key === SITE_CONSENT_KEY || event.key === null) {activity.reset();client.sync();} };
        const online = () => { void client.recover(); };
        window.addEventListener('storage', sync);
        window.addEventListener('online', online);
        return () => { client.stop(); window.removeEventListener('storage', sync); window.removeEventListener('online', online); };
    }, [client, activity]);
    useEffect(() => {
        activity.navigate(sitePage(location.pathname));
        client.enter(location.pathname, location.search);
        if (client.snapshot().choice?.pending) void client.recover();
    }, [client, activity, location.pathname, location.search]);
    const choose = async accept => {
        activity.reset();
        setBusy(true); setFailed(false);
        const ok = await client.choose(accept, location.pathname, location.search);
        setBusy(false); setFailed(!ok); if (ok) setOpen(false);
    };
    const safe = Boolean(sitePage(location.pathname));
    return <SiteMeasurementContext.Provider value={client}><div onClickCapture={event => {
        if (!safe) return;
        const anchor = event.target.closest?.('a[href]');
        if (anchor) { const url = new URL(anchor.href, window.location.origin);
            if (url.origin === window.location.origin && url.pathname === '/kontakt') void client.track('cta_click'); }
    }}>{children}</div>
        {(configured || choice?.receipt) && safe && <section data-no-translate="true" aria-label={copy.title} className="border-t bg-[#fffaf2] p-5 text-[#173f40]">
            <button type="button" className="min-h-12 underline" onClick={() => setOpen(!open)} aria-expanded={open}>{copy.settings}</button>
            {(open || !choice) && <div className="max-w-3xl space-y-3">
                <p>{copy.purpose}</p><p>{copy.retention}</p><p>{copy.withdrawal} <a className="underline" href="/datenschutz#website-auswertung">{copy.details}</a></p>
                <div className="flex flex-wrap gap-3"><button type="button" disabled={busy} className="min-h-12 rounded-xl border px-4" onClick={() => choose(false)}>{copy.no}</button>
                    <button type="button" disabled={busy} className="min-h-12 rounded-xl border px-4" onClick={() => choose(true)}>{copy.yes}</button></div>
                {failed && <p role="status">{copy.error}</p>}
            </div>}
        </section>}
    </SiteMeasurementContext.Provider>;
}
