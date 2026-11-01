import { useState } from 'react';

export function BerlinMeasurementSettings({ state }) {
  const [details, setDetails] = useState(false);
  const [analytics, setAnalytics] = useState(state.consent?.analytics === true);
  const [meta, setMeta] = useState(state.consent?.meta === true);
  const reopen = () => {
    setAnalytics(state.consent?.analytics === true);
    setMeta(state.consent?.meta === true);
    setDetails(false);
    state.setOpen(true);
  };
  const button = 'rounded-lg border border-[#0f7d79] bg-white px-4 py-3 text-sm font-semibold text-[#173c39] hover:bg-[#edf5f3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f7d79]';
  if (!state.enabled) return null;
  return <div>
    <button type="button" onClick={() => state.open ? state.setOpen(false) : reopen()}
      disabled={state.busy} aria-expanded={state.open} aria-controls="berlin-cookie-settings" className="underline">Cookie-Einstellungen</button>
    {state.open && <section id="berlin-cookie-settings" aria-labelledby="berlin-cookie-title" aria-describedby="berlin-cookie-summary"
      className="mt-4 max-w-xl rounded-2xl border border-[#c69543]/40 bg-white p-5 text-left text-[#173c39] sm:p-7">
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
    </section>}
  </div>;
}
