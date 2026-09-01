import { useEffect, useMemo, useState } from "react"
import { CalendarDays, CheckCircle2, Clock3, Mail, PlayCircle } from "lucide-react"
import { Link } from "react-router-dom"
import { submitForm } from "@/lib/submissions"

const groupSlots = (slots) => slots.reduce((groups, slot) => {
  const group = groups.find((entry) => entry.dateLabel === slot.dateLabel)
  if (group) group.slots.push(slot)
  else groups.push({ dateLabel: slot.dateLabel, slots: [slot] })
  return groups
}, [])

const errorText = (error) => {
  if (error.code === "slot_unavailable") return "Dieser Termin ist gerade nicht mehr verfügbar. Bitte wähle einen neuen Termin."
  if (error.code === "email_delivery") return "Der Termin wurde gespeichert, aber die Bestätigungs-E-Mail konnte nicht versendet werden. Bitte versuche es erneut."
  if (error.field === "privacyConsent") return "Bitte bestätige den Datenschutzhinweis."
  if (error.field === "email") return "Bitte prüfe deine E-Mail-Adresse."
  if (error.code === "rate_limit") return "Bitte warte einen Moment und versuche es dann erneut."
  return "Die Anmeldung konnte gerade nicht abgeschlossen werden. Bitte versuche es noch einmal."
}

