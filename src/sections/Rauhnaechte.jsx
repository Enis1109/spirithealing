import { Link } from "react-router-dom"
import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Facebook,
  Instagram,
  MoonStar,
  PlayCircle,
} from "lucide-react"

const checkoutLinks = {
  begleitungEinmalig: import.meta.env.VITE_RAUHNAECHTE_BEGLEITUNG_CHECKOUT_URL || "https://book.stripe.com/9B6eVf8ZQ3m5aFl6Rx83C0f",
  begleitungRateEins: import.meta.env.VITE_RAUHNAECHTE_BEGLEITUNG_RATE_CHECKOUT_URL || "https://book.stripe.com/8x214peka4q9dRx5Nt83C0h",
  persoenlichEinmalig: import.meta.env.VITE_RAUHNAECHTE_PERSOENLICH_CHECKOUT_URL || "https://book.stripe.com/7sYaEZa3U4q93cTa3J83C0i",
  persoenlichRateEins: import.meta.env.VITE_RAUHNAECHTE_PERSOENLICH_RATE_CHECKOUT_URL || "https://book.stripe.com/cNi4gB6RIg8RdRx1xd83C0g",
}

const dailyThemes = [
  ["01", "Ankommen", "Aus dem Lärm des Jahres zurück in deinen Körper kommen und spüren, was in dir jetzt Raum braucht."],
  ["02", "Rückblick", "Das vergangene Jahr ehrlich betrachten: was dich genährt hat, was dich erschöpft hat und was noch nachwirkt."],
  ["03", "Loslassen", "Wahrnehmen, was du aus Gewohnheit noch trägst, obwohl es längst zu schwer geworden ist."],
  ["04", "Den Körper hören", "Deine Körpersignale als Sprache verstehen und wieder feiner wahrnehmen, was sich für dich stimmig anfühlt."],
  ["05", "Beziehungen", "Erkennen, in welchen Verbindungen du ganz bei dir bist und wo du dich verlässt, um dazuzugehören."],
  ["06", "Grenzen", "Dein Nein, dein Ja und deinen eigenen Platz klarer spüren, ohne dich dafür rechtfertigen zu müssen."],
  ["07", "Die eigene Stimme", "Worte für das finden, was du lange zurückgehalten, angepasst oder selbst überhört hast."],
  ["08", "Wünsche", "Unterscheiden, was wirklich aus dir kommt und was du glaubst, wollen oder erfüllen zu müssen."],
  ["09", "Empfangen", "Dich für das öffnen, was dich stärkt, ohne sofort etwas leisten oder zurückgeben zu müssen."],
  ["10", "Entscheiden", "Aus innerer Klarheit eine Richtung wählen, die zu deinem heutigen Leben und deinem heutigen Selbst passt."],
  ["11", "Ausrichten", "Deine Aufmerksamkeit bewusst auf das lenken, dem du im neuen Jahr Kraft und Raum geben möchtest."],
  ["12", "Verkörpern", "Aus einem inneren Wunsch einen ersten greifbaren Schritt machen, der in deinem Alltag wirklich leben kann."],
]

const programIncluded = [
  "Zwölf geführte Meditationen oder Audio-Impulse",
  "Rauhnachtsjournal mit den täglichen Fragen und Platz für eigene Notizen",
  "Anleitung für das 13-Wünsche-Ritual mit einer sicheren Alternative zum Verbrennen",
  "Kurze Rituale für Rückblick, Loslassen, Ausrichtung und Verkörperung",
  "Live-Eröffnung im gemeinsamen Raum",
  "Gemeinsame Zwischenreflexion während der Rauhnächte",
  "Live-Abschluss inklusive Aufzeichnungen",
  "Geschützter Austausch während der gemeinsamen Zeit",
]

const SectionTitle = ({ eyebrow, title, intro, light = false }) => (
  <header className="max-w-4xl">
    <p className={`text-xs font-extrabold uppercase tracking-[0.24em] ${light ? "text-[#f1d7a0]" : "text-[#a67426]"}`}>{eyebrow}</p>
    <h2 className={`mt-4 font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl ${light ? "text-white" : "text-[#173c39]"}`}>{title}</h2>
    {intro && <p className={`mt-5 text-lg leading-8 ${light ? "text-white/75" : "text-[#49635f]"}`}>{intro}</p>}
  </header>
)

