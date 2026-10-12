import { ArrowRight, CalendarDays, MapPin, Clock3 } from "lucide-react"
import { useLocation } from "react-router-dom"
import { BerlinLegacyConsentRevoke } from "@/components/BerlinLegacyConsentRevoke"
import {
  constellationDays,
  constellationPlace,
  constellationTime,
  constellationTicketPrices,
  constellationCapacity,
} from "@/content/constellationDays"

const copy = {
  de: {
    back: "Zur Spirit-Healing-Startseite",
    language: "Seitensprache",
    eyebrow: "Aufstellungsarbeit mit Sabine und Selcan",
    title: "Vier Tage für Aufstellungsarbeit",
    intro: "Im Dezember und Januar arbeiten wir an vier einzelnen Tagen mit Aufstellungen. Die türkischsprachigen und deutschsprachigen Tage sind getrennt buchbar.",
    dates: "12. und 13. Dezember 2026 · 30. und 31. Januar 2027",
    timeSuffix: " Uhr",
    choose: "Termin und Teilnahme wählen",
    daysTitle: "Wähle deinen Tag",
    daysIntro: "Jeder Termin gilt für einen Tag. Wähle zuerst das Datum und dann die passende Form der Teilnahme.",
    capacity: `${constellationCapacity.total} Plätze pro Tag, davon höchstens ${constellationCapacity.own} eigene Aufstellungen. Die beiden Stellvertretungs-Preise teilen sich ${constellationCapacity.representative} Plätze.`,
    languageName: { de: "Deutsch", tr: "Türkisch" },
    returning: "Stellvertretung · bereits verbunden",
    returningDescription: "Für Menschen, die beim vergangenen Aufstellungsseminar dabei waren oder schon zu Spirit Healing gehören.",
    returningCheckout: "Der Preis von 22 € wird beim Buchen automatisch eingesetzt. Bitte wähle ihn nur, wenn du zu dieser Gruppe gehörst.",
    new: "Stellvertretung · neu dabei",
    newDescription: "Für Menschen, die noch nicht bei einer Aufstellung mit uns waren und uns noch nicht kennen.",
    own: "Eigene Aufstellung",
    ownDescription: "Für Menschen, die sich an diesem Tag selbst aufstellen lassen möchten.",
    perDay: "pro Person und Tag",
    book: "Diesen Platz buchen",
    unavailable: "Buchung noch nicht freigeschaltet",
    questions: "Fragen zu deiner Teilnahme?",
    contact: "Schreib uns an info@spirit-healing.tr.",
    imprint: "Impressum",
    privacy: "Datenschutz",
  },
  tr: {
    back: "Spirit Healing ana sayfasına dön",
    language: "Sayfa dili",
    eyebrow: "Sabine ve Selcan ile dizim çalışması",
    title: "Dört ayrı dizim günü",
    intro: "Aralık ve Ocak aylarında dört ayrı günde dizim çalışması yapacağız. Türkçe ve Almanca günler ayrı ayrı rezerve edilir.",
    dates: "12 ve 13 Aralık 2026 · 30 ve 31 Ocak 2027",
    timeSuffix: "",
    choose: "Tarih ve katılım biçimini seç",
    daysTitle: "Katılacağınız günü seçin",
    daysIntro: "Her rezervasyon tek bir gün içindir. Önce tarihi, ardından katılım biçimini seçin.",
    capacity: `Her gün ${constellationCapacity.total} yer var. Bunların en fazla ${constellationCapacity.own} tanesi kendi dizimi içindir. İki temsilcilik fiyatı toplam ${constellationCapacity.representative} yeri paylaşır.`,
    languageName: { de: "Almanca", tr: "Türkçe" },
    returning: "Temsilci olarak · daha önce katılanlar",
    returningDescription: "Önceki dizim seminerine katılmış olanlar veya zaten Spirit Healing’e dahil olanlar için.",
    returningCheckout: "22 € tutarındaki fiyat ödeme sırasında otomatik uygulanır. Lütfen bu seçeneği yalnızca bu gruba dahilseniz seçin.",
    new: "Temsilci olarak · yeni katılanlar",
    newDescription: "Daha önce bizimle dizime katılmamış ve bizi henüz tanımayanlar için.",
    own: "Kendi dizimin",
    ownDescription: "O gün kendi dizimini açtırmak isteyenler için.",
    perDay: "kişi başına, bir gün için",
    book: "Bu yeri rezerve et",
    unavailable: "Rezervasyon henüz açılmadı",
    questions: "Katılımla ilgili sorun mu var?",
    contact: "info@spirit-healing.tr adresine yazın.",
    imprint: "Künye",
    privacy: "Gizlilik",
  },
}

const ticketTypes = ["returning", "new", "own"]

function formattedDate(date, language) {
  const timestamp = new Date(`${date}T12:00:00Z`)
  return new Intl.DateTimeFormat(language === "tr" ? "tr-TR" : "de-DE", {
    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Berlin",
  }).format(timestamp)
}

