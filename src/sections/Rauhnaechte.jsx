import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Facebook,
  Instagram,
  MoonStar,
  PlayCircle,
  Send,
} from "lucide-react"
import { submitForm } from "@/lib/submissions"

const dailyThemes = [
  ["01", "Ankommen", "Zur Ruhe kommen und wahrnehmen, wie du in diese Übergangszeit eintrittst."],
  ["02", "Rückblick", "Das vergangene Jahr betrachten, ohne es bewerten oder schönreden zu müssen."],
  ["03", "Loslassen", "Erkennen, was nicht mit in das neue Jahr genommen werden soll."],
  ["04", "Den Körper hören", "Körpersignale als heutige Information wahrnehmen und einordnen."],
  ["05", "Beziehungen", "Betrachten, wo du verbunden bist und wo du dich selbst verlässt."],
  ["06", "Grenzen", "Ein Nein, ein Ja und den eigenen Platz deutlicher spüren."],
  ["07", "Die eigene Stimme", "In Worte bringen, was bisher zurückgehalten oder übergangen wurde."],
  ["08", "Wünsche", "Wünsche von Erwartungen unterscheiden und bewusst formulieren."],
  ["09", "Empfangen", "Wahrnehmen, was du annehmen kannst, ohne dich dafür rechtfertigen zu müssen."],
  ["10", "Entscheiden", "Aus vielen Möglichkeiten eine stimmige Richtung auswählen."],
  ["11", "Ausrichten", "Die eigene Aufmerksamkeit auf das lenken, was im neuen Jahr wachsen darf."],
  ["12", "Verkörpern", "Einen Wunsch in eine kleine, überprüfbare Handlung übersetzen."],
]

const schedule = [
  ["Ab 1. Dezember", "Öffentliche Hinführung mit kurzen Reels und Story-Impulsen"],
  ["23. Dezember", "Kostenlose Live-Meditation und Vorbereitung des 13-Wünsche-Rituals auf Instagram, YouTube und Facebook"],
  ["25. Dezember bis 5. Januar", "Zwölf tägliche Rauhnachtsimpulse; öffentlich kurz, im Programm als vollständige Begleitung"],
  ["30. Dezember", "Gemeinsame Zwischenreflexion für die Teilnehmerinnen und Teilnehmer des Programms"],
  ["6. Januar", "Geführter Abschluss und der dreizehnte Wunsch als eigene Handlung"],
]

const programIncluded = [
  "Zwölf geführte Meditationen oder Audio-Impulse",
  "Rauhnachtsjournal mit den täglichen Fragen und Platz für eigene Notizen",
  "Anleitung für das 13-Wünsche-Ritual mit einer sicheren Alternative zum Verbrennen",
  "Kurze Rituale für Rückblick, Loslassen, Ausrichtung und Verkörperung",
  "Live-Eröffnung am 23. Dezember",
  "Gemeinsame Zwischenreflexion am 30. Dezember",
  "Live-Abschluss am 6. Januar inklusive Aufzeichnungen",
  "Geschützter Austausch während der gemeinsamen Zeit",
]

