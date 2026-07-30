import { ExternalLink, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const SITE = "https://www.spirit-healing.tr";

const quickQuestions = [
    "Ich finde die Mitglieder-E-Mail nicht",
    "Was kosten die Sitzungen?",
    "Welche Sitzung passt zu mir?",
    "Wobei könnt ihr helfen?",
];

const knowledge = [
    {
        words: ["suizid", "selbstmord", "akute gefahr", "notfall", "nicht mehr leben"],
        answer: {
            text: "Wenn du oder jemand anderes akut in Gefahr ist, ruf bitte sofort den örtlichen Notruf 112 an. Dieser Website-Assistent kann in einer akuten Situation nicht passend helfen.",
        },
    },
    {
        words: ["spam", "e-mail nicht", "email nicht", "mail nicht", "nicht bekommen", "nicht gefunden", "postfach"],
        answer: {
            text: "Schau bitte zuerst im Spam-, Werbung- oder Junk-Ordner nach und suche in deinem Postfach nach „Spirit Healing“. Prüfe auch, ob du die richtige E-Mail-Adresse verwendet hast. Wenn die Nachricht nicht auftaucht, kannst du im Mitgliederbereich ein neues Passwort oder einen neuen Zugangslink anfordern.",
            links: [{ label: "Mitgliederbereich öffnen", href: `${SITE}/mitglieder` }],
        },
    },
    {
        words: ["passwort", "einloggen", "anmelden", "login", "zugangsdaten"],
        answer: {
            text: "Öffne den Mitgliederbereich und wähle „Passwort vergessen?“. Gib deine E-Mail-Adresse ein und klicke auf „Link per E-Mail senden“. Falls keine Nachricht erscheint, prüfe bitte auch Spam, Werbung und Junk.",
            links: [{ label: "Neues Passwort anfordern", href: `${SITE}/mitglieder?mode=forgot` }],
        },
    },
    {
        words: ["direktlink", "zugangslink", "neuen link", "alter link", "direkter link"],
        answer: {
            text: "Dein bisheriger persönlicher Direktlink bleibt gültig. Wenn du einen neuen brauchst, öffne den Mitgliederbereich und wähle „Neuen Direktlink anfordern“. Dort trägst du Name und E-Mail-Adresse ein und lässt dir den Zugangslink neu senden.",
            links: [{ label: "Direktlink anfordern", href: `${SITE}/mitglieder?mode=access` }],
        },
    },
    {
        words: ["mitgliederbereich", "mediathek", "workbook", "meditation", "vortrag", "kostenloser zugang", "aufzeichnung"],
        answer: {
            text: "Im kostenlosen Mitgliederbereich findest du zwei geführte Meditationen, die Aufzeichnung „Wer entscheidet eigentlich dein Leben?“ und das begleitende Workbook. Du kannst dich mit E-Mail und Passwort anmelden oder deinen bestehenden persönlichen Direktlink nutzen.",
            links: [{ label: "Zur kostenlosen Mediathek", href: `${SITE}/mitglieder` }],
        },
    },
    {
        words: ["paket", "mehrere sitzungen", "rabatt", "preisvorteil", "3er", "5er"],
        answer: {
            text: "Die Sitzungspakete bieten einen Preisvorteil: 3 Einzelsitzungen kosten 599,40 € (10 % Rabatt), 5 Einzelsitzungen 943,50 € (15 %). 3 gemeinsame Sitzungen kosten 899,10 €, 5 gemeinsame Sitzungen 1.415,25 €.",
            links: [{ label: "Pakete und Preise ansehen", href: `${SITE}/prices` }],
        },
    },
    {
        words: ["preis", "kosten", "kostet", "euro", "€", "bezahlen"],
        answer: {
            text: "Das 15-minütige Kennenlernen ist kostenfrei. Eine Erst- oder Folgesitzung mit Sabine oder Selcan dauert 60 Minuten und kostet 222 €. Eine gemeinsame 60-minütige Sitzung mit beiden kostet 333 €. Die 150-minütige Intensivsitzung mit Selcan kostet ebenfalls 333 €.",
            links: [
                { label: "Alle Preise ansehen", href: `${SITE}/prices` },
                { label: "Termin buchen", href: `${SITE}/termin-buchen` },
            ],
        },
    },
    {
        words: ["unterschied", "unterscheiden", "unterscheid", "einzelsitzung", "gemeinsame sitzung", "intensivsitzung", "intensivprozess", "erstsitzung", "folgesitzung"],
        answer: {
            text: "In der Erstsitzung sortiert ihr dein Anliegen und die wichtigsten Zusammenhänge. Eine Folgesitzung führt den begonnenen Prozess weiter. In der Einzelsitzung arbeitest du mit Sabine oder Selcan. In der gemeinsamen Sitzung verbinden beide ihre unterschiedlichen Blickwinkel. Die 150-minütige Intensivsitzung gibt komplexeren Aufstellungs- oder schamanisch ausgerichteten Prozessen mehr Zeit.",
            links: [{ label: "Sitzungen vergleichen", href: `${SITE}/prices` }],
        },
    },
    {
        words: ["welche sitzung", "was passt", "unsicher", "welche begleitung", "einstieg", "kennenlernen"],
        answer: {
            text: "Du musst dich nicht allein entscheiden. Im kostenfreien 15-minütigen Kennenlernen schilderst du kurz, was dich beschäftigt. Danach klärt ihr gemeinsam, ob eine Einzel-, gemeinsame oder längere Intensivsitzung sinnvoll ist.",
            links: [{ label: "Kostenfreies Kennenlernen buchen", href: `${SITE}/prices` }],
        },
    },
    {
        words: ["wobei", "helfen", "unterstützen", "anliegen", "themen", "geeignet", "feststecken", "überfordert", "funktionieren", "grenzen"],
        answer: {
            text: "Spirit Healing begleitet dich zum Beispiel, wenn du dich trotz vieler Gedanken immer wieder im Kreis drehst, ständig funktionieren musst, schnell überfordert bist, dich in Beziehungen zurückziehst oder anpasst, deine Grenzen schwer spürst oder dir mehr Klarheit und Selbstkontakt wünschst. Ihr schaut gemeinsam auf das, was sich wiederholt – ohne Bewertung und in deinem Tempo.",
            links: [{ label: "Möglichkeiten der Begleitung", href: `${SITE}/coaching` }],
        },
    },
    {
        words: ["prozessbegleitung", "integrative therapie", "therapie", "coaching", "angebote"],
        answer: {
            text: "Die Prozessbegleitung schaut besonders auf wiederkehrende Schutzmuster, Beziehungen, Grenzen und innere Anspannung. Die integrative Begleitung verbindet Gefühle, Körperwahrnehmung, Beziehungen und innere Muster zu einem Gesamtbild. Du musst die passende Überschrift nicht selbst wählen – im Kennenlernen klärt ihr, welcher Einstieg für dich stimmig ist.",
            links: [
                { label: "Prozessbegleitung", href: `${SITE}/coaching` },
                { label: "Integrative Begleitung", href: `${SITE}/therapie` },
            ],
        },
    },
    {
        words: ["ablauf", "wie läuft", "vorbereiten", "vorbereitung", "zoom-link", "zoom link", "nach der buchung"],
        answer: {
            text: "Nach der Buchung erhältst du eine Terminbestätigung und den Zoom-Link. Je nach Format kommt ein kurzer Fragebogen dazu. Plane möglichst etwas Ruhe vor und nach dem Termin ein und suche dir einen ungestörten Ort mit stabiler Internetverbindung. Du musst dein Thema nicht perfekt formulieren.",
            links: [{ label: "FAQ zum Ablauf", href: `${SITE}/faq` }],
        },
    },
    {
        words: ["spirituell", "glauben", "energiearbeit", "schamanisch"],
        answer: {
            text: "Du musst nicht spirituell sein und an kein bestimmtes Modell glauben. Spirituelle, intuitive oder energetische Perspektiven sind ein mögliches Angebot, keine Voraussetzung. Ihr besprecht gemeinsam, was für dich nachvollziehbar und stimmig ist.",
            links: [{ label: "Arbeitsweise kennenlernen", href: `${SITE}/faq` }],
        },
    },
    {
        words: ["sabine", "selcan", "wer seid", "wer sind", "team", "mit wem", "gemeinsam"],
        answer: {
            text: "Sabine arbeitet besonders mit Coaching, Hypnose, inneren Anteilen und wiederkehrenden Mustern. Selcan bringt viel Erfahrung in Stabilisierung, Prozessbegleitung und emotional anspruchsvollen Situationen mit. In gemeinsamen Sitzungen verbinden beide ihre Arbeitsweisen direkt miteinander.",
            links: [{ label: "Sabine und Selcan kennenlernen", href: `${SITE}/about` }],
        },
    },
    {
        words: ["online", "vor ort", "berlin", "antalya", "sprache", "türkisch", "deutsch", "zoom"],
        answer: {
            text: "Die Sitzungen finden überwiegend online über Zoom statt und sind auf Deutsch oder Türkisch möglich. Ausgewählte Intensiv- und Aufstellungsformate können nach Absprache auch in Berlin oder Antalya stattfinden.",
            links: [{ label: "Termine ansehen", href: `${SITE}/prices` }],
        },
    },
    {
        words: ["körper", "körperlich", "beschwerden", "schmerzen"],
        answer: {
            text: "Auch körperliche Reaktionen oder Beschwerden dürfen Teil des Gesprächs sein. Ihr schaut gemeinsam darauf, welche Gefühle, Belastungen oder wiederkehrenden Muster damit verbunden sein könnten und was dir im Umgang damit hilft.",
            links: [{ label: "Frage persönlich klären", href: `${SITE}/kontakt` }],
        },
    },
    {
        words: ["kontakt", "telefon", "e-mail-adresse", "emailadresse", "erreichen", "schreiben"],
        answer: {
            text: "Du erreichst Spirit Healing per E-Mail unter info@spirit-healing.tr oder telefonisch unter +49 177 5022131. Die Online-Begleitung ist auf Deutsch und Türkisch möglich.",
            links: [
                { label: "Kontaktseite öffnen", href: `${SITE}/kontakt` },
                { label: "E-Mail schreiben", href: "mailto:info@spirit-healing.tr" },
            ],
        },
    },
];

const normalize = (value) => value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const getAnswer = (question) => {
    const normalized = normalize(question);

    if (/^(hallo|hi|hey|guten|moin)/u.test(normalized)) {
        return { text: "Hallo! Ich helfe dir bei Fragen zu Sitzungen, Preisen, Ablauf und Mitgliederbereich. Was möchtest du wissen?" };
    }
    if (normalized.includes("danke")) {
        return { text: "Sehr gern. Wenn noch etwas offen ist, frag einfach weiter." };
    }

    const match = knowledge.find((item) => item.words.some((word) => normalized.includes(normalize(word))));
    return match?.answer || {
        text: "Dazu habe ich auf der Homepage keine sichere Antwort gefunden. Schreib Spirit Healing gern kurz, worum es geht – Sabine oder Selcan melden sich persönlich bei dir.",
        links: [{ label: "Kontakt aufnehmen", href: `${SITE}/kontakt` }],
    };
};

export const WebsiteAssistant = () => {
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState("");
    const [typing, setTyping] = useState(false);
    const [messages, setMessages] = useState([{
        id: 1,
        role: "assistant",
        text: "Hallo, schön, dass du da bist. Ich helfe dir bei Fragen zu Begleitung, Preisen, Terminen und Mitgliederbereich – kurz und verständlich.",
    }]);
    const inputRef = useRef(null);
    const messageEndRef = useRef(null);
    const nextId = useRef(2);

    useEffect(() => {
        if (open) inputRef.current?.focus();
    }, [open]);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, [messages, typing]);

    useEffect(() => {
        const closeOnEscape = (event) => {
            if (event.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", closeOnEscape);
        return () => window.removeEventListener("keydown", closeOnEscape);
    }, []);

    const sendMessage = (value) => {
        const question = value.trim();
        if (!question || typing) return;

        setMessages((current) => [...current, { id: nextId.current++, role: "user", text: question }]);
        setDraft("");
        setTyping(true);

        window.setTimeout(() => {
            setMessages((current) => [...current, { id: nextId.current++, role: "assistant", ...getAnswer(question) }]);
            setTyping(false);
        }, 420);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        sendMessage(draft);
    };

    return (
        <div className="site-assistant" data-no-translate="true">
            {open ? (
                <section className="site-assistant__panel" role="dialog" aria-modal="false" aria-labelledby="site-assistant-title">
                    <header className="site-assistant__header">
                        <span className="site-assistant__avatar" aria-hidden="true"><Sparkles /></span>
                        <div>
                            <strong id="site-assistant-title">Spirit Healing – Hilfe</strong>
                            <span><i aria-hidden="true" /> Online · antwortet sofort</span>
                        </div>
                        <button type="button" onClick={() => setOpen(false)} aria-label="Hilfe schließen"><X /></button>
                    </header>

                    <div className="site-assistant__messages" aria-live="polite">
                        {messages.map((message) => (
                            <div className={`site-assistant__message site-assistant__message--${message.role}`} key={message.id}>
                                {message.role === "assistant" && <span className="site-assistant__mini-avatar" aria-hidden="true">SH</span>}
                                <div className="site-assistant__bubble">
                                    <p>{message.text}</p>
                                    {message.links?.length > 0 && (
                                        <div className="site-assistant__links">
                                            {message.links.map((link) => (
                                                <a href={link.href} key={`${message.id}-${link.href}`}>
                                                    {link.label}<ExternalLink aria-hidden="true" />
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {typing && (
                            <div className="site-assistant__message site-assistant__message--assistant" aria-label="Antwort wird geschrieben">
                                <span className="site-assistant__mini-avatar" aria-hidden="true">SH</span>
                                <span className="site-assistant__typing" aria-hidden="true"><i /><i /><i /></span>
                            </div>
                        )}
                        <div ref={messageEndRef} />
                    </div>

                    <div className="site-assistant__questions" aria-label="Vorgeschlagene Fragen">
                        {quickQuestions.map((question) => (
                            <button type="button" key={question} onClick={() => sendMessage(question)} disabled={typing}>{question}</button>
                        ))}
                    </div>

                    <form className="site-assistant__form" onSubmit={handleSubmit}>
                        <label className="sr-only" htmlFor="site-assistant-input">Deine Frage</label>
                        <input
                            ref={inputRef}
                            id="site-assistant-input"
                            value={draft}
                            onChange={(event) => setDraft(event.target.value)}
                            placeholder="Schreib deine Frage …"
                            autoComplete="off"
                            maxLength={320}
                        />
                        <button type="submit" disabled={!draft.trim() || typing} aria-label="Nachricht senden"><Send /></button>
                    </form>
                    <p className="site-assistant__note">Automatische Hilfe mit Antworten aus der Spirit-Healing-Homepage</p>
                </section>
            ) : (
                <button className="site-assistant__launcher" type="button" onClick={() => setOpen(true)} aria-expanded="false" aria-label="Spirit-Healing-Hilfe öffnen">
                    <span className="site-assistant__launcher-icon" aria-hidden="true"><MessageCircle /></span>
                    <span><small>Fragen?</small>Wir helfen dir weiter</span>
                    <span className="site-assistant__status" aria-hidden="true" />
                </button>
            )}
        </div>
    );
};
