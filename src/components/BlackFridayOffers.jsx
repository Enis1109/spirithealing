import { useEffect, useState } from 'react';
import { ArrowRight, Check, Copy } from 'lucide-react';
import { blackFridayIsActive, blackFridaySessions } from '@/content/blackFriday';

export const useBlackFriday = () => {
    const [active, setActive] = useState(() => blackFridayIsActive());
    useEffect(() => {
        const timer = setInterval(() => setActive(blackFridayIsActive()), 1000);
        return () => clearInterval(timer);
    }, []);
    return active;
};

export const BlackFridayOffers = () => {
    const active = useBlackFriday();
    const [copied, setCopied] = useState('');
    if (!active) return null;
    const copy = async code => {
        try { await navigator.clipboard.writeText(code); setCopied(code); }
        catch { setCopied(''); }
    };
    return <section id="black-friday" lang="de" data-no-translate className="scroll-mt-28 mx-auto my-12 max-w-6xl px-4 sm:px-6 lg:px-8" aria-labelledby="bf-sessions-title">
        <div className="overflow-hidden rounded-[2rem] border border-[#d6b778]/50 bg-[#fbf6ea] text-[#173c39] shadow-2xl">
            <div className="grid gap-5 border-b border-[#d8cba9] p-6 sm:p-9 md:grid-cols-[1fr_auto] md:items-center">
                <div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#80602c]">Black Friday · bis 27. November, 23:59 Uhr</p>
                <h2 id="bf-sessions-title" className="mt-3 font-serif text-3xl sm:text-4xl">Zeit für dein Anliegen. 30 % weniger.</h2>
                <p className="mt-3 max-w-2xl leading-7">Für deine Einzelsitzung mit Sabine oder Selcan oder eine gemeinsame Sitzung mit uns beiden. Wähle deinen Termin und gib den passenden Code vor der Zahlung ein.</p></div>
                <span className="font-serif text-6xl text-[#0d706b] sm:text-7xl">−30 %</span>
            </div>
            <div className="grid gap-4 p-5 sm:p-8 md:grid-cols-2">
                {blackFridaySessions.map(item => <article key={item.code} className="flex flex-col rounded-2xl border border-[#cbd8ce] bg-white p-5 sm:p-6">
                    <h3 className="text-lg font-bold">{item.title}</h3><p className="mt-2 text-sm text-[#56706a]">60 Minuten</p>
                    <p className="mt-4 flex items-baseline gap-3"><strong className="text-3xl text-[#0d706b]">{item.price}</strong><del className="text-[#6a7873]">{item.regular}</del></p>
                    <button type="button" onClick={() => copy(item.code)} className="mt-5 flex min-h-12 items-center justify-between gap-2 rounded-xl border border-dashed border-[#8ba79a] bg-[#f4f6ef] px-3 py-2 text-left" aria-label={`Gutscheincode ${item.code} kopieren`}>
                        <span className="break-all font-mono text-sm font-bold">{item.code}</span>{copied === item.code ? <Check size={18} aria-hidden="true"/> : <Copy size={18} aria-hidden="true"/>}
                    </button>
                    <span role="status" className="mt-1 min-h-5 text-xs text-[#46645c]">{copied === item.code ? 'Code kopiert' : 'Code beim Bezahlen in Calendly eintragen'}</span>
                    <a href={item.href} className="mt-4 inline-flex min-h-12 items-center justify-between gap-3 rounded-xl bg-[#075d60] px-5 py-3 font-bold text-white hover:bg-[#043f42]">Termin wählen<ArrowRight size={18} aria-hidden="true"/></a>
                </article>)}
            </div>
            <p className="px-6 pb-7 text-sm leading-6 text-[#526b60] sm:px-9">Buchung und Einlösung des Codes bis 27.11.2026, 23:59 Uhr deutscher Zeit. Die Sitzung kann später stattfinden. Gilt für die oben genannten, über Stripe bezahlten Einzelbuchungen. Gesprächs- und Verhaltenstherapie sowie Sitzungspakete sind ausgenommen.</p>
        </div>
    </section>;
};