const questions = [
  {
    title: "Wann beginnen die Rauhnächte in diesem Programm?",
    text: "Wir öffnen den gemeinsamen Raum am 23. Dezember. Die zwölf täglichen Impulse laufen vom 25. Dezember bis 5. Januar. Am 6. Januar schließen wir den Prozess gemeinsam ab.",
  },
  {
    title: "Sind die zwölf Themen eine alte, feststehende Überlieferung?",
    text: "Nein. Rauhnachtsbräuche unterscheiden sich je nach Region und Familie. Die zwölf Themen auf dieser Seite bilden die Spirit-Healing-Struktur für einen zusammenhängenden Reflexionsprozess.",
  },
  {
    title: "Brauche ich spirituelle Vorkenntnisse?",
    text: "Nein. Alle Rituale werden erklärt und bleiben freiwillig. Du kannst die Rauhnächte auch als ruhige Zeit für Rückblick, Schreiben und bewusste Entscheidungen nutzen.",
  },
  {
    title: "Wie viel Zeit brauche ich täglich?",
    text: "Die täglichen Einheiten sind so geplant, dass sie meistens in zehn bis zwanzig Minuten möglich sind. Du kannst einzelne Impulse nachholen und musst an den Feiertagen nichts in der Gruppe teilen.",
  },
  {
    title: "Muss ich räuchern oder Wünsche verbrennen?",
    text: "Nein. Wegen Haustieren, Allergien und Brandschutz gibt es für jede Übung eine rauch- und feuerfreie Alternative.",
  },
  {
    title: "Werden Träume oder Zeichen vorhergesagt?",
    text: "Nein. Träume und innere Bilder können im eigenen Journal als persönliches Reflexionsmaterial festgehalten werden. Wir deuten sie nicht als sichere Vorhersage und interpretieren sie nicht für andere.",
  },
  {
    title: "Ist die Rauhnachtsbegleitung eine Therapie?",
    text: "Nein. Sie ersetzt keine medizinische, psychiatrische oder psychotherapeutische Behandlung. In einer akuten Krise ist eine entsprechend qualifizierte Anlaufstelle der richtige Rahmen.",
  },
]

const metadata = {
  title: "Die Rauhnächte mit Spirit Healing | 2026/2027",
  description: "Zwölf geführte Rauhnächte mit Meditationen, Ritualen, Journal, täglichen Impulsen und Live-Begleitung von Spirit Healing.",
  url: "https://spirit-healing.tr/rauhnaechte",
  image: "https://spirit-healing.tr/rauhnaechte-spirit-healing.png",
}

const upsertMeta = (selector, attribute, value) => {
  let element = document.head.querySelector(selector)
  const created = !element
  if (!element) {
    element = document.createElement("meta")
    const match = selector.match(/meta\[(name|property)="([^"]+)"\]/)
    if (match) element.setAttribute(match[1], match[2])
    document.head.appendChild(element)
  }
  const previousValue = element.getAttribute(attribute)
  element.setAttribute(attribute, value)
  return () => {
    if (created) element.remove()
    else if (previousValue === null) element.removeAttribute(attribute)
    else element.setAttribute(attribute, previousValue)
  }
}

const usePageMetadata = () => {
  useEffect(() => {
    const previousTitle = document.title
    const cleanup = [
      upsertMeta('meta[name="description"]', "content", metadata.description),
      upsertMeta('meta[name="robots"]', "content", "index, follow, max-image-preview:large"),
      upsertMeta('meta[property="og:title"]', "content", metadata.title),
      upsertMeta('meta[property="og:description"]', "content", metadata.description),
      upsertMeta('meta[property="og:url"]', "content", metadata.url),
      upsertMeta('meta[property="og:image"]', "content", metadata.image),
      upsertMeta('meta[name="twitter:title"]', "content", metadata.title),
      upsertMeta('meta[name="twitter:description"]', "content", metadata.description),
      upsertMeta('meta[name="twitter:image"]', "content", metadata.image),
    ]
    const canonical = document.head.querySelector('link[rel="canonical"]')
    const previousCanonical = canonical?.getAttribute("href")
    document.title = metadata.title
    canonical?.setAttribute("href", metadata.url)

    return () => {
      document.title = previousTitle
      cleanup.reverse().forEach((restore) => restore())
      if (canonical && previousCanonical) canonical.setAttribute("href", previousCanonical)
    }
  }, [])
}

const SectionTitle = ({ eyebrow, title, intro, center = false, light = false }) => (
  <header className={center ? "mx-auto max-w-4xl text-center" : "max-w-4xl"}>
    <p className={`text-xs font-extrabold uppercase tracking-[0.24em] ${light ? "text-[#f1d7a0]" : "text-[#a67426]"}`}>{eyebrow}</p>
    <h2 className={`mt-4 font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl ${light ? "text-white" : "text-[#173c39]"}`}>{title}</h2>
    {intro && <p className={`mt-5 text-lg leading-8 ${light ? "text-white/75" : "text-[#49635f]"}`}>{intro}</p>}
  </header>
)

