# Spirit-Healing-Admin-Bereich

Der Admin-Bereich ergänzt die bestehende React-/Express-Homepage. Es gibt **keine WordPress-Umstellung**.

## Zugang

- Adresse: `/admin`
- Anmeldung: vorhandenes Spirit-Healing-Mitgliederkonto
- Berechtigung: Das Konto muss die Rolle `admin` besitzen oder seine E-Mail-Adresse muss in `MEMBER_ADMIN_EMAILS` freigegeben sein.
- Die Berechtigung wird bei jedem Lese-, Speicher- und Veröffentlichungsvorgang serverseitig geprüft.

## Bearbeitbare Inhalte der ersten Ausbaustufe

- Haupttexte der Startseite
- Einleitungstexte der Seiten „Über uns“ und „Kontakt“
- Überschriften, Fragen und Antworten der FAQ-Seite
- deutsche und türkische Antworten des Fragebots
- alternative deutsche und türkische Frageformulierungen für alle Bot-Themen

Technische Funktionen, Formulare, Preise, Navigation und Layout bleiben bewusst im Quellcode geschützt. Weitere Textfelder können später über den Inhaltskatalog ergänzt werden.

## Arbeitsablauf

1. Text oder Bot-Thema auswählen.
2. Deutsche Fassung bearbeiten; die türkische Fassung kann parallel gepflegt werden.
3. **Entwurf speichern**: Die öffentliche Homepage bleibt unverändert.
4. Inhalt prüfen.
5. **Speichern & veröffentlichen**: Nur der ausgewählte Abschnitt wird live übernommen.

Jede Veröffentlichung wird im Versionsverlauf gespeichert. Eine ältere Version lässt sich zunächst als Entwurf wiederherstellen und anschließend bewusst erneut veröffentlichen.

## Technische Grundlage

- Tabellen `cms_content_entries` und `cms_content_revisions` in der vorhandenen MySQL-Datenbank
- öffentliche, nur lesende Inhaltsabfrage über `/api/content`
- geschützte Admin-Schnittstellen unter `/api/admin/content`
- Schutz vor fremden Ursprüngen bei allen Schreibvorgängen
- keine HTML-Eingabe: Inhalte werden als Text ausgegeben und können dadurch keinen fremden Seitencode einschleusen
- sichere Rückfallebene: Solange noch nichts veröffentlicht wurde oder die Inhaltsabfrage nicht erreichbar ist, verwendet die Homepage weiterhin die geprüften Texte aus dem Quellcode

## Vor einer Live-Freigabe

- IT-Konto als Administrator freigeben
- Datenbank-Sicherung erstellen
- Datenbanktabellen in einer Testumgebung anlegen
- Anmeldung, Entwurf, Veröffentlichung und Wiederherstellung mit einem Testtext prüfen
- anschließend Produktionsaufbau und Live-Prüfung durchführen
