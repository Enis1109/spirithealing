import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    ExternalLink,
    FileAudio,
    FileText,
    LoaderCircle,
    MessageCircle,
    Save,
    Search,
    Send,
    UserCheck,
    UserMinus,
    UsersRound,
    Upload,
    Video,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const programSlug = "zepter-acht-wochen";
const fieldClass = "mt-2 min-h-11 w-full rounded-xl border border-[#0f8b8d]/25 bg-white px-3 py-2 text-sm outline-none focus:border-[#0f8b8d] focus:ring-2 focus:ring-[#0f8b8d]/15";
const textAreaClass = `${fieldClass} resize-y leading-6`;

const formatDate = (value) => value
    ? new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))
    : "Noch nicht veröffentlicht";

const normalizeWeekForEditor = (week) => ({
    weekNumber: week.weekNumber,
    ...(week.draft || week.published || {}),
    tasks: (week.draft?.tasks || week.published?.tasks || []).map((task) => ({ ...task })),
});

export const AdminPrograms = ({ requestJson, setNotice }) => {
    const [program, setProgram] = useState(null);
    const [settings, setSettings] = useState(null);
    const [weeks, setWeeks] = useState({});
    const [state, setState] = useState("loading");
    const [busyKey, setBusyKey] = useState("");
    const [memberSearch, setMemberSearch] = useState("");
    const [enrollmentEmail, setEnrollmentEmail] = useState("");

    const applyProgram = (nextProgram, { resetSettings = true, resetWeeks = true } = {}) => {
        setProgram(nextProgram);
        if (resetSettings) {
            setSettings({
                title: nextProgram.title,
                subtitle: nextProgram.subtitle,
                startDate: nextProgram.startDate,
                whatsappUrl: nextProgram.whatsappUrl || "",
                status: nextProgram.status,
            });
        }
        if (resetWeeks) {
            setWeeks(Object.fromEntries(nextProgram.weeks.map((week) => [week.weekNumber, normalizeWeekForEditor(week)])));
        }
    };

    useEffect(() => {
        let active = true;
        requestJson(`/api/admin/programs/${programSlug}`)
            .then((result) => {
                if (!active) return;
                applyProgram(result.program);
                setState("ready");
            })
            .catch(() => active && setState("error"));
        return () => { active = false; };
    }, [requestJson]);

    const filteredMembers = useMemo(() => {
        const query = memberSearch.trim().toLowerCase();
        return (program?.members || []).filter((member) => !query || `${member.name} ${member.email}`.toLowerCase().includes(query));
    }, [memberSearch, program?.members]);

    const activeCount = program?.members.filter((member) => member.enrollmentStatus === "active").length || 0;
    const cohortReadiness = program?.cohortReadiness || {
        total: 0,
        readyCount: 0,
        activeCount: 0,
        confirmationPendingCount: 0,
        missingAccountCount: 0,
        participants: [],
    };
    const readinessLabel = {
        ready: "Bestätigt, noch nicht freigeschaltet",
        active: "Bereits freigeschaltet",
        confirmation_pending: "Konto noch nicht bestätigt",
        missing_account: "Kein passendes Mitgliederkonto",
    };

    const saveSettings = async (event) => {
        event.preventDefault();
        setBusyKey("settings");
        setNotice(null);
        try {
            const result = await requestJson(`/api/admin/programs/${programSlug}`, {
                method: "PUT",
                body: JSON.stringify(settings),
            });
            applyProgram(result.program, { resetWeeks: false });
            setNotice({ type: "success", text: "Die Programmeinstellungen wurden gespeichert." });
        } catch {
            setNotice({ type: "error", text: "Die Programmeinstellungen konnten nicht gespeichert werden." });
        } finally {
            setBusyKey("");
        }
    };

    const handlePrepareProgram = async () => {
        const confirmed = window.confirm("Die geprüfte Struktur ersetzt die acht aktuellen Entwürfe. Bereits veröffentlichte Fassungen und Teilnehmerzugänge bleiben unverändert. Fortfahren?");
        if (!confirmed) return;
        setBusyKey("prepare-program");
        setNotice(null);
        try {
            const result = await requestJson(`/api/admin/programs/${programSlug}/prepare`, {
                method: "POST",
                body: JSON.stringify({}),
            });
            applyProgram(result.program);
            setNotice({ type: "success", text: "Die geprüfte Acht-Wochen-Struktur wurde als Entwurf eingesetzt. Es wurde nichts veröffentlicht." });
        } catch {
            setNotice({ type: "error", text: "Die Acht-Wochen-Struktur konnte nicht vorbereitet werden." });
        } finally {
            setBusyKey("");
        }
    };

    const setWeekField = (weekNumber, field, value) => setWeeks((current) => ({
        ...current,
        [weekNumber]: { ...current[weekNumber], [field]: value },
    }));

    const setWeekTasks = (weekNumber, value) => {
        const currentTasks = weeks[weekNumber]?.tasks || [];
        const usedKeys = new Set();
        const tasks = value.split("\n").map((label) => label.trim()).filter(Boolean).slice(0, 8).map((label, index) => {
            const matchingTask = currentTasks.find((task) => task.label === label && !usedKeys.has(task.key));
            const positionalTask = currentTasks[index] && !usedKeys.has(currentTasks[index].key) ? currentTasks[index] : null;
            let key = matchingTask?.key || positionalTask?.key || `task-${index + 1}`;
            while (usedKeys.has(key)) key = `${key}-${index + 1}`;
            usedKeys.add(key);
            return { key, label };
        });
        setWeekField(weekNumber, "tasks", tasks);
    };

    const saveWeek = async (weekNumber, announce = true) => {
        const result = await requestJson(`/api/admin/programs/${programSlug}/weeks/${weekNumber}`, {
            method: "PUT",
            body: JSON.stringify(weeks[weekNumber]),
        });
        setProgram(result.program);
        const savedWeek = result.program.weeks.find((item) => item.weekNumber === weekNumber);
        if (savedWeek) {
            setWeeks((current) => ({ ...current, [weekNumber]: normalizeWeekForEditor(savedWeek) }));
        }
        if (announce) setNotice({ type: "success", text: `Woche ${weekNumber} wurde als Entwurf gespeichert.` });
        return result.program;
    };

    const handleSaveWeek = async (weekNumber) => {
        setBusyKey(`week-${weekNumber}`);
        setNotice(null);
        try {
            await saveWeek(weekNumber);
        } catch {
            setNotice({ type: "error", text: `Woche ${weekNumber} konnte nicht gespeichert werden.` });
        } finally {
            setBusyKey("");
        }
    };

    const handlePublishWeek = async (weekNumber) => {
        setBusyKey(`week-${weekNumber}`);
        setNotice(null);
        try {
            await saveWeek(weekNumber, false);
            const result = await requestJson(`/api/admin/programs/${programSlug}/weeks/${weekNumber}/publish`, {
                method: "POST",
                body: JSON.stringify({}),
            });
            setProgram(result.program);
            const publishedWeek = result.program.weeks.find((item) => item.weekNumber === weekNumber);
            if (publishedWeek) {
                setWeeks((current) => ({ ...current, [weekNumber]: normalizeWeekForEditor(publishedWeek) }));
            }
            setNotice({ type: "success", text: `Woche ${weekNumber} wurde für freigeschaltete Teilnehmer veröffentlicht.` });
        } catch {
            setNotice({ type: "error", text: `Woche ${weekNumber} konnte nicht veröffentlicht werden.` });
        } finally {
            setBusyKey("");
        }
    };

    const uploadWeekAsset = async (weekNumber, kind, file) => {
        if (!file) return;
        const assetKey = `asset-${weekNumber}-${kind}`;
        setBusyKey(assetKey);
        setNotice(null);
        try {
            const response = await fetch(`/api/admin/programs/${programSlug}/weeks/${weekNumber}/assets/${kind}`, {
                method: "PUT",
                credentials: "same-origin",
                headers: { "Content-Type": file.type },
                body: file,
            });
            const uploadResult = await response.json().catch(() => ({}));
            if (!response.ok || !uploadResult.ok) throw new Error(uploadResult.error || "upload_failed");
            const field = kind === "workbook" ? "workbookUrl" : "meditationUrl";
            const nextWeek = { ...weeks[weekNumber], [field]: uploadResult.asset.url };
            setWeeks((current) => ({ ...current, [weekNumber]: nextWeek }));
            const saveResult = await requestJson(`/api/admin/programs/${programSlug}/weeks/${weekNumber}`, {
                method: "PUT",
                body: JSON.stringify(nextWeek),
            });
            applyProgram(saveResult.program, { resetSettings: false });
            setNotice({ type: "success", text: `${kind === "workbook" ? "Das Workbook" : "Die Meditation"} für Woche ${weekNumber} wurde geschützt hochgeladen und als Entwurf gespeichert. Es wurde nichts veröffentlicht.` });
        } catch (error) {
            const tooLarge = error.message === "asset_too_large";
            setNotice({ type: "error", text: tooLarge ? "Die Datei ist zu groß." : "Die Datei konnte nicht geschützt hochgeladen werden." });
        } finally {
            setBusyKey("");
        }
    };

    const updateEnrollment = async (email, active) => {
        setBusyKey(`member-${email}`);
        setNotice(null);
        try {
            const result = await requestJson(`/api/admin/programs/${programSlug}/enrollments`, {
                method: "PUT",
                body: JSON.stringify({ email, active }),
            });
            applyProgram(result.program, { resetSettings: false, resetWeeks: false });
            setEnrollmentEmail("");
            setNotice({ type: "success", text: active ? `${email} hat jetzt Programmzugang.` : `Der Programmzugang für ${email} wurde beendet.` });
        } catch (error) {
            setNotice({ type: "error", text: error.code === "member_not_found" ? "Unter dieser E-Mail-Adresse besteht noch kein Mitgliederkonto." : "Die Teilnehmerfreigabe konnte nicht geändert werden." });
        } finally {
            setBusyKey("");
        }
    };

    if (state === "loading") return <div className="flex min-h-64 items-center justify-center rounded-3xl bg-[#fffaf2] text-[#0f8b8d]"><LoaderCircle className="h-8 w-8 animate-spin" /></div>;
    if (state === "error") return <div className="rounded-3xl bg-red-50 p-8 font-bold text-red-800">Der Programmbereich konnte nicht geladen werden.</div>;

    return (
        <div className="space-y-7">
            <section className="overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_90%_10%,rgba(232,202,103,0.28),transparent_30%),linear-gradient(135deg,#123e3d,#0f7775)] p-7 text-white shadow-xl sm:p-9">
                <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[#e8ca67]"><UsersRound className="h-5 w-5" /> Geschlossener Programmraum</p>
                <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Das Zepter – 8 Wochen</h1>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-white/78">Teilnehmer freischalten, Wochen vorbereiten und jeden Inhalt bewusst veröffentlichen.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                    <span className="rounded-full bg-white/12 px-4 py-2 text-sm font-bold">{activeCount} freigeschaltete Teilnehmer</span>
                    <Link to="/mitglieder/programme/zepter" className="inline-flex items-center gap-2 rounded-full bg-[#e8ca67] px-4 py-2 text-sm font-bold text-[#123e3d]">Vorschau öffnen<ExternalLink className="h-4 w-4" /></Link>
                </div>
            </section>

            <form onSubmit={saveSettings} className="rounded-3xl bg-[#fffaf2] p-5 shadow-sm sm:p-7">
                <div className="flex items-start gap-3"><CalendarDays className="mt-1 h-6 w-6 text-[#0f8b8d]" /><div><h2 className="text-2xl font-bold">Programmeinstellungen</h2><p className="mt-1 text-[#6b8585]">Grunddaten und gemeinsamer Community-Link.</p></div></div>
                <div className="mt-6 grid gap-5 lg:grid-cols-2">
                    <label className="font-bold">Titel<input className={fieldClass} value={settings.title} onChange={(event) => setSettings((current) => ({ ...current, title: event.target.value }))} /></label>
                    <label className="font-bold">Startdatum<input type="date" className={fieldClass} value={settings.startDate} onChange={(event) => setSettings((current) => ({ ...current, startDate: event.target.value }))} /></label>
                    <label className="font-bold lg:col-span-2">Untertitel<textarea rows="2" className={textAreaClass} value={settings.subtitle} onChange={(event) => setSettings((current) => ({ ...current, subtitle: event.target.value }))} /></label>
                    <label className="font-bold lg:col-span-2">WhatsApp-Community-Link<input type="url" className={fieldClass} placeholder="https://chat.whatsapp.com/…" value={settings.whatsappUrl} onChange={(event) => setSettings((current) => ({ ...current, whatsappUrl: event.target.value }))} /></label>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                    <button type="submit" disabled={busyKey === "settings"} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0f8b8d] px-5 font-bold text-white disabled:opacity-60"><Save className="h-4 w-4" /> Einstellungen speichern</button>
                    <button type="button" disabled={Boolean(busyKey)} onClick={handlePrepareProgram} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#0f8b8d] px-5 font-bold text-[#0f8b8d] disabled:opacity-60">{busyKey === "prepare-program" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}Geprüfte 8-Wochen-Struktur als Entwurf einsetzen</button>
                </div>
            </form>

            <section className="rounded-3xl bg-[#fffaf2] p-5 shadow-sm sm:p-7">
                <div className="flex items-start gap-3"><UserCheck className="mt-1 h-6 w-6 text-[#0f8b8d]" /><div><h2 className="text-2xl font-bold">Teilnehmerzugänge</h2><p className="mt-1 text-[#6b8585]">Bestehende Mitgliederkonten gezielt für das Programm freischalten.</p></div></div>
                <div className="mt-6 rounded-2xl border border-[#d6e6e3] bg-white p-5">
                    <div className="flex items-start gap-3">
                        <UsersRound className="mt-1 h-5 w-5 text-[#0f8b8d]" />
                        <div>
                            <h3 className="text-lg font-bold">Gruppe aus der Terminabfrage</h3>
                            <p className="mt-1 text-sm leading-6 text-[#6b8585]">Diese Übersicht ist nur eine Vorbereitung. Sie verändert keine Zugänge.</p>
                        </div>
                    </div>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-xl bg-[#eaf4f1] p-3"><strong className="text-xl text-[#0f8b8d]">{cohortReadiness.readyCount}</strong><p className="text-xs text-[#547875]">bereit</p></div>
                        <div className="rounded-xl bg-[#eef8f6] p-3"><strong className="text-xl text-[#0f8b8d]">{cohortReadiness.activeCount}</strong><p className="text-xs text-[#547875]">bereits freigeschaltet</p></div>
                        <div className="rounded-xl bg-amber-50 p-3"><strong className="text-xl text-amber-800">{cohortReadiness.confirmationPendingCount}</strong><p className="text-xs text-amber-800">Bestätigung offen</p></div>
                        <div className="rounded-xl bg-[#fff0ec] p-3"><strong className="text-xl text-[#a33f2f]">{cohortReadiness.missingAccountCount}</strong><p className="text-xs text-[#a33f2f]">kein passendes Konto</p></div>
                    </div>
                    <details className="mt-4">
                        <summary className="cursor-pointer text-sm font-bold text-[#0f8b8d]">Alle {cohortReadiness.total} Teilnehmenden prüfen</summary>
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                            {cohortReadiness.participants.map((participant) => (
                                <div key={`${participant.email}-${participant.name}`} className="rounded-xl border border-[#d6e6e3] p-3 text-sm">
                                    <strong>{participant.name}</strong>
                                    <p className="mt-1 break-all text-xs text-[#6b8585]">{participant.email}</p>
                                    <p className={`mt-2 text-xs font-bold ${participant.readiness === "ready" || participant.readiness === "active" ? "text-[#0f8b8d]" : "text-amber-800"}`}>{readinessLabel[participant.readiness]}</p>
                                </div>
                            ))}
                        </div>
                    </details>
                </div>
                <form className="mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={(event) => { event.preventDefault(); updateEnrollment(enrollmentEmail, true); }}>
                    <input type="email" required value={enrollmentEmail} onChange={(event) => setEnrollmentEmail(event.target.value)} placeholder="E-Mail-Adresse des Mitgliederkontos" className="min-h-12 flex-1 rounded-full border border-[#0f8b8d]/25 bg-white px-5 outline-none focus:border-[#0f8b8d]" />
                    <button type="submit" disabled={!enrollmentEmail || Boolean(busyKey)} className="min-h-12 rounded-full bg-[#0f8b8d] px-6 font-bold text-white disabled:opacity-60">Zugang freischalten</button>
                </form>
                <label className="relative mt-5 block max-w-md"><Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6b8585]" /><input value={memberSearch} onChange={(event) => setMemberSearch(event.target.value)} placeholder="Mitglieder suchen …" className="min-h-11 w-full rounded-full border border-[#0f8b8d]/20 bg-white pl-12 pr-4 outline-none" /></label>
                <div className="mt-4 max-h-96 space-y-2 overflow-y-auto pr-1">
                    {filteredMembers.map((member) => {
                        const active = member.enrollmentStatus === "active";
                        return (
                            <div key={member.email} className="flex flex-col gap-3 rounded-2xl border border-[#d6e6e3] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <strong>{member.name}</strong>
                                    <p className="text-sm text-[#6b8585]">{member.email}</p>
                                    {member.memberStatus !== "active" && <p className="mt-1 text-xs font-bold text-amber-700">Mitgliederkonto noch nicht bestätigt</p>}
                                </div>
                                <button type="button" disabled={busyKey === `member-${member.email}`} onClick={() => updateEnrollment(member.email, !active)} className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-bold ${active ? "bg-[#fff0ec] text-[#a33f2f]" : "bg-[#eaf4f1] text-[#0f8b8d]"}`}>
                                    {active ? <><UserMinus className="h-4 w-4" />Zugang beenden</> : <><UserCheck className="h-4 w-4" />Freischalten</>}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section>
                <div className="mb-4"><h2 className="text-3xl font-bold">Woche 1 bis 8</h2><p className="mt-1 text-[#6b8585]">Speichern legt einen Entwurf an. Erst „Veröffentlichen“ macht ihn für berechtigte Teilnehmer sichtbar.</p></div>
                <div className="space-y-5">
                    {program.weeks.map((weekSnapshot) => {
                        const week = weeks[weekSnapshot.weekNumber];
                        const busy = busyKey === `week-${weekSnapshot.weekNumber}`;
                        if (!week) return null;
                        return (
                            <article key={week.weekNumber} className="rounded-3xl bg-[#fffaf2] p-5 shadow-sm sm:p-7">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0f8b8d]">Woche {week.weekNumber}</p><h3 className="mt-1 text-2xl font-bold">{week.title}</h3></div>
                                    <span className="w-fit rounded-full bg-[#eaf4f1] px-3 py-1.5 text-xs font-bold text-[#0f8b8d]">{weekSnapshot.publishedAt ? `Veröffentlicht ${formatDate(weekSnapshot.publishedAt)}` : "Noch nicht veröffentlicht"}</span>
                                </div>
                                <div className="mt-6 grid gap-5 lg:grid-cols-2">
                                    <label className="font-bold">Titel<input className={fieldClass} value={week.title} onChange={(event) => setWeekField(week.weekNumber, "title", event.target.value)} /></label>
                                    <label className="font-bold">Freigabedatum<input type="date" className={fieldClass} value={week.releaseOn} onChange={(event) => setWeekField(week.weekNumber, "releaseOn", event.target.value)} /></label>
                                    <label className="font-bold lg:col-span-2">Fokus<textarea rows="2" className={textAreaClass} value={week.focus} onChange={(event) => setWeekField(week.weekNumber, "focus", event.target.value)} /></label>
                                    <label className="font-bold lg:col-span-2">Wochenimpuls<textarea rows="5" className={textAreaClass} value={week.intro} onChange={(event) => setWeekField(week.weekNumber, "intro", event.target.value)} /></label>
                                    <label className="font-bold"><Clock3 className="mr-2 inline h-4 w-4 text-[#0f8b8d]" />Live-Termin<input type="datetime-local" className={fieldClass} value={week.liveAt} onChange={(event) => setWeekField(week.weekNumber, "liveAt", event.target.value)} /></label>
                                    <label className="font-bold"><MessageCircle className="mr-2 inline h-4 w-4 text-[#0f8b8d]" />Zoom-Link<input className={fieldClass} value={week.zoomUrl} onChange={(event) => setWeekField(week.weekNumber, "zoomUrl", event.target.value)} /></label>
                                    <label className="font-bold"><FileAudio className="mr-2 inline h-4 w-4 text-[#0f8b8d]" />Meditationstitel<input className={fieldClass} value={week.meditationTitle} onChange={(event) => setWeekField(week.weekNumber, "meditationTitle", event.target.value)} /></label>
                                    <div className="font-bold">Meditationsdatei oder -link<input className={fieldClass} value={week.meditationUrl} onChange={(event) => setWeekField(week.weekNumber, "meditationUrl", event.target.value)} /><label className="mt-2 inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-[#0f8b8d] px-4 text-sm text-[#0f8b8d]"><Upload className="h-4 w-4" />{busyKey === `asset-${week.weekNumber}-meditation` ? "Wird hochgeladen …" : "Audiodatei geschützt hochladen"}<input type="file" className="sr-only" accept="audio/mpeg,audio/mp4,audio/x-m4a,audio/aac,audio/wav" disabled={Boolean(busyKey)} onChange={(event) => { uploadWeekAsset(week.weekNumber, "meditation", event.target.files?.[0]); event.target.value = ""; }} /></label></div>
                                    <label className="font-bold"><FileText className="mr-2 inline h-4 w-4 text-[#0f8b8d]" />Workbook-Bezeichnung<input className={fieldClass} value={week.workbookLabel} onChange={(event) => setWeekField(week.weekNumber, "workbookLabel", event.target.value)} /></label>
                                    <div className="font-bold">Workbook-Datei oder -link<input className={fieldClass} value={week.workbookUrl} onChange={(event) => setWeekField(week.weekNumber, "workbookUrl", event.target.value)} /><label className="mt-2 inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-[#0f8b8d] px-4 text-sm text-[#0f8b8d]"><Upload className="h-4 w-4" />{busyKey === `asset-${week.weekNumber}-workbook` ? "Wird hochgeladen …" : "PDF geschützt hochladen"}<input type="file" className="sr-only" accept="application/pdf" disabled={Boolean(busyKey)} onChange={(event) => { uploadWeekAsset(week.weekNumber, "workbook", event.target.files?.[0]); event.target.value = ""; }} /></label></div>
                                    <label className="font-bold lg:col-span-2"><Video className="mr-2 inline h-4 w-4 text-[#0f8b8d]" />Aufzeichnungslink<input className={fieldClass} value={week.recordingUrl} onChange={(event) => setWeekField(week.weekNumber, "recordingUrl", event.target.value)} /></label>
                                    <label className="font-bold lg:col-span-2">Wochenaufgaben – eine Aufgabe pro Zeile<textarea rows="5" className={textAreaClass} value={week.tasks.map((task) => task.label).join("\n")} onChange={(event) => setWeekTasks(week.weekNumber, event.target.value)} /></label>
                                </div>
                                <div className="mt-6 flex flex-wrap gap-3">
                                    <button type="button" disabled={busy} onClick={() => handleSaveWeek(week.weekNumber)} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#0f8b8d] px-5 font-bold text-[#0f8b8d] disabled:opacity-60"><Save className="h-4 w-4" />Entwurf speichern</button>
                                    <button type="button" disabled={busy} onClick={() => handlePublishWeek(week.weekNumber)} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0f8b8d] px-5 font-bold text-white disabled:opacity-60">{busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}Speichern & veröffentlichen</button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};
