> Historischer v3-Bericht. Die unabhängige lokale v3-Abnahme wurde laut übermitteltem Ergebnis am 29.10. um 13:12 bestätigt. Für die aktuelle Erweiterung, neue Vertragsversion und unveränderliche UTC-Tagesfreigabe gilt SITE-ACTIVITY-REVIEW.md. Das eingefrorene Originalpaket bleibt unverändert.

# Optionale Website-Kontrollpunkte – lokaler Review, 29.10.2026

## Nachprüfung: Browseruhr und ausdrücklicher Widerruf

V1-Randfall behoben: Ein Browserzeitsprung um 31 Tage darf einen ausdrücklichen Widerruf nicht als erledigt ausgeben. Die Widerrufs-Zusammenführung filtert bekannte Receipts nicht mehr nach lokaler Zeit; jeder benötigt Serverbestätigung. Fehlende Bestätigung hält Beleg und ursprüngliche Zeit und meldet keinen Erfolg. Rein lokale Ablaufbereinigung bleibt ein eigener Weg und ist keine Server-Löschbestätigung.

Regression zunächst am V1-Code fehlgeschlagen (keine Revoke-Anfrage), nach Korrektur bestanden. Client gegen originales Servermodul mit synthetischer Datenbank und unveränderter Serveruhr: tatsächlicher Grant/Flow, nur Client +31 Tage, bestätigtes Revoke entfernt Flow und setzt Tombstone; verweigerte Bestätigung erhält Receipt. Echter Frontend-/Headless-Browsercheck mit getrennten synthetischen API-Fixtures: nur Browseruhr +31 Tage, Revoke-Erfolg sowie HTTP503, sichtbarer Pending-Zustand und erfolgreiche Wiederholung bestanden. Kein echter Datenbank-/Hosting-Nachweis für diesen Browsercheck.

V2-Rerun: 363 Tests insgesamt, 359 bestanden, 0 Fehler, 4 MySQL-Tests übersprungen (Testdatenbank bereits entfernt). Frühere echte MySQL-/Vollapp-Nachweise des unveränderten Servercodes bleiben unter evidence/test.log und evidence/integration separat erhalten (damals 362/362). ESLint sowie default-off und lokal aktivierter Build bestanden, vorhandene Chunkgrößenwarnung. Default-off-Frontend separat erneut geprüft. Keine neue MySQL-Installation für den auf Clientcode begrenzten Fix. Neueste Belege tragen Präfix clock-skew-; keine Produktionsfreigabe.

Dieser Stand erweitert den unverändert eingefrorenen Kontaktanfragen-Review v3. Keine Veröffentlichung, Plattformfreigabe oder Rechtsfreigabe. Standardmäßig ausgeschaltet. Die neue Einwilligungs- und Datenschutzkopie ist ein deutscher Entwurf zur Abnahme; keine automatische Übersetzung rechtlicher Aussagen. Falls die Funktion auch auf Türkisch aktiviert werden soll, diese Texte zuvor passend prüfen/übersetzen und abnehmen.

## Heute bereits belegter Stand und Grenzen

