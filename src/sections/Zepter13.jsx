import { Link } from "react-router-dom"
import { programIntroCallUrl as introCallUrl } from "@/content/programInterest"
import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  HeartHandshake,
} from "lucide-react"

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
  "Persönliche Vorbereitung und Onboarding innerhalb des Programms",
  "13-Wochen-Programm mit einem wöchentlichen gemeinsamen Online-Termin",
  "Ein begleitetes Matrix-Gespräch zu Beginn deiner Teilnahme am Programm, in dem dein unbewusstes Drehbuch sichtbar werden darf",
  "Dein persönlicher Start- und Integrationsplan",
  "Tägliche energetische Begleitung mit Tagesimpuls und Meditationen, die aus dem aktuellen Gruppenprozess entstehen",
  "Aufzeichnungen der gemeinsamen Termine",
  "Begleitendes Workbook mit Übungen und Reflexionsfragen",
  "Kurze Impulse für die Umsetzung zwischen den Terminen",
  "Austausch in einer geschützten Spirit-Healing-Community",
  "Das vollständige Rauhnachtsprogramm innerhalb der gemeinsamen Reise",
  "Abschluss und persönlicher 90-Tage-Ausblick",
  "Teilnahme am gemeinsamen Abschlusstreffen in Berlin nach dem 13-Wochen-Prozess",
]

const SectionTitle = ({ eyebrow, title, intro, center = false, light = false }) => (
  <header className={center ? "mx-auto max-w-4xl text-center" : "max-w-4xl"}>
    <p className={`text-xs font-extrabold uppercase tracking-[0.24em] ${light ? "text-[#f1d7a0]" : "text-[#a67426]"}`}>{eyebrow}</p>
    <h2 className={`mt-4 font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl ${light ? "text-white" : "text-[#173c39]"}`}>{title}</h2>
    {intro && <p className={`mt-5 text-lg leading-8 ${light ? "text-white/75" : "text-[#49635f]"}`}>{intro}</p>}
  </header>
)

