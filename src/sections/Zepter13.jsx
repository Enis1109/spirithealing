import { Link } from "react-router-dom"
import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  HeartHandshake,
} from "lucide-react"

const checkoutLinks = {
  gemeinsamEinmalig: import.meta.env.VITE_ZEPTER_GEMEINSAM_CHECKOUT_URL || "https://book.stripe.com/5kQbJ3b7Yf4NeVB4Jp83C0J",
  gemeinsamZweiRaten: import.meta.env.VITE_ZEPTER_GEMEINSAM_ZWEI_RATEN_URL || "https://book.stripe.com/cNi28t6RI9Kt00H4Jp83C0F",
  gemeinsamDreiRaten: import.meta.env.VITE_ZEPTER_GEMEINSAM_DREI_RATEN_URL || "https://book.stripe.com/dRmaEZcc2bSB4gXa3J83C0G",
  vertieftEinmalig: import.meta.env.VITE_ZEPTER_VERTIEFT_CHECKOUT_URL || "https://book.stripe.com/14A28t3Fwe0JeVB8ZF83C0K",
  vertieftZweiRaten: import.meta.env.VITE_ZEPTER_VERTIEFT_ZWEI_RATEN_URL || "https://book.stripe.com/eVq5kF2Bs2i1aFl2Bh83C0N",
  vertieftDreiRaten: import.meta.env.VITE_ZEPTER_VERTIEFT_DREI_RATEN_URL || "https://book.stripe.com/bJedRb1xo4q900H3Fl83C0M",
  persoenlichEinmalig: import.meta.env.VITE_ZEPTER_PERSOENLICH_CHECKOUT_URL || "https://book.stripe.com/cNi6oJdg63m59Bh4Jp83C0Q",
  persoenlichZweiRaten: import.meta.env.VITE_ZEPTER_PERSOENLICH_ZWEI_RATEN_URL || "https://book.stripe.com/3cIbJ3gsi8Gp7t93Fl83C0R",
  persoenlichDreiRaten: import.meta.env.VITE_ZEPTER_PERSOENLICH_DREI_RATEN_URL || "https://book.stripe.com/bJecN73Fwg8ReVB4Jp83C0S",
}

const recurringScenes = [
  "Du sagst Ja, obwohl in dir längst ein Nein lebt.",
  "Du gerätst in ähnliche Beziehungen, Konflikte oder Abhängigkeiten – nur mit anderen Gesichtern.",
  "Du übernimmst Verantwortung für alle und spürst dich selbst erst, wenn nichts mehr geht.",
  "Du weißt, dass mehr in dir liegt, aber etwas hält dich kurz vor dem nächsten Schritt zurück.",
  "Du funktionierst, kontrollierst oder passt dich an – und nennst es Alltag.",
]

const shifts = [
  {
    from: "Du reagierst, bevor du überhaupt merkst, was in dir geschehen ist.",
    to: "Du erkennst den inneren Moment, in dem wieder eine echte Wahl möglich wird.",
  },
  {
    from: "Andere bekommen immer wieder dieselben Rollen in deinem Leben.",
    to: "Du begegnest Menschen, ohne sie unbewusst für dein altes Drehbuch zu besetzen.",
  },
  {
    from: "Ein Schutzanteil hält das Zepter und versucht, dein Überleben zu sichern.",
    to: "Du verstehst seine Aufgabe und übernimmst aus deinem heutigen Selbst die Führung.",
  },
  {
    from: "Dein Potenzial bleibt eine Ahnung, über die du nachdenkst.",
    to: "Deine Schöpferkraft zeigt sich in dem, was du aussprichst, entscheidest und wirklich tust.",
  },
]

