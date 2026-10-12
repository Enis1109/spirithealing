import { ArrowRight, CalendarDays, Clock3, MapPin, ArrowLeft } from "lucide-react"
import { Link, useLocation, useParams } from "react-router-dom"
import { ConstellationLayout } from "@/components/ConstellationLayout"
import { ConstellationPlaces } from "@/components/ConstellationPlaces"
import { useConstellationAvailability } from "@/hooks/useConstellationAvailability"
import { NotFound } from "@/sections/NotFound"
import { constellationDays, constellationDate, constellationDayPath, constellationPlace,
  constellationTime, constellationTicketPrices } from "@/content/constellationDays"

const copy = {
  de: {
    main: "Aufstellungsarbeit", title: "Live-Aufstellung in Berlin",
    intro: "Mit Sabine und Selcan. Im Dezember und Januar widmen wir vier einzelne Tage der reinen Aufstellungsarbeit. Die Samstage sind auf Türkisch, die Sonntage auf Deutsch.",
    terms: "Termine und freie Plätze", choose: "Wähle deinen Aufstellungstag. Jeder Tag ist einzeln buchbar.",
    details: "Zu diesem Termin", back: "Alle Berliner Termine", language: { de: "Deutsch", tr: "Türkisch" },
    own: "Eigene Aufstellung", returning: "Stellvertretung · bereits verbunden", new: "Stellvertretung · neu dabei",
    ownDescription: "Für Menschen, die sich an diesem Tag selbst aufstellen lassen möchten.",
    returningDescription: "Für Menschen, die beim vergangenen Aufstellungsseminar dabei waren oder schon zu Spirit Healing gehören.",
    newDescription: "Für Menschen, die noch nicht bei einer Aufstellung mit uns waren und uns noch nicht kennen.",
    perDay: "pro Person und Tag", book: "Diesen Platz buchen", full: "Ausgebucht",
    capacity: "20 Plätze pro Tag, davon fünf für eigene Aufstellungen und 15 für Stellvertretung.",
    scope: "Ein Tag reine Aufstellungsarbeit mit Sabine und Selcan. Du nimmst als Stellvertretung teil oder buchst einen der fünf Plätze für dein eigenes Anliegen.",
    discount: "Wähle den Preis von 22 €, wenn du bereits zu Spirit Healing gehörst oder beim vergangenen Aufstellungsseminar dabei warst.",
    shared: "Die beiden Stellvertretungs-Preise gelten für dieselben 15 Plätze.",
    calendar: "Diesen Tag im Kalender ansehen", question: "Fragen zur Teilnahme?", timeSuffix: " Uhr",
    checking: "Aktuelle Plätze werden abgefragt.", checkFailure: "Die Platzanzeige ist gerade nicht erreichbar. Die verfügbaren Plätze werden beim Buchen geprüft.",
  },
  tr: {
    main: "Dizim çalışması", title: "Berlin’de canlı dizim",
    intro: "Sabine ve Selcan ile. Aralık ve Ocak aylarında dört ayrı günü dizim çalışmasına ayırıyoruz. Cumartesi günleri Türkçe, pazar günleri Almanca.",
    terms: "Tarihler ve boş yerler", choose: "Dizim gününüzü seçin. Her gün ayrı rezerve edilir.",
    details: "Bu tarihe git", back: "Berlin’deki tüm tarihler", language: { de: "Almanca", tr: "Türkçe" },
    own: "Kendi diziminiz", returning: "Temsilci olarak · daha önce katılanlar", new: "Temsilci olarak · yeni katılanlar",
    ownDescription: "O gün kendi dizimini açtırmak isteyenler için.",
    returningDescription: "Önceki dizim seminerine katılmış olanlar veya zaten Spirit Healing’e dahil olanlar için.",
    newDescription: "Daha önce bizimle dizime katılmamış ve bizi henüz tanımayanlar için.",
    perDay: "kişi başına, bir gün için", book: "Bu yeri rezerve et", full: "Kontenjan doldu",
    capacity: "Her gün 20 yer var: 5 kendi dizimi yeri ve 15 temsilci yeri.",
    scope: "Sabine ve Selcan ile bir gün dizim çalışması. Temsilci olarak katılabilir veya kendi konunuz için ayrılan beş yerden birini rezerve edebilirsiniz.",
    discount: "Zaten Spirit Healing’e dahilseniz veya önceki dizim seminerine katıldıysanız 22 € fiyatını seçin.",
    shared: "İki temsilcilik fiyatı aynı 15 yeri paylaşır.",
    calendar: "Bu günü takvimde gör", question: "Katılımla ilgili sorularınız mı var?", timeSuffix: "",
    checking: "Güncel kontenjan sorgulanıyor.", checkFailure: "Kontenjan bilgisine şu anda ulaşılamıyor. Boş yerler rezervasyon sırasında kontrol edilir.",
  },
}

