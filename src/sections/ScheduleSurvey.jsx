import {
    CalendarDays,
    Check,
    CheckCircle2,
    Clock3,
    HeartHandshake,
    LockKeyhole,
    RefreshCw,
    ShieldCheck,
    Sparkles,
    Star,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const slots = [
    { id: "mo_1000", day: "Montag", time: "10:00 Uhr", istanbul: "11:00 Uhr Istanbul" },
    { id: "mo_1930", day: "Montag", time: "19:30 Uhr", istanbul: "20:30 Uhr Istanbul" },
    { id: "mi_1000", day: "Mittwoch", time: "10:00 Uhr", istanbul: "11:00 Uhr Istanbul" },
    { id: "mi_1930", day: "Mittwoch", time: "19:30 Uhr", istanbul: "20:30 Uhr Istanbul" },
    { id: "fr_1930", day: "Freitag", time: "19:30 Uhr", istanbul: "20:30 Uhr Istanbul" },
    { id: "sa_1100", day: "Samstag", time: "11:00 Uhr", istanbul: "12:00 Uhr Istanbul" },
    { id: "so_1100", day: "Sonntag", time: "11:00 Uhr", istanbul: "12:00 Uhr Istanbul" },
];

const initialForm = {
    name: "",
    availableSlots: [],
    preferredSlot: "",
    knownExceptions: "",
    privacyConsent: false,
    company: "",
};

export const ScheduleSurvey = () => {
    const [form, setForm] = useState(initialForm);
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");
    const [wasUpdated, setWasUpdated] = useState(false);

    useEffect(() => {
        const previousTitle = document.title;
        const robots = document.querySelector('meta[name="robots"]');
        const previousRobots = robots?.getAttribute("content");
        document.title = "Terminabfrage | Spirit Healing";
        robots?.setAttribute("content", "noindex, nofollow");
        return () => {
            document.title = previousTitle;
            if (robots && previousRobots) robots.setAttribute("content", previousRobots);
        };
    }, []);

    const selectedSlots = useMemo(
        () => slots.filter((slot) => form.availableSlots.includes(slot.id)),
        [form.availableSlots],
    );

    const toggleSlot = (slotId) => {
        setError("");
        setForm((current) => {
            const selected = current.availableSlots.includes(slotId);
            const availableSlots = selected
                ? current.availableSlots.filter((id) => id !== slotId)
                : [...current.availableSlots, slotId];
            return {
                ...current,
                availableSlots,
                preferredSlot: selected && current.preferredSlot === slotId ? "" : current.preferredSlot,
            };
        });
    };

    const submit = async (event) => {
        event.preventDefault();
        setError("");
        if (form.availableSlots.length === 0) {
            setError("Bitte wähle mindestens einen Termin aus, an dem du regelmäßig teilnehmen kannst.");
            return;
        }
        if (!form.preferredSlot || !form.availableSlots.includes(form.preferredSlot)) {
            setError("Bitte wähle unter deinen möglichen Terminen noch deinen Favoriten aus.");
            return;
        }
        setStatus("submitting");
        try {
            const response = await fetch("/api/zepter/schedule-survey", {
                method: "POST",
                credentials: "same-origin",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify(form),
            });
            const result = await response.json().catch(() => ({}));
            if (!response.ok || !result.ok) throw new Error(result.error || "request_failed");
            setWasUpdated(Boolean(result.updated));
            setStatus("success");
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch {
            setStatus("idle");
            setError("Deine Auswahl konnte gerade nicht sicher gespeichert werden. Bitte versuche es noch einmal oder melde dich direkt bei Sabine oder Selcan.");
        }
    };

    if (status === "success") return (
        <main className="min-h-screen bg-[#eaf4f1] px-4 py-10 text-[#173f40] sm:py-16" data-no-translate>
            <section className="mx-auto max-w-2xl overflow-hidden rounded-[2rem] bg-[#fffaf2] shadow-2xl shadow-[#173f40]/12">
                <div className="bg-[#075f62] px-6 py-10 text-center text-white sm:px-10">
                    <CheckCircle2 className="mx-auto h-16 w-16 text-[#e8ca67]" />
                    <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#e8ca67]">Auswahl gespeichert</p>
                    <h1 className="mt-3 text-4xl font-bold">Danke, {form.name}.</h1>
                </div>
                <div className="p-7 text-center sm:p-10">
                    <p className="text-lg leading-8 text-[#4e6d6e]">{wasUpdated ? "Deine bisherige Antwort wurde mit dieser Auswahl aktualisiert." : "Deine möglichen Zeiten und dein Wunschtermin sind bei uns angekommen."}</p>
                    <p className="mt-4 text-sm leading-6 text-[#648082]">Sobald alle Rückmeldungen da sind, teilen wir euch den festen wöchentlichen Termin mit.</p>
                    <button type="button" onClick={() => { setStatus("idle"); setWasUpdated(false); }} className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#0f8b8d]/35 px-6 font-bold text-[#0f8b8d] transition hover:bg-[#e4f2ef]"><RefreshCw className="h-4 w-4" /> Auswahl noch einmal ändern</button>
                </div>
            </section>
        </main>
    );

    return (
        <main className="min-h-screen bg-[#eaf4f1] text-[#173f40]" data-no-translate>
            <header className="border-b border-[#0f8b8d]/15 bg-[#fffaf2]">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
                    <Link to="/" className="flex items-center gap-3">
                        <img src="/Logo-tuerkis.jpeg" alt="Spirit Healing" className="h-12 w-12 rounded-full object-cover" />
                        <div><strong className="block">Spirit Healing</strong><span className="text-sm text-[#648082]">8 Wochen Begleitung</span></div>
                    </Link>
                    <span className="hidden items-center gap-2 text-sm font-semibold text-[#4e6d6e] sm:flex"><LockKeyhole className="h-4 w-4 text-[#0f8b8d]" /> Geschützte Übertragung</span>
                </div>
            </header>

            <div className="mx-auto grid max-w-6xl gap-6 px-4 py-7 sm:px-6 sm:py-10 lg:grid-cols-[300px_minmax(0,1fr)]">
                <aside className="h-fit rounded-[1.75rem] bg-[#075f62] p-6 text-white shadow-xl lg:sticky lg:top-6">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e8ca67]">Gemeinsamer Live-Termin</p>
                    <h1 className="mt-3 text-3xl font-bold leading-tight">Wann passt es für dich?</h1>
                    <p className="mt-4 leading-7 text-white/75">Wir suchen den festen Termin, an dem möglichst viele von euch regelmäßig live dabei sein können.</p>
                    <div className="mt-6 space-y-4 border-y border-white/15 py-5 text-sm text-white/85">
                        <p className="flex items-start gap-3"><Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-[#e8ca67]" /><span><strong className="block text-white">90 Minuten</strong>pro Live-Treffen</span></p>
                        <p className="flex items-start gap-3"><CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-[#e8ca67]" /><span><strong className="block text-white">Ein fester Wochentag</strong>für alle acht Wochen</span></p>
                        <p className="flex items-start gap-3"><HeartHandshake className="mt-0.5 h-5 w-5 shrink-0 text-[#e8ca67]" /><span><strong className="block text-white">Aufzeichnung inklusive</strong>falls du einmal fehlst</span></p>
                    </div>
                    <p className="mt-5 rounded-2xl bg-white/10 p-4 text-sm leading-6 text-white/80">Alle Hauptzeiten sind deutsche Zeit. Für Istanbul ist die passende Uhrzeit jeweils direkt angegeben.</p>
                </aside>

                <form onSubmit={submit} className="rounded-[1.75rem] bg-[#fffaf2] p-6 shadow-xl shadow-[#173f40]/8 sm:p-9 lg:p-11">
                    <div className="flex items-start gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e4f2ef] text-[#0f8b8d]"><Sparkles className="h-5 w-5" /></span>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0f8b8d]">Dauert etwa 2 Minuten</p>
                            <h2 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">Deine Terminauswahl</h2>
                            <p className="mt-3 max-w-3xl leading-7 text-[#5d797b]">Wähle zuerst alle Zeiten, die du grundsätzlich regelmäßig möglich machen kannst. Danach markierst du daraus deinen persönlichen Favoriten.</p>
                        </div>
                    </div>

                    <div className="mt-8 space-y-8">
                        <label className="block text-sm font-bold">
                            Vor- und Nachname<span className="ml-1 text-[#a05a35]" aria-hidden="true">*</span>
                            <input name="name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required autoComplete="name" maxLength={100} className="mt-2 min-h-12 w-full rounded-2xl border border-[#0f8b8d]/25 bg-white px-4 py-3 outline-none transition focus:border-[#0f8b8d] focus:ring-2 focus:ring-[#0f8b8d]/20" />
                        </label>

                        <fieldset>
                            <legend className="text-lg font-bold">1. Wann könntest du regelmäßig teilnehmen?<span className="ml-1 text-[#a05a35]" aria-hidden="true">*</span></legend>
                            <p className="mt-1 text-sm leading-6 text-[#648082]">Bitte wähle wirklich alle Zeiten aus, die für dich grundsätzlich machbar sind.</p>
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                {slots.map((slot) => {
                                    const selected = form.availableSlots.includes(slot.id);
                                    return (
                                        <label key={slot.id} className={`flex min-h-20 cursor-pointer items-center gap-4 rounded-2xl border p-4 transition ${selected ? "border-[#0f8b8d] bg-[#e4f2ef] shadow-sm" : "border-[#0f8b8d]/18 bg-white hover:border-[#0f8b8d]/50"}`}>
                                            <input type="checkbox" checked={selected} onChange={() => toggleSlot(slot.id)} className="sr-only" />
                                            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border ${selected ? "border-[#0f8b8d] bg-[#0f8b8d] text-white" : "border-[#0f8b8d]/40"}`}>{selected && <Check className="h-4 w-4" />}</span>
                                            <span><strong className="block text-[#173f40]">{slot.day}, {slot.time}</strong><span className="mt-0.5 block text-xs text-[#648082]">{slot.istanbul}</span></span>
                                        </label>
                                    );
                                })}
                            </div>
                        </fieldset>

                        <fieldset className="rounded-3xl border border-[#d4af37]/45 bg-[#fff8df] p-5 sm:p-6">
                            <legend className="px-2 text-lg font-bold">2. Welcher davon ist dein Favorit?<span className="ml-1 text-[#a05a35]" aria-hidden="true">*</span></legend>
                            {selectedSlots.length === 0 ? (
                                <p className="mt-2 text-sm leading-6 text-[#74663d]">Sobald du oben einen oder mehrere Termine ausgewählt hast, erscheinen sie hier.</p>
                            ) : (
                                <div className="mt-3 grid gap-2">
                                    {selectedSlots.map((slot) => (
                                        <label key={slot.id} className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 ${form.preferredSlot === slot.id ? "border-[#c39d27] bg-white" : "border-[#d4af37]/30 bg-white/60"}`}>
                                            <input type="radio" name="preferredSlot" value={slot.id} checked={form.preferredSlot === slot.id} onChange={(event) => setForm((current) => ({ ...current, preferredSlot: event.target.value }))} required className="h-4 w-4 accent-[#0f8b8d]" />
                                            <Star className={`h-4 w-4 ${form.preferredSlot === slot.id ? "fill-[#d4af37] text-[#d4af37]" : "text-[#9b8a54]"}`} />
                                            <span className="font-semibold">{slot.day}, {slot.time}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </fieldset>

                        <label className="block text-sm font-bold">
                            Gibt es schon bekannte einzelne Ausnahmen?
                            <span className="mt-1 block font-normal leading-6 text-[#648082]">Optional – zum Beispiel Urlaub oder ein Termin an einem bestimmten Datum.</span>
                            <textarea name="knownExceptions" value={form.knownExceptions} onChange={(event) => setForm((current) => ({ ...current, knownExceptions: event.target.value }))} rows={3} maxLength={800} className="mt-2 w-full resize-y rounded-2xl border border-[#0f8b8d]/25 bg-white px-4 py-3 leading-7 outline-none transition focus:border-[#0f8b8d] focus:ring-2 focus:ring-[#0f8b8d]/20" />
                        </label>

                        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[#0f8b8d]/18 bg-white p-4 text-sm leading-6 text-[#426466]">
                            <input type="checkbox" checked={form.privacyConsent} onChange={(event) => setForm((current) => ({ ...current, privacyConsent: event.target.checked }))} required className="mt-1 h-4 w-4 shrink-0 accent-[#0f8b8d]" />
                            <span>Ich bin damit einverstanden, dass mein Name und meine Terminauswahl zur Planung der 8‑Wochen‑Begleitung gespeichert und von Sabine und Selcan ausgewertet werden. Hinweise dazu stehen im <Link to="/datenschutz" target="_blank" className="font-bold text-[#0f8b8d] underline">Datenschutz</Link>.</span>
                        </label>

                        <label className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">Firma<input name="company" tabIndex={-1} autoComplete="off" value={form.company} onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))} /></label>

                        {error && <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-800" role="alert">{error}</p>}

                        <div className="flex flex-col gap-3 border-t border-[#0f8b8d]/12 pt-6 sm:flex-row sm:items-center sm:justify-between">
                            <p className="flex items-center gap-2 text-sm text-[#648082]"><ShieldCheck className="h-4 w-4 text-[#0f8b8d]" /> Deine Auswahl ist nur im geschützten Adminbereich sichtbar.</p>
                            <button type="submit" disabled={status === "submitting"} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0f8b8d] px-7 font-bold text-white transition hover:bg-[#0a6f71] disabled:cursor-wait disabled:opacity-60">
                                <CheckCircle2 className="h-5 w-5" /> {status === "submitting" ? "Wird gespeichert …" : "Auswahl verbindlich senden"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
};
