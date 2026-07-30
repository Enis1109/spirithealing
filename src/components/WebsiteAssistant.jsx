import { ExternalLink, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { assistantQuickQuestions, getAssistantAnswer } from "@/components/assistantKnowledge";

const interfaceCopy = {
    de: {
        greeting: "Hallo, schön, dass du da bist. Ich helfe dir bei Fragen zu Begleitung, Preisen, Terminen und Mitgliederbereich – kurz und verständlich.",
        title: "Spirit Healing – Hilfe",
        online: "Online · antwortet sofort",
        close: "Hilfe schließen",
        typing: "Antwort wird geschrieben",
        suggestions: "Vorgeschlagene Fragen",
        question: "Deine Frage",
        placeholder: "Schreib deine Frage …",
        send: "Nachricht senden",
        note: "Automatische Hilfe mit Antworten aus der Spirit-Healing-Homepage",
        open: "Spirit-Healing-Hilfe öffnen",
        prompt: "Fragen?",
        help: "Wir helfen dir weiter",
    },
    tr: {
        greeting: "Merhaba, hoş geldin. Danışmanlık, ücretler, randevular ve üye alanı hakkındaki sorularına kısa ve anlaşılır yanıtlar veriyorum.",
        title: "Spirit Healing – Yardım",
        online: "Çevrimiçi · hemen yanıtlar",
        close: "Yardımı kapat",
        typing: "Yanıt yazılıyor",
        suggestions: "Önerilen sorular",
        question: "Sorun",
        placeholder: "Sorunu yaz …",
        send: "Mesaj gönder",
        note: "Spirit Healing web sitesindeki bilgilere dayalı otomatik yardım",
        open: "Spirit Healing yardımını aç",
        prompt: "Sorun mu var?",
        help: "Sana yardımcı olalım",
    },
};

export const WebsiteAssistant = () => {
    const [open, setOpen] = useState(false);
    const [assistantLanguage, setAssistantLanguage] = useState("de");
    const [draft, setDraft] = useState("");
    const [typing, setTyping] = useState(false);
    const [messages, setMessages] = useState([{
        id: 1,
        role: "assistant",
        text: interfaceCopy.de.greeting,
    }]);
    const inputRef = useRef(null);
    const messageEndRef = useRef(null);
    const nextId = useRef(2);
    const responseTimerRef = useRef(null);
    const lastIntentRef = useRef(null);
    const copy = interfaceCopy[assistantLanguage];

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
        return () => {
            window.removeEventListener("keydown", closeOnEscape);
            if (responseTimerRef.current) window.clearTimeout(responseTimerRef.current);
        };
    }, []);

    const switchLanguage = (language) => {
        if (language === assistantLanguage) return;
        if (responseTimerRef.current) window.clearTimeout(responseTimerRef.current);
        setAssistantLanguage(language);
        setDraft("");
        setTyping(false);
        lastIntentRef.current = null;
        setMessages([{ id: nextId.current++, role: "assistant", text: interfaceCopy[language].greeting }]);
    };

    const sendMessage = (value) => {
        const question = value.trim();
        if (!question || typing) return;

        setMessages((current) => [...current, { id: nextId.current++, role: "user", text: question }]);
        setDraft("");
        setTyping(true);

        responseTimerRef.current = window.setTimeout(() => {
            const answer = getAssistantAnswer(question, assistantLanguage, lastIntentRef.current);
            if (!["fallback", "greeting", "thanks"].includes(answer.intent)) lastIntentRef.current = answer.intent;
            setMessages((current) => [...current, { id: nextId.current++, role: "assistant", ...answer }]);
            setTyping(false);
            responseTimerRef.current = null;
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
                        <div className="site-assistant__identity">
                            <strong id="site-assistant-title">{copy.title}</strong>
                            <span><i aria-hidden="true" /> {copy.online}</span>
                        </div>
                        <div className="site-assistant__header-actions">
                            <div className="site-assistant__language" aria-label="Deutsch oder Türkçe">
                                <button type="button" className={assistantLanguage === "de" ? "is-active" : ""} onClick={() => switchLanguage("de")} aria-pressed={assistantLanguage === "de"}>DE</button>
                                <button type="button" className={assistantLanguage === "tr" ? "is-active" : ""} onClick={() => switchLanguage("tr")} aria-pressed={assistantLanguage === "tr"}>TR</button>
                            </div>
                            <button className="site-assistant__close" type="button" onClick={() => setOpen(false)} aria-label={copy.close}><X /></button>
                        </div>
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
                            <div className="site-assistant__message site-assistant__message--assistant" aria-label={copy.typing}>
                                <span className="site-assistant__mini-avatar" aria-hidden="true">SH</span>
                                <span className="site-assistant__typing" aria-hidden="true"><i /><i /><i /></span>
                            </div>
                        )}
                        <div ref={messageEndRef} />
                    </div>

                    <div className="site-assistant__questions" aria-label={copy.suggestions}>
                        {assistantQuickQuestions[assistantLanguage].map((question) => (
                            <button type="button" key={question} onClick={() => sendMessage(question)} disabled={typing}>{question}</button>
                        ))}
                    </div>

                    <form className="site-assistant__form" onSubmit={handleSubmit}>
                        <label className="sr-only" htmlFor="site-assistant-input">{copy.question}</label>
                        <input
                            ref={inputRef}
                            id="site-assistant-input"
                            value={draft}
                            onChange={(event) => setDraft(event.target.value)}
                            placeholder={copy.placeholder}
                            autoComplete="off"
                            maxLength={320}
                        />
                        <button type="submit" disabled={!draft.trim() || typing} aria-label={copy.send}><Send /></button>
                    </form>
                    <p className="site-assistant__note">{copy.note}</p>
                </section>
            ) : (
                <button className="site-assistant__launcher" type="button" onClick={() => setOpen(true)} aria-expanded="false" aria-label={copy.open}>
                    <span className="site-assistant__launcher-icon" aria-hidden="true"><MessageCircle /></span>
                    <span><small>{copy.prompt}</small>{copy.help}</span>
                    <span className="site-assistant__status" aria-hidden="true" />
                </button>
            )}
        </div>
    );
};