const included = [
  "13 Wochen geführter Prozess mit einem wöchentlichen Live-Termin",
  "Ein begleitetes Matrix-Gespräch zu Beginn, in dem dein unbewusstes Drehbuch sichtbar werden darf",
  "Dein persönlicher Start- und Integrationsplan",
  "Tägliche energetische Begleitung mit Tagesimpuls und Meditationen, die aus dem aktuellen Gruppenprozess entstehen",
  "Aufzeichnungen der Live-Termine",
  "Begleitendes Workbook mit Übungen und Reflexionsfragen",
  "Kurze Impulse für die Umsetzung zwischen den Terminen",
  "Austausch in einer geschützten Spirit-Healing-Community",
  "Das vollständige Rauhnachtsprogramm innerhalb der gemeinsamen Reise",
  "Abschluss und persönlicher 90-Tage-Ausblick",
]

const tiers = [
  {
    name: "Gemeinsamer Weg",
    price: "1.555 €",
    intro: "Der vollständige Prozess im gemeinsamen Spirit-Healing-Raum.",
    items: [
      "Alle 13 wöchentlichen Live-Termine",
      "Matrix-Gespräch zu Beginn",
      "Persönlicher Start- und Integrationsplan",
      "Tägliche energetische Begleitung mit Tagesimpuls und aus der Gruppe entstehenden Meditationen",
      "Aufzeichnungen, Workbook und Wochenimpulse",
      "Community-Begleitung; Fragen werden aufgegriffen, wenn sie für den Gruppenprozess relevant sind",
      "Vollständiges Rauhnachtsprogramm",
    ],
    checkout: checkoutLinks.gemeinsamEinmalig,
    twoInstallments: { label: "2 × 816 €", total: "1.632 €", checkout: checkoutLinks.gemeinsamZweiRaten },
    threeInstallments: { label: "3 × 544 €", total: "1.632 €", checkout: checkoutLinks.gemeinsamDreiRaten },
  },
  {
    name: "Vertiefter Weg",
    price: "2.777 €",
    intro: "Für dich, wenn du regelmäßig persönlich reflektieren und schriftlich nachvollziehen möchtest, was sich in dir verändert.",
    items: [
      "Alles aus dem Gemeinsamen Weg",
      "Schriftliche Ausarbeitung deines Matrix-Gesprächs",
      "Sechs zusätzliche Kleingruppen-Calls im Zwei-Wochen-Rhythmus für persönliche Fragen und Integration",
      "Ein gemeinsames Einzelsetting mit Sabine und Selcan vor den Rauhnächten",
      "Persönliche schriftliche Prozessauswertung nach jeder vierwöchigen Phase",
      "Abschließendes schriftliches Entwicklungsprotokoll",
      "Freiwillige Peer-Räume zum Üben und für Erfahrungsaustausch in kleiner Runde",
    ],
    featured: true,
    checkout: checkoutLinks.vertieftEinmalig,
    twoInstallments: { label: "2 × 1.458 €", total: "2.916 €", checkout: checkoutLinks.vertieftZweiRaten },
    threeInstallments: { label: "3 × 972 €", total: "2.916 €", checkout: checkoutLinks.vertieftDreiRaten },
  },
  {
    name: "Persönlicher Weg",
    price: "4.444 €",
    intro: "Die engste Begleitung für einen Prozess, der täglich auf deine persönliche Bewegung reagieren darf.",
    items: [
      "Alles aus dem Vertieften Weg",
      "Insgesamt drei persönliche Tandem-Settings mit Sabine und Selcan",
      "Wöchentliche persönliche schriftliche Prozessauswertung",
      "Täglich ein individuell auf deinen Prozess zugeschnittener Impuls",
      "Antwort auf jede persönliche Anfrage im vereinbarten privaten Nachrichtenrahmen, werktags innerhalb von 48 Stunden",
      "Auf vier Plätze begrenzt",
    ],
    checkout: checkoutLinks.persoenlichEinmalig,
    twoInstallments: { label: "2 × 2.334 €", total: "4.668 €", checkout: checkoutLinks.persoenlichZweiRaten },
    threeInstallments: { label: "3 × 1.556 €", total: "4.668 €", checkout: checkoutLinks.persoenlichDreiRaten },
  },
]

