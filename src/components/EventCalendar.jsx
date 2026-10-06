import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { berlinDate, eventsOnDay, eventsInMonth, eventIsPast, monthCells } from "@/content/replayFunnel";

export const EventCalendar = () => {
    const today = berlinDate();
    const [month, setMonth] = useState(() => today.slice(0, 7));
    const [selected, setSelected] = useState(null);
    const [year, monthNumber] = month.split("-").map(Number);
    const title = new Intl.DateTimeFormat("de-DE", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${month}-01T12:00:00Z`));
    const move = delta => { setMonth(new Date(Date.UTC(year, monthNumber - 1 + delta, 1)).toISOString().slice(0, 7)); setSelected(null); };
    const visible = selected ? eventsOnDay(selected) : eventsInMonth(month);
    return <section id="kalender" data-no-translate="true" className="mx-auto max-w-6xl scroll-mt-28 px-5 py-12 text-[#173c39]">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#c7a968]">Seminare & Vorträge</p>
        <h1 className="mt-3 font-serif text-4xl text-white sm:text-5xl">Unsere gemeinsamen Termine.</h1>
        <p className="mt-4 max-w-2xl leading-7 text-white/85">Finde deinen nächsten Live-Abend oder kehre zu einem vergangenen Vortrag zurück. Alle Uhrzeiten gelten für Deutschland.</p>
        <div className="mt-8 grid overflow-hidden rounded-3xl bg-[#faf6ed] lg:grid-cols-[1.1fr_1fr]">
            <div className="p-5 sm:p-8">
                <div className="flex items-center justify-between gap-3"><button aria-label="Vorheriger Monat" onClick={() => move(-1)} className="rounded-full border border-[#c4cebf] p-3"><ChevronLeft size={20}/></button><h2 aria-live="polite" className="font-serif text-2xl">{title}</h2><button aria-label="Nächster Monat" onClick={() => move(1)} className="rounded-full border border-[#c4cebf] p-3"><ChevronRight size={20}/></button></div>
                <div className="mt-6 grid grid-cols-7 gap-1 text-center">
                    {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map(day => <span key={day} className="pb-2 text-xs font-bold text-[#55685e]">{day}</span>)}
                    {monthCells(year, monthNumber - 1).map((day, index) => day ? <button key={day} onClick={() => setSelected(day)} aria-pressed={selected === day} aria-label={`${day.split("-").reverse().join(".")}: ${eventsOnDay(day).map(e => e.title).join(", ") || "kein eingetragener Termin"}`} aria-current={day === today ? "date" : undefined} className={`min-h-12 rounded-xl border py-2 text-sm ${selected === day ? "border-[#075d60] bg-[#075d60] text-white" : eventsOnDay(day).length ? "border-[#d0b16d] bg-[#eee2c7] font-bold" : "border-transparent"} ${day === today ? "ring-2 ring-[#075d60] ring-inset" : ""}`}>
                        {Number(day.slice(-2))}{eventsOnDay(day).length > 0 && <span aria-hidden="true" className="mx-auto mt-1 block h-1 w-1 rounded-full bg-current"/>}
                    </button> : <span key={`empty-${index}`}/>)}
                </div>
                <button onClick={() => { setMonth(today.slice(0, 7)); setSelected(null); }} className="mt-5 min-h-11 underline underline-offset-4">Zum aktuellen Monat</button><p className="mt-2 text-xs leading-5 text-[#55685e]">Gold markiert unsere Termine. Wähle einen Tag für die Einzelheiten.</p>
            </div>
            <div className="border-t border-[#dedbcc] bg-white/60 p-5 sm:p-8 lg:border-l lg:border-t-0">
                <div className="flex items-center justify-between gap-3"><h2 className="font-serif text-2xl">{selected ? selected.split("-").reverse().join(".") : "In diesem Monat"}</h2>{selected && <button onClick={() => setSelected(null)} className="min-h-11 text-sm underline">Alle Termine</button>}</div>
                <div aria-live="polite" className="mt-5 space-y-4">{visible.map(event => <Link key={event.id} to={event.href} className="block rounded-2xl border border-[#d9ddcf] bg-white p-5 transition hover:border-[#9d783a] focus-visible:outline-2 focus-visible:outline-[#075d60]">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#88672b]">{event.date.split("-").reverse().join(".")}{event.time ? ` · ${event.time} Uhr` : ""}{eventIsPast(event) ? " · Vergangen" : ""}</p><h3 className="mt-2 font-serif text-xl leading-7">{event.title}</h3><p className="mt-2 text-sm leading-6 text-[#55685e]">{event.detail}</p><span className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#075d60]">{event.action || (event.replay ? "Zur Aufzeichnung" : "Zum Termin")}<ArrowUpRight size={16}/></span>
                </Link>)}{!visible.length && <p className="leading-7">{selected ? "Für diesen Tag ist kein Termin eingetragen." : "Für diesen Monat ist noch kein Termin eingetragen."}</p>}</div>
                <p className="mt-6 border-t border-[#dedbcc] pt-5 text-sm leading-6">Unsere Erfahrungsgruppe trifft sich jeden Sonntag von 19:00 bis 21:30 Uhr deutscher Zeit. <Link className="font-bold underline" to="/mitglieder?tab=experience">Zum Mitgliederbereich</Link></p>
            </div>
        </div>
    </section>;
};
