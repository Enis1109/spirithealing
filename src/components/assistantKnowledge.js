const SITE = "https://www.spirit-healing.tr";

export const assistantQuickQuestions = {
    de: [
        "Ich finde die Mitglieder-E-Mail nicht",
        "Was kosten die Sitzungen?",
        "Welche Sitzung passt zu mir?",
        "Wie läuft eine Sitzung ab?",
        "Wobei könnt ihr helfen?",
        "Was ist im Mitgliederbereich?",
    ],
    tr: [
        "Üyelik e-postasını bulamıyorum",
        "Seans ücretleri ne kadar?",
        "Hangi seans bana uygun?",
        "Bir seans nasıl ilerliyor?",
        "Hangi konularda destek oluyorsunuz?",
        "Üye alanında neler var?",
    ],
};

const intents = [
    {
        id: "emergency",
        priority: 100,
        terms: ["suizid", "selbstmord", "akute gefahr", "notfall", "nicht mehr leben", "mir etwas antun", "akute psychische krise", "akuten psychischen krise", "psychische krise", "psychischen krise", "akuter krisenfall", "ich bin in einer krise", "sofortige hilfe", "brauche sofort hilfe", "selbstverletzung", "mir wehtun", "jemand anderem etwas antun", "gefahr für mich", "gefahr fuer mich", "gefahr für andere", "gefahr fuer andere"],
        answer: {
            text: "Wenn du dich in einer akuten psychischen Krise befindest oder eine unmittelbare Gefahr für dich oder andere besteht, ruf bitte sofort den örtlichen Notruf 112 an oder wende dich an eine geeignete Krisen- beziehungsweise Notfallstelle. Dieser Website-Assistent und die reguläre Begleitung sind für akute Notfälle nicht der passende Rahmen.",
        },
    },
    {
        id: "missing_email",
        priority: 90,
        terms: ["keine mail", "keine e-mail", "email nicht", "e-mail nicht", "mail nicht", "nicht bekommen", "nicht angekommen", "spam", "junk", "postfach", "werbung ordner", "bestätigung fehlt", "krieg die mail nich", "bekomme die mail nicht", "mail kam nicht", "mail ist weg", "zugangsmail fehlt", "mitglieder mail fehlt"],
        answer: {
            text: "Schau bitte zuerst im Spam-, Werbung- oder Junk-Ordner nach und suche in deinem Postfach nach „Spirit Healing“. Prüfe auch, ob du die richtige E-Mail-Adresse verwendet hast. Wenn die Nachricht nicht auftaucht, kannst du im Mitgliederbereich ein neues Passwort oder einen neuen Zugangslink anfordern.",
            links: [{ label: "Mitgliederbereich öffnen", href: `${SITE}/mitglieder` }],
        },
    },
    {
        id: "password",
        priority: 70,
        terms: ["passwort vergessen", "neues passwort", "passwort ändern", "passwort anfordern", "kann mich nicht einloggen", "login geht nicht", "zugangsdaten", "einloggen"],
        answer: {
            text: "Öffne den Mitgliederbereich und wähle „Passwort vergessen?“. Gib deine E-Mail-Adresse ein und klicke auf „Link per E-Mail senden“. Falls keine Nachricht erscheint, prüfe bitte auch Spam, Werbung und Junk.",
            links: [{ label: "Neues Passwort anfordern", href: `${SITE}/mitglieder?mode=forgot` }],
        },
    },
    {
        id: "direct_link",
        priority: 75,
        terms: ["direktlink", "zugangslink", "persönlicher link", "personlicher link", "neuen link", "alter link", "link abgelaufen", "link verloren", "was ist der direktlink", "direktlink zum mitgliederbereich", "direkter link zum mitgliederbereich", "mit direktlink anmelden"],
        answer: {
            text: "Dein bisheriger persönlicher Direktlink bleibt gültig. Wenn du einen neuen brauchst, öffne den Mitgliederbereich und wähle „Neuen Direktlink anfordern“. Dort trägst du Name und E-Mail-Adresse ein und lässt dir den Zugangslink neu senden.",
            links: [{ label: "Direktlink anfordern", href: `${SITE}/mitglieder?mode=access` }],
        },
    },
    {
        id: "member_registration",
        priority: 65,
        terms: ["registrieren", "wie registriere", "kostenlos registrieren", "kostenlos anmelden", "konto erstellen", "mitglied werden", "zugang erstellen", "mitgliederzugang", "anmeldung mitglieder", "wie komme ich in den mitgliederbereich", "wie komme ich in den mitglieder bereich", "wie komm ich in den mitgliederbereich", "wie komm ich in den mitglieder bereich", "zugang zum mitgliederbereich", "mitgliederbereich anmelden", "wie logge ich mich ein"],
        answer: {
            text: "Der Mitgliederbereich ist kostenlos. Du kannst dort ein Konto mit Name, E-Mail-Adresse und Passwort anlegen. Nach der Registrierung erhältst du eine Nachricht von Spirit Healing; prüfe bei Bedarf auch den Spam-Ordner.",
            links: [{ label: "Kostenlos registrieren", href: `${SITE}/mitglieder?mode=register` }],
        },
    },
    {
        id: "member_content",
        priority: 60,
        terms: ["mitgliederbereich", "mediathek", "was ist enthalten", "was finde ich", "kostenloser zugang", "kostenlose inhalte", "aufzeichnung", "workbook", "meditationen"],
        answer: {
            text: "Im kostenlosen Mitgliederbereich findest du zwei geführte Meditationen – „Loslassen & Reinigen“ und „Wiedergeburt“ –, die Aufzeichnung „Wer entscheidet eigentlich dein Leben?“ und das begleitende Workbook.",
            links: [{ label: "Zur kostenlosen Mediathek", href: `${SITE}/mitglieder` }],
        },
    },
    {
        id: "member_details",
        priority: 72,
        terms: ["wie lang ist der vortrag", "61 minuten", "wie viele seiten", "neun seiten", "9 seiten", "premium inhalte", "premium bereich", "premium mitglied", "was kommt noch"],
        answer: {
            text: "Der Vortrag im Mitgliederbereich dauert 61 Minuten. Das dazugehörige Workbook umfasst neun Seiten mit Reflexionsfragen und Übungen zur Selbstführung. Weitere Prozess-Meditationen, vertiefende Vorträge und besondere Live-Räume sind als Premium-Inhalte in Vorbereitung.",
            links: [{ label: "Inhalte im Mitgliederbereich ansehen", href: `${SITE}/mitglieder` }],
        },
    },
    {
        id: "meditation_difference",
        priority: 68,
        terms: ["unterschied meditationen", "unterschied zwischen den meditationen", "welche meditation", "loslassen und reinigen", "wiedergeburt meditation", "meditation passt"],
        answer: {
            text: "„Loslassen & Reinigen“ begleitet bewusstes Loslassen und inneres Reinigen. „Wiedergeburt“ ist für Übergänge, Neuausrichtung und einen neuen inneren Beginn gedacht. Beide geführten Meditationen sind im kostenlosen Mitgliederbereich verfügbar.",
            links: [{ label: "Meditationen öffnen", href: `${SITE}/mitglieder` }],
        },
    },
    {
        id: "member_downloads",
        priority: 70,
        terms: ["meditation herunterladen", "mp3 herunterladen", "workbook herunterladen", "download", "offline hören", "offline hoeren"],
        answer: {
            text: "Im Mitgliederbereich kannst du das Workbook herunterladen. Auch die beiden Meditationen lassen sich direkt anhören und als MP3 speichern, sobald du angemeldet bist.",
            links: [{ label: "Mitgliederbereich öffnen", href: `${SITE}/mitglieder` }],
        },
    },
    {
        id: "event_recording",
        priority: 70,
        terms: ["wer entscheidet", "vortragsaufzeichnung", "vortrag ansehen", "vortrag nachsehen", "seminar aufzeichnung", "live vortrag"],
        answer: {
            text: "Die Aufzeichnung „Wer entscheidet eigentlich dein Leben?“ steht zusammen mit dem Workbook kostenlos im Mitgliederbereich bereit. Der Vortrag erklärt verständlich, wie innere Anteile Entscheidungen, Aufschieben, Kontrolle, Anpassung oder Rückzug beeinflussen können.",
            links: [
                { label: "Aufzeichnung ansehen", href: `${SITE}/mitglieder` },
                { label: "Mehr zum Vortrag", href: `${SITE}/vortraege-seminare` },
            ],
        },
    },
    {
        id: "newsletter",
        priority: 55,
        terms: ["newsletter", "neue veranstaltungen", "weitere vorträge", "weitere vortraege", "seminare erfahren", "termine informiert", "abmelden newsletter"],
        answer: {
            text: "Über den freiwilligen Newsletter informiert Spirit Healing über neue Vorträge, Seminare und Termine. Nach der Anmeldung bestätigst du sie über einen Link in einer separaten E-Mail; abmelden kannst du dich jederzeit über den Link in einer Newsletter-Nachricht.",
            links: [{ label: "Kontakt und Newsletter", href: `${SITE}/kontakt` }],
        },
    },
    {
        id: "packages",
        priority: 80,
        terms: ["3er paket", "5er paket", "sitzungspaket", "paketpreis", "pakete", "rabatt", "preisvorteil", "mehrere sitzungen"],
        answer: {
            text: "Die Sitzungspakete bieten einen Preisvorteil: 3 Einzelsitzungen kosten 599,40 € (10 % Rabatt), 5 Einzelsitzungen 943,50 € (15 %). 3 gemeinsame Sitzungen kosten 899,10 €, 5 gemeinsame Sitzungen 1.415,25 €.",
            links: [{ label: "Pakete und Preise ansehen", href: `${SITE}/prices` }],
        },
    },
    {
        id: "payment_methods",
        priority: 71,
        terms: ["wie kann ich bezahlen", "wie bezahle ich", "zahlungsarten", "zahlungsmethode", "überweisung", "ueberweisung", "paypal", "kreditkarte", "stripe", "bar bezahlen", "ratenzahlung", "in raten zahlen"],
        answer: {
            text: "Sitzungspakete können direkt über die Preis- und Terminseite online gekauft werden. Welche Zahlungsarten für einzelne Termine möglich sind oder ob eine Ratenzahlung vereinbart werden kann, ist auf der Homepage nicht verbindlich beschrieben. Frag Spirit Healing dazu bitte vor der Buchung kurz persönlich.",
            links: [
                { label: "Preise und Pakete ansehen", href: `${SITE}/prices` },
                { label: "Zahlungsfrage stellen", href: `${SITE}/kontakt` },
            ],
        },
    },
    {
        id: "prices",
        priority: 60,
        terms: ["was kostet", "wie viel kostet", "preise", "preis", "kosten", "euro", "bezahlen", "kostenfrei", "kostenloses erstgespräch", "kostenloses erstgespraech"],
        answer: {
            text: "Das 15-minütige Kennenlernen ist kostenfrei. Eine Erst- oder Folgesitzung mit Sabine oder Selcan dauert 60 Minuten und kostet 222 €. Eine gemeinsame 60-minütige Sitzung mit beiden kostet 333 €. Die 150-minütige Intensivsitzung mit Selcan kostet ebenfalls 333 €.",
            links: [
                { label: "Alle Preise ansehen", href: `${SITE}/prices` },
                { label: "Termin buchen", href: `${SITE}/termin-buchen` },
            ],
        },
    },
    {
        id: "duration",
        priority: 72,
        terms: ["wie lange", "dauer", "dauert", "wie viele minuten", "zeit einer sitzung", "150 minuten", "60 minuten", "15 minuten"],
        answer: {
            text: "Das kostenfreie Kennenlernen dauert 15 Minuten. Einzel- und gemeinsame Sitzungen dauern 60 Minuten. Die Intensivsitzung mit Selcan dauert 150 Minuten.",
            links: [{ label: "Dauer und Preise vergleichen", href: `${SITE}/prices` }],
        },
    },
    {
        id: "booking",
        priority: 78,
        terms: ["termin buchen", "termin machen", "termin vereinbaren", "freien termin", "freie termine", "verfügbarkeit", "verfuegbarkeit", "kalender", "calendly", "wo buchen", "wie buche ich", "wie kann ich buchen", "wie kann ich einen termin buchen", "wo buche ich", "buchung starten", "direkt eine sitzung buchen", "sitzung direkt buchen", "randevu buchen"],
        answer: {
            text: "Auf der Buchungsseite wählst du zuerst die Terminart und danach direkt einen freien Zeitpunkt. Das kostenfreie Kennenlernen, Einzelsitzungen und die gemeinsame Erstsitzung können dort sofort ausgewählt werden.",
            links: [{ label: "Freien Termin auswählen", href: `${SITE}/termin-buchen` }],
        },
    },
    {
        id: "rescheduling",
        priority: 75,
        terms: ["umbuchen", "termin verschieben", "anderen termin", "uhrzeit ändern", "uhrzeit aendern", "48 stunden"],
        answer: {
            text: "Eine kostenfreie Umbuchung ist bis 48 Stunden vor dem Termin möglich. Nutze dafür den Link in deiner Terminbestätigung oder melde dich direkt bei Spirit Healing, wenn du Unterstützung brauchst.",
            links: [{ label: "Kontakt aufnehmen", href: `${SITE}/kontakt` }],
        },
    },
    {
        id: "cancellation",
        priority: 70,
        terms: ["stornieren", "termin absagen", "absage", "kann nicht teilnehmen", "termin fällt aus", "termin faellt aus", "geld zurück", "geld zuruck", "kurzfristig absagen", "kurzfristig stornieren", "am selben tag absagen", "termin nicht wahrnehmen"],
        answer: {
            text: "Auf der Homepage ist die kostenfreie Umbuchung bis 48 Stunden vor dem Termin genannt. Für eine Absage oder Erstattung wende dich bitte direkt an Spirit Healing, damit dein konkreter Termin persönlich geklärt werden kann.",
            links: [{ label: "Termin persönlich klären", href: `${SITE}/kontakt` }],
        },
    },
    {
        id: "long_programs",
        priority: 68,
        terms: ["3 monate", "6 monate", "dreimonatige begleitung", "sechsmonatige begleitung", "langfristige begleitung", "länger begleiten", "laenger begleiten"],
        answer: {
            text: "Eine drei- und eine sechsmonatige Begleitung sind in Vorbereitung. Umfang, Rhythmus und Preis werden anschließend persönlich abgestimmt. Du kannst dein Interesse bereits unverbindlich vormerken lassen.",
            links: [{ label: "Interesse vormerken", href: `${SITE}/termin-buchen` }],
        },
    },
    {
        id: "frequency",
        priority: 69,
        terms: ["wie oft", "wie häufig", "wie haeufig", "abstand zwischen", "welcher rhythmus", "jede woche", "wöchentlich", "woechentlich", "wie viele sitzungen", "wie viele termine", "reicht eine sitzung", "brauche mehrere sitzungen"],
        answer: {
            text: "Es gibt keinen festen Sitzungsrhythmus, der für alle passt. Ob ein einzelner Termin genügt oder weitere Sitzungen sinnvoll sind, wird nach deinem Anliegen und dem bisherigen Prozess gemeinsam besprochen. Drei- und sechsmonatige Begleitungen sind derzeit noch in Vorbereitung.",
            links: [
                { label: "Begleitung kennenlernen", href: `${SITE}/faq` },
                { label: "Unverbindlich fragen", href: `${SITE}/kontakt` },
            ],
        },
    },
    {
        id: "session_fit",
        priority: 74,
        terms: ["welche sitzung", "welche begleitung", "was passt zu mir", "welches angebot", "wo soll ich anfangen", "richtige sitzung", "bin unsicher", "passender einstieg"],
        answer: {
            text: "Du musst dich nicht allein entscheiden. Im kostenfreien 15-minütigen Kennenlernen schilderst du kurz, was dich beschäftigt. Danach klärt ihr gemeinsam, ob eine Einzel-, gemeinsame oder längere Intensivsitzung sinnvoll ist.",
            links: [{ label: "Kostenfreies Kennenlernen buchen", href: `${SITE}/termin-buchen` }],
        },
    },
    {
        id: "intro_call",
        priority: 82,
        terms: ["kennenlerngespräch", "kennenlerngespraech", "kostenfreies kennenlernen", "kostenloses kennenlernen", "kostenlose kennenlernen", "kostenlose kennenlerngespräch", "kostenlose kennenlerngespraech", "erstgespräch kostenlos", "erstgespraech kostenlos", "was passiert beim kennenlernen", "wie läuft das kennenlernen", "wie laeuft das kennenlernen", "muss ich mich danach entscheiden", "unverbindliches gespräch", "unverbindliches gespraech", "15 minuten kennenlernen"],
        answer: {
            text: "Das Kennenlerngespräch dauert 15 Minuten und ist kostenfrei. Du kannst kurz schildern, was dich beschäftigt, Fragen stellen und ein erstes Gefühl für die Zusammenarbeit bekommen. Danach wird transparent besprochen, welcher Einstieg passen könnte; du musst dich im Gespräch zu nichts entscheiden.",
            links: [{ label: "Kostenfreies Kennenlernen wählen", href: `${SITE}/termin-buchen` }],
        },
    },
    {
        id: "first_followup",
        priority: 72,
        terms: ["erstsitzung", "folgesitzung", "erste oder folge", "ersttermin", "weiterer termin", "schon eine sitzung gehabt"],
        answer: {
            text: "Die Erstsitzung ist der fundierte Einstieg: Ihr sortiert dein Anliegen und wichtige Zusammenhänge. Eine Folgesitzung greift auf, was sich seitdem gezeigt hat, und führt den begonnenen Prozess weiter. Beide dauern 60 Minuten.",
            links: [{ label: "Erst- und Folgesitzungen ansehen", href: `${SITE}/prices` }],
        },
    },
    {
        id: "individual_joint",
        priority: 72,
        terms: ["einzeln oder gemeinsam", "einzelsitzung oder gemeinsam", "unterschied einzelsitzung", "gemeinsame sitzung", "mit euch beiden", "zwei begleiterinnen", "zu zweit"],
        answer: {
            text: "In einer Einzelsitzung arbeitest du mit Sabine oder Selcan. In einer gemeinsamen Sitzung verbinden beide ihre unterschiedlichen Blickwinkel und Arbeitsweisen im selben Prozess. Welche Form sinnvoll ist, hängt von deinem Anliegen und deinem persönlichen Gefühl ab.",
            links: [{ label: "Sitzungsarten vergleichen", href: `${SITE}/prices` }],
        },
    },
    {
        id: "couples_scope",
        priority: 76,
        terms: ["paarsitzung", "paartherapie", "paarberatung", "gemeinsame sitzung eine paartherapie", "mit meinem partner", "mit meiner partnerin", "als paar kommen", "zu zweit als paar", "beziehung gemeinsam", "partnerschaftsberatung"],
        answer: {
            text: "Die Homepage beschreibt persönliche Einzelsitzungen sowie gemeinsame Sitzungen, bei denen Sabine und Selcan dein Thema zusammen begleiten. Ob ihr auch als Paar gemeinsam teilnehmen könnt, ist dort nicht verbindlich angegeben. Schreibt Spirit Healing euer Anliegen bitte kurz, damit ihr eine klare persönliche Auskunft bekommt.",
            links: [{ label: "Paarsitzung persönlich anfragen", href: `${SITE}/kontakt` }],
        },
    },
    {
        id: "intensive",
        priority: 68,
        terms: ["intensivsitzung", "intensivprozess", "intensivtermin", "aufstellungsarbeit", "seelenrückholung", "seelenruckholung", "150 minuten"],
        answer: {
            text: "Die Intensivsitzung mit Selcan dauert 150 Minuten und kostet 333 €. Sie gibt systemischer Aufstellungsarbeit oder schamanisch ausgerichteter Seelenrückholung mehr Zeit, ohne den Prozess in ein enges Zeitfenster zu drängen.",
            links: [{ label: "Intensivsitzung ansehen", href: `${SITE}/prices` }],
        },
    },
    {
        id: "team_overview",
        priority: 84,
        terms: ["wer sind sabine und selcan", "wer seid ihr", "wer steckt hinter spirit healing", "euer team", "stellt euch vor", "über euch", "ueber euch", "wer begleitet mich", "wer arbeitet bei spirit healing"],
        answer: {
            text: "Spirit Healing wird von Sabine Schmidt und Selcan Yilmaz getragen. Sabine verbindet Coaching, Hypnose, NLP sowie Anteile- und Musterarbeit. Selcan ist Heilpraktikerin für Psychotherapie und bringt langjährige Erfahrung in Stabilisierung, Einzelfallhilfe und der Begleitung emotional stark belastender Situationen mit. Gemeinsam verbinden sie systemische Anteilearbeit und Energiearbeit.",
            links: [{ label: "Sabine und Selcan kennenlernen", href: `${SITE}/about` }],
        },
    },
    {
        id: "choose_person",
        priority: 73,
        terms: ["sabine oder selcan", "wer passt zu mir", "mit wem arbeiten", "wen soll ich buchen", "unterschied sabine selcan", "welche von euch"],
        answer: {
            text: "Sabine arbeitet besonders mit Coaching, Hypnose, NLP, inneren Anteilen und wiederkehrenden Mustern. Selcan bringt viel Erfahrung in Stabilisierung, Prozessbegleitung und emotional anspruchsvollen Situationen mit. Im kostenlosen Kennenlernen kannst du herausfinden, bei wem du dich stimmig aufgehoben fühlst.",
            links: [
                { label: "Sabine und Selcan kennenlernen", href: `${SITE}/about` },
                { label: "Kostenfreies Gespräch buchen", href: `${SITE}/termin-buchen` },
            ],
        },
    },
    {
        id: "sabine",
        priority: 62,
        terms: ["sabine schmidt", "was macht sabine", "sabines arbeit", "qualifikation sabine", "ausbildung sabine"],
        answer: {
            text: "Sabine begleitet mit Coaching, Hypnose, NLP sowie Anteile- und Musterarbeit. Ihre Stärke liegt darin, innere Konflikte und wiederkehrende Muster klar zu erfassen und einen Zugang zu den Anteilen zu finden, die Veränderung bisher bremsen oder absichern.",
            links: [{ label: "Mehr über Sabine", href: `${SITE}/about` }],
        },
    },
    {
        id: "selcan",
        priority: 62,
        terms: ["selcan yilmaz", "was macht selcan", "selcans arbeit", "qualifikation selcan", "ausbildung selcan"],
        answer: {
            text: "Selcan arbeitet mit Stabilisierung und Prozessbegleitung und behält auch bei starkem emotionalem Erleben den Überblick. Ihre ruhige, klare Arbeitsweise gibt Orientierung, ohne vorschnell eine Lösung vorzugeben.",
            links: [{ label: "Mehr über Selcan", href: `${SITE}/about` }],
        },
    },
    {
        id: "help_general",
        priority: 55,
        terms: ["wobei helfen", "wobei könnt", "wobei koennt", "helfen", "wobei unterstützen", "womit kann ich kommen", "welche themen", "für wen geeignet", "was kann ich mitbringen", "anliegen", "feststecken"],
        answer: {
            text: "Spirit Healing begleitet dich zum Beispiel, wenn du dich trotz vieler Gedanken immer wieder im Kreis drehst, ständig funktionieren musst, schnell überfordert bist, dich in Beziehungen zurückziehst oder anpasst, deine Grenzen schwer spürst oder dir mehr Klarheit und Selbstkontakt wünschst.",
            links: [{ label: "Möglichkeiten der Begleitung", href: `${SITE}/coaching` }],
        },
    },
    {
        id: "mental_health_scope",
        priority: 78,
        terms: ["panikattacke", "panikattacken", "panik", "angstzustände", "angstzustaende", "starke angst", "depression", "depressiv", "ptbs", "trauma heilen", "könnt ihr mich heilen", "koennt ihr mich heilen", "ersetzt psychotherapie", "ersetzt eine therapie", "psychische diagnose", "heilversprechen"],
        answer: {
            text: "Starke Angst, Panik, depressive Phasen oder belastende Erfahrungen können im Kennenlernen offen angesprochen werden. Spirit Healing kann dabei begleiten, Gefühle, Schutzmuster sowie Reaktionen von Körper und Nervensystem besser zu verstehen. Ob dieses Angebot für deine Situation passt, muss persönlich geklärt werden; es ersetzt keine notwendige medizinische oder psychotherapeutische Abklärung und macht keine Heilversprechen. Bei einer akuten Krise oder Gefahr ruf bitte 112 an.",
            links: [
                { label: "Rahmen und Grenzen lesen", href: `${SITE}/faq` },
                { label: "Situation persönlich klären", href: `${SITE}/kontakt` },
            ],
        },
    },
    {
        id: "what_is_spirit_healing",
        priority: 62,
        terms: ["was ist spirit healing", "was macht spirit healing", "wofür steht spirit healing", "wofuer steht spirit healing", "euer ansatz", "eure begleitung"],
        answer: {
            text: "Spirit Healing verbindet traumasensible Prozessbegleitung mit Arbeit an inneren Anteilen, Beziehungsmustern, Körperwahrnehmung und systemischen Zusammenhängen. Ziel ist, festgefahrene Schutzmuster verständlich zu machen und wieder mehr Klarheit, Selbstkontakt und Wahlfreiheit zu entwickeln.",
            links: [{ label: "Spirit Healing kennenlernen", href: `${SITE}/about` }],
        },
    },
    {
        id: "parts_explained",
        priority: 69,
        terms: ["was sind innere anteile", "warum innere anteile", "wie entstehen anteile", "ego anteile", "schutzanteil", "innere teile", "anteilearbeit erklärt", "anteilearbeit erklaert"],
        answer: {
            text: "In der Anteilearbeit steht ein „Anteil“ für eine innere Stimme, Gefühlslage oder Schutzstrategie, die sich aus Erfahrungen und deren persönlicher Bedeutung entwickelt haben kann. Ein Teil will vielleicht gefallen, ein anderer kontrollieren oder sich zurückziehen. Es geht nicht darum, Anteile loszuwerden, sondern ihre Aufgabe zu verstehen und bewusster zu entscheiden.",
            links: [
                { label: "Anteilearbeit kennenlernen", href: `${SITE}/about` },
                { label: "Kostenlosen Vortrag ansehen", href: `${SITE}/mitglieder` },
            ],
        },
    },
    {
        id: "self_or_part",
        priority: 69,
        terms: ["selbst oder anteil", "spricht mein selbst", "bauchgefühl", "bauchgefuehl", "intuition oder angst", "aus dem selbst", "wer entscheidet in mir"],
        answer: {
            text: "Auch ein Bauchgefühl kann von einem Schutzanteil geprägt sein. In der Anteilearbeit wird deshalb neugierig geprüft: Fühlt sich der Impuls ruhig, klar und offen an – oder eher eng, drängend und angstbesetzt? Beides darf gehört werden; die Frage ist, was am Ende deine Entscheidung führen soll.",
            links: [{ label: "Vortrag zur Selbstführung ansehen", href: `${SITE}/mitglieder` }],
        },
    },
    {
        id: "process_steps",
        priority: 67,
        terms: ["vier schritte", "4 schritte", "wahrnehmen einordnen verstehen", "wie arbeitet ihr konkret", "was macht ihr konkret", "weg zur veränderung", "weg zur veraenderung"],
        answer: {
            text: "Die Arbeitsweise lässt sich in vier Schritte fassen: wahrnehmen, was gerade in Gedanken, Gefühlen und Körper geschieht; einordnen, was Gegenwart oder alte Schutzreaktion ist; verstehen, wovor ein Anteil schützen will; und einen stimmigen, realistischen nächsten Schritt neu wählen.",
            links: [{ label: "Arbeitsweise im Detail", href: `${SITE}/about` }],
        },
    },
    {
        id: "testimonials",
        priority: 58,
        terms: ["erfahrungsberichte", "erfahrungen anderer", "bewertungen", "kundenstimmen", "stimmen zur begleitung", "was sagen andere"],
        answer: {
            text: "Auf der Startseite findest du persönliche Rückmeldungen von Menschen, die eine Begleitung bei Spirit Healing erlebt haben. Dort kannst du dir in Ruhe ein Bild von ihren Erfahrungen machen.",
            links: [{ label: "Erfahrungsbericht auf der Startseite", href: `${SITE}/` }],
        },
    },
    {
        id: "stress_exhaustion",
        priority: 64,
        terms: ["erschöpft", "erschoepft", "erschöpfung", "erschoepfung", "dauernd müde", "dauernd muede", "unter strom", "innere unruhe", "überfordert", "ueberfordert", "funktioniere nur", "nicht entspannen", "ausgebrannt"],
        answer: {
            text: "Wenn du nach außen weiter funktionierst, innerlich aber erschöpft, angespannt oder ständig unter Strom bist, kann die traumasensible Prozessbegleitung ein passender Einstieg sein. Ihr schaut darauf, was dein System in Alarm hält und was wieder mehr Ruhe und Selbstkontakt ermöglicht.",
            links: [{ label: "Prozessbegleitung ansehen", href: `${SITE}/coaching` }],
        },
    },
    {
        id: "relationships",
        priority: 64,
        terms: ["beziehungsmuster", "beziehungsprobleme", "immer falsche partner", "nähe", "naehe", "rückzug", "rueckzug", "bindung", "bindungsangst", "bei bindungsangst helfen", "angst vor nähe", "angst vor naehe", "anpassung", "people pleasing", "grenzen setzen", "nein sagen", "verlustangst"],
        answer: {
            text: "Beziehungsmuster, Rückzug, starke Anpassung, Schwierigkeiten mit Nähe oder Grenzen gehören zu den Themen der Begleitung. Gemeinsam wird verständlich, welche Schutzbewegung dahinterliegt und wie du mehr Wahlfreiheit im Kontakt mit anderen entwickeln kannst.",
            links: [{ label: "Mehr zu Beziehung und Schutz", href: `${SITE}/coaching` }],
        },
    },
    {
        id: "self_worth",
        priority: 64,
        terms: ["selbstwert", "selbstkritik", "scham", "nicht gut genug", "gut genug", "nicht richtig", "zweifle an mir", "minderwertig", "mich ablehnen"],
        answer: {
            text: "Selbstkritik, Scham und das Gefühl, nicht richtig oder nicht gut genug zu sein, können in der Begleitung Raum bekommen. Ihr schaut nicht gegen diese inneren Stimmen an, sondern versteht zuerst, wovor sie schützen wollen und was du heute brauchst.",
            links: [{ label: "Arbeitsweise kennenlernen", href: `${SITE}/about` }],
        },
    },
    {
        id: "decisions_parts",
        priority: 66,
        terms: ["entscheidung", "entscheiden", "aufschieben", "prokrastination", "innerer konflikt", "ein teil von mir", "inneren anteile", "schutzanteile", "kontrolle", "selbstführung", "selbstfuehrung"],
        answer: {
            text: "Wenn ein Teil von dir Veränderung will und ein anderer bremst, kann Anteilearbeit helfen, diesen inneren Widerspruch zu verstehen. Der kostenlose Vortrag im Mitgliederbereich erklärt außerdem, wie Schutzanteile Entscheidungen, Aufschieben, Kontrolle, Anpassung oder Rückzug beeinflussen.",
            links: [
                { label: "Kostenlosen Vortrag ansehen", href: `${SITE}/mitglieder` },
                { label: "Anteilearbeit kennenlernen", href: `${SITE}/about` },
            ],
        },
    },
    {
        id: "numbness",
        priority: 63,
        terms: ["innere leere", "fühle nichts", "fuehle nichts", "gar nichts mehr", "wie abgeschnitten", "taub fühlen", "taub fuehlen", "keinen kontakt zu mir", "mich selbst verloren"],
        answer: {
            text: "Auch innere Leere, Abschalten oder wenig Kontakt zu den eigenen Gefühlen können verständliche Schutzreaktionen sein. In der Begleitung beginnt ihr mit dem, was gerade wahrnehmbar ist – ohne Druck, etwas Bestimmtes fühlen zu müssen.",
            links: [{ label: "Traumasensible Begleitung", href: `${SITE}/coaching` }],
        },
    },
    {
        id: "body",
        priority: 63,
        terms: ["körper", "koerper", "körperlich", "koerperlich", "beschwerden", "schmerzen", "verspannung", "körper reagiert", "koerper reagiert"],
        answer: {
            text: "Auch körperliche Reaktionen oder Beschwerden dürfen Teil des Gesprächs sein. Ihr schaut gemeinsam darauf, welche Gefühle, Belastungen, Schutzbewegungen oder wiederkehrenden Muster damit verbunden sein könnten und was dir im Umgang damit hilft.",
            links: [{ label: "Arbeitsweise ansehen", href: `${SITE}/faq` }],
        },
    },
    {
        id: "trauma_sensitive",
        priority: 66,
        terms: ["traumasensibel", "trauma sensibel", "nervensystem", "schutzreaktion", "sicherer rahmen", "ohne druck", "eigenes tempo"],
        answer: {
            text: "Traumasensibel bedeutet bei Spirit Healing: Schutzreaktionen werden nicht als Fehler behandelt. Ihr versucht zuerst zu verstehen, welche Funktion ein Muster hatte und was dein System heute braucht. Tempo, Grenzen und Vorgehen werden transparent gemeinsam abgestimmt.",
            links: [{ label: "FAQ zur Arbeitsweise", href: `${SITE}/faq` }],
        },
    },
    {
        id: "methods_overview",
        priority: 59,
        terms: ["welche methoden", "wie arbeitet ihr", "arbeitsweise", "methoden", "welche ansätze", "welche an saetze", "ebenen der arbeit"],
        answer: {
            text: "Je nach Anliegen verbindet Spirit Healing Gespräch, Körperwahrnehmung, Nervensystem, Bindungs- und Beziehungsmuster, innere Anteile sowie systemische Zusammenhänge. Intuitive, energetische oder schamanisch ausgerichtete Perspektiven werden nur einbezogen, wenn sie für dich stimmig sind.",
            links: [{ label: "Arbeitsweise im Überblick", href: `${SITE}/faq` }],
        },
    },
    {
        id: "coaching_location",
        priority: 76,
        terms: ["wo findet das coaching", "wo ist das coaching", "wo findet coaching", "wo findet die begleitung", "coaching online", "coaching vor ort", "coaching per zoom", "wo trefft ihr euch"],
        answer: {
            text: "Das Coaching und die regulären Sitzungen finden überwiegend online über Zoom statt. Du kannst ortsunabhängig teilnehmen; die Begleitung ist auf Deutsch oder Türkisch möglich. Ausgewählte Intensiv- und Aufstellungsformate können nach persönlicher Absprache auch in Berlin oder Antalya stattfinden.",
            links: [
                { label: "Ablauf und Rahmen ansehen", href: `${SITE}/faq` },
                { label: "Termin auswählen", href: `${SITE}/termin-buchen` },
            ],
        },
    },
    {
        id: "coaching_expectation",
        priority: 75,
        terms: ["was erwartet mich beim coaching", "was passiert beim coaching", "wie läuft das coaching", "wie laeuft das coaching", "was macht man beim coaching", "ablauf coaching", "was erwartet mich in der begleitung"],
        answer: {
            text: "Zu Beginn klärt ihr, was dich gerade beschäftigt und was du dir wünschst. Danach schaut ihr gemeinsam auf Gefühle, Körperwahrnehmung, Nervensystem, Beziehungsmuster oder innere Anteile – je nachdem, was zu deinem Thema passt. Es gibt kein starres Programm: Vorgehen, Tempo und Grenzen werden transparent mit dir abgestimmt.",
            links: [
                { label: "Traumasensible Prozessbegleitung", href: `${SITE}/coaching` },
                { label: "Häufige Fragen zum Ablauf", href: `${SITE}/faq` },
            ],
        },
    },
    {
        id: "coaching_therapy",
        priority: 66,
        terms: ["prozessbegleitung oder therapie", "coaching oder therapie", "coaching und therapie", "zwischen coaching", "unterschied therapie", "integrative therapie", "prozessbegleitung", "angebote unterscheiden"],
        answer: {
            text: "Die Prozessbegleitung schaut besonders auf Schutzreaktionen, Nervensystem, Beziehungen, Grenzen und innere Anspannung. Die integrative Begleitung verbindet Gespräch, Gefühle, Körperwahrnehmung, innere Muster und weitere passende Methoden zu einem Gesamtprozess. Im Kennenlernen klärt ihr gemeinsam den stimmigen Einstieg.",
            links: [
                { label: "Prozessbegleitung", href: `${SITE}/coaching` },
                { label: "Integrative Begleitung", href: `${SITE}/therapie` },
            ],
        },
    },
    {
        id: "hypnosis_nlp",
        priority: 65,
        terms: ["hypnose", "hypnosecoach", "nlp", "neurolinguistisch", "gesprächstherapie", "gespraechstherapie"],
        answer: {
            text: "Hypnose, NLP und Gesprächsarbeit gehören zu den möglichen Zugängen, besonders in Sabines Arbeit. Welche Methode genutzt wird, richtet sich nicht nach einem starren Programm, sondern nach deinem Anliegen und dem, was für dich nachvollziehbar ist.",
            links: [{ label: "Methoden und Team kennenlernen", href: `${SITE}/about` }],
        },
    },
    {
        id: "constellation",
        priority: 66,
        terms: ["familienaufstellung", "aufstellung", "systemische aufstellung", "familienthema", "ahnen", "familiendynamik"],
        answer: {
            text: "Systemische Aufstellungsarbeit kann familiäre oder andere Beziehungsmuster sichtbar machen. Für einen längeren Aufstellungsprozess bietet Spirit Healing die 150-minütige Intensivsitzung mit Selcan an; ausgewählte Formate können nach Absprache auch vor Ort stattfinden.",
            links: [{ label: "Intensivsitzung ansehen", href: `${SITE}/prices` }],
        },
    },
    {
        id: "energy_spiritual",
        priority: 65,
        terms: ["energiearbeit", "energetisch", "schamanisch", "spirituell", "muss ich glauben", "seelenrückholung", "seelenruckholung"],
        answer: {
            text: "Du musst nicht spirituell sein und an kein bestimmtes Modell glauben. Energiearbeit, intuitive oder schamanische Perspektiven sind ein mögliches Angebot, keine Voraussetzung. Ihr besprecht gemeinsam, was für dich verständlich und stimmig ist.",
            links: [{ label: "Arbeitsweise kennenlernen", href: `${SITE}/faq` }],
        },
    },
    {
        id: "topic_clarity",
        priority: 67,
        terms: ["weiß mein thema nicht", "weiss mein thema nicht", "was mein thema ist", "thema benennen", "nicht genau was los ist", "nur ein gefühl", "nur ein gefuehl", "kann es nicht erklären", "kann es nicht erklaeren"],
        answer: {
            text: "Du musst dein Thema nicht schon genau benennen können. Oft ist zunächst nur spürbar, dass etwas Kraft kostet, sich wiederholt oder du innerlich feststeckst. Ihr beginnt mit dem, was im Moment wahrnehmbar ist.",
            links: [{ label: "Kostenfrei kennenlernen", href: `${SITE}/termin-buchen` }],
        },
    },
    {
        id: "session_process",
        priority: 65,
        terms: ["wie läuft eine sitzung", "ablauf einer sitzung", "was passiert in der sitzung", "wie geht der erste termin", "wie läuft der erste termin", "wie laeuft der erste termin", "nach der buchung", "zoom link", "zoom-link", "fragebogen", "terminbestätigung", "terminbestaetigung"],
        answer: {
            text: "Nach der Buchung erhältst du eine Terminbestätigung und den Zoom-Link. Je nach Format kommt ein kurzer Fragebogen dazu. Zu Beginn klärt ihr, was dich aktuell beschäftigt; danach richtet sich der Verlauf ohne starres Programm nach deinem Prozess.",
            links: [{ label: "FAQ zum Ablauf", href: `${SITE}/faq` }],
        },
    },
    {
        id: "preparation",
        priority: 64,
        terms: ["vorbereiten", "bereite ich mich", "vorbereitung", "vor der sitzung", "was brauche ich", "ungestörter ort", "ungestoerter ort", "internetverbindung", "nach der sitzung", "was mache ich nach der sitzung", "danach arbeiten", "ruhe nach dem termin", "brauche ich zoom", "zoom installieren", "technik für zoom", "technik fuer zoom"],
        answer: {
            text: "Plane möglichst etwas Ruhe vor und nach der Sitzung ein und sorge für einen ungestörten Ort mit stabiler Internetverbindung. Für die Online-Sitzung brauchst du ein Gerät, auf dem du den zugesandten Zoom-Link öffnen kannst. Du musst sonst nichts Besonderes vorbereiten und dein Anliegen nicht perfekt formulieren.",
            links: [{ label: "Vorbereitung nachlesen", href: `${SITE}/faq` }],
        },
    },
    {
        id: "substances",
        priority: 72,
        terms: ["vor der sitzung alkohol", "alkohol", "drogen", "substanzen", "cannabis", "betrunken", "bewusstseinsverändernd", "bewusstseinsveraendernd"],
        answer: {
            text: "Bitte nimm nicht unter dem Einfluss von Alkohol oder bewusstseinsverändernden Substanzen teil. So kannst du dich während der Sitzung klar wahrnehmen und im Kontakt mit dir bleiben.",
            links: [{ label: "Hinweise zur Vorbereitung", href: `${SITE}/faq` }],
        },
    },
    {
        id: "emotions",
        priority: 63,
        terms: ["sitzung weine", "weinen", "emotional werde", "gefühle in der sitzung", "gefuehle in der sitzung", "überwältigt", "ueberwaeltigt", "zusammenreißen", "zusammenreissen"],
        answer: {
            text: "Du musst dich in der Sitzung nicht zusammenreißen oder funktionieren. Gefühle dürfen da sein und werden nicht bewertet. Das Tempo richtet sich danach, womit du im jeweiligen Moment gut im Kontakt bleiben kannst.",
            links: [{ label: "Traumasensible Arbeitsweise", href: `${SITE}/faq` }],
        },
    },
    {
        id: "online_location_language",
        priority: 61,
        terms: ["online", "vor ort", "zoom", "berlin", "antalya", "türkisch", "tuerkisch", "deutsch", "welche sprache", "wo finden", "aus dem ausland", "aus einem anderen land", "von überall", "von ueberall", "ortsunabhängig", "ortsunabhaengig"],
        answer: {
            text: "Die Sitzungen finden überwiegend online über Zoom statt und sind auf Deutsch oder Türkisch möglich. Ausgewählte Intensiv- und Aufstellungsformate können nach Absprache auch in Berlin oder Antalya stattfinden.",
            links: [{ label: "Termine ansehen", href: `${SITE}/prices` }],
        },
    },
    {
        id: "privacy",
        priority: 60,
        terms: ["vertraulich", "datenschutz", "daten gespeichert", "was passiert mit meinen daten", "privat", "verschwiegen"],
        answer: {
            text: "Spirit Healing beschreibt den Rahmen als vertraulich. Angaben aus Kontakt- oder Mitgliederformularen werden für die Bearbeitung deiner Anfrage beziehungsweise deines Zugangs verwendet. Die ausführlichen Informationen findest du in der Datenschutzerklärung.",
            links: [{ label: "Datenschutzerklärung", href: `${SITE}/datenschutz` }],
        },
    },
    {
        id: "insurance_invoice",
        priority: 68,
        terms: ["krankenkasse", "versicherung", "kostenerstattung", "rechnung", "quittung", "steuer", "beleg"],
        answer: {
            text: "Auf der Homepage steht dazu keine feste Regelung. Frag Spirit Healing bitte vor der Buchung kurz nach Kostenübernahme, Rechnung oder Beleg, damit du eine verlässliche Antwort für deine Situation bekommst.",
            links: [{ label: "Frage direkt stellen", href: `${SITE}/kontakt` }],
        },
    },
    {
        id: "contact",
        priority: 50,
        terms: ["kontakt", "telefonnummer", "telefon", "e-mail-adresse", "emailadresse", "wie erreichen", "jemandem schreiben", "persönlich fragen", "persoenlich fragen"],
        answer: {
            text: "Du erreichst Spirit Healing per E-Mail unter info@spirit-healing.tr oder telefonisch unter +49 177 5022131. Über das Kontaktformular kannst du dein Anliegen auch direkt an Sabine und Selcan senden.",
            links: [
                { label: "Kontaktseite öffnen", href: `${SITE}/kontakt` },
                { label: "E-Mail schreiben", href: "mailto:info@spirit-healing.tr" },
            ],
        },
    },
];