const questions = [
  {
    title: "Brauche ich Vorkenntnisse in Anteilearbeit oder Matrixarbeit?",
    text: "Nein. Der Einstieg ist so gestaltet, dass du die Begriffe und Zusammenhänge von Grund auf verständlich und praktisch kennenlernen kannst. Entscheidend ist nicht, was du schon weißt, sondern ob du bereit bist, deine wiederkehrenden Szenen ehrlich zu betrachten.",
  },
  {
    title: "Was meint Spirit Healing mit einer Matrix?",
    text: "Damit meinen wir kein äußeres System, das dich kontrolliert. Deine persönliche Matrix ist das unbewusste Zusammenspiel aus Erfahrungen, inneren Anteilen, Körperreaktionen, Erwartungen und Rollen. Daraus entsteht ein vertrautes Drehbuch, das sich in neuen Situationen wiederholen kann, solange es unsichtbar bleibt.",
  },
  {
    title: "Was ist das Matrix-Gespräch?",
    text: "Zu Beginn des Programms schauen wir gemeinsam auf eine wiederkehrende Situation aus deinem Leben. Wir machen sichtbar, welche Rollen vergeben sind, welche innere Regel wirkt und welcher Anteil bisher die Führung übernommen hat. Aus dem Gespräch entsteht dein persönlicher Start- und Integrationsplan. Im Vertieften und Persönlichen Weg erhältst du zusätzlich eine schriftliche Matrix-Ausarbeitung.",
  },
  {
    title: "Wie werden persönliche Fragen beantwortet?",
    text: "Im Gemeinsamen Weg greifen wir Fragen auf, wenn sie für den Gruppenprozess relevant sind. Im Vertieften Weg gibt es dafür sechs zusätzliche Kleingruppen-Calls. Im Persönlichen Weg wird jede persönliche Anfrage im vereinbarten privaten Nachrichtenrahmen werktags innerhalb von 48 Stunden beantwortet. Dieser Rahmen ersetzt keine Akut- oder Krisenbegleitung.",
  },
  {
    title: "Was passiert, wenn ich an einem Live-Termin nicht teilnehmen kann?",
    text: "Die Live-Termine werden aufgezeichnet. Du kannst den Inhalt nachholen und mit den jeweiligen Übungen weiterarbeiten.",
  },
  {
    title: "Wie umfangreich sind die Rauhnachtsimpulse?",
    text: "Die täglichen Impulse sind bewusst kurz gehalten. An den Feiertagen gibt es keine Verpflichtung zur Teilnahme oder zum Teilen persönlicher Inhalte.",
  },
  {
    title: "Ist das Programm eine Psychotherapie?",
    text: "Nein. Das Programm ersetzt keine medizinische, psychiatrische oder psychotherapeutische Behandlung. Bei einer akuten Krise ist eine entsprechend qualifizierte Anlaufstelle der richtige Rahmen.",
  },
]

const SectionTitle = ({ eyebrow, title, intro, center = false, light = false }) => (
  <header className={center ? "mx-auto max-w-4xl text-center" : "max-w-4xl"}>
    <p className={`text-xs font-extrabold uppercase tracking-[0.24em] ${light ? "text-[#f1d7a0]" : "text-[#a67426]"}`}>{eyebrow}</p>
    <h2 className={`mt-4 font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl ${light ? "text-white" : "text-[#173c39]"}`}>{title}</h2>
    {intro && <p className={`mt-5 text-lg leading-8 ${light ? "text-white/75" : "text-[#49635f]"}`}>{intro}</p>}
  </header>
)

