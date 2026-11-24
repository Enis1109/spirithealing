import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, CalendarDays, Check, Headphones, MoonStar, PanelsTopLeft, Video } from "lucide-react"
import { contactOfferUrl } from "../lib/contactOffers.js"

const offerEnds = Date.parse("2026-11-28T00:00:00+01:00")
const standardPrice = 111
const launchPrice = 88
const websitePrice = 600

function paymentUrl(value) {
  if (!value) return null
  try {
    const url = new URL(value)
    return url.protocol === "https:" && !url.username && !url.password
      && ["book.stripe.com", "buy.stripe.com"].includes(url.hostname) ? url : null
  } catch {
    return null
  }
}

const stripeCheckout = paymentUrl(import.meta.env.VITE_RAUHNAECHTE_2026_STRIPE_URL)
const stripePromotion = import.meta.env.VITE_RAUHNAECHTE_2026_PROMO_CODE

function checkoutFor(offerActive) {
  if (!stripeCheckout || (offerActive && !stripePromotion)) return null
  const url = new URL(stripeCheckout)
  url.searchParams.delete("prefilled_promo_code")
  if (offerActive) url.searchParams.set("prefilled_promo_code", stripePromotion)
  return url.href
}

function useLaunchClock() {
  const [remainingMs, setRemainingMs] = useState(() => Math.max(0, offerEnds - Date.now()))
  const active = remainingMs > 0
  useEffect(() => {
    if (!active) return undefined
    const refresh = () => setRemainingMs(Math.max(0, offerEnds - Date.now()))
    const interval = window.setInterval(refresh, 1000)
    window.addEventListener("focus", refresh)
    window.addEventListener("pageshow", refresh)
    return () => {
      window.clearInterval(interval)
      window.removeEventListener("focus", refresh)
      window.removeEventListener("pageshow", refresh)
    }
  }, [active])
  return [remainingMs, setRemainingMs]
}

const months = [
  ["Januar", "Kraft sammeln", "Welche Aufgabe darf weniger Raum bekommen, damit dein Vorhaben Platz findet?"],
  ["Februar", "Resonanz finden", "Mit wem möchtest du deine Idee zum ersten Mal teilen?"],
  ["März", "Eigene Worte finden", "Wie klingt dein Vorhaben, wenn du es in einem Satz aussprichst?"],
  ["April", "Den ersten Schritt wagen", "Was kannst du im Kleinen ausprobieren?"],
  ["Mai", "Eine Form wählen", "Welcher Umfang lässt sich mit deinem Alltag gut verbinden?"],
  ["Juni", "Klarer einladen", "Was sollen andere verstehen, wenn du von deinem Vorhaben erzählst?"],
  ["Juli", "Dranbleiben", "Welcher Rhythmus trägt dich auch dann, wenn die erste Begeisterung nachlässt?"],
  ["August", "Sichtbar werden", "Was möchtest du mit deiner eigenen Stimme nach außen tragen?"],
  ["September", "Resonanz prüfen", "Wo kommst du tatsächlich mit den passenden Menschen ins Gespräch?"],
  ["Oktober", "Absprachen klären", "Welche Zusage oder Grenze braucht von dir klare Worte?"],
  ["November", "Struktur geben", "Was braucht dein Vorhaben an Zeit, Geld und Unterstützung?"],
  ["Dezember", "Würdigen und weitergehen", "Was ist entstanden, und was möchtest du ins nächste Jahr mitnehmen?"],
]

const meetings = [
  { date: "23. Dezember", time: "2026-12-23T19:00:00+01:00", title: "Eröffnung", description: "Wir meditieren gemeinsam und bereiten die 13 Wünsche vor. Das Ziehen beginnt in der ersten Raunacht am 25. Dezember." },
  { date: "30. Dezember", time: "2026-12-30T19:00:00+01:00", title: "Zwischenreflexion", description: "Wir schauen auf die ersten Nächte und hören darauf, was für dein Vorhaben deutlicher geworden ist." },
  { date: "6. Januar", time: "2027-01-06T19:00:00+01:00", title: "Abschluss", description: "Du öffnest den 13. Wunsch und gibst deiner Jahresessenz Worte. Im Anschluss stellen wir dir unsere Jahresbegleitung vor." },
]