const turkishContent = {
    emergency: {
        terms: ["intihar", "kendime zarar", "acil durum", "yaşamak istemiyorum", "yasamak istemiyorum", "hayati tehlike", "akut psikolojik kriz", "psikolojik kriz", "krizdeyim", "hemen yardım", "hemen yardim", "acil psikolojik yardım", "acil psikolojik yardim", "tehlikedeyim", "birine zarar", "kendime bir şey yapacağım", "kendime bir sey yapacagim"],
        text: "Akut bir psikolojik kriz yaşıyorsan veya kendin ya da başkaları için yakın bir tehlike varsa hemen 112'yi ara ya da uygun bir kriz ve acil yardım birimine başvur. Bu web asistanı ve normal Spirit Healing seansları acil durumlar için uygun değildir.",
    },
    missing_email: {
        terms: ["e posta gelmedi", "e-posta gelmedi", "mail gelmedi", "üyelik e postası", "uyelik e postasi", "üyelik e-postası gelmedi", "uyelik e-postasi gelmedi", "üyelik maili yok", "uyelik maili yok", "mail yok", "maili bulamıyorum", "maili bulamiyorum", "spam", "gereksiz", "onay gelmedi", "posta kutusu"],
        text: "Önce spam, gereksiz ve tanıtımlar klasörlerine bakıp posta kutunda “Spirit Healing” diye arama yap. Doğru e-posta adresini kullandığını da kontrol et. Mesaj yine yoksa üye alanından yeni şifre ya da yeni kişisel giriş bağlantısı isteyebilirsin.",
    },
    password: {
        terms: ["şifremi unuttum", "sifremi unuttum", "yeni şifre", "yeni sifre", "şifre değiştirmek", "sifre degistirmek", "giriş yapamıyorum", "giris yapamiyorum", "şifre talep"],
        text: "Üye alanını açıp “Passwort vergessen?” seçeneğini seç. E-posta adresini girdikten sonra bağlantının e-postayla gönderilmesini iste. Mesaj görünmüyorsa spam ve gereksiz klasörlerini de kontrol et.",
    },
    direct_link: {
        terms: ["direkt bağlantı", "direkt baglanti", "kişisel bağlantı", "kisisel baglanti", "giriş linki", "giris linki", "yeni link", "link kayboldu", "bağlantı kayboldu", "baglanti kayboldu", "direkt bağlantı nedir", "direkt baglanti nedir", "üye alanına direkt bağlantı", "uye alanina direkt baglanti"],
        text: "Mevcut kişisel giriş bağlantın geçerliliğini korur. Yeni bir bağlantıya ihtiyacın varsa üye alanında “Neuen Direktlink anfordern” seçeneğini aç, adını ve e-posta adresini yazıp bağlantının yeniden gönderilmesini iste.",
    },
    member_registration: {
        terms: ["nasıl üye", "nasil uye", "ücretsiz nasıl üye", "ucretsiz nasil uye", "ücretsiz kayıt", "ucretsiz kayit", "hesap açmak", "hesap acmak", "üye olmak", "uye olmak", "kayıt olmak", "kayit olmak", "üye alanına nasıl girerim", "uye alanina nasil girerim", "üye alanına nasıl gircem", "uye alanina nasil gircem", "üyelik alanına giriş", "uyelik alanina giris"],
        text: "Üye alanı ücretsizdir. Ad, e-posta adresi ve şifreyle hesabını oluşturabilirsin. Kayıttan sonra Spirit Healing'den bir e-posta gelir; gerekirse spam klasörünü de kontrol et.",
    },
    member_content: {
        terms: ["üye alanı", "uye alani", "üyelik alanı", "uyelik alani", "içinde ne var", "icinde ne var", "ücretsiz içerik", "ucretsiz icerik", "meditasyon", "kayıt", "kayit", "çalışma kitabı", "calisma kitabi"],
        text: "Ücretsiz üye alanında “Bırakma ve Arınma” ile “Yeniden Doğuş” adlı iki rehberli meditasyon, “Hayatına aslında kim karar veriyor?” sunumunun kaydı ve ona eşlik eden çalışma kitabı bulunuyor.",
    },
    member_details: {
        terms: ["sunum ne kadar uzun", "sunum kaç dakika", "sunum kac dakika", "61 dakika", "kaç sayfa", "kac sayfa", "dokuz sayfa", "9 sayfa", "premium içerik", "premium icerik", "premium alan", "daha neler gelecek"],
        text: "Üye alanındaki sunum 61 dakikadır. Ona eşlik eden çalışma kitabı, öz liderlik için düşünme soruları ve egzersizler içeren dokuz sayfadan oluşur. Yeni süreç meditasyonları, derinleştirici sunumlar ve özel canlı buluşmalar Premium içerik olarak hazırlanmaktadır.",
    },
    meditation_difference: {
        terms: ["meditasyonların farkı", "meditasyonlarin farki", "meditasyonun farkı", "meditasyonun farki", "hangi meditasyon", "bırakmak ve arınmak", "birakmak ve arinmak", "yeniden doğuş meditasyonu", "yeniden dogus meditasyonu"],
        text: "“Bırakmak ve Arınmak” bilinçli bırakma ve içsel arınmaya eşlik eder. “Yeniden Doğuş” ise geçiş, yeniden yönelme ve yeni bir içsel başlangıç içindir. İki rehberli meditasyon da ücretsiz üye alanında bulunur.",
    },
    member_downloads: {
        terms: ["meditasyon indir", "mp3 indir", "mp3 olarak indir", "çalışma kitabını indir", "calisma kitabini indir", "indirme", "çevrimdışı", "cevrimdisi"],
        text: "Giriş yaptıktan sonra çalışma kitabını üye alanından indirebilirsin. İki meditasyonu doğrudan dinlemek ve MP3 olarak kaydetmek de mümkündür.",
    },
    event_recording: {
        terms: ["hayatına kim karar", "hayatina kim karar", "sunum kaydı", "sunum kaydi", "konferans kaydı", "konferans kaydi", "sunumu izle", "canlı yayın", "canli yayin"],
        text: "“Hayatına aslında kim karar veriyor?” kaydı ve çalışma kitabı ücretsiz üye alanında bulunuyor. Sunum; içsel parçaların kararları, ertelemeyi, kontrolü, uyum sağlamayı ve geri çekilmeyi nasıl etkileyebildiğini anlaşılır biçimde anlatıyor.",
    },
    newsletter: {
        terms: ["bülten", "bulten", "newsletter", "yeni etkinlik", "yeni sunum", "seminerlerden haberdar", "abonelikten çık", "abonelikten cik"],
        text: "İsteğe bağlı e-posta bülteniyle yeni sunumlar, seminerler ve tarihler duyurulur. Kaydı ayrı bir e-postadaki bağlantıyla onaylarsın; her bültenin altındaki bağlantıdan istediğin zaman ayrılabilirsin.",
    },
    packages: {
        terms: ["3 seans paketi", "5 seans paketi", "seans paketi", "paket fiyatı", "paket fiyati", "indirim", "birden fazla seans"],
        text: "Seans paketlerinde fiyat avantajı var: 3 bireysel seans 599,40 € (%10 indirim), 5 bireysel seans 943,50 € (%15 indirim). İki uzmanla 3 ortak seans 899,10 €, 5 ortak seans 1.415,25 €.",
    },
    payment_methods: {
        terms: ["nasıl öderim", "nasil oderim", "ödeme yöntemi", "odeme yontemi", "ödeme şekli", "odeme sekli", "havale", "paypal", "kredi kartı", "kredi karti", "stripe", "nakit", "taksit", "taksitle ödeme", "taksitle odeme"],
        text: "Seans paketleri ücret ve randevu sayfasından çevrim içi satın alınabilir. Tek seanslar için hangi ödeme yöntemlerinin geçerli olduğu ya da taksit yapılıp yapılamadığı sitede kesin olarak açıklanmıyor. Rezervasyondan önce Spirit Healing'e kısaca sorman en doğrusu.",
    },
    prices: {
        terms: ["ne kadar", "ücret", "ucret", "fiyat", "maliyet", "euro", "ödeme", "odeme", "ücretsiz tanışma", "ucretsiz tanisma", "kaç para", "kac para", "seans kaç para", "seans kac para", "seans kaç euro", "seans kac euro"],
        text: "15 dakikalık tanışma görüşmesi ücretsizdir. Sabine veya Selcan ile 60 dakikalık ilk ya da takip seansı 222 €; ikisiyle birlikte 60 dakikalık ortak seans 333 €'dur. Selcan ile 150 dakikalık yoğun seans da 333 €'dur.",
    },
    duration: {
        terms: ["ne kadar sürer", "ne kadar surer", "kaç dakika", "kac dakika", "seans süresi", "seans suresi", "150 dakika", "60 dakika", "15 dakika"],
        text: "Ücretsiz tanışma görüşmesi 15 dakika sürer. Bireysel ve ortak seanslar 60 dakika, Selcan ile yoğun seans ise 150 dakikadır.",
    },
    booking: {
        terms: ["randevu al", "randevu oluştur", "randevu olustur", "randevu ayarla", "boş randevu", "bos randevu", "müsait", "musait", "takvim", "nereden randevu", "nasıl randevu alırım", "nasil randevu alirim", "randevuyu nasıl alırım", "randevuyu nasil alirim"],
        text: "Randevu sayfasında önce görüşme türünü, ardından uygun bir zamanı seçebilirsin. Ücretsiz tanışma, bireysel seanslar ve iki uzmanla ortak ilk seans doğrudan seçilebilir.",
    },
    rescheduling: {
        terms: ["randevu değiştir", "randevu degistir", "değiştirebilir", "degistirebilir", "randevuyu ertele", "başka tarih", "baska tarih", "saati değiştir", "saati degistir", "48 saat"],
        text: "Randevudan 48 saat öncesine kadar ücretsiz değişiklik yapılabilir. Randevu onayındaki bağlantıyı kullanabilir ya da desteğe ihtiyacın varsa Spirit Healing ile iletişime geçebilirsin.",
    },
    cancellation: {
        terms: ["randevu iptal", "randevumu iptal", "iptal etmek", "katılamıyorum", "katilamiyorum", "para iadesi", "ücret iadesi", "ucret iadesi", "son anda iptal", "aynı gün iptal", "ayni gun iptal", "randevuya gelemiyorum"],
        text: "Sitede randevudan 48 saat öncesine kadar ücretsiz tarih değişikliği yapılabildiği belirtiliyor. İptal veya ücret iadesi için kendi randevunun ayrıntılarını Spirit Healing ile doğrudan görüşmen en doğrusu.",
    },
    long_programs: {
        terms: ["3 aylık", "3 aylik", "6 aylık", "6 aylik", "uzun süreli", "uzun sureli", "aylarca destek", "uzun program"],
        text: "Üç ve altı aylık destek programları hazırlık aşamasındadır. İçerik, görüşme sıklığı ve ücret daha sonra kişiye özel netleştirilecektir. Şimdiden bağlayıcı olmayan ilgi kaydı bırakabilirsin.",
    },
    frequency: {
        terms: ["ne sıklıkta", "ne siklikta", "kaç seans", "kac seans", "kaç randevu", "kac randevu", "her hafta", "seans aralığı", "seans araligi", "bir seans yeter mi", "birden fazla seans"],
        text: "Herkes için geçerli sabit bir seans sıklığı yoktur. Tek bir görüşmenin yeterli olup olmadığı veya başka seansların anlamlı olup olmayacağı, konuna ve süreçte ortaya çıkanlara göre birlikte konuşulur. Üç ve altı aylık destek programları hâlen hazırlanmaktadır.",
    },
    session_fit: {
        terms: ["hangi seans", "hangisi bana uygun", "nereden başlamalı", "nereden baslamali", "hangi teklif", "kararsızım", "kararsizim", "doğru seans", "dogru seans"],
        text: "Buna tek başına karar vermek zorunda değilsin. Ücretsiz 15 dakikalık tanışmada seni meşgul eden konuyu kısaca anlatırsın; ardından bireysel, ortak veya daha uzun yoğun seansın uygun olup olmadığı birlikte netleştirilir.",
    },
    intro_call: {
        terms: ["tanışma görüşmesi", "tanisma gorusmesi", "ücretsiz tanışma", "ucretsiz tanisma", "ilk görüşme nasıl", "ilk gorusme nasil", "tanışmada ne oluyor", "tanismada ne oluyor", "sonra karar vermek", "bağlayıcı mı", "baglayici mi", "15 dakikalık tanışma", "15 dakikalik tanisma"],
        text: "Tanışma görüşmesi 15 dakika sürer ve ücretsizdir. Seni meşgul eden konuyu kısaca anlatabilir, sorularını sorabilir ve birlikte çalışmanın sana uygun olup olmadığını hissedebilirsin. Sonrasında hangi başlangıcın uygun olabileceği açıkça konuşulur; görüşmede karar vermek zorunda değilsin.",
    },
    first_followup: {
        terms: ["ilk seans", "takip seansı", "takip seansi", "ilk ve takip", "sonraki seans", "daha önce seans"],
        text: "İlk seans kapsamlı bir başlangıçtır: Konun ve önemli bağlantılar birlikte düzenlenir. Takip seansı, ilk görüşmeden sonra ortaya çıkanları ele alır ve başlayan süreci sürdürür. Her ikisi de 60 dakikadır.",
    },
    individual_joint: {
        terms: ["bireysel mi ortak", "tek mi birlikte", "ortak seans", "ikinizle", "iki uzman", "sabine ve selcan birlikte", "bireysel seans farkı", "tek mi iki kişi mi", "tek mi iki kisi mi", "tek seans mı ortak mı", "tek seans mi ortak mi"],
        text: "Bireysel seansta Sabine ya da Selcan ile çalışırsın. Ortak seansta ikisi farklı bakışlarını ve çalışma biçimlerini aynı süreçte birleştirir. Hangi biçimin uygun olduğu konuna ve kendini nerede rahat hissettiğine bağlıdır.",
    },
    couples_scope: {
        terms: ["çift seansı", "cift seansi", "çift terapisi", "cift terapisi", "eşimle gelmek", "esimle gelmek", "partnerimle gelmek", "çift olarak", "cift olarak", "ilişki danışmanlığı", "iliski danismanligi"],
        text: "Sitede bireysel seanslar ve Sabine ile Selcan'ın birlikte eşlik ettiği ortak seanslar anlatılıyor. Bir çift olarak birlikte katılımın mümkün olup olmadığı kesin biçimde belirtilmiyor. Konunuzu kısaca Spirit Healing'e yazarsanız size kişisel ve net bir yanıt verebilirler.",
    },
    intensive: {
        terms: ["yoğun seans", "yogun seans", "150 dakikalık", "150 dakikalik", "ruh parçası", "ruh parcasi"],
        text: "Selcan ile yoğun seans 150 dakika sürer ve 333 €'dur. Sistemik dizim ya da şamanik yönelimli ruh parçası geri çağırma çalışmasına dar bir zaman sınırı olmadan daha geniş alan sağlar.",
    },
    team_overview: {
        terms: ["sabine ve selcan kimdir", "siz kimsiniz", "spirit healing arkasında kim var", "spirit healing arkasinda kim var", "ekibiniz", "kendinizi tanıtın", "kendinizi tanitin", "beni kim destekliyor", "kim çalışıyor", "kim calisiyor"],
        text: "Spirit Healing, Sabine Schmidt ve Selcan Yilmaz tarafından yürütülür. Sabine koçluk, hipnoz, NLP ile içsel parça ve örüntü çalışmasını birleştirir. Selcan, Almanya'da Heilpraktikerin für Psychotherapie unvanına ve dengeleme, bireysel psikososyal destek ile yoğun duygusal durumlarda uzun yıllara dayanan deneyime sahiptir. Ortak çalışmalarında sistemik içsel parçalar çalışması ile enerji çalışmasını birleştirirler.",
    },
    choose_person: {
        terms: ["sabine mi selcan mı", "sabine mi selcan mi", "kiminle çalışmalıyım", "kiminle calismaliyim", "hangisini seçmeliyim", "hangisini secmeliyim", "sabine selcan farkı", "sabine selcan farki"],
        text: "Sabine özellikle koçluk, hipnoz, NLP, içsel parçalar ve tekrarlayan örüntülerle çalışır. Selcan; dengeleme, süreç eşliği ve duygusal olarak yoğun durumlarda geniş deneyim getirir. Ücretsiz tanışmada kimin yanında kendini daha uyumlu hissettiğini anlayabilirsin.",
    },
    sabine: {
        terms: ["sabine schmidt", "sabine ne yapıyor", "sabine ne yapiyor", "sabinenin çalışması", "sabinenin calismasi", "sabinenin eğitimi", "sabinenin egitimi"],
        text: "Sabine koçluk, hipnoz, NLP ile içsel parça ve örüntü çalışmasını birleştirir. Güçlü yanı, iç çatışmaları ve tekrarlayan örüntüleri net biçimde görüp değişimi şimdiye kadar yavaşlatan ya da güvenceye almaya çalışan parçalara ulaşmaktır.",
    },
    selcan: {
        terms: ["selcan yılmaz", "selcan yilmaz", "selcan ne yapıyor", "selcan ne yapiyor", "selcanın çalışması", "selcanin calismasi", "selcanın eğitimi", "selcanin egitimi"],
        text: "Selcan dengeleme ve süreç eşliğiyle çalışır; yoğun duygusal deneyimlerde de bütünü görmeye devam eder. Sakin ve net çalışma biçimi, aceleyle çözüm dayatmadan yön bulmaya yardımcı olur.",
    },
    help_general: {
        terms: ["hangi konularda", "neye yardımcı", "neye yardimci", "ne için gelebilirim", "ne icin gelebilirim", "kimler için", "kimler icin", "takılı kaldım", "takili kaldim", "destek olur musunuz"],
        text: "Çok düşünmene rağmen aynı yerde dönüp duruyorsan, sürekli güçlü durman gerekiyorsa, çabuk zorlanıyorsan, ilişkilerde geri çekiliyor ya da fazlaca uyum sağlıyorsan, sınırlarını hissetmekte zorlanıyor veya daha fazla netlik ve kendinle temas istiyorsan Spirit Healing sana eşlik edebilir.",
    },
    mental_health_scope: {
        terms: ["panik atak", "panik", "yoğun kaygı", "yogun kaygi", "depresyon", "depresif", "travma sonrası", "travma sonrasi", "travmayı iyileştirmek", "travmayi iyilestirmek", "beni iyileştirir misiniz", "beni iyilestirir misiniz", "psikoterapi yerine", "psikolojik tanı", "psikolojik tani"],
        text: "Yoğun kaygı, panik, depresif dönemler veya zorlayıcı deneyimler tanışma görüşmesinde açıkça konuşulabilir. Spirit Healing; duyguları, korunma örüntülerini, beden ve sinir sistemi tepkilerini anlamana eşlik edebilir. Bu desteğin senin durumuna uygun olup olmadığı kişisel olarak netleştirilmelidir; gerekli tıbbi veya psikoterapötik değerlendirme ve tedavinin yerini almaz, iyileşme vaadi vermez. Akut bir kriz veya tehlike varsa 112'yi ara.",
    },
    what_is_spirit_healing: {
        terms: ["spirit healing nedir", "spirit healing ne yapıyor", "spirit healing ne yapiyor", "yaklaşımınız nedir", "yaklasiminiz nedir", "sizin yaklaşımınız", "sizin yaklasiminiz"],
        text: "Spirit Healing; travma duyarlı süreç eşliğini içsel parçalar, ilişki örüntüleri, beden farkındalığı ve sistemik bağlantılarla birleştirir. Amaç, sıkışmış koruyucu örüntüleri anlaşılır hale getirerek daha fazla netlik, kendinle temas ve seçim alanı geliştirmene eşlik etmektir.",
    },
    parts_explained: {
        terms: ["içsel parçalar nedir", "icsel parcalar nedir", "parçalar neden oluşur", "parcalar neden olusur", "ego parçaları", "ego parcalari", "koruyucu parça", "parça çalışması nedir", "parca calismasi nedir"],
        text: "Parça çalışmasında “parça”, deneyimlerden ve onlara verilen kişisel anlamdan gelişmiş olabilecek bir iç ses, duygu hali veya korunma yoludur. Bir parça uyum sağlamaya, diğeri kontrol etmeye ya da geri çekilmeye çalışabilir. Amaç parçaları yok etmek değil, görevlerini anlamak ve daha bilinçli seçim yapabilmektir.",
    },
    self_or_part: {
        terms: ["öz mü parça mı", "oz mu parca mi", "sezgi mi korku mu", "iç sesim", "ic sesim", "beden hissi", "kendim mi karar", "içimde kim karar", "icimde kim karar"],
        text: "Bir beden hissi ya da iç ses de koruyucu bir parçadan etkilenebilir. Parça çalışmasında bu nedenle merakla bakılır: Dürtü sakin, net ve açık mı; yoksa daralmış, aceleci ve korku yüklü mü? İkisi de duyulabilir; önemli olan sonunda kararını neyin yönlendireceğidir.",
    },
    process_steps: {
        terms: ["dört adım", "dort adim", "4 adım", "4 adim", "fark etmek ayırt etmek", "fark etmek ayirt etmek", "somut olarak nasıl", "somut olarak nasil", "nasıl ilerliyorsunuz", "nasil ilerliyorsunuz"],
        text: "Çalışma dört adımda özetlenebilir: düşünce, duygu ve bedende olanı fark etmek; neyin bugüne, neyin eski bir korunma tepkisine ait olduğunu ayırt etmek; parçanın neden korumaya çalıştığını anlamak; günlük yaşamda gerçekçi ve sana uygun yeni bir adım seçmek.",
    },
    testimonials: {
        terms: ["danışan yorumları", "danisan yorumlari", "başka insanların deneyimi", "baska insanlarin deneyimi", "yorumlar", "değerlendirmeler", "degerlendirmeler", "başkaları ne diyor", "baskalari ne diyor"],
        text: "Ana sayfada Spirit Healing eşliği yaşamış kişilerin kişisel geri bildirimlerini bulabilirsin. Deneyimlerini sakin biçimde okuyup kendin için bir izlenim edinebilirsin.",
    },
    stress_exhaustion: {
        terms: ["tükendim", "tukendim", "yorgunum", "bitkin", "sürekli gergin", "surekli gergin", "iç huzursuzluk", "ic huzursuzluk", "bunaldım", "bunaldim", "hep güçlü", "rahatlayamıyorum", "rahatlayamiyorum"],
        text: "Dışarıdan devam ediyor ama içeride yorgun, gergin veya sürekli alarmda hissediyorsan travma duyarlı süreç eşliği iyi bir başlangıç olabilir. Birlikte, sistemini neyin tetikte tuttuğuna ve yeniden daha fazla sakinlik ile kendinle temas için neyin yardımcı olacağına bakılır.",
    },
    relationships: {
        terms: ["ilişki örüntüsü", "iliski oruntusu", "ilişki sorunu", "iliski sorunu", "ilişki sorunları", "iliski sorunlari", "ilişki sorunlarına", "iliski sorunlarina", "yakınlık", "yakinlik", "geri çekilme", "geri cekilme", "uyum sağlama", "uyum saglama", "sınır koymak", "sinir koymak", "sınır koyam", "sinir koyam", "hayır diyemiyorum", "hayir diyemiyorum", "terk edilme korkusu", "bağlanma korkusu", "baglanma korkusu", "yakınlık korkusu", "yakinlik korkusu"],
        text: "İlişkilerde tekrar eden örüntüler, geri çekilme, aşırı uyum, yakınlık veya sınır koyma zorluğu eşlik edilebilen konulardandır. Arkasındaki koruyucu hareket anlaşılır hale gelir ve ilişkilerde daha fazla seçim alanı geliştirmene destek olunur.",
    },
    self_worth: {
        terms: ["öz değer", "oz deger", "kendimi eleştir", "kendimi elestir", "utanç", "utanc", "yeterince iyi değilim", "yeterince iyi degilim", "kendimi yeterince iyi", "yeterince iyi", "kendimden şüphe", "kendimden suphe", "değersiz", "degersiz"],
        text: "Kendini eleştirme, utanç ve yeterince iyi olmadığın hissi süreçte yer bulabilir. Amaç bu iç seslerle savaşmak değil; önce seni neden korumaya çalıştıklarını ve bugün neye ihtiyacın olduğunu anlamaktır.",
    },
    decisions_parts: {
        terms: ["karar veremiyorum", "karar", "erteliyorum", "erteleme", "iç çatışma", "ic catisma", "bir parçam", "içsel parçalar", "icsel parcalar", "koruyucu parça", "kontrol", "öz liderlik", "oz liderlik"],
        text: "Bir parçan değişim isterken başka bir parçan frenliyorsa parça çalışması bu iç çelişkiyi anlamaya yardımcı olabilir. Üye alanındaki ücretsiz sunum, koruyucu parçaların kararları, ertelemeyi, kontrolü, uyum sağlamayı ve geri çekilmeyi nasıl etkilediğini de anlatıyor.",
    },
    numbness: {
        terms: ["içimde boşluk", "icimde bosluk", "hiçbir şey hissetmiyorum", "hicbir sey hissetmiyorum", "kopuk hissediyorum", "uyuşmuş", "uyusmus", "kendimi kaybettim", "kendimle temas yok"],
        text: "İç boşluk, kapanma ya da duygularla az temas da anlaşılır koruyucu tepkiler olabilir. Süreçte, belirli bir şeyi hissetme baskısı olmadan, şu anda fark edilebilen yerden başlanır.",
    },
    body: {
        terms: ["beden", "bedensel", "fiziksel", "ağrı", "agri", "gerginlik", "bedenim tepki", "şikayet", "sikayet"],
        text: "Bedensel tepkiler ve şikâyetler de konuşmanın parçası olabilir. Bunlarla bağlantılı olabilecek duygulara, yüklenmelere, koruyucu hareketlere veya tekrarlayan örüntülere ve başa çıkmanda neyin yardımcı olduğuna birlikte bakılır.",
    },
    trauma_sensitive: {
        terms: ["travma duyarlı", "travma duyarli", "travma hassas", "sinir sistemi", "koruyucu tepki", "güvenli alan", "guvenli alan", "baskı olmadan", "baski olmadan", "kendi hızım", "kendi hizim"],
        text: "Spirit Healing'de travma duyarlı olmak, koruyucu tepkileri hata gibi görmemek demektir. Önce bir örüntünün hangi işlevi taşıdığı ve sisteminin bugün neye ihtiyaç duyduğu anlaşılır. Hız, sınırlar ve izlenecek yol şeffaf biçimde birlikte belirlenir.",
    },
    methods_overview: {
        terms: ["hangi yöntemler", "hangi yontemler", "nasıl çalışıyorsunuz", "nasil calisiyorsunuz", "çalışma biçimi", "calisma bicimi", "yaklaşımınız", "yaklasiminiz"],
        text: "Konuya göre konuşma, beden farkındalığı, sinir sistemi, bağlanma ve ilişki örüntüleri, içsel parçalar ve sistemik bağlantılar birlikte ele alınır. Sezgisel, enerjetik veya şamanik bakışlar yalnızca senin için uygun ve anlamlıysa sürece katılır.",
    },
    coaching_location: {
        terms: ["koçluk nerede", "kocluk nerede", "danışmanlık nerede", "danismanlik nerede", "seans nerede", "koçluk online", "kocluk online", "zoom ile koçluk", "zoom ile kocluk", "yüz yüze koçluk", "yuz yuze kocluk", "nerede buluşuyoruz", "nerede bulusuyoruz"],
        text: "Koçluk ve düzenli seanslar çoğunlukla Zoom üzerinden online yapılır. Bulunduğun yerden katılabilirsin; görüşmeler Almanca veya Türkçe olabilir. Seçili yoğun seanslar ve dizim çalışmaları kişisel görüşmeyle Berlin ya da Antalya'da yüz yüze de planlanabilir.",
    },
    coaching_expectation: {
        terms: ["koçlukta beni ne bekliyor", "koclukta beni ne bekliyor", "koçlukta ne oluyor", "koclukta ne oluyor", "koçluk nasıl ilerliyor", "kocluk nasil ilerliyor", "koçlukta ne yapılıyor", "koclukta ne yapiliyor", "danışmanlıkta beni ne bekliyor", "danismanlikta beni ne bekliyor"],
        text: "Başlangıçta şu anda seni neyin etkilediği ve ne istediğin netleştirilir. Ardından konuna göre duygulara, beden farkındalığına, sinir sistemine, ilişki örüntülerine veya içsel parçalara birlikte bakılır. Katı bir program yoktur; yöntem, hız ve sınırlar seninle açık biçimde kararlaştırılır.",
    },
    coaching_therapy: {
        terms: ["koçluk ve terapi", "kocluk ve terapi", "farkı ne", "farki ne", "süreç eşliği", "surec esligi", "bütüncül terapi", "butuncul terapi", "hizmetler farkı", "hizmetler farki"],
        text: "Süreç eşliği özellikle koruyucu tepkilere, sinir sistemine, ilişkilere, sınırlara ve iç gerginliğe bakar. Bütüncül eşlik; konuşmayı, duyguları, beden farkındalığını, iç örüntüleri ve uygun diğer yöntemleri tek süreçte birleştirir. Uygun başlangıç tanışma görüşmesinde birlikte netleştirilir.",
    },
    hypnosis_nlp: {
        terms: ["hipnoz", "nlp", "nöro linguistik", "noro linguistik", "konuşma çalışması", "konusma calismasi"],
        text: "Hipnoz, NLP ve konuşma çalışması özellikle Sabine'nin kullanabildiği yollardandır. Yöntem sabit bir programa göre değil, senin konuna ve sana anlaşılır gelen yaklaşıma göre seçilir.",
    },
    constellation: {
        terms: ["aile dizimi", "sistemik dizim", "dizim çalışması", "dizim calismasi", "aile konusu", "atalar", "aile dinamiği", "aile dinamigi"],
        text: "Sistemik dizim çalışması aile içindeki veya diğer ilişkilerdeki örüntüleri görünür hale getirebilir. Daha uzun bir dizim süreci için Selcan ile 150 dakikalık yoğun seans sunulur; seçili çalışmalar anlaşmaya göre yüz yüze de yapılabilir.",
    },
    energy_spiritual: {
        terms: ["enerji çalışması", "enerji calismasi", "enerjetik", "şamanik", "samanik", "spiritüel", "spirituel", "inanmak zorunda", "ruh parçası", "ruh parcasi"],
        text: "Spiritüel olmak veya belirli bir modele inanmak zorunda değilsin. Enerji çalışması, sezgisel ya da şamanik bakışlar birer seçenektir; ön koşul değildir. Sana anlaşılır ve uygun gelen yaklaşım birlikte konuşulur.",
    },
    topic_clarity: {
        terms: ["konumun ne olduğunu", "konumun ne oldugunu", "konumun ne olduğunu bilmiyorum", "konumun ne oldugunu bilmiyorum", "sorunumu anlatamıyorum", "sorunumu anlatamiyorum", "sadece bir his", "ne olduğunu bilmiyorum", "ne oldugunu bilmiyorum", "sıkışmış hissediyorum", "sikismis hissediyorum"],
        text: "Konunu önceden tam olarak adlandırmak zorunda değilsin. Bazen yalnızca bir şeyin enerjini tükettiği, tekrar ettiği ya da içeride sıkıştığın fark edilir. O anda algılanabilen yerden birlikte başlanır.",
    },
    session_process: {
        terms: ["seans nasıl ilerliyor", "seans nasil ilerliyor", "seansta ne oluyor", "seans akışı", "seans akisi", "rezervasyondan sonra", "zoom linki", "anket", "randevu onayı", "randevu onayi", "ilk seans nasıl oluyor", "ilk seans nasil oluyor"],
        text: "Randevudan sonra onay mesajını ve Zoom bağlantısını alırsın. Görüşme türüne göre kısa bir soru formu da gelebilir. Başta o an seni meşgul eden konu netleştirilir; ardından süreç katı bir programa bağlı kalmadan ihtiyacına göre ilerler.",
    },
    preparation: {
        terms: ["nasıl hazırlan", "nasil hazirlan", "seans öncesi", "seans oncesi", "neye ihtiyacım var", "neye ihtiyacim var", "sessiz yer", "internet bağlantısı", "internet baglantisi", "seans sonrası", "seans sonrasi", "zoom gerekli mi", "zoom lazim mi", "zoom kurmak", "seanstan sonra çalışmak", "seanstan sonra calismak"],
        text: "Mümkünse seans öncesi ve sonrası biraz sakin zaman ayır; rahatsız edilmeyeceğin ve interneti sağlam bir yer seç. Çevrim içi seans için gönderilen Zoom bağlantısını açabileceğin bir cihaz gerekir. Bunun dışında özel bir hazırlık yapman veya konunu kusursuz biçimde anlatman gerekmez.",
    },
    substances: {
        terms: ["seans öncesinde alkol", "seans oncesinde alkol", "alkol", "uyuşturucu", "uyusturucu", "madde", "esrar", "sarhoş", "sarhos", "bilinç değiştirici", "bilinc degistirici"],
        text: "Lütfen seansa alkol veya bilinci değiştiren maddelerin etkisi altında katılma. Böylece seans sırasında kendini daha net algılayabilir ve kendinle temasta kalabilirsin.",
    },
    emotions: {
        terms: ["ağlarsam", "aglarsam", "duygulanırsam", "duygulanirsam", "seansta duygular", "taşarsam", "tasarsam", "kendimi tutmak"],
        text: "Seansta kendini tutmak veya güçlü görünmek zorunda değilsin. Duygulara yer vardır ve yargılanmaz. Hız, o anda kendinle temasını koruyabildiğin ölçüye göre ayarlanır.",
    },
    online_location_language: {
        terms: ["online", "yüz yüze", "yuz yuze", "zoom", "berlin", "antalya", "türkçe", "turkce", "almanca", "hangi dil", "nerede", "yurt dışından", "yurt disindan", "başka ülkeden", "baska ulkeden", "her yerden", "uzaktan katılmak", "uzaktan katilmak"],
        text: "Seanslar çoğunlukla Zoom üzerinden online yapılır ve Almanca ya da Türkçe mümkündür. Seçili yoğun seans ve dizim çalışmaları anlaşmaya göre Berlin veya Antalya'da yüz yüze de yapılabilir.",
    },
    privacy: {
        terms: ["gizli mi", "gizlilik", "veri koruma", "bilgilerim", "verilerim", "özel kalır", "ozel kalir", "mahrem"],
        text: "Spirit Healing görüşme çerçevesini gizli olarak tanımlar. İletişim veya üyelik formundaki bilgiler, talebini ya da erişimini işlemek için kullanılır. Ayrıntıları gizlilik politikasında bulabilirsin.",
    },
    insurance_invoice: {
        terms: ["sigorta", "sağlık sigortası", "saglik sigortasi", "masraf karşılar", "masraf karsilar", "fatura", "makbuz", "belge", "vergi"],
        text: "Sitede bu konuda sabit bir düzenleme belirtilmiyor. Kendi durumun için güvenilir bilgi almak üzere rezervasyondan önce ücret karşılanması, fatura veya makbuz konusunu Spirit Healing'e doğrudan sor.",
    },
    contact: {
        terms: ["iletişim", "iletisim", "telefon numarası", "telefon numarasi", "telefon", "e-posta adresi", "eposta adresi", "nasıl ulaşırım", "nasil ulasirim", "mesaj yazmak"],
        text: "Spirit Healing'e info@spirit-healing.tr adresinden veya +49 177 5022131 numaralı telefondan ulaşabilirsin. İletişim formuyla konunu doğrudan Sabine ve Selcan'a da gönderebilirsin.",
    },
};

