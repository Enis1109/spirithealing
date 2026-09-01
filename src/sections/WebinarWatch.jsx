import { useEffect, useMemo, useState } from "react"
import { CalendarClock, Clock3, ExternalLink, LockKeyhole, PlayCircle } from "lucide-react"
import { Link, useSearchParams } from "react-router-dom"

const formatDateTime = (value) => new Intl.DateTimeFormat("de-DE", {
  timeZone: "Europe/Berlin",
  weekday: "long",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
}).format(new Date(value))

const countdownText = (milliseconds) => {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000))
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  if (days > 0) return `${days} T. ${hours} Std. ${minutes} Min.`
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

export const WebinarWatch = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token") || ""
  const [access, setAccess] = useState({ loading: true })
  const [now, setNow] = useState(0)

  useEffect(() => {
    const previousTitle = document.title
    document.title = "Dein Online-Vortrag | Spirit Healing"
    let stopped = false
    let pollingTimer

    const load = async () => {
      try {
        const response = await fetch(`/api/webinar/access?token=${encodeURIComponent(token)}`, {
          headers: { Accept: "application/json" },
        })
        const result = await response.json()
        if (!response.ok || !result.ok) throw new Error(result.error || "access")
        if (!stopped) {
          setAccess({ ...result.access, loading: false })
          setNow(new Date(result.access.serverNow).getTime())
        }
      } catch {
        if (!stopped) setAccess({ loading: false, error: true })
      }
    }

    load()
    pollingTimer = window.setInterval(load, 30_000)
    const clockTimer = window.setInterval(() => setNow((value) => value + 1000), 1000)

    return () => {
      stopped = true
      document.title = previousTitle
      window.clearInterval(pollingTimer)
      window.clearInterval(clockTimer)
    }
  }, [token])

  const countdown = useMemo(() => {
    if (!access.opensAt) return ""
    return countdownText(new Date(access.opensAt).getTime() - now)
  }, [access.opensAt, now])

  const card = (content) => (
    <main className="min-h-screen bg-[linear-gradient(145deg,#043f42,#087478)] px-5 py-10 text-[#173c39] sm:py-16">
      <section className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] bg-[#fffaf2] shadow-[0_28px_90px_rgba(0,0,0,.25)]">
        <header className="border-b border-[#d8e5df] px-6 py-6 sm:px-10">
          <Link to="/13-wochen-programm"><img src="/Logo.svg" alt="Spirit Healing" className="h-14 w-auto" /></Link>
        </header>
        {content}
      </section>
    </main>
  )

  if (access.loading) return card(<div className="p-10 text-center text-lg">Dein Zugang wird geladen …</div>)

  if (access.error) {
    return card(
      <div className="p-8 text-center sm:p-14">
        <LockKeyhole className="mx-auto h-12 w-12 text-[#9a7c28]" aria-hidden="true" />
        <h1 className="mt-5 font-serif text-4xl font-semibold">Dieser Zugangslink ist nicht gültig.</h1>
        <p className="mx-auto mt-5 max-w-xl leading-7 text-[#58706c]">Öffne bitte den persönlichen Link aus deiner Bestätigungs-E-Mail oder wähle einen neuen Termin.</p>
        <Link to="/vortrag-13-wochen-programm" className="mt-7 inline-flex rounded-full bg-[#d4af37] px-7 py-3 font-bold text-[#034f52]">Neuen Termin wählen</Link>
      </div>,
    )
  }

  if (access.state === "scheduled") {
    return card(
      <div className="p-8 text-center sm:p-14">
        <CalendarClock className="mx-auto h-12 w-12 text-[#087478]" aria-hidden="true" />
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-[#a67426]">Dein Termin</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold">{formatDateTime(access.startsAt)} Uhr</h1>
        <p className="mt-5 text-lg text-[#58706c]">Der Vortragsraum öffnet fünf Minuten vor Beginn.</p>
        <div className="mx-auto mt-8 max-w-sm rounded-2xl bg-[#e8f2ef] p-6">
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-[#47635f]"><Clock3 className="h-5 w-5" aria-hidden="true" />Noch</div>
          <div className="mt-2 font-mono text-3xl font-bold text-[#075f62]">{countdown}</div>
        </div>
        <p className="mt-7 text-sm leading-6 text-[#687e7a]">Du kannst diese Seite geöffnet lassen. Sie schaltet den Vortrag automatisch frei.</p>
      </div>,
    )
  }

  if (access.state === "expired") {
    return card(
      <div className="p-8 text-center sm:p-14">
        <Clock3 className="mx-auto h-12 w-12 text-[#9a7c28]" aria-hidden="true" />
        <h1 className="mt-5 font-serif text-4xl font-semibold">Dein gewählter Zeitraum ist beendet.</h1>
        <p className="mx-auto mt-5 max-w-xl leading-7 text-[#58706c]">Du kannst direkt einen neuen Zeitpunkt auswählen.</p>
        <Link to="/vortrag-13-wochen-programm" className="mt-7 inline-flex rounded-full bg-[#d4af37] px-7 py-3 font-bold text-[#034f52]">Neuen Termin wählen</Link>
      </div>,
    )
  }

  return card(
    <div className="p-5 sm:p-9">
      <div className="mb-6 flex items-center gap-3 text-[#075f62]">
        <PlayCircle className="h-7 w-7" aria-hidden="true" />
        <h1 className="font-serif text-3xl font-semibold">Das Zepter wieder übernehmen</h1>
      </div>
      {access.embedUrl ? (
        <div className="aspect-video overflow-hidden rounded-2xl bg-black shadow-lg">
          <iframe
            src={access.embedUrl}
            title="Spirit-Healing-Online-Vortrag"
            className="h-full w-full"
            allow="autoplay; fullscreen; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="flex aspect-video flex-col items-center justify-center rounded-2xl bg-[#e8f2ef] px-6 text-center">
          <PlayCircle className="h-12 w-12 text-[#087478]" aria-hidden="true" />
          <h2 className="mt-4 font-serif text-3xl font-semibold">Die Aufzeichnung wird gerade bereitgestellt.</h2>
          <p className="mt-3 max-w-xl leading-7 text-[#58706c]">Diese Seite aktualisiert sich automatisch. Du musst nichts tun.</p>
        </div>
      )}
      <div className="mt-7 rounded-2xl border border-[#d8bd60] bg-[#f8f0d6] p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div>
          <h2 className="font-serif text-2xl font-semibold">Alle Informationen zum 13-Wochen-Programm</h2>
          <p className="mt-2 text-sm leading-6 text-[#5b6e69]">Ablauf, Teilnahmeformen und Buchungsmöglichkeiten findest du auf der Programmseite.</p>
        </div>
        <Link to="/13-wochen-programm" className="mt-5 inline-flex shrink-0 items-center gap-2 rounded-full bg-[#075f62] px-6 py-3 font-bold text-white sm:mt-0">
          Programm ansehen <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>,
  )
}