- V3 bleibt separat erhalten: Library `libfile_9f5abb5e426c8191952046738aa6d622`, Version 3, SHA256 `a456590761370a8e383da354f9273085780ddbb7c1d5f0f0ab82fb427d03f3e2`.
- Neue Quellen liegen in einer getrennten lokalen Kopie. Kein Push, Merge, Deployment, echtes Formular oder echte Mail.
- Hostinger zeigte beim letzten lesenden Check die Loginseite; eine tatsächlich getrennte Hosting-Staging-Umgebung ist nicht verifiziert. Nicht erneut um Anmeldung bitten; erforderliche Schritte werden zentral gebündelt.
- Öffentlicher GET auf `/api/berlin/meta/status` meldete am 29.10. `enabled:true`. Das bestätigt nur den bestehenden Serverstatus, keine aktuellen Pixelübermittlungen, Kampagnenzahlen oder Einwilligungen. Der beobachtete Startseiten-Hauptbundle referenzierte die neue Messungs-API nicht. Lazy Bundles und tatsächliche Browserübermittlungen wurden damit nicht vollständig geprüft. Meta wird durch diesen Patch weder eingeschaltet noch erweitert.
- Mitglieder-Funnel im bisherigen Code: freie UTM-Felder/Referrer, Kennung bei Modulimport und gemischte Nenner. Neue Erfassung dort jetzt standardmäßig aus, keine Kennung/UTM-Erhebung ohne ausdrücklichen Legacy-Schalter. Bei aktiviertem neuen Messweg ist der alte Weg auch bei widersprüchlichen Legacy-Schaltern blockiert. Bestehende Datensätze werden nicht gelöscht oder neu klassifiziert. Alte Mitglieder-Gesamtzahlen werden nicht mehr durch fremde Landing-Nenner dividiert.
- Berlin-Messung und die separat freiwillige Live-Vortragsquellen-Zuordnung bleiben eigenständig. Ihre Einwilligungen aktivieren den neuen Weg nicht. Keine Zusammenrechnung oder rückwirkende Zuordnung.

## Messvertrag und Zählmodus

Es werden pseudonyme, freiwillig gemessene Abläufe mit binären Stufenflags erfasst, keine eindeutigen Menschen, keine vollständigen Journeys und keine reinen Ereignissummen. Jeder Ablauf erhält erst nach bestätigter Einwilligung eine zufällige In-Memory-UUID, maximal 30 Minuten. Neuladen, ein neuer Tab oder die Rückkehr von einer ausgeschlossenen Seite erzeugen einen neuen Ablauf. Technische Ablaufzeiten werden auf Minuten begrenzt, Auswertung auf UTC-Eingangstag. Netzwerkfehler können unterzählen; Messfehler blockieren die Anfrage nicht.

| Stufe | Auslöser / Beleg | Stand |
|---|---|---|
| `landing_view` | Erster erlaubter Seitenaufruf nach bestätigtem Grant; auch direkter Angebot-/Kontakteinstieg | Lokal implementiert/getestet; kein vollständiger Traffic-Nenner |
| `offer_view` | Erlaubte Angebotsübersicht `/prices` oder `/termin-buchen` | Lokal implementiert/getestet |
| `cta_click` | Tatsächlicher Klick auf einen internen Kontaktlink auf erlaubten Seiten | Lokal implementiert/getestet; keine Buchungsbehauptung |
| `inquiry_start` | Erstes Feld-Input oder tatsächlicher gültiger Formular-Submit; nicht bloß automatischer Fokus | Lokal implementiert/getestet |
| `form_error` | Native/Server-Validierung oder technischer Fehler; nur `validation`/`technical` | Pro Ablauf/Fehlerart höchstens einmal; keine Feldnamen oder Inhalte |
| `inquiry_success` | Ausschließlich Backend nach erfolgreichem INSERT oder inhaltsgleichem gespeichertem Replay | Lokal implementiert/getestet; Public Event-Endpoint weist diese Stufe ab |
| `booking_start` | Tatsächlich geöffneter autoritativer Buchungsprozess | Nicht instrumentiert, kein künstlicher Ersatz durch Klick |
| `booking_confirmed` | Autoritativ bestätigte Buchung aus operativem Ergebnis | Nicht instrumentiert/null; `done` im Eingang ist keine Buchung |

Ein Ablauf zählt pro Stufe höchstens einmal. Mehrere Anfragen im selben Ablauf erzeugen nicht mehrere Erfolgseinheiten. Fehlende vorherige Stufen werden nicht erfunden; direkte Einstiege und Autofill können Stufen überspringen. Der Server erhält für den Erfolgsmarker ausschließlich den Messkontext, keine Formularfelder, UUID der operativen Anfrage oder Datenbank-ID. Es gibt keinen persistierten Fremdschlüssel zwischen Messung und Anfrage.