const included = [
  [Headphones, "Zwölf Meditationen per E-Mail", "Vom 25. Dezember bis 5. Januar bekommst du jeden Abend eine geführte Meditation mit einem Impuls für den jeweiligen Monat."],
  [BookOpen, "Dein Raunächte-Workbook", "Zwölf astrologische Monatsausblicke, Platz für deine Wahrnehmungen und eine Frage zu deinem Vorhaben."],
  [MoonStar, "Das Ritual der 13 Wünsche", "Du bereitest deine Wünsche vor. Am letzten Abend bleibt ein Wunsch, aus dem du deine Jahresessenz formulierst."],
  [Video, "Drei Live-Abende mit uns", "Wir eröffnen den Raum gemeinsam, treffen uns zur Zwischenreflexion und schließen die Raunächte zusammen ab."],
]

const width = "mx-auto max-w-[78rem] px-5 sm:px-9 lg:px-12"
const primary = "inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#164942] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#0c3732] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#164942]"
const gold = "inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#efdca8] px-6 py-3.5 text-sm font-bold text-[#123b35] transition hover:bg-[#fff0c7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#efdca8]"

const heroMotion = `
  .raun-portrait { animation: raun-portrait-arrives 1.35s cubic-bezier(.2,.65,.3,1) both; }
  .raun-kolibri {
    clip-path: polygon(31.1% 35.8%, 35.7% 35.6%, 41.7% 36.7%, 45% 35.1%, 48.5% 35%, 51.3% 37.2%, 52.4% 41.4%, 53.4% 43.4%, 55.1% 36.7%, 58.6% 31.1%, 63.2% 24.8%, 64.9% 18.9%, 65.8% 22.8%, 65.6% 28.2%, 67.2% 23%, 67.3% 27.8%, 64.4% 32.6%, 67.9% 28%, 66.7% 32.2%, 74% 24.4%, 77.7% 19.9%, 79.1% 14.8%, 80.1% 19.3%, 79.3% 23.8%, 76.7% 27.9%, 81.9% 24.7%, 81.5% 28.1%, 78.8% 32.4%, 74.2% 36.6%, 80.9% 32.6%, 79.5% 35.6%, 76.6% 38.4%, 72.5% 41%, 77.7% 39.8%, 75.4% 42.6%, 72.5% 44.4%, 73.9% 44.7%, 70.5% 46.5%, 73.2% 46.3%, 69.3% 49.3%, 66.9% 50.1%, 64% 49.9%, 67% 51.6%, 63.6% 51.6%, 60.5% 50.1%, 62.8% 56.5%, 65.9% 64.3%, 67.1% 69.8%, 65.8% 75.3%, 61.8% 80.3%, 57.1% 84%, 56.5% 86.1%, 58.5% 88.2%, 56.4% 88.1%, 56.1% 85.2%, 58.4% 80.7%, 62.1% 75.7%, 63.8% 69.1%, 60% 74.5%, 54.5% 79.9%, 48% 84.2%, 46.8% 87.5%, 47.6% 90.5%, 45.3% 88.8%, 45.6% 83.9%, 48.5% 79.3%, 50.7% 77.4%, 43.9% 78.9%, 37.4% 79.6%, 33.4% 82.4%, 32.8% 86.2%, 36.5% 89%, 39.7% 87.6%, 39.8% 84.9%, 37.2% 83.6%, 36.6% 85.8%, 35.6% 84.3%, 37.4% 82.5%, 40.2% 82.7%, 41% 85.7%, 39.8% 88.7%, 36.3% 90%, 32.2% 88.8%, 30.9% 85.3%, 31.5% 81.8%, 34.8% 77.7%, 41.1% 75.8%, 46% 76.1%, 41.4% 74.9%, 37.6% 72.4%, 37% 68.8%, 38.6% 65.4%, 41.2% 64.1%, 44.9% 64.7%, 47.1% 67%, 45.9% 70%, 43.9% 70.2%, 45.3% 68.5%, 44.9% 67.1%, 41.9% 66.9%, 39.6% 68.8%, 40.2% 72%, 45.3% 74.3%, 50.6% 74.3%, 54.1% 72%, 57.3% 69.1%, 59.6% 64.5%, 58.9% 60.2%, 56.7% 57.8%, 54.2% 57.5%, 54.7% 59.7%, 52.5% 59.6%, 51.8% 58.3%, 52.9% 57.1%, 49.1% 55.5%, 46.3% 52.7%, 44.8% 49.2%, 43.9% 44.4%, 42.6% 41%, 40.3% 38.9%, 36.3% 37%);
    transform-origin: 53% 49%;
    opacity: 0;
    animation: raun-kolibri-flight 2.65s .9s both;
  }
  @keyframes raun-portrait-arrives {
    from { transform: scale(1.035); }
    to { transform: scale(1); }
  }
  @keyframes raun-kolibri-flight {
    0%, 8% { transform: translate(0, 0) scale(1); opacity: 0; }
    16% { transform: translate(5%, -11%) scale(1.13) rotate(-7deg); opacity: 1; animation-timing-function: cubic-bezier(.16,.5,.58,1); }
    44% { transform: translate(68%, -106%) scale(1.34) rotate(-14deg); opacity: 1; animation-timing-function: cubic-bezier(.37,.04,.64,.95); }
    72% { transform: translate(133%, -156%) scale(1.37) rotate(5deg); opacity: .95; animation-timing-function: ease-in; }
    100% { transform: translate(220%, -191%) scale(1.12) rotate(11deg); opacity: 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .raun-portrait { animation: none; }
    .raun-kolibri { display: none; animation: none; }
  }
`

