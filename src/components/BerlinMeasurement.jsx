import { useEffect, useState } from 'react';
import { CONSENT_KEY, CONSENT_VERSION, clearMetaCookies, loadConsent, measuredCheckoutUrl, pixelPermitted,
  readBerlinAttribution, revokeMeta, startMetaPageView } from '../lib/berlinMeasurement.js';

const send = async (path, body) => {
  const response = await fetch(`/api/berlin/measurement/${path}`, { method: 'POST', keepalive: true,
    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(8000) });
  if (!response.ok || (await response.json()).ok !== true) throw new Error('Measurement unavailable');
};

export function useBerlinMeasurement(search) {
  const enabled = import.meta.env.VITE_BERLIN_MEASUREMENT_ENABLED === 'true';
  const [consent, setConsent] = useState(() => {
    try { return enabled ? loadConsent(window.localStorage) : null; } catch { return null; }
  });
  const [open, setOpen] = useState(enabled && (!consent || (!consent.analytics && consent.receipt)));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [sessionId] = useState(() => crypto.randomUUID());
  const attribution = readBerlinAttribution(search);
  const pixelId = import.meta.env.VITE_META_PIXEL_ID || '';
  const metaAvailable = import.meta.env.VITE_META_PIXEL_ENABLED === 'true'
    && import.meta.env.VITE_META_POLICY_APPROVED === 'true' && /^[0-9]{5,30}$/.test(pixelId);

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
    if (pixelPermitted({ enabled: metaAvailable, policyApproved: metaAvailable, pixelId, consent,
      pathname: window.location.pathname, search, hash: window.location.hash })) {
      startMetaPageView({ win: window, doc: document, pixelId });
    }
    return () => revokeMeta(window);
  }, [metaAvailable, pixelId, consent, search]);

  const save = next => {
    try { window.localStorage.setItem(CONSENT_KEY, JSON.stringify(next)); } catch { /* choice still applies to this document */ }
    setConsent(next);
  };
  useEffect(() => {
    const sync = event => { if (event.key === CONSENT_KEY) {
      const next = loadConsent(window.localStorage);
      setConsent(next);
      if (!next?.meta) revokeMeta(window);
    } };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  const choose = async (analytics, meta) => {
    if (busy) return;
    setBusy(true); setMessage('');
    const denied = { version: CONSENT_VERSION, at: Date.now(), analytics: false, meta: false,
      ...(consent?.receipt ? { receipt: consent.receipt } : {}) };
    save(denied); // Stop measurement immediately, even if the server is unavailable.
    revokeMeta(window); clearMetaCookies(document, window.location.hostname);
    try {
      if (denied.receipt) await send('revoke', { receipt: denied.receipt });
      const next = { version: CONSENT_VERSION, at: Date.now(), analytics, meta: metaAvailable && meta };
      if (analytics) {
        next.receipt = [...crypto.getRandomValues(new Uint8Array(32))].map(x => x.toString(16).padStart(2, '0')).join('');
        await send('consent', { consent: next, attribution });
      }
      save(next); setOpen(false);
      if (window.fbq && !next.meta) window.location.reload();
    } catch {
      setOpen(true);
      setMessage(denied.receipt
        ? 'Die Messung im Browser ist gestoppt. Der Widerruf auf dem Server wurde noch nicht bestätigt. Bitte erneut „Ohne Messung fortfahren“ wählen oder info@spirit-healing.tr kontaktieren. Buchen ist weiterhin möglich.'
        : 'Die Werbemessung konnte nicht eingeschaltet werden. Du kannst ohne Messung buchen.');
    } finally { setBusy(false); }
  };
  return { enabled, consent, open, setOpen, choose, metaAvailable, busy, message,
    checkout: offer => measuredCheckoutUrl(offer, attribution, enabled ? consent : null),
    click: offer => record('checkout_click', offer) };
}

export function BerlinMeasurementSettings({ state }) {
  if (!state.enabled) return null;
  return <>
    <button type="button" onClick={() => state.setOpen(true)} className="underline">Mess-Einstellungen</button>
    {state.open && <section aria-label="Mess-Einstellungen" className="fixed bottom-0 left-0 right-0 z-[100] border-t border-[#c69543] bg-white p-5 text-[#173c39] shadow-xl">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-xl font-bold">Du entscheidest über die Werbemessung</h2>
        <p className="mt-2">Mit deiner Erlaubnis zählen wir Besuche und Buchungsklicks und ordnen Käufe einer Anzeige zu. Dafür übergeben wir eine zufällige Kennung an Stripe und speichern zusätzlich Angebot, Betrag, Zahlungsstatus und technische Zahlungskennungen. Namen, Kontaktdaten, Gesprächsinhalte und persönliche Anliegen übernehmen wir nicht in diese Auswertung. Ohne Zustimmung kannst du genauso buchen.</p>
        {state.metaAvailable && <p className="mt-2">Mit „Auch Meta erlauben“ erhält Meta Platforms Ireland zusätzlich den Seitenaufruf und technische Browserdaten. Meta kann diese deinem Facebook- oder Instagram-Konto zuordnen; eine Verarbeitung in den USA ist möglich.</p>}
        <p className="mt-2">Deine Auswahl gilt 90 Tage und kann hier jederzeit geändert werden. <a className="underline" href="/datenschutz#berlin-messung">Datenschutz und Einzelheiten</a> · <a className="underline" href="/impressum">Impressum</a></p>
        {state.message && <p role="status" className="mt-3">{state.message}</p>}
        <fieldset disabled={state.busy} className="mt-4 flex flex-wrap gap-3 disabled:opacity-60">
          <button type="button" className="rounded border border-[#0f7d79] px-4 py-3" onClick={() => state.choose(false, false)}>Ohne Messung fortfahren</button>
          <button type="button" className="rounded border border-[#0f7d79] px-4 py-3" onClick={() => state.choose(true, false)}>Nur eigene Messung erlauben</button>
          {state.metaAvailable && <button type="button" className="rounded border border-[#0f7d79] px-4 py-3" onClick={() => state.choose(true, true)}>Auch Meta erlauben</button>}
        </fieldset>
      </div>
    </section>}
  </>;
}
