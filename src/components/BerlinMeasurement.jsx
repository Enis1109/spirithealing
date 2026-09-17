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
        ? 'Die Messung im Browser ist gestoppt. Eine Serverbestätigung steht noch aus. Bitte erneut „Ohne Messung fortfahren“ wählen, um offene Einwilligungen zu widerrufen, oder info@spirit-healing.tr kontaktieren. Buchen ist weiterhin möglich.'
        : 'Die Werbemessung konnte nicht eingeschaltet werden. Du kannst ohne Messung buchen.');
    } finally { setBusy(false); }
  };
  return { enabled, consent, open, setOpen, choose, metaAvailable, busy, message, metaDelivery,
    checkout: offer => measuredCheckoutUrl(offer, attribution, enabled ? consent : null),
    click: offer => record('checkout_click', offer) };
}

export function BerlinMeasurementSettings({ state }) {
  if (!state.enabled) return null;
  return <>
    <button type="button" onClick={() => state.setOpen(true)} className="underline">Mess-Einstellungen</button>
    {state.open && <section aria-label="Mess-Einstellungen" className="fixed bottom-0 left-0 right-0 z-[100] max-h-[85dvh] overflow-y-auto border-t border-[#c69543] bg-white p-5 text-[#173c39] shadow-xl">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-xl font-bold">Du entscheidest über die Werbemessung</h2>
        <p className="mt-2">Mit deiner Erlaubnis zählen wir Besuche und Buchungsklicks und ordnen Käufe einer Anzeige zu. Dafür übergeben wir eine zufällige Kennung an Stripe und speichern zusätzlich Angebot, Betrag, Zahlungsstatus und technische Zahlungskennungen. Namen, Kontaktdaten, Gesprächsinhalte und persönliche Anliegen übernehmen wir nicht in diese Auswertung. Ohne Zustimmung kannst du genauso buchen.</p>
        {state.metaAvailable && <p className="mt-2">Optional erlaubst du Meta Platforms Ireland die Messung von Seitenaufrufen über Meta-Pixel und Conversions API. Dabei gehen Seitenadresse, Zeitpunkt, IP-Adresse, Browserangaben und eine zufällige Ereigniskennung an Meta; der Pixel kann Cookies setzen und technische Kennungen übermitteln. Meta kann den Besuch deinem Facebook- oder Instagram-Konto zuordnen und zur Werbemessung und Anzeigenoptimierung verwenden. Eine Verarbeitung in den USA ist möglich. Wir senden keine Buchungen, Zahlungsdaten, Kontaktdaten oder persönlichen Anliegen. Diese Erlaubnis ist von unserer eigenen Auswertung getrennt. <a className="underline" href="/datenschutz#berlin-meta">Einzelheiten zu Meta</a></p>}
        <p className="mt-2">Deine Auswahl gilt 90 Tage und kann hier jederzeit geändert werden. <a className="underline" href="/datenschutz#berlin-messung">Datenschutz und Einzelheiten</a> · <a className="underline" href="/impressum">Impressum</a></p>
        {state.message && <p role="status" className="mt-3">{state.message}</p>}
        {state.metaDelivery && <p role="status" className="mt-3">{state.metaDelivery}</p>}
        <fieldset disabled={state.busy} className="mt-4 flex flex-wrap gap-3 disabled:opacity-60">
          <button type="button" className="rounded border border-[#0f7d79] px-4 py-3" onClick={() => state.choose(false, false)}>Ohne Messung fortfahren</button>
          <button type="button" className="rounded border border-[#0f7d79] px-4 py-3" onClick={() => state.choose(true, false)}>Nur eigene Messung erlauben</button>
          {state.metaAvailable && <button type="button" className="rounded border border-[#0f7d79] px-4 py-3" onClick={() => state.choose(false, true)}>Nur Meta-Seitenaufrufe erlauben</button>}
          {state.metaAvailable && <button type="button" className="rounded border border-[#0f7d79] px-4 py-3" onClick={() => state.choose(true, true)}>Beide Messungen erlauben</button>}
        </fieldset>
      </div>
    </section>}
  </>;
}
