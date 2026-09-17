import { useEffect, useRef, useState } from 'react';
import { CONSENT_KEY, CONSENT_VERSION, clearMetaCookies, loadConsent, measuredCheckoutUrl,
  readBerlinAttribution, revokeMeta } from '../lib/berlinMeasurement.js';
import { META_CONSENT_VERSION, META_MAX_AGE, validMetaConsent, metaPageAllowed, startRestrictedPixel } from '../lib/berlinMeta.js';

const send = async (path, body) => {
  const response = await fetch(`/api/berlin/measurement/${path}`, { method: 'POST', keepalive: true,
    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(8000) });
  if (!response.ok || (await response.json()).ok !== true) throw new Error('Measurement unavailable');
};
const metaSend = async (path, body) => {
  const response = await fetch(`/api/berlin/meta/${path}`, { method: 'POST', keepalive: true,
    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(12000) });
  if (!response.ok || (await response.json()).ok !== true) throw new Error('Meta unavailable');
};
const randomReceipt = () => [...crypto.getRandomValues(new Uint8Array(32))].map(x => x.toString(16).padStart(2, '0')).join('');

export function useBerlinMeasurement(search) {
  const enabled = import.meta.env.VITE_BERLIN_MEASUREMENT_ENABLED === 'true';
  const [consent, setConsent] = useState(() => {
    try { return enabled ? loadConsent(window.localStorage) : null; } catch { return null; }
  });
  const [open, setOpen] = useState(enabled && (!consent || (!consent.analytics && consent.receipt) || (!consent.meta && consent.metaReceipt)));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [sessionId] = useState(() => crypto.randomUUID());
  const metaEventId = useRef(crypto.randomUUID());
  const [metaServerReady, setMetaServerReady] = useState(false);
  const [metaDelivery, setMetaDelivery] = useState('');
  const attribution = readBerlinAttribution(search);
  const pixelId = import.meta.env.VITE_META_PIXEL_ID || '';
  const metaAvailable = import.meta.env.VITE_META_PIXEL_ENABLED === 'true'
    && import.meta.env.VITE_META_POLICY_APPROVED === 'true' && /^[0-9]{5,30}$/.test(pixelId) && metaServerReady;

  useEffect(() => {
    let alive = true;
    if (enabled && import.meta.env.VITE_META_PIXEL_ENABLED === 'true') {
      fetch('/api/berlin/meta/status', { cache: 'no-store' }).then(r => r.ok ? r.json() : null)
        .then(data => { if (alive) setMetaServerReady(data?.enabled === true); }).catch(() => {});
    }
    return () => { alive = false; };
  }, [enabled]);

  const record = (event, offer = null) => {
    if (!enabled || !consent?.analytics || !consent.receipt) return;
    fetch('/api/berlin/measurement/events', { method: 'POST', keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, offer, sessionId, attribution, consent }) }).catch(() => {});
  };
  useEffect(() => {
    if (!enabled || !consent?.analytics || !consent.receipt) return;
    fetch('/api/berlin/measurement/events', { method: 'POST', keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'landing_view', sessionId, attribution: readBerlinAttribution(search), consent }) }).catch(() => {});
  }, [enabled, consent, sessionId, search]);
  useEffect(() => {
    let alive = true;
    let timer;
    if (metaAvailable && validMetaConsent(consent) && metaPageAllowed(window.location, document.referrer)) {
      metaSend('pageview', { receipt: consent.metaReceipt, eventId: metaEventId.current }).then(() => {
        if (!alive || !validMetaConsent(consent) || !metaPageAllowed(window.location, document.referrer)) return;
        const started = startRestrictedPixel({ win: window, doc: document, pixelId, eventId: metaEventId.current });
        setMetaDelivery(started ? 'Meta: Server-Seitenaufruf bestätigt; Browser-Pixel angefordert.' : 'Meta: Server-Seitenaufruf bestätigt; Browser-Pixel nicht gestartet.');
      }).catch(() => { if (alive) setMetaDelivery('Meta: Übertragung nicht bestätigt. Es werden keine Buchungsdaten übertragen.'); });
      const expire = () => {
        if (!validMetaConsent(consent)) { revokeMeta(window); clearMetaCookies(document, window.location.hostname); }
        else timer = setTimeout(expire, Math.min(2147483647, consent.at + META_MAX_AGE - Date.now()));
      };
      expire();
    }
    return () => { alive = false; clearTimeout(timer); revokeMeta(window); };
  }, [metaAvailable, pixelId, consent, search]);

  const save = next => {
    try { window.localStorage.setItem(CONSENT_KEY, JSON.stringify(next)); } catch { /* choice still applies to this document */ }
    setConsent(next);
  };
  useEffect(() => {
    const sync = event => { if (event.key === CONSENT_KEY) {
      const next = loadConsent(window.localStorage);
      setConsent(next);
      if (!validMetaConsent(next)) { revokeMeta(window); clearMetaCookies(document, window.location.hostname); }
    } };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  const choose = async (analytics, meta) => {
    if (busy) return;
    setBusy(true); setMessage(''); setMetaDelivery('');
    let pending = { version: CONSENT_VERSION, at: Date.now(), analytics: false, meta: false,
      ...(consent?.receipt ? { receipt: consent.receipt } : {}),
      ...(consent?.metaReceipt ? { metaReceipt: consent.metaReceipt } : {}) };
    save(pending); // Keep outstanding receipts until server withdrawal is acknowledged.
    revokeMeta(window); clearMetaCookies(document, window.location.hostname);
    try {
      if (pending.metaReceipt) {
        await metaSend('revoke', { receipt: pending.metaReceipt });
        pending = { ...pending }; delete pending.metaReceipt; save(pending);
      }
      if (pending.receipt) {
        await send('revoke', { receipt: pending.receipt });
        pending = { ...pending }; delete pending.receipt; save(pending);
      }
      const next = { version: CONSENT_VERSION, at: Date.now(), analytics, meta: metaAvailable && meta };
      if (analytics) {
        next.receipt = randomReceipt();
        pending = { ...pending, receipt: next.receipt }; save(pending);
        await send('consent', { consent: next, attribution });
      }
      if (next.meta) {
        next.metaReceipt = randomReceipt(); next.metaVersion = META_CONSENT_VERSION;
        pending = { ...pending, metaReceipt: next.metaReceipt }; save(pending);
        await metaSend('consent', { consent: next });
        metaEventId.current = crypto.randomUUID();
      }
      save(next); setOpen(false);
      if (window.fbq && !next.meta) window.location.reload();
    } catch {
      setOpen(true);
      setMessage(pending.receipt || pending.metaReceipt
        ? 'Die Messung im Browser ist gestoppt. Eine Serverbestätigung steht noch aus. Bitte erneut „Nur notwendige“ wählen, um offene Einwilligungen zu widerrufen, oder info@spirit-healing.tr kontaktieren. Buchen ist weiterhin möglich.'
        : 'Die Werbemessung konnte nicht eingeschaltet werden. Du kannst ohne Messung buchen.');
    } finally { setBusy(false); }
  };
  return { enabled, consent, open, setOpen, choose, metaAvailable, busy, message, metaDelivery,
    checkout: offer => measuredCheckoutUrl(offer, attribution, enabled ? consent : null),
    click: offer => record('checkout_click', offer) };
}

export function BerlinMeasurementSettings({ state }) {
  const dialog = useRef(null);
  const [details, setDetails] = useState(false);
  const [analytics, setAnalytics] = useState(state.consent?.analytics === true);
  const [meta, setMeta] = useState(state.consent?.meta === true);
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (state.open && !element.open) element.showModal();
    else if (!state.open && element.open) element.close();
  }, [state.open, state.enabled]);
  const reopen = () => {
    setAnalytics(state.consent?.analytics === true);
    setMeta(state.consent?.meta === true);
    setDetails(false);
    state.setOpen(true);
  };
  const button = 'rounded-lg border border-[#0f7d79] bg-white px-4 py-3 text-sm font-semibold text-[#173c39] hover:bg-[#edf5f3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f7d79]';
  if (!state.enabled) return null;
  return <>
    <button type="button" onClick={reopen} className="underline">Cookie-Einstellungen</button>
    <dialog ref={dialog} aria-labelledby="berlin-cookie-title" aria-describedby="berlin-cookie-summary"
      onCancel={event => { if (state.busy) event.preventDefault(); else state.setOpen(false); }}
      className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl border border-[#c69543]/40 bg-white p-5 text-left text-[#173c39] shadow-2xl backdrop:bg-black/45 sm:p-7">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#0f7d79]">Spirit Healing</p>
        <h2 id="berlin-cookie-title" className="mt-2 text-2xl font-bold">{details ? 'Cookie-Einstellungen' : 'Cookies & Datenschutz'}</h2>
        <p id="berlin-cookie-summary" className="mt-3 text-sm leading-relaxed">Wir speichern deine Cookie-Auswahl. Mit deiner Zustimmung verwenden wir zusätzlich Cookies und ähnliche Technologien, um Besuche und Buchungen unseren Anzeigen zuzuordnen.{state.metaAvailable && ' Über Meta-Pixel und Conversions API teilen wir Seitenaufrufe mit Meta zur Werbemessung und Anzeigenoptimierung. Meta kann sie deinem Facebook- oder Instagram-Konto zuordnen; eine Verarbeitung in den USA ist möglich.'} Ohne Zustimmung kannst du die Seite nutzen und buchen.</p>
        {details && <fieldset disabled={state.busy} className="mt-4 space-y-4 text-sm disabled:opacity-60">
          <legend className="sr-only">Optionale Messung auswählen</legend>
          <div className="rounded-lg border border-[#173c39]/20 p-3">
            <p className="font-semibold">Notwendige Speicherung · immer aktiv</p>
            <p className="mt-1 leading-relaxed">Speichert deine Auswahl, damit wir sie berücksichtigen können.</p>
          </div>
          <div className="rounded-lg border border-[#173c39]/20 p-3">
            <label className="flex items-center gap-3 font-semibold"><input type="checkbox" checked={analytics} onChange={event => setAnalytics(event.target.checked)} className="h-5 w-5 accent-[#0f7d79]" />Eigene Werbeauswertung</label>
            <p className="mt-2 leading-relaxed">Wir zählen Besuche und Buchungsklicks und ordnen Käufe einer Anzeige zu. Dazu übergeben wir eine zufällige Kennung an Stripe und speichern Angebot, Betrag, Zahlungsstatus und technische Zahlungskennungen. Namen, Kontaktdaten und persönliche Anliegen übernehmen wir nicht in diese Auswertung.</p>
          </div>
          {state.metaAvailable && <div className="rounded-lg border border-[#173c39]/20 p-3">
            <label className="flex items-center gap-3 font-semibold"><input type="checkbox" checked={meta} onChange={event => setMeta(event.target.checked)} className="h-5 w-5 accent-[#0f7d79]" />Meta-Werbemessung</label>
            <p className="mt-2 leading-relaxed">Meta Platforms Ireland erhält über Meta-Pixel und Conversions API Seitenadresse, Zeitpunkt, IP-Adresse, Browserangaben und eine zufällige Ereigniskennung. Der Pixel kann Cookies setzen und technische Kennungen übermitteln. Wir senden keine Buchungen, Zahlungsdaten, Kontaktdaten oder persönlichen Anliegen an Meta. Diese Auswahl ist unabhängig von unserer eigenen Auswertung. <a className="underline" href="/datenschutz#berlin-meta">Einzelheiten zu Meta</a></p>
          </div>}
        </fieldset>}
        <p className="mt-3 text-xs leading-relaxed">Deine Auswahl wird für 90 Tage gespeichert. Du kannst sie jederzeit unten auf dieser Seite unter „Cookie-Einstellungen“ ändern oder widerrufen. <a className="underline" href="/datenschutz#berlin-messung">Datenschutz</a> · <a className="underline" href="/impressum">Impressum</a></p>
        {state.message && <p role="status" className="mt-3 text-sm">{state.message}</p>}
        {details && state.metaDelivery && <p role="status" className="mt-3 text-xs">{state.metaDelivery}</p>}
        <fieldset disabled={state.busy} aria-busy={state.busy} className="mt-5 grid gap-2 sm:grid-cols-2 disabled:opacity-60">
          <button type="button" className={button} onClick={() => state.choose(true, state.metaAvailable)}>Alle akzeptieren</button>
          <button type="button" className={button} onClick={() => state.choose(false, false)}>Nur notwendige</button>
          {details
            ? <><button type="button" className={button} onClick={() => state.choose(analytics, meta)}>Auswahl speichern</button><button type="button" className={button} onClick={() => setDetails(false)}>Zurück</button></>
            : <button type="button" className={`${button} sm:col-span-2`} onClick={() => setDetails(true)}>Einstellungen</button>}
        </fieldset>
        {state.busy && <p role="status" className="mt-2 text-sm">Auswahl wird gespeichert …</p>}
      </div>
    </dialog>
  </>;
}