Einzige Abschlussquote: **Anzahl Abläufe mit `inquiry_start` UND serverbestätigtem `inquiry_success` / Anzahl Abläufe mit `inquiry_start`**, innerhalb derselben UTC-Tages-/Linkcodegruppe. Bei Nenner 0: null. Keine Buchungsquote, keine Social-Reichweite als Nenner, keine Unique-Nutzer, keine ROAS-/Umsatzbehauptung. Frühere historische Kosten/Registrierungszahlen sind keine heutigen Messwerte.

## Erlaubte Daten

Ereignis-Envelope: `event_name`, `schema_version:1`, `environment` (`local|staging|production`), optional `error_class` (`validation|technical`) und `context`. Unbekannte Felder werden verworfen durch Ablehnung des gesamten Ereignisses. Der Kontext besteht exakt aus:

- `receipt`: zufälliger 64-Hex-Einwilligungsbeleg; nur für diesen eigenen Zweck; serverseitig gehasht;
- `flow`: UUID v4 des kurzlebigen Ablaufs; serverseitig zweckgebunden gehasht;
- `startedAt`: technische, minutenbasierte Ablaufzeit für begrenzte Gültigkeit und Replay-Abwehr;
- `entry`: ausschließlich `p_home|p_offer|p_contact`;
- `code`: null oder ein fester Registryeintrag.

Der Server prüft ein eigenes aufgezeichnetes aktives Grant statt einem behaupteten Client-Boolean zu vertrauen. Vor Zustimmung, nach Ablehnung, nach Widerruf, bei Browser-Datenschutzsignal GPC/DNT und bei gesperrtem Backend keine Ereignisse. Zustimmung zu Formularverarbeitung, Newsletter, Berlin oder einer Plattform ist kein Grant für diesen Weg.

Keine Namen, E-Mails, Telefonnummern, Nachrichten, Gesundheits-/Behandlungsthemen, Practitioner-/Angebotskennungen, Roh-URLs, Querystrings, Referrer, Seitentitel, ClickIDs, IP-Adressen oder User-Agents in den Messungstabellen. Keine Session-Replays, Gerätefingerprints, SDKs oder Meta-/Google-/TikTok-Übermittlungen. Fetch mit `credentials:omit` und `referrerPolicy:no-referrer`; Formulardaten bleiben ausschließlich im bestehenden operativen Kontaktweg. Infrastruktur verarbeitet weiterhin normale HTTP-Verbindungen: Access-/Proxy-Logs und etwaige Body-/Query-Protokollierung vor Aktivierung separat prüfen.

## Neutrale Linkregistry

Nur `?sc=s01` bis `?sc=s04`; doppelte, unbekannte oder zu lange Werte werden nicht zugeordnet. Keine freien UTM-Werte oder Referrerheuristik. Zuordnung gilt nur im bereits consentierten In-Memory-Ablauf, kein Vorab-Persistieren oder Backfill. Ohne erlaubtes Tag: nicht zugeordnet, nicht behauptet „direct“.

| Reservierter Code | Quelle im Linkregister | Kampagne | Inhalt |
|---|---|---|---|
| s01 | instagram | c01 | p01 |
| s02 | facebook | c01 | p01 |
| s03 | youtube | c01 | p01 |
| s04 | tiktok | c01 | p01 |

Diese Slots sind **noch keinem realen Beitrag verbindlich zugeordnet**. Vor Nutzung eine überprüfte Liste mit echtem Postlink, Code, neutralem Kampagnen-/Inhaltsslot und Veröffentlichungsdatum abnehmen. Keine sensiblen Themen in IDs/UTMs/URLs einbauen. Ein Tag zeigt den verwendeten Link, keinen Nachweis tatsächlicher Herkunft oder kausaler Werbewirkung. Social-Impressions/Linkklicks werden separat aus Plattformberichten mit deren Definitionen betrachtet.

