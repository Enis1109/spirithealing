import {
    Bot,
    CheckCircle2,
    Clock3,
    FileText,
    History,
    LayoutDashboard,
    LockKeyhole,
    LogOut,
    RotateCcw,
    Save,
    Search,
    Send,
    ShieldCheck,
    Sparkles,
    UsersRound,
} from "lucide-react";
import { createElement, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
    adminCatalogStats,
    assistantContentCatalog,
    pageContentCatalog,
} from "@/content/adminCatalog";
import { AdminPrograms } from "@/sections/AdminPrograms";

const emptySnapshot = { entries: [], revisions: [] };

const requestJson = async (url, options = {}) => {
    const response = await fetch(url, {
        credentials: "same-origin",
        headers: {
            Accept: "application/json",
            ...(options.body ? { "Content-Type": "application/json" } : {}),
            ...options.headers,
        },
        cache: "no-store",
        ...options,
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.ok) {
        const error = new Error(result.error || "request_failed");
        error.code = result.error || "request_failed";
        error.status = response.status;
        throw error;
    }
    return result;
};

const formatDate = (value) => value
    ? new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))
    : "Noch nicht veröffentlicht";

const buildDefaults = () => {
    const defaults = new Map();
    for (const item of pageContentCatalog) defaults.set(item.key, item.defaults);
    for (const topic of assistantContentCatalog) {
        defaults.set(topic.answerKey, topic.defaults.answer);
        defaults.set(topic.termsKey, topic.defaults.terms);
    }
    return defaults;
};

const contentDefaults = buildDefaults();

const entryMapFrom = (snapshot) => new Map(snapshot.entries.map((entry) => [entry.key, entry]));
const defaultValue = (key, language) => contentDefaults.get(key)?.[language] ?? "";
const effectiveDraft = (entry, key, language) => entry?.draft?.[language]
    ?? entry?.published?.[language]
    ?? defaultValue(key, language);
const effectivePublished = (entry, key, language) => entry?.published?.[language]
    ?? defaultValue(key, language);

const buildEditorValues = (snapshot) => {
    const entries = entryMapFrom(snapshot);
    return Object.fromEntries([...contentDefaults.keys()].map((key) => {
        const entry = entries.get(key);
        return [key, {
            de: effectiveDraft(entry, key, "de"),
            tr: effectiveDraft(entry, key, "tr"),
        }];
    }));
};

