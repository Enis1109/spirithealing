import { useEffect } from "react"
import {
  ArrowDown,
  CalendarDays,
  Check,
  Clock3,
  MapPin,
} from "lucide-react"

const colors = {
  ink: "#173c39",
  teal: "#0f7d79",
  tealDark: "#075a57",
  gold: "#c69543",
  paper: "#fbf8f1",
}

const friday = [
  ["10:00–13:00", "Fachlich-therapeutische Einführung, Fragen und erste Übungen"],
  ["13:00–14:00", "Mittagspause"],
  ["14:00–ca. 19:00", "Aufstellungsarbeit mit einer Aufstellung von etwa 90 Minuten, gemeinsamer Einordnung und Kaffeepause"],
]

const saturday = [
  ["10:00–13:00", "Aufstellungsarbeit; eine Aufstellung dauert etwa 90 Minuten"],
  ["13:00–14:00", "Mittagspause"],
  ["14:00–ca. 19:00", "Weitere Aufstellungen, Kaffeepause und gemeinsamer Abschluss"],
]

const stripeCheckoutUrls = {
  ownConstellation: "https://book.stripe.com/00w4gB5NE7ClaFldfV83C07",
  ownConstellationInstallment: "https://book.stripe.com/14AcN71xo1dX3cT8ZF83C09",
  intensiveParticipation: "https://book.stripe.com/fZu8wReka2i19Bhgs783C08",
  intensiveParticipationInstallment: "https://book.stripe.com/28E8wRb7Y4q914LcbR83C0b",
}

const SectionTitle = ({ eyebrow, title, intro, center = false }) => (
  <header className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
    <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#a67426]">{eyebrow}</p>
    <h2 className="mt-4 text-3xl font-bold leading-tight text-[#173c39] sm:text-4xl lg:text-5xl">{title}</h2>
    {intro && <p className="mt-5 text-lg leading-8 text-[#49635f]">{intro}</p>}
  </header>
)

const Timeline = ({ entries }) => (
  <div className="mt-7 divide-y divide-[#d9e5df] border-y border-[#d9e5df]">
    {entries.map(([time, label]) => (
      <div key={`${time}-${label}`} className="grid gap-1 py-4 sm:grid-cols-[8rem_1fr] sm:gap-5">
        <p className="font-bold text-[#0f7d79]">{time}</p>
        <p className="leading-7 text-[#395653]">{label}</p>
      </div>
    ))}
  </div>
)

