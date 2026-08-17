# Spirit Healing AI Command Center

Die erste Ausbaustufe ist in den vorhandenen, geschützten Adminbereich unter `/admin` eingebaut. Sie verwendet das bestehende Mitgliederkonto mit Adminrolle und kein zweites Login.

## Aktueller Betriebsmodus

Das Command Center läuft ausschließlich im **Mock-Modus**. Die Agentenkette wird technisch mit festen Übergaben ausgeführt und protokolliert, verwendet aber noch keine kostenpflichtige Modell-API. Deshalb kann diese Version:

- anonymisierte Pilotwochen speichern,
- daraus eine nachvollziehbare interne Auswertung erzeugen,
- aus allen erfassten Pilotwochen einen gekennzeichneten 12-Wochen-Arbeitsentwurf bilden,
- jeden Arbeitsschritt mit zuständigem Agenten und Übergabe anzeigen,
- Ergebnisse zur menschlichen Freigabe oder Ablehnung vorlegen,
- Budgetgrenzen für eine spätere Live-Anbindung speichern.

Sie kann nicht veröffentlichen, E-Mails versenden, Social-Media-Posts einstellen, Canva oder Metricool bedienen, Zahlungen auslösen oder die Live-Website verändern.

## Datenschutz

Vor dem Speichern muss die Anonymisierung bestätigt werden. Das System blockiert zusätzlich direkt erkennbare E-Mail-Adressen, internationale Telefonnummern und IBANs. Diese technische Prüfung erkennt nicht jeden Namen oder jede indirekte Identifizierung. Die inhaltliche Anonymisierung bleibt deshalb eine Pflicht der eingebenden Person.

## Arbeitsabläufe

### Pilotwoche auswerten

Eine gespeicherte Woche läuft durch Director, Wissensordnung, Auswertung, Programmentwicklung, Faktenprüfung, Contententwurf, Datenschutzprüfung, unabhängige Zweitprüfung und Qualitätskontrolle. Das Ergebnis bleibt anschließend im Status „Prüfung offen“.

### 12-Wochen-Kernprodukt entwickeln

Der Lauf nutzt alle gespeicherten Pilotwochen. Vorhandene Pilotdaten, fehlende Wochen und Hypothesen für Woche 9 bis 12 werden getrennt gekennzeichnet. Der Entwurf ist keine automatische fachliche Freigabe.

## Datenbank

Beim Serverstart werden drei Tabellen angelegt:

- `ai_command_center_settings`
- `ai_pilot_weeks`
- `ai_workflow_runs`

Die gleichen Definitionen stehen in `database/schema.sql` für eine kontrollierte manuelle Einrichtung.

## Vor einer späteren Live-KI-Anbindung

Nötig sind mindestens eine getrennte Provider-Konfiguration, verschlüsselte Schlüsselverwaltung, echte Token- und Kostenmessung, Zeitlimits, Wiederholungsregeln, Quellenprotokolle, Löschfristen und Tests mit einer separaten Datenbank. Außenaktionen sollten weiterhin eigene, einzeln freizugebende Schnittstellen bleiben.
