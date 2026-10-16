import { liveAttributionEvent, liveAttributionSources } from "../../shared/liveAttribution.js";

export const LiveAttributionReport = ({ data, registrationPath }) => {
    const report = data.attributionReport;
    if (!report || data.key !== liveAttributionEvent) return null;
    return <section aria-labelledby="live-source-report" className="mt-8 rounded-2xl bg-white p-7">
        <h2 id="live-source-report" className="font-serif text-2xl">Anmeldungen und Herkunft</h2>
        <p className="mt-4">{report.active} aktive Anmeldungen · {report.cancelled} abgesagt · {report.total} insgesamt</p>
        <p className="mt-2">{report.attributed} aktive Anmeldungen mit freiwilliger Quellenzuordnung.</p>
        <p className="mt-3 text-sm leading-6">Jede Anmeldung zählt einmal, unabhängig von der Anzahl ihrer E-Mails. Frühere Anmeldungen, unbekannte Links, fehlende Einwilligungen und widerrufene Zuordnungen bleiben „Nicht zugeordnet“. Die Kennung zeigt den benutzten Link, nicht sämtliche vorherigen Kontakte. Sie ist kein Beweis für eine alleinige Werbewirkung.</p>
        <table className="mt-4 w-full text-left text-sm"><thead><tr><th className="py-2">Quelle</th><th className="py-2">Aktive Anmeldungen</th></tr></thead><tbody>
            {report.sources.map(row => <tr key={row.code} className="border-t"><td className="py-2">{row.label}</td><td className="py-2">{row.count}</td></tr>)}
        </tbody></table>
        <details className="mt-5"><summary className="cursor-pointer underline">Getrennte Einladungslinks</summary><p className="mt-3 text-sm">Nur für neue Einladungen. Bereits versandte E-Mails werden nicht nachträglich zugeordnet. Die Bezeichnungen dokumentieren Links, keine bereits gestarteten Anzeigen.</p><ul className="mt-3 space-y-3 text-sm">{Object.entries(liveAttributionSources).map(([code, label]) => <li key={code}><span>{label}: </span><a className="break-all underline" href={`${registrationPath}?sh_source=${code}`}>{`https://www.spirit-healing.tr${registrationPath}?sh_source=${code}`}</a></li>)}</ul></details>
    </section>;
};
