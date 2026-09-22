# Live-Vortrag am 6. Oktober 2026

Termin: 19:30–20:30 Europe/Berlin (17:30–18:30 UTC), Deutsch.

Öffentliche Anmeldung: `/live-vortrag`. Persönliche Verwaltung: `/live-vortrag/zugang#token=…`.
Administration: `/admin/live-vortrag`, vorhandene Administrator-Anmeldung erforderlich.

## Aktivierung

Beim Serverstart werden drei getrennte Tabellen ergänzt. Vorhandene Vortragszugänge bleiben unverändert.
Die Anmeldung bleibt geschlossen, bis im Admin-Bereich der echte Zoom-Teilnahmelink (HTTPS, `/j/`, mit `pwd`) gespeichert und der Versand aktiviert wird.
Keine neue Zoom-OAuth-Verbindung: Das Meeting wird im bestehenden Zoom-Konto verwaltet. Der Teilnahmelink wird nur in der geschützten Datenbank gespeichert, nie im öffentlichen Repository.
Keine zusätzlichen Mail-Zugangsdaten: bestehender Hostinger-SMTP-Versand und vorhandenes WEBINAR_TOKEN_SECRET (alternativ NEWSLETTER_TOKEN_SECRET, mindestens 32 Zeichen).

## Ablauf

1. Name, E-Mail und erforderliche Einwilligung; Newsletter freiwillig, nicht vorausgewählt.
2. Registrierung und Versandaufträge werden in einer Transaktion gespeichert.
3. Worker alle 30 Sekunden, Bestätigung mit Zoom-Link, persönlichem Absagelink und ICS-Kalendereintrag.
4. Erinnerungen 24 Stunden und eine Stunde vorher. Nur bei Anmeldung vor dem jeweiligen Versandzeitpunkt.
5. Absage stoppt noch ausstehende Terminerinnerungen. Der separat bestätigte Newsletter bleibt unabhängig.
6. Anmeldung und Versand enden zum Vortragsbeginn; der Zugangsbereich endet zum geplanten Vortragsende.
7. Veranstaltungsbezogene Daten werden 90 Tage nach Vortragsende gelöscht (mit zugehörigen Versandaufträgen). Newsletter-Verwaltung bleibt getrennt.

Mehrfache Anmeldung erzeugt keine zweite Bestätigung und überschreibt keine vorhandenen Teilnehmerdaten. Absagen können nicht durch eine fremde erneute Formularanmeldung aufgehoben werden. Für Neuanmeldung nach Absage oder manuelles Wiederzusenden an info@spirit-healing.tr wenden.

## Versandkontrolle

`sent`: SMTP hat angenommen, keine Zustell-/Lesegarantie.
`failed`: eindeutige SMTP-Ablehnung, bis zu drei Versuche mit mindestens fünf Minuten Abstand.
`uncertain`: Verbindungsabbruch oder unterbrochener Versandprozess. Nicht automatisch wiederholen: erst Mailausgang/Zustellung prüfen, um Duplikate zu vermeiden.
`skipped`: überholte Vortagserinnerung.
`cancelled`: abgesagte Teilnahme.

Admin-Versandübersicht regelmäßig prüfen. Es gibt keine automatische Werbekampagne, keine WhatsApp-Massennachrichten und keine Replay-Mail. Spätere Werbung erfordert bestätigte Newsletter-Einwilligung und einen gesonderten Versandauftrag.

## Homepage und Kampagnenentwürfe

Die Homepage zeigt den Live-Vortrag als eingebundenen Abschnitt. Die bisherige Aufzeichnung und die Mediathek bleiben als kleinere Links erreichbar. Das automatisch öffnende Mediathek-Fenster wird dort nicht mehr verwendet; es wird kein neuer Popup eingebaut.

Beim Serverstart werden zehn E-Mail-Entwürfe E0–E9 in `newsletter_campaign_drafts` angelegt. `INSERT IGNORE` erhält vorhandene Entwürfe bei einer erneuten Bereitstellung. Die Admin-Vortragsseite zeigt die Entwürfe sowie ausschließlich aggregierte Newsletter-Zahlen. Es gibt bewusst keinen Versand-Endpunkt und keinen Kampagnen-Worker. Vorgeschlagene Versanddaten lösen nichts aus.

Vor dem gesondert beauftragten Werbeversand: Anmeldeseite und Mailzustellung testen, Testadressen ausschließen, Absenderangaben und signierten Abmeldelink ergänzen, bereits zum Live angemeldete Personen von weiteren Einladungen und gebuchte Personen von der Verkaufsfolge ausschließen. Für E4 vorhandene Aufzeichnungszugänge beachten. Für E9 Aufnahmefähigkeit und Startgespräch prüfen. Zeitbezogene Texte nach ihrem vorgesehenen Tag nicht unverändert nachholen. Berlin-Restplätze vor jeder Verwendung erneut prüfen.

## Prüfung

`node --test tests/liveTalk.test.mjs tests/webinarConfig.test.mjs tests/webinarService.test.mjs tests/webinarValidation.test.mjs tests/seo-metadata.test.mjs`

`npm run build`

Danach Anmeldung im Browser mit eigener Testadresse, Bestätigung/Kalendereintrag im Postfach, Versandstatus und doppelte Anmeldung prüfen. Absage separat testen. Vor dem Termin Zoom-Lizenz und Teilnehmendenlimit im Konto prüfen; Warteraum erfordert Zulassung durch die Gastgeberinnen.
