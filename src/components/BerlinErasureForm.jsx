import { useState } from 'react';

export function BerlinErasureForm({ requestJson }) {
  const [paymentIntent, setPaymentIntent] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const submit = async event => {
    event.preventDefault();
    if (busy || !confirmed || !/^pi_[A-Za-z0-9]{1,250}$/.test(paymentIntent.trim())) return;
    setBusy(true); setMessage('');
    try {
      const result = await requestJson('/api/admin/berlin/measurement/erase', { method: 'POST',
        body: JSON.stringify({ paymentIntent: paymentIntent.trim(), confirmation: 'ERASE_ANALYTICS_ONLY' }) });
      setMessage(result.erased
        ? 'Werbezuordnung gelöscht. Wiederholte Zahlungsbestätigungen sind für diese Zuordnung gesperrt. Die Buchung und Zahlung bleiben unverändert.'
        : 'Keine gespeicherte Zahlungszuordnung gefunden. Ein Löschvermerk verhindert die erneute Aufnahme während seiner 90-tägigen Gültigkeit. Die Zahlung bleibt unverändert.');
      setPaymentIntent(''); setConfirmed(false);
    } catch (error) {
      setMessage(error.status === 503 ? 'Die Werbeauswertung ist noch nicht aktiviert oder vorübergehend nicht erreichbar. Es wurde keine Löschung bestätigt.'
        : 'Löschung nicht bestätigt. Bitte Anmeldung und Zahlungskennung prüfen.');
    } finally { setBusy(false); }
  };
  return <details className="my-6 rounded-2xl border border-[#0f8b8d]/25 bg-white p-5">
    <summary className="cursor-pointer font-bold">Datenschutz: Berlin-Werbezuordnung löschen</summary>
    <p className="mt-3">Nur für geprüfte Datenschutzanfragen. Hier werden ausschließlich zusätzliche Daten der Werbeauswertung gelöscht, keine Zahlung, Reservierung oder Buchhaltungsunterlage. Eine Erstattung wird nicht ausgelöst.</p>
    <form onSubmit={submit} className="mt-4 space-y-4">
      <label className="block">Stripe-Zahlungskennung (PaymentIntent, beginnt mit pi_)
        <input value={paymentIntent} onChange={event => { setPaymentIntent(event.target.value); setConfirmed(false); }}
          required maxLength={253} pattern="pi_[A-Za-z0-9]+" autoComplete="off" disabled={busy}
          className="mt-2 min-h-12 w-full rounded-xl border border-[#0f8b8d]/30 px-3" />
      </label>
      <label className="flex items-start gap-3"><input type="checkbox" checked={confirmed} disabled={busy}
        onChange={event => setConfirmed(event.target.checked)} className="mt-1" />
        <span>Ich habe die Anfrage und die zugehörige Zahlung geprüft. Die zusätzliche Werbezuordnung soll jetzt unwiderruflich gelöscht werden.</span>
      </label>
      <button type="submit" disabled={busy || !confirmed || !/^pi_[A-Za-z0-9]{1,250}$/.test(paymentIntent.trim())}
        className="rounded-full bg-[#075f62] px-5 py-3 font-bold text-white disabled:opacity-50">
        {busy ? 'Löschung wird geprüft …' : 'Nur Werbezuordnung löschen'}
      </button>
      {message && <p role="status" className="rounded-xl bg-[#eaf4f1] p-4">{message}</p>}
    </form>
  </details>;
}
