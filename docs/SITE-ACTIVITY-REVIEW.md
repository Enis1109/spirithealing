# Erweiterte freiwillige Website-Auswertung – lokale Prüffassung

Stand 1. November 2026. Noch kein vollzogener Livegang. Nach Paketlieferung liegt die ausdrückliche Nutzeranweisung „Schalte alles live“ vor; sie deckt den beschriebenen Daten-/Fristen-/Textumfang ab. Technischer Vollzug und Restgrenzen stehen in RELEASE-20261101.md. Basis ist `Enis1109/spirithealing` main `51661b0a552873f30fd960b8251bd900099839a1`, isolierte Kopie `engagement`. Kontaktpatch v3 und Messpaket v3 wurden darauf angewendet; fremde Arbeitskopien wurden nicht bearbeitet. Das abgenommene Messpaket v3 (`libfile_4c7e5247c98081918440f1575b550937`, Version 3, SHA256 `67ec326c7f4fb62792e9378d26296be3b4453843634e7273d35fce80cc7c057d`) bleibt separat und unverändert. Diese Erweiterung braucht eine eigene Abnahme.

## Was wird gezählt?

| Kennzahl | Präzise Definition | Grenze |
|---|---|---|
| Landing-Ankunft | `landing_view` je consentiertem RAM-Ablauf einmal, nach Server-Grant; Zuordnung zum neutralen Einstieg `context.entry` und registrierten `sc`-Code | Kein vollständiger Besucherzähler. Wer vorher ablehnt, ist nicht enthalten. Klick ist keine Ankunft; kein rückwirkender Nachweis. |
| Anfrage-Funnel | Einstieg, Angebotsansicht, Anfrageklick, Formularstart, Validierungs-/Technikfehler, serverbestätigte Speicherung; binäre Flags pro Ablauf | Direkte Einstiege überspringen Stufen. Keine vollständige zeitliche Reihenfolge. |
| Aktive Seitensekunden | Monotone Browserzeit, 1-Sekunden-Sampling; nur sichtbarer UND fokussierter Tab, bis 30 Sekunden nach Seitenbeginn/Fokus oder letzter Pointer-, Tastatur-, Touch- oder Wheelinteraktion; programmgesteuertes Scrollen verlängert die Frist nicht | Keine Aufmerksamkeitserkennung. Kein Mitschnitt der Eingabe. Lange Timerlücken werden auf höchstens eine Sekunde begrenzt; bewusst mögliche Unterzählung. |
| Zeitverteilung | Admin zeigt je neutraler Seite/kurzem Ablauf die Bereiche 0, 1–9, 10–29, 30–119, 120–1800 aktive Sekunden | Keine aus Timeout oder Aufenthaltsdeadline errechnete Durchschnittsdauer. Serverseitig begrenzte kumulative ganze Sekunden, keine Eingabezeitreihe. |
| Scrollstufe | Höchster sichtbarer Seitenfortschritt `(scrollY + viewportHeight) / documentHeight` nach Scrollinteraktion, gespeichert nur als 0/25/50/75/90 | Kein roher Scrollwert oder Koordinatenprotokoll; lange Seiten, Layoutänderungen und fehlende Interaktion begrenzen Vergleichbarkeit. |
| Seitenbesuche | Kumulative Besuche je erlaubter Seitenklasse innerhalb eines Ablaufs; Admin nur single/repeated im gemeinsamen Zeit-/Scrollbereich | Maximal 64 Besuche. Danach Status `limit`; keine weitere Aktivität bis zu neuem Ablauf. |
| Seitenwechsel | Abläufe mit einem neutralen gerichteten Paar (z.B. `p_offer>p_contact`), nicht alle Einzelklicks | Server speichert nur kumulative Paarzähler, keine sortierte Ereignis-/URL-Historie. Back/Forward kann denselben Paarzähler erhöhen. |
| Letzte Beobachtung | Letzte erlaubte Seite eines offenen/abgelaufenen Ablaufs; `pagehide`, `excluded`, `limit`, `expired_last_observation`, `ongoing`, `unknown` getrennt | **Keine garantierte tatsächliche Ausstiegsseite oder Bounce-Rate.** pagehide umfasst auch Reload/Navigation; abgebrochene Übermittlung kann die letzte Seite verlieren. `excluded` verrät das ausgeschlossene Ziel nicht. |
| Anfrageabschlussquote | Dieselben Abläufe mit Start UND servergespeicherter Anfrage / Abläufe mit Formularstart, gleiche UTC-Tag-/Code-Gruppe | Nullnenner bleibt null. Keine Quote aus Plattformklicks oder allen Menschen. |
| Buchung | Weiterhin `not_instrumented` | Anfrage, CTA, „done“, Payment-Link-Klick oder bloße Teilnahme sind keine bestätigte persönliche Buchung. |

