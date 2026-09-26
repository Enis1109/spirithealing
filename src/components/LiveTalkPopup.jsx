import { useCallback, useEffect, useState } from "react";
import { ArrowRight, CalendarDays, MonitorPlay } from "lucide-react";
import { Link } from "react-router-dom";
import { Modal } from "@/components/Modal";

const LIVE_TALK_START = Date.parse("2026-10-06T17:30:00Z");
const DISMISSED_KEY = "spirit-live-talk-popup-dismissed";

export const LiveTalkPopup = () => {
    const [upcoming, setUpcoming] = useState(() => Date.now() < LIVE_TALK_START);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const timer = window.setInterval(() => setUpcoming(Date.now() < LIVE_TALK_START), 60000);
        return () => window.clearInterval(timer);
    }, []);

    useEffect(() => {
        if (!upcoming || sessionStorage.getItem(DISMISSED_KEY) === "yes") return undefined;

        const timer = window.setTimeout(() => setOpen(true), 650);
        return () => window.clearTimeout(timer);
    }, [upcoming]);

    const close = useCallback(() => {
        setOpen(false);
        sessionStorage.setItem(DISMISSED_KEY, "yes");
    }, []);

    if (!upcoming) return null;

    return (
        <Modal
            open={open}
            onClose={close}
            title="Wer schreibt dein inneres Drehbuch?"
            closeLabel="Fenster schließen"
        >
            <div data-no-translate="true">
                <p className="mt-3 text-sm font-bold uppercase tracking-[0.16em] text-[#a27b08]">Kostenloser Live-Vortrag · 6. Oktober 2026</p>
                <p className="mt-4 font-serif text-2xl leading-9 text-[#075d60] sm:text-3xl">Deine persönliche Matrix erkennen. Deinem Selbst das Zepter zurückgeben.</p>
                <p className="mt-5 max-w-3xl text-base leading-7 text-[#416566] sm:text-lg sm:leading-8">Wir schauen mit dir hinter die Wiederholungen in deinem Leben. Wie entsteht deine persönliche Matrix? Wie kannst du aus ihr aussteigen und deine wahre Essenz leben? Lerne uns und unsere Arbeit kennen und bring deine Fragen mit.</p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="flex items-start gap-3 rounded-2xl bg-white/70 p-4">
                        <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-[#a27b08]" aria-hidden="true" />
                        <p className="font-semibold leading-6">Dienstag, 6. Oktober<br />19:30–20:30 Uhr deutscher Zeit</p>
                    </div>
                    <div className="flex items-start gap-3 rounded-2xl bg-white/70 p-4">
                        <MonitorPlay className="mt-0.5 h-5 w-5 shrink-0 text-[#a27b08]" aria-hidden="true" />
                        <p className="font-semibold leading-6">Live über Zoom<br />auf Deutsch</p>
                    </div>
                </div>

                <Link
                    to="/live-vortrag"
                    onClick={close}
                    className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#075d60] px-6 py-3 text-center font-bold text-white transition hover:bg-[#0a7073] sm:w-auto"
                >
                    Kostenlos zum Live-Vortrag anmelden
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Link>

                <p className="mt-7 border-t border-[#173c39]/20 pt-5 text-sm leading-6 text-[#526f6d]">
                    Lieber in deinem eigenen Tempo? <Link className="font-semibold underline underline-offset-4" to="/vortrag-13-wochen-programm" onClick={close}>Den bisherigen Vortrag als Aufzeichnung ansehen.</Link>
                    {" "}<Link className="font-semibold underline underline-offset-4" to="/gratis-meditationen" onClick={close}>Zur Mediathek mit Meditationen und Workbook.</Link>
                </p>
            </div>
        </Modal>
    );
};
