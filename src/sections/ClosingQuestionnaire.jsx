import { useEffect, useRef, useState } from 'react';
import { closingQuestions, closingSections, questionVisible, normalizeAnswer, normalizeClosingSubmission, displayAnswer } from '../../shared/closingQuestionnaire.js';
import './ClosingQuestionnaire.css';

const requestKey = 'spirit-healing-closing-request-v2';
function newRequestId() {
  try {
    const previous = sessionStorage.getItem(requestKey);
    if (previous && /^[0-9a-f-]{36}$/iu.test(previous)) return previous;
  } catch { /* A blocked storage setting does not prevent submission. */ }
  const value = crypto.randomUUID();
  try { sessionStorage.setItem(requestKey, value); } catch { /* Only the random request ID is retained. */ }
  return value;
}
function Question({ q, value, onChange, invalid }) {
  const choices = q.options || [];
  const toggle = selected => {
    const current = Array.isArray(value) ? value : [];
    if (current.includes(selected)) return onChange(current.filter(v => v !== selected));
    if (q.exclusive?.includes(selected)) return onChange([selected]);
    onChange([...current.filter(v => !q.exclusive?.includes(v)), selected]);
  };
  return <fieldset id={`closing-${q.key}`} tabIndex={-1} className={invalid ? 'closing-invalid' : ''}>
    <legend>{q.label}{q.required && <span aria-label="Pflichtfrage"> *</span>}</legend>
    {q.hint && <p className="closing-hint" id={`hint-${q.key}`}>{q.hint}</p>}
    {q.type === 'text' && <textarea aria-label={q.label} aria-describedby={q.hint ? `hint-${q.key}` : undefined} aria-invalid={invalid || undefined} maxLength={q.maxLength || 2000} rows={4} value={value || ''} onChange={e => onChange(e.target.value)}/>}
    {q.type === 'scale' && <>
      <div className="closing-scale">{Array.from({ length: 11 }, (_, n) => <label key={n}><input type="radio" name={q.key} value={n} checked={value === n} onChange={() => onChange(n)}/><span>{n}</span></label>)}</div>
      <div className="closing-endpoints"><span>0 = {q.burden ? 'gar nicht' : 'trifft gar nicht zu'}</span><span>10 = {q.burden ? 'sehr stark' : 'trifft vollständig zu'}</span></div>
    </>}
    {(q.type === 'single' || q.type === 'multi') && <div className="closing-choices">{choices.map(o => <label key={o.value}><input type={q.type === 'single' ? 'radio' : 'checkbox'} name={q.key} value={o.value} checked={q.type === 'single' ? value === o.value : Array.isArray(value) && value.includes(o.value)} onChange={() => q.type === 'single' ? onChange(o.value) : toggle(o.value)}/><span>{o.label}</span></label>)}</div>}
    {q.type === 'money' && <div className="closing-money"><input aria-label={q.label} type="number" inputMode="decimal" min="0" max="1000000" step="0.01" value={value ?? ''} onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))}/><span>Euro</span></div>}
    {q.type === 'matrix' && <div className="closing-elements">{q.rows.map(row => <label key={row.value}><span>{row.label}</span><select value={value?.[row.value] || ''} onChange={e => onChange({ ...(value || {}), [row.value]: e.target.value })}><option value="">Bitte wählen, falls du dazu etwas sagen möchtest</option>{choices.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></label>)}</div>}
  </fieldset>;
}