const turkishLabels = {
    "/": "Ana sayfayı aç",
    "/mitglieder": "Üye alanını aç",
    "/prices": "Fiyatları incele",
    "/termin-buchen": "Randevu seç",
    "/kontakt": "İletişime geç",
    "/faq": "Sık sorulan soruları aç",
    "/coaching": "Süreç eşliğini incele",
    "/therapie": "Bütüncül eşliği incele",
    "/about": "Sabine ve Selcan'ı tanı",
    "/vortraege-seminare": "Sunumları incele",
    "/datenschutz": "Gizlilik politikasını aç",
    "mailto:info@spirit-healing.tr": "E-posta gönder",
};

const localizeLinks = (links, language) => {
    if (language !== "tr" || !links) return links;

    return links.map((link) => {
        const path = link.href.startsWith(SITE) ? link.href.slice(SITE.length).split("?")[0] : link.href;
        return { ...link, label: turkishLabels[path] || "Sayfayı aç" };
    });
};

const topicTitle = (intent) => {
    const firstTerm = intent.terms[0] || intent.id.replaceAll("_", " ");
    return firstTerm.charAt(0).toUpperCase() + firstTerm.slice(1);
};

export const assistantAdminCatalog = Object.freeze(intents.map((intent) => ({
    id: intent.id,
    title: topicTitle(intent),
    priority: intent.priority,
    defaults: {
        answer: {
            de: intent.answer.text,
            tr: turkishContent[intent.id].text,
        },
        terms: {
            de: intent.terms.join("\n"),
            tr: turkishContent[intent.id].terms.join("\n"),
        },
    },
})));

