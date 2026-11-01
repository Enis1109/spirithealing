import { useEffect, useState } from 'react';
export function AdminSiteMeasurement() {
    const [data, setData] = useState(null), [error, setError] = useState(false);
    useEffect(() => {
        let alive = true;
        fetch('/api/admin/site-measurement', { credentials: 'same-origin', cache: 'no-store', referrerPolicy: 'no-referrer' })
            .then(async r => { if (!r.ok) throw new Error(); return r.json(); })
            .then(value => { if (alive && value.ok) setData(value); else if (alive) setError(true); })
            .catch(() => { if (alive) setError(true); });
        return () => { alive = false; };
    }, []);
    return <section className="space-y-5 rounded-3xl bg-[#fffaf2] p-5 text-[#173f40] sm:p-8">
        <h1 className="text-3xl font-bold">Website-Kontrollpunkte</h1>
        <p>Freiwillig gemessene Abläufe auf Startseite, Preisübersicht, Terminübersicht und Kontaktseite. Keine vollständige Besucherzählung oder individuelle Journey. Eine Stufe zählt pro Ablauf höchstens einmal; Fehlerarten getrennt. Direkte Einstiege können frühere Stufen überspringen.</p>
        <p>Erfolgreiche Anfragen werden ausschließlich nach serverseitiger Speicherung gezählt. Buchungen: noch nicht instrumentiert. „Erledigt“ im Anfrageeingang bestätigt keine Buchung.</p>
        <p>Auswertung nach UTC-Eingangstag und neutralem Linkcode, letzte 7 Tage. Zahlen werden frühestens am UTC-Folgetag um 00:30 freigegeben. Pro Tages-/Code-Gruppe bleiben veröffentlichte Zahlen unverändert; bei späterer Datenänderung oder Widerruf wird die ganze Gruppe zurückgezogen. Ein Ablauf dauert höchstens 30 Minuten und bleibt im Browser nur im Arbeitsspeicher; Neuladen erzeugt einen neuen Ablauf. Widerruf oder Ablauf entfernen zugehörige Messdaten. Kleine Gruppen und innerhalb einer Antwort ableitbare kleine Restgruppen unter 5 werden vollständig ausgeblendet. Zeitliche Einzeländerungen werden durch die unveränderliche Tagesfreigabe und vollständige Gruppenrücknahme geschützt.</p>
        {error ? <p role="alert">Auswertung derzeit nicht verfügbar. Die Anfragebearbeitung bleibt unabhängig.</p>
            : !data ? <p role="status">Status wird geladen …</p> : !data.enabled ? <p role="status">Neue Website-Auswertung ist serverseitig nicht aktiviert.</p>
                : !data.rows?.length ? <p role="status">Keine ausreichend großen freigegebenen Gruppen im Zeitraum. Daraus lässt sich keine Null-Nachfrage ableiten.</p>
                    : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><caption className="py-3 text-left">Consentierte Abläufe; keine eindeutigen Menschen. Quote nur Formularstarts mit gespeicherter Anfrage aus derselben Gruppe.</caption>
                        <thead><tr>{['UTC-Tag / Linkcode','Einstieg','Angebot','Anfrageklick','Formularstart','Fehler','Gespeichert','Start → gespeichert'].map(text => <th className="p-3" key={text}>{text}</th>)}</tr></thead>
                        <tbody>{data.rows.map(row => <tr className="border-t" key={row.day+':'+row.code}><th className="p-3 font-normal">{row.day} · {row.code || 'nicht zugeordnet'}<br/>{row.source}</th>
                            {[row.landingViews,row.offerViews,row.ctaClicks,row.inquiryStarts,row.formErrors,row.inquirySuccesses].map((n,i) => <td className="p-3" key={i}>{n}</td>)}
                            <td className="p-3">{row.startToSavedRate === null ? '—' : (row.startToSavedRate*100).toLocaleString('de-DE',{maximumFractionDigits:1})+' %'}<br/>{row.startedAndSaved} / {row.inquiryStarts}</td></tr>)}</tbody></table></div>}
        {data?.enabled && <section className="space-y-4"><h2 className="text-xl font-bold">Zielseiten, aktive Zeit und letzte Beobachtung</h2>
            <p>Aktive Zeit: sichtbarer, fokussierter Tab, höchstens 30 Sekunden seit letzter Eingabe; grobe Zeitbereiche je Seite und Ablauf. Scroll: 0 / 25 / 50 / 75 / 90 Prozent sichtbarer Seitenfortschritt. Seitenwechsel zählen Abläufe mit dem jeweiligen neutralen Wechsel, keine Klicksumme. Wiederholte Besuche erscheinen als „repeated“. p_home = Startseite; p_offer = Preise; p_booking = Terminübersicht; p_contact = Kontakt.</p>
            <p>„pagehide“ kann Schließen, Neuladen oder Navigation bedeuten. „expired_last_observation“ ist die letzte beobachtete Seite eines abgelaufenen Messablaufs, kein sicherer tatsächlicher Ausstieg. „excluded“ nennt keine ausgeschlossene Zielseite. „unknown“ bedeutet fehlende Übermittlung; „ongoing“ einen noch offenen Ablauf. Reload startet einen neuen Ablauf. Keine Durchschnittsdauer aus Timeoutwerten.</p>
            {data.activityStatus==='capacity_unavailable'?<p role="status">Aktivitätsauswertung wegen Auswertungsgrenze unverfügbar; keine Teilsummen.</p>:!data.activity?.length?<p role="status">Keine freigegebene Aktivitätsgruppe. Kleine Gruppen und ableitbare Restgruppen werden unterdrückt; fehlende Daten sind keine Null-Besuche.</p>:data.activity.map(group=><article key={group.day+':'+group.code} className="border-t pt-4 space-y-3">
                <h3>{group.day} · {group.code||'nicht zugeordnet'}</h3>
                <p>Gemessene Landing-Ankunft je Zielseite (nach Einwilligung, je Ablauf): {group.landings.map(x=>`${x.page}: ${x.flows}`).join(' · ')||'unverfügbar'}</p>
                <div className="overflow-x-auto"><table className="w-full text-left text-sm"><caption>Grobe aktive Zeit × Scrollstufe × Wiederbesuch; Anzahl gemessener Abläufe</caption><thead><tr>{['Seite','aktive Sekunden','Scrollstufe','Besuche','Abläufe'].map(x=><th key={x} className="p-2">{x}</th>)}</tr></thead><tbody>{group.durationScroll.map(x=><tr key={[x.page,x.seconds,x.scroll,x.visits].join(':')}>{[x.page,x.seconds,x.scroll+' %',x.visits,x.flows].map((v,i)=><td key={i} className="p-2">{v}</td>)}</tr>)}</tbody></table></div>
                <p>Neutrale Seitenwechsel: {group.transitions.map(x=>`${x.pair}: ${x.flows} Abläufe`).join(' · ')||'keine freigegebene Zelle'}</p>
                <p>Letzte Beobachtung / Status: {group.endpoints.map(x=>`${x.endpoint}: ${x.flows}`).join(' · ')}</p>
            </article>)}
        </section>}
        <p>Laufende Tage bleiben unveröffentlicht; laufende Abläufe, abgelehnte Einwilligungen und fehlgeschlagene Übermittlungen begrenzen die Abdeckung. Ein reservierter Linkcode benötigt vor Einsatz eine dokumentierte Postzuordnung und kennzeichnet danach nur den verwendeten Link; er beweist keine tatsächliche Herkunft oder Werbewirkung.</p>
        <p>Social-Reichweite, Ausgaben und Linkklicks stammen aus den Plattformberichten und gehören zu anderen Grundgesamtheiten. Keine automatische Werbeplattform-Übermittlung, keine rückwirkende Zuordnung und keine Zusammenrechnung mit dem älteren Mitglieder-Funnel.</p>
    </section>;
}
