import {
  ArrowDown,
  CalendarDays,
  Check,
  Clock3,
  MapPin,
} from "lucide-react"
import { useLocation } from "react-router-dom"
import { usePublishedContent } from "@/content/ContentContext"
import { getPublishedValue } from "@/content/contentValues"
import { berlinLiveDefaults } from "@/content/berlinLiveContent"
import {
  berlinLiveStaticTurkishTranslations,
  berlinLiveTurkishDefaults,
} from "@/content/berlinLiveTurkishContent"

const colors = {
  ink: "#173c39",
  teal: "#0f7d79",
  tealDark: "#075a57",
  gold: "#c69543",
  paper: "#fbf8f1",
}

const germanTimelineTimes = ["10:00–13:00", "13:00–14:00", "14:00–ca. 19:00"]

const nonEmptyLines = (value, fallback) => {
  const lines = String(value || "").split("\n").map((line) => line.trim()).filter(Boolean)
  return lines.length ? lines : String(fallback || "").split("\n").map((line) => line.trim()).filter(Boolean)
}

const timelineFrom = (value, fallback, times = germanTimelineTimes) => {
  const labels = nonEmptyLines(value, fallback)
  return times.map((time, index) => [time, labels[index] || ""])
}

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
  const { content } = usePublishedContent()
  const { search } = useLocation()
  const searchParams = new URLSearchParams(search)
  const pageLanguage = searchParams.get("lang") === "tr" ? "tr" : "de"
  const isTurkish = pageLanguage === "tr"
  const defaults = isTurkish ? berlinLiveTurkishDefaults : berlinLiveDefaults
  const keyPrefix = isTurkish ? "berlin-tr" : "berlin"
  const text = (id) => getPublishedValue(content, `${keyPrefix}.${id}`, pageLanguage, defaults[id])
  const staticText = (german) => isTurkish
    ? berlinLiveStaticTurkishTranslations[german] || german
    : german
  const timelineTimes = germanTimelineTimes.map(staticText)
  const friday = timelineFrom(text("weekend.friday-lines"), defaults["weekend.friday-lines"], timelineTimes)
  const saturday = timelineFrom(text("weekend.saturday-lines"), defaults["weekend.saturday-lines"], timelineTimes)
  const ownQuestions = nonEmptyLines(text("own.questions"), defaults["own.questions"])
  const ownTicketItems = nonEmptyLines(text("tickets.own-items"), defaults["tickets.own-items"])
  const intensiveTicketItems = nonEmptyLines(text("tickets.intensive-items"), defaults["tickets.intensive-items"])
  const systemItems = [1, 2, 3, 4].map((number) => ({
    id: number,
    eyebrow: text(`system.item-${number}-eyebrow`),
    title: text(`system.item-${number}-title`),
    body: text(`system.item-${number}-text`),
  }))
  const processSteps = [1, 2, 3, 4].map((number) => ({
    number: String(number).padStart(2, "0"),
    title: text(`process.step-${number}-title`),
    body: text(`process.step-${number}-text`),
  }))
  const groupItems = [1, 2, 3].map((number) => ({
    id: number,
    title: text(`group.item-${number}-title`),
    body: text(`group.item-${number}-text`),
  }))

  const scrollToTickets = () => {
    document.getElementById("tickets")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const languageHref = (nextLanguage) => {
    const nextParams = new URLSearchParams(searchParams)
    if (nextLanguage === "tr") nextParams.set("lang", "tr")
    else nextParams.delete("lang")
    const query = nextParams.toString()
    return `/berlin-live${query ? `?${query}` : ""}`
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
    <main data-no-translate className="min-h-screen bg-[#fbf8f1] text-[#173c39]" style={{ color: colors.ink }}>
      <section className="relative isolate overflow-hidden border-b border-[#dbe7e1] bg-[#f8f5ed]">
        <div className="absolute -left-40 top-24 h-96 w-96 rounded-full bg-[#d8ebe3]/70 blur-3xl" aria-hidden="true" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[#f2dfb9]/65 blur-3xl" aria-hidden="true" />

        <div className="mx-auto max-w-7xl px-5 pb-16 pt-6 sm:px-8 lg:px-10 lg:pb-24">
          <div className="flex items-center justify-between gap-4">
            <a href="/" aria-label={staticText("Zur Spirit-Healing-Startseite")} className="inline-flex items-center gap-3">
              <img src="/Logo-tuerkis.jpeg" alt="Spirit Healing" className="h-12 w-12 rounded-full object-cover shadow-sm" />
              <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#075a57]">Spirit Healing</span>
            </a>
            <div className="flex items-center gap-3">
              <div className="inline-flex rounded-full border border-[#0f7d79]/30 bg-white/90 p-1 shadow-sm" role="group" aria-label={isTurkish ? "Sayfa dili" : "Seitensprache"}>
                {[
                  { code: "de", label: "DE", title: "Deutsch" },
                  { code: "tr", label: "TR", title: "Türkçe" },
                ].map((option) => {
                  const active = pageLanguage === option.code
                  return (
                    <a
                      key={option.code}
                      href={languageHref(option.code)}
                      title={option.title}
                      aria-current={active ? "page" : undefined}
                      className={`min-w-11 rounded-full px-3 py-2 text-xs font-extrabold tracking-[0.12em] transition ${active ? "bg-[#0f7d79] text-white shadow-sm" : "text-[#075a57] hover:bg-[#edf5f1]"}`}
                    >
                      {option.label}
                    </a>
                  )
                })}
              </div>
              <button type="button" onClick={scrollToTickets} className="hidden rounded-full border border-[#0f7d79]/30 bg-white/80 px-5 py-2.5 text-sm font-bold text-[#075a57] transition hover:border-[#0f7d79] hover:bg-white sm:block">
                {text("hero.nav-cta")}
              </button>
            </div>
          </div>

          <div className="mt-12 grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
            <div className="relative z-10">
              <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-[#a67426]">{text("hero.eyebrow")}</p>
              <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-[1.06] text-[#173c39] sm:text-5xl lg:text-7xl">
                {text("hero.title")}
              </h1>
              <p className="mt-7 max-w-2xl text-xl leading-9 text-[#3f5d59]">
                <span className="font-semibold text-[#244b47]">{text("hero.lead-strong")}</span>{" "}
                {text("hero.lead")}
              </p>

              <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold text-[#2c514d]">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#cbded6] bg-white/90 px-4 py-2.5"><CalendarDays size={17} className="text-[#0f7d79]" />{text("hero.date")}</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#cbded6] bg-white/90 px-4 py-2.5"><Clock3 size={17} className="text-[#0f7d79]" />{text("hero.time")}</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#cbded6] bg-white/90 px-4 py-2.5"><MapPin size={17} className="text-[#0f7d79]" />{text("hero.location")}</span>
              </div>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
                <button type="button" onClick={scrollToTickets} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0f7d79] px-7 py-4 font-bold text-white shadow-[0_16px_36px_rgba(15,125,121,0.22)] transition hover:bg-[#075a57]">
                  {text("hero.cta")} <ArrowDown size={18} />
                </button>
                <p className="whitespace-pre-line text-sm leading-6 text-[#5b706d]">{text("hero.capacity")}</p>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
              <div className="absolute -inset-4 rotate-2 rounded-[2rem] border border-[#d8c08d]/60 bg-[#f4e8cf]" aria-hidden="true" />
              <div className="relative overflow-hidden rounded-[2rem] border-8 border-white bg-white shadow-[0_26px_70px_rgba(31,75,70,0.18)]">
                <img src="/familie/berlin.jpeg" alt={staticText("Blick über Berlin bei Abendlicht")} className="h-[30rem] w-full object-cover object-center" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#173c39]/90 via-[#173c39]/50 to-transparent px-7 pb-7 pt-24 text-white">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f1d7a0]">{text("hero.image-eyebrow")}</p>
                  <p className="mt-2 text-xl font-semibold leading-8">{text("hero.image-text")}</p>
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
              eyebrow={text("system.eyebrow")}
              title={text("system.title")}
              intro={text("system.intro")}
            />
            <p className="mt-9 border-l-4 border-[#c69543] pl-6 text-xl font-semibold leading-9 text-[#244b47]">
              {text("system.note")}
            </p>
          </div>

          <div className="divide-y divide-[#cbdcd5] border-y border-[#cbdcd5]">
            {systemItems.map((item) => (
              <article key={item.id} className="py-9 first:pt-0 last:pb-0 lg:py-11">
                <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#a67426]">{item.eyebrow}</p>
                <h3 className="mt-3 text-2xl font-bold leading-tight text-[#173c39] sm:text-3xl">{item.title}</h3>
                <p className="mt-5 text-lg leading-8 text-[#4b6561]">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#d7e4de] bg-[#edf5f1] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <SectionTitle
            eyebrow={text("process.eyebrow")}
            title={text("process.title")}
            intro={text("process.intro")}
          />

          <div className="mt-14 grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
            <div>
              <div className="overflow-hidden rounded-[2rem] border-8 border-white shadow-[0_20px_55px_rgba(31,75,70,0.14)]">
                <img src="/familie/aust.jpeg" alt={staticText("Aufstellungsarbeit in einer Gruppe")} className="h-[32rem] w-full object-cover object-center" />
              </div>
              <p className="mt-7 text-lg leading-8 text-[#47625e]">
                {text("process.image-note")}
              </p>
            </div>

            <ol className="divide-y divide-[#bfd4ca] border-y border-[#bfd4ca]">
              {processSteps.map((step) => (
                <li key={step.number} className="grid gap-4 py-8 first:pt-0 last:pb-0 sm:grid-cols-[3.5rem_1fr] lg:py-9">
                  <span className="text-3xl font-bold text-[#c69543]">{step.number}</span>
                  <div>
                    <h3 className="text-2xl font-bold text-[#173c39]">{step.title}</h3>
                    <p className="mt-3 leading-8 text-[#49645f]">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-14 grid overflow-hidden rounded-[2rem] bg-[#173c39] text-white lg:grid-cols-[0.72fr_1.28fr]">
            <div className="bg-[#0f7d79] px-7 py-10 sm:px-10 lg:py-12">
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#f1d7a0]">{text("process.method-eyebrow")}</p>
              <h3 className="mt-4 text-3xl font-bold leading-tight">{text("process.method-title")}</h3>
            </div>
            <div className="px-7 py-10 sm:px-10 lg:py-12">
              <p className="text-lg leading-8 text-white/90">
                {text("process.method-text")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="overflow-hidden rounded-[2rem] border border-[#e1e6df] bg-white p-3 shadow-[0_20px_60px_rgba(31,75,70,0.12)]">
            <img src="/ueberuns.jpeg" alt={staticText("Sabine Schmidt und Selcan Yilmaz")} className="h-[32rem] w-full rounded-[1.4rem] object-cover object-center" />
          </div>
          <div>
            <SectionTitle
              eyebrow={text("duo.eyebrow")}
              title={text("duo.title")}
              intro={text("duo.intro")}
            />
            <p className="mt-8 border-l-4 border-[#0f7d79] pl-6 text-lg leading-8 text-[#3f5b57]">
              {text("duo.note")}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#f4ead6] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
            <div>
              <SectionTitle
                eyebrow={text("own.eyebrow")}
                title={text("own.title")}
                intro={text("own.intro")}
              />
              <p className="mt-8 text-lg leading-8 text-[#536762]">
                {text("own.note")}
              </p>
            </div>

            <div className="border-y border-[#d3bc91]">
              {ownQuestions.map((question) => (
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
            eyebrow={text("group.eyebrow")}
            title={text("group.title")}
            intro={text("group.intro")}
          />
          <div className="divide-y divide-[#cbdcd5] border-y border-[#cbdcd5]">
            {groupItems.map((item) => (
              <div key={item.id} className="py-8 first:pt-0 last:pb-0">
                <h3 className="text-2xl font-bold text-[#173c39]">{item.title}</h3>
                <p className="mt-4 text-lg leading-8 text-[#506864]">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#d5e4dd] bg-[#edf5f1] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <SectionTitle
            eyebrow={text("weekend.eyebrow")}
            title={text("weekend.title")}
            intro={text("weekend.intro")}
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <article className="rounded-3xl border border-[#ccded6] bg-white p-7 sm:p-9">
              <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#a67426]">{text("weekend.friday-date")}</p>
              <h3 className="mt-3 text-2xl font-bold">{text("weekend.friday-title")}</h3>
              <Timeline entries={friday} />
            </article>
            <article className="rounded-3xl border border-[#ccded6] bg-white p-7 sm:p-9">
              <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#a67426]">{text("weekend.saturday-date")}</p>
              <h3 className="mt-3 text-2xl font-bold">{text("weekend.saturday-title")}</h3>
              <Timeline entries={saturday} />
            </article>
          </div>
          <p className="mt-6 text-sm leading-6 text-[#607470]">{text("weekend.note")}</p>
        </div>
      </section>

      <section id="tickets" className="scroll-mt-8 mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <SectionTitle
          eyebrow={text("tickets.eyebrow")}
          title={text("tickets.title")}
          intro={text("tickets.intro")}
          center
        />
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-2">
          <article className="relative overflow-hidden rounded-[2rem] border-2 border-[#0f7d79] bg-white p-8 shadow-[0_22px_60px_rgba(15,125,121,0.13)] sm:p-10">
            <span className="absolute right-0 top-0 rounded-bl-2xl bg-[#0f7d79] px-5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white">{staticText("6 Plätze")}</span>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0f7d79]">{text("tickets.own-label")}</p>
            <p className="mt-5 text-5xl font-bold text-[#173c39]">444 €</p>
            <p className="mt-2 text-sm text-[#61736f]">{text("tickets.duration")}</p>
            <ul className="mt-8 space-y-4 text-[#3f5b57]">
              {ownTicketItems.map((item) => <li key={item} className="flex gap-3 leading-7"><Check size={20} className="mt-1 shrink-0 text-[#0f7d79]" />{item}</li>)}
            </ul>
            {ownConstellationCheckoutUrl ? (
              <a href={ownConstellationCheckoutUrl} className="mt-9 block w-full rounded-full bg-[#0f7d79] px-6 py-4 text-center font-bold text-white transition hover:bg-[#075a57]">
                {text("tickets.own-cta")}
              </a>
            ) : (
              <button type="button" disabled className="mt-9 w-full cursor-not-allowed rounded-full bg-[#0f7d79]/70 px-6 py-4 font-bold text-white">
                {staticText("Buchung wird freigeschaltet")}
              </button>
            )}
            <div className="mt-6 border-t border-[#d6e3dc] pt-6">
              <p className="text-center font-semibold text-[#536a66]">{text("tickets.installment-note")}</p>
              <a href={ownConstellationInstallmentCheckoutUrl} className="mt-4 block w-full rounded-full border border-[#0f7d79] bg-white px-6 py-3.5 text-center font-bold text-[#0f7d79] transition hover:bg-[#edf5f1]">
                {text("tickets.installment-cta")}
              </a>
            </div>
          </article>

          <article className="rounded-[2rem] border border-[#d6e2dc] bg-[#f7faf8] p-8 sm:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#a67426]">{text("tickets.intensive-label")}</p>
            <p className="mt-5 text-5xl font-bold text-[#173c39]">333 €</p>
            <p className="mt-2 text-sm text-[#61736f]">{text("tickets.duration")}</p>
            <ul className="mt-8 space-y-4 text-[#3f5b57]">
              {intensiveTicketItems.map((item) => <li key={item} className="flex gap-3 leading-7"><Check size={20} className="mt-1 shrink-0 text-[#0f7d79]" />{item}</li>)}
            </ul>
            {intensiveParticipationCheckoutUrl ? (
              <a href={intensiveParticipationCheckoutUrl} className="mt-9 block w-full rounded-full border border-[#0f7d79] bg-white px-6 py-4 text-center font-bold text-[#0f7d79] transition hover:bg-[#edf5f1]">
                {text("tickets.intensive-cta")}
              </a>
            ) : (
              <button type="button" disabled className="mt-9 w-full cursor-not-allowed rounded-full border border-[#0f7d79]/50 bg-white px-6 py-4 font-bold text-[#0f7d79]/70">
                {staticText("Buchung wird freigeschaltet")}
              </button>
            )}
            <div className="mt-6 border-t border-[#d6e3dc] pt-6">
              <p className="text-center font-semibold text-[#536a66]">{text("tickets.installment-note")}</p>
              <a href={intensiveParticipationInstallmentCheckoutUrl} className="mt-4 block w-full rounded-full border border-[#0f7d79] bg-white px-6 py-3.5 text-center font-bold text-[#0f7d79] transition hover:bg-[#edf5f1]">
                {text("tickets.installment-cta")}
              </a>
            </div>
          </article>
        </div>
        <div className="mx-auto mt-8 max-w-4xl rounded-2xl bg-[#f4ead6] px-6 py-5 text-center leading-7 text-[#4c615d]">
          {text("tickets.priority-note")}
        </div>
      </section>

      <footer className="border-t border-[#d6e3dc] bg-white py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 text-sm text-[#5d716d] sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <div className="flex items-center gap-3">
            <img src="/Logo-tuerkis.jpeg" alt="" className="h-10 w-10 rounded-full object-cover" />
            <p className="font-bold text-[#075a57]">Spirit Healing</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="/impressum" className="hover:text-[#0f7d79]">{staticText("Impressum")}</a>
            <a href="/datenschutz" className="hover:text-[#0f7d79]">{staticText("Datenschutz")}</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