Ablaufkennung nur im RAM, höchstens 30 Minuten. Reload und BFCache-Wiederkehr beginnen einen neuen Ablauf. Mehrere Tabs haben getrennte Abläufe; Fokus/Sichtbarkeit verhindern normale gleichzeitige Aktivzeit in Hintergrundtabs. Dies sind pseudonyme Abläufe, **keine eindeutigen Personen, Geräteprofile oder vollständigen Journeys**. Ereignisausfälle werden nicht rückwirkend erfunden. Kumulative Snapshots alle 15 Sekunden sowie bei Wechsel/Sichtbarkeitsänderung/pagehide; alte oder doppelte Revisionen überschreiben keine neueren Werte. Clientwerte sind keine betrugssicheren oder kausalen Werbewirkungsnachweise.

## Erlaubte Zielseiten und künftige Linkcodes

Nur `/` = `p_home`, `/prices` = `p_offer`, `/termin-buchen` = `p_booking` (Terminübersicht, kein Buchungsabschluss), `/kontakt` = `p_contact`. Andere, insbesondere thematische/geschützte Seiten, werden nicht als Zielklasse erfasst. Roh-URLs, Querystrings, Referrer, Namen, E-Mail, Nachrichten, Behandlungsthemen, Plattform-ClickIDs, Gerätekennwerte und Eingabefolgen kommen nicht in diese Messung.

Die folgenden **reservierten** Slots sind noch keinem echten Post zugeordnet; vor Einsatz ist die konkrete Zuordnung zu dokumentieren. c01/p01 sind neutrale reservierte Kampagnen-/Contentslots, keine Behauptung realer Herkunft. Neue Posts benötigen eigene feste, geprüfte Registryslots; Codes nicht nachträglich für andere Posts wiederverwenden.

| Plattform | Startseite | Preise | Terminübersicht | Kontakt |
|---|---|---|---|---|
| Instagram | i01h | i01o | i01b | i01c |
| Facebook | f01h | f01o | f01b | f01c |
| YouTube | y01h | y01o | y01b | y01c |
| TikTok | t01h | t01o | t01b | t01c |

Beispiel für einen künftig freigegebenen Instagram-Post zur Preisübersicht: `https://www.spirit-healing.tr/prices?sc=i01o`. Ein Code am falschen Ziel wird nicht zugeordnet; ein gültiger neutraler Besuch kann als unassigned zählen. Doppelte `sc`-Parameter werden nicht zugeordnet. s01–s04 bleiben nur alte reservierte, nicht zielgebundene Slots. Bestehende Posts/Links wurden nicht verändert. Keine beliebigen externen UTM-Texte übernehmen. Plattformberichte mit Impressions, Klicks, Videowiedergabe-/Betrachtungsdauer separat führen: Diese Kennzahlen stammen aus anderen Grundgesamtheiten und sind kein Website-Tracking.

## Einwilligung, Widerruf und Speicherung

