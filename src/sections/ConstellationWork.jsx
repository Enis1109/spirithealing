import { ArrowRight } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { ConstellationLayout } from "@/components/ConstellationLayout"
import { usePublishedContent } from "@/content/ContentContext"
import { getPublishedValue } from "@/content/contentValues"
import { berlinLiveDefaults } from "@/content/berlinLiveContent"
import { berlinLiveTurkishDefaults } from "@/content/berlinLiveTurkishContent"

const Title = ({ eyebrow, title, intro }) => <header className="max-w-3xl">
  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a67426]">{eyebrow}</p>
  <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">{title}</h2>
  {intro && <p className="mt-5 text-lg leading-8 text-[#49635f]">{intro}</p>}
</header>

const BerlinLink = ({ href, label }) => <Link to={href} className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[#0f7d79] px-6 py-4 font-bold text-white hover:bg-[#075a57]">{label}<ArrowRight size={18}/></Link>

export const ConstellationWork = () => {
  const { content } = usePublishedContent()
  const { search } = useLocation()
  const language = new URLSearchParams(search).get("lang") === "tr" ? "tr" : "de"
  const tr = language === "tr"
  const defaults = tr ? berlinLiveTurkishDefaults : berlinLiveDefaults
  const text = id => getPublishedValue(content, `${tr ? "berlin-tr" : "berlin"}.${id}`, language, defaults[id])
  const berlinPath = `/berlin-live${tr ? "?lang=tr" : ""}`
  const berlinCta = tr ? "Berlin’de canlı dizim" : "Live-Aufstellung in Berlin"

  return <ConstellationLayout language={language}>
    <section className="border-b border-[#d6e3dc] bg-[#f8f5ed]">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#a67426]">{tr ? "Sabine ve Selcan ile" : "Mit Sabine und Selcan"}</p>
          <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">{tr ? "Dizim çalışması" : "Aufstellungsarbeit"}</h1>
          <p className="mt-7 text-xl font-semibold leading-9">{text("hero.lead-strong")}</p>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#49635f]">{text("system.intro")}</p>
          <div className="mt-8"><BerlinLink href={berlinPath} label={berlinCta}/></div>
        </div>
        <div className="overflow-hidden rounded-[2rem] border-8 border-white shadow-lg"><img src="/ueberuns.jpeg" alt="Sabine Schmidt und Selcan Yilmaz" className="h-96 w-full object-cover object-center lg:h-[30rem]"/></div>
      </div>
    </section>
    <section id="live-aufstellungen" className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
      <article className="grid overflow-hidden rounded-[2rem] border border-[#cbded6] bg-white md:grid-cols-[1fr_20rem]">
        <div className="p-7 sm:p-10"><p className="text-sm font-bold text-[#a67426]">Berlin-Kreuzberg</p><h2 className="mt-3 text-3xl font-bold">{berlinCta}</h2><p className="mt-5 max-w-2xl text-lg leading-8 text-[#49635f]">{tr ? "Sabine ve Selcan ile dizim günleri. Türkçe ve Almanca günler ayrı ayrı rezerve edilir. Temsilci olarak veya kendi diziminizle katılabilirsiniz." : "Aufstellungstage mit Sabine und Selcan. Die türkischsprachigen und deutschsprachigen Tage sind getrennt buchbar. Du kannst als Stellvertretung oder mit eigener Aufstellung teilnehmen."}</p><Link to={berlinPath} className="mt-7 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#0f7d79] px-6 py-3 font-bold text-white">{tr ? "Tarihleri ve boş yerleri gör" : "Termine und freie Plätze ansehen"}<ArrowRight size={18}/></Link></div>
        <img src="/familie/berlin.jpeg" alt="" className="h-64 w-full object-cover md:h-full"/>
      </article>
    </section>
    <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16"><Title eyebrow={text("duo.eyebrow")} title={text("duo.title")} intro={text("duo.intro")}/><p className="border-l-4 border-[#0f7d79] pl-6 text-lg leading-8 text-[#49635f]">{text("duo.note")}</p></section>
    <section className="border-y border-[#d6e3dc] bg-[#edf5f1]"><div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
      <div><Title eyebrow={text("system.eyebrow")} title={text("system.title")}/><p className="mt-7 border-l-4 border-[#c69543] pl-6 text-xl leading-9">{text("system.note")}</p></div>
      <div className="divide-y divide-[#cbded6]">{[1, 2, 3, 4].map(number => <article key={number} className="py-7 first:pt-0 last:pb-0"><p className="text-xs font-bold uppercase tracking-wide text-[#a67426]">{text(`system.item-${number}-eyebrow`)}</p><h3 className="mt-3 text-2xl font-bold leading-tight">{text(`system.item-${number}-title`)}</h3><p className="mt-4 text-lg leading-8 text-[#49635f]">{text(`system.item-${number}-text`)}</p></article>)}</div>
    </div></section>
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8"><Title eyebrow={text("process.eyebrow")} title={text("process.title")} intro={text("process.intro")}/><p className="mt-6 max-w-3xl text-lg leading-8 text-[#49635f]">{text("process.image-note")}</p>
      <ol className="mt-9 grid gap-x-10 md:grid-cols-2">{[1, 2, 3, 4].map(number => <li key={number} className="border-t border-[#cbded6] py-7"><span className="text-sm font-bold text-[#a67426]">0{number}</span><h3 className="mt-3 text-2xl font-bold">{text(`process.step-${number}-title`)}</h3><p className="mt-4 leading-8 text-[#49635f]">{text(`process.step-${number}-text`)}</p></li>)}</ol>
      <div className="mt-8 rounded-[2rem] bg-[#173c39] p-7 text-white sm:p-10"><p className="text-xs font-bold uppercase tracking-wide text-[#f1d7a0]">{text("process.method-eyebrow")}</p><h3 className="mt-4 text-3xl font-bold">{text("process.method-title")}</h3><p className="mt-5 text-lg leading-8 text-white/90">{text("process.method-text")}</p></div>
    </section>
    <section className="bg-[#f4ead6]"><div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2"><div><Title eyebrow={text("own.eyebrow")} title={text("own.title")} intro={text("own.intro")}/><p className="mt-6 text-lg leading-8 text-[#49635f]">{text("own.note")}</p></div><div className="divide-y divide-[#d3bc91]">{text("own.questions").split("\n").filter(Boolean).map(question => <p key={question} className="py-5 text-lg font-semibold leading-8 first:pt-0">{question}</p>)}</div></div></section>
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8"><Title eyebrow={text("group.eyebrow")} title={text("group.title")}/><div className="mt-8 grid gap-7 md:grid-cols-3">{[1, 2, 3].map(number => <article key={number} className="border-t border-[#cbded6] pt-6"><h3 className="text-xl font-bold">{text(`group.item-${number}-title`)}</h3><p className="mt-4 leading-8 text-[#49635f]">{text(`group.item-${number}-text`)}</p></article>)}</div><div className="mt-12 flex flex-wrap items-center gap-5"><BerlinLink href={berlinPath} label={berlinCta}/><a href="mailto:info@spirit-healing.tr" className="underline underline-offset-4">info@spirit-healing.tr</a></div></section>
  </ConstellationLayout>
}