## Einwilligung, Aufbewahrung und Zugriff

Im Browser nur Entscheidung, Version, Zeit und zufälliger Receipt im LocalStorage mit 30 Tagen Entscheidungsgültigkeit. Offene Widerrufsbelege bleiben darüber hinaus bis zur Serverbestätigung erhalten. Keine Formularwerte, Kampagnen-/Routenhistorie oder Ablaufkennung dort. Bei blockiertem gemeinsamem Storage oder fehlenden Web Locks bleibt die optionale Messung aus; die Anfrage funktioniert weiter. Vor Serverbestätigung und bei Fehler bleibt der Zustand aus. Offener Widerruf behält alle noch unbestätigten Receipts samt unveränderter ursprünglicher Zeit bis zum nächsten Versuch; erneute Aktivierung wartet auf bestätigten Widerruf. Verspätete Grant-Antworten können einen Widerruf oder einen Wechsel auf ausgeschlossene Seiten nicht überschreiben. Storage-Änderungen synchronisieren die interne Choice und stoppen die lokale Messung. Vor jeder Änderung wird unter einem exklusiven Web Lock der gemeinsame aktuelle Receipt erneut gelesen und mit noch unbestätigten Receipts zusammengeführt. Alle noch unbestätigten Widerrufsreceipts werden unabhängig von Alter und ursprünglicher Entscheidungsversion erst nach Serverbestätigung aus dem gemeinsamen Storage entfernt. Nur Browserbelege ohne offenen Widerruf werden nach 30 Tagen beim nächsten Besuch/Recovery bereinigt; diese lokale Ablaufbereinigung ist keine Bestätigung eines Serverwiderrufs. Fehlgeschlagener Widerruf bleibt nach Reload sichtbar; Wiederverbindung und SPA-Wechsel starten eine erneute Prüfung. Pending-Receipts werden in normalize, restore, recover und Storage-Synchronisierung nicht nach lokalem Alter gefiltert; Retry verlängert ihre ursprüngliche Zeit nicht.

Zwei getrennte Tabellen: Consent-Belege und Ablaufflags. Abläufe werden höchstens 7 Tage ausgewertet und danach stündlich physisch bereinigt (bei regulärem Lauf spätestens im nächsten Stundenintervall); Consent-Belege sind 30 Tage gültig. minimale Widerrufstombstones verhindern Replays. Zeitfilter gelten auch bei verzögerter physischer Bereinigung. Start- und stündliche Bereinigung laufen ebenfalls, wenn neue Erfassung ausgeschaltet ist. Fehler werden generisch geloggt und müssen operativ überwacht werden; der Patch behauptet keine eingerichtete Alarmierung. Ein Datenbankschema-/Berechtigungsfehler deaktiviert nur den optionalen Weg, keine Kern-Anfrage oder Admin-Anmeldung.

Widerruf stoppt sofort im aktuellen Browser und löscht serverseitig alle zugehörigen Abläufe unter demselben Receipt-Lock. Noch laufende Events können sie danach nicht wiederherstellen. Revoke funktioniert bei abgeschalteter Erfassung weiter, solange die Umgebung korrekt konfiguriert ist, und besitzt eine eigene Quote von 60 Anfragen pro Minute unabhängig vom Ereignis-Limit. Bei Teilschemas werden vorhandene Tabellen getrennt geprüft/bereinigt. Fehlt nur die Consent-Tabelle, werden passende Flows gelöscht, aber ohne dauerhaften Widerrufsvermerk kein Erfolg gemeldet; der Receipt bleibt offen und die Erfassung aus. Bestätigte Abwesenheit beider Tabellen kann dagegen ohne Datenverlust bestätigt werden. Werden Browserdaten statt des vorgesehenen Widerrufs manuell gelöscht, geht der Receipt verloren; bereits gespeicherte Ablaufdaten verfallen regulär binnen 7 Tagen, eine gezielte Zuordnung ist dann nicht mehr möglich.