export const BerlinLive = () => {
  useEffect(() => {
    const previousTitle = document.title
    const existingRobots = document.querySelector('meta[name="robots"]')
    const robots = existingRobots || document.createElement("meta")

    document.title = "Spirit Healing live in Berlin | Familienaufstellung"
    robots.setAttribute("name", "robots")
    robots.setAttribute("content", "noindex, nofollow")
    if (!existingRobots) document.head.appendChild(robots)

    return () => {
      document.title = previousTitle
      if (!existingRobots) robots.remove()
    }
  }, [])

  const scrollToTickets = () => {
    document.getElementById("tickets")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const ownConstellationCheckoutUrl = import.meta.env.VITE_BERLIN_OWN_CONSTELLATION_CHECKOUT_URL
    || stripeCheckoutUrls.ownConstellation
  const ownConstellationInstallmentCheckoutUrl = import.meta.env.VITE_BERLIN_OWN_INSTALLMENT_CHECKOUT_URL
    || stripeCheckoutUrls.ownConstellationInstallment
  const intensiveParticipationCheckoutUrl = import.meta.env.VITE_BERLIN_INTENSIVE_CHECKOUT_URL
    || stripeCheckoutUrls.intensiveParticipation
  const intensiveParticipationInstallmentCheckoutUrl = import.meta.env.VITE_BERLIN_INTENSIVE_INSTALLMENT_CHECKOUT_URL
    || stripeCheckoutUrls.intensiveParticipationInstallment

  return (
    <main className="min-h-screen bg-[#fbf8f1] text-[#173c39]" style={{ color: colors.ink }}>
      <section className="relative isolate overflow-hidden border-b border-[#dbe7e1] bg-[#f8f5ed]">
        <div className="absolute -left-40 top-24 h-96 w-96 rounded-full bg-[#d8ebe3]/70 blur-3xl" aria-hidden="true" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[#f2dfb9]/65 blur-3xl" aria-hidden="true" />

        <div className="mx-auto max-w-7xl px-5 pb-16 pt-6 sm:px-8 lg:px-10 lg:pb-24">
          <div className="flex items-center justify-between">
            <a href="/" aria-label="Zur Spirit-Healing-Startseite" className="inline-flex items-center gap-3">
              <img src="/Logo-tuerkis.jpeg" alt="Spirit Healing" className="h-12 w-12 rounded-full object-cover shadow-sm" />
              <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#075a57]">Spirit Healing</span>
            </a>
            <button type="button" onClick={scrollToTickets} className="hidden rounded-full border border-[#0f7d79]/30 bg-white/80 px-5 py-2.5 text-sm font-bold text-[#075a57] transition hover:border-[#0f7d79] hover:bg-white sm:block">
              Plätze ansehen
            </button>
          </div>

          <div className="mt-12 grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
            <div className="relative z-10">
              <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-[#a67426]">Spirit Healing live in Berlin</p>
              <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-[1.06] text-[#173c39] sm:text-5xl lg:text-7xl">
                Was unbewusst mitwirkt, bekommt einen Platz.
              </h1>
              <p className="mt-7 max-w-2xl text-xl leading-9 text-[#3f5d59]">
                Zwei intensive Tage mit familiensystemischer Aufstellungsarbeit. Wir betrachten Bindungen, Rollen und wiederkehrende Dynamiken über Generationen hinweg und begleiten jede Aufstellung gemeinsam.
              </p>

              <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold text-[#2c514d]">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#cbded6] bg-white/90 px-4 py-2.5"><CalendarDays size={17} className="text-[#0f7d79]" />9. und 10. Oktober 2026</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#cbded6] bg-white/90 px-4 py-2.5"><Clock3 size={17} className="text-[#0f7d79]" />jeweils 10–19 Uhr</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#cbded6] bg-white/90 px-4 py-2.5"><MapPin size={17} className="text-[#0f7d79]" />Berlin, Raum folgt</span>
              </div>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
                <button type="button" onClick={scrollToTickets} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0f7d79] px-7 py-4 font-bold text-white shadow-[0_16px_36px_rgba(15,125,121,0.22)] transition hover:bg-[#075a57]">
                  Ticketarten ansehen <ArrowDown size={18} />
                </button>
                <p className="text-sm leading-6 text-[#5b706d]">20 Plätze insgesamt<br />davon 6 mit eigener Aufstellung</p>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
              <div className="absolute -inset-4 rotate-2 rounded-[2rem] border border-[#d8c08d]/60 bg-[#f4e8cf]" aria-hidden="true" />
              <div className="relative overflow-hidden rounded-[2rem] border-8 border-white bg-white shadow-[0_26px_70px_rgba(31,75,70,0.18)]">
                <img src="/familie/berlin.jpeg" alt="Blick über Berlin bei Abendlicht" className="h-[30rem] w-full object-cover object-center" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#173c39]/90 via-[#173c39]/50 to-transparent px-7 pb-7 pt-24 text-white">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f1d7a0]">Zwei Leiterinnen, ein gemeinsamer Prozess</p>
                  <p className="mt-2 text-xl font-semibold leading-8">Systemische Dynamik sehen, innere Reaktion verstehen und das Erlebte gemeinsam einordnen.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-10 lg:self-start">
            <SectionTitle
              eyebrow="Der Blick auf das Familiensystem"
              title="Ein heutiges Thema kann mit einem alten Platz in der Familie verbunden sein"
              intro="Eine Familienaufstellung betrachtet eine Reaktion nicht isoliert. Sie fragt, in welchen Beziehungen sie entstanden ist, welche Rolle ein Mensch im Familiensystem übernommen hat und ob diese Rolle im heutigen Leben noch passt."
            />
            <p className="mt-9 border-l-4 border-[#c69543] pl-6 text-xl font-semibold leading-9 text-[#244b47]">
              Es geht nicht darum, Schuldige zu finden. Es geht darum zu erkennen, wie Zugehörigkeit, Verantwortung und Bindung im inneren Familienbild geordnet sind.
            </p>
          </div>

          <div className="divide-y divide-[#cbdcd5] border-y border-[#cbdcd5]">
            <article className="py-9 first:pt-0 lg:py-11">
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#a67426]">Zugehörigkeit und Ausschluss</p>
              <h3 className="mt-3 text-2xl font-bold leading-tight text-[#173c39] sm:text-3xl">Wer im Familienbild keinen Platz bekommt, kann dennoch eine starke Bedeutung behalten</h3>
              <p className="mt-5 text-lg leading-8 text-[#4b6561]">
                Zu einem Familiensystem gehören auch Menschen und Ereignisse, über die wenig gesprochen wird: früh Verstorbene, getrennte oder ausgeschlossene Angehörige, frühere Partnerschaften, Verluste und abrupte Brüche. Wenn ihre Geschichte keinen sichtbaren Platz hat, orientieren sich spätere Familienmitglieder mitunter an einer Lücke, die sie selbst nicht benennen können. In der Aufstellung wird erfahrbar, wem der Blick gilt, wer fehlt und wo Nähe zu einer Person gehalten wird, deren Geschichte bisher kaum vorkam.
              </p>
            </article>

            <article className="py-9 lg:py-11">
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#a67426]">Rollen und Verantwortung</p>
              <h3 className="mt-3 text-2xl font-bold leading-tight text-[#173c39] sm:text-3xl">Wenn ein Kind zu früh Vermittler, Vertraute oder Stütze wird</h3>
              <p className="mt-5 text-lg leading-8 text-[#4b6561]">
                Kinder versuchen, Bindung zu sichern. Sie schlichten zwischen Eltern, kümmern sich um Geschwister, tragen die Stimmung eines Erwachsenen mit oder stellen eigene Bedürfnisse zurück. Was damals half, die Familie zusammenzuhalten, kann im Erwachsenenleben weiterwirken: als Überverantwortung, ständige Wachsamkeit, Schuldgefühl beim Abgrenzen oder das Gefühl, für das Wohlergehen anderer zuständig zu sein. Eine Aufstellung kann sichtbar machen, wo die Generationenordnung verrutscht ist und welche Verantwortung wieder dorthin gehört, wo sie ursprünglich lag.
              </p>
            </article>

            <article className="py-9 lg:py-11">
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#a67426]">Loyalität und eigener Weg</p>
              <h3 className="mt-3 text-2xl font-bold leading-tight text-[#173c39] sm:text-3xl">Manchmal fühlt sich Entwicklung innerlich wie Untreue an</h3>
              <p className="mt-5 text-lg leading-8 text-[#4b6561]">
                Ein eigener Weg kann unbewusst in Konflikt mit der Zugehörigkeit geraten. Mehr Erfolg als die Eltern, eine andere Art von Partnerschaft, räumliche Distanz oder ein klares Nein können sich dann nicht frei anfühlen, obwohl sie im heutigen Leben richtig wären. Hinter dem Zögern steht häufig kein Mangel an Willen, sondern eine Bindung: „Wenn ich es anders mache, gehöre ich dann noch dazu?“ Die Aufstellung bringt diese Bindung in den Raum und sucht nach einer Form, in der Herkunft gewürdigt werden kann, ohne das eigene Leben daran festzubinden.
              </p>
            </article>

            <article className="py-9 last:pb-0 lg:py-11">
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#a67426]">Wiederkehrende Beziehungsmuster</p>
              <h3 className="mt-3 text-2xl font-bold leading-tight text-[#173c39] sm:text-3xl">Was in einer Generation ungelöst blieb, kann in der nächsten eine neue Form annehmen</h3>
              <p className="mt-5 text-lg leading-8 text-[#4b6561]">
                Familienmuster werden nicht einfach eins zu eins kopiert. Sie zeigen sich in Rollen, Erwartungen, Bündnissen und stillen Aufträgen. Jemand wird immer wieder zum Außenseiter, gerät zwischen zwei Seiten oder übernimmt in Partnerschaften erneut die Position, die er schon in der Herkunftsfamilie kannte. Die räumliche Darstellung macht solche Wiederholungen konkret: Wer schaut auf wen? Wer steht zwischen wem? Wer trägt eine Spannung, die eigentlich zu einer anderen Beziehung gehört? Aus diesen Fragen entsteht ein neues Verständnis für die eigene Position im System.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="border-y border-[#d7e4de] bg-[#edf5f1] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <SectionTitle
            eyebrow="Was während einer Aufstellung geschieht"
            title="Aus Familiengeschichte wird ein Bild im Raum"
            intro="Eine Aufstellung beginnt mit einer klaren Frage und folgt dann dem, was in den Beziehungen zwischen den aufgestellten Personen sichtbar wird. Der Prozess dauert bei uns ungefähr 90 Minuten und wird von uns beiden geführt."
          />

          <div className="mt-14 grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
            <div>
              <div className="overflow-hidden rounded-[2rem] border-8 border-white shadow-[0_20px_55px_rgba(31,75,70,0.14)]">
                <img src="/familie/aust.jpeg" alt="Aufstellungsarbeit in einer Gruppe" className="h-[32rem] w-full object-cover object-center" />
              </div>
              <p className="mt-7 text-lg leading-8 text-[#47625e]">
                Es wird nur so viel Familiengeschichte einbezogen, wie für das konkrete Anliegen nötig ist. Wichtig sind Beziehungen und Ereignisse, die für das heutige Thema Bedeutung haben können: Herkunftsfamilie, gegenwärtige Familie, frühere Bindungen, Verluste, Trennungen und prägende Rollen.
              </p>
            </div>

            <ol className="divide-y divide-[#bfd4ca] border-y border-[#bfd4ca]">
              <li className="grid gap-4 py-8 first:pt-0 sm:grid-cols-[3.5rem_1fr] lg:py-9">
                <span className="text-3xl font-bold text-[#c69543]">01</span>
                <div>
                  <h3 className="text-2xl font-bold text-[#173c39]">Das Anliegen wird präzise</h3>
                  <p className="mt-3 leading-8 text-[#49645f]">Aus einem großen Thema entsteht eine konkrete Frage. Nicht „meine ganze Familie“ wird aufgestellt, sondern die Beziehung oder Dynamik, die heute geklärt werden soll. Schon dabei zeigt sich oft, welche Personen, Ereignisse oder Generationen für den Prozess wichtig sind.</p>
                </div>
              </li>
              <li className="grid gap-4 py-8 sm:grid-cols-[3.5rem_1fr] lg:py-9">
                <span className="text-3xl font-bold text-[#c69543]">02</span>
                <div>
                  <h3 className="text-2xl font-bold text-[#173c39]">Das innere Familienbild wird aufgestellt</h3>
                  <p className="mt-3 leading-8 text-[#49645f]">Du wählst Stellvertretende für die Menschen oder Elemente, die zu deiner Frage gehören, und gibst ihnen einen Platz im Raum. Abstand, Blickrichtung, Körperhaltung und die Position zueinander bilden ein erstes Bild. Dadurch wird eine Beziehungskonstellation sichtbar, die im Gespräch oft abstrakt bleibt.</p>
                </div>
              </li>
              <li className="grid gap-4 py-8 sm:grid-cols-[3.5rem_1fr] lg:py-9">
                <span className="text-3xl font-bold text-[#c69543]">03</span>
                <div>
                  <h3 className="text-2xl font-bold text-[#173c39]">Die Stellvertretenden geben dem System eine Stimme</h3>
                  <p className="mt-3 leading-8 text-[#49645f]">Stellvertretende spielen keine Rolle. Sie beschreiben, was sie an ihrem Platz wahrnehmen: Nähe, Distanz, Druck, einen Bewegungsimpuls oder eine Veränderung im Kontakt zu anderen. Wir fragen genau nach, führen die Wahrnehmungen zusammen und bleiben dabei eng mit deinem Anliegen verbunden.</p>
                </div>
              </li>
              <li className="grid gap-4 py-8 last:pb-0 sm:grid-cols-[3.5rem_1fr] lg:py-9">
                <span className="text-3xl font-bold text-[#c69543]">04</span>
                <div>
                  <h3 className="text-2xl font-bold text-[#173c39]">Eine stimmigere Ordnung wird erprobt</h3>
                  <p className="mt-3 leading-8 text-[#49645f]">Positionen können verändert, fehlende Personen einbezogen und Verantwortungen klarer zugeordnet werden. Kurze Sätze, Blickkontakt oder ein neuer Abstand machen spürbar, was sich verändert, wenn jede Person ihren eigenen Platz einnimmt. Am Ende steht kein perfektes Familienbild, sondern eine neue innere Orientierung für dein konkretes Thema.</p>
                </div>
              </li>
            </ol>
          </div>

          <div className="mt-14 grid overflow-hidden rounded-[2rem] bg-[#173c39] text-white lg:grid-cols-[0.72fr_1.28fr]">
            <div className="bg-[#0f7d79] px-7 py-10 sm:px-10 lg:py-12">
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#f1d7a0]">Spirit Healing</p>
              <h3 className="mt-4 text-3xl font-bold leading-tight">Wir führen den Prozess über das reine Aufstellungsbild hinaus</h3>
            </div>
            <div className="px-7 py-10 sm:px-10 lg:py-12">
              <p className="text-lg leading-8 text-white/90">
                Der Ausgangspunkt bleibt die familiensystemische Dynamik. Wenn sich im Verlauf eine starke gebundene Spannung zeigt, beziehen wir unsere energetische Wahrnehmung und Energiearbeit direkt in die Aufstellung ein. Das geschieht nicht als eigener Programmpunkt, sondern dort, wo die Beziehung im System sichtbar geworden ist. Zeigt sich zugleich ein deutlicher innerer Konflikt, kann auch die Arbeit mit diesem inneren Erleben kurz Teil des Prozesses werden. Der Fokus bleibt auf dem familiären Anliegen und der Bewegung, die sich daraus entwickelt.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="overflow-hidden rounded-[2rem] border border-[#e1e6df] bg-white p-3 shadow-[0_20px_60px_rgba(31,75,70,0.12)]">
            <img src="/ueberuns.jpeg" alt="Sabine Schmidt und Selcan Yilmaz" className="h-[32rem] w-full rounded-[1.4rem] object-cover object-center" />
          </div>
          <div>
            <SectionTitle
              eyebrow="Unsere gemeinsame Arbeit"
              title="Zu zweit behalten wir Person, System und Gruppe gleichzeitig im Blick"
              intro="In einer Familienaufstellung geschieht vieles zur selben Zeit. Stellvertretende reagieren aufeinander, eine Bewegung verändert das gesamte Bild und bei der Person mit dem Anliegen entsteht eine eigene körperliche oder emotionale Resonanz. Weil wir beide den Prozess leiten, können wir diese Ebenen parallel wahrnehmen und unmittelbar zusammenführen."
            />
            <p className="mt-8 border-l-4 border-[#0f7d79] pl-6 text-lg leading-8 text-[#3f5b57]">
              Wir arbeiten dabei nicht in starren Rollen. Eine von uns kann näher am Anliegen und an der unmittelbaren Reaktion bleiben, während die andere das ganze Beziehungsbild und die Gruppe im Blick behält. Beobachtungen werden nicht erst im Nachhinein ausgetauscht, sondern fließen in denselben Prozess ein. So greifen systemische Klärung und Energiearbeit direkt ineinander.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#f4ead6] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
            <div>
              <SectionTitle
                eyebrow="Eine eigene Aufstellung"
                title="Die Frage hinter dem Thema entscheidet"
                intro="Ein Anliegen eignet sich für eine Familienaufstellung, wenn es sich als Beziehung im System betrachten lässt. Dabei kann es um die Herkunftsfamilie, die heutige Familie, eine Partnerschaft oder die eigene Position zwischen mehreren Menschen gehen."
              />
              <p className="mt-8 text-lg leading-8 text-[#536762]">
                Du brauchst dafür keine vollständige Familienchronik. Wichtiger ist, was sich im heutigen Leben wiederholt oder an welcher Stelle du trotz vieler Gedanken nicht weiterkommst. Gemeinsam übersetzen wir das Thema in eine Frage, die sich im Raum untersuchen lässt.
              </p>
            </div>

            <div className="border-y border-[#d3bc91]">
              {[
                "Warum werde ich in meiner Herkunftsfamilie immer wieder in eine alte Rolle gezogen?",
                "Warum fällt mir Abgrenzung schwer, sobald jemand enttäuscht oder bedürftig wirkt?",
                "Welche Position habe ich im Konflikt zwischen Eltern, Geschwistern oder zwei Familienseiten übernommen?",
                "Warum wiederholt sich in meinen Partnerschaften dieselbe Bewegung zwischen Nähe, Rückzug und Verantwortung?",
                "Was ist rund um einen Verlust, eine Trennung oder ein ausgeschlossenes Familienmitglied offen geblieben?",
                "Was hindert mich daran, meinen eigenen Platz einzunehmen und mein Leben anders zu führen als meine Familie?",
              ].map((question) => (
                <p key={question} className="border-b border-[#d3bc91] py-6 text-xl font-semibold leading-8 text-[#244b47] last:border-b-0 sm:text-2xl sm:leading-9">
                  {question}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
          <SectionTitle
            eyebrow="Die Gruppe arbeitet mit"
            title="Auch ohne eigenes Anliegen bist du Teil der Aufstellungsarbeit"
            intro="Eine Intensivteilnahme ist kein Zuschauerplatz. Du nimmst an der Einführung, den Übungen, allen Aufstellungen und den gemeinsamen Einordnungen teil. Gerade durch die verschiedenen Familiengeschichten entsteht ein Lernraum, in dem sich systemische Dynamiken unmittelbar erleben lassen."
          />
          <div className="divide-y divide-[#cbdcd5] border-y border-[#cbdcd5]">
            <div className="py-8 first:pt-0">
              <h3 className="text-2xl font-bold text-[#173c39]">Als Stellvertretung musst du nichts darstellen</h3>
              <p className="mt-4 text-lg leading-8 text-[#506864]">Wenn du für eine Person oder ein Element gewählt wirst, nimmst du zunächst nur deinen Platz ein. Du beobachtest Körperempfindungen, Blickrichtungen, Nähe, Abstand und Bewegungsimpulse. Aus diesen Wahrnehmungen entwickelt sich die Aufstellung Schritt für Schritt.</p>
            </div>
            <div className="py-8">
              <h3 className="text-2xl font-bold text-[#173c39]">Andere Aufstellungen berühren oft eigene Familienthemen</h3>
              <p className="mt-4 text-lg leading-8 text-[#506864]">Auch wenn deine eigene Geschichte nicht aufgestellt wird, können vertraute Rollen sichtbar werden: die vermittelnde Tochter, der abwesende Vater, ein Bündnis zwischen zwei Generationen oder ein Familienmitglied, das immer außen steht. Die Einführung und unsere Einordnungen helfen dir, solche Bewegungen familiensystemisch zu verstehen.</p>
            </div>
            <div className="py-8 last:pb-0">
              <h3 className="text-2xl font-bold text-[#173c39]">Du entscheidest über jede Stellvertretung selbst</h3>
              <p className="mt-4 text-lg leading-8 text-[#506864]">Du kannst eine Rolle annehmen, ablehnen oder im Verlauf wieder abgeben. Nach jeder Aufstellung wird die Rolle bewusst verlassen. Persönliche Inhalte aus der Gruppe bleiben im Raum.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#d5e4dd] bg-[#edf5f1] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <SectionTitle
            eyebrow="Freitag und Samstag"
            title="Ein Wochenende mit Einführung, Erfahrung und Integration"
            intro="Am Freitag schaffen wir zuerst eine gemeinsame fachliche Grundlage. Danach beginnt die praktische Aufstellungsarbeit. Für den Samstag sind fünf weitere Aufstellungen vorgesehen. Der Ablauf bleibt flexibel, wenn ein Prozess mehr Zeit braucht."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <article className="rounded-3xl border border-[#ccded6] bg-white p-7 sm:p-9">
              <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#a67426]">Freitag, 9. Oktober</p>
              <h3 className="mt-3 text-2xl font-bold">Verstehen und erste Aufstellung</h3>
              <Timeline entries={friday} />
            </article>
            <article className="rounded-3xl border border-[#ccded6] bg-white p-7 sm:p-9">
              <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#a67426]">Samstag, 10. Oktober</p>
              <h3 className="mt-3 text-2xl font-bold">Aufstellungsarbeit und Abschluss</h3>
              <Timeline entries={saturday} />
            </article>
          </div>
          <p className="mt-6 text-sm leading-6 text-[#607470]">Die genannten Zeiten geben den geplanten Rahmen wieder. Bei intensiven Prozessen können Beginn und Dauer einzelner Abschnitte angepasst werden.</p>
        </div>
      </section>

      <section id="tickets" className="scroll-mt-8 mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <SectionTitle
          eyebrow="Dein Platz in der Gruppe"
          title="Zwei Formen der Teilnahme"
          intro="Beide Tickets gelten für Freitag und Samstag vollständig. Der Unterschied liegt ausschließlich darin, ob ein eigener Aufstellungsprozess verbindlich für dich reserviert ist."
          center
        />
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-2">
          <article className="relative overflow-hidden rounded-[2rem] border-2 border-[#0f7d79] bg-white p-8 shadow-[0_22px_60px_rgba(15,125,121,0.13)] sm:p-10">
            <span className="absolute right-0 top-0 rounded-bl-2xl bg-[#0f7d79] px-5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white">6 Plätze</span>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0f7d79]">Mit eigener Aufstellung</p>
            <p className="mt-5 text-5xl font-bold text-[#173c39]">444 €</p>
            <p className="mt-2 text-sm text-[#61736f]">für beide Tage</p>
            <ul className="mt-8 space-y-4 text-[#3f5b57]">
              {[
                "Teilnahme an Einführung, Übungen und allen Aufstellungen",
                "Ein reservierter Prozess für dein eigenes Anliegen",
                "Begleitung durch Sabine und Selcan",
                "Gemeinsame Einordnung und Integration",
              ].map((item) => <li key={item} className="flex gap-3 leading-7"><Check size={20} className="mt-1 shrink-0 text-[#0f7d79]" />{item}</li>)}
            </ul>
            {ownConstellationCheckoutUrl ? (
              <a href={ownConstellationCheckoutUrl} className="mt-9 block w-full rounded-full bg-[#0f7d79] px-6 py-4 text-center font-bold text-white transition hover:bg-[#075a57]">
                Jetzt verbindlich buchen
              </a>
            ) : (
              <button type="button" disabled className="mt-9 w-full cursor-not-allowed rounded-full bg-[#0f7d79]/70 px-6 py-4 font-bold text-white">
                Buchung wird freigeschaltet
              </button>
            )}
            <div className="mt-6 border-t border-[#d6e3dc] pt-6">
              <p className="text-center font-semibold text-[#536a66]">Zwei Raten auch möglich</p>
              <a href={ownConstellationInstallmentCheckoutUrl} className="mt-4 block w-full rounded-full border border-[#0f7d79] bg-white px-6 py-3.5 text-center font-bold text-[#0f7d79] transition hover:bg-[#edf5f1]">
                In 2 Raten buchen
              </a>
            </div>
          </article>

          <article className="rounded-[2rem] border border-[#d6e2dc] bg-[#f7faf8] p-8 sm:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#a67426]">Intensivteilnahme</p>
            <p className="mt-5 text-5xl font-bold text-[#173c39]">333 €</p>
            <p className="mt-2 text-sm text-[#61736f]">für beide Tage</p>
            <ul className="mt-8 space-y-4 text-[#3f5b57]">
              {[
                "Teilnahme an Einführung, Übungen und allen Aufstellungen",
                "Aktive Teilnahme als mögliche Stellvertretung",
                "Begleitung durch Sabine und Selcan",
                "Kein Anspruch auf die Aufstellung eines eigenen Anliegens",
              ].map((item) => <li key={item} className="flex gap-3 leading-7"><Check size={20} className="mt-1 shrink-0 text-[#0f7d79]" />{item}</li>)}
            </ul>
            {intensiveParticipationCheckoutUrl ? (
              <a href={intensiveParticipationCheckoutUrl} className="mt-9 block w-full rounded-full border border-[#0f7d79] bg-white px-6 py-4 text-center font-bold text-[#0f7d79] transition hover:bg-[#edf5f1]">
                Jetzt verbindlich buchen
              </a>
            ) : (
              <button type="button" disabled className="mt-9 w-full cursor-not-allowed rounded-full border border-[#0f7d79]/50 bg-white px-6 py-4 font-bold text-[#0f7d79]/70">
                Buchung wird freigeschaltet
              </button>
            )}
            <div className="mt-6 border-t border-[#d6e3dc] pt-6">
              <p className="text-center font-semibold text-[#536a66]">Zwei Raten auch möglich</p>
              <a href={intensiveParticipationInstallmentCheckoutUrl} className="mt-4 block w-full rounded-full border border-[#0f7d79] bg-white px-6 py-3.5 text-center font-bold text-[#0f7d79] transition hover:bg-[#edf5f1]">
                In 2 Raten buchen
              </a>
            </div>
          </article>
        </div>
        <div className="mx-auto mt-8 max-w-4xl rounded-2xl bg-[#f4ead6] px-6 py-5 text-center leading-7 text-[#4c615d]">
          Die bestehende Acht-Wochen-Gruppe erhält zuerst ein zeitlich begrenztes Vorbuchungsrecht. Anschließend werden verbleibende Plätze geöffnet.
        </div>
      </section>

      <footer className="border-t border-[#d6e3dc] bg-white py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 text-sm text-[#5d716d] sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <div className="flex items-center gap-3">
            <img src="/Logo-tuerkis.jpeg" alt="" className="h-10 w-10 rounded-full object-cover" />
            <p className="font-bold text-[#075a57]">Spirit Healing</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="/impressum" className="hover:text-[#0f7d79]">Impressum</a>
            <a href="/datenschutz" className="hover:text-[#0f7d79]">Datenschutz</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
