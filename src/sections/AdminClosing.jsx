import { useCallback, useEffect, useState } from 'react';
import { closingSections, closingQuestions, displayAnswer } from '../../shared/closingQuestionnaire.js';

export function AdminClosing({ requestJson }) {
  const [items, setItems] = useState(null), [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const refresh = useCallback(async () => {
    setError('');
    try { const data = await requestJson('/api/admin/closing'); setItems(data.submissions); }
    catch { setError('Die Abschlussbögen konnten nicht geladen werden. Bitte versuche es erneut.'); }
  }, [requestJson]);
  useEffect(() => { let alive = true; requestJson('/api/admin/closing').then(data => { if (alive) setItems(data.submissions); }).catch(() => { if (alive) setError('Die Abschlussbögen konnten nicht geladen werden.'); }); return () => { alive = false; }; }, [requestJson]);
  const shown = items?.filter(item => `${item.name} ${item.email} ${item.reference}`.toLocaleLowerCase('de').includes(search.toLocaleLowerCase('de')));
  const contactCount = items?.filter(i => i.contactRequested).length || 0;
  return <section className="space-y-5">
    <h2 className="text-2xl font-bold">Abschlussbögen · Das Zepter</h2>
    <p>{items?.length || 0} gespeicherte Bögen · {contactCount} mit Kontaktwunsch</p>
    <p>Selbsteinschätzungen im Vergleich zum Startfragebogen. Die Zuordnung über die angegebene E-Mail bitte personengenau prüfen. Fehlende oder mehrdeutige Startwerte bleiben offen. Mehrere Bögen derselben Person bleiben als getrennte Eingänge sichtbar.</p>
    <div className="flex flex-wrap gap-3"><button type="button" onClick={refresh} className="rounded-xl border px-4 py-2">Aktualisieren</button><a className="rounded-xl border px-4 py-2" href="/api/admin/closing/export">CSV herunterladen</a><a className="rounded-xl border px-4 py-2" href="/api/admin/closing/export?format=json">JSON herunterladen</a><a className="rounded-xl border px-4 py-2" href="/abschlussfragebogen" target="_blank" rel="noreferrer">Fragebogen öffnen</a></div>
    <label className="block">Nach Name, E-Mail oder Referenz suchen<input className="mt-2 w-full rounded-xl border p-3" value={search} onChange={e => setSearch(e.target.value)}/></label>
    {error && <p role="alert">{error}</p>}{!error && items === null && <p>Wird geladen …</p>}{shown?.length === 0 && <p>Keine passenden Abschlussbögen vorhanden.</p>}
    {shown?.map(item => <details key={item.reference} className="rounded-2xl bg-[#fffaf2] p-6">
      <summary className="cursor-pointer font-bold">{item.name} · {new Date(item.createdAt).toLocaleDateString('de-DE')} {item.contactRequested ? '· Kontakt gewünscht' : ''}</summary>
      <p className="my-3">{item.email} · {item.reference}<br/>Benachrichtigung: {item.notificationStatus} · Eingangsbestätigung: {item.confirmationStatus}<br/>Version: {item.version}</p>
      <p>Startfragebogen: {item.baselineStatus === 'matched' ? item.baseline.reference_code : item.baselineStatus === 'missing' ? 'nicht vorhanden' : 'mehrere vorhanden, Zuordnung offen'}. {item.identityVerified ? 'Absendung mit passendem angemeldeten Mitgliedskonto.' : 'Name und E-Mail wurden im Formular angegeben.'}</p>
      {item.baseline && <p className="my-3 whitespace-pre-wrap">Anliegen damals: {item.baseline.main_topic}<br/>Ziel damals: {item.baseline.goal_statement}</p>}
      <div className="overflow-x-auto"><table className="my-5 w-full text-sm"><caption className="mb-3 text-left">Beide Zeitpunkte beziehen sich jeweils auf die vorangegangenen 14 Tage. Bei den drei Belastungsfragen bedeutet ein niedrigerer Wert weniger Belastung. Es wird kein Gesamtscore gebildet.</caption><thead><tr><th className="p-2 text-left">Aussage</th><th>Beginn</th><th>Heute</th><th>Änderung</th></tr></thead><tbody>{item.comparison.map(row => <tr key={row.key} className="border-t"><td className="p-2">{row.label}{row.lowerIsLessBurden ? ' (Belastung)' : ''}</td><td className="text-center">{row.before ?? 'offen'}</td><td className="text-center">{row.now ?? 'offen'}</td><td className="text-center">{row.difference === null ? 'offen' : row.difference > 0 ? `+${row.difference}` : row.difference}</td></tr>)}</tbody></table></div>
      {closingSections.filter(s => s.key !== 'comparison').map(section => <section key={section.key} className="my-6"><h3 className="text-lg font-bold">{section.title}</h3>{closingQuestions.filter(q => q.section === section.key && Object.hasOwn(item.answers, q.key)).map(q => <div key={q.key} className="my-4"><h4 className="font-semibold">{q.label}</h4><p className="mt-1 whitespace-pre-wrap break-words">{displayAnswer(q, item.answers[q.key])}</p></div>)}</section>)}
    </details>)}
  </section>;
}
