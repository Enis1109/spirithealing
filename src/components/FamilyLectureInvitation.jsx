import { Link } from "react-router-dom";
import { familyLecture } from "../../shared/familyLecture.js";

export const FamilyLectureInvitation = ({ language = "de" }) => {
    if (Date.now() >= Date.parse(familyLecture.startsAt)) return null;
    const tr = language === "tr";
    return <article data-no-translate="true" className="rounded-[2rem] border border-[#d8bd86]/40 bg-[#075d60] p-7 text-white sm:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#edcf96]">{tr ? "Ücretsiz çevrim içi seminer" : "Kostenloser Online-Vortrag"}</p>
        <h2 className="mt-4 font-serif text-3xl sm:text-4xl">{tr ? "Aile dizimini tanıyın" : familyLecture.title}</h2>
        <p className="mt-4 font-semibold leading-8">{tr ? "27 Ekim 2026 · Almanya saatiyle 20:00 · Türkiye saatiyle 22:00" : "27. Oktober 2026 · 20 Uhr deutscher Zeit"}<br/>{tr ? "Sabine ve Selcan ile · Zoom üzerinden · Almanca" : "Mit Sabine & Selcan · live über Zoom · auf Deutsch"}</p>
        <p className="mt-4 max-w-3xl leading-8 text-white/90">{tr ? "Aile içindeki roller, sorumluluk ve kendi yerimiz. Ücretsiz seminerimizde bizi ve dizim çalışmamızı tanıyın. Ardından Berlin’deki dizim günlerimize temsilci olarak veya kendi diziminizle katılabilirsiniz." : "Familiäre Rollen, Verantwortung und der eigene Platz. Lerne uns und unsere Aufstellungsarbeit im kostenlosen Vortrag kennen. Anschließend kannst du an unseren Berliner Aufstellungstagen als Stellvertretung oder mit eigener Aufstellung teilnehmen."}</p>
        <Link to={familyLecture.path} className="mt-6 inline-flex min-h-12 items-center rounded-full bg-[#edcf96] px-7 py-4 font-bold text-[#173c39]">{tr ? "Ücretsiz seminere kaydol" : "Kostenlos zum Vortrag anmelden"}</Link>
    </article>;
};