const Notice = ({ notice }) => notice ? (
    <div className={`mb-5 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-medium ${notice.type === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`} role="status">
        {notice.type === "error" ? <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" /> : <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />}
        <span>{notice.text}</span>
    </div>
) : null;

const AdminLogin = ({ onSignedIn }) => {
    const [state, setState] = useState("idle");
    const [error, setError] = useState("");

    const submit = async (event) => {
        event.preventDefault();
        setState("loading");
        setError("");
        const formData = new FormData(event.currentTarget);
        try {
            await requestJson("/api/members/login", {
                method: "POST",
                body: JSON.stringify({
                    email: formData.get("email"),
                    password: formData.get("password"),
                }),
            });
            await onSignedIn();
        } catch (requestError) {
            setError(requestError.code === "rate_limit"
                ? "Zu viele Anmeldeversuche. Bitte warte einige Minuten."
                : "Die Anmeldung war nicht erfolgreich. Bitte prüfe E-Mail-Adresse und Passwort.");
            setState("idle");
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#eaf4f1] px-4 py-12 text-[#173f40]" data-no-translate>
            <section className="w-full max-w-md rounded-[2rem] border border-[#0f8b8d]/20 bg-[#fffaf2] p-7 shadow-2xl shadow-[#173f40]/10 sm:p-9">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0f8b8d] text-white"><LockKeyhole className="h-7 w-7" /></div>
                <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-[#0f8b8d]">Spirit Healing</p>
                <h1 className="mt-2 text-3xl font-bold">Admin-Bereich</h1>
                <p className="mt-3 leading-7 text-[#4e6d6e]">Melde dich mit deinem freigegebenen Spirit-Healing-Konto an, um Texte und Bot-Antworten zu bearbeiten.</p>
                <form className="mt-7 space-y-5" onSubmit={submit}>
                    <label className="block text-sm font-bold">E-Mail-Adresse
                        <input name="email" type="email" autoComplete="username" defaultValue="info@spirit-healing.tr" required className="mt-2 min-h-12 w-full rounded-xl border border-[#0f8b8d]/30 bg-white px-4 outline-none focus:border-[#0f8b8d] focus:ring-2 focus:ring-[#0f8b8d]/20" />
                    </label>
                    <label className="block text-sm font-bold">Passwort
                        <input name="password" type="password" autoComplete="current-password" minLength={10} required className="mt-2 min-h-12 w-full rounded-xl border border-[#0f8b8d]/30 bg-white px-4 outline-none focus:border-[#0f8b8d] focus:ring-2 focus:ring-[#0f8b8d]/20" />
                    </label>
                    {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{error}</p>}
                    <button type="submit" disabled={state === "loading"} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0f8b8d] px-6 font-bold text-white transition hover:bg-[#0a6f71] disabled:opacity-60">
                        <LockKeyhole className="h-5 w-5" /> {state === "loading" ? "Anmeldung läuft …" : "Sicher anmelden"}
                    </button>
                </form>
                <div className="mt-6 flex flex-wrap justify-between gap-3 text-sm">
                    <Link to={"/mitglieder?mode=forgot&email=info%40spirit-healing.tr&returnTo=%2Fadmin"} className="font-semibold text-[#0f8b8d] hover:underline">Passwort vergessen?</Link>
                    <Link to="/" className="text-[#4e6d6e] hover:underline">Zur Homepage</Link>
                </div>
            </section>
        </main>
    );
};

const LanguageEditor = ({ language, value, onChange, compact = false }) => (
    <label className="block">
        <span className="mb-2 flex items-center justify-between gap-3 text-sm font-bold text-[#173f40]">
            {language === "de" ? "Deutsch" : "Türkisch"}
            {language === "tr" && <small className="font-medium text-[#6b8585]">parallel vorbereitet</small>}
        </span>
        <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            rows={compact ? 2 : 6}
            maxLength={16000}
            className="w-full resize-y rounded-2xl border border-[#0f8b8d]/25 bg-white px-4 py-3 leading-7 text-[#173f40] outline-none transition focus:border-[#0f8b8d] focus:ring-2 focus:ring-[#0f8b8d]/20"
        />
    </label>
);

const Revisions = ({ keys, revisions, onRestore }) => {
    const matching = revisions.filter((revision) => keys.includes(revision.key)).slice(0, 8);
    return (
        <details className="mt-4 border-t border-[#0f8b8d]/15 pt-4">
            <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-bold text-[#0f8b8d] marker:content-none">
                <History className="h-4 w-4" /> Versionsverlauf ({matching.length})
            </summary>
            <div className="mt-3 space-y-2">
                {matching.length === 0 && <p className="text-sm text-[#6b8585]">Nach der ersten Veröffentlichung erscheint hier der Verlauf.</p>}
                {matching.map((revision) => (
                    <div key={revision.id} className="flex flex-col gap-2 rounded-xl bg-[#eaf4f1] px-3 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                        <span><strong>{revision.key.endsWith(".terms") ? "Fragevarianten" : "Text"}</strong> · {formatDate(revision.createdAt)}{revision.publishedBy ? ` · ${revision.publishedBy}` : ""}</span>
                        <button type="button" onClick={() => onRestore(revision)} className="inline-flex items-center gap-1 font-bold text-[#0f8b8d] hover:underline"><RotateCcw className="h-4 w-4" /> Als Entwurf laden</button>
                    </div>
                ))}
            </div>
        </details>
    );
};

const EditorActions = ({ dirty, unpublished, busy, onSave, onPublish, publishedAt }) => (
    <div className="mt-5 flex flex-col gap-3 border-t border-[#0f8b8d]/15 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-[#6b8585]">
            <span className={`mr-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-bold ${dirty ? "bg-amber-100 text-amber-800" : unpublished ? "bg-blue-100 text-blue-800" : "bg-emerald-100 text-emerald-800"}`}>
                {dirty ? "Ungespeichert" : unpublished ? "Entwurf bereit" : "Aktuell"}
            </span>
            {publishedAt && <span>Live seit {formatDate(publishedAt)}</span>}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
            <button type="button" onClick={onSave} disabled={busy || !dirty} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#0f8b8d]/40 px-5 font-bold text-[#0f8b8d] transition hover:bg-[#eaf4f1] disabled:cursor-not-allowed disabled:opacity-40"><Save className="h-4 w-4" /> Entwurf speichern</button>
            <button type="button" onClick={onPublish} disabled={busy} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#0f8b8d] px-5 font-bold text-white transition hover:bg-[#0a6f71] disabled:opacity-50"><Send className="h-4 w-4" /> Speichern & veröffentlichen</button>
        </div>
    </div>
);

export const AdminArea = () => {
    const [sessionState, setSessionState] = useState("loading");
    const [member, setMember] = useState(null);
    const [snapshot, setSnapshot] = useState(emptySnapshot);
    const [values, setValues] = useState({});
    const [contentState, setContentState] = useState("loading");
    const [activeTab, setActiveTab] = useState("overview");
    const [search, setSearch] = useState("");
    const [notice, setNotice] = useState(null);
    const [busyKey, setBusyKey] = useState("");
    const initialized = useRef(false);

    useEffect(() => {
        const previousTitle = document.title;
        const robots = document.querySelector('meta[name="robots"]');
        const previousRobots = robots?.getAttribute("content");
        document.title = "Admin-Bereich | Spirit Healing";
        robots?.setAttribute("content", "noindex, nofollow");
        return () => {
            document.title = previousTitle;
            if (robots && previousRobots) robots.setAttribute("content", previousRobots);
        };
    }, []);

    const loadSession = useCallback(async () => {
        try {
            const result = await requestJson("/api/members/session");
            setMember(result.member);
            setSessionState(result.member?.role === "admin" ? "admin" : "forbidden");
        } catch (error) {
            setMember(null);
            setSessionState(error.status === 401 ? "signed-out" : "error");
        }
    }, []);

    useEffect(() => {
        let active = true;
        requestJson("/api/members/session")
            .then((result) => {
                if (!active) return;
                setMember(result.member);
                setSessionState(result.member?.role === "admin" ? "admin" : "forbidden");
            })
            .catch((error) => {
                if (!active) return;
                setMember(null);
                setSessionState(error.status === 401 ? "signed-out" : "error");
            });
        return () => {
            active = false;
        };
    }, []);

    const applySnapshot = useCallback((nextSnapshot, resetValues = false) => {
        setSnapshot(nextSnapshot || emptySnapshot);
        if (resetValues || !initialized.current) {
            setValues(buildEditorValues(nextSnapshot || emptySnapshot));
            initialized.current = true;
        }
    }, []);

    useEffect(() => {
        if (sessionState !== "admin") return undefined;
        let active = true;
        requestJson("/api/admin/content")
            .then((result) => {
                if (!active) return;
                applySnapshot(result.content, true);
                setContentState("ready");
            })
            .catch(() => active && setContentState("error"));
        return () => {
            active = false;
        };
    }, [applySnapshot, sessionState]);

    const entries = useMemo(() => entryMapFrom(snapshot), [snapshot]);
    const editorValue = (key, language) => values[key]?.[language] ?? defaultValue(key, language);
    const setEditorValue = (key, language, value) => setValues((current) => ({
        ...current,
        [key]: { ...(current[key] || {}), [language]: value },
    }));
    const isDirty = (key) => ["de", "tr"].some((language) => (
        editorValue(key, language) !== effectiveDraft(entries.get(key), key, language)
    ));
    const isUnpublished = (key) => ["de", "tr"].some((language) => (
        effectiveDraft(entries.get(key), key, language) !== effectivePublished(entries.get(key), key, language)
    ));

    const saveKeys = async (keys, announce = true) => {
        const result = await requestJson("/api/admin/content", {
            method: "PUT",
            body: JSON.stringify({ items: keys.map((key) => ({
                key,
                de: editorValue(key, "de"),
                tr: editorValue(key, "tr"),
            })) }),
        });
        applySnapshot(result.content);
        if (announce) setNotice({ type: "success", text: "Der Entwurf wurde gespeichert. Auf der Homepage ist noch nichts verändert." });
        return result.content;
    };

    const handleSave = async (keys, actionKey) => {
        setBusyKey(actionKey);
        setNotice(null);
        try {
            await saveKeys(keys);
        } catch {
            setNotice({ type: "error", text: "Der Entwurf konnte nicht gespeichert werden. Bitte versuche es noch einmal." });
        } finally {
            setBusyKey("");
        }
    };

    const handlePublish = async (keys, actionKey) => {
        setBusyKey(actionKey);
        setNotice(null);
        try {
            await saveKeys(keys, false);
            const result = await requestJson("/api/admin/content/publish", {
                method: "POST",
                body: JSON.stringify({ keys }),
            });
            applySnapshot(result.content);
            setNotice({ type: "success", text: "Die Änderung wurde veröffentlicht und ist jetzt für Besucher sichtbar." });
        } catch {
            setNotice({ type: "error", text: "Die Änderung konnte nicht veröffentlicht werden. Der bisherige Live-Text bleibt erhalten." });
        } finally {
            setBusyKey("");
        }
    };

    const handleRestore = async (revision) => {
        setBusyKey(`restore-${revision.id}`);
        setNotice(null);
        try {
            const result = await requestJson("/api/admin/content/restore", {
                method: "POST",
                body: JSON.stringify({ key: revision.key, revisionId: revision.id }),
            });
            applySnapshot(result.content);
            const restoredEntry = result.content.entries.find((entry) => entry.key === revision.key);
            setValues((current) => ({
                ...current,
                [revision.key]: {
                    de: effectiveDraft(restoredEntry, revision.key, "de"),
                    tr: effectiveDraft(restoredEntry, revision.key, "tr"),
                },
            }));
            setNotice({ type: "success", text: "Die ältere Version wurde als Entwurf geladen. Veröffentlicht wird sie erst nach deiner Bestätigung." });
        } catch {
            setNotice({ type: "error", text: "Diese Version konnte nicht geladen werden." });
        } finally {
            setBusyKey("");
        }
    };

    const logout = async () => {
        await requestJson("/api/members/logout", { method: "POST", body: JSON.stringify({}) }).catch(() => undefined);
        initialized.current = false;
        setSnapshot(emptySnapshot);
        setValues({});
        setMember(null);
        setSessionState("signed-out");
    };

    const allKeys = [...contentDefaults.keys()];
    const dirtyCount = allKeys.filter(isDirty).length;
    const unpublishedCount = allKeys.filter(isUnpublished).length;
    const normalizedSearch = search.trim().toLowerCase();
    const filteredPages = pageContentCatalog.filter((item) => !normalizedSearch || `${item.section} ${item.label} ${item.key}`.toLowerCase().includes(normalizedSearch));
    const filteredTopics = assistantContentCatalog.filter((topic) => !normalizedSearch || `${topic.title} ${topic.id} ${topic.defaults.terms.de} ${topic.defaults.answer.de}`.toLowerCase().includes(normalizedSearch));

    if (sessionState === "loading") return <main className="flex min-h-screen items-center justify-center bg-[#eaf4f1] font-bold text-[#0f8b8d]">Admin-Bereich wird geladen …</main>;
    if (sessionState === "signed-out") return <AdminLogin onSignedIn={loadSession} />;
    if (sessionState === "forbidden") return (
        <main className="flex min-h-screen items-center justify-center bg-[#eaf4f1] px-4 text-[#173f40]" data-no-translate>
            <section className="max-w-lg rounded-[2rem] bg-[#fffaf2] p-8 text-center shadow-xl">
                <ShieldCheck className="mx-auto h-12 w-12 text-[#0f8b8d]" />
                <h1 className="mt-5 text-3xl font-bold">Keine Admin-Freigabe</h1>
                <p className="mt-3 leading-7 text-[#4e6d6e]">Das Konto {member?.email} ist angemeldet, besitzt aber noch keine Berechtigung zum Bearbeiten der Homepage.</p>
                <button type="button" onClick={logout} className="mt-6 rounded-full bg-[#0f8b8d] px-6 py-3 font-bold text-white">Abmelden</button>
            </section>
        </main>
    );
    if (sessionState === "error") return <main className="flex min-h-screen items-center justify-center bg-[#eaf4f1] px-4 font-bold text-red-800">Der Admin-Bereich ist gerade nicht erreichbar.</main>;

    const navItems = [
        { id: "overview", label: "Übersicht", icon: LayoutDashboard },
        { id: "pages", label: "Homepage-Texte", icon: FileText },
        { id: "assistant", label: "Fragebot", icon: Bot },
        { id: "programs", label: "Programme", icon: UsersRound },
    ];

    return (
        <main className="min-h-screen bg-[#eaf4f1] text-[#173f40]" data-no-translate>
            <header className="border-b border-[#0f8b8d]/15 bg-[#fffaf2]">
                <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0f8b8d] font-bold text-white">SH</span>
                        <div><strong className="block">Spirit Healing</strong><span className="text-sm text-[#6b8585]">Inhalte verwalten</span></div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="hidden text-right text-sm sm:block"><strong className="block">{member?.name}</strong><span className="text-[#6b8585]">Administrator</span></span>
                        <button type="button" onClick={logout} aria-label="Abmelden" className="flex h-11 w-11 items-center justify-center rounded-full border border-[#0f8b8d]/25 text-[#0f8b8d] hover:bg-[#eaf4f1]"><LogOut className="h-5 w-5" /></button>
                    </div>
                </div>
            </header>

            <div className="mx-auto grid w-full max-w-[1500px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-8">
                <aside className="h-fit rounded-3xl bg-[#fffaf2] p-3 shadow-sm lg:sticky lg:top-6">
                    <nav className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-1">
                        {navItems.map(({ id, label, icon }) => (
                            <button key={id} type="button" onClick={() => { setActiveTab(id); setSearch(""); }} className={`flex min-h-12 items-center justify-center gap-2 rounded-2xl px-3 text-sm font-bold transition lg:justify-start ${activeTab === id ? "bg-[#0f8b8d] text-white" : "text-[#4e6d6e] hover:bg-[#eaf4f1]"}`}>{createElement(icon, { className: "h-5 w-5" })}<span>{label}</span></button>
                        ))}
                    </nav>
                    <div className="mt-3 hidden rounded-2xl bg-[#eaf4f1] p-4 text-sm leading-6 text-[#4e6d6e] lg:block">
                        <ShieldCheck className="mb-2 h-5 w-5 text-[#0f8b8d]" /> Änderungen bleiben als Entwurf unsichtbar, bis „Veröffentlichen“ gewählt wird.
                    </div>
                </aside>

                <section className="min-w-0">
                    <Notice notice={notice} />
                    {contentState === "loading" && <div className="rounded-3xl bg-[#fffaf2] p-8 font-bold text-[#0f8b8d]">Inhalte werden geladen …</div>}
                    {contentState === "error" && <div className="rounded-3xl bg-red-50 p-8 font-bold text-red-800">Die Inhalte konnten nicht geladen werden.</div>}

                    {contentState === "ready" && activeTab === "overview" && (
                        <div className="space-y-6">
                            <section className="overflow-hidden rounded-[2rem] bg-[#075f62] p-7 text-white shadow-xl sm:p-10">
                                <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[#e8ca67]"><Sparkles className="h-4 w-4" /> Admin-Bereich</p>
                                <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">Gezielt ändern, in Ruhe prüfen, sicher veröffentlichen.</h1>
                                <p className="mt-5 max-w-3xl text-lg leading-8 text-white/80">Hier können Homepage-Texte, FAQ-Antworten, die Wissensbasis des Fragebots und geschlossene Programme verwaltet werden. Technische Funktionen und das Design bleiben geschützt.</p>
                            </section>
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                {[
                                    [FileText, adminCatalogStats.pageFields, "bearbeitbare Textfelder"],
                                    [Bot, adminCatalogStats.assistantTopics, "Themen im Fragebot"],
                                    [Save, dirtyCount, "ungespeicherte Änderungen"],
                                    [Clock3, unpublishedCount, "gespeicherte Entwürfe"],
                                ].map(([icon, value, label]) => (
                                    <article key={label} className="rounded-3xl bg-[#fffaf2] p-5 shadow-sm">{createElement(icon, { className: "h-6 w-6 text-[#0f8b8d]" })}<strong className="mt-4 block text-3xl">{value}</strong><span className="mt-1 block text-sm text-[#6b8585]">{label}</span></article>
                                ))}
                            </div>
                            <section className="grid gap-4 lg:grid-cols-3">
                                {[
                                    ["1", "Text auswählen", "Öffne Homepage-Texte oder Fragebot und suche den gewünschten Abschnitt."],
                                    ["2", "Entwurf speichern", "Speichern verändert die öffentliche Seite noch nicht."],
                                    ["3", "Veröffentlichen", "Erst dieser Schritt übernimmt die geprüfte Fassung auf die Homepage."],
                                ].map(([number, title, text]) => <article key={number} className="rounded-3xl border border-[#0f8b8d]/15 bg-white p-6"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8ca67] font-bold text-[#173f40]">{number}</span><h2 className="mt-4 text-xl font-bold">{title}</h2><p className="mt-2 leading-7 text-[#6b8585]">{text}</p></article>)}
                            </section>
                        </div>
                    )}

                    {contentState === "ready" && ["pages", "assistant"].includes(activeTab) && (
                        <div>
                            <div className="mb-5 flex flex-col gap-4 rounded-3xl bg-[#fffaf2] p-5 sm:flex-row sm:items-center sm:justify-between">
                                <div><h1 className="text-3xl font-bold">{activeTab === "pages" ? "Homepage-Texte" : "Fragebot-Wissen"}</h1><p className="mt-1 text-[#6b8585]">{activeTab === "pages" ? "Einzelne Passagen bearbeiten, ohne die Seite neu zu bauen." : "Antworten und alternative Frageformulierungen auf Deutsch und Türkisch pflegen."}</p></div>
                                <label className="relative block w-full sm:max-w-sm"><Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6b8585]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Suchen …" className="min-h-12 w-full rounded-full border border-[#0f8b8d]/25 bg-white pl-12 pr-4 outline-none focus:border-[#0f8b8d] focus:ring-2 focus:ring-[#0f8b8d]/20" /></label>
                            </div>

                            {activeTab === "pages" && (
                                <div className="space-y-8">
                                    {[...new Set(filteredPages.map((item) => item.section))].map((section) => (
                                        <section key={section}>
                                            <h2 className="mb-4 text-xl font-bold text-[#075f62]">{section}</h2>
                                            <div className="space-y-4">
                                                {filteredPages.filter((item) => item.section === section).map((item) => {
                                                    const entry = entries.get(item.key);
                                                    const dirty = isDirty(item.key);
                                                    const unpublished = isUnpublished(item.key);
                                                    return (
                                                        <article key={item.key} className="rounded-3xl bg-[#fffaf2] p-5 shadow-sm sm:p-6">
                                                            <div><h3 className="text-lg font-bold">{item.label}</h3><code className="mt-1 block text-xs text-[#789091]">{item.key}</code></div>
                                                            <div className="mt-5 grid gap-5 xl:grid-cols-2">
                                                                {(["de", "tr"]).map((language) => <LanguageEditor key={language} language={language} compact={item.compact} value={editorValue(item.key, language)} onChange={(value) => setEditorValue(item.key, language, value)} />)}
                                                            </div>
                                                            <EditorActions dirty={dirty} unpublished={unpublished} busy={busyKey === item.key} publishedAt={entry?.publishedAt} onSave={() => handleSave([item.key], item.key)} onPublish={() => handlePublish([item.key], item.key)} />
                                                            <Revisions keys={[item.key]} revisions={snapshot.revisions} onRestore={handleRestore} />
                                                        </article>
                                                    );
                                                })}
                                            </div>
                                        </section>
                                    ))}
                                    {filteredPages.length === 0 && <p className="rounded-3xl bg-[#fffaf2] p-8 text-center text-[#6b8585]">Kein Textfeld passt zu dieser Suche.</p>}
                                </div>
                            )}

                            {activeTab === "assistant" && (
                                <div className="space-y-4">
                                    {filteredTopics.map((topic) => {
                                        const keys = [topic.answerKey, topic.termsKey];
                                        const dirty = keys.some(isDirty);
                                        const unpublished = keys.some(isUnpublished);
                                        const publishedAt = entries.get(topic.answerKey)?.publishedAt || entries.get(topic.termsKey)?.publishedAt;
                                        return (
                                            <article key={topic.id} className="rounded-3xl bg-[#fffaf2] p-5 shadow-sm sm:p-6">
                                                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                    <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0f8b8d]">Bot-Thema</p><h2 className="mt-1 text-xl font-bold">{topic.title}</h2><code className="mt-1 block text-xs text-[#789091]">{topic.id}</code></div>
                                                    <span className="w-fit rounded-full bg-[#eaf4f1] px-3 py-1 text-xs font-bold text-[#0f8b8d]">Priorität {topic.priority}</span>
                                                </div>
                                                <div className="mt-6 grid gap-6 2xl:grid-cols-2">
                                                    <section><h3 className="mb-3 font-bold">Antwort</h3><div className="grid gap-4">{(["de", "tr"]).map((language) => <LanguageEditor key={language} language={language} value={editorValue(topic.answerKey, language)} onChange={(value) => setEditorValue(topic.answerKey, language, value)} />)}</div></section>
                                                    <section><h3 className="mb-1 font-bold">Erkannte Frageformulierungen</h3><p className="mb-3 text-sm text-[#6b8585]">Eine Formulierung pro Zeile. So kann der Bot auch Alltagssprache verstehen.</p><div className="grid gap-4">{(["de", "tr"]).map((language) => <LanguageEditor key={language} language={language} value={editorValue(topic.termsKey, language)} onChange={(value) => setEditorValue(topic.termsKey, language, value)} />)}</div></section>
                                                </div>
                                                <EditorActions dirty={dirty} unpublished={unpublished} busy={busyKey === topic.id} publishedAt={publishedAt} onSave={() => handleSave(keys, topic.id)} onPublish={() => handlePublish(keys, topic.id)} />
                                                <Revisions keys={keys} revisions={snapshot.revisions} onRestore={handleRestore} />
                                            </article>
                                        );
                                    })}
                                    {filteredTopics.length === 0 && <p className="rounded-3xl bg-[#fffaf2] p-8 text-center text-[#6b8585]">Kein Bot-Thema passt zu dieser Suche.</p>}
                                </div>
                            )}
                        </div>
                    )}

                    {contentState === "ready" && activeTab === "programs" && (
                        <AdminPrograms requestJson={requestJson} setNotice={setNotice} />
                    )}
                </section>
            </div>
        </main>
    );
};