Admin-Endpunkt `/api/admin/site-measurement`: vorhandene echte Admin-Rolle und `no-store`, nur aggregierte Antwort. Unterdrückt ganze Gruppen, falls eine positive Zelle, ihr Komplement oder eines der vier rekonstruierbaren Start-/Erfolgs- beziehungsweise Validierungs-/Technikfehler-Partitionselemente kleiner als 5 ist. Negative oder nicht-ganzzahlige Partitionen werden ebenfalls verworfen. 0 ist kein Ersatz für unterdrückte/unverfügbare Daten. Dies ist ein zusätzlicher Schutz, keine Behauptung rechtlicher Anonymität. Keine öffentliche Rohdatenansicht und kein Receipt-/Flow-Export.

## Konkrete Aktivierungs-/Abnahmefolge

1. **Ziel verifizieren, keine neue Infrastruktur aus diesem Auftrag ableiten:** Vorhandene Hostinger-Sitzung lesend nutzen. Exakte Staging-URL/Node-App, getrennte Testdatenbank, passende Runtime, SMTP-Sperre/Fake-Mail, HTTPS, sichere Cookies und Deployment-Zuordnung benennen. Der aktuelle Nachweis fehlt. Keine erneute unspezifische Nutzerfrage; zentrale Abstimmung bündelt den Zugang.
2. **Freigabe des Datenvertrags und Textes:** Dieser sechs-Stufen-Vertrag, zulässige Seiten, pseudonyme Kennungen, 7-/30-Tage-Fristen, Widerruf, Logkonfiguration und DE/TR-Kopie prüfen. Plattformkategorien und etwaige rechtliche Einschränkungen getrennt bestätigen. Keine Rechtsfreigabe aus bestandenem Test ableiten.
3. **Postmapping:** Reale Postlinks den vier neutralen Slots ausdrücklich zuordnen. Social-Insights getrennt verifizieren. Keine Zahlen aus historischen oder synthetischen Beispielen als Produktion anzeigen.
4. **Konkrete Staging-Freigabe:** Erst nach 1–3 gezielt die Bereitstellung dieses Patches auf genau der benannten Staging-App und die zwei neuen Tabellen in genau ihrer isolierten Datenbank freigeben. SQL-Datei `database/migrations/20261029-site-measurement.sql` oder idempotenter Initializer; keine produktiven Tabellen/Daten. Keine echten Testmails.
5. **Nur Staging aktivieren:** `SITE_MEASUREMENT_ENABLED=true`, `SITE_MEASUREMENT_ENVIRONMENT=staging`, Frontend separat `VITE_SITE_MEASUREMENT_ENABLED=true`, `VITE_SITE_MEASUREMENT_ENVIRONMENT=staging`. Sonst bleiben beide Flags false. Unbekannte/fehlende Umgebungszuordnung schaltet die Erfassung nicht frei. `LEGACY_FUNNEL_ENABLED` und `VITE_LEGACY_FUNNEL_ENABLED` bleiben false. Meta-/Google-/TikTok-Schalter, SDKs und Zugänge unverändert lassen.
6. **Hosted Acceptance:** Ablehnung/default-off → Formular funktioniert; Grant → erlaubte Stufen; sensible/geschützte Seiten → keine Stufen; keine Rohdaten im Netz; Fehler und Replay; echte Testadmin-Sitzung; kleine Zellen; zutreffende Quote; Widerruf bei Online/Offline, Replays und andere Tabs; Retention/Zeitzone; Hosting-Logs. Nach Test synthetische Daten entfernen. Bestehende Anfragebearbeitung und Sprache prüfen.
7. **Separate Produktionsfreigabe:** Exaktes Ziel `www.spirit-healing.tr`, abgenommener Stand/Hash, additive Tabellen, Datenumfang/Einwilligung und Rücknahmeplan nochmals ausdrücklich freigeben. Dieser Auftrag enthält keine solche Freigabe. Kein Werbebudget oder neue Plattformübermittlung ist dafür nötig oder mitfreigegeben.
8. **Rücknahme:** Zuerst neue Erfassung stoppen, Backend-Environment für Revoke und Cleanup beibehalten. Vor komplettem Code-Rollback Lösch-/Fristwahrung für verbleibende Messdaten sicherstellen, denn V3 enthält diesen Cleanup nicht. Beide Frontend-/Backend-Stände zusammen kontrolliert zurückstellen; operative Anfragen und Originaldaten nicht löschen. Keine automatische DROP-Migration.

