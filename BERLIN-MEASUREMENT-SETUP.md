# Berlin-Werbemessung: Betrieb und Freigabe

Stand: 17. September 2026. Die Funktionen sind standardmäßig ausgeschaltet.

## Einwilligungsmodell

Besuche, Klicks und zusätzliche Zahlungskopien erfordern einen gespeicherten, gültigen und nicht widerrufenen Einwilligungsnachweis. Eine zufällige 256-Bit-Kennung wird im Browser erzeugt und an den erlaubten Stripe-Zahlungslink angehängt. Der Server speichert ihren Hash mit Textversion, Zeit und Ablauf. Alte Anzeigenkennungen allein werden nicht als Einwilligung akzeptiert. Die Zuordnung ist kein Identitätsnachweis und beweist keine kausale Werbewirkung.

Ohne Einwilligung bleiben beide Buchungslinks nutzbar. Der Widerruf stoppt die Messung im Browser sofort; seine Serverbestätigung löscht verknüpfte Auswertungsdaten und sperrt spätere Zahlungsbestätigungen. Fehler werden sichtbar angezeigt. Fremde oder noch nicht zuordenbare Erstattungs-/Disputmeldungen werden nicht gespeichert. Solche vorzeitig eintreffenden Meldungen müssen bei Stripe gesondert abgeglichen werden; die Auswertung ist kein vollständiges Zahlungsbuch.

## Prüfstand

- Lokale Suite: 166 bestanden, 1 echter SQL-Test ohne lokale Datenbank übersprungen.
- Gesonderter echter Datenbanktest: 2 Prüfungen bestanden, 0 übersprungen. Einschließlich fehlender Zustimmung, Speicherung, Wiederholungen, Anpassungen, Löschung nach Frist, individueller Zahlungslöschung und tatsächlich gelöschter Besuchs-/Zahlungszuordnungen nach Widerruf.
- Produktionsbuild erfolgreich. Browserprüfung: unveränderte Buchungslinks vor Zustimmung, nach Ablehnung und Neuladen sowie bei nicht erreichbarer Messung.
- Alle temporären Server-Testressourcen und Zugangsdaten entfernt; SSH wieder ausgeschaltet.
- Frühere direkte Stripe-Sandbox-Zustellung belegt den damaligen Empfangspfad, nicht automatisch den neuen öffentlichen Einwilligungsablauf.

## Aktivierung

Frontend: VITE_BERLIN_MEASUREMENT_ENABLED=true erst nach passender Backend-Konfiguration. Meta-Schalter VITE_META_PIXEL_ENABLED und VITE_META_POLICY_APPROVED bleiben false. Der frühere einwilligungsfreie Kampagnenreferenz-Fallback wurde entfernt.

Server: BERLIN_MEASUREMENT_ENABLED=true, BERLIN_STRIPE_MODE ausdrücklich live oder test; BERLIN_STRIPE_WEBHOOK_SECRET nur im Hosting-Geheimnisspeicher. Ein fehlendes oder ungültiges Geheimnis verhindert den aktivierten Start. Es wird kein Stripe-API-Schlüssel benötigt.

Öffentlicher Empfänger: /api/berlin/stripe-webhook. Benötigte Ereignisse: checkout.session.completed, checkout.session.async_payment_succeeded, charge.refunded, charge.dispute.created, charge.dispute.closed. Keine Vermischung von Test- und Live-Datenbanken. Neue Tabellen erst beim aktivierten Start; bestehende Buchungs- und Mitgliederdaten werden nicht gelöscht oder verändert.

Vor endgültiger Freigabe sind öffentliche Erreichbarkeit, Signaturabwehr, Admin-Zugriffsschutz, Einwilligung/Widerruf und unveränderte Buchungspfade zu prüfen. Keine Echtzahlung als Test ohne eigene Freigabe auslösen. Veröffentlichung dieses Codes ist noch keine Anzeigenfreigabe.

## Löschung und Wiederherstellung

Auswertungsdaten höchstens 90 Tage, zusätzlich durch Ablauf/Widerruf des Nachweises begrenzt; stündliche Bereinigung. Eine individuelle Zahlungslöschung betrifft nur zusätzliche Auswertungsdaten und erzeugt einen 90-tägigen gehashten Löschvermerk. Sie löst keine Erstattung aus und löscht keine Buchung oder Buchhaltungsunterlage.

Nach Wiederherstellung eines Backups Messung ausgeschaltet lassen. Spätere Widerrufe/Löschungen anhand eines getrennten Löschprotokolls erneut berücksichtigen, bevor Daten wieder ausgewertet werden. Ohne diesen Abgleich keine Reaktivierung. Im Zweifelsfall zusätzliche Auswertungsdaten verwerfen, nicht Original-Zahlungsbelege oder Mitgliederdaten.
