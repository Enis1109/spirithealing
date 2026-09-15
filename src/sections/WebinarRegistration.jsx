import { useEffect, useState } from "react"
import { CheckCircle2, Clock3, Mail, PlayCircle } from "lucide-react"
import { Link } from "react-router-dom"
import { submitForm } from "@/lib/submissions"

const errorText = (error) => {
  if (error.field === "privacyConsent") return "Bitte bestätige den Datenschutzhinweis."
  if (error.field === "email") return "Bitte prüfe deine E-Mail-Adresse."
  if (error.code === "rate_limit") return "Bitte warte einen Moment und versuche es dann erneut."
  return "Der Zugang konnte gerade nicht erstellt werden. Bitte versuche es noch einmal."
}
const formatExpiry = (value) => new Intl.DateTimeFormat("de-DE", {
  timeZone: "Europe/Berlin", dateStyle: "full", timeStyle: "short",
}).format(new Date(value))

export const WebinarRegistration = () => {
  const [availability, setAvailability] = useState({ loading: true, ready: false })
  const [submitState, setSubmitState] = useState("idle")
  const [registration, setRegistration] = useState(null)
  const [message, setMessage] = useState("")
  useEffect(() => {
    const previousTitle = document.title
    document.title = "Wer schreibt dein inneres Drehbuch? | Kostenloser Vortrag | Spirit Healing"
    const controller = new AbortController()
    fetch("/api/webinar/slots", { headers: { Accept: "application/json" }, signal: controller.signal })
      .then(async (response) => {
        const result = await response.json()
        if (!response.ok || !result.ok || result.accessMode !== "on-demand" || result.accessDays !== 7) throw new Error("availability")
        setAvailability({ loading: false, ready: true })
      })
      .catch((error) => {
        if (error.name !== "AbortError") setAvailability({ loading: false, ready: false })
      })
    return () => { controller.abort(); document.title = previousTitle }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!availability.ready || submitState === "submitting") return
    setSubmitState("submitting")
    setMessage("")
    const values = new FormData(event.currentTarget)
    try {
      const result = await submitForm("/api/webinar/register", {
        name: values.get("name"), email: values.get("email"), slotId: "on-demand",
        privacyConsent: values.get("privacy") === "on", newsletterConsent: values.get("newsletter") === "on",
        company: values.get("company"), locale: "de",
      })
      setRegistration(result)
      setSubmitState("success")
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (error) {
      setSubmitState("error")
      setMessage(errorText(error))
    }
  }

  if (submitState === "success" && registration) return (
    <main className="min-h-screen bg-[#e7f1ee] px-5 py-10 text-[#173c39] sm:py-16">
      <section className="mx-auto max-w-2xl rounded-[2rem] bg-[#fffaf2] p-7 text-center shadow-[0_24px_80px_rgba(4,72,70,.18)] sm:p-12">
        <img src="/Logo.svg" alt="Spirit Healing" className="mx-auto h-16 w-auto" />
        <CheckCircle2 className="mx-auto mt-8 h-14 w-14 text-[#0f7d79]" aria-hidden="true" />
        <h1 className="mt-5 font-serif text-4xl font-semibold">Dein Vortrag ist freigeschaltet.</h1>
        <p className="mt-5 text-lg leading-8 text-[#506864]">Du kannst sofort starten. Dein persönlicher Zugang gilt sieben Tage ab deiner Anmeldung.</p>
        {registration.confirmationStatus === "failed" ? (
          <p role="status" className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-900">Die E-Mail konnte gerade nicht versendet werden. Dein Zugang funktioniert trotzdem: Öffne den Vortrag und speichere den persönlichen Link, damit du ihn später wiederfindest.</p>
        ) : <p className="mt-4 text-sm leading-6 text-[#506864]">Den persönlichen Link erhältst du zusätzlich per E-Mail.</p>}
        {registration.newsletterStatus === "pending" && <p className="mt-4 rounded-2xl bg-[#e8f2ef] px-5 py-4 text-sm leading-6 text-[#315652]">Für weitere Impulse und Informationen bestätige bitte die separate Newsletter-E-Mail. Dein Vortragszugang ist davon unabhängig.</p>}
        <a href={registration.watchUrl} className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#d4af37] px-7 py-3 font-bold text-[#034f52] hover:bg-[#e0c257]"><PlayCircle className="h-5 w-5" aria-hidden="true" />Vortrag jetzt ansehen</a>
        <p className="mt-5 text-sm leading-6 text-[#647b77]">Zugang bis {formatExpiry(registration.closesAt)} Uhr (deutsche Zeit). Du kannst den Vortrag während dieser Zeit erneut öffnen.</p>
      </section>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#e7f1ee] text-[#173c39]">
      <header className="relative overflow-hidden bg-[linear-gradient(140deg,#043f42,#087478)] px-5 pb-24 pt-8 text-white sm:pb-32">
        <div className="relative mx-auto max-w-5xl">
          <Link to="/13-wochen-programm" className="inline-block rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15">Spirit Healing</Link>
          <div className="mt-16 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#f0d687]">Kostenloser aufgezeichneter Online-Vortrag</p>
            <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight sm:text-6xl">Wer schreibt dein inneres Drehbuch?</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">Erfahre, wie deine persönliche Matrix entsteht, warum sich bestimmte Rollen und Muster wiederholen und wie du das Zepter wieder in die eigene Hand nehmen kannst.</p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/80">Mit Sabine und Selcan von Spirit Healing. Nach deiner Anmeldung kannst du sofort starten und den Vortrag sieben Tage lang ansehen.</p>
            <p className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#f0d687]"><Clock3 className="h-5 w-5" aria-hidden="true" />Etwa 36 Minuten · auf Deutsch · keine Terminwahl</p>
            <div className="mt-7"><a href="#zugang" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#d4af37] px-7 py-3 font-bold text-[#034f52] hover:bg-[#e0c257]">Kostenlosen Zugang anfordern</a></div>
          </div>
        </div>
      </header>
      <section className="relative mx-auto -mt-14 grid max-w-6xl gap-7 px-5 pb-20 lg:grid-cols-[1.05fr_.95fr] lg:items-start">
        <div className="rounded-[2rem] bg-[#fffaf2] p-6 shadow-[0_24px_80px_rgba(4,72,70,.16)] sm:p-9">
          <h2 className="font-serif text-3xl font-semibold">Darum geht es im Vortrag</h2>
          <ul className="mt-6 space-y-5 text-base leading-7 text-[#506864]">
            <li>Was wir mit deiner persönlichen Matrix und deinem inneren Drehbuch meinen.</li>
            <li>Wie Deutungen und Rollen wiederkehrende Situationen im Alltag beeinflussen.</li>
            <li>Wie wir euch im 13-Wochen-Programm begleiten und die Rauhnächte einbeziehen.</li>
          </ul>
          <p className="mt-7 border-t border-[#d8e5df] pt-6 text-sm leading-6 text-[#506864]">Es handelt sich um eine Aufzeichnung, nicht um einen Live-Termin. Du kannst das Video pausieren und über deinen persönlichen Link innerhalb von sieben Tagen erneut öffnen. Die Teilnahme ist kostenlos; eine Newsletter-Anmeldung ist nicht erforderlich.</p>
        </div>
        <form id="zugang" onSubmit={handleSubmit} className="scroll-mt-6 rounded-[2rem] bg-white p-6 shadow-[0_24px_80px_rgba(4,72,70,.12)] sm:p-9">
          <div className="flex items-start gap-4"><Mail className="mt-1 h-6 w-6 shrink-0 text-[#8b6c18]" aria-hidden="true" /><div><h2 className="font-serif text-3xl font-semibold">Vortrag freischalten</h2><p className="mt-2 text-sm leading-6 text-[#617672]">Dein persönlicher Zugang erscheint direkt nach der Anmeldung und kommt zusätzlich per E-Mail.</p></div></div>
          <label className="mt-7 block text-sm font-bold" htmlFor="webinar-name">Vorname und Nachname</label>
          <input id="webinar-name" name="name" required autoComplete="name" maxLength="100" className="mt-2 min-h-12 w-full rounded-xl border border-[#b9cec7] px-4 py-3 outline-none focus:ring-2 focus:ring-[#0f7d79]/20" />
          <label className="mt-5 block text-sm font-bold" htmlFor="webinar-email">E-Mail-Adresse</label>
          <input id="webinar-email" name="email" type="email" required autoComplete="email" maxLength="254" className="mt-2 min-h-12 w-full rounded-xl border border-[#b9cec7] px-4 py-3 outline-none focus:ring-2 focus:ring-[#0f7d79]/20" />
          <div className="absolute -left-[10000px]" aria-hidden="true"><label htmlFor="webinar-company">Firma</label><input id="webinar-company" name="company" tabIndex="-1" autoComplete="off" /></div>
          <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm leading-6 text-[#526b67]"><input type="checkbox" name="privacy" required className="mt-1 h-4 w-4 shrink-0 accent-[#0f7d79]" /><span>Ich stimme der Verarbeitung meiner Angaben zur Anmeldung und Bereitstellung des Online-Vortrags zu. <Link to="/datenschutz" className="font-semibold text-[#087478] underline">Datenschutz</Link></span></label>
          <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-2xl bg-[#f7f2e5] p-4 text-sm leading-6 text-[#526b67]"><input type="checkbox" name="newsletter" className="mt-1 h-4 w-4 shrink-0 accent-[#0f7d79]" /><span>Ja, ich möchte nach dem Vortrag weitere Impulse und Informationen zum 13-Wochen-Programm per E-Mail erhalten. Die Anmeldung bestätige ich anschließend per E-Mail und kann mich jederzeit wieder abmelden.</span></label>
          {message && <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{message}</p>}
          {!availability.loading && !availability.ready && <p role="alert" className="mt-5 text-sm text-red-800">Der Zugang kann gerade nicht angefordert werden. Bitte lade die Seite erneut oder versuche es später.</p>}
          <button disabled={submitState === "submitting" || !availability.ready} className="mt-7 inline-flex min-h-13 w-full items-center justify-center rounded-full bg-[#d4af37] px-6 py-3 font-bold text-[#034f52] hover:bg-[#e0c257] disabled:cursor-not-allowed disabled:opacity-50">{submitState === "submitting" ? "Zugang wird erstellt …" : availability.loading ? "Zugang wird vorbereitet …" : "Kostenlos freischalten"}</button>
        </form>
      </section>
    </main>
  )
}