const getOverride = (content, intentId, field, language) => {
    const value = content?.[`assistant.${intentId}.${field}`]?.[language];
    return typeof value === "string" ? value : null;
};

const getIntentTerms = (intent, language, content) => {
    const override = getOverride(content, intent.id, "terms", language);
    if (override !== null) {
        const terms = override.split("\n").map((term) => term.trim()).filter(Boolean);
        if (terms.length > 0) return terms;
    }
    return language === "tr" ? turkishContent[intent.id]?.terms || [] : intent.terms;
};

export const normalizeAssistantText = (value) => String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9€\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const scoreTerm = (question, questionWords, rawTerm) => {
    const term = normalizeAssistantText(rawTerm);
    if (!term) return 0;

    if (question.includes(term)) {
        return 5 + term.split(" ").length * 2 + Math.min(term.length / 10, 3);
    }

    if (term.includes(" ")) return 0;
    if (term.length < 5) return 0;
    return questionWords.some((word) => {
        if (word.length < 5 || !(word.startsWith(term) || term.startsWith(word))) return false;
        return Math.min(word.length, term.length) / Math.max(word.length, term.length) >= 0.72;
    }) ? 2 : 0;
};

const answerForIntent = (intentId, language, content) => {
    const intent = intents.find(({ id }) => id === intentId);
    if (!intent) return null;

    if (language === "tr") {
        return {
            intent: intent.id,
            text: getOverride(content, intent.id, "answer", language) ?? turkishContent[intent.id].text,
            links: localizeLinks(intent.answer.links, language),
        };
    }

    return {
        intent: intent.id,
        ...intent.answer,
        text: getOverride(content, intent.id, "answer", language) ?? intent.answer.text,
    };
};

