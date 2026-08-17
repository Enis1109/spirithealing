# Spirit Healing AI Command Center

Die KI-Zentrale ist in den geschützten Adminbereich unter `/admin` eingebaut. Sie verwendet das bestehende Mitgliederkonto mit Adminrolle und kein zweites Login.

## Betriebsarten

Ohne ausdrückliche Serverkonfiguration läuft die KI-Zentrale im Mock-Modus. Für den Live-Betrieb müssen `AI_COMMAND_CENTER_MODE=live` und ein gültiger `OPENAI_API_KEY` ausschließlich in der Serverumgebung hinterlegt sein. Ein fehlender Schlüssel führt nicht zu einem unbemerkten Rückfall auf Mock-Ergebnisse; kostenpflichtige Aufträge bleiben dann gesperrt.

Im Live-Modus verwendet jeder Auftrag zwei getrennte Modellläufe:

- `gpt-5.6-luna` erstellt den ersten Arbeitsstand für die Routine-Rollen.
- `gpt-5.6-terra` prüft Fakten, Datenschutz, Widersprüche und Freigabereife in einem getrennten Lauf.

Für allgemeine fachliche Aussagen darf der Prüflauf höchstens zwei Websuchen verwenden. Pilotdaten, Teilnehmerzahlen und Beobachtungen dürfen nicht als Suchanfrage gesendet werden. Die Modelle können über `OPENAI_ROUTINE_MODEL` und `OPENAI_REVIEW_MODEL` nur auf eine im Code hinterlegte, bepreiste Modellroute umgestellt werden.

## Kostenkontrolle

Vor jedem Live-Auftrag berechnet der Server eine konservative Schätzung. In einer Datenbanktransaktion wird geprüft, ob die Grenze pro Auftrag und das Monatsbudget noch ausreichen. Laufende Aufträge reservieren ihren Schätzbetrag, damit parallele Starts das Budget nicht umgehen.

Nach dem Auftrag werden Eingabe-, Cache- und Ausgabetokens sowie Websuchen gespeichert und mit den hinterlegten OpenAI-Preisen berechnet. Teilkosten eines abgebrochenen zweiten Modelllaufs bleiben im Protokoll. Die Standardgrenzen in einer neuen Datenbank sind 15 USD pro Monat und 2 USD pro Auftrag. Sie können im Adminbereich geändert werden.

## Datenschutz und Freigabe

Vor dem Speichern muss die Anonymisierung bestätigt werden. Das System blockiert zusätzlich direkt erkennbare E-Mail-Adressen, Telefonnummern und IBANs. Diese technische Prüfung erkennt nicht jeden Namen oder jede indirekte Identifizierung. Die inhaltliche Anonymisierung bleibt deshalb Pflicht der eingebenden Person.

OpenAI-Aufträge werden mit `store: false` gesendet. Ergebnisse, Tokenverbrauch, Kosten und die verwendeten Modellrouten werden in der eigenen Datenbank protokolliert. Jede Ausgabe wartet auf menschliche Freigabe oder Ablehnung.

Website, E-Mail, Social Media, Canva, Metricool und Zahlungen bleiben getrennt. Eine interne Freigabe löst keine Außenaktion aus.

## Arbeitsabläufe

### Pilotwoche auswerten

Eine gespeicherte Woche läuft durch Director, Wissensordnung, Auswertung, Programmentwicklung, Faktenprüfung, Contententwurf, Datenschutzprüfung, getrennte Zweitprüfung und Qualitätskontrolle.

### 12-Wochen-Kernprodukt entwickeln

Der Lauf nutzt alle gespeicherten Pilotwochen. Vorhandene Pilotdaten, fehlende Wochen und Hypothesen für Woche 9 bis 12 werden serverseitig getrennt gekennzeichnet. Das Modell kann diese Herkunftsmarkierung nicht aufheben.

## Serverkonfiguration

```text
AI_COMMAND_CENTER_MODE=live
OPENAI_API_KEY=<serverseitiger Projektschlüssel>
OPENAI_ROUTINE_MODEL=gpt-5.6-luna
OPENAI_REVIEW_MODEL=gpt-5.6-terra
AI_COMMAND_CENTER_WEB_SEARCH=true
```

Der Schlüssel darf weder im Repository noch im Browser-Code gespeichert werden. Nach der Einrichtung sollte zuerst ein anonymisierter Testauftrag mit einer niedrigen Monatsgrenze ausgeführt und das Kostenprotokoll mit dem OpenAI-Nutzungsdashboard verglichen werden.