const InterestForm = () => {
  const [submitState, setSubmitState] = useState("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitState("submitting")
    setErrorMessage("")
    const form = event.currentTarget
    const formData = new FormData(form)
    const interest = String(formData.get("interest") || "Rauhnachtsprogramm")

    try {
      await submitForm("/api/contact", {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: null,
        topic: "Rauhnächte 2026/2027 – Vormerkung",
        message: `Unverbindliche Vormerkung für die Rauhnächte. Interesse an: ${interest}.`,
        privacyConsent: formData.get("privacy") === "on",
        newsletterConsent: false,
        company: formData.get("company"),
        locale: "de",
      })
      setSubmitState("success")
      form.reset()
    } catch (error) {
      setSubmitState("error")
      setErrorMessage(error.code === "rate_limit"
        ? "Es wurden zu viele Anfragen in kurzer Zeit gesendet. Bitte versuche es in einigen Minuten erneut."
        : "Die Vormerkung konnte gerade nicht gesendet werden. Bitte schreibe uns an info@spirit-healing.tr.")
    }
  }

  if (submitState === "success") {
    return (
      <div className="rounded-[2rem] bg-white p-8 text-center text-[#173c39] shadow-[0_22px_60px_rgba(0,0,0,0.2)] sm:p-10">
        <CheckCircle2 className="mx-auto h-14 w-14 text-[#0f7d79]" aria-hidden="true" />
        <h3 className="mt-5 font-serif text-3xl font-semibold">Deine Vormerkung ist angekommen.</h3>
        <p className="mt-4 leading-7 text-[#526a66]">Wir melden uns mit dem endgültigen Umfang, dem Preis und dem Buchungsstart persönlich bei dir.</p>
      </div>
    )
  }

  const fieldClass = "mt-2 min-h-12 w-full rounded-xl border border-[#b7cec5] bg-white px-4 py-3 text-base text-[#173c39] outline-none transition placeholder:text-[#748783] focus:border-[#0f7d79] focus:ring-2 focus:ring-[#0f7d79]/20"

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] bg-white p-7 text-[#173c39] shadow-[0_22px_60px_rgba(0,0,0,0.2)] sm:p-10">
      <div className="pointer-events-none absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
        <label>Company<input type="text" name="company" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-bold">Vor- und Nachname *<input className={fieldClass} type="text" name="name" autoComplete="name" maxLength={100} required /></label>
        <label className="block text-sm font-bold">E-Mail-Adresse *<input className={fieldClass} type="email" name="email" autoComplete="email" inputMode="email" maxLength={254} required /></label>
      </div>
      <label className="mt-5 block text-sm font-bold">
        Wofür möchtest du Informationen erhalten?
        <select className={fieldClass} name="interest" defaultValue="Das vollständige Rauhnachtsprogramm">
          <option>Das vollständige Rauhnachtsprogramm</option>
          <option>Die kostenlose öffentliche Reihe</option>
          <option>Beides</option>
          <option>Das 13-Wochen-Programm mit Rauhnächten</option>
        </select>
      </label>
      <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm leading-6 text-[#4f6662]">
        <input className="mt-1.5 h-4 w-4 shrink-0 accent-[#0f7d79]" type="checkbox" name="privacy" required />
        <span>Ich habe die <Link to="/datenschutz" target="_blank" className="font-bold text-[#0f7d79] underline underline-offset-2">Datenschutzerklärung</Link> gelesen und stimme der Verarbeitung meiner Angaben zur Bearbeitung dieser Vormerkung zu.</span>
      </label>
      {errorMessage && <p role="alert" className="mt-5 rounded-2xl border border-red-300 bg-red-50 p-4 text-sm leading-6 text-red-800">{errorMessage}</p>}
      <button type="submit" disabled={submitState === "submitting"} className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0f7d79] px-7 py-3.5 font-bold text-white transition hover:bg-[#075a57] disabled:cursor-wait disabled:opacity-65">
        {submitState === "submitting" ? "Vormerkung wird gesendet …" : "Unverbindlich vormerken"}<Send size={18} aria-hidden="true" />
      </button>
      <p className="mt-4 text-center text-xs leading-5 text-[#71827f]">Die Vormerkung ist kostenfrei und noch keine Buchung.</p>
    </form>
  )
}