const contextualFollowUps = {
    de: [
        {
            contexts: ["coaching_location", "coaching_expectation", "coaching_therapy", "help_general"],
            terms: ["was erwartet mich da", "was passiert da", "wie geht es da weiter", "und was erwartet mich"],
            target: "coaching_expectation",
        },
        {
            contexts: ["coaching_expectation", "coaching_therapy", "session_fit", "session_process", "individual_joint", "first_followup", "intensive"],
            terms: ["wo findet das statt", "wo ist das", "ist das online", "geht das über zoom", "geht das ueber zoom"],
            target: "coaching_location",
        },
        {
            contexts: ["coaching_location", "coaching_expectation", "coaching_therapy", "session_fit", "session_process", "individual_joint", "first_followup", "intensive"],
            terms: ["was kostet das", "wie viel kostet das", "und der preis", "und die kosten"],
            target: "prices",
        },
        {
            contexts: ["coaching_location", "coaching_expectation", "coaching_therapy", "session_fit", "session_process", "individual_joint", "first_followup", "intensive"],
            terms: ["wie lange dauert das", "und wie lange", "welche dauer"],
            target: "duration",
        },
        {
            contexts: ["member_content", "member_details", "member_downloads", "event_recording", "meditation_difference"],
            terms: ["wie komme ich da rein", "wie melde ich mich dafür an", "wie melde ich mich dafuer an", "brauche ich ein konto"],
            target: "member_registration",
        },
    ],
    tr: [
        {
            contexts: ["coaching_location", "coaching_expectation", "coaching_therapy", "help_general"],
            terms: ["orada beni ne bekliyor", "orada ne oluyor", "sonra ne oluyor", "peki beni ne bekliyor"],
            target: "coaching_expectation",
        },
        {
            contexts: ["coaching_expectation", "coaching_therapy", "session_fit", "session_process", "individual_joint", "first_followup", "intensive"],
            terms: ["bu nerede yapılıyor", "bu nerede yapiliyor", "online mı", "online mi", "zoom üzerinden mi", "zoom uzerinden mi"],
            target: "coaching_location",
        },
        {
            contexts: ["coaching_location", "coaching_expectation", "coaching_therapy", "session_fit", "session_process", "individual_joint", "first_followup", "intensive"],
            terms: ["bunun ücreti ne", "bunun ucreti ne", "bu ne kadar", "peki fiyatı", "peki fiyati"],
            target: "prices",
        },
        {
            contexts: ["coaching_location", "coaching_expectation", "coaching_therapy", "session_fit", "session_process", "individual_joint", "first_followup", "intensive"],
            terms: ["bu ne kadar sürüyor", "bu ne kadar suruyor", "peki kaç dakika", "peki kac dakika"],
            target: "duration",
        },
        {
            contexts: ["member_content", "member_details", "member_downloads", "event_recording", "meditation_difference"],
            terms: ["oraya nasıl girerim", "oraya nasil girerim", "nasıl kayıt olurum", "nasil kayit olurum", "hesap gerekli mi"],
            target: "member_registration",
        },
    ],
};

