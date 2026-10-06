import { useCallback, useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Modal } from "@/components/Modal";
import { replayFunnel } from "@/content/replayFunnel";
const DISMISSED_KEY = "spirit-replay-october-popup-dismissed";
export const ReplayPopup = () => {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        try { if (sessionStorage.getItem(DISMISSED_KEY) === "yes") return undefined; } catch { /* Storage may be blocked. */ }
        const timer = window.setTimeout(() => setOpen(true), 1800);
        return () => window.clearTimeout(timer);
    }, []);
    const close = useCallback(() => { setOpen(false); try { sessionStorage.setItem(DISMISSED_KEY, "yes"); } catch { /* Closing still works. */ } }, []);
    return <Modal open={open} onClose={close} title="Wer hält gerade dein Zepter?" closeLabel="Fenster schließen"><div data-no-translate="true" className="mt-5 grid gap-6 text-[#173c39] sm:grid-cols-2 sm:items-center"><img src={replayFunnel.image} alt="Sabine und Selcan im Live-Vortrag" className="aspect-video w-full rounded-2xl object-cover"/><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#926d28]">Vortrag & Workbook mit Sabine und Selcan</p><p className="mt-4 font-serif text-2xl leading-8">Ein Satz fällt. Und plötzlich bist du wieder in deiner vertrauten Rolle.</p><p className="mt-4 leading-7">Schau mit uns auf dein inneres Drehbuch. Hier findest du den Aufzeichnungsbereich unseres Live-Abends und das Workbook für deine eigenen Beobachtungen.</p><Link to={replayFunnel.path} onClick={close} className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#075d60] px-6 py-3 font-bold text-white">Zum Vortrag & Workbook<ArrowRight size={18}/></Link></div></div></Modal>;
};