function Countdown({ remainingMs }) {
  const seconds = Math.max(0, Math.ceil(remainingMs / 1000))
  const units = [
    ["Tage", Math.floor(seconds / 86400)],
    ["Std.", Math.floor(seconds / 3600) % 24],
    ["Min.", Math.floor(seconds / 60) % 60],
    ["Sek.", seconds % 60],
  ]

  return (
    <div className="grid w-fit grid-cols-4 gap-1.5" role="timer" aria-label="Zeit bis zum Ende des Aktionspreises" data-raun-countdown={offerEnds}>
      {units.map(([label, value]) => (
        <div key={label} className="min-w-[3rem] rounded-lg bg-[#e9f0e7] px-2 py-1.5 text-center sm:min-w-[3.35rem]">
          <strong data-raun-unit className="block text-lg font-bold leading-none tabular-nums text-[#163d35]">{String(value).padStart(2, "0")}</strong>
          <span className="mt-0.5 block text-[0.64rem] font-semibold uppercase tracking-wide text-[#49625b]">{label}</span>
        </div>
      ))}
    </div>
  )
}

function Price({ offerActive, remainingMs, compact = false }) {
  return offerActive ? (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#765820]">Black Friday Week</p>
      <div className="mt-2 flex flex-wrap items-end gap-x-4 gap-y-1">
        <p className={`${compact ? "text-4xl" : "text-6xl"} font-serif font-semibold leading-none`}>{launchPrice} €</p>
        <p className="pb-0.5 text-sm font-semibold text-[#49625b]"><s className="mr-1 text-xl decoration-[#9c7335] decoration-2">{standardPrice} €</s> ab 28.11.</p>
      </div>
      <div className="mt-3"><Countdown remainingMs={remainingMs} /></div>
      <p className="mt-2 text-xs leading-5 text-[#49625b]">Aktionspreis bis 27.11.2026, 23:59 Uhr deutscher Zeit.</p>
    </div>
  ) : <p className={`${compact ? "text-3xl" : "text-6xl"} font-serif font-semibold leading-none`}>{standardPrice} €</p>
}

