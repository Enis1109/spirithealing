import { useEffect, useRef, useState } from 'react';
import { CONSENT_KEY, CONSENT_VERSION, clearMetaCookies, loadConsent, measuredCheckoutUrl,
  readBerlinAttribution, revokeMeta } from './berlinMeasurement.js';
import { META_CONSENT_VERSION, META_MAX_AGE, validMetaConsent, metaPageAllowed, startRestrictedPixel } from './berlinMeta.js';

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
  // Settings are only opened explicitly in the footer, never over the landing page.
  const [open, setOpen] = useState(false);
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