export const Zepter13 = () => {
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
            <a href={introCallUrl} target="_blank" rel="noopener noreferrer" className="hidden rounded-full border border-[#0f7d79]/30 bg-white/80 px-5 py-2.5 text-sm font-bold text-[#075a57] transition hover:border-[#0f7d79] hover:bg-white sm:block">
              Kostenfrei kennenlernen
            </a>
          </header>

          <div className="mt-12 grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
            <div className="relative z-10">
              <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-[#a67426]">13-Wochen-Programm · mit Sabine &amp; Selcan · Gesprächsphase seit 21. Oktober</p>
              <h1 className="mt-5 max-w-4xl font-serif text-5xl font-semibold leading-[0.98] text-[#173c39] sm:text-6xl lg:text-8xl">
                Du spielst die Hauptrolle. Doch wer schreibt dein Drehbuch?
              </h1>
              <p className="mt-7 max-w-2xl text-xl leading-9 text-[#3f5d59]">
                Du verteilst die Rollen. Du triffst die Entscheidungen. Und trotzdem wiederholen sich dieselben Szenen. Solange deine innere Matrix im Verborgenen wirkt, führt ein altes Drehbuch Regie. Dieses Programm lädt dich ein, es sichtbar zu machen – und das Zepter wieder selbst zu übernehmen.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
                <a href={introCallUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0f7d79] px-7 py-4 font-bold text-white shadow-[0_16px_36px_rgba(15,125,121,0.22)] transition hover:bg-[#075a57]">
                  Kostenfreies Kennenlerngespräch buchen <ArrowRight size={18} className="shrink-0" />
                </a>
                <a href="#ablauf" className="inline-flex items-center justify-center rounded-full border border-[#0f7d79]/35 bg-white/75 px-7 py-4 font-bold text-[#075a57] transition hover:bg-white">
                  Die innere Reise entdecken
                </a>
              </div>
              <p className="mt-4 text-sm leading-7 text-[#49635f]">Unverbindlich · 30 Minuten · mit Sabine und Selcan über Zoom. Du buchst damit noch keine Teilnahme am Programm.</p>

              <div className="mt-9 flex flex-wrap gap-3 text-sm font-semibold text-[#2c514d]">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#cbded6] bg-white/90 px-4 py-2.5"><CalendarDays size={17} className="shrink-0 text-[#0f7d79]" />Persönliche Gespräche seit 21. Oktober 2026</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#cbded6] bg-white/90 px-4 py-2.5"><CalendarDays size={17} className="shrink-0 text-[#0f7d79]" />Programmstart wird bekannt gegeben</span>
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

      <section className="border-b border-[#d5e4dd] bg-[#edf5f1] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <SectionTitle
            eyebrow="Wir lernen uns kennen"
            title="Seit dem 21. Oktober führen wir persönliche Gespräche."
            intro="Die Gesprächsphase ist offen. Wenn dich das 13-Wochen-Programm anspricht, kannst du dir jetzt Zeit für ein Kennenlernen mit uns nehmen. Den gemeinsamen Programmstart geben wir bekannt, sobald er feststeht."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <article className="rounded-[2rem] border border-[#c8dcd3] bg-white p-7 sm:p-9">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#a67426]">Kostenfrei · unverbindlich · 30 Minuten</p>
              <h2 className="mt-4 font-serif text-3xl font-semibold text-[#173c39]">Dein Kennenlerngespräch mit uns beiden</h2>
              <p className="mt-5 text-lg leading-8 text-[#506864]">Wir treffen uns über Zoom. Du kannst uns kennenlernen, dein Anliegen mitbringen und deine Fragen zum Programm stellen. Gemeinsam schauen wir, ob unsere Begleitung zu dir passt.</p>
              <p className="mt-5 font-semibold leading-7 text-[#31534f]">Dieses Gespräch ist noch kein Matrix-Gespräch und keine verbindliche Buchung des Programms.</p>
            </article>
            <article className="rounded-[2rem] bg-[#173c39] p-7 text-white sm:p-9">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#f1d7a0]">Später · innerhalb des 13-Wochen-Programms</p>
              <h2 className="mt-4 font-serif text-3xl font-semibold">Dein persönliches Matrix-Gespräch</h2>
              <p className="mt-5 text-lg leading-8 text-white/78">Wenn du am Programm teilnimmst, arbeiten wir zu Beginn gemeinsam deine persönliche Matrix heraus. Wir schauen auf die wiederkehrenden Szenen, die verteilten Rollen und den Anteil, der bisher das Zepter hält.</p>
              <p className="mt-5 font-semibold leading-7 text-white">Das Matrix-Gespräch ist Teil deiner gebuchten Programmbegleitung und findet getrennt vom kostenfreien Kennenlernen statt.</p>
            </article>
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
            <a href={introCallUrl} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[#0f7d79] px-7 py-3.5 font-bold text-white transition hover:bg-[#075a57]">Zuerst kostenfrei kennenlernen</a>
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
            intro="Ein altes Drehbuch verändert sich nicht durch einen einzigen klugen Gedanken. Deshalb verbindet das Programm die gemeinsamen Online-Termine mit dem Matrix-Gespräch, Körperwahrnehmung, kurzen Übungen und Raum für Integration."
          />
          <div>
          <ul className="divide-y divide-[#cbdcd5] border-y border-[#cbdcd5]">
            {included.map((item) => (
              <li key={item} className="flex gap-4 py-5 text-lg font-semibold leading-8 text-[#31534f]"><CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-[#0f7d79]" aria-hidden="true" />{item}</li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-7 text-[#506864]">Das Programm umfasst einen wöchentlichen gemeinsamen Online-Termin von etwa 90 Minuten. Die genauen Termine geben wir mit dem Programmstart bekannt. Plane zusätzlich etwa 30 Minuten täglich für Übungen und Integration ein. Wenn du an einem Termin nicht teilnehmen kannst, steht dir die Aufzeichnung zur Verfügung.</p>
          <p className="mt-5 text-sm leading-7 text-[#506864]">Die Teilnahme am Abschlusstreffen in Berlin ist im Programm enthalten. Reise, Übernachtung und Verpflegung sind selbst zu bezahlen. Der genaue Termin und Veranstaltungsort werden noch bekannt gegeben. Das Abschlusstreffen ist ein eigener Bestandteil des 13-Wochen-Programms.</p>
          </div>
        </div>
      </section>

      <section id="teilnahme" className="scroll-mt-8 bg-[#f4ead6] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <SectionTitle
            eyebrow="Dein nächster Schritt"
            title="Lass uns über deinen Weg sprechen."
            intro="Du interessierst dich für das 13-Wochen-Programm und möchtest uns kennenlernen? Seit dem 21. Oktober führen wir persönliche Gespräche. In deinem kostenfreien Kennenlerngespräch ist Raum für dein Anliegen und deine Fragen. Gemeinsam schauen wir, ob das Programm und unsere Begleitung zu dir passen."
            center
          />
          <div className="mx-auto mt-9 max-w-2xl text-center">
            <a href={introCallUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0f7d79] px-8 py-4 text-center font-bold text-white transition hover:bg-[#075a57]">Kostenfreies Kennenlerngespräch buchen <ArrowRight size={18} className="shrink-0" /></a>
            <p className="mt-5 text-sm leading-7 text-[#506864]">30 Minuten mit Sabine und Selcan über Zoom. Unverbindlich und ohne Programmbuchung. Das persönliche Matrix-Gespräch gehört zur späteren Teilnahme am Programm.</p>
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

      <section className="bg-[#173c39] py-20 text-white lg:py-28">
        <div className="mx-auto max-w-5xl px-5 text-center sm:px-8 lg:px-10">
          <SectionTitle
            eyebrow="Das Zepter wieder übernehmen"
            title="Dein Film muss nicht so weitergehen."
            intro="Wenn du spürst, dass du das Zepter wieder selbst in die Hand nehmen möchtest, lass uns kennenlernen. In deinem kostenfreien Gespräch schauen wir gemeinsam auf dein Anliegen und deine Fragen zum 13-Wochen-Programm."
            center
            light
          />
          <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-3 text-sm font-semibold text-white/80">
            <span className="rounded-full border border-white/20 px-4 py-2.5">Gesprächsphase seit 21. Oktober 2026</span>
            <span className="rounded-full border border-white/20 px-4 py-2.5">Programmstart wird bekannt gegeben</span>
            <span className="rounded-full border border-white/20 px-4 py-2.5">Rauhnachtsprogramm inklusive</span>
          </div>
          <a href={introCallUrl} target="_blank" rel="noopener noreferrer" className="mt-9 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#f1d7a0] px-8 py-4 text-center font-bold text-[#173c39] transition hover:bg-white">Kostenfrei kennenlernen <ArrowRight size={18} className="shrink-0" /></a>
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
