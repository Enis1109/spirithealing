# Spirit Healing AI Command Center

Die KI-Zentrale ist in den geschützten Adminbereich unter `/admin` eingebaut. Sie verwendet das bestehende Mitgliederkonto mit Adminrolle und kein zweites Login.

## Betriebsarten

Ohne ausdrückliche Serverkonfiguration läuft die KI-Zentrale im Mock-Modus. Für den Live-Betrieb müssen `AI_COMMAND_CENTER_MODE=live` und ein gültiger `OPENAI_API_KEY` ausschließlich in der Serverumgebung hinterlegt sein. Ein fehlender Schlüssel führt nicht zu einem unbemerkten Rückfall auf Mock-Ergebnisse; kostenpflichtige Aufträge bleiben dann gesperrt.

Im Live-Modus verwendet jeder Auftrag mindestens zwei getrennte Modellläufe:

- `gpt-5.6-luna` erstellt den ersten Arbeitsstand für die Routine-Rollen.
- `gpt-5.6-terra` prüft Fakten, Datenschutz, Widersprüche und Freigabereife in einem getrennten Lauf.

Für lange Skripte, Workbooks und Erzähltexte ist `claude-sonnet-5` als zusätzlicher Speziallauf vorbereitet. Diese Route ist standardmäßig ausgeschaltet. Erst `ANTHROPIC_CONTENT_ENABLED=true` zusammen mit einem serverseitigen `ANTHROPIC_API_KEY` aktiviert sie. Wenn Claude ausdrücklich aktiviert wurde und der Schlüssel fehlt, sperrt die KI-Zentrale den Auftrag. Ohne Aktivierung übernimmt OpenAI die Langformrolle als sichtbare Rückfallroute.

Ein Claude-Entwurf wird nie direkt ausgegeben oder veröffentlicht. Der nachfolgende OpenAI-Prüflauf entscheidet anhand der anonymisierten Quellenbasis, welche Inhalte in den internen Arbeitsstand übernommen werden dürfen.

Für allgemeine fachliche Aussagen darf der Prüflauf höchstens zwei Websuchen verwenden. Pilotdaten, Teilnehmerzahlen und Beobachtungen dürfen nicht als Suchanfrage gesendet werden. Die Modelle können über `OPENAI_ROUTINE_MODEL` und `OPENAI_REVIEW_MODEL` nur auf eine im Code hinterlegte, bepreiste Modellroute umgestellt werden.

## Kostenkontrolle

Vor jedem Live-Auftrag berechnet der Server eine konservative Schätzung. In einer Datenbanktransaktion wird geprüft, ob die Grenze pro Auftrag und das Monatsbudget noch ausreichen. Laufende Aufträge reservieren ihren Schätzbetrag, damit parallele Starts das Budget nicht umgehen.

Nach dem Auftrag werden Anbieter, Modell, Eingabe-, Cache- und Ausgabetokens sowie Websuchen gespeichert und mit den hinterlegten Anbieterpreisen berechnet. Teilkosten eines abgebrochenen Modelllaufs bleiben im Protokoll. Das gemeinsame Monatsbudget gilt für OpenAI und Anthropic zusammen. Die Standardgrenzen in einer neuen Datenbank sind 15 USD pro Monat und 2 USD pro Auftrag. Sie können im Adminbereich geändert werden.

Für `claude-sonnet-5` berücksichtigt die Kostenberechnung den Einführungspreis bis einschließlich 31. August 2026 und wechselt danach automatisch auf den regulären Preis.

## Datenschutz und Freigabe

Vor dem Speichern muss die Anonymisierung bestätigt werden. Das System blockiert zusätzlich direkt erkennbare E-Mail-Adressen, Telefonnummern und IBANs. Diese technische Prüfung erkennt nicht jeden Namen oder jede indirekte Identifizierung. Die inhaltliche Anonymisierung bleibt deshalb Pflicht der eingebenden Person.

OpenAI-Aufträge werden mit `store: false` gesendet. Auch an Anthropic werden nur bereits anonymisierte Arbeitsdaten übertragen. Ergebnisse, Tokenverbrauch, Kosten und die verwendeten Modellrouten werden in der eigenen Datenbank protokolliert. Jede Ausgabe wartet auf menschliche Freigabe oder Ablehnung.