- Neue Vertragsversion `site-first-party-2026-11-01-v2`; eine frühere v3-Zustimmung berechtigt nicht zur Erweiterung. Ihr alter Receipt wird gestoppt als offener Widerruf weitergeführt, bis Serverack. Neue Erfassung erst nach ausdrücklich neuem Grant.
- DE-/TR-Entwürfe: `shared/siteMeasurementCopy.js`; dieselben Texte in Einstellungen und Datenschutzabschnitt, ohne automatische Übersetzung. Sprachschalter wird dadurch nicht freigeschaltet. Inhaltliche Zustimmung zum gelieferten DE-/TR-Entwurf ist nach übermittelter Dokumentenprüfung durch den Liveauftrag erteilt; keine allgemeine Rechtsfreigabe behauptet.
- Vor Grant, bei Ablehnung, Widerruf, Browser-GPC/DNT, fehlendem gemeinsamen Speicher/Web Locks oder fehlender Konfiguration keine Messrequests. Formulare funktionieren unabhängig.
- Browser: nur Entscheidung, Version, Zeit und zufälliger Receipt persistent. RAM: kurzer Flow, neutrale Codes, begrenzte kumulative Seitensummen. Keine Formulardaten darin. Offene Widerrufe bleiben unabhängig von Clientalter/Uhr auch nach Reload, Online, SPA und StorageEvents bis Serverack erhalten.
- Server: getrennte Consent-/Sperrbelege (Receipt-Hash, Version, Realm, Zeit/Expiry/Widerruf) bis zu ihrem 30-Tage-Ablauf; bei unbekanntem Receipt 30 Tage ab Widerruf. Stündliche Bereinigung nach Fristablauf. Nutzungsdaten dagegen nur 7 Tage.
- Server-Nutzungsdaten: zweckgebundene Receipt-/Flow-Hashes, erlaubte Codes, Stufenflags und zusätzliche JSON-Snapshots mit maximal vier Seiten und zwölf neutralen Wechselpaaren. Maximal 1800 Sekunden/64 Besuche/10000 Revisionen je Flow; strikte Felder-/Werteprüfung. Kontextalter und aktive Summe serverseitig begrenzt. Kein Snapshot-Eventlog.
- Ablaufdaten maximal 7 Tage in der Auswertung, physische Bereinigung beim Start und stündlich; bei regulärem Betrieb im nächsten Intervall. Consent 30 Tage; Revoke-Tombstone verhindert Replay. Cleanup muss operativ überwacht werden; keine Alarmierung installiert.
- Revoke löscht Stufen UND Aktivität unter Receipt-Lock, bestätigt tatsächliche Abwesenheit und Tombstone. Jede Tabelle wird unabhängig auf Existenz geprüft. Fehlt die Granttabelle, kann Datenlöschung ohne dauerhaften Tombstone keinen Erfolg bestätigen. Kernanfrage und Mail bleiben getrennt.
- Zeitliche Freigabe: nur vollständige, noch vollständig im 7-Tage-Fenster liegende UTC-Tage, frühestens am Folgetag um 00:30. Auch ein Widerruf vor der ersten Veröffentlichung kann die gesamte Tages-/Codegruppe vorsorglich sperren; das ist keine Null-Nachfrage. Ein persistentes Freigabeprotokoll speichert pro Tag/Code nur Prüfsumme, Blockstatus und Frist (ohne Receipt/Flow), maximal 8 Tage ab UTC-Kohortbeginn. Wiederholte Antworten dürfen nur dieselben numerischen Werte freigeben. Eine geänderte oder widerrufene Gruppe wird vollständig und dauerhaft für diesen Tag/Code zurückgezogen; es werden keine aktualisierten Einzelzähler veröffentlicht. Bei Verlust des Freigabeprotokolls über bestehenden neuen Vertragsdaten schlägt Initialisierung geschlossen fehl. Die Historie während laufender Fristen niemals löschen/zurücksetzen oder neu erzeugen. Kein bloßes Caching, kein aktueller Tageszähler und keine überlappenden alternativen Filter.
- Admin: bestehende Rolle, no-store, Tages-/Code-Aggregate. Nur freigegebene Funnelgruppen. Ganze Aktivitätsgruppen werden unterdrückt, wenn eine positive gemeinsame Zeit-/Scroll-/Wiederbesuchszelle, Landing-, Präsenz-, Wechsel-, Endstatuszelle oder deren Restgruppe unter fünf liegt. Keine Rohflowansicht. Dies ist keine Behauptung rechtlicher Anonymität oder Schutz gegen beliebiges externes Zusatzwissen. Maximal 5000 berücksichtigte Flowzeilen; darüber unavailable, keine unvollständigen Summen.
- Hosting-Access-/Proxy-/Fehlerlogs sind gesondert vor Live zu prüfen; dieser Patch garantiert deren Datenumfang/Fristen nicht. Keine neuen Meta/Google/TikTok-Pixel, Session-Replays, Fingerprinting oder externen Ziele.