export const assistantKnowledgeStats = Object.freeze({
    topicCount: intents.length,
    languages: 2,
});

export const getAssistantAnswer = (question, language = "de", contextIntent = null, content = {}) => {
    const normalized = normalizeAssistantText(question);
    const activeLanguage = language === "tr" ? "tr" : "de";

    if (activeLanguage === "de" && /^(hallo|hi|hey|guten tag|guten morgen|guten abend|moin)\b/u.test(normalized)) {
        return {
            intent: "greeting",
            text: "Hallo! Ich helfe dir bei Fragen zu Sitzungen, Preisen, Arbeitsweise, Terminen und Mitgliederbereich. Du kannst deine Frage einfach in eigenen Worten schreiben.",
        };
    }
    if (activeLanguage === "tr" && /^(merhaba|selam|hey|iyi gunler|gunaydin|iyi aksamlar)\b/u.test(normalized)) {
        return {
            intent: "greeting",
            text: "Merhaba! Seanslar, ücretler, çalışma biçimi, randevular ve üye alanı hakkındaki sorularında yardımcı olabilirim. Sorunu kendi cümlelerinle yazabilirsin.",
        };
    }
    if (activeLanguage === "de" && normalized.includes("danke")) {
        return { intent: "thanks", text: "Sehr gern. Wenn noch etwas offen ist, frag einfach weiter." };
    }
    if (activeLanguage === "tr" && (normalized.includes("tesekkur") || normalized.includes("sag ol"))) {
        return { intent: "thanks", text: "Rica ederim. Aklında başka bir şey varsa sormaya devam edebilirsin." };
    }

    const contextualMatch = contextualFollowUps[activeLanguage].find((rule) => (
        rule.contexts.includes(contextIntent)
        && rule.terms.some((term) => normalized.includes(normalizeAssistantText(term)))
    ));
    if (contextualMatch) return answerForIntent(contextualMatch.target, activeLanguage, content);

    const questionWords = normalized.split(" ").filter(Boolean);
    const ranked = intents
        .map((intent) => ({
            intent,
            score: getIntentTerms(intent, activeLanguage, content)
                .reduce((sum, term) => sum + scoreTerm(normalized, questionWords, term), 0),
        }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score || b.intent.priority - a.intent.priority);

    if (ranked.length > 0) {
        return answerForIntent(ranked[0].intent.id, activeLanguage, content);
    }

    if (activeLanguage === "tr") {
        return {
            intent: "fallback",
            text: "Bu konuda sitede henüz güvenle verebileceğim bir yanıt yok. Ücretler, seans akışı, uygun seans seçimi, yöntemler, ekip veya üye alanı hakkında sorabilir ya da Spirit Healing'e doğrudan yazabilirsin.",
            links: localizeLinks([
                { label: "Alle häufigen Fragen", href: `${SITE}/faq` },
                { label: "Kontakt aufnehmen", href: `${SITE}/kontakt` },
            ], activeLanguage),
        };
    }

    return {
        intent: "fallback",
        text: "Dazu habe ich auf der Homepage noch keine sichere Antwort. Du kannst zum Beispiel nach Preisen, Ablauf, Sitzungswahl, Methoden, Team oder Mitgliederbereich fragen – oder Spirit Healing direkt schreiben.",
        links: [
            { label: "Alle häufigen Fragen", href: `${SITE}/faq` },
            { label: "Kontakt aufnehmen", href: `${SITE}/kontakt` },
        ],
    };
};