const Facts = ({ language }) => <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold text-[#49635f]">
  <span className="inline-flex items-center gap-2"><MapPin size={17}/>{constellationPlace}</span>
  <span className="inline-flex items-center gap-2"><Clock3 size={17}/>{constellationTime}{copy[language].timeSuffix}</span>
</div>

export const BerlinLive = () => {
  const { search } = useLocation()
  const { dayId } = useParams()
  const language = new URLSearchParams(search).get("lang") === "tr" ? "tr" : "de"
  const t = copy[language]
  const availability = useConstellationAvailability()
  const day = dayId ? constellationDays.find(item => item.id === dayId) : null
  const seats = day ? availability === null ? null : availability?.[day.id] : undefined
  const berlinPath = `/berlin-live${language === "tr" ? "?lang=tr" : ""}`
  if (dayId && !day) return <NotFound/>

  return <ConstellationLayout language={language} breadcrumbs={[
    { label: t.main, href: `/aufstellungsarbeit${language === "tr" ? "?lang=tr" : ""}` },
    { label: t.title, ...(day ? { href: berlinPath } : {}) },
    ...(day ? [{ label: constellationDate(day.date, language) }] : []),
  ]}>
    <section className="mx-auto grid max-w-7xl items-center gap-9 px-5 py-12 sm:px-8 lg:grid-cols-[1.25fr_0.75fr]">
      <div><p className="text-sm font-bold uppercase tracking-[0.16em] text-[#a67426]">{day ? t.language[day.language] : language === "tr" ? "Sabine ve Selcan ile" : "Mit Sabine und Selcan"}</p><h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">{day ? constellationDate(day.date, language) : t.title}</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-[#49635f]">{day ? t.scope : t.intro}</p><Facts language={language}/><p className="mt-4 text-sm leading-7 text-[#49635f]">{t.capacity}</p>{day && <div className="mt-5"><ConstellationPlaces seats={seats} language={language}/></div>}</div>
      <img src="/familie/berlin.jpeg" alt="" className="h-64 w-full rounded-[2rem] object-cover lg:h-80"/>
    </section>
    {!day ? <section id="termine" className="mx-auto max-w-7xl px-5 pb-12 pt-6 sm:px-8">
      <h2 className="text-3xl font-bold">{t.terms}</h2><p className="mt-4 text-lg leading-8 text-[#49635f]">{t.choose}</p>
      <div className="mt-8 grid gap-5 md:grid-cols-2">{constellationDays.map(item => <article key={item.id} id={`tag-${item.id}`} className="flex scroll-mt-8 flex-col rounded-[1.75rem] border border-[#cbded6] bg-white p-6 sm:p-8"><p className="text-sm font-bold text-[#a67426]">{t.language[item.language]}</p><h3 className="mt-3 text-2xl font-bold">{constellationDate(item.date, language)}</h3><Facts language={language}/><div className="mt-5"><ConstellationPlaces seats={availability === null ? null : availability?.[item.id]} language={language}/></div><p className="mb-6 mt-4 text-sm leading-6 text-[#49635f]">{language === "tr" ? "Temsilci: 22 € veya 44 € · kendi dizimi: 160 €" : "Stellvertretung: 22 € oder 44 € · eigene Aufstellung: 160 €"}</p><Link to={constellationDayPath(item, language)} className="mt-auto inline-flex min-h-12 items-center justify-between gap-3 rounded-full bg-[#0f7d79] px-6 py-3 font-bold text-white hover:bg-[#075a57]">{availability?.[item.id]?.total === 0 ? t.full : t.details}<ArrowRight size={18}/></Link></article>)}</div>
      <Link to="/vortraege-seminare#kalender" className="mt-7 inline-block underline underline-offset-4">{language === "tr" ? "Etkinlik takvimine git" : "Zum Veranstaltungskalender"}</Link>
    </section> : <section id="teilnahme" className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
      <div className="grid gap-5 lg:grid-cols-3">{["returning", "new", "own"].map(type => {
        const checkoutUrl = day.links[type]
        const remaining = seats?.[type === "own" ? "own" : "representative"]
        const full = remaining === 0
        return <article key={type} className="flex flex-col rounded-[1.75rem] border border-[#cbded6] bg-white p-7"><h2 className="text-xl font-bold">{t[type]}</h2><p className="mt-5 text-4xl font-bold">{constellationTicketPrices[type]} €</p><p className="mt-2 text-sm text-[#61736f]">{t.perDay}</p><p className="mt-5 leading-7 text-[#49635f]">{t[`${type}Description`]}</p><p className="mb-6 mt-5 text-sm font-bold text-[#075a57]">{Number.isInteger(remaining) ? language === "tr" ? `${remaining} boş yer` : `${remaining} ${remaining === 1 ? "freier Platz" : "freie Plätze"}` : t.checking}</p>{full ? <span className="mt-auto rounded-full bg-[#e5ece8] px-5 py-3 text-center font-bold">{t.full}</span> : <a href={checkoutUrl} className="mt-auto inline-flex min-h-12 items-center justify-center rounded-full bg-[#0f7d79] px-5 py-3 text-center font-bold text-white hover:bg-[#075a57]">{t.book}</a>}</article>
      })}</div>
      <p className="mt-6 max-w-3xl text-sm leading-7 text-[#49635f]">{t.discount} {t.shared}</p>
      {availability === null && <p className="mt-3 text-sm leading-7 text-[#49635f]">{t.checkFailure}</p>}
      <div className="mt-9 flex flex-wrap items-center gap-6"><Link to={berlinPath} className="inline-flex items-center gap-2 font-bold text-[#075a57]"><ArrowLeft size={18}/>{t.back}</Link><Link to={`/vortraege-seminare?monat=${day.date.slice(0, 7)}&tag=${day.date}#kalender`} className="underline underline-offset-4"><CalendarDays size={16} className="mr-2 inline"/>{t.calendar}</Link></div>
    </section>}
    <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8"><h2 className="text-2xl font-bold">{t.question}</h2><a href="mailto:info@spirit-healing.tr" className="mt-4 inline-block underline underline-offset-4">info@spirit-healing.tr</a></section>
  </ConstellationLayout>
}
