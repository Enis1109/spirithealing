import {
    ArrowLeft,
    BookOpenCheck,
    CalendarDays,
    Check,
    CheckCircle2,
    Circle,
    Clock3,
    ExternalLink,
    Headphones,
    ListChecks,
    LoaderCircle,
    LockKeyhole,
    MessageCircle,
    PlayCircle,
    ShieldCheck,
    Sparkles,
    Video,
} from "lucide-react";
import { createElement, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const programSlug = "zepter-acht-wochen";

const requestJson = async (url, options = {}) => {
    const response = await fetch(url, {
        credentials: "same-origin",
        headers: {
            Accept: "application/json",
            ...(options.body ? { "Content-Type": "application/json" } : {}),
        },
        cache: "no-store",
        ...options,
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.ok) {
        const error = new Error(result.error || "request_failed");
        error.status = response.status;
        error.code = result.error || "request_failed";
        throw error;
    }
    return result;
};

const formatDate = (value) => value
    ? new Intl.DateTimeFormat("de-DE", { dateStyle: "long" }).format(new Date(`${value}T12:00:00`))
    : "Termin folgt";

const formatDateTime = (value) => value
    ? new Intl.DateTimeFormat("de-DE", { dateStyle: "long", timeStyle: "short" }).format(new Date(value))
    : "Termin wird noch eingetragen";

const EmptyAsset = ({ icon, title, text }) => (
    <div className="rounded-3xl border border-dashed border-[#80bdb6] bg-[#f3faf8] p-5 text-[#416d69]">
        {createElement(icon, { className: "h-6 w-6 text-[#168e91]" })}
        <h3 className="mt-3 font-bold text-[#123e3d]">{title}</h3>
        <p className="mt-2 text-sm leading-6">{text}</p>
    </div>
);

export const ProgramArea = ({ member }) => {
    const [state, setState] = useState("loading");
    const [program, setProgram] = useState(null);
    const [selectedWeekNumber, setSelectedWeekNumber] = useState(1);
    const [busyTask, setBusyTask] = useState("");
    const [taskError, setTaskError] = useState("");

    useEffect(() => {
        let active = true;
        requestJson(`/api/members/programs/${programSlug}`)
            .then((result) => {
                if (!active) return;
                setProgram(result.program);
                const firstOpen = result.program.weeks.find((week) => !week.locked) || result.program.weeks[0];
                setSelectedWeekNumber(firstOpen?.weekNumber || 1);
                setState("ready");
            })
            .catch((error) => {
                if (!active) return;
                setState(error.status === 401 ? "signed-out" : error.status === 403 ? "forbidden" : "error");
            });
        return () => { active = false; };
    }, []);

    const selectedWeek = useMemo(
        () => program?.weeks.find((week) => week.weekNumber === selectedWeekNumber) || program?.weeks[0],
        [program, selectedWeekNumber],
    );

    const nextLiveWeek = program?.weeks.find((week) => !week.locked && week.liveAt && new Date(week.liveAt) > new Date());

    const toggleTask = async (task) => {
        if (!selectedWeek || busyTask) return;
        setBusyTask(task.key);
        setTaskError("");
        try {
            const result = await requestJson(`/api/members/programs/${programSlug}/tasks`, {
                method: "POST",
                body: JSON.stringify({
                    weekNumber: selectedWeek.weekNumber,
                    taskKey: task.key,
                    completed: !task.completed,
                }),
            });
            setProgram(result.program);
        } catch {
            setTaskError("Der Schritt konnte gerade nicht gespeichert werden. Bitte versuche es noch einmal.");
        } finally {
            setBusyTask("");
        }
    };

    if (state === "loading") return (
        <main className="flex min-h-screen items-center justify-center bg-[#edf8f6] text-[#168e91]" data-no-translate>
            <LoaderCircle className="h-10 w-10 animate-spin" aria-label="Programm wird geladen" />
        </main>
    );

    if (state !== "ready") return (
        <main className="flex min-h-screen items-center justify-center bg-[#edf8f6] px-4 text-[#123e3d]" data-no-translate>
            <section className="w-full max-w-xl rounded-[2rem] bg-white p-8 text-center shadow-xl">
                <LockKeyhole className="mx-auto h-12 w-12 text-[#168e91]" />
                <h1 className="mt-5 font-serif text-3xl font-bold">Geschützter Programmraum</h1>
                <p className="mt-3 leading-7 text-[#547875]">
                    {state === "forbidden"
                        ? "Dieses Mitgliedskonto ist für die achtwöchige Begleitung noch nicht freigeschaltet."
                        : state === "signed-out"
                            ? "Bitte melde dich zuerst im Mitgliederbereich an."
                            : "Der Programmraum ist gerade nicht erreichbar. Bitte versuche es später erneut."}
                </p>
                <Link to="/mitglieder" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[#168e91] px-6 font-bold text-white">Zum Mitgliederbereich</Link>
            </section>
        </main>
    );

    return (
        <main className="min-h-screen bg-[#edf8f6] pb-16 text-[#123e3d]" data-no-translate>
            <header className="border-b border-[#c2ded9] bg-white/95 backdrop-blur-xl">
                <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                    <Link to="/mitglieder" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#b8d9d4] px-4 text-sm font-bold text-[#315b58]"><ArrowLeft className="h-4 w-4" /> Mitgliederbereich</Link>
                    <div className="text-right"><strong className="block">{member?.name}</strong><span className="text-xs text-[#648682]">Geschützter Programmzugang</span></div>
                </div>
            </header>

            <div className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
                {program.adminPreview && (
                    <div className="mb-5 flex items-start gap-3 rounded-2xl border border-[#d8b84e]/40 bg-[#fff7d6] p-4 text-sm text-[#5c4a15]">
                        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
                        <p><strong>Admin-Vorschau:</strong> Zukünftige Wochen erscheinen hier genauso gesperrt wie für Teilnehmer. Bearbeiten kannst du sie weiterhin im Adminbereich.</p>
                    </div>
                )}

                <section className="overflow-hidden rounded-[2.2rem] bg-[radial-gradient(circle_at_85%_15%,rgba(241,210,119,0.28),transparent_28%),linear-gradient(135deg,#0d3d3a,#126d69_58%,#168e91)] p-7 text-white shadow-[0_28px_80px_rgba(18,82,78,0.24)] sm:p-10 lg:p-12">
                    <div className="max-w-4xl">
                        <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[#f1d277]"><Sparkles className="h-4 w-4" /> Achtwöchige Begleitung</p>
                        <h1 className="mt-4 font-serif text-4xl font-bold leading-tight sm:text-6xl">{program.title}</h1>
                        <p className="mt-5 max-w-3xl text-lg leading-8 text-white/82">{program.subtitle}</p>
                        <div className="mt-7 flex flex-wrap gap-3 text-sm font-bold">
                            <span className="rounded-full bg-white/12 px-4 py-2"><CalendarDays className="mr-2 inline h-4 w-4" />Start {formatDate(program.startDate)}</span>
                            <span className="rounded-full bg-white/12 px-4 py-2"><Clock3 className="mr-2 inline h-4 w-4" />8 Wochen</span>
                            {program.whatsappUrl && <a href={program.whatsappUrl} target="_blank" rel="noreferrer" className="rounded-full bg-[#f1d277] px-4 py-2 text-[#123e3d]"><MessageCircle className="mr-2 inline h-4 w-4" />WhatsApp-Community</a>}
                        </div>
                    </div>
                    <div className="mt-9 max-w-3xl">
                        <div className="flex items-center justify-between text-sm font-bold"><span>Dein Fortschritt</span><span>{program.progress.completed} von {program.progress.total} Schritten</span></div>
                        <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/16"><div className="h-full rounded-full bg-[#f1d277] transition-all" style={{ width: `${program.progress.percent}%` }} /></div>
                    </div>
                </section>

                {nextLiveWeek && (
                    <section className="mt-6 flex flex-col gap-4 rounded-3xl border border-[#b8d9d4] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div><p className="text-sm font-bold uppercase tracking-[0.14em] text-[#168e91]">Nächster Live-Termin</p><h2 className="mt-1 text-xl font-bold">Woche {nextLiveWeek.weekNumber}: {nextLiveWeek.title}</h2><p className="mt-1 text-[#547875]">{formatDateTime(nextLiveWeek.liveAt)}</p></div>
                        {nextLiveWeek.zoomUrl && <a href={nextLiveWeek.zoomUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#168e91] px-5 font-bold text-white">Zoom öffnen<ExternalLink className="h-4 w-4" /></a>}
                    </section>
                )}

                <section className="mt-9">
                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#168e91]">Dein gemeinsamer Weg</p>
                    <h2 className="mt-2 font-serif text-3xl font-bold">Woche für Woche</h2>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {program.weeks.map((week) => {
                            const completed = week.tasks.length > 0 && week.tasks.every((task) => task.completed);
                            const active = week.weekNumber === selectedWeek?.weekNumber;
                            return (
                                <button
                                    key={week.weekNumber}
                                    type="button"
                                    disabled={week.locked}
                                    onClick={() => setSelectedWeekNumber(week.weekNumber)}
                                    className={`min-h-48 rounded-3xl border p-5 text-left transition ${week.locked ? "cursor-not-allowed border-[#d6e4e1] bg-[#e8f1ef] text-[#7c9693]" : active ? "border-[#168e91] bg-[#123e3d] text-white shadow-lg" : "border-[#bddbd6] bg-white hover:border-[#168e91]"}`}
                                >
                                    <span className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${week.locked ? "bg-white/70" : active ? "bg-[#f1d277] text-[#123e3d]" : "bg-[#e2f4f0] text-[#168e91]"}`}>{week.locked ? <LockKeyhole className="h-4 w-4" /> : completed ? <Check className="h-5 w-5" /> : week.weekNumber}</span>
                                    <p className={`mt-5 text-xs font-bold uppercase tracking-[0.14em] ${active ? "text-[#f1d277]" : "text-[#168e91]"}`}>Woche {week.weekNumber}</p>
                                    {!week.locked && (
                                        <>
                                            <h3 className="mt-1 text-xl font-bold">{week.title}</h3>
                                            <p className={`mt-2 text-sm leading-6 ${active ? "text-white/72" : "text-[#668681]"}`}>{week.focus}</p>
                                        </>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </section>

                {selectedWeek && !selectedWeek.locked && (
                    <section className="mt-9 overflow-hidden rounded-[2rem] border border-[#bddbd6] bg-white shadow-[0_20px_60px_rgba(28,96,91,0.1)]">
                        <div className="border-b border-[#d4e6e3] p-6 sm:p-8">
                            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#168e91]">Woche {selectedWeek.weekNumber}</p>
                            <h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">{selectedWeek.title}</h2>
                            <p className="mt-3 max-w-3xl text-lg leading-8 text-[#547875]">{selectedWeek.intro}</p>
                        </div>

                        <div className="grid gap-5 p-6 sm:p-8 lg:grid-cols-2">
                            {selectedWeek.meditationUrl ? (
                                <article className="overflow-hidden rounded-3xl bg-[#f3faf8] p-5">
                                    <div className={selectedWeek.meditationImage ? "grid gap-5 sm:grid-cols-[9rem_1fr] sm:items-center" : ""}>
                                        {selectedWeek.meditationImage && (
                                            <img
                                                src={selectedWeek.meditationImage}
                                                alt={`Cover ${selectedWeek.meditationTitle}`}
                                                className="aspect-square w-full rounded-2xl object-cover shadow-md"
                                            />
                                        )}
                                        <div>
                                            <Headphones className="h-6 w-6 text-[#168e91]" />
                                            <h3 className="mt-3 text-xl font-bold">{selectedWeek.meditationTitle}</h3>
                                            <audio className="mt-5 w-full" controls preload="metadata" src={selectedWeek.meditationUrl} />
                                        </div>
                                    </div>
                                </article>
                            ) : <EmptyAsset icon={Headphones} title={selectedWeek.meditationTitle || "Meditation"} text="Die Meditation wird vorbereitet und erscheint hier nach ihrer Freigabe." />}

                            {selectedWeek.bonusMeditationUrl && (
                                <article className="overflow-hidden rounded-3xl bg-[#f3faf8] p-5">
                                    <div className={selectedWeek.bonusMeditationImage ? "grid gap-5 sm:grid-cols-[9rem_1fr] sm:items-center" : ""}>
                                        {selectedWeek.bonusMeditationImage && (
                                            <img
                                                src={selectedWeek.bonusMeditationImage}
                                                alt={`Cover ${selectedWeek.bonusMeditationTitle}`}
                                                className="aspect-square w-full rounded-2xl object-cover shadow-md"
                                            />
                                        )}
                                        <div>
                                            <Headphones className="h-6 w-6 text-[#168e91]" />
                                            <h3 className="mt-3 text-xl font-bold">{selectedWeek.bonusMeditationTitle}</h3>
                                            <audio className="mt-5 w-full" controls preload="metadata" src={selectedWeek.bonusMeditationUrl} />
                                        </div>
                                    </div>
                                </article>
                            )}

                            {selectedWeek.additionalMeditationUrl && (
                                <article className="overflow-hidden rounded-3xl bg-[#f3faf8] p-5">
                                    <div className={selectedWeek.additionalMeditationImage ? "grid gap-5 sm:grid-cols-[9rem_1fr] sm:items-center" : ""}>
                                        {selectedWeek.additionalMeditationImage && (
                                            <img
                                                src={selectedWeek.additionalMeditationImage}
                                                alt={`Cover ${selectedWeek.additionalMeditationTitle}`}
                                                className="aspect-square w-full rounded-2xl object-cover shadow-md"
                                            />
                                        )}
                                        <div>
                                            <Headphones className="h-6 w-6 text-[#168e91]" />
                                            <h3 className="mt-3 text-xl font-bold">{selectedWeek.additionalMeditationTitle}</h3>
                                            <audio className="mt-5 w-full" controls preload="metadata" src={selectedWeek.additionalMeditationUrl} />
                                        </div>
                                    </div>
                                </article>
                            )}

                            {selectedWeek.workbookUrl ? (
                                <article className="rounded-3xl bg-[#fff8e1] p-5"><BookOpenCheck className="h-6 w-6 text-[#9b7412]" /><h3 className="mt-3 text-xl font-bold">{selectedWeek.workbookLabel}</h3><a href={selectedWeek.workbookUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#f1d277] px-5 font-bold">Workbook öffnen<ExternalLink className="h-4 w-4" /></a></article>
                            ) : <EmptyAsset icon={BookOpenCheck} title={selectedWeek.workbookLabel || "Workbook"} text="Der passende Workbook-Abschnitt wird hier bereitgestellt." />}

                            {selectedWeek.recordingUrl ? (
                                <article className="rounded-3xl bg-[#eef4fb] p-5"><Video className="h-6 w-6 text-[#315c89]" /><h3 className="mt-3 text-xl font-bold">Aufzeichnung der Woche</h3><a href={selectedWeek.recordingUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#315c89] px-5 font-bold text-white">Aufzeichnung ansehen<PlayCircle className="h-4 w-4" /></a></article>
                            ) : <EmptyAsset icon={Video} title="Aufzeichnung der Woche" text="Nach dem Live-Termin wird die geprüfte Aufzeichnung hier ergänzt." />}

                            <article className="rounded-3xl border border-[#c8dfdb] p-5">
                                <ListChecks className="h-6 w-6 text-[#168e91]" />
                                <h3 className="mt-3 text-xl font-bold">Deine Schritte in dieser Woche</h3>
                                {taskError && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-800">{taskError}</p>}
                                <div className="mt-4 space-y-2">
                                    {selectedWeek.tasks.map((task) => (
                                        <button key={task.key} type="button" disabled={Boolean(busyTask)} onClick={() => toggleTask(task)} className="flex min-h-11 w-full items-center gap-3 rounded-2xl px-3 text-left text-sm font-semibold transition hover:bg-[#edf8f6] disabled:opacity-60">
                                            {task.completed ? <CheckCircle2 className="h-5 w-5 shrink-0 text-[#168e91]" /> : <Circle className="h-5 w-5 shrink-0 text-[#8eaaa7]" />}{task.label}
                                        </button>
                                    ))}
                                </div>
                            </article>
                        </div>

                        {selectedWeek.summary && (
                            <article className="border-t border-[#d4e6e3] bg-[#fbf7ed] p-6 sm:p-8">
                                <div className="max-w-4xl">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#168e91]">Zusammenfassung</p>
                                    <h3 className="mt-2 font-serif text-3xl font-bold">{selectedWeek.summary.title}</h3>
                                    <p className="mt-4 text-lg leading-8 text-[#547875]">{selectedWeek.summary.intro}</p>
                                    <div className="mt-7 space-y-6">
                                        {selectedWeek.summary.sections.map((section) => (
                                            <section key={section.title} className="border-l-2 border-[#d8b437] pl-5">
                                                <h4 className="text-lg font-bold text-[#123e3d]">{section.title}</h4>
                                                <p className="mt-2 leading-7 text-[#547875]">{section.text}</p>
                                            </section>
                                        ))}
                                    </div>
                                    <p className="mt-6 rounded-3xl bg-[#e6f4f0] p-5 font-semibold leading-7 text-[#315b58]">{selectedWeek.summary.closing}</p>
                                </div>
                            </article>
                        )}
                    </section>
                )}
            </div>
        </main>
    );
};