export function ClosingQuestionnaire({ preview = false }) {
  const [state, setState] = useState(preview ? 'ready' : 'loading');
  const [identity, setIdentity] = useState({ name: '', email: '', company: '' });
  const [answers, setAnswers] = useState({});
  const [consent, setConsent] = useState(false), [contact, setContact] = useState(false);
  const [requestId] = useState(newRequestId);
  const [page, setPage] = useState(0), [busy, setBusy] = useState(false);
  const [error, setError] = useState(''), [invalid, setInvalid] = useState('');
  const [reference, setReference] = useState('');
  const [confirmationFailed, setConfirmationFailed] = useState(false);
  const titleRef = useRef(null);
  const visible = closingQuestions.filter(q => questionVisible(q, answers));
  const section = closingSections[page];
  const questions = visible.filter(q => q.section === section?.key);
  const reviewing = page === closingSections.length;
  useEffect(() => {
    const oldTitle = document.title; document.title = 'Abschlussfragebogen · Spirit Healing';
    return () => { document.title = oldTitle; };
  }, []);
  useEffect(() => {
    if (preview) return;
    let alive = true;
    fetch('/api/zepter/closing', { credentials: 'same-origin', cache: 'no-store' }).then(r => {
      if (alive) setState(r.ok ? 'ready' : 'unavailable');
    }).catch(() => alive && setState('unavailable'));
    return () => { alive = false; };
  }, [preview]);
  useEffect(() => {
    const warn = event => {
      if (state === 'ready' && (identity.name || identity.email || Object.keys(answers).length)) {
        event.preventDefault(); event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [answers, identity, state]);
  const focus = key => requestAnimationFrame(() => document.getElementById(`closing-${key}`)?.focus());
  const fail = key => { setInvalid(key); setError('Bitte ergänze die markierte Angabe. Freiwillige Fragen kannst du offenlassen.'); focus(key); };
  const go = next => {
    if (busy) return;
    if (next > page) {
      if (page === 0) {
        if (!identity.name.trim()) return fail('name');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(identity.email.trim())) return fail('email');
      }
      for (const q of questions) { try { normalizeAnswer(q, answers[q.key]); } catch { return fail(q.key); } }
    }
    setError(''); setInvalid(''); setPage(next);
    requestAnimationFrame(() => { titleRef.current?.focus(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  };
  async function submit(event) {
    event.preventDefault();
    if (busy || !reviewing) return;
    let body;
    try { body = normalizeClosingSubmission({ ...identity, requestId, answers, privacyConsent: consent, contactRequested: contact }); }
    catch (e) {
      if (e.field === 'privacyConsent') { setError('Bitte bestätige die Verarbeitung deiner Antworten, bevor du sie absendest.'); setInvalid(e.field); focus(e.field); return; }
      const q = closingQuestions.find(q => q.key === e.field);
      setPage(q ? closingSections.findIndex(s => s.key === q.section) : 0); fail(e.field); return;
    }
    if (preview) { setError('Vorschau: Deine Eingaben werden nicht übermittelt oder gespeichert.'); return; }
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/zepter/closing', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...body, privacyConsent: true, company: identity.company }) });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        if (response.status === 429) throw new Error('limit');
        throw new Error('send');
      }
      setReference(data.reference); setConfirmationFailed(['failed', 'unknown'].includes(data.confirmationStatus));
      setState('sent'); setAnswers({}); setIdentity({ name: '', email: '', company: '' });
      try { sessionStorage.removeItem(requestKey); } catch { /* No form answers are stored in the browser. */ }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      setError(e.message === 'limit' ? 'Bitte warte einen Moment, bevor du die Übermittlung erneut versuchst. Deine Eingaben bleiben erhalten.' : 'Die Übermittlung konnte nicht bestätigt werden. Deine Eingaben bleiben hier erhalten. Bitte versuche es erneut. Ein bereits gespeicherter Bogen wird bei diesem erneuten Versuch nicht doppelt eingetragen.');
    } finally { setBusy(false); }
  }
  return <main className="closing-shell" data-no-translate>
    <div className="closing-card">
      <header className="closing-header"><img src="/Logo-tuerkis.jpeg" alt="Spirit Healing"/><p>DAS ZEPTER ÜBERNEHMEN</p><h1>Mein Weg nach acht Wochen</h1><p>Dein heutiger Stand und dein weiterer Weg</p></header>
      <div className="closing-body">
        {preview && <p className="closing-note">Vorschau für Selcan und Sabine. Hier findet keine Übermittlung statt.</p>}
        {state === 'loading' && <p role="status">Dein Fragebogen wird geladen …</p>}
        {state === 'unavailable' && <section><h2>Der Fragebogen ist gerade nicht erreichbar.</h2><p>Bitte öffne ihn später erneut oder schreibe uns an <a href="mailto:info@spirit-healing.tr">info@spirit-healing.tr</a>.</p></section>}
        {state === 'sent' && <section role="status"><h2>Deine Antworten sind bei uns angekommen.</h2><p>Danke, dass du deinen Weg mit uns teilst. Dein Fragebogen ist gespeichert und liegt Selcan und Sabine im geschützten Bereich vor.</p><p>Deine Eingangsreferenz: <strong>{reference}</strong></p>{confirmationFailed && <p>Die zusätzliche Bestätigung per E-Mail konnte noch nicht bestätigt werden. Dein Fragebogen ist trotzdem gespeichert.</p>}<p>Von Herzen<br/>Selcan und Sabine</p><a href="/mitglieder">Zum Mitgliederbereich</a></section>}
        {state === 'ready' && <>
          <p>Nimm dir etwa 15–20 Minuten Zeit. Deine Antworten helfen uns, deinen Weg vom Anfang bis heute auszuwerten und zu verstehen, was du als Nächstes brauchst. Kurze Antworten reichen. Fragen ohne Stern kannst du offenlassen.</p>
          <p>Du kannst zwischen den Seiten zurückgehen. Deine Angaben werden erst beim abschließenden Absenden an uns übermittelt. Lass diese Seite während des Ausfüllens geöffnet.</p>
          <nav className="closing-progress" aria-label="Fortschritt">{[...closingSections.map(s => s.title), 'Prüfen und absenden'].map((label, i) => <button type="button" key={label} aria-label={`Schritt ${i + 1}: ${label}`} title={label} disabled={i > page || busy} onClick={() => go(i)} aria-current={i === page ? 'step' : undefined}><span>{i + 1}</span><span>{label}</span></button>)}</nav>
          <form onSubmit={submit} noValidate>
            <h2 tabIndex={-1} ref={titleRef}>{reviewing ? 'Deine Antworten prüfen' : section.title}</h2>
            {!reviewing && <p>{section.intro}</p>}
            {page === 0 && <div className="closing-identity">
              <label id="closing-name" tabIndex={-1}>Dein vollständiger Name *<input autoComplete="name" maxLength={100} value={identity.name} onChange={e => setIdentity({ ...identity, name: e.target.value })} aria-invalid={invalid === 'name' || undefined}/></label>
              <label id="closing-email" tabIndex={-1}>Deine E-Mail-Adresse *<span className="closing-hint">Bitte verwende möglichst dieselbe Adresse wie im Startfragebogen, damit wir beide Bögen zuordnen können.</span><input type="email" autoComplete="email" maxLength={254} value={identity.email} onChange={e => setIdentity({ ...identity, email: e.target.value })} aria-invalid={invalid === 'email' || undefined}/></label>
              <div className="closing-honeypot" aria-hidden="true"><label>Firma<input tabIndex={-1} autoComplete="off" value={identity.company} onChange={e => setIdentity({ ...identity, company: e.target.value })}/></label></div>
            </div>}
            {!reviewing && questions.map(q => <Question key={q.key} q={q} value={answers[q.key]} invalid={invalid === q.key} onChange={value => { setAnswers(a => ({ ...a, [q.key]: value })); setInvalid(''); setError(''); }}/>) }
            {reviewing && <>
              <p>{identity.name} · {identity.email}</p>
              {closingSections.map((s, i) => <details key={s.key} className="closing-review"><summary>{s.title}</summary>{visible.filter(q => q.section === s.key).map(q => <div key={q.key}><h3>{q.label}</h3><p>{displayAnswer(q, answers[q.key])}</p></div>)}<button type="button" className="secondary" onClick={() => go(i)}>Diesen Abschnitt bearbeiten</button></details>)}
              <div className="closing-consents">
                <label id="closing-privacyConsent" tabIndex={-1}><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)}/><span>Ich willige ausdrücklich ein, dass Spirit Healing meine Antworten speichert und für die persönliche Auswertung und Begleitung sowie den Vergleich mit meinem Startfragebogen verarbeitet. Das umfasst auch Angaben zu meinem emotionalen Erleben oder meiner Gesundheit, soweit ich solche Angaben mache. Ich kann meine Einwilligung für die Zukunft widerrufen. <a href="/datenschutz" target="_blank" rel="noreferrer">Datenschutz</a> *</span></label>
                <label><input type="checkbox" checked={contact} onChange={e => setContact(e.target.checked)}/><span>Ich möchte, dass Selcan oder Sabine mich zu meinem genannten Begleitungswunsch kontaktieren. (Freiwillig.)</span></label>
              </div>
              <p className="closing-hint">Deine Antworten sind vertraulich. Das Absenden löst weder eine Buchung noch eine Zahlung oder Newsletteranmeldung aus.</p>
            </>}
            {error && <p className="closing-error" role="alert">{error}</p>}
            <div className="closing-actions">{page > 0 && <button type="button" className="secondary" disabled={busy} onClick={() => go(page - 1)}>Zurück</button>}{!reviewing ? <button key="next" type="button" onClick={() => go(page + 1)}>Weiter</button> : <button key="submit" type="submit" disabled={busy}>{preview ? 'Vorschau prüfen – ohne Übermittlung' : busy ? 'Wird übermittelt …' : 'Antworten an Selcan und Sabine senden'}</button>}</div>
          </form>
        </>}
        <footer>Spirit Healing · <a href="/impressum">Impressum</a> · <a href="/datenschutz">Datenschutz</a></footer>
      </div>
    </div>
  </main>;
}