export const Rauhnaechte = () => {
  const scrollToBooking = () => {
    document.getElementById("rauhnaechte-buchen")?.scrollIntoView({ behavior: "smooth", block: "start" })
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
            <button type="button" onClick={scrollToBooking} className="hidden rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/15 sm:block">Jetzt buchen</button>
          </header>

          <div className="mt-12 grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
            <div className="relative z-10">
              <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-[#f1d7a0]">Die Rauhnächte mit Spirit Healing</p>
              <h1 className="mt-5 max-w-4xl font-serif text-5xl font-semibold leading-[0.98] sm:text-6xl lg:text-8xl">Zwölf Nächte.<br />Ein bewusster Übergang.</h1>
              <p className="mt-7 max-w-2xl text-xl leading-9 text-white/78">Es gibt Zeiten, in denen das Alte nicht mehr trägt und das Neue noch keinen Namen hat. Die Rauhnächte laden dich ein, still genug zu werden, um dich selbst wieder zu hören.</p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
                <button type="button" onClick={scrollToBooking} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d5ad61] px-7 py-4 font-bold text-[#173c39] shadow-[0_16px_36px_rgba(0,0,0,0.2)] transition hover:bg-[#f1d7a0]">Buchungsoptionen ansehen <ArrowDown size={18} /></button>
                <a href="#innere-reise" className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/5 px-7 py-4 font-bold text-white transition hover:bg-white/10">Die innere Reise entdecken</a>
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
                  <p className="mt-2 text-xl font-semibold leading-8">Wenn das Außen leiser wird, darf deine eigene Stimme wieder hörbar werden.</p>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.84fr_1.16fr] lg:gap-20">
          <SectionTitle
            eyebrow="Wenn das Jahr leiser wird"
            title="Vielleicht hast du viel getragen – und dich selbst dabei immer wieder überhört."
            intro="Du hast funktioniert, entschieden, reagiert und weitergemacht. Doch manches in dir hatte kaum Raum: eine Erschöpfung, die sich nicht wegorganisieren lässt, ein Wunsch ohne Worte oder das Gefühl, dass dein Leben nach außen läuft, während du innerlich stehen geblieben bist."
          />
          <div className="border-y border-[#cbdcd5]">
            <p className="py-8 text-xl font-semibold leading-9 text-[#244b47] sm:text-2xl">Ein Jahr kann enden, während seine Geschichten in dir weiterlaufen. Unerledigte Gefühle, alte Rollen und Entscheidungen, die du längst hinter dir lassen wolltest, melden sich oft gerade dann, wenn es stiller wird.</p>
            <p className="border-t border-[#cbdcd5] py-8 text-lg leading-8 text-[#506864]">Vielleicht warst du so lange im Tun, dass du kaum noch unterscheiden kannst, was du wirklich willst und was du nur weiterführst, weil es von dir erwartet wird.</p>
            <p className="border-t border-[#cbdcd5] py-8 text-lg leading-8 text-[#506864]">Die Rauhnächte geben diesen leisen Fragen einen geschützten Raum. Du musst noch keine Antwort kennen. Du darfst zuerst wahrnehmen, was in dir gesehen, verabschiedet oder neu gewählt werden möchte.</p>
          </div>
        </div>
      </section>

      <section id="innere-reise" className="scroll-mt-8 relative overflow-hidden bg-[#173c39] py-20 text-white lg:py-28">
        <div className="absolute -left-24 top-12 h-96 w-96 rounded-full bg-[#0f7d79]/30 blur-3xl" aria-hidden="true" />
        <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-[#c69543]/15 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[0.88fr_1.12fr] lg:gap-20 lg:px-10">
          <SectionTitle
            eyebrow="Die Schwelle"
            title="Zwischen dem, was war, und dem, was werden will, liegt ein stiller Raum."
            intro="Die Rauhnächte sind kein Orakel, das dir dein Leben erklärt. Sie schaffen einen bewussten Zwischenraum, in dem du das alte Jahr würdigen, deiner eigenen Wahrnehmung lauschen und deine Richtung neu wählen kannst."
            light
          />
          <div className="space-y-7 text-lg leading-8 text-white/78">
            <p>Wenn du langsamer wirst, wird sichtbar, was im Alltag leicht übergangen wird. Vielleicht spürst du Trauer über etwas, das nicht geworden ist. Vielleicht erkennst du, wie viel Kraft dich eine Rolle kostet, die längst nicht mehr zu dir passt.</p>
            <p>Meditationen, Schreiben, Körperwahrnehmung und ausgewählte Rituale helfen dir, bei diesen Wahrnehmungen zu bleiben, ohne sie sofort lösen oder bewerten zu müssen.</p>
            <blockquote className="border-l-2 border-[#f1d7a0] pl-6 font-serif text-2xl font-semibold leading-10 text-white sm:text-3xl">Du musst das neue Jahr nicht kontrollieren. Du darfst ihm aus einer klareren Verbindung zu dir selbst begegnen.</blockquote>
            <p>Aus dieser Verbindung kann eine andere Art von Wunsch entstehen: keiner, der dich von deinem heutigen Leben wegträgt, sondern einer, dem du im neuen Jahr mit deinen eigenen Entscheidungen näherkommst.</p>
          </div>
        </div>
      </section>

      <section id="themen" className="scroll-mt-8 mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <SectionTitle
          eyebrow="Zwölf innere Bewegungen"
          title="Eine Reise zurück zu dem, was in dir wahr ist"
          intro="Jede Rauhnacht öffnet eine andere Perspektive auf dein Erleben. Du musst dabei nichts erreichen. Die Themen helfen dir, tiefer zu lauschen und aus einzelnen Wahrnehmungen langsam eine stimmige innere Richtung entstehen zu lassen."
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
            eyebrow="Ein erster Raum für alle"
            title="Du darfst erst einmal hineinspüren."
            intro="Über unsere öffentlichen Kanäle teilen wir ausgewählte Gedanken, kurze Meditationen und Fragen aus der Rauhnachtszeit. So kannst du wahrnehmen, ob unsere Art der Begleitung und diese innere Reise für dich stimmig sind."
            light
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <article className="rounded-[2rem] border border-white/15 bg-white/7 p-7">
              <PlayCircle className="h-9 w-9 text-[#f1d7a0]" aria-hidden="true" />
              <h3 className="mt-5 font-serif text-3xl font-semibold">Gemeinsam still werden</h3>
              <p className="mt-4 leading-7 text-white/72">Ausgewählte Live-Meditationen öffnen einen ruhigen Raum, in dem du ankommen und deine Aufmerksamkeit wieder nach innen richten kannst.</p>
            </article>
            <article className="rounded-[2rem] border border-white/15 bg-white/7 p-7">
              <MoonStar className="h-9 w-9 text-[#f1d7a0]" aria-hidden="true" />
              <h3 className="mt-5 font-serif text-3xl font-semibold">Eine Frage, die bleibt</h3>
              <p className="mt-4 leading-7 text-white/72">Kurze Impulse geben dir eine Frage oder Wahrnehmung mit, die dich durch den Tag begleiten darf, ohne dass daraus eine weitere Aufgabe wird.</p>
            </article>
            <article className="rounded-[2rem] border border-white/15 bg-white/7 p-7">
              <CheckCircle2 className="h-9 w-9 text-[#f1d7a0]" aria-hidden="true" />
              <h3 className="mt-5 font-serif text-3xl font-semibold">In deinem eigenen Tempo</h3>
              <p className="mt-4 leading-7 text-white/72">Du entscheidest selbst, was du aufnimmst und wie tief du gehst. Auch ein einzelner bewusster Moment kann etwas in dir in Bewegung bringen.</p>
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
                intro="Das separat buchbare Programm verbindet die zwölf Nächte zu einem zusammenhängenden inneren Prozess. Längere Meditationen, das Journal, Live-Begegnungen, Aufzeichnungen und ein geschützter Austausch geben dir einen gehaltenen Raum für deine eigene Tiefe."
              />
              <button type="button" onClick={scrollToBooking} className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[#0f7d79] px-7 py-3.5 font-bold text-white transition hover:bg-[#075a57]">Buchungsoptionen ansehen</button>
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
          <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-6 text-[#63736f]">Wenn du am 13-Wochen-Programm teilnimmst, brauchst du die Rauhnächte nicht zusätzlich zu buchen. Die vollständige Begleitung ist dort bereits enthalten.</p>
        </div>
      </section>

      <section id="rauhnaechte-buchen" className="scroll-mt-8 bg-[#173c39] py-20 text-white lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <SectionTitle
            eyebrow="Deine Buchung"
            title="Wähle die Begleitung, die jetzt zu dir passt."
            intro="Beide Möglichkeiten führen dich durch die vollständigen Rauhnächte. In der persönlichen Variante kommt ein gemeinsames Einzelsetting hinzu, in dem wir das vertiefen, was sich in deinem Prozess zeigt."
            light
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <article className="flex flex-col rounded-[2rem] bg-white p-7 text-[#173c39] shadow-[0_22px_60px_rgba(0,0,0,0.18)] sm:p-10">
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#a67426]">Rauhnächte-Begleitung</p>
              <h3 className="mt-4 font-serif text-4xl font-semibold">222 €</h3>
              <p className="mt-2 text-sm font-semibold text-[#627570]">Einmalzahlung</p>
              <p className="mt-6 text-lg leading-8 text-[#506864]">Für dich, wenn du die zwölf Nächte in einem gehaltenen Gruppenraum erleben und deinen eigenen inneren Weg dabei bewusst gehen möchtest.</p>
              <ul className="mt-7 space-y-3 text-[#31534f]">
                {programIncluded.slice(0, 4).map((item) => <li key={item} className="flex gap-3 leading-7"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#0f7d79]" aria-hidden="true" />{item}</li>)}
                <li className="flex gap-3 leading-7"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#0f7d79]" aria-hidden="true" />Live-Begleitung, Aufzeichnungen und geschützter Austausch</li>
              </ul>
              <div className="mt-auto pt-8">
                <a href={checkoutLinks.begleitungEinmalig} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0f7d79] px-6 py-3.5 font-bold text-white transition hover:bg-[#075a57]">Einmalig 222 € buchen <ArrowRight size={18} /></a>
                <a href={checkoutLinks.begleitungRateEins} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-[#0f7d79] px-6 py-3.5 font-bold text-[#0f7d79] transition hover:bg-[#e8f2ee]">Mit 2 × 117 € buchen <ArrowRight size={18} /></a>
                <p className="mt-3 text-center text-xs leading-5 text-[#6d7e7a]">Raten-Gesamtpreis: 234 €</p>
              </div>
            </article>

            <article className="relative flex flex-col overflow-hidden rounded-[2rem] border border-[#d8bd82] bg-[#0f302f] p-7 text-white shadow-[0_22px_60px_rgba(0,0,0,0.22)] sm:p-10">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#c69543]/18 blur-3xl" aria-hidden="true" />
              <div className="relative">
                <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#f1d7a0]">Rauhnächte persönlich</p>
                <h3 className="mt-4 font-serif text-4xl font-semibold">555 €</h3>
                <p className="mt-2 text-sm font-semibold text-white/65">Einmalzahlung</p>
                <p className="mt-6 text-lg leading-8 text-white/76">Für dich, wenn du zusätzlich zur gemeinsamen Reise einen persönlichen Raum möchtest, in dem wir deine Wahrnehmungen und dein Thema gemeinsam vertiefen.</p>
                <ul className="mt-7 space-y-3 text-white/82">
                  <li className="flex gap-3 leading-7"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#f1d7a0]" aria-hidden="true" />Alles aus der vollständigen Rauhnächte-Begleitung</li>
                  <li className="flex gap-3 leading-7"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#f1d7a0]" aria-hidden="true" />Ein gemeinsames Einzelsetting mit Sabine und Selcan</li>
                  <li className="flex gap-3 leading-7"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#f1d7a0]" aria-hidden="true" />Wert des Einzelsettings: 333 €</li>
                </ul>
              </div>
              <div className="relative mt-auto pt-8">
                <a href={checkoutLinks.persoenlichEinmalig} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#f1d7a0] px-6 py-3.5 font-bold text-[#173c39] transition hover:bg-white">Einmalig 555 € buchen <ArrowRight size={18} /></a>
                <a href={checkoutLinks.persoenlichRateEins} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-white/50 px-6 py-3.5 font-bold text-white transition hover:bg-white/10">Mit 2 × 292 € buchen <ArrowRight size={18} /></a>
                <p className="mt-3 text-center text-xs leading-5 text-white/58">Raten-Gesamtpreis: 584 €</p>
              </div>
            </article>
          </div>

          <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-white/15 bg-white/7 px-6 py-5 text-center text-sm leading-6 text-white/72">
            <p>Bei Ratenzahlung wird die zweite Rate 30 Tage nach der ersten Zahlung fällig. Den gesonderten Stripe-Zahlungslink erhältst du per E-Mail. Die Ratenoption ist bis zum 23. November 2026 buchbar.</p>
            <p className="mt-2">Die Zahlung wird sicher über Stripe abgewickelt. Wenn du das 13-Wochen-Programm buchst, ist die vollständige Rauhnächte-Begleitung bereits enthalten.</p>
          </div>
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