## Buchungsanschluss: bewusste offene Lücke

Kontaktanfragen haben nur new/in_progress/done. Diese Zustände sind keine bestätigte persönliche Terminbuchung. Vorhandene Stripe-/Barbuchungen betreffen andere Veranstaltungen mit anderen Daten- und Einwilligungszwecken; es besteht keine verifizierte consentierte Zuordnung zur persönlichen Anfrage. Sie werden weder per E-Mail-Abgleich noch mittels sensibler Angebotsnamen verbunden.

`server/bookingMeasurementHandoff.js` ist ausschließlich eine **nicht angeschlossene Preflight-Schnittstelle**, ohne Route, Speicherung oder Buchungszähler. Sie akzeptiert nur serververifizierte, nicht stornierte Bestätigung aus einem künftigen persönlichen Terminregister, aktiven Consent und gültigen kurzen Messkontext; Referenz wird nur als zweckgebundener Hash weitergegeben. Das erzeugt noch keine Buchung. Tests weisen Klick/done, fehlende Bestätigung/Consent und abgelaufene Kontexte zurück.

Vor echtem Anschluss konkret festlegen: autoritatives persönliches Terminregister und bestätigter Status, erlaubte Attribution zum Consent, serverseitig gespeicherter Zusammenhang ohne Formtexte im Messweg, dauerhafte Idempotenz/Transaktion, Storno-/Korrektursemantik, zulässiges Attributionsfenster und Löschung. Der derzeitige 30-Minuten-Kontext darf nicht heimlich auf Tage ausgedehnt werden. Bis dahin bleibt Buchungsquote unverfügbar, nicht null.

## Migration, Abschaltung und Rücknahme

Das Gesamtpatch enthält den noch nicht live veröffentlichten Kontaktpatch (additive Kontaktspalten), zwei ursprüngliche Messtabellen und **zwei neue** Tabellen `site_measurement_activity` und `site_measurement_releases`. Neue SQL-Datei `database/migrations/20261101-site-activity.sql`, idempotenter Initializer im Server. Keine Veränderung von Kunden-, Buchungs- oder Zahlungsdatensätzen und kein DROP im Migrationsweg. JSON erfordert passende MySQL-Version; echte SQL-Prüfung ist ein eigener Freigabepunkt, kein Ergebnis aus SQL-Doubles.

Erst exakte getrennte Staging-Node-App/URL, isolierte DB, Fake-/gesperrte Mail, TLS, Cookies, Proxylogs und Runtime festhalten. Dann gezielte Staging-Bereitstellungs- und Migrationsfreigabe; Front-/Backend als dieselbe Version mit passendem `staging`-Environment. Flags `SITE_MEASUREMENT_ENABLED` und `VITE_SITE_MEASUREMENT_ENABLED` bleiben bis dahin false. `LEGACY_FUNNEL_ENABLED` und `VITE_LEGACY_FUNNEL_ENABLED` bleiben false. Keine parallele Alt-UTM-Erfassung.