Website, E-Mail, Social Media, Metricool und Zahlungen bleiben getrennt. Für Contentmotive ist `gpt-image-2` als eigene, zunächst ausgeschaltete Bildroute vorbereitet. Der Entwurfsmodus verwendet eine günstige Qualitätsstufe; erst ein ausgewähltes Motiv geht in die Finalqualität. Danach ist Canva als gesonderte Freigabe-Übergabe für Brand Kit, Textlayout und Kanalformate vorgesehen. Nur intern freigegebene Texte, Bildbriefings und ausgewählte Markenvorlagen dürfen übergeben werden. Eine interne Freigabe löst weder eine Bilderzeugung noch einen Canva-Entwurf oder eine Veröffentlichung aus.

Mit der vorbereiteten Hochkantgröße `1024x1536` kostet die reine Bildausgabe nach dem aktuellen OpenAI-Preisstand 0,005 USD in niedriger Entwurfsqualität und 0,041 USD in mittlerer Finalqualität. Text- und Bildeingaben werden zusätzlich tokenbasiert berechnet. Die Oberfläche zeigt die hinterlegten Ausgabepreise vor einer späteren Aktivierung an.

## Arbeitsabläufe

### Morgendliches Team-Meeting

Im Adminbereich werden Tages-, Wochen- und Monatsprioritäten gemeinsam erfasst. Der Director verteilt jede Aufgabe an eine feste Rolle. Der Plan nennt Zeithorizont, Priorität, Abhängigkeit und ein prüfbares Fertig-Kriterium. Das Meeting startet keine Veröffentlichung oder andere Außenaktion.

### Unternehmensgedächtnis

Bestätigte Unternehmensfakten werden mit Bereich, Quelle und Versionsnummer gespeichert. Eine neue Fassung mit demselben Titel ersetzt die vorherige Fassung sichtbar; die Historie bleibt erhalten. Künftige Läufe erhalten nur aktive, bestätigte Fassungen als Unternehmenswissen.

### Erfahrungslernen und Evals

Jeder Live-Lauf darf bis zu drei Lernvorschläge erstellen. Ein Vorschlag enthält die konkrete Beobachtung, eine kleine Änderung der Arbeitsregel, ein messbares Erfolgskriterium, einen Vergleichsplan und eine Risikostufe. Nach der Freigabe des Arbeitsstands erscheint er zunächst als Lernkandidat. Erst eine zweite Entscheidung aktiviert ihn als neue Playbook-Version. Ab dann steht er künftigen Läufen als aktive Arbeitsregel zur Verfügung.

So dürfen die Agenten eigenständig Hypothesen und Verbesserungen entwickeln, ohne Unternehmensfakten, Markenwissen oder Freigabegrenzen still umzuschreiben. Schlechtere Versionen bleiben nachvollziehbar und können verworfen werden.

### Pilotwoche auswerten

Eine gespeicherte Woche läuft durch Director, Wissensordnung, Auswertung, Programmentwicklung, Faktenprüfung, Contententwurf, Datenschutzprüfung, getrennte Zweitprüfung und Qualitätskontrolle.

### 12-Wochen-Kernprodukt entwickeln

Der Lauf nutzt alle gespeicherten Pilotwochen. Vorhandene Pilotdaten, fehlende Wochen und Hypothesen für Woche 9 bis 12 werden serverseitig getrennt gekennzeichnet. Das Modell kann diese Herkunftsmarkierung nicht aufheben. Bei aktivierter Claude-Route bearbeitet Claude die Langform und Lehrlogik; OpenAI prüft den Entwurf anschließend getrennt.

## Serverkonfiguration

```text
AI_COMMAND_CENTER_MODE=live
OPENAI_API_KEY=<serverseitiger Projektschlüssel>
OPENAI_ROUTINE_MODEL=gpt-5.6-luna
OPENAI_REVIEW_MODEL=gpt-5.6-terra
AI_COMMAND_CENTER_WEB_SEARCH=true
ANTHROPIC_CONTENT_ENABLED=false
ANTHROPIC_API_KEY=<serverseitiger Projektschlüssel>
ANTHROPIC_EDITORIAL_MODEL=claude-sonnet-5
OPENAI_IMAGE_ENABLED=false
OPENAI_IMAGE_MODEL=gpt-image-2
OPENAI_IMAGE_SIZE=1024x1536
OPENAI_IMAGE_DRAFT_QUALITY=low
OPENAI_IMAGE_FINAL_QUALITY=medium
```

Die Schlüssel dürfen weder im Repository noch im Browser-Code gespeichert werden. Nach der Einrichtung sollte zuerst ein anonymisierter Testauftrag mit einer niedrigen Monatsgrenze ausgeführt und das Kostenprotokoll mit den Nutzungsanzeigen von OpenAI und Anthropic verglichen werden.
