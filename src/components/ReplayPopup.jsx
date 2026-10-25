import { useCallback, useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Modal } from "@/components/Modal";
import { upcomingTalks } from "@/content/upcomingTalks";

const DISMISSED_KEY = "spirit-live-invitations-2026-10-25-dismissed";

export const ReplayPopup = () => {
    const [open, setOpen] = useState(false);
    const [now, setNow] = useState(() => Date.now());
    const talks = upcomingTalks.filter(talk => now < Date.parse(talk.startsAt));
    useEffect(() => {
        try { if (sessionStorage.getItem(DISMISSED_KEY) === "yes") return undefined; }
        catch { /* Storage may be blocked. */ }
        const timer = window.setTimeout(() => setOpen(true), 1800);
        return () => window.clearTimeout(timer);
    }, []);
    useEffect(() => {
        const timer = window.setInterval(() => setNow(Date.now()), 30000);
        return () => window.clearInterval(timer);
    }, []);
    const close = useCallback(() => {
        setOpen(false);
        try { sessionStorage.setItem(DISMISSED_KEY, "yes"); } catch { /* Closing still works. */ }
    }, []);

    return <Modal open={open && talks.length > 0} onClose={close}
        title={talks.length > 1 ? "Zwei Abende. Zeit für deine Fragen." : "Wir laden dich ein. Sei live dabei."}
        closeLabel="Fenster schließen">
        <div lang="de" data-no-translate="true" className="mt-5 text-[#173c39]">
            <div className="grid overflow-hidden rounded-2xl bg-[#064b4e] text-white sm:grid-cols-[1.2fr_0.8fr]">
                <div className="flex items-center gap-4 p-5 sm:p-6">
                    <img src="/Logo-tuerkis.jpeg?v=20260730" alt="Spirit Healing" width="72" height="72"
                        className="h-16 w-16 shrink-0 rounded-full object-cover ring-1 ring-[#edcf96]/60 sm:h-[72px] sm:w-[72px]"/>
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-[#edcf96]">Sabine & Selcan · live über Zoom</p>
                        <p className="mt-2 font-serif text-xl leading-snug sm:text-2xl">Lerne uns und unsere Arbeit kennen.</p>
                        <p className="mt-2 text-sm leading-6 text-white/85">Mit deinen Fragen, mit Tiefe und mit unserer Freude an dieser Arbeit.</p>
                    </div>
                </div>
                <img src="/ueberuns.jpeg" alt="Sabine Schmidt und Selcan Yilmaz"
                    className="hidden h-full max-h-52 w-full object-cover object-center sm:block"/>
            </div>
            <div className={talks.length > 1 ? "mt-5 grid gap-4 sm:grid-cols-2" : "mt-5 grid gap-4"}>
                {talks.map((talk, index) => <article key={talk.id}
                    className={"flex flex-col rounded-2xl border p-5 sm:p-6 " + (index === 0 ? "border-[#d6bb85] bg-white" : "border-[#bcd2ca] bg-[#eaf1ed]")}>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#76551e]">{talk.date} · 20 Uhr</p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#35635c]">{talk.eyebrow}</p>
                    <h3 className="mt-2 font-serif text-[25px] leading-tight">{talk.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-6">{talk.description}</p>
                    <Link to={talk.path} onClick={close}
                        className="mt-5 inline-flex min-h-12 items-center justify-between gap-3 rounded-xl bg-[#075d60] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#043f42] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#075d60]"
                        aria-label={talk.cta + " – " + talk.date + ", kostenlos anmelden"}>
                        {talk.cta}<ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true"/>
                    </Link>
                </article>)}
            </div>
            <p className="mt-4 text-center text-xs leading-5 text-[#526a61]">Kostenlos · auf Deutsch · Uhrzeiten in deutscher Zeit<br/>Du brauchst keine Vorkenntnisse. Deinen Zoom-Zugang erhältst du nach der Anmeldung per E-Mail.</p>
        </div>
    </Modal>;
};
