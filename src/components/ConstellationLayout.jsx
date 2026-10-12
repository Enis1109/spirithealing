import { Link, useLocation } from "react-router-dom"
import { BerlinLegacyConsentRevoke } from "@/components/BerlinLegacyConsentRevoke"

export const ConstellationLayout = ({ children, language = "de", breadcrumbs = [] }) => {
  const { pathname } = useLocation()
  const tr = language === "tr"
  return <main data-no-translate lang={language} className="min-h-screen bg-[#fbf8f1] text-[#173c39]">
    <header className="border-b border-[#d6e3dc] bg-[#f8f5ed]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-5 py-5 sm:px-8">
        <Link to="/" aria-label={tr ? "Spirit Healing ana sayfası" : "Zur Spirit-Healing-Startseite"} className="inline-flex items-center gap-3"><img src="/Logo-tuerkis.jpeg" alt="" className="h-12 w-12 rounded-full object-cover"/><span className="text-sm font-bold uppercase tracking-[0.16em]">Spirit Healing</span></Link>
        <nav aria-label={tr ? "Gezinme" : "Seitennavigation"} className="flex flex-wrap items-center gap-5 text-sm font-semibold">
          <Link to={`/aufstellungsarbeit${tr ? "?lang=tr" : ""}`}>{tr ? "Dizim çalışması" : "Aufstellungsarbeit"}</Link>
          <Link to="/vortraege-seminare#kalender">{tr ? "Takvim" : "Kalender"}</Link>
          <div className="inline-flex rounded-full border border-[#0f7d79]/30 bg-white p-1" role="group" aria-label={tr ? "Sayfa dili" : "Seitensprache"}>
            <Link to={pathname} aria-current={!tr ? "page" : undefined} className={`rounded-full px-3 py-2 ${!tr ? "bg-[#0f7d79] text-white" : ""}`}>DE</Link>
            <Link to={`${pathname}?lang=tr`} aria-current={tr ? "page" : undefined} className={`rounded-full px-3 py-2 ${tr ? "bg-[#0f7d79] text-white" : ""}`}>TR</Link>
          </div>
        </nav>
      </div>
    </header>
    {breadcrumbs.length > 0 && <nav aria-label={tr ? "Sayfa yolu" : "Seitenpfad"} className="mx-auto flex max-w-7xl flex-wrap gap-2 px-5 pt-7 text-sm text-[#49635f] sm:px-8">{breadcrumbs.map(({ href, label }, index) => <span key={label}>{index > 0 && <span aria-hidden="true" className="mr-2">/</span>}{href ? <Link to={href} className="underline underline-offset-4">{label}</Link> : <span aria-current="page">{label}</span>}</span>)}</nav>}
    {children}
    <footer className="mt-10 border-t border-[#d6e3dc] bg-white py-9">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-5 text-sm text-[#5d716d] sm:px-8"><span className="font-bold text-[#075a57]">Spirit Healing</span><div className="flex flex-wrap gap-6"><Link to="/impressum">{tr ? "Künye" : "Impressum"}</Link><Link to="/datenschutz">{tr ? "Gizlilik" : "Datenschutz"}</Link><BerlinLegacyConsentRevoke/></div></div>
    </footer>
  </main>
}
