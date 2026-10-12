import { useState } from 'react';
import { CONSENT_KEY, clearMetaCookies, loadConsent, revokeMeta } from '../lib/berlinMeasurement.js';

async function revokeReceipt(path, receipt) {
  const response = await fetch(`/api/berlin/${path}/revoke`, {
    method: 'POST',
    keepalive: true,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ receipt }),
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok || (await response.json()).ok !== true) throw new Error('Revoke unavailable');
}

export function BerlinLegacyConsentRevoke() {
  const [consent, setConsent] = useState(() => {
    try { return loadConsent(window.localStorage); } catch { return null; }
  });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const revoke = async () => {
    if (busy || !consent) return;
    setBusy(true);
    setMessage('');
    let pending = { ...consent, analytics: false, meta: false };
    try { window.localStorage.setItem(CONSENT_KEY, JSON.stringify(pending)); } catch { /* browser-level revocation still applies */ }
    revokeMeta(window);
    clearMetaCookies(document, window.location.hostname);
    try {
      if (pending.metaReceipt) {
        await revokeReceipt('meta', pending.metaReceipt);
        pending = { ...pending };
        delete pending.metaReceipt;
        window.localStorage.setItem(CONSENT_KEY, JSON.stringify(pending));
      }
      if (pending.receipt) {
        await revokeReceipt('measurement', pending.receipt);
        pending = { ...pending };
        delete pending.receipt;
        window.localStorage.setItem(CONSENT_KEY, JSON.stringify(pending));
      }
      setConsent(null);
      setMessage('Die frühere Werbeeinwilligung wurde widerrufen.');
    } catch {
      setConsent(pending);
      setMessage('Die Messung im Browser ist gestoppt. Die Bestätigung vom Server steht noch aus. Bitte erneut versuchen oder info@spirit-healing.tr kontaktieren.');
    } finally {
      setBusy(false);
    }
  };

  if (!consent?.receipt && !consent?.metaReceipt && !message) return null;
  return <div>
    {(consent?.receipt || consent?.metaReceipt) && <button type="button" disabled={busy} onClick={revoke} className="underline disabled:opacity-60">Frühere Werbeeinwilligung widerrufen</button>}
    {message && <p role="status" className="mt-2 text-sm">{message}</p>}
  </div>;
}
