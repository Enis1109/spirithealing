# Erfahrungsgruppe: Veröffentlichung und Abnahme

Der Bereich ist standardmäßig ausgeschaltet. Keine Zugangsdaten, privaten Zoom-Links, Teilnehmerlisten oder Archivdateien in Git übernehmen.

## Konfiguration

- `EXPERIENCE_GROUP_ENABLED=true` schaltet die getrennte Gruppenfunktion ein und legt ihre Tabellen beim Start an. Vorher Datenbanksicherung und Migration in isolierter Umgebung prüfen.
- `EXPERIENCE_ZOOM_JOIN_URL` enthält bei Bedarf den privaten Link zum sonntäglichen Treffen. Nur HTTPS-Meetinglinks auf zoom.us und dessen Subdomains werden akzeptiert. Der Link ist ausschließlich serverseitig zu hinterlegen.
- `EXPERIENCE_REMINDERS_ENABLED=true` aktiviert den Erinnerungsversand. Erst nach Test der Absenderkonfiguration und Empfängerzuordnung einschalten.
- Die bestehenden SMTP- und Datenbankvariablen bleiben unverändert. Keine neue Zahlung oder Buchung ist durch dieses Modul eingerichtet.

## Zugang

Bestätigte Bestandsmitglieder können mit `plan=existing`, `fullArchive=true` und leerem Enddatum zugeordnet werden. Ihre Zahlung wird später abgeglichen. Keine pauschale Freigabe aller Website- oder Telegram-Mitglieder.

Neue Mitglieder benötigen einen konkreten Zugangszeitraum; ihr Inhaltsbeginn ist der vereinbarte Einstiegszeitpunkt. Für die Sichtbarkeit zählt das Datum des Treffens, nicht der spätere Import. Gesperrte, abgelaufene, zukünftige und unveröffentlichte Inhalte bleiben auch beim direkten Abruf gesperrt.

Für ein ausdrücklich gewähltes veröffentlichtes Treffen kann „Thema und Handouts schon vor dem Termin freigeben“ aktiviert werden. Nur dessen Beschreibung und geschützte Handouts werden dann für aktive Gruppenmitglieder vorab sichtbar. Der tatsächliche Termin bleibt unverändert; Aufzeichnungen werden erst ab dem Termin freigegeben. Entwürfe, archivierte Treffen, noch zukünftige Veröffentlichungen und gesperrte Mitgliedschaften bleiben ausgeschlossen. Die optionale Vorabfreigabe wird als geschützte Metadatenzeile im bestehenden Beschreibungsfeld gespeichert und nicht im Beschreibungstext angezeigt; es ist keine Datenbankmigration nötig.

## Archiv übernehmen

1. Den privaten Zoom-Katalog über die Adminoberfläche als Entwürfe importieren. Ein erneuter Import legt keine Duplikate an.
2. Vimeo-Dateien nach Originaldatum zuordnen. Mehrteilige Treffen erst vollständig übernehmen. Keine kurze erste Teildatei als vollständigen Abend veröffentlichen.
3. Für jedes Video auf Vimeo zuerst die Domainbeschränkung auf spirit-healing.tr nachprüfen, danach „Nur als Einbettung“ einstellen. Downloads ausgeschaltet lassen. Keine öffentlichen oder unbeschränkt einbettbaren Gruppenaufzeichnungen.
4. PDF-Handouts ausschließlich über den geschützten Adminupload zuordnen. Gleiche Dateien beim gleichen Treffen werden nicht doppelt gespeichert. Ungeklärte Datumszuordnungen bleiben offen.
5. Inhalt und Freigabe prüfen, erst danach das Treffen veröffentlichen. Das Importregister allein veröffentlicht nichts.

## Tests vor Freischaltung

- Die Tests `tests/experience*.test.mjs` ausführen. Die echte Datenbankprüfung benötigt `EXPERIENCE_MYSQL_TEST_URL` für einen isolierten lokalen MySQL-Server ohne Datenbanknamen. Sie verwendet ausschließlich eine neue zufällig benannte Testdatenbank, synthetische Mitglieder und einen simulierten Mailversand. Bestehende Datenbanken und externe Hosts werden abgewiesen.
- Der echte MySQL-Test darf nicht als bestanden bezeichnet werden, wenn er übersprungen wurde.
- Staging-Zugang prüfen: ausgeloggt, gewöhnliches Mitglied ohne Gruppenzugang, Bestandsmitglied, Neumitglied, abgelaufen, gesperrt und Admin.
- Vimeo-Wiedergabe auf der tatsächlichen Domain ohne Vimeo-Anmeldung prüfen. Lokale Vorschauen sind dafür kein Nachweis.
- PDF-Direktlinks und den geschützten Live-Link mit allen Rollen prüfen; private Antworten dürfen nicht zwischengespeichert werden.
- Jahreserinnerungen 30 Tage, 7 Tage und am letzten Tag prüfen. Verlängerte oder gesperrte Zugänge dürfen keine überholte Erinnerung erhalten. Unklarer SMTP-Versand wird nicht automatisch wiederholt.
- Buchung und verifizierte Zahlungsereignisse separat fertigstellen; keine Freischaltung anhand eines bloßen Checkout-Rücksprungs.

## Rücknahme

Bei einem Abnahmefehler `EXPERIENCE_GROUP_ENABLED=false` und `EXPERIENCE_REMINDERS_ENABLED=false` setzen und den Dienst kontrolliert neu starten. Das deaktiviert die Funktion ohne vorhandene Daten oder Originalaufnahmen zu löschen. Die bisherigen Website-Bereiche bleiben unabhängig.
