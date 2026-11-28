import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, CalendarDays, Check, Facebook, Headphones, Instagram, MoonStar, PanelsTopLeft, Video, Youtube } from "lucide-react"
import { contactOfferUrl } from "../lib/contactOffers.js"
import { raunaechteOfferEndsAt as offerEnds } from "../../shared/raunaechteOffer.js"

const standardPrice = 111
const launchPrice = 88
const websitePrice = 600
const socialProfiles = [
  [TikTokIcon, "TikTok", "https://www.tiktok.com/@spirit4healing"],
  [Youtube, "YouTube", "https://www.youtube.com/@spirit4healing"],
  [Facebook, "Facebook", "https://www.facebook.com/profile.php?id=61588723230682"],
  [Instagram, "Instagram", "https://www.instagram.com/spirit4healing/"],
]

function TikTokIcon({ size, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" {...props}>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  )
}

function checkoutFor(offerActive) {
  return `/api/raunaechte/checkout?preis=${offerActive ? launchPrice : standardPrice}`
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

function bindRaunFlight(root) {
  const stage = root?.querySelector("[data-raun-flight-stage]")
  const bird = stage?.querySelector(".raun-kolibri")
  if (!stage || !bird || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined

  function play() {
    window.removeEventListener("scroll", onScroll)
    bird.classList.remove("is-flying")
    void bird.offsetWidth
    bird.classList.add("is-flying")
  }

  function onScroll() {
    const { top, bottom, height } = stage.getBoundingClientRect()
    const visible = Math.min(window.innerHeight, bottom) - Math.max(0, top)
    if (visible >= Math.min(height * 0.5, 240)) play()
  }

  const trigger = stage.querySelector("[data-raun-flight-play]")
  trigger.addEventListener("click", play)
  stage.addEventListener("raun-flight-replay", play)
  window.addEventListener("scroll", onScroll, { passive: true })
  return () => {
    trigger.removeEventListener("click", play)
    stage.removeEventListener("raun-flight-replay", play)
    window.removeEventListener("scroll", onScroll)
  }
}

const meetings = [
  { date: "23. Dezember", time: "2026-12-23T19:00:00+01:00", title: "Eröffnung", description: "Wir meditieren gemeinsam und bereiten die 13 Wünsche vor. Das Ziehen beginnt in der ersten Raunacht am 25. Dezember." },
  { date: "30. Dezember", time: "2026-12-30T19:00:00+01:00", title: "Zwischenreflexion", description: "In einer gemeinsamen Meditation nehmen wir die ersten Nächte auf und hören darauf, was für dein Vorhaben deutlicher geworden ist." },
  { date: "6. Januar", time: "2027-01-06T19:00:00+01:00", title: "Abschluss", description: "Nach der gemeinsamen Meditation öffnest du den 13. Wunsch und gibst deiner Jahresessenz Worte. Im Anschluss stellen wir dir unsere Jahresbegleitung vor." },
]

const included = [
  [Headphones, "Zwölf Meditationen per E-Mail", "Vom 25. Dezember bis 5. Januar bekommst du jeden Abend eine geführte Meditation und einen kurzen Begleittext von uns."],
  [BookOpen, "Dein Raunächte-Workbook als PDF", "Du erhältst es per E-Mail zum Download. Für jede der zwölf Nächte gibt es eine Doppelseite mit einer Aufgabe für den Abend und Platz für deine Wahrnehmungen, Träume und Fragen."],
  [MoonStar, "Das Ritual der 13 Wünsche", "In jeder Nacht öffnest du einen Wunsch und hältst ihn beim passenden Monat fest. Aus dem letzten Wunsch formulierst du am Abschlussabend deine Jahresessenz."],
  [Video, "Drei Live-Abende mit Meditation", "Wir meditieren gemeinsam bei der Eröffnung, bei der Zwischenreflexion und am Abschlussabend."],
]

const width = "mx-auto max-w-[78rem] px-5 sm:px-9 lg:px-12"
const primary = "inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#164942] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#0c3732] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#164942]"
const gold = "inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#efdca8] px-6 py-3.5 text-sm font-bold text-[#123b35] transition hover:bg-[#fff0c7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#efdca8]"

const heroMotion = `
  .raun-snow { position: fixed; inset: 0; z-index: 40; overflow: hidden; pointer-events: none; }
  .raun-snow span { position: absolute; top: -12px; width: var(--size); height: var(--size); border-radius: 50%; background: #fff; opacity: .65; box-shadow: 0 0 3px #a5bbb080; animation: raun-snowfall var(--duration) linear var(--delay) infinite; }
  @keyframes raun-snowfall { from { transform: translate3d(0,-2vh,0); } to { transform: translate3d(35px,105vh,0); } }
  .raun-portrait { animation: raun-portrait-arrives 1.35s cubic-bezier(.2,.65,.3,1) both; }
  .raun-kolibri {
    transform-origin: 53% 49%;
    opacity: 0;
    filter: drop-shadow(0 3px 6px #2a23147a);
  }
  .raun-kolibri-body { clip-path: polygon(31.1% 35.8%, 35.7% 35.6%, 41.7% 36.7%, 45% 35.1%, 48.5% 35%, 51.3% 37.2%, 52.4% 41.4%, 53.4% 43.4%, 55% 43.3%, 58.5% 44.7%, 60.5% 50.1%, 62.8% 56.5%, 65.9% 64.3%, 67.1% 69.8%, 65.8% 75.3%, 61.8% 80.3%, 57.1% 84%, 56.5% 86.1%, 58.5% 88.2%, 56.4% 88.1%, 56.1% 85.2%, 58.4% 80.7%, 62.1% 75.7%, 63.8% 69.1%, 60% 74.5%, 54.5% 79.9%, 48% 84.2%, 46.8% 87.5%, 47.6% 90.5%, 45.3% 88.8%, 45.6% 83.9%, 48.5% 79.3%, 50.7% 77.4%, 43.9% 78.9%, 37.4% 79.6%, 33.4% 82.4%, 32.8% 86.2%, 36.5% 89%, 39.7% 87.6%, 39.8% 84.9%, 37.2% 83.6%, 36.6% 85.8%, 35.6% 84.3%, 37.4% 82.5%, 40.2% 82.7%, 41% 85.7%, 39.8% 88.7%, 36.3% 90%, 32.2% 88.8%, 30.9% 85.3%, 31.5% 81.8%, 34.8% 77.7%, 41.1% 75.8%, 46% 76.1%, 41.4% 74.9%, 37.6% 72.4%, 37% 68.8%, 38.6% 65.4%, 41.2% 64.1%, 44.9% 64.7%, 47.1% 67%, 45.9% 70%, 43.9% 70.2%, 45.3% 68.5%, 44.9% 67.1%, 41.9% 66.9%, 39.6% 68.8%, 40.2% 72%, 45.3% 74.3%, 50.6% 74.3%, 54.1% 72%, 57.3% 69.1%, 59.6% 64.5%, 58.9% 60.2%, 56.7% 57.8%, 54.2% 57.5%, 54.7% 59.7%, 52.5% 59.6%, 51.8% 58.3%, 52.9% 57.1%, 49.1% 55.5%, 46.3% 52.7%, 44.8% 49.2%, 43.9% 44.4%, 42.6% 41%, 40.3% 38.9%, 36.3% 37%); }
  .raun-kolibri-wings {
    clip-path: polygon(52.2% 46.5%, 53.4% 43.4%, 55.1% 36.7%, 58.6% 31.1%, 63.2% 24.8%, 64.9% 18.9%, 65.8% 22.8%, 65.6% 28.2%, 67.2% 23%, 67.3% 27.8%, 64.4% 32.6%, 67.9% 28%, 66.7% 32.2%, 74% 24.4%, 77.7% 19.9%, 79.1% 14.8%, 80.1% 19.3%, 79.3% 23.8%, 76.7% 27.9%, 81.9% 24.7%, 81.5% 28.1%, 78.8% 32.4%, 74.2% 36.6%, 80.9% 32.6%, 79.5% 35.6%, 76.6% 38.4%, 72.5% 41%, 77.7% 39.8%, 75.4% 42.6%, 72.5% 44.4%, 73.9% 44.7%, 70.5% 46.5%, 73.2% 46.3%, 69.3% 49.3%, 66.9% 50.1%, 64% 49.9%, 67% 51.6%, 63.6% 51.6%, 60.5% 50.1%, 56% 49%);
    transform-origin: 54% 46%;
  }
  .raun-kolibri.is-flying { animation: raun-kolibri-flight 4.35s both; }
  .raun-kolibri.is-flying .raun-kolibri-wings {
    animation: raun-kolibri-wing .19s ease-in-out alternate 23 both;
  }
  @keyframes raun-portrait-arrives {
    from { transform: scale(1.035); }
    to { transform: scale(1); }
  }
  @keyframes raun-kolibri-flight {
    0%, 3% { transform: translate(0, 0) scale(1); opacity: 0; }
    12% { transform: translate(6%, -23%) scale(1.12) rotate(-7deg); opacity: 1; animation-timing-function: cubic-bezier(.12,.58,.38,.96); }
    35% { transform: translate(68%, -94%) scale(1.47) rotate(-11deg); opacity: 1; animation-timing-function: ease-in-out; }
    48% { transform: translate(81%, -110%) scale(1.42) rotate(4deg); opacity: 1; animation-timing-function: ease-in-out; }
    62% { transform: translate(94%, -100%) scale(1.43) rotate(-4deg); opacity: 1; animation-timing-function: cubic-bezier(.38,.02,.72,.72); }
    86% { transform: translate(161%, -159%) scale(1.18) rotate(12deg); opacity: 1; }
    100% { transform: translate(229%, -209%) scale(.98) rotate(16deg); opacity: 0; }
  }
  @keyframes raun-kolibri-wing {
    from { transform: skewX(6deg) scaleY(1.04) rotate(4deg); }
    to { transform: skewX(-17deg) scaleY(.55) rotate(-13deg); }
  }
  @supports (animation-timeline: view()) {
    .raun-detail-in { animation: raun-detail-in linear both; animation-timeline: view(); animation-range: entry 4% cover 28%; }
    @keyframes raun-detail-in {
      from { opacity: .72; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .raun-snow { display: none; }
    .raun-portrait, .raun-detail-in { animation: none; }
    .raun-kolibri, .raun-flight-play { display: none; animation: none; }
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
      <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#765820]">Verlängert bis Cyber Monday</p>
      <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <p className={`${compact ? "text-4xl" : "text-6xl"} font-serif font-semibold leading-none`}>{launchPrice} €</p>
        <s className={`${compact ? "text-2xl" : "text-4xl"} font-serif font-semibold leading-none text-[#49625b] decoration-[#9c7335] decoration-2`}>{standardPrice} €</s>
      </div>
      <div className="mt-3"><Countdown remainingMs={remainingMs} /></div>
      <p className="mt-2 text-xs leading-5 text-[#49625b]">Aktionspreis bis Montag, 30.11.2026, 23:59 Uhr deutscher Zeit.</p>
    </div>
  ) : <p className={`${compact ? "text-3xl" : "text-6xl"} font-serif font-semibold leading-none`}>{standardPrice} €</p>
}

export function Rauhnaechte() {
  const page = useRef(null)
  const [remainingMs, setRemainingMs] = useLaunchClock()
  const offerActive = remainingMs > 0
  const checkout = checkoutFor(offerActive)
  const contact = contactOfferUrl("raunachtWebsite")
  useEffect(() => bindRaunFlight(page.current), [])

  return (
    <main ref={page} data-no-translate className="min-h-screen bg-[#fbf8f0] text-[#163d35]">
      <style>{heroMotion}</style>
      <div className="raun-snow" aria-hidden="true">{Array.from({ length: 26 }, (_, i) => <span key={i} style={{ left: `${(i * 37 + 5) % 100}%`, '--size': `${3 + i % 4}px`, '--duration': `${10 + i % 7}s`, '--delay': `${-(i * 1.7) % 16}s` }} />)}</div>
      <a href="#inhalt" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-3">Zum Inhalt</a>
      <header className="border-b border-[#dedacb] bg-[#fffdf7]">
        <div className={`${width} flex min-h-19 items-center justify-between gap-4`}>
          <Link to="/" aria-label="Spirit Healing · Startseite" className="flex shrink-0 items-center gap-2.5 font-semibold tracking-[0.13em] uppercase">
            <img src="/Logo-tuerkis.jpeg?v=20260730" alt="" width="46" height="46" className="h-11 w-11 rounded-full object-cover" />
            <span className="text-xs">Spirit Healing</span>
          </Link>
          <nav aria-label="Auf dieser Seite" className="hidden items-center gap-7 text-sm font-semibold md:flex">
            <a href="#raunaechte-qualitaet" className="hover:underline">Die Raunächte</a>
            <a href="#programm" className="hover:underline">Programm</a>
            <a href="#workbook" className="hover:underline">Workbook</a>
          </nav>
          <a href="#rauhnaechte-buchen" className={`${primary} shrink-0 !px-4 sm:!px-6`}>Zur Buchung <ArrowUpRight size={15} aria-hidden="true" /></a>
        </div>
      </header>

      <section id="inhalt" className="relative isolate overflow-hidden border-b border-[#e7dfce] bg-[radial-gradient(ellipse_at_top_left,#fffdf8_30%,#f3ead7_100%)]">
        <div className={`${width} grid items-center gap-12 pb-16 pt-12 md:pb-22 lg:grid-cols-[1.03fr_.97fr] lg:gap-15 lg:pb-24 lg:pt-16`}>
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.17em] text-[#715520]"><MoonStar size={17} aria-hidden="true" /> Raunächte 2026/27 mit Sabine und Selcan</p>
            <h1 className="mt-5 max-w-[46rem] font-serif text-[clamp(2.85rem,6.15vw,5.9rem)] font-medium leading-[0.98] tracking-[-0.052em]">Was möchtest du 2027 <em className="font-normal text-[#407169]">in die Welt bringen?</em></h1>
            <p className="mt-6 max-w-[35rem] text-[clamp(1.06rem,1.4vw,1.26rem)] leading-relaxed text-[#405d55]">Die Raunächte sind die zwölf Nächte zwischen den Jahren. Das alte Jahr klingt nach und das neue hat seinen Alltag noch vor sich. In diesem Dazwischen kannst du wahrnehmen, was du lange mit dir getragen hast und was durch dich Gestalt annehmen möchte.</p>
            <p className="mt-3 max-w-[35rem] leading-7 text-[#405d55]">Wir begleiten dich Abend für Abend. Jede Nacht gehört einem Monat. So bekommt dein Vorhaben Zeit, sich zu klären, und du kannst ihm am Abschlussabend einen ersten Schritt geben.</p>
            <p className="mt-6 flex items-start gap-2.5 text-sm font-semibold"><CalendarDays size={19} className="shrink-0 text-[#715520]" aria-hidden="true" /> 23. Dezember 2026 bis 6. Januar 2027 · online</p>
            <div className="mt-6 border-y border-[#d9cdb3] py-4"><Price offerActive={offerActive} remainingMs={remainingMs} compact /></div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href="#rauhnaechte-buchen" className={primary}>Bei den Raunächten dabei sein <ArrowRight size={17} aria-hidden="true" /></a>
              <a href="#raunaechte-qualitaet" className="inline-flex min-h-12 items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline">Warum gerade die Raunächte? <ArrowDown size={15} aria-hidden="true" /></a>
            </div>
          </div>

          <figure data-raun-flight-stage className="relative mx-auto w-full max-w-[37rem] pb-4 pl-3 sm:pl-6">
            <div className="relative isolate aspect-[5/5.7] overflow-hidden rounded-[2rem] bg-[#24463d] shadow-[0_22px_55px_#263f342e] sm:rounded-[2.7rem]">
              <img className="raun-portrait h-full w-full object-cover object-[50%_43%]" src="/rauhnaechte-spirit-healing.png" alt="Sabine und Selcan im Kerzenlicht bei einem winterlichen Raunachtsritual" fetchPriority="high" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#112d28]/85 via-transparent to-transparent" aria-hidden="true" />
            </div>
            <div className="pointer-events-none absolute bottom-8 left-5 z-10 h-20 w-20 sm:left-8 sm:h-24 sm:w-24" aria-hidden="true">
              <img src="/Logo-tuerkis.jpeg?v=20260730" alt="" className="absolute inset-0 h-full w-full rounded-full drop-shadow-[0_7px_11px_#10251d55]" />
              <span className="raun-kolibri absolute inset-0 block">
                <img src="/Logo-tuerkis.jpeg?v=20260730" alt="" className="raun-kolibri-body absolute inset-0 h-full w-full" />
                <img src="/Logo-tuerkis.jpeg?v=20260730" alt="" className="raun-kolibri-wings absolute inset-0 h-full w-full" />
              </span>
            </div>
            <button type="button" data-raun-flight-play className="raun-flight-play absolute right-4 top-4 z-20 min-h-10 rounded-full bg-[#fffdf7]/95 px-3.5 text-xs font-bold text-[#164942] shadow-sm hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white">Kolibri fliegen lassen</button>
            <figcaption className="absolute inset-x-0 bottom-4 py-6 pl-29 pr-5 text-sm text-white sm:pl-36"><strong className="block font-serif text-xl font-normal sm:text-2xl">Sabine &amp; Selcan</strong><span>Begleiten dich durch die Raunächte</span></figcaption>
          </figure>
        </div>
      </section>

      <section id="raunaechte-qualitaet" aria-labelledby="raunaechte-qualitaet-heading" className="scroll-mt-6 border-b border-[#e7dfce] bg-[#fffdf7] py-15 lg:py-21">
        <div className={`${width} grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-16`}>
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.17em] text-[#765820]">Die Zeit zwischen den Jahren</p>
            <h2 id="raunaechte-qualitaet-heading" className="max-w-md font-serif text-[clamp(2.35rem,4.25vw,4.25rem)] leading-[1.02] tracking-[-0.045em]">Warum gerade die Raunächte?</h2>
          </div>
          <div className="space-y-5 border-l-2 border-[#dcc38b] pl-5 text-[#405d55] sm:pl-7">
            <p className="leading-7 sm:text-lg sm:leading-8">Im Brauchtum steht jede der zwölf Nächte für einen Monat des kommenden Jahres. Die Menschen achteten in dieser Zeit auf ihre Träume und auf das, was ihnen im Alltag auffiel. Uns spricht daran an, wie aufmerksam man an einer Schwelle werden kann. Das Vertraute klingt noch nach, während für das Neue schon Platz da ist.</p>
            <p className="leading-7 sm:text-lg sm:leading-8">Diese Aufmerksamkeit holen wir in jede Nacht. In der Meditation hörst du darauf, was dein Vorhaben in dir berührt. Beim Schreiben hältst du fest, was sich zeigt. Über die Abende hinweg bemerkst du vielleicht, welcher Wunsch wiederkommt, welche Sorge dich bisher begleitet hat und wofür du deine Kraft heute einsetzen möchtest.</p>
            <p className="leading-7 sm:text-lg sm:leading-8">Am 6. Januar kommen wir noch einmal zusammen. Du öffnest den Wunsch, der übrig geblieben ist, und findest deinen Satz für das Jahr. Dazu wählst du eine Handlung, mit der du in der ersten Woche beginnen kannst.</p>
          </div>
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
              <p className="mt-4 leading-7 text-[#405d55]">2026 konnte sich herausfordernd anfühlen, weil Entscheidungen anstanden, während das Neue erst langsam Form annahm. Vielleicht hast du längst gespürt, dass etwas in deinem Leben eine andere Richtung braucht. Gleichzeitig liefen die Arbeit, die Familie und die Vereinbarungen weiter. Es kostet Kraft, all das zu halten und einer Ahnung Raum zu geben, für die du erst noch Worte finden musst.</p>
              <p className="mt-4 leading-7 text-[#405d55]">Vielleicht hast du in diesem Jahr gemerkt, wie gut du Verantwortung übernehmen, mitdenken oder für Verbindung sorgen kannst. Und wie müde du wirst, wenn jede dieser Fähigkeiten automatisch denselben Auftrag bekommt. Zwischen den Jahren darfst du würdigen, was du getragen hast, und dir die Frage stellen: Wofür will ich diese Kraft heute einsetzen?</p>
            </article>
            <article className="rounded-[1.6rem] border border-[#d3ddcf] bg-[#fffdf7] p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#765820]">Ausblick auf 2027</p>
              <h3 className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">Was möchte durch mich Gestalt annehmen?</h3>
              <p className="mt-4 leading-7 text-[#405d55]">Am Anfang des neuen Jahres kannst du dir Zeit geben, deine Kraft neu einzuteilen. Dann kommt ein Moment, in dem du ausprobieren darfst, was du lange in dir bewegt hast. Wenn es nach und nach sichtbar wird, stellt sich eine praktische Frage. Welche Form passt zu deinem Leben, sodass dein Vorhaben auch in einer ganz gewöhnlichen Woche seinen Platz behält?</p>
              <p className="mt-4 leading-7 text-[#405d55]">Vielleicht heißt das für dich, zum ersten Mal auszusprechen, was du anbieten möchtest. Vielleicht brauchst du eine klare Abmachung über Zeit, damit dein Vorhaben einen Platz bekommt. Du kannst deine Richtung aus dem wählen, was du im Körper wahrnimmst, was dir wirklich wichtig ist und wofür du bereit bist, Verantwortung zu übernehmen.</p>
            </article>
          </div>

          <div className="mt-5 grid gap-4 rounded-[1.6rem] bg-[#164942] p-6 text-[#fffaf0] sm:p-8 lg:grid-cols-[.88fr_1.12fr] lg:items-center lg:gap-10">
            <p className="font-serif text-[clamp(1.6rem,3vw,2.5rem)] leading-tight">Was soll durch dich einen Platz in der Welt bekommen?</p>
            <p className="leading-7 text-[#f2f4ea]">Ein Vorhaben genügt für den Anfang. Wenn du im Laufe der Nächte klarer siehst, was dich ruft, darf sich seine Form verändern. Vielleicht beginnt es mit einer Idee für deine Arbeit und führt dich zu einer Frage, die dein ganzes Leben berührt.</p>
          </div>
        </div>
      </section>

      <section id="programm" className={`${width} scroll-mt-6 py-16 lg:py-24`}>
        <div className="grid gap-5 lg:grid-cols-[.95fr_1.05fr] lg:items-end lg:gap-14">
          <h2 className="max-w-[37rem] font-serif text-[clamp(2.5rem,4.25vw,4.25rem)] leading-[1.02] tracking-[-0.045em]">Zwölf Nächte für dein Vorhaben</h2>
          <p className="max-w-[38rem] leading-relaxed text-[#49625b] sm:text-lg">Du nimmst ein Vorhaben mit in den Kreis. Jede Nacht öffnet einen anderen Blick auf dein Jahr. Nach der Meditation hältst du fest, was du wahrgenommen hast und welche Handlung sich daraus für dich ergibt.</p>
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

      <section aria-labelledby="abend-ablauf" className="bg-[#153c35] py-15 text-[#fffaf0] lg:py-22">
        <div className={`${width} grid items-center gap-9 lg:grid-cols-[.95fr_1.05fr] lg:gap-15`}>
          <figure className="raun-detail-in overflow-hidden rounded-[1.7rem] border border-[#d9c69c]/25 bg-[#234840] shadow-[0_14px_45px_#0e242029]">
            <img src="/raunaechte-kaminabend.jpg" alt="Eine Frau im Strickpullover hält eine Tasse und sitzt vor dem Kamin in einer Winternacht" loading="lazy" className="aspect-[1.38] h-full w-full object-cover" />
          </figure>
          <div>
            <h2 id="abend-ablauf" className="max-w-lg font-serif text-[clamp(2.2rem,4vw,4rem)] leading-[1.02] tracking-[-0.04em]">Eine Nacht, die dir gehört</h2>
            <p className="mt-4 leading-7 text-[#e6eee4]">Wenn der Tag leiser wird, machst du dir einen Platz. Vielleicht ist dein Kopf noch bei einem Gespräch oder bei dem, was morgen ansteht. Die Meditation gibt dir einen Moment, in dem du den Boden spürst und bemerkst, was du heute alles mitgebracht hast.</p>
            <ol className="mt-6 space-y-3 text-sm leading-6 text-[#f5f3e9]">
              <li className="border-t border-white/20 pt-3"><strong className="text-[#efdca8]">Öffnen und nachspüren.</strong> Du ziehst einen Wunschzettel, öffnest ihn und liest deinen Wunsch. Wenn du ihn vor der Meditation ziehst, kannst du ihn mit hineinnehmen. Du kannst ihn auch danach ziehen und ihm in Ruhe nachspüren.</li>
              <li className="border-t border-white/20 pt-3"><strong className="text-[#efdca8]">Festhalten.</strong> Du trägst den Wunsch im Workbook beim Monat dieser Nacht ein. Die erste Nacht steht für Januar, die zweite für Februar und so weiter. Dort ist auch Platz für deine Wahrnehmungen und die Aufgabe des Abends.</li>
              <li className="border-t border-white/20 pt-3"><strong className="text-[#efdca8]">Übergeben.</strong> Wenn dein Wunsch im Workbook steht, übergibst du den Zettel dem Feuer. Der letzte Wunsch bleibt bis zum gemeinsamen Abschluss bei dir.</li>
            </ol>
          </div>
        </div>
      </section>

      <section id="workbook" aria-labelledby="workbook-heading" className="scroll-mt-6 border-b border-[#e2dac4] bg-[#f6f0e0] py-16 lg:py-24">
        <div className={`${width} grid items-center gap-9 lg:grid-cols-[1.05fr_.95fr] lg:gap-18`}>
          <figure className="raun-detail-in mx-auto grid min-h-[21rem] w-full max-w-[33rem] place-items-center overflow-hidden rounded-[1.65rem] border border-[#e0d2b1] bg-[radial-gradient(ellipse_at_20%_8%,#fcf9ee_10%,#e3d6b7_100%)] px-8 py-10 sm:min-h-[25.5rem]">
            <img src="/raunaechte-workbook-cover.jpg" alt="Cover des Raunächte-Workbooks mit gefalteten Wunschzetteln im Glas auf dem Kaminsims" loading="lazy" className="w-[68%] max-w-[16rem] -rotate-[5deg] rounded-sm border border-[#d7c5a1] shadow-[0_18px_34px_#55412557]" />
          </figure>
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.17em] text-[#765820]">Schreiben zwischen den Jahren</p>
            <h2 id="workbook-heading" className="max-w-lg font-serif text-[clamp(2.2rem,4.1vw,4.05rem)] leading-[1.02] tracking-[-0.044em]">Dein Workbook für die Raunächte</h2>
            <p className="mt-4 leading-7 text-[#405d55]">Du erhältst dein Workbook als PDF per E-Mail zum Download. Du kannst es bei Bedarf selbst ausdrucken. Es wird kein gedrucktes Workbook per Post verschickt.</p>
            <p className="mt-4 leading-7 text-[#405d55]">Auf der Doppelseite jeder Nacht findest du den Monat, zu dem sie gehört. Dort trägst du deinen gezogenen Wunsch ein, hältst fest, was du gespürt oder geträumt hast, und bearbeitest die Aufgabe für den Abend. Wenn der Monat 2027 beginnt, kannst du den Wunsch und deine Notizen wieder aufschlagen.</p>
            <ul className="mt-5 space-y-2 text-sm leading-6 text-[#405d55]">
              <li className="flex gap-2.5"><Check size={17} className="mt-0.5 shrink-0 text-[#527d63]" aria-hidden="true" /> Rückblick auf 2026 und 13 Wunschzettel zum Ausschneiden</li>
              <li className="flex gap-2.5"><Check size={17} className="mt-0.5 shrink-0 text-[#527d63]" aria-hidden="true" /> Zwölf Doppelseiten zum Schreiben und Ausprobieren in den Nächten</li>
              <li className="flex gap-2.5"><Check size={17} className="mt-0.5 shrink-0 text-[#527d63]" aria-hidden="true" /> Am Ende Platz für deine Jahresessenz, deinen ersten Schritt und die Weiterarbeit in 2027</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="termine" className={`${width} scroll-mt-6 py-16 lg:py-24`}>
        <h2 className="font-serif text-[clamp(2.45rem,4.25vw,4rem)] leading-none tracking-[-0.04em]">Unsere Live-Abende</h2>
        <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#49625b]"><Video size={18} aria-hidden="true" /> Drei Live-Abende mit gemeinsamer Meditation, jeweils um 19 Uhr deutscher Zeit über Zoom.</p>
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
              <p className="mt-3 text-sm leading-6 text-[#49625b]">Einmalzahlung für deine Begleitung von der Eröffnung bis zum Abschluss. Das Workbook begleitet dich in allen zwölf Nächten. Am letzten Abend hältst du deine Jahresessenz und einen ersten Schritt für dein Vorhaben fest.</p>
              <ul className="mb-7 mt-5 space-y-2 text-sm leading-6">
                {["Zwölf geführte Meditationen mit Begleittext per E-Mail", "Workbook als PDF per E-Mail und 13-Wünsche-Ritual", "Drei Live-Abende mit gemeinsamer Meditation"].map((item) => <li key={item} className="flex items-start gap-2.5"><Check size={17} className="mt-0.5 shrink-0 text-[#527d63]" aria-hidden="true" />{item}</li>)}
              </ul>
              <div className="mt-auto">
                <a href={checkout} onClick={(event) => {
                  const currentRemainingMs = Math.max(0, offerEnds - Date.now())
                  if ((currentRemainingMs > 0) !== offerActive) {
                    event.preventDefault()
                    setRemainingMs(currentRemainingMs)
                  }
                }} className={primary}>Für {offerActive ? launchPrice : standardPrice} € buchen <ArrowRight size={17} aria-hidden="true" /></a>
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
        <div className={`${width} flex flex-col gap-5 text-sm md:flex-row md:flex-wrap md:items-center md:justify-between`}>
          <Link to="/" className="font-semibold">Spirit Healing · Sabine &amp; Selcan</Link>
          <nav aria-label="Spirit Healing in den sozialen Medien" className="flex flex-wrap items-center gap-2.5">
            {socialProfiles.map(([Icon, name, href]) => (
              <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Spirit Healing auf ${name}`} title={name} className="flex h-11 w-11 items-center justify-center rounded-full border border-[#efdca8]/45 text-[#efdca8] transition-colors hover:border-[#efdca8] hover:bg-[#efdca8] hover:text-[#10352f] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#efdca8]">
                <Icon size={19} aria-hidden="true" />
              </a>
            ))}
          </nav>
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