export const BerlinLive = () => {
  const { search } = useLocation()
  const language = new URLSearchParams(search).get("lang") === "tr" ? "tr" : "de"
  const t = copy[language]

  return (
    <main data-no-translate lang={language} className="min-h-screen bg-[#fbf8f1] text-[#173c39]">
      <header className="border-b border-[#dbe7e1] bg-[#f8f5ed]">
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-6 sm:px-8 lg:px-10 lg:pb-24">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <a href="/" aria-label={t.back} className="inline-flex items-center gap-3">
              <img src="/Logo-tuerkis.jpeg" alt="" className="h-12 w-12 rounded-full object-cover" />
              <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#075a57]">Spirit Healing</span>
            </a>
            <div className="inline-flex rounded-full border border-[#0f7d79]/30 bg-white p-1" role="group" aria-label={t.language}>
              <a href="/berlin-live" aria-current={language === "de" ? "page" : undefined} className={`rounded-full px-4 py-2 text-sm font-bold ${language === "de" ? "bg-[#0f7d79] text-white" : "text-[#075a57]"}`}>DE</a>
              <a href="/berlin-live?lang=tr" aria-current={language === "tr" ? "page" : undefined} className={`rounded-full px-4 py-2 text-sm font-bold ${language === "tr" ? "bg-[#0f7d79] text-white" : "text-[#075a57]"}`}>TR</a>
            </div>
          </div>

          <div className="mt-12 grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#a67426]">{t.eyebrow}</p>
              <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">{t.title}</h1>
              <p className="mt-7 max-w-2xl text-xl leading-9 text-[#3f5d59]">{t.intro}</p>
              <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold text-[#2c514d]">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#cbded6] bg-white px-4 py-2.5"><CalendarDays size={18} aria-hidden="true" />{t.dates}</span>
                {constellationPlace && <span className="inline-flex items-center gap-2 rounded-full border border-[#cbded6] bg-white px-4 py-2.5"><MapPin size={18} aria-hidden="true" />{constellationPlace}</span>}
                {constellationTime && <span className="inline-flex items-center gap-2 rounded-full border border-[#cbded6] bg-white px-4 py-2.5"><Clock3 size={18} aria-hidden="true" />{constellationTime}{t.timeSuffix}</span>}
              </div>
              <a href="#termine" className="mt-9 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0f7d79] px-7 py-4 font-bold text-white hover:bg-[#075a57]">{t.choose}<ArrowRight size={18} aria-hidden="true" /></a>
            </div>
            <div className="overflow-hidden rounded-[2rem] border-8 border-white shadow-[0_26px_70px_rgba(31,75,70,0.18)]">
              <img src="/familie/berlin.jpeg" alt="" className="h-80 w-full object-cover object-center lg:h-[29rem]" />
            </div>
          </div>
        </div>
      </header>

      <section id="termine" className="mx-auto max-w-7xl scroll-mt-8 px-5 py-16 sm:px-8 lg:px-10">
        <h2 className="text-3xl font-bold sm:text-4xl">{t.daysTitle}</h2>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[#49635f]">{t.daysIntro}</p>
        <p className="mt-2 max-w-3xl text-base leading-7 text-[#49635f]">{t.capacity}</p>
        <div className="mt-10 space-y-8">
          {constellationDays.map((day) => (
            <article key={day.id} id={`tag-${day.id}`} className="scroll-mt-8 rounded-[2rem] border border-[#cbded6] bg-white p-6 shadow-sm sm:p-9">
              <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[#d6e3dc] pb-6">
                <h3 className="text-2xl font-bold sm:text-3xl">{formattedDate(day.date, language)}</h3>
                <p className="rounded-full bg-[#edf5f1] px-4 py-2 text-sm font-bold text-[#075a57]">{t.languageName[day.language]}</p>
              </div>
              <div className="mt-7 grid gap-5 lg:grid-cols-3">
                {ticketTypes.map((type) => {
                  const checkoutUrl = day.links[type]
                  return (
                    <div key={type} className="flex flex-col rounded-2xl border border-[#d6e3dc] bg-[#fbf8f1] p-6">
                      <h4 className="text-lg font-bold">{t[type]}</h4>
                      <p className="mt-4 text-4xl font-bold">{constellationTicketPrices[type]} €</p>
                      <p className="mt-1 text-sm text-[#61736f]">{t.perDay}</p>
                      <p className="mb-6 mt-5 leading-7 text-[#3f5b57]">{t[`${type}Description`]}</p>
                      {type === "returning" && <p className="mb-5 text-sm leading-6 text-[#49635f]">{t.returningCheckout}</p>}
                      {checkoutUrl ? (
                        <a href={checkoutUrl} className="mt-auto inline-flex min-h-12 items-center justify-center rounded-full bg-[#0f7d79] px-5 py-3 text-center font-bold text-white hover:bg-[#075a57]">{t.book}</a>
                      ) : (
                        <span className="mt-auto inline-flex min-h-12 items-center justify-center rounded-full bg-[#dce8e2] px-5 py-3 text-center font-semibold text-[#4b6561]">{t.unavailable}</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10">
        <h2 className="text-2xl font-bold">{t.questions}</h2>
        <p className="mt-3 text-lg"><a href="mailto:info@spirit-healing.tr" className="underline underline-offset-4">{t.contact}</a></p>
      </section>
      <footer className="border-t border-[#d6e3dc] bg-white py-9">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-5 text-sm text-[#5d716d] sm:px-8 lg:px-10">
          <span className="font-bold text-[#075a57]">Spirit Healing</span>
          <div className="flex flex-wrap gap-6"><a href="/impressum">{t.imprint}</a><a href="/datenschutz">{t.privacy}</a><BerlinLegacyConsentRevoke /></div>
        </div>
      </footer>
    </main>
  )
}