export function Rauhnaechte() {
  const [remainingMs, setRemainingMs] = useLaunchClock()
  const offerActive = remainingMs > 0
  const checkout = checkoutFor(offerActive)
  const contact = contactOfferUrl("raunachtWebsite")

  return (
    <main data-no-translate className="min-h-screen bg-[#fbf8f0] text-[#163d35]">
      <style>{heroMotion}</style>
      <a href="#inhalt" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-3">Zum Inhalt</a>
      <header className="border-b border-[#dedacb] bg-[#fffdf7]">
        <div className={`${width} flex min-h-19 items-center justify-between gap-4`}>
          <Link to="/" aria-label="Spirit Healing · Startseite" className="flex shrink-0 items-center gap-2.5 font-semibold tracking-[0.13em] uppercase">
            <img src="/Logo-tuerkis.jpeg?v=20260730" alt="" width="46" height="46" className="h-11 w-11 rounded-full object-cover" />
            <span className="text-xs">Spirit Healing</span>
          </Link>
          <nav aria-label="Auf dieser Seite" className="hidden items-center gap-7 text-sm font-semibold md:flex">
            <a href="#jahreswechsel" className="hover:underline">Jahreswechsel</a>
            <a href="#programm" className="hover:underline">Programm</a>
            <a href="#termine" className="hover:underline">Termine</a>
            <a href="#website-special" className="hover:underline">Website-Special</a>
          </nav>
          <a href="#rauhnaechte-buchen" className={`${primary} shrink-0 !px-4 sm:!px-6`}>Zur Buchung <ArrowUpRight size={15} aria-hidden="true" /></a>
        </div>
      </header>

      <section id="inhalt" className="relative isolate overflow-hidden border-b border-[#e7dfce] bg-[radial-gradient(ellipse_at_top_left,#fffdf8_30%,#f3ead7_100%)]">
        <div className={`${width} grid items-center gap-12 pb-16 pt-12 md:pb-22 lg:grid-cols-[1.03fr_.97fr] lg:gap-15 lg:pb-24 lg:pt-16`}>
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.17em] text-[#715520]"><MoonStar size={17} aria-hidden="true" /> Raunächte 2026/27 mit Sabine und Selcan</p>
            <h1 className="mt-5 max-w-[46rem] font-serif text-[clamp(2.85rem,6.15vw,5.9rem)] font-medium leading-[0.98] tracking-[-0.052em]">Was möchtest du 2027 <em className="font-normal text-[#407169]">in die Welt bringen?</em></h1>
            <p className="mt-6 max-w-[35rem] text-[clamp(1.06rem,1.4vw,1.26rem)] leading-relaxed text-[#405d55]">Vielleicht ist da schon länger der Wunsch, mit deiner Arbeit sichtbarer zu werden oder etwas Eigenes aufzubauen. Du spielst Möglichkeiten durch und jede klingt für einen Moment richtig. Sobald du dich entscheiden willst, meldet sich wieder die Frage, was du damit aufs Spiel setzt. In den Raunächten begleiten wir dich dabei, diese Stimmen zu hören und deinem Vorhaben aus deiner eigenen Kraft eine Richtung zu geben.</p>
            <p className="mt-6 flex items-start gap-2.5 text-sm font-semibold"><CalendarDays size={19} className="shrink-0 text-[#715520]" aria-hidden="true" /> 23. Dezember 2026 bis 6. Januar 2027 · online</p>
            <div className="mt-6 border-y border-[#d9cdb3] py-4"><Price offerActive={offerActive} remainingMs={remainingMs} compact /></div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href="#rauhnaechte-buchen" className={primary}>Bei den Raunächten dabei sein <ArrowRight size={17} aria-hidden="true" /></a>
              <a href="#programm" className="inline-flex min-h-12 items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline">Ablauf ansehen <ArrowDown size={15} aria-hidden="true" /></a>
            </div>
          </div>

          <figure className="relative mx-auto w-full max-w-[37rem] pb-4 pl-3 sm:pl-6">
            <div className="relative isolate aspect-[5/5.7] overflow-hidden rounded-[2rem] bg-[#24463d] shadow-[0_22px_55px_#263f342e] sm:rounded-[2.7rem]">
              <img className="raun-portrait h-full w-full object-cover object-[50%_43%]" src="/rauhnaechte-spirit-healing.png" alt="Sabine und Selcan im Kerzenlicht bei einem winterlichen Raunachtsritual" fetchPriority="high" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#112d28]/85 via-transparent to-transparent" aria-hidden="true" />
            </div>
            <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-[clamp(7rem,15vw,10rem)] w-[clamp(7rem,15vw,10rem)]" aria-hidden="true">
              <img src="/Logo-tuerkis.jpeg?v=20260730" alt="" className="absolute inset-0 h-full w-full rounded-full drop-shadow-[0_7px_11px_#10251d55]" />
              <img src="/Logo-tuerkis.jpeg?v=20260730" alt="" className="raun-kolibri absolute inset-0 h-full w-full" />
            </div>
            <figcaption className="absolute inset-x-0 bottom-4 py-6 pl-29 pr-5 text-sm text-white sm:pl-38"><strong className="block font-serif text-xl font-normal sm:text-2xl">Sabine &amp; Selcan</strong><span>Begleiten dich durch die Raunächte</span></figcaption>
          </figure>
        </div>
      </section>

      <section id="jahreswechsel" className="scroll-mt-6 border-b border-[#d9dfd2] bg-[#f0f3ea] py-16 lg:py-24">
        <div className={width}>
          <div className="grid gap-6 lg:grid-cols-[.96fr_1.04fr] lg:items-end lg:gap-14">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.17em] text-[#765820]">Der Übergang von 2026 zu 2027</p>
              <h2 className="max-w-[34rem] font-serif text-[clamp(2.4rem,4.65vw,4.55rem)] leading-[1.02] tracking-[-0.045em]">Wenn du spürst, dass sich etwas ändern muss</h2>
            </div>
            <p className="max-w-[36rem] text-lg leading-8 text-[#405d55]">Morgens denkst du, du könntest endlich anfangen. Abends gehst du im Kopf noch einmal durch, wer sich auf dich verlässt, was du verlieren könntest und ob du schon genug weißt. Ein Teil von dir ist längst bereit. Ein anderer weiß, wie viel du bisher mit deiner Aufmerksamkeit und deiner Kraft zusammengehalten hast. Beide haben etwas zu sagen.</p>
          </div>

          <div className="mt-9 grid gap-4 lg:grid-cols-2">
            <article className="rounded-[1.6rem] border border-[#d3ddcf] bg-[#fffdf7] p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#765820]">Rückblick auf 2026</p>
              <h3 className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">Was hat uns getragen?</h3>
              <p className="mt-4 leading-7 text-[#405d55]">2026 konnte sich herausfordernd anfühlen, weil manche Entscheidungen anstanden, während das Neue erst langsam Form annahm. Im Februar trafen sich Saturn und Neptun am Anfang des Widders. Für uns steht diese Begegnung für die Frage, wie etwas, das wir innerlich längst ahnen, im gelebten Leben eine Form bekommt.</p>
              <p className="mt-4 leading-7 text-[#405d55]">Vielleicht hast du in diesem Jahr gemerkt, wie gut du Verantwortung übernehmen, mitdenken oder für Verbindung sorgen kannst. Und wie müde du wirst, wenn jede dieser Fähigkeiten automatisch denselben Auftrag bekommt. Zwischen den Jahren darfst du würdigen, was du getragen hast, und dir die Frage stellen: Wofür will ich diese Kraft heute einsetzen?</p>
            </article>
            <article className="rounded-[1.6rem] border border-[#d3ddcf] bg-[#fffdf7] p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#765820]">Ausblick auf 2027</p>
              <h3 className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">Was möchte durch mich Gestalt annehmen?</h3>
              <p className="mt-4 leading-7 text-[#405d55]">Im Januar wird Mars rückläufig. Wir lesen darin eine Zeit, in der du prüfen darfst, wohin deine Kraft bisher geflossen ist. Anfang April wird er im Löwen wieder direktläufig. Das nehmen wir als Einladung, deinem Ausdruck einen sichtbaren Schritt zu geben. Ende Juli wechselt Jupiter vom Löwen in die Jungfrau. Welche Form kann dein Vorhaben im Alltag tragen?</p>
              <p className="mt-4 leading-7 text-[#405d55]">Vielleicht heißt das für dich, zum ersten Mal auszusprechen, was du anbieten möchtest. Vielleicht brauchst du eine klare Abmachung über Zeit, damit dein Vorhaben einen Platz bekommt. Du kannst deine Richtung aus dem wählen, was du im Körper wahrnimmst, was dir wirklich wichtig ist und wofür du bereit bist, Verantwortung zu übernehmen.</p>
            </article>
          </div>

          <div className="mt-5 grid gap-4 rounded-[1.6rem] bg-[#164942] p-6 text-[#fffaf0] sm:p-8 lg:grid-cols-[.88fr_1.12fr] lg:items-center lg:gap-10">
            <p className="font-serif text-[clamp(1.6rem,3vw,2.5rem)] leading-tight">Was soll durch dich einen Platz in der Welt bekommen?</p>
            <p className="leading-7 text-[#f2f4ea]">Wir nehmen diese Frage mit durch die zwölf Nächte. Nach der Meditation hältst du fest, was du gehört hast und wie dein nächster Schritt aussehen könnte. Am Abschlussabend öffnest du den 13. Wunsch. Aus ihm formulierst du die Qualität, die du durch dein Jahr tragen willst, und gibst ihr eine erste Handlung.</p>
          </div>
        </div>
      </section>

      <section id="programm" className={`${width} scroll-mt-6 py-16 lg:py-24`}>
        <div className="grid gap-5 lg:grid-cols-[.95fr_1.05fr] lg:items-end lg:gap-14">
          <h2 className="max-w-[37rem] font-serif text-[clamp(2.5rem,4.25vw,4.25rem)] leading-[1.02] tracking-[-0.045em]">Zwölf Nächte für dein Vorhaben</h2>
          <p className="max-w-[38rem] leading-relaxed text-[#49625b] sm:text-lg">Du nimmst ein Vorhaben mit in den Kreis. In jeder Nacht lauschen wir auf die Zeitqualität eines Monats. Nach der Meditation hältst du fest, was du wahrgenommen hast und welche Handlung sich daraus für dich ergibt.</p>
        </div>
        <div className="mt-9 grid gap-px overflow-hidden rounded-[1.7rem] border border-[#dedacb] bg-[#dedacb] sm:grid-cols-2 lg:grid-cols-4">
          {included.map(([Icon, title, description]) => (
            <article key={title} className="bg-[#fffdf7] p-6 sm:p-7">
              <Icon size={25} className="mb-5 text-[#7a5b25]" aria-hidden="true" />
              <h3 className="font-serif text-2xl leading-tight">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#49625b]">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="themen" className="scroll-mt-6 border-y border-[#d7dfd2] bg-[#edf2e9] py-15 lg:py-21">
        <div className={`${width} grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:gap-16`}>
          <div>
            <h2 className="font-serif text-[clamp(2.35rem,4vw,3.9rem)] leading-[1.02] tracking-[-0.04em]">Ein Blick in dein Jahr</h2>
            <p className="mt-4 max-w-md leading-7 text-[#49625b]">Wähle einen Monat und lies, welche Frage wir in dieser Raunacht mit in die Meditation nehmen.</p>
          </div>
          <div className="grid content-start gap-2 sm:grid-cols-2">
            {months.map(([month, theme, prompt]) => (
              <details key={month} name="raun-monate" className="group self-start rounded-xl border border-[#cedbcf] bg-[#fbfdf7] p-3.5 open:border-[#7f9d8c] open:bg-white">
                <summary className="flex min-h-8 cursor-pointer list-none items-center justify-between gap-2 text-sm font-semibold [&::-webkit-details-marker]:hidden"><span>{month} <span className="font-normal text-[#49625b]">· {theme}</span></span><span className="text-lg leading-none text-[#456b5b] transition group-open:rotate-45" aria-hidden="true">+</span></summary>
                <p className="mt-2 border-t border-[#dce6da] pt-2 text-sm leading-6 text-[#405d55]">{prompt}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="termine" className={`${width} scroll-mt-6 py-16 lg:py-24`}>
        <h2 className="font-serif text-[clamp(2.45rem,4.25vw,4rem)] leading-none tracking-[-0.04em]">Unsere Live-Abende</h2>
        <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#49625b]"><Video size={18} aria-hidden="true" /> Jeweils 19 Uhr deutscher Zeit · online über Zoom</p>
        <ol className="mt-8 grid gap-4 lg:grid-cols-3">
          {meetings.map(({ date, time, title, description }) => (
            <li key={time} className="rounded-[1.5rem] border border-[#e2dccc] bg-white/75 p-6 sm:p-7">
              <time dateTime={time} className="text-xs font-bold uppercase tracking-[0.16em] text-[#765820]">{date}</time>
              <h3 className="mt-3 font-serif text-3xl">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#49625b]">{description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="rauhnaechte-buchen" className="scroll-mt-6 border-y border-[#dcd0b5] bg-[#f2ead9] py-16 lg:py-23">
        <div className={width}>
          <h2 className="font-serif text-[clamp(2.5rem,4.45vw,4.4rem)] leading-none tracking-[-0.045em]">Bei den Raunächten dabei sein</h2>
          <div className="mt-8 grid items-stretch gap-5 lg:grid-cols-2">
            <article className="flex flex-col rounded-[1.8rem] border border-[#d6c6a4] bg-[#fffdf7] p-6 shadow-[0_8px_35px_#4541270c] sm:p-9">
              <h3 className="font-serif text-3xl">Raunächte-Begleitung</h3>
              <div className="mt-5"><Price offerActive={offerActive} remainingMs={remainingMs} /></div>
              <p className="mt-3 text-sm text-[#49625b]">Einmalzahlung für die vollständige Gruppenbegleitung.</p>
              <ul className="mb-7 mt-5 space-y-2 text-sm leading-6">
                {["Zwölf Meditationen und Astro-Impulse", "Workbook und 13-Wünsche-Ritual", "Drei Live-Abende mit Sabine und Selcan"].map((item) => <li key={item} className="flex items-start gap-2.5"><Check size={17} className="mt-0.5 shrink-0 text-[#527d63]" aria-hidden="true" />{item}</li>)}
              </ul>
              <div className="mt-auto">
                {checkout ? (
                  <a href={checkout} onClick={(event) => {
                    const currentRemainingMs = Math.max(0, offerEnds - Date.now())
                    if ((currentRemainingMs > 0) !== offerActive) {
                      event.preventDefault()
                      setRemainingMs(currentRemainingMs)
                    }
                  }} className={primary}>Für {offerActive ? launchPrice : standardPrice} € buchen <ArrowRight size={17} aria-hidden="true" /></a>
                ) : <p role="status" className="text-sm font-semibold">Die Online-Buchung wird vorbereitet.</p>}
              </div>
            </article>

            <article id="website-special" className="relative isolate flex scroll-mt-6 flex-col overflow-hidden rounded-[1.8rem] bg-[#153c35] p-6 text-[#fffaf0] shadow-[0_8px_35px_#1e362326] sm:p-9">
              <div className="pointer-events-none absolute -right-15 -top-23 -z-10 h-58 w-58 rounded-full border border-[#e8cf9a]/20 shadow-[0_0_0_23px_#e8cf9a0e,0_0_0_46px_#e8cf9a08]" aria-hidden="true" />
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#efdca8]"><PanelsTopLeft size={17} aria-hidden="true" /> Website-Special</p>
              <h3 className="mt-4 max-w-sm font-serif text-3xl leading-tight">Dein Angebot bekommt eine eigene Seite</h3>
              <p className="mt-3 max-w-lg text-sm leading-6 text-[#ebf0e7]">Wenn aus deinem Vorhaben ein konkretes Angebot wird, helfen wir dir, es online zu zeigen. Wir gestalten eine persönliche Landingpage, auf der Menschen verstehen, was du anbietest und wie sie mit dir in Kontakt kommen.</p>
              <p className="mt-5 font-serif text-4xl text-[#efdca8]">{websitePrice} €</p>
              <p className="mt-2 mb-6 text-sm leading-6 text-[#ebf0e7]">Optional zur Raunächte-Begleitung. Im Special enthalten sind eine Seite für dein Angebot, Text, Gestaltung, mobile Ansicht, die Verlinkung zu deiner Buchung oder deinem Kontakt und eine Korrekturrunde.</p>
              <div className="mt-auto">
                <Link to={contact} className={gold}>Website-Special anfragen <ArrowUpRight size={17} aria-hidden="true" /></Link>
                <p className="mt-3 text-xs leading-5 text-[#dbe7d8]">Mit der Anfrage klären wir, ob das Special zu deinem Vorhaben passt.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <footer className="bg-[#10352f] py-8 text-[#eff5ec]">
        <div className={`${width} flex flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between`}>
          <Link to="/" className="font-semibold">Spirit Healing · Sabine &amp; Selcan</Link>
          <nav aria-label="Rechtliche Hinweise" className="flex flex-wrap gap-x-5 gap-y-3">
            <Link to="/impressum" className="hover:underline">Impressum</Link>
            <Link to="/datenschutz" className="hover:underline">Datenschutz</Link>
            <Link to="/kontakt" className="hover:underline">Kontakt</Link>
          </nav>
        </div>
      </footer>
    </main>
  )
}