export const Rauhnaechte = () => {
  usePageMetadata()

  const scrollToInterest = () => {
    document.getElementById("rauhnaechte-vormerken")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <main data-no-translate className="min-h-screen bg-[#fbf8f1] text-[#173c39]">
      <section className="relative isolate min-h-screen overflow-hidden bg-[#0f302f] text-white">
        <div className="absolute -left-32 top-24 h-96 w-96 rounded-full bg-[#0f7d79]/35 blur-3xl" aria-hidden="true" />
        <div className="absolute right-0 top-0 h-[32rem] w-[32rem] rounded-full bg-[#c69543]/20 blur-3xl" aria-hidden="true" />

        <div className="mx-auto max-w-7xl px-5 pb-16 pt-6 sm:px-8 lg:px-10 lg:pb-24">
          <header className="flex items-center justify-between">
            <a href="/" aria-label="Zur Spirit-Healing-Startseite" className="inline-flex items-center gap-3">
              <img src="/Logo-tuerkis.jpeg?v=20260730" alt="Spirit Healing" className="h-12 w-12 rounded-full object-cover shadow-sm" />
              <span className="text-sm font-bold uppercase tracking-[0.16em] text-white">Spirit Healing</span>
            </a>
            <button type="button" onClick={scrollToInterest} className="hidden rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/15 sm:block">Unverbindlich vormerken</button>
          </header>

          <div className="mt-12 grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
            <div className="relative z-10">
              <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-[#f1d7a0]">Die Rauhnächte mit Spirit Healing</p>
              <h1 className="mt-5 max-w-4xl font-serif text-5xl font-semibold leading-[0.98] sm:text-6xl lg:text-8xl">Zwölf Nächte.<br />Ein bewusster Übergang.</h1>
              <p className="mt-7 max-w-2xl text-xl leading-9 text-white/78">Vom 23. Dezember 2026 bis 6. Januar 2027 begleiten wir dich mit Meditationen, Ritualen und kurzen täglichen Impulsen durch die Zeit zwischen den Jahren.</p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
                <button type="button" onClick={scrollToInterest} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d5ad61] px-7 py-4 font-bold text-[#173c39] shadow-[0_16px_36px_rgba(0,0,0,0.2)] transition hover:bg-[#f1d7a0]">Interesse vormerken <ArrowDown size={18} /></button>
                <a href="#rauhnaechte-ablauf" className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/5 px-7 py-4 font-bold text-white transition hover:bg-white/10">Den Ablauf ansehen</a>
              </div>
              <div className="mt-9 flex flex-wrap gap-3 text-sm font-semibold text-white/85">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2.5"><CalendarDays size={17} className="text-[#f1d7a0]" />23. Dezember 2026 bis 6. Januar 2027</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2.5"><MoonStar size={17} className="text-[#f1d7a0]" />zwölf geführte Rauhnächte</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2.5"><Check size={17} className="text-[#f1d7a0]" />keine Vorkenntnisse nötig</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
              <div className="absolute -inset-4 rotate-2 rounded-[2rem] border border-[#d8c08d]/50 bg-[#c69543]/12" aria-hidden="true" />
              <figure className="relative overflow-hidden rounded-[2rem] border-8 border-white/90 bg-[#173c39] shadow-[0_26px_70px_rgba(0,0,0,0.3)]">
                <img src="/rauhnaechte-spirit-healing.png" alt="Sabine und Selcan bei einem winterlichen Rauhnachtsritual mit Kerze und Journal" className="h-[40rem] w-full object-cover object-center" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0f302f] via-[#0f302f]/55 to-transparent px-7 pb-7 pt-28">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f1d7a0]">Loslassen · lauschen · ausrichten</p>
                  <p className="mt-2 text-xl font-semibold leading-8">Eine ruhige tägliche Begleitung, die auch an den Feiertagen in deinen Alltag passt.</p>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.84fr_1.16fr] lg:gap-20">
          <SectionTitle
            eyebrow="Die Zeit zwischen den Jahren"
            title="Rückblick, Ruhe und eine bewusste Ausrichtung"
            intro="Rauhnachtsbräuche sind regional unterschiedlich. Wir arbeiten deshalb nicht mit der Vorstellung eines einzig richtigen Ablaufs. Das Programm verbindet ausgewählte Bräuche mit Meditation, Schreiben, Körperwahrnehmung und einer klaren Frage: Was möchtest du im neuen Jahr wirklich leben?"
          />
          <div className="border-y border-[#cbdcd5]">
            <p className="py-8 text-xl font-semibold leading-9 text-[#244b47] sm:text-2xl">Du musst weder an Vorhersagen glauben noch spirituelle Erfahrung mitbringen. Die Rituale geben deiner eigenen Wahrnehmung einen ruhigen Rahmen.</p>
            <p className="border-t border-[#cbdcd5] py-8 text-lg leading-8 text-[#506864]">Jede Rauhnacht enthält eine geführte Meditation, eine Reflexionsfrage und einen kleinen Schritt für den Alltag. Träume und innere Bilder können notiert werden, werden aber nicht als sichere Zeichen für die Zukunft ausgelegt.</p>
            <p className="border-t border-[#cbdcd5] py-8 text-lg leading-8 text-[#506864]">Das 13-Wünsche-Ritual begleitet den gesamten Prozess. Zwölf Wünsche dürfen symbolisch abgegeben werden. Der dreizehnte Wunsch wird am 6. Januar zu einer Handlung, für die du selbst Verantwortung übernimmst.</p>
          </div>
        </div>
      </section>

      <section id="rauhnaechte-ablauf" className="scroll-mt-8 border-y border-[#d5e4dd] bg-[#edf5f1] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <SectionTitle
            eyebrow="Der zeitliche Ablauf"
            title="Vom öffentlichen Auftakt bis zum gemeinsamen Abschluss"
            intro="Die kostenlose Dezember-Reihe und das vollständige Programm folgen derselben zeitlichen Linie. Die Tiefe und der Umfang der Begleitung unterscheiden sich."
          />
          <div className="mt-12 divide-y divide-[#bed3ca] border-y border-[#bed3ca]">
            {schedule.map(([date, text]) => (
              <div key={date} className="grid gap-2 py-6 sm:grid-cols-[13rem_1fr] sm:gap-8">
                <p className="font-bold text-[#0f7d79]">{date}</p>
                <p className="text-lg leading-8 text-[#47625e]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <SectionTitle
          eyebrow="Die zwölf täglichen Themen"
          title="Eine zusammenhängende Spirit-Healing-Reise"
          intro="Die Themen sind unsere Struktur für diesen Prozess. Sie sind keine Behauptung darüber, dass jede Rauhnacht historisch oder für jeden Menschen dieselbe feststehende Bedeutung besitzt."
        />
        <div className="mt-14 grid gap-px overflow-hidden rounded-[2rem] border border-[#c8dcd3] bg-[#c8dcd3] sm:grid-cols-2 lg:grid-cols-3">
          {dailyThemes.map(([number, title, text]) => (
            <article key={number} className="bg-white p-7 sm:p-8">
              <span className="font-serif text-3xl font-semibold text-[#c69543]">{number}</span>
              <h3 className="mt-5 font-serif text-3xl font-semibold text-[#173c39]">{title}</h3>
              <p className="mt-3 leading-7 text-[#506864]">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="kostenlos" className="scroll-mt-8 bg-[#173c39] py-20 text-white lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <SectionTitle
            eyebrow="Kostenlos öffentlich mitgehen"
            title="Tägliche kurze Impulse im Dezember"
            intro="Auch Menschen, die das Programm nicht buchen, können über unsere öffentlichen Kanäle einen kleinen Rauhnachtsprozess mitgehen."
            light
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <article className="rounded-[2rem] border border-white/15 bg-white/7 p-7">
              <PlayCircle className="h-9 w-9 text-[#f1d7a0]" aria-hidden="true" />
              <h3 className="mt-5 font-serif text-3xl font-semibold">Live-Meditation</h3>
              <p className="mt-4 leading-7 text-white/72">Am 23. Dezember öffnen wir die gemeinsame Zeit öffentlich über Instagram, YouTube und Facebook.</p>
            </article>
            <article className="rounded-[2rem] border border-white/15 bg-white/7 p-7">
              <MoonStar className="h-9 w-9 text-[#f1d7a0]" aria-hidden="true" />
              <h3 className="mt-5 font-serif text-3xl font-semibold">Zwölf kurze Reels</h3>
              <p className="mt-4 leading-7 text-white/72">Vom 25. Dezember bis 5. Januar erscheint täglich ein kurzer Gedanke mit einer Frage oder kleinen Übung.</p>
            </article>
            <article className="rounded-[2rem] border border-white/15 bg-white/7 p-7">
              <CalendarDays className="h-9 w-9 text-[#f1d7a0]" aria-hidden="true" />
              <h3 className="mt-5 font-serif text-3xl font-semibold">Vorbereitung ab Dezember</h3>
              <p className="mt-4 leading-7 text-white/72">Vor dem Start erklären wir die Idee, die benötigten Materialien und den Unterschied zwischen öffentlicher Reihe und vollständigem Programm.</p>
            </article>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="https://www.instagram.com/spirit4healing/" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-[#173c39] transition hover:bg-[#f1d7a0]"><Instagram size={19} />Instagram folgen</a>
            <a href="https://www.facebook.com/profile.php?id=61588723230682" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/30 px-6 py-3 font-bold text-white transition hover:bg-white/10"><Facebook size={19} />Facebook folgen</a>
          </div>
        </div>
      </section>

      <section id="programm" className="scroll-mt-8 bg-[#f4ead6] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
            <div>
              <SectionTitle
                eyebrow="Das separat buchbare Programm"
                title="Die vollständige Begleitung durch alle zwölf Rauhnächte"
                intro="Das bezahlte Programm führt die täglichen Themen als zusammenhängenden Prozess weiter. Es enthält längere Meditationen, das Journal, die Live-Termine, Aufzeichnungen und einen geschützten Austausch."
              />
              <button type="button" onClick={scrollToInterest} className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[#0f7d79] px-7 py-3.5 font-bold text-white transition hover:bg-[#075a57]">Zum Rauhnachtsprogramm vormerken</button>
            </div>
            <ul className="divide-y divide-[#d3bc91] border-y border-[#d3bc91]">
              {programIncluded.map((item) => <li key={item} className="flex gap-4 py-5 text-lg font-semibold leading-8 text-[#31534f]"><CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-[#0f7d79]" aria-hidden="true" />{item}</li>)}
            </ul>
          </div>

          <div className="mt-14 grid overflow-hidden rounded-[2rem] bg-[#0f302f] text-white shadow-[0_24px_64px_rgba(15,48,47,0.2)] lg:grid-cols-[0.78fr_1.22fr]">
            <div className="relative min-h-[24rem] overflow-hidden bg-[#073f42] lg:min-h-full">
              <img src="/zepter-spirit-healing.png" alt="" className="absolute inset-0 h-full w-full object-cover object-[center_18%] opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f302f] via-[#0f302f]/20 to-transparent" aria-hidden="true" />
              <div className="absolute inset-x-0 bottom-0 p-7 sm:p-10">
                <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#f1d7a0]">Im 13-Wochen-Programm</p>
                <p className="mt-3 text-xl font-semibold leading-8">Die vollständige Rauhnachtsbegleitung ist bereits enthalten.</p>
              </div>
            </div>
            <div className="px-7 py-10 sm:px-10 lg:py-12">
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#f1d7a0]">21. Oktober 2026 bis 13. Januar 2027</p>
              <h3 className="mt-4 font-serif text-3xl font-semibold leading-tight sm:text-5xl">Du spielst die Hauptrolle. Doch wer schreibt dein Drehbuch?</h3>
              <p className="mt-6 text-lg leading-8 text-white/82">Du verteilst die Rollen. Du triffst die Entscheidungen. Und trotzdem wiederholen sich dieselben Szenen. Solange deine innere Matrix im Verborgenen wirkt, führt ein altes Drehbuch Regie.</p>
              <p className="mt-5 text-lg leading-8 text-white/82">Das 13-Wochen-Programm lädt dich ein, diese Matrix sichtbar zu machen und das Zepter wieder selbst zu übernehmen. Die Rauhnächte verbinden sich darin mit deinem Prozess und werden bis zur Integrationswoche am 13. Januar weitergeführt.</p>
              <Link to="/13-wochen-programm" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#f1d7a0] px-6 py-3 font-bold text-[#173c39] transition hover:bg-white">13-Wochen-Programm entdecken <ArrowRight className="h-5 w-5" aria-hidden="true" /></Link>
            </div>
          </div>
          <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-6 text-[#63736f]">Der Preis und die endgültige Zahl der Plätze werden vor dem Buchungsstart veröffentlicht. Die Vormerkung ist kostenfrei.</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <SectionTitle eyebrow="Fragen zur Begleitung" title="Was vor der Vormerkung wichtig ist" center />
        <div className="mt-12 divide-y divide-[#bed3ca] border-y border-[#bed3ca]">
          {questions.map((item) => (
            <details key={item.title} className="group py-6">
              <summary className="cursor-pointer list-none pr-8 text-xl font-bold leading-8 text-[#173c39] marker:hidden">{item.title}</summary>
              <p className="mt-4 max-w-4xl text-lg leading-8 text-[#506864]">{item.text}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="rauhnaechte-vormerken" className="scroll-mt-8 bg-[#173c39] py-20 text-white lg:py-28">
        <div className="mx-auto grid max-w-7xl items-start gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-10">
          <div>
            <SectionTitle
              eyebrow="Unverbindliche Vormerkung"
              title="Erhalte Preis und Buchungsstart zuerst"
              intro="Du kannst dich für das vollständige Rauhnachtsprogramm, die kostenlose öffentliche Reihe oder beides vormerken. Daraus entsteht noch keine Buchung."
              light
            />
            <div className="mt-8 space-y-4 text-white/75">
              <p className="flex gap-3"><Check className="mt-1 h-5 w-5 shrink-0 text-[#f1d7a0]" aria-hidden="true" />Öffentliche Live-Meditation am 23. Dezember 2026</p>
              <p className="flex gap-3"><Check className="mt-1 h-5 w-5 shrink-0 text-[#f1d7a0]" aria-hidden="true" />Zwölf tägliche Impulse vom 25. Dezember bis 5. Januar</p>
              <p className="flex gap-3"><Check className="mt-1 h-5 w-5 shrink-0 text-[#f1d7a0]" aria-hidden="true" />Gemeinsamer Abschluss am 6. Januar 2027</p>
            </div>
          </div>
          <InterestForm />
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#0f302f] py-10 text-white/65">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 text-sm sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <a href="/" className="flex items-center gap-3 text-white" aria-label="Spirit Healing Startseite"><img src="/Logo-tuerkis.jpeg?v=20260730" alt="" className="h-10 w-10 rounded-full object-cover" /><span className="font-bold">Spirit Healing · Sabine &amp; Selcan</span></a>
          <nav aria-label="Rechtliche Hinweise" className="flex flex-wrap gap-x-6 gap-y-2">
            <Link to="/impressum" className="hover:text-white">Impressum</Link>
            <Link to="/datenschutz" className="hover:text-white">Datenschutz</Link>
            <a href="mailto:info@spirit-healing.tr" className="hover:text-white">Kontakt</a>
          </nav>
        </div>
      </footer>
    </main>
  )
}