Rücknahme zuerst durch beide Erfassungsschalter aus, Environment für Hashrealm unverändert beibehalten. Neue Revoke-/Cleanup-Funktionen weiterbetreiben, damit verbliebene Daten/Receipts abgearbeitet werden. **Nicht einfach den alten v3-Code zurückrollen, solange Aktivitätsdaten vorhanden sind**, denn er kennt deren Löschung nicht. Erst nach überprüfter Lösch-/Fristwahrung Code gezielt zurücknehmen; additive Tabellen können leer bestehen bleiben. Keine automatischen Tabellenlöschungen, Kunden-/Registrierungsdaten oder fremden main-Änderungen zurücksetzen.

Hostinger-Befund aus späterer read-only Prüfung: GitHub main deployt automatisch; Merge wäre bereits Veröffentlichung. Node 22.x/Express, `npm install` → `postinstall: vite build` → gemeinsamer Front-/Backend-Stand. Alter Touch-ID-Blocker ist nicht aktuell. Getrenntes Staging/DB-/Mail-Isolation noch nicht verifiziert. Lokale Tools nutzen vorhandenes Node 24; Node-22-Abnahme vor Hostingfreigabe gesondert sichern.

Zusätzlicher Freigabebefund vom Parent: verifizierte Hostinger-Mail 1.11. 13:32 UTC, 338 Pakete, 28 Schwachstellen (1 kritisch, 6 hoch, 20 mittel, 1 niedrig); keine Paket-/CVE-/Deploymentdetails oder Kompromittierungsbelege. Detailprüfung und gezielte Bewertung vor Produktion offen. Keine pauschalen Updates durchgeführt.

## Konkret beschriebener Bereitstellungsumfang (inhaltlicher Liveauftrag liegt vor)

„Ich gebe ausschließlich [exakte Staging-URL/Node-App], [isolierte DB] und den geprüften Stand [Paket-ID/Version/SHA256] für synthetische Abnahme frei. Mail [konkrete Sperre/Fake-Ziel], keine Produktionsverbindung. Daten: sechs Funnelstufen sowie beschriebene aktive Seitensummen, Scrollstufen, neutrale Wechsel und letzte Beobachtung, nur nach neuer freiwilliger DE-/TR-Einwilligung. Browser-/Serverdaten, 30-Minuten-/7-/30-Tage-Fristen sowie maximal 8 Tage Freigabeprüfsummen und offene Widerrufsbelege gemäß Vertrag. Postmapping [konkrete freigegebene Liste]. Buchung bleibt unsupported. Keine Plattformübermittlung.“

Die ausdrücklich erteilte Liveanweisung gilt für diesen konkreten Produktionsumfang. Der isolierte lokale Real-DB-/App-/Browserweg liefert technische Abnahme ohne behauptetes separates Hosting-Staging. Vor Vollzug sind Hash, additive Migrationen, Zielkonfiguration und dokumentierte Sicherheits-/Zugangsgrenzen abzugleichen. Die frühere reine Vorbereitungsfreigabe wurde durch den ausdrücklichen Liveauftrag ersetzt; diese Quelle verlangt keine erneute pauschale Zustimmung. Auswertungen werden nur nach der beschriebenen abgeschlossenen UTC-Tagesfreigabe veröffentlicht, nicht als laufende Live-Zähler.

## Prüfstatus

Der endgültige ausführbare Prüfstatus steht im separaten Reviewbericht und in evidence/. Zwischenstände oder synthetische Beispiele sind keine Produktionswerte. Besonders unterscheiden: Unit-/HTTP-Doubles, tatsächlicher lokaler Browser, echte lokale MySQL-Integration und Hosting-Staging. Abgenommenes v3 nicht mit dieser neuen Fassung verwechseln.
