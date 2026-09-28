import { useEffect, useState } from 'react';
import { CalendarDays, Download, PlayCircle, UsersRound } from 'lucide-react';
import { readExperienceDescription, writeExperienceDescription } from '../lib/experienceDescription.js';

const endpoint = '/api/members/experience';
const dateText = value => new Intl.DateTimeFormat('de-DE', {
    dateStyle: 'long', timeZone: 'Europe/Berlin',
}).format(new Date(value));
const toUTC = value => new Date(value).toISOString();
const fieldClass = 'mt-1 block w-full rounded-xl border border-[#b8d9d4] bg-white p-3 text-[#123e3d]';
const buttonClass = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#168e91] px-5 py-3 font-bold text-white disabled:opacity-50';

async function request(url, options) {
    const response = await fetch(url, options);
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.error === 'member_not_registered'
        ? 'Diese Person braucht zuerst ein aktiviertes Mitgliederkonto.'
        : `Die Änderung konnte nicht ausgeführt werden (${data.error || response.status}).`);
    return data;
}

export function ExperienceGroup({ member }) {
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [player, setPlayer] = useState(null);
    const [busy, setBusy] = useState(false);
    const [notice, setNotice] = useState('');
    const [editing, setEditing] = useState(null);
    const [reminderInfo, setReminderInfo] = useState(null);
    const refresh = () => request(endpoint).then(setData);
    useEffect(() => { let active = true; request(endpoint).then(value => {
        if (active) setData(value);
    }).catch(err => { if (active) setError(err.message); }); return () => { active = false; }; }, []);
    const action = async callback => {
        setBusy(true); setError(''); setNotice('');
        try { await callback(); await refresh(); }
        catch (err) { setError(err.message); }
        finally { setBusy(false); }
    };
    const openVideo = session => action(async () => {
        const result = await request(`${endpoint}/sessions/${session.id}/recording`);
        setPlayer({ title: session.title, url: result.embedUrl });
    });
    const jsonPost = (url, body) => request(url, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    const saveSession = event => {
        event.preventDefault(); const form = event.currentTarget;
        const fields = Object.fromEntries(new FormData(form));
        action(async () => {
            await jsonPost('/api/admin/experience/sessions', {
                ...fields, occurredAt: toUTC(fields.occurredAt), reviewed: fields.reviewed === 'on',
                summary: writeExperienceDescription(fields.monthTopic, fields.summary),
            });
            form.reset(); setEditing(null); setNotice('Treffen gespeichert. Es wurde keine Nachricht versendet.');
        });
    };
    const grant = event => {
        event.preventDefault(); const fields = Object.fromEntries(new FormData(event.currentTarget));
        action(async () => {
            await jsonPost('/api/admin/experience/grant', { ...fields,
                startsAt: toUTC(fields.startsAt), endsAt: fields.endsAt ? toUTC(fields.endsAt) : null,
                contentFrom: toUTC(fields.contentFrom || fields.startsAt), fullArchive: fields.fullArchive === 'on',
            });
            setNotice('Zugangsregel gespeichert. Es wurde keine Zahlung ausgelöst und keine E-Mail versendet.');
        });
    };
    const upload = event => {
        event.preventDefault(); const form = event.currentTarget; const fields = new FormData(form);
        action(async () => {
            const file = fields.get('file');
            if (!file?.size || file.size > 8 * 1024 * 1024) throw new Error('Bitte eine PDF bis 8 MB auswählen.');
            await request(`/api/admin/experience/sessions/${fields.get('sessionId')}/handouts?title=${encodeURIComponent(fields.get('title'))}`, {
                method: 'POST', headers: { 'Content-Type': 'application/pdf' }, body: file,
            });
            form.reset(); setNotice('Handout geschützt zum Treffen gespeichert.');
        });
    };
    const importMeetings = event => {
        event.preventDefault(); const fields = new FormData(event.currentTarget);
        action(async () => {
            const file = fields.get('catalog');
            if (!file?.size || file.size > 100 * 1024) throw new Error('Bitte das Zoom-Importregister als JSON bis 100 KB wählen.');
            const sessions = JSON.parse(await file.text());
            const result = await jsonPost('/api/admin/experience/import', { sessions });
            setNotice(`${result.sessions.filter(item => item.created).length} Treffen als Entwurf angelegt. Bereits importierte Treffen wurden nicht verändert.`);
        });
    };
    const localInput = value => {
        const date = new Date(value);
        return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 19);
    };
    const sessions = (data?.sessions || []).map(session => ({ ...session, ...readExperienceDescription(session.summary) })).filter(session =>
        `${dateText(session.occurredAt)} ${session.title} ${session.summary} ${session.handouts.map(h => h.title).join(' ')}`.toLowerCase().includes(search.toLowerCase())
        && (filter !== 'handouts' || session.handouts.length > 0));
    return <section className="space-y-7">
        <header className="relative isolate overflow-hidden rounded-[2rem] bg-[#123e3d] text-white">
            <img src="/images/experience-rose-2026-09.png" alt="" width="1536" height="1024" fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover object-[64%_center] sm:object-center" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#092c31]/95 via-[#092c31]/80 to-transparent sm:via-[#092c31]/50" />
            <div className="max-w-xl px-7 py-10 sm:px-10 sm:py-14 lg:max-w-[65%]">
            <UsersRound className="mb-5 h-8 w-8 text-[#f1d277]" />
            <p className="text-sm font-bold uppercase tracking-widest text-[#f1d277]">Spirit Healing</p>
            <h1 className="mt-3 break-words font-serif text-[clamp(1.75rem,7vw,2.25rem)] sm:text-5xl">Deine Erfahrungsgruppe</h1>
            <p className="mt-5 flex items-center gap-2"><CalendarDays className="h-5 w-5" />Sonntags um 19 Uhr · deutsche Zeit</p>
            <p className="mt-3 max-w-2xl leading-7 text-white/85">Hier findest du die freigegebenen Aufzeichnungen und Handouts unserer gemeinsamen Treffen.</p>
            </div>
        </header>
        {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-800">{error}</p>}
        {notice && <p role="status" className="rounded-xl bg-white p-4">{notice}</p>}
        {!data && !error && <p role="status">Dein Gruppenbereich wird geladen …</p>}
        {data && <>
            {data.adminPreview && <p className="rounded-xl bg-[#fff6dc] p-4">Admin-Vorschau · Entwürfe sind nur für euch sichtbar. Den Erinnerungsversand könnt ihr unten in der Verwaltung prüfen.</p>}
            {data.active ? <div className="rounded-2xl border border-[#b8d9d4] bg-white p-6">
                <p className="font-bold">{data.access.endsAt ? `Dein Zugang läuft bis ${dateText(data.access.endsAt)}.` : 'Dein Zugang als bestehendes Gruppenmitglied ist aktiv.'}</p>
                <p className="mt-2">{data.access.fullArchive ? 'Für dich ist das gesamte freigegebene Archiv zugänglich.' : `Du siehst die Inhalte ab deinem Einstieg am ${dateText(data.access.contentFrom)}.`}</p>
                {data.access.plan === 'annual' && <p className="mt-2">Dein Jahreszugang endet automatisch. Es gibt keine automatische erneute Abbuchung.</p>}
            </div> : !data.adminPreview && <div className="rounded-2xl bg-white p-6">
                <h2 className="font-serif text-2xl">Deine Erfahrungsgruppe ist noch nicht freigeschaltet.</h2>
                <p className="mt-3">88 € monatlich oder einmalig 888 € für zwölf Monate. Der Jahreszugang verlängert sich nicht automatisch.</p>
                <p className="mt-3">Die Online-Buchung wird eingerichtet. Wenn du bereits teilnimmst, schreib uns für die Zuordnung deines Zugangs.</p>
                <a className={`${buttonClass} mt-5`} href="mailto:info@spirit-healing.tr">Zugang klären</a>
            </div>}
            {(data.active || data.adminPreview) && <>
                {data.liveAvailable && <div className="rounded-2xl border border-[#b8d9d4] bg-white p-6">
                    <h2 className="font-serif text-2xl">Unser nächster Erfahrungsabend</h2>
                    <p className="mt-3">Sonntags um 19 Uhr, deutsche Zeit. Hier kommst du zu unserem gemeinsamen Zoom-Treffen.</p>
                    <a className={`${buttonClass} mt-4`} href={`${endpoint}/live`} target="_blank" rel="noopener noreferrer">Zum Live-Treffen</a>
                </div>}
                <div className="flex flex-wrap items-center gap-3">
                    <button className={buttonClass} onClick={() => setFilter('all')} aria-pressed={filter === 'all'}>Alle Treffen</button>
                    <button className={buttonClass} onClick={() => setFilter('handouts')} aria-pressed={filter === 'handouts'}>Handouts</button>
                    <label className="min-w-48 flex-1">Datum, Thema oder Handout suchen<input className={fieldClass} value={search} onChange={event => setSearch(event.target.value)} type="search" /></label>
                </div>
                {player && <article className="rounded-2xl bg-white p-5">
                    <div className="mb-4 flex items-center justify-between gap-3"><h2 className="font-serif text-2xl">{player.title}</h2><button onClick={() => setPlayer(null)}>Schließen</button></div>
                    <iframe className="aspect-video w-full rounded-xl" title={player.title} src={player.url} allow="fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
                </article>}
                <div className="grid gap-5 xl:grid-cols-2">{sessions.map(session => <article key={session.id} className="flex flex-col rounded-2xl border border-[#b8d9d4] bg-white p-6 shadow-sm">
                    <p className="text-sm text-[#547875]">{dateText(session.occurredAt)}</p>
                    {session.monthTopic && <p className="mt-4 border-l-2 border-[#d8bf74] pl-3 text-sm font-semibold text-[#356d68]">Monatsthema · {session.monthTopic}</p>}
                    <h2 className="mt-3 font-serif text-2xl leading-snug">{session.title}</h2>
                    {session.description && <p className="mt-3 whitespace-pre-line text-[0.95rem] leading-6 text-[#42625f]">{session.description}</p>}
                    <div className="mt-auto pt-5">
                    {session.recordingAvailable && <button disabled={busy} className={buttonClass} onClick={() => openVideo(session)}><PlayCircle className="h-5 w-5" />Aufzeichnung ansehen</button>}
                    <div className="mt-4 space-y-2">{session.handouts.map(handout => <a key={handout.id} className="flex min-h-11 items-center gap-2 font-semibold underline" href={handout.url}><Download className="h-4 w-4" />{handout.title}</a>)}</div>
                    {member.role === 'admin' && <button className="mt-4 block min-h-11 text-sm text-[#547875] underline underline-offset-4" onClick={() => setEditing(session)}>Treffen bearbeiten</button>}
                    </div>
                </article>)}</div>
                {!sessions.length && <p className="rounded-2xl bg-white p-6">Hier erscheinen deine freigegebenen Treffen und Handouts, sobald sie bereitstehen.</p>}
            </>}
        </>}
        {member.role === 'admin' && <details open={editing ? true : undefined} className="rounded-2xl border border-[#d8bf74] bg-white p-6">
            <summary className="cursor-pointer text-lg font-bold">Erfahrungsgruppe verwalten</summary>
            <p className="mt-4 text-sm">Zeitangaben in den Formularen beziehen sich auf die Zeitzone dieses Geräts. Speicherung erfolgt mit eindeutigem Zeitpunkt.</p>
            <form onSubmit={importMeetings} className="mt-6 space-y-4 border-t pt-6">
                <h3 className="text-xl font-bold">Vorhandene Treffen importieren</h3>
                <p>Das geprüfte Zoom-Importregister legt Treffen ausschließlich als Entwurf an. Es schaltet keine Mitglieder frei, veröffentlicht nichts und enthält keine Downloadlinks.</p>
                <label>Zoom-Importregister<input className={fieldClass} name="catalog" type="file" accept="application/json,.json" required /></label>
                <button disabled={busy} className={buttonClass}>Treffen als Entwürfe übernehmen</button>
            </form>
            <form key={editing?.id || 'new'} onSubmit={saveSession} className="mt-6 grid gap-4 border-t pt-6 sm:grid-cols-2">
                <h3 className="text-xl font-bold sm:col-span-2">Treffen anlegen oder bearbeiten</h3>
                <label>Nummer bei Bearbeitung<input className={fieldClass} name="id" type="number" min="1" defaultValue={editing?.id || ''} readOnly /></label>
                <label>Datum und Beginn des Treffens<input className={fieldClass} name="occurredAt" type="datetime-local" step="1" defaultValue={editing ? localInput(editing.occurredAt) : ''} required /></label>
                <label>Titel<input className={fieldClass} name="title" defaultValue={editing?.title || ''} required maxLength="180" /></label>
                <label>Status<select className={fieldClass} name="status" defaultValue={editing?.status || 'draft'}><option value="draft">Entwurf</option><option value="published">Veröffentlicht</option><option value="archived">Archiviert / nicht sichtbar</option></select></label>
                <label className="sm:col-span-2">Monatsthema<input className={fieldClass} name="monthTopic" maxLength="180" defaultValue={readExperienceDescription(editing?.summary).monthTopic} /></label>
                <label className="sm:col-span-2">Beschreibung<textarea className={fieldClass} name="summary" maxLength="3600" defaultValue={readExperienceDescription(editing?.summary).description} /><span className="mt-1 block text-sm text-[#547875]">Ein bis zwei kurze Sätze zum Thema dieses Abends.</span></label>
                <label>Vimeo-Video-ID<input className={fieldClass} name="vimeoId" inputMode="numeric" defaultValue={editing?.vimeoId || ''} /></label>
                <label>Vimeo-Hash bei nicht gelisteten Videos<input className={fieldClass} name="vimeoHash" defaultValue={editing?.vimeoHash || ''} /></label>
                <label className="sm:col-span-2"><input type="checkbox" name="reviewed" /> Inhalt und Freigabe für den vorgesehenen Teilnehmerkreis sind geprüft.</label>
                <button disabled={busy} className={buttonClass}>Treffen speichern</button>
                {editing && <button type="button" onClick={() => setEditing(null)}>Bearbeitung abbrechen</button>}
            </form>
            <form onSubmit={upload} className="mt-8 grid gap-4 border-t pt-6 sm:grid-cols-2">
                <h3 className="text-xl font-bold sm:col-span-2">Handout zum Treffen</h3>
                <label>Treffen<select className={fieldClass} name="sessionId" required><option value="">Bitte wählen</option>{(data?.sessions || []).map(session => <option key={session.id} value={session.id}>{dateText(session.occurredAt)} · {session.title}</option>)}</select></label>
                <label>Titel<input className={fieldClass} name="title" maxLength="180" required /></label>
                <label>PDF bis 8 MB<input className={fieldClass} name="file" type="file" accept="application/pdf" required /></label>
                <button disabled={busy} className={buttonClass}>Handout geschützt speichern</button>
            </form>
            <section className="mt-8 border-t pt-6">
                <h3 className="text-xl font-bold">Verlängerungserinnerungen</h3>
                <button className={`${buttonClass} mt-4`} disabled={busy} onClick={() => action(async () => setReminderInfo(await request('/api/admin/experience/reminders')))}>Versandstatus prüfen</button>
                {reminderInfo && <div className="mt-4 space-y-2">
                    <p>{reminderInfo.sendingEnabled ? 'Automatischer Erinnerungsversand ist eingeschaltet.' : 'Automatischer Erinnerungsversand ist ausgeschaltet.'}</p>
                    <p>{reminderInfo.reminders.length} Erinnerungen heute fällig.</p>
                    {reminderInfo.jobs.map(job => <p key={job.id}>Mitglied Nr. {job.member_id} · {job.days_before} Tage vorher · {({ sent: 'an Mailserver übergeben', uncertain: 'Versand unklar, bitte prüfen', failed: 'fehlgeschlagen, bitte prüfen', skipped: 'entfallen', pending: 'vorgemerkt', sending: 'wird versendet' })[job.status] || job.status}</p>)}
                </div>}
            </section>
            <form onSubmit={grant} className="mt-8 grid gap-4 border-t pt-6 sm:grid-cols-2">
                <h3 className="text-xl font-bold sm:col-span-2">Bestehendes Mitglied zuordnen</h3>
                <label>E-Mail des aktivierten Kontos<input className={fieldClass} name="email" type="email" required /></label>
                <label>Zugangsart<select className={fieldClass} name="plan"><option value="existing">Bestehende Vereinbarung</option><option value="monthly">Monatlich · 88 €</option><option value="annual">Zwölf Monate · einmalig 888 €</option></select></label>
                <label>Zugang ab<input className={fieldClass} name="startsAt" type="datetime-local" required /></label>
                <label>Zugangsende (bei bestehender Vereinbarung vorerst leer möglich)<input className={fieldClass} name="endsAt" type="datetime-local" /></label>
                <label>Inhalte ab (leer: Zugangsbeginn)<input className={fieldClass} name="contentFrom" type="datetime-local" /></label>
                <label>Status<select className={fieldClass} name="status"><option value="active">Aktiv</option><option value="revoked">Gesperrt</option></select></label>
                <label className="sm:col-span-2"><input name="fullArchive" type="checkbox" /> Bestandsmitglied: gesamtes freigegebenes Archiv</label>
                <label className="sm:col-span-2">Grund / geprüfter Zahlungszeitraum<input className={fieldClass} name="reason" maxLength="500" required /></label>
                <button disabled={busy} className={buttonClass}>Zugangsregel speichern</button>
            </form>
        </details>}
    </section>;
}
