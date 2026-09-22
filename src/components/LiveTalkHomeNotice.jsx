import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export const LiveTalkHomeNotice = () => {
    const [upcoming, setUpcoming] = useState(() => Date.now() < Date.parse("2026-10-06T17:30:00Z"));
    useEffect(() => {
        const timer = window.setInterval(() => setUpcoming(Date.now() < Date.parse("2026-10-06T17:30:00Z")), 60000);
        return () => window.clearInterval(timer);
    }, []);
    return <section data-no-translate="true" aria-labelledby="home-talk-title" className="rounded-3xl border border-[#d4af37]/50 bg-[#f8f4eb] p-7 text-[#173c39] sm:p-10">
        {upcoming && <>
            <p className="text-sm font-semibold tracking-wide">KOSTENLOSER LIVE-VORTRAG · 6. OKTOBER 2026</p>
            <h2 id="home-talk-title" className="mt-4 font-serif text-3xl sm:text-4xl">Wer schreibt dein inneres Drehbuch?</h2>
            <p className="mt-4 text-xl leading-8">Deine persönliche Matrix erkennen. Deinem Selbst das Zepter zurückgeben.</p>
            <p className="mt-4 max-w-3xl leading-7">Wir schauen mit dir hinter die Wiederholungen in deinem Leben. Wie entsteht deine persönliche Matrix? Wie kannst du aus ihr aussteigen und deine wahre Essenz leben? Lerne uns und unsere Arbeit kennen und bring deine Fragen mit.</p>
            <p className="mt-5 font-semibold">Dienstag, 6. Oktober · 19:30–20:30 Uhr deutscher Zeit · auf Deutsch über Zoom</p>
            <Link to="/live-vortrag" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[#075d60] px-6 py-3 font-bold text-white">Kostenlos zum Live-Vortrag anmelden</Link>
        </>}
        {!upcoming && <h2 id="home-talk-title" className="font-serif text-2xl">Unser aufgezeichneter Vortrag</h2>}
        <p className={`${upcoming ? "mt-7 border-t border-[#173c39]/20 pt-5" : "mt-4"} text-sm leading-6`}>
            Lieber in deinem eigenen Tempo? <Link className="underline underline-offset-4" to="/vortrag-13-wochen-programm">Den bisherigen Vortrag als Aufzeichnung ansehen.</Link>
            {" "}<Link className="underline underline-offset-4" to="/gratis-meditationen">Zur Mediathek mit Meditationen und Workbook.</Link>
        </p>
    </section>;
};