export const Zepter13 = () => {
  const scrollToBooking = () => {
    document.getElementById("teilnahme")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <main data-no-translate className="min-h-screen bg-[#fbf8f1] text-[#173c39]">
      <section className="relative isolate min-h-screen overflow-hidden border-b border-[#dbe7e1] bg-[#f8f5ed]">
        <div className="absolute -left-36 top-24 h-96 w-96 rounded-full bg-[#d7ebe3]/80 blur-3xl" aria-hidden="true" />
        <div className="absolute right-0 top-0 h-[30rem] w-[30rem] rounded-full bg-[#f0dfb9]/70 blur-3xl" aria-hidden="true" />

        <div className="mx-auto max-w-7xl px-5 pb-16 pt-6 sm:px-8 lg:px-10 lg:pb-24">
          <header className="flex items-center justify-between">
            <a href="/" aria-label="Zur Spirit-Healing-Startseite" className="inline-flex items-center gap-3">
              <img src="/Logo-tuerkis.jpeg?v=20260730" alt="Spirit Healing" className="h-12 w-12 rounded-full object-cover shadow-sm" />
              <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#075a57]">Spirit Healing</span>
            </a>
            <button type="button" onClick={scrollToBooking} className="hidden rounded-full border border-[#0f7d79]/30 bg-white/80 px-5 py-2.5 text-sm font-bold text-[#075a57] transition hover:border-[#0f7d79] hover:bg-white sm:block">
              Teilnahme wählen
            </button>
          </header>

          <div className="mt-12 grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
            <div className="relative z-10">
              <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-[#a67426]">13 Wochen · live online · mit Sabine &amp; Selcan</p>
              <h1 className="mt-5 max-w-4xl font-serif text-5xl font-semibold leading-[0.98] text-[#173c39] sm:text-6xl lg:text-8xl">
                Du spielst die Hauptrolle. Doch wer schreibt dein Drehbuch?
              </h1>
              <p className="mt-7 max-w-2xl text-xl leading-9 text-[#3f5d59]">
                Du verteilst die Rollen. Du triffst die Entscheidungen. Und trotzdem wiederholen sich dieselben Szenen. Solange deine innere Matrix im Verborgenen wirkt, führt ein altes Drehbuch Regie. Dieses Programm lädt dich ein, es sichtbar zu machen – und das Zepter wieder selbst zu übernehmen.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
                <button type="button" onClick={scrollToBooking} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0f7d79] px-7 py-4 font-bold text-white shadow-[0_16px_36px_rgba(15,125,121,0.22)] transition hover:bg-[#075a57]">
                  Das Zepter zurückholen <ArrowDown size={18} />
                </button>
                <a href="#ablauf" className="inline-flex items-center justify-center rounded-full border border-[#0f7d79]/35 bg-white/75 px-7 py-4 font-bold text-[#075a57] transition hover:bg-white">
                  Die innere Reise entdecken
                </a>
              </div>

              <div className="mt-9 flex flex-wrap gap-3 text-sm font-semibold text-[#2c514d]">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#cbded6] bg-white/90 px-4 py-2.5"><CalendarDays size={17} className="text-[#0f7d79]" />21. Oktober 2026 bis 13. Januar 2027</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#cbded6] bg-white/90 px-4 py-2.5"><Clock3 size={17} className="text-[#0f7d79]" />vollständiges Rauhnachtsprogramm inklusive</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#cbded6] bg-white/90 px-4 py-2.5"><Check size={17} className="text-[#0f7d79]" />keine Vorkenntnisse nötig</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
              <div className="absolute -inset-4 rotate-2 rounded-[2rem] border border-[#d8c08d]/60 bg-[#f4e8cf]" aria-hidden="true" />
              <figure className="relative overflow-hidden rounded-[2rem] border-8 border-white bg-white shadow-[0_26px_70px_rgba(31,75,70,0.18)]">
                <img src="/zepter-spirit-healing.png" alt="Das Spirit-Healing-Zepter mit Kolibri und Puma" className="h-[40rem] w-full object-cover object-center" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#173c39]/95 via-[#173c39]/55 to-transparent px-7 pb-7 pt-28 text-white">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f1d7a0]">Spirit Healing</p>
                  <p className="mt-2 text-xl font-semibold leading-8">Du bist nicht für immer an das alte Drehbuch gebunden. Das Zepter gehört in deine Hand.</p>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.84fr_1.16fr] lg:gap-20">
          <div>
            <SectionTitle
              eyebrow="Der Film, der sich wiederholt"
              title="Vielleicht lebst du längst in einem Film, den du nie bewusst gewählt hast."
              intro="Die Kulissen wechseln. Die Menschen wechseln. Doch das Gefühl darunter bleibt erstaunlich vertraut. Als würdest du immer wieder an denselben Punkt zurückkehren, obwohl du längst verstanden hast, dass es so nicht weitergehen soll."
            />
          </div>
          <div>
            <p className="border-l-4 border-[#c69543] pl-6 text-2xl font-semibold leading-10 text-[#244b47] sm:text-3xl">Du bist die Hauptdarstellerin oder der Hauptdarsteller. Gleichzeitig besetzt du die Nebenrollen – oft ohne zu wissen, nach welchem Drehbuch.</p>
            <ul className="mt-8 divide-y divide-[#cbdcd5] border-y border-[#cbdcd5]">
              {recurringScenes.map((scene) => (
                <li key={scene} className="flex gap-4 py-5 text-lg leading-8 text-[#506864]"><span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-[#c69543]" aria-hidden="true" />{scene}</li>
              ))}
            </ul>
            <p className="mt-8 text-xl font-semibold leading-9 text-[#173c39]">Das ist kein Mangel an Willenskraft. Es ist ein Hinweis darauf, dass ein unbewusster Teil von dir noch versucht, mit alten Regeln Sicherheit herzustellen.</p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#173c39] py-20 text-white lg:py-28">
        <div className="absolute -left-24 top-12 h-96 w-96 rounded-full bg-[#0f7d79]/30 blur-3xl" aria-hidden="true" />
        <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-[#c69543]/15 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[0.88fr_1.12fr] lg:gap-20 lg:px-10">
          <SectionTitle
            eyebrow="Deine persönliche Matrix"
            title="Das unsichtbare Drehbuch hinter deinen sichtbaren Entscheidungen"
            intro="Deine Matrix ist kein äußeres System, das dich kontrolliert. Sie entsteht in dir: aus Erfahrungen, inneren Anteilen, Erwartungen, Körperreaktionen und Schutzentscheidungen, die einmal sinnvoll waren."
            light
          />
          <div className="space-y-7 text-lg leading-8 text-white/78">
            <p>Ein Teil von dir erwartet vielleicht Ablehnung – und besetzt einen anderen Menschen unbewusst mit der Rolle der Person, die dich zurückweisen wird. Ein anderer Teil glaubt, Liebe verdienen zu müssen – und macht dich zur Retterin, zum Retter oder zu dem Menschen, der immer noch mehr gibt.</p>
            <p>So entsteht ein Film, in dem du zwar handelst, aber nicht frei wählst. Du reagierst auf das, was deine Matrix erwartet. Dein Nervensystem versucht zu überleben, während dein eigentliches Leben, deine Stimme und dein Potenzial auf den Moment warten, in dem du wieder selbst führst.</p>
            <blockquote className="border-l-2 border-[#f1d7a0] pl-6 font-serif text-2xl font-semibold leading-10 text-white sm:text-3xl">Solange du das Drehbuch nicht kennst, hältst du seine Wiederholungen für dein Schicksal.</blockquote>
            <p>Wenn die Matrix sichtbar wird, entsteht Abstand. Und in diesem Abstand liegt etwas, das vorher kaum erreichbar war: eine bewusste Entscheidung.</p>
          </div>
        </div>
      </section>

      <section id="ablauf" className="scroll-mt-8 border-y border-[#d5e4dd] bg-[#edf5f1] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <SectionTitle
            eyebrow="Die innere Bewegung"
            title="Vom unbewusst gelebten Film zur bewusst geführten Geschichte"
            intro="Wir geben dir kein neues Drehbuch, das du erfüllen musst. Wir schaffen einen Raum, in dem du erkennst, was bisher Regie geführt hat – und aus deinem heutigen Selbst eine neue Richtung wählen kannst."
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {shifts.map((shift, index) => (
              <article key={shift.from} className="rounded-[2rem] border border-[#c8dcd3] bg-white p-7 shadow-[0_18px_45px_rgba(31,75,70,0.07)] sm:p-9">
                <span className="font-serif text-4xl font-semibold text-[#c69543]">0{index + 1}</span>
                <p className="mt-6 text-lg leading-8 text-[#667a76]">{shift.from}</p>
                <div className="my-6 flex items-center gap-3" aria-hidden="true"><span className="h-px flex-1 bg-[#cbdcd5]" /><ArrowDown className="h-5 w-5 text-[#0f7d79]" /><span className="h-px flex-1 bg-[#cbdcd5]" /></div>
                <p className="font-serif text-2xl font-semibold leading-9 text-[#173c39] sm:text-3xl">{shift.to}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid items-start gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionTitle
            eyebrow="Ein besonderer Moment im Programm"
            title="Im Matrix-Gespräch bekommt dein Drehbuch ein Gesicht."
            intro="Nicht als fertige Diagnose. Nicht als Schublade. Sondern als Landkarte, auf der sichtbar wird, was bisher im Verborgenen zusammengewirkt hat."
          />
          <div className="rounded-[2rem] border border-[#d9c69f] bg-[#f7edd9] p-7 shadow-[0_22px_55px_rgba(31,75,70,0.08)] sm:p-10">
            <p className="font-serif text-3xl font-semibold leading-tight text-[#173c39] sm:text-4xl">Eine wiederkehrende Szene. Die verteilten Rollen. Die verborgene Regel. Der Anteil, der das Zepter hält.</p>
            <p className="mt-6 text-lg leading-8 text-[#506864]">Zu Beginn des Programms schauen wir mit dir auf eine Situation, die sich in deinem Leben immer wieder zeigt. Gemeinsam arbeiten wir heraus, was dein System erwartet, wovor es dich schützen möchte und welche Rolle du selbst und andere darin übernehmen.</p>
            <p className="mt-5 text-lg leading-8 text-[#506864]">Du sollst danach nicht einfach nur mehr über dich wissen. Du sollst den Moment erkennen können, in dem der alte Film beginnt – und spüren, dass du heute eine andere Wahl hast.</p>
            <button type="button" onClick={scrollToBooking} className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[#0f7d79] px-7 py-3.5 font-bold text-white transition hover:bg-[#075a57]">Ich möchte meine Matrix erkennen</button>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#173c39] py-20 text-white lg:py-28">
        <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-[#c69543]/15 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[0.86fr_1.14fr] lg:gap-20 lg:px-10">
          <SectionTitle
            eyebrow="Im Programm enthalten"
            title="Das vollständige Spirit-Healing-Rauhnachtsprogramm ist Teil dieser Reise."
            intro="Du brauchst dafür nichts zusätzlich zu buchen. Die gemeinsame Rauhnachtsbegleitung ist vollständig in deiner Teilnahme am 13-Wochen-Programm enthalten."
            light
          />
          <div className="rounded-[2rem] border border-white/15 bg-white/8 p-7 sm:p-10">
            <p className="font-serif text-3xl font-semibold leading-tight text-white sm:text-4xl">Eine gemeinsame Zeit für Innenschau, Wahrheit, Wünsche und bewusste Ausrichtung.</p>
            <p className="mt-6 text-lg leading-8 text-white/75">Die Rauhnächte verbinden das Ende des alten Jahres mit dem Beginn des neuen. Wie die Begleitung im Einzelnen gestaltet wird, erfährst du innerhalb des Programms.</p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm font-bold">
              <span className="rounded-full bg-[#f1d7a0] px-4 py-2.5 text-[#173c39]">vollständig inklusive</span>
              <span className="rounded-full border border-white/20 px-4 py-2.5 text-white">keine Zusatzbuchung nötig</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
          <SectionTitle
            eyebrow="Im Programm enthalten"
            title="Damit aus einer Erkenntnis eine neue Erfahrung werden kann"
            intro="Ein altes Drehbuch verändert sich nicht durch einen einzigen klugen Gedanken. Deshalb verbindet das Programm die gemeinsame Live-Arbeit mit dem Matrix-Gespräch, Körperwahrnehmung, kurzen Übungen und Raum für Integration."
          />
          <ul className="divide-y divide-[#cbdcd5] border-y border-[#cbdcd5]">
            {included.map((item) => (
              <li key={item} className="flex gap-4 py-5 text-lg font-semibold leading-8 text-[#31534f]"><CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-[#0f7d79]" aria-hidden="true" />{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section id="teilnahme" className="scroll-mt-8 bg-[#f4ead6] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <SectionTitle
            eyebrow="Drei Formen der Teilnahme"
            title="Du entscheidest, wie eng du begleitet werden möchtest"
            intro="Der inhaltliche Kern bleibt in allen drei Varianten erhalten. Der Unterschied liegt in der persönlichen Rückmeldung, der Gruppengröße zusätzlicher Termine und der individuellen Begleitung."
            center
          />
          <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-3">
            {tiers.map((tier) => (
              <article key={tier.name} className={`relative flex flex-col rounded-[2rem] p-7 sm:p-9 ${tier.featured ? "border-2 border-[#0f7d79] bg-white shadow-[0_24px_60px_rgba(15,125,121,0.13)]" : "border border-[#d9c69f] bg-[#fffaf2]"}`}>
                {tier.featured && <span className="absolute right-6 top-0 -translate-y-1/2 rounded-full bg-[#0f7d79] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white">Empfohlene Vertiefung</span>}
                <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#a67426]">{tier.name}</p>
                <p className="mt-4 font-serif text-4xl font-semibold text-[#173c39]">{tier.price}</p>
                <p className="mt-1 text-sm font-semibold text-[#6c7c78]">Einmalzahlung</p>
                <p className="mt-5 min-h-24 text-lg leading-8 text-[#506864]">{tier.intro}</p>
                <ul className="mt-7 flex-1 space-y-4 border-t border-[#d9e3de] pt-6">
                  {tier.items.map((item) => <li key={item} className="flex gap-3 leading-7 text-[#365653]"><Check size={19} className="mt-1 shrink-0 text-[#0f7d79]" aria-hidden="true" />{item}</li>)}
                </ul>
                <div className="mt-8 space-y-3">
                  <a href={tier.checkout} target="_blank" rel="noopener noreferrer" className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-6 py-3 font-bold transition ${tier.featured ? "bg-[#0f7d79] text-white hover:bg-[#075a57]" : "bg-[#173c39] text-white hover:bg-[#0f7d79]"}`}>Einmalig {tier.price} buchen <ArrowRight size={18} /></a>
                  <a href={tier.twoInstallments.checkout} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-[#0f7d79] bg-white px-6 py-3 font-bold text-[#0f7d79] transition hover:bg-[#edf5f1]">Mit {tier.twoInstallments.label} buchen <ArrowRight size={18} /></a>
                  <a href={tier.threeInstallments.checkout} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[#b9cfc7] bg-white px-6 py-3 font-bold text-[#31534f] transition hover:bg-[#edf5f1]">Mit {tier.threeInstallments.label} buchen <ArrowRight size={18} /></a>
                  <p className="text-center text-xs leading-5 text-[#6d7e7a]">Raten-Gesamtpreis: {tier.threeInstallments.total}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-[#d9c69f] bg-white/70 px-6 py-5 text-center text-sm leading-6 text-[#63736f]">
            <p>Bei zwei Raten ist die zweite Rate nach 30 Tagen fällig. Bei drei Raten folgen die weiteren Zahlungen nach 30 und 60 Tagen. Die gesonderten Stripe-Zahlungslinks erhältst du rechtzeitig per E-Mail.</p>
            <p className="mt-2">Peer-Räume sind freiwillig. Die persönliche Nachrichtenbegleitung ist Prozessbegleitung im vereinbarten Rahmen und ersetzt keine Akut- oder Krisenhilfe.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="overflow-hidden rounded-[2rem] border border-[#e1e6df] bg-white p-3 shadow-[0_20px_60px_rgba(31,75,70,0.12)]">
            <img src="/ueberuns.jpeg" alt="Sabine Schmidt und Selcan Yilmaz" className="h-[31rem] w-full rounded-[1.4rem] object-cover object-center" />
          </div>
          <div>
            <SectionTitle
              eyebrow="Die Begleitung"
              title="Sabine und Selcan führen gemeinsam durch den Prozess"
              intro="Wir verbinden traumasensible Prozessbegleitung, die Arbeit mit inneren Anteilen, Körperwahrnehmung, systemische Perspektiven und spirituelle Rituale. Dabei bleiben alle Modelle Angebote zur Selbsterkundung. Du entscheidest jederzeit selbst, was du ausprobierst und was du in der Gruppe teilen möchtest."
            />
            <div className="mt-8 rounded-3xl border border-[#c9dcd3] bg-[#edf5f1] p-6">
              <p className="flex gap-4 leading-7 text-[#365653]"><HeartHandshake className="mt-1 h-6 w-6 shrink-0 text-[#0f7d79]" aria-hidden="true" />Wir arbeiten ressourcenorientiert und öffnen keine persönlichen Themen unter Druck. Deine Grenzen und dein eigenes Tempo gehören zum Rahmen der gesamten Begleitung.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#d5e4dd] bg-[#edf5f1] py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-10">
          <SectionTitle eyebrow="Fragen zum Programm" title="Was vor der Buchung wichtig ist" center />
          <div className="mt-12 divide-y divide-[#bed3ca] border-y border-[#bed3ca]">
            {questions.map((item) => (
              <details key={item.title} className="group py-6">
                <summary className="cursor-pointer list-none pr-8 text-xl font-bold leading-8 text-[#173c39] marker:hidden">{item.title}</summary>
                <p className="mt-4 max-w-4xl text-lg leading-8 text-[#506864]">{item.text}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#173c39] py-20 text-white lg:py-28">
        <div className="mx-auto max-w-5xl px-5 text-center sm:px-8 lg:px-10">
          <SectionTitle
            eyebrow="Das Zepter wieder übernehmen"
            title="Dein Film muss nicht so weitergehen."
            intro="Wenn du spürst, dass deine Geschichte größer ist als die Wiederholungen, in denen du bisher festhingst, wähle den Weg, der zu deiner gewünschten Begleitungstiefe passt."
            center
            light
          />
          <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-3 text-sm font-semibold text-white/80">
            <span className="rounded-full border border-white/20 px-4 py-2.5">21. Oktober 2026 bis 13. Januar 2027</span>
            <span className="rounded-full border border-white/20 px-4 py-2.5">Rauhnachtsprogramm inklusive</span>
            <span className="rounded-full border border-white/20 px-4 py-2.5">bis zu drei Raten</span>
          </div>
          <button type="button" onClick={scrollToBooking} className="mt-9 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#f1d7a0] px-8 py-4 font-bold text-[#173c39] transition hover:bg-white">Teilnahme wählen <ArrowRight size={18} /></button>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#0f302f] py-10 text-white/65">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 text-sm sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <a href="/" className="flex items-center gap-3 text-white" aria-label="Spirit Healing Startseite">
            <img src="/Logo-tuerkis.jpeg?v=20260730" alt="" className="h-10 w-10 rounded-full object-cover" />
            <span className="font-bold">Spirit Healing · Sabine &amp; Selcan</span>
          </a>
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