export const WebinarRegistration = () => {
  const [slotResponse, setSlotResponse] = useState({ loading: true, slots: [], timeZone: "Europe/Berlin" })
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [submitState, setSubmitState] = useState("idle")
  const [registration, setRegistration] = useState(null)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const previousTitle = document.title
    document.title = "Online-Vortrag zum 13-Wochen-Programm | Spirit Healing"
    fetch("/api/webinar/slots", { headers: { Accept: "application/json" } })
      .then(async (response) => {
        const result = await response.json()
        if (!response.ok || !result.ok) throw new Error("slots")
        setSlotResponse({ loading: false, slots: result.slots, timeZone: result.timeZone })
        setSelectedSlot(result.slots[0] || null)
        setSelectedDate(result.slots[0]?.dateLabel || "")
      })
      .catch(() => setSlotResponse({ loading: false, error: true, slots: [], timeZone: "Europe/Berlin" }))
    return () => { document.title = previousTitle }
  }, [])

  const slotGroups = useMemo(() => groupSlots(slotResponse.slots), [slotResponse.slots])
  const selectedGroup = useMemo(
    () => slotGroups.find((group) => group.dateLabel === selectedDate) || slotGroups[0] || null,
    [selectedDate, slotGroups],
  )

  const handleDateChange = (event) => {
    const dateLabel = event.target.value
    const group = slotGroups.find((entry) => entry.dateLabel === dateLabel)
    setSelectedDate(dateLabel)
    setSelectedSlot(group?.slots[0] || null)
  }

  const handleTimeChange = (event) => {
    setSelectedSlot(selectedGroup?.slots.find((slot) => slot.id === event.target.value) || null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!selectedSlot) {
      setMessage("Bitte wähle zuerst einen Termin.")
      return
    }

    setSubmitState("submitting")
    setMessage("")
    const form = event.currentTarget
    const values = new FormData(form)

    try {
      const result = await submitForm("/api/webinar/register", {
        name: values.get("name"),
        email: values.get("email"),
        slotId: selectedSlot.id,
        privacyConsent: values.get("privacy") === "on",
        newsletterConsent: values.get("newsletter") === "on",
        company: values.get("company"),
        locale: "de",
      })
      setRegistration(result)
      setSubmitState("success")
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (error) {
      setSubmitState("error")
      setMessage(errorText(error))
    }
  }

  if (submitState === "success" && registration) {
    return (
      <main className="min-h-screen bg-[#e7f1ee] px-5 py-10 text-[#173c39] sm:py-16">
        <section className="mx-auto max-w-2xl rounded-[2rem] bg-[#fffaf2] p-7 text-center shadow-[0_24px_80px_rgba(4,72,70,.18)] sm:p-12">
          <img src="/Logo.svg" alt="Spirit Healing" className="mx-auto h-16 w-auto" />
          <CheckCircle2 className="mx-auto mt-8 h-14 w-14 text-[#0f7d79]" aria-hidden="true" />
          <h1 className="mt-5 font-serif text-4xl font-semibold">Dein Termin ist reserviert.</h1>
          <p className="mt-5 text-lg leading-8 text-[#506864]">Die Bestätigung mit deinem persönlichen Zugangslink ist per E-Mail unterwegs.</p>
          {registration.newsletterStatus === "pending" && (
            <p className="mt-4 rounded-2xl bg-[#e8f2ef] px-5 py-4 text-sm leading-6 text-[#315652]">Bitte bestätige zusätzlich die zweite E-Mail, wenn du weitere Informationen zum 13-Wochen-Programm erhalten möchtest.</p>
          )}
          <div className="mt-7 rounded-2xl border border-[#dbc36d] bg-[#f8f0d6] px-5 py-5 text-lg font-bold text-[#075f62]">
            {registration.slot.label}
          </div>
          <a href={registration.watchUrl} className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#d4af37] px-7 py-3 font-bold text-[#034f52] transition hover:bg-[#e0c257]">
            <PlayCircle className="h-5 w-5" aria-hidden="true" />
            Persönlichen Zugang öffnen
          </a>
          <p className="mt-5 text-sm leading-6 text-[#647b77]">Du kannst die Zugangsseite schon jetzt öffnen. Der Vortrag startet dort automatisch zu deinem gewählten Zeitpunkt.</p>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#e7f1ee] text-[#173c39]">
      <header className="relative overflow-hidden bg-[linear-gradient(140deg,#043f42,#087478)] px-5 pb-24 pt-8 text-white sm:pb-32">
        <div className="absolute -right-24 top-20 h-72 w-72 rounded-full bg-[#d4af37]/15 blur-3xl" />
        <div className="relative mx-auto max-w-5xl">
          <Link to="/13-wochen-programm" className="inline-block rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15">Spirit Healing</Link>
          <div className="mt-16 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#f0d687]">Kostenloser aufgezeichneter Online-Vortrag</p>
            <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight sm:text-6xl">Das Zepter wieder übernehmen</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">Ab Mittwoch kannst du den Vortrag flexibel ansehen. Wähle einfach den Tag und die Startzeit, die zu dir passen.</p>
          </div>
        </div>
      </header>

      <section className="relative mx-auto -mt-14 grid max-w-6xl gap-7 px-5 pb-20 lg:grid-cols-[1.15fr_.85fr] lg:items-start">
        <div className="rounded-[2rem] bg-[#fffaf2] p-6 shadow-[0_24px_80px_rgba(4,72,70,.16)] sm:p-9">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-[#e5f1ed] p-3 text-[#087478]"><CalendarDays className="h-6 w-6" aria-hidden="true" /></div>
            <div>
              <h2 className="font-serif text-3xl font-semibold">Wähle Tag und Uhrzeit</h2>
              <p className="mt-2 text-sm leading-6 text-[#617672]">Am Mittwoch ab 16:00 Uhr, danach täglich stündlich von 08:00 bis 22:00 Uhr. Alle Zeiten gelten für Deutschland.</p>
            </div>
          </div>

          {slotResponse.loading && <p className="mt-8 rounded-2xl bg-[#edf5f2] p-5">Termine werden geladen …</p>}
          {slotResponse.error && <p className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800">Die Termine konnten gerade nicht geladen werden.</p>}

          {slotGroups.length > 0 && (
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-bold text-[#2f5350]" htmlFor="webinar-date">
                Tag
                <select
                  id="webinar-date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="mt-2 min-h-14 w-full rounded-xl border border-[#b9cec7] bg-white px-4 py-3 font-semibold capitalize text-[#315652] outline-none focus:border-[#0f7d79] focus:ring-2 focus:ring-[#0f7d79]/20"
                >
                  {slotGroups.map((group) => <option key={group.dateLabel} value={group.dateLabel}>{group.dateLabel}</option>)}
                </select>
              </label>

              <label className="block text-sm font-bold text-[#2f5350]" htmlFor="webinar-time">
                Startzeit
                <select
                  id="webinar-time"
                  value={selectedSlot?.id || ""}
                  onChange={handleTimeChange}
                  className="mt-2 min-h-14 w-full rounded-xl border border-[#b9cec7] bg-white px-4 py-3 font-semibold text-[#315652] outline-none focus:border-[#0f7d79] focus:ring-2 focus:ring-[#0f7d79]/20"
                >
                  {selectedGroup?.slots.map((slot) => <option key={slot.id} value={slot.id}>{slot.timeLabel} Uhr</option>)}
                </select>
              </label>
            </div>
          )}

          {selectedSlot && (
            <div className="mt-6 flex gap-3 rounded-2xl bg-[#eef5f2] p-4 text-sm font-semibold text-[#315652]">
              <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-[#0f7d79]" aria-hidden="true" />
              <span>Deine Auswahl: {selectedSlot.label}</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="rounded-[2rem] bg-white p-6 shadow-[0_24px_80px_rgba(4,72,70,.12)] sm:p-9">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-[#f8f0d6] p-3 text-[#8b6c18]"><Mail className="h-6 w-6" aria-hidden="true" /></div>
            <div>
              <h2 className="font-serif text-3xl font-semibold">Zugang sichern</h2>
              <p className="mt-2 text-sm leading-6 text-[#617672]">Deinen persönlichen Link erhältst du direkt per E-Mail.</p>
            </div>
          </div>

          {selectedSlot && (
            <div className="mt-7 flex gap-3 rounded-2xl bg-[#eef5f2] p-4 text-sm font-semibold text-[#315652]">
              <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-[#0f7d79]" aria-hidden="true" />
              <span>{selectedSlot.label}</span>
            </div>
          )}

          <label className="mt-7 block text-sm font-bold" htmlFor="webinar-name">Vorname und Nachname</label>
          <input id="webinar-name" name="name" required autoComplete="name" maxLength="100" className="mt-2 min-h-12 w-full rounded-xl border border-[#b9cec7] px-4 py-3 outline-none focus:border-[#0f7d79] focus:ring-2 focus:ring-[#0f7d79]/20" />

          <label className="mt-5 block text-sm font-bold" htmlFor="webinar-email">E-Mail-Adresse</label>
          <input id="webinar-email" name="email" type="email" required autoComplete="email" maxLength="254" className="mt-2 min-h-12 w-full rounded-xl border border-[#b9cec7] px-4 py-3 outline-none focus:border-[#0f7d79] focus:ring-2 focus:ring-[#0f7d79]/20" />

          <div className="absolute -left-[10000px]" aria-hidden="true">
            <label htmlFor="webinar-company">Firma</label>
            <input id="webinar-company" name="company" tabIndex="-1" autoComplete="off" />
          </div>

          <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm leading-6 text-[#526b67]">
            <input type="checkbox" name="privacy" required className="mt-1 h-4 w-4 accent-[#0f7d79]" />
            <span>Ich stimme der Verarbeitung meiner Angaben zur Anmeldung und Durchführung des Online-Vortrags zu. <Link to="/datenschutz" className="font-semibold text-[#087478] underline">Datenschutz</Link></span>
          </label>

          <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-2xl bg-[#f7f2e5] p-4 text-sm leading-6 text-[#526b67]">
            <input type="checkbox" name="newsletter" className="mt-1 h-4 w-4 shrink-0 accent-[#0f7d79]" />
            <span>Ja, ich möchte nach dem Vortrag weitere Impulse und Informationen zum 13-Wochen-Programm per E-Mail erhalten. Die Anmeldung bestätige ich anschließend per E-Mail und kann mich jederzeit wieder abmelden.</span>
          </label>

          {message && <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{message}</p>}

          <button disabled={submitState === "submitting" || !selectedSlot} className="mt-7 inline-flex min-h-13 w-full items-center justify-center rounded-full bg-[#d4af37] px-6 py-3 font-bold text-[#034f52] transition hover:bg-[#e0c257] disabled:cursor-not-allowed disabled:opacity-50">
            {submitState === "submitting" ? "Termin wird reserviert …" : "Diesen Termin reservieren"}
          </button>
        </form>
      </section>
    </main>
  )
}