## Lokal reproduzieren

Basis main `8c966d5b905a514830459067de78b723f9f43c0c`, zuerst eingefrorenen Kontaktpatch v3 anwenden, dann den neuen `site-measurement.patch`. package.json/package-lock unverändert. Lokale Baseline-Git-ID `a5c99b3eb742d8e24547b8be34dd5e251ff42792` ist nur der lokale eingefrorene Reviewzustand, kein veröffentlichter Repository-Commit.

Tests: vorhandenes Node 24; `node --test tests/*.test.mjs`. Vier MySQL-Variablen ausschließlich auf einen eigens bereitgestellten Loopback-Server ohne DB-Namen setzen: CONTACT_MYSQL_TEST_URL, BERLIN_MYSQL_TEST_URL, EXPERIENCE_MYSQL_TEST_URL, SITE_MYSQL_TEST_URL. Alle Fixtures erzeugen/löschen eigene zufällige Testdatenbanken. Niemals DB_* aus Produktion übernehmen. Schemafile und wiederholter Initializer sowie ein absichtlich abweichendes Driver-Zeitzonenoffset sind Bestandteil des echten SQL-Tests.

Browser-/App-Harness und Nachweise liegen im Review-Paket unter evidence/integration. Neuer Headless-Profile, Loopback-Listener, blockierte externe Hosts und Fake-Mail. Erfolge dieser synthetischen Tests sind keine Produktionswerte. Für einen vollständigen Code-Rerun sind die vorhandenen Repository-Abhängigkeiten erforderlich; node_modules, generiertes dist und persönliche Konfiguration werden nicht ausgeliefert.

## V3: vollständige Pending-Recovery bei Zeitversatz

Der V2-Randfall (erst Widerruf503, danach +31-Tage-Recovery/Reload verliert Receipt) ist reproduziert und behoben. Pending-Normalisierung verwendet keinerlei Altersfilter oder Entscheidungsversion als Löschgrund. Entscheidungsgültigkeit und offene Löschbestätigung sind getrennte Zustände. Ein unbestätigter Widerrufsbeleg bleibt bis zur Serverbestätigung erhalten, auch bei verstellter Uhr und nach Reload. Der Datenschutzentwurf nennt diese Ausnahme ausdrücklich; Abnahme bleibt erforderlich.

Regressionmatrix mit originalem Client und Servermodul/synthetischer DB: 0/+31 Tage × Ack/Fehler × Button/Online/SPA/Reload/Storage-Sync/Konkurrenz, 24 Kombinationen. Echter Frontendbrowser mit synthetischen APIs prüft dieselbe Matrix einschließlich zwei Tabs mit echten StorageEvents/Web Locks. Erfolg entfernt serverseitigen Fixturegrant und Flow; Fehler erhält Beleg, ursprüngliche Zeit und sichtbare Fehlermeldung. Nach Fehler bestätigt ein weiterer Versuch die Löschung. Passive Ablaufbereinigung ohne offenen Widerruf bleibt separat getestet. Kein MySQL-/Hostingnachweis für die synthetischen Browserfixtures.

Aktuell: 388 Tests, 384 bestanden, 0 Fehler, 4 echte MySQL-Tests nicht wiederholt; deren frühere Nachweise bleiben als historische V1-Belege erhalten. Server/SQL gegenüber V2 unverändert. Neueste Belege pending-matrix-*. Keine Aktivierung oder Infrastrukturänderung.
