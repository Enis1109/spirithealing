import {
    ArrowLeft,
    ArrowRight,
    Check,
    CheckCircle2,
    Clock3,
    HeartHandshake,
    Leaf,
    LockKeyhole,
    Mail,
    ShieldCheck,
    Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const initialForm = {
    name: "",
    email: "",
    phone: "",
    topicAreas: [],
    mainTopic: "",
    recentScene: "",
    desiredChange: "",
    goalStatement: "",
    goalScore: "",
    confidenceScore: "",
    trigger: "",
    automaticMeaning: "",
    feelings: "",
    feelingIntensity: "",
    bodyResponse: "",
    typicalResponse: "",
    shortTermProtection: "",
    longTermCost: "",
    patternFrequency: "",
    fearedConsequence: "",
    exceptions: "",
    identityStatement: "",
    othersStatement: "",
    worldStatement: "",
    mustStatement: "",
    mustNotStatement: "",
    earlyEcho: "",
    h01: "",
    h02: "",
    h03: "",
    h04: "",
    h05: "",
    b01: "",
    b02: "",
    b03: "",
    stability: "",
    professionalSupport: "keine_angabe",
    safeSupport: "",
    resources: "",
    crisisContact: "",
    privacyConsent: false,
    nonMedicalAcknowledgement: false,
    aggregateConsent: false,
    company: "",
};

const steps = [
    { title: "Du & dein Anliegen", short: "Anliegen" },
    { title: "Dein Ziel", short: "Ziel" },
    { title: "Dein Muster", short: "Muster" },
    { title: "Innere Logik", short: "Logik" },
    { title: "Ausgangspunkt", short: "Messwerte" },
    { title: "Sicherer Rahmen", short: "Rahmen" },
];

const scoreFieldsByStep = {
    1: ["goalScore", "confidenceScore"],
    2: ["feelingIntensity"],
    4: ["h01", "h02", "h03", "h04", "h05", "b01", "b02", "b03"],
};

const topicOptions = [
    ["beziehungen", "Beziehungen & Nähe"],
    ["selbstwert", "Selbstwert & Selbstvertrauen"],
    ["grenzen", "Grenzen & Bedürfnisse"],
    ["entscheidungen", "Entscheidungen & Klarheit"],
    ["koerper", "Körper & Wohlbefinden"],
    ["beruf", "Beruf & Wirken"],
    ["geld", "Geld & Sicherheit"],
    ["familie", "Familie & Prägungen"],
    ["verlust", "Verlust & Veränderung"],
    ["anderes", "Etwas anderes"],
];

const inputClass = "mt-2 min-h-12 w-full rounded-2xl border border-[#0f8b8d]/25 bg-white px-4 py-3 text-[#173f40] outline-none transition placeholder:text-[#789091] focus:border-[#0f8b8d] focus:ring-2 focus:ring-[#0f8b8d]/20";
const labelClass = "block text-sm font-bold text-[#173f40]";

const TextField = ({ label, name, value, onChange, required = true, type = "text", autoComplete, hint, maxLength = 2500 }) => (
    <label className={labelClass}>
        <span>{label}{required && <span className="ml-1 text-[#a05a35]" aria-hidden="true">*</span>}</span>
        {hint && <span className="mt-1 block font-normal leading-6 text-[#648082]">{hint}</span>}
        <input
            className={inputClass}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            autoComplete={autoComplete}
            maxLength={maxLength}
        />
    </label>
);

const TextArea = ({ label, name, value, onChange, required = true, hint, rows = 4, maxLength = 2500, placeholder }) => (
    <label className={labelClass}>
        <span>{label}{required && <span className="ml-1 text-[#a05a35]" aria-hidden="true">*</span>}</span>
        {hint && <span className="mt-1 block font-normal leading-6 text-[#648082]">{hint}</span>}
        <textarea
            className={`${inputClass} resize-y leading-7`}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            rows={rows}
            maxLength={maxLength}
            placeholder={placeholder}
        />
    </label>
);

const ScoreField = ({ name, label, value, onChange, low = "gar nicht", high = "voll und ganz" }) => (
    <fieldset className="rounded-2xl border border-[#0f8b8d]/18 bg-white p-4 sm:p-5">
        <legend className="px-1 text-sm font-bold leading-6 text-[#173f40]">{label}<span className="ml-1 text-[#a05a35]" aria-hidden="true">*</span></legend>
        <div className="mt-3 grid grid-cols-6 gap-2 sm:grid-cols-11" role="radiogroup" aria-label={label}>
            {Array.from({ length: 11 }, (_, number) => (
                <button
                    key={number}
                    type="button"
                    role="radio"
                    aria-checked={value !== "" && Number(value) === number}
                    onClick={() => onChange(name, number)}
                    className={`flex h-10 min-w-10 items-center justify-center rounded-xl border text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-[#0f8b8d]/30 ${Number(value) === number && value !== "" ? "border-[#0f8b8d] bg-[#0f8b8d] text-white" : "border-[#0f8b8d]/20 bg-[#f8fcfb] text-[#426466] hover:border-[#0f8b8d]"}`}
                >{number}</button>
            ))}
        </div>
        <div className="mt-2 flex justify-between gap-4 text-xs text-[#648082]"><span>0 = {low}</span><span className="text-right">10 = {high}</span></div>
    </fieldset>
);

const RadioCards = ({ legend, name, value, onChange, options, required = true }) => (
    <fieldset>
        <legend className="text-sm font-bold text-[#173f40]">{legend}{required && <span className="ml-1 text-[#a05a35]" aria-hidden="true">*</span>}</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {options.map(([optionValue, label]) => (
                <label key={optionValue} className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition ${value === optionValue ? "border-[#0f8b8d] bg-[#e4f2ef]" : "border-[#0f8b8d]/18 bg-white hover:border-[#0f8b8d]/50"}`}>
                    <input type="radio" name={name} value={optionValue} checked={value === optionValue} onChange={onChange} required={required} className="h-4 w-4 accent-[#0f8b8d]" />
                    <span className="font-semibold text-[#315658]">{label}</span>
                </label>
            ))}
        </div>
    </fieldset>
);

const StepShell = ({ eyebrow, title, intro, children }) => (
    <section>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0f8b8d]">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-bold leading-tight text-[#173f40] sm:text-4xl">{title}</h2>
        <p className="mt-3 max-w-3xl leading-7 text-[#5d797b]">{intro}</p>
        <div className="mt-7 space-y-6">{children}</div>
    </section>
);

export const OnboardingQuestionnaire = () => {
    const [form, setForm] = useState(initialForm);
    const [step, setStep] = useState(0);
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");
    const [reference, setReference] = useState("");
    const stepRef = useRef(null);

    useEffect(() => {
        const previousTitle = document.title;
        const robots = document.querySelector('meta[name="robots"]');
        const previousRobots = robots?.getAttribute("content");
        document.title = "Startfragebogen | Spirit Healing";
        robots?.setAttribute("content", "noindex, nofollow");
        return () => {
            document.title = previousTitle;
            if (robots && previousRobots) robots.setAttribute("content", previousRobots);
        };
    }, []);

    const setValue = (name, value) => setForm((current) => ({ ...current, [name]: value }));
    const handleChange = (event) => {
        const { name, type, checked, value } = event.target;
        setValue(name, type === "checkbox" ? checked : value);
    };

    const toggleTopic = (topic) => setForm((current) => ({
        ...current,
        topicAreas: current.topicAreas.includes(topic)
            ? current.topicAreas.filter((item) => item !== topic)
            : current.topicAreas.length < 5 ? [...current.topicAreas, topic] : current.topicAreas,
    }));

    const validateCurrentStep = () => {
        setError("");
        const invalid = [...(stepRef.current?.querySelectorAll("input, textarea, select") || [])]
            .find((element) => !element.checkValidity());
        if (invalid) {
            invalid.reportValidity();
            return false;
        }
        if (step === 0 && form.topicAreas.length === 0) {
            setError("Bitte wähle mindestens einen Lebensbereich aus.");
            return false;
        }
        const missingScore = (scoreFieldsByStep[step] || []).find((field) => form[field] === "");
        if (missingScore) {
            setError("Bitte beantworte alle Skalenfragen auf dieser Seite.");
            return false;
        }
        return true;
    };

    const next = () => {
        if (!validateCurrentStep()) return;
        setStep((current) => Math.min(current + 1, steps.length - 1));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const previous = () => {
        setError("");
        setStep((current) => Math.max(current - 1, 0));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const submit = async (event) => {
        event.preventDefault();
        if (!validateCurrentStep()) return;
        setStatus("submitting");
        setError("");
        try {
            const response = await fetch("/api/zepter/onboarding", {
                method: "POST",
                credentials: "same-origin",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify(form),
            });
            const result = await response.json().catch(() => ({}));
            if (!response.ok || !result.ok) throw new Error(result.error || "request_failed");
            setReference(result.reference || "");
            setStatus("success");
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch {
            setStatus("idle");
            setError("Deine Antworten konnten gerade nicht sicher gespeichert werden. Bitte versuche es noch einmal. Wenn es erneut nicht klappt, melde dich direkt bei Sabine oder Selcan.");
        }
    };

    if (status === "success") return (
        <main className="min-h-screen bg-[#eaf4f1] px-4 py-10 text-[#173f40] sm:py-16" data-no-translate>
            <section className="mx-auto max-w-2xl overflow-hidden rounded-[2rem] bg-[#fffaf2] shadow-2xl shadow-[#173f40]/12">
                <div className="bg-[#075f62] px-6 py-10 text-center text-white sm:px-10">
                    <CheckCircle2 className="mx-auto h-16 w-16 text-[#e8ca67]" />
                    <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#e8ca67]">Alles angekommen</p>
                    <h1 className="mt-3 text-4xl font-bold">Danke für dein Vertrauen.</h1>
                </div>
                <div className="p-7 text-center sm:p-10">
                    <p className="text-lg leading-8 text-[#4e6d6e]">Sabine und Selcan können sich nun in Ruhe auf euer Startgespräch vorbereiten. Eine Eingangsbestätigung ist auf dem Weg an deine E-Mail-Adresse.</p>
                    {reference && <p className="mx-auto mt-6 w-fit rounded-full bg-[#f3e8bf] px-5 py-2 text-sm font-bold text-[#6a5925]">Referenz: {reference}</p>}
                    <p className="mt-7 text-sm leading-6 text-[#648082]">Du musst jetzt nichts weiter tun. Wir freuen uns auf euren Termin.</p>
                    <Link to="/" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[#0f8b8d] px-7 font-bold text-white transition hover:bg-[#0a6f71]">Zur Spirit-Healing-Seite</Link>
                </div>
            </section>
        </main>
    );

    return (
        <main className="min-h-screen bg-[#eaf4f1] text-[#173f40]" data-no-translate>
            <header className="border-b border-[#0f8b8d]/15 bg-[#fffaf2]">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
                    <Link to="/" className="flex items-center gap-3">
                        <img src="/Logo-tuerkis.jpeg" alt="Spirit Healing" className="h-12 w-12 rounded-full object-cover" />
                        <div><strong className="block">Spirit Healing</strong><span className="text-sm text-[#648082]">8 Wochen Begleitung</span></div>
                    </Link>
                    <span className="hidden items-center gap-2 text-sm font-semibold text-[#4e6d6e] sm:flex"><LockKeyhole className="h-4 w-4 text-[#0f8b8d]" /> Vertraulich</span>
                </div>
            </header>

            <div className="mx-auto grid max-w-6xl gap-6 px-4 py-7 sm:px-6 sm:py-10 lg:grid-cols-[280px_minmax(0,1fr)]">
                <aside className="h-fit rounded-[1.75rem] bg-[#075f62] p-5 text-white shadow-xl sm:p-6 lg:sticky lg:top-6">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e8ca67]">Deine Vorbereitung</p>
                    <h1 className="mt-3 text-3xl font-bold leading-tight">Startfragebogen</h1>
                    <p className="mt-4 leading-7 text-white/75">Damit wir im Gespräch schneller bei dem ankommen, was dich wirklich bewegt.</p>
                    <div className="mt-6 space-y-3 border-y border-white/15 py-5 text-sm text-white/80">
                        <p className="flex items-center gap-3"><Clock3 className="h-5 w-5 shrink-0 text-[#e8ca67]" /> etwa 15–20 Minuten</p>
                        <p className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 shrink-0 text-[#e8ca67]" /> geschützt & vertraulich</p>
                        <p className="flex items-center gap-3"><HeartHandshake className="h-5 w-5 shrink-0 text-[#e8ca67]" /> kein Richtig oder Falsch</p>
                    </div>
                    <ol className="mt-6 hidden space-y-3 lg:block">
                        {steps.map((item, index) => (
                            <li key={item.short} className={`flex items-center gap-3 text-sm ${index <= step ? "text-white" : "text-white/45"}`}>
                                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${index < step ? "border-[#e8ca67] bg-[#e8ca67] text-[#173f40]" : index === step ? "border-white bg-white text-[#075f62]" : "border-white/25"}`}>{index < step ? <Check className="h-4 w-4" /> : index + 1}</span>
                                <span>{item.short}</span>
                            </li>
                        ))}
                    </ol>
                </aside>

                <form onSubmit={submit} className="overflow-hidden rounded-[1.75rem] bg-[#fffaf2] shadow-xl shadow-[#173f40]/8">
                    <div className="h-2 bg-[#dce8e5]"><div className="h-full bg-[#d4af37] transition-all" style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
                    <div ref={stepRef} className="p-6 sm:p-9 lg:p-11">
                        {step === 0 && (
                            <StepShell eyebrow="Schritt 1 von 6" title="Du und dein Anliegen" intro="Nimm dir kurz Zeit und antworte so konkret, wie es heute für dich stimmig ist. Deine Angaben dienen der Vorbereitung eures persönlichen Startgesprächs.">
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <TextField label="Vor- und Nachname" name="name" value={form.name} onChange={handleChange} autoComplete="name" maxLength={100} />
                                    <TextField label="E-Mail-Adresse" name="email" type="email" value={form.email} onChange={handleChange} autoComplete="email" maxLength={254} />
                                </div>
                                <TextField label="Telefonnummer" name="phone" type="tel" value={form.phone} onChange={handleChange} autoComplete="tel" required={false} hint="Optional – nur falls wir dich rund um deinen Termin erreichen müssen." maxLength={40} />
                                <fieldset>
                                    <legend className="text-sm font-bold">Welche Lebensbereiche berührt dein Thema?<span className="ml-1 text-[#a05a35]" aria-hidden="true">*</span></legend>
                                    <p className="mt-1 text-sm text-[#648082]">Du kannst bis zu fünf Bereiche auswählen.</p>
                                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                        {topicOptions.map(([value, label]) => {
                                            const selected = form.topicAreas.includes(value);
                                            return <button key={value} type="button" aria-pressed={selected} onClick={() => toggleTopic(value)} className={`flex min-h-12 items-center gap-3 rounded-2xl border px-4 text-left font-semibold transition ${selected ? "border-[#0f8b8d] bg-[#e4f2ef] text-[#075f62]" : "border-[#0f8b8d]/18 bg-white text-[#426466] hover:border-[#0f8b8d]/50"}`}><span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${selected ? "border-[#0f8b8d] bg-[#0f8b8d] text-white" : "border-[#0f8b8d]/35"}`}>{selected && <Check className="h-3.5 w-3.5" />}</span>{label}</button>;
                                        })}
                                    </div>
                                </fieldset>
                                <TextArea label="Worum geht es für dich im Kern?" name="mainTopic" value={form.mainTopic} onChange={handleChange} hint="Beschreibe in deinen Worten, was dich im Moment am meisten beschäftigt." />
                            </StepShell>
                        )}

                        {step === 1 && (
                            <StepShell eyebrow="Schritt 2 von 6" title="Woran würdest du Veränderung erkennen?" intro="Ein greifbares Ziel hilft uns später zu sehen, was sich für dich tatsächlich bewegt hat.">
                                <TextArea label="Erinnere dich an eine konkrete Situation aus der letzten Zeit, in der dein Thema deutlich wurde. Was ist passiert?" name="recentScene" value={form.recentScene} onChange={handleChange} />
                                <TextArea label="Was möchtest du in einer ähnlichen Situation künftig anders erleben oder tun können?" name="desiredChange" value={form.desiredChange} onChange={handleChange} />
                                <TextArea label="Formuliere dein persönliches Ziel in einem Satz." name="goalStatement" value={form.goalStatement} onChange={handleChange} rows={3} maxLength={800} placeholder="Am Ende der acht Wochen möchte ich …" />
                                <ScoreField name="goalScore" label="Wie sehr lebst du dieses Ziel heute bereits?" value={form.goalScore} onChange={setValue} low="noch gar nicht" high="bereits vollständig" />
                                <ScoreField name="confidenceScore" label="Wie zuversichtlich bist du heute, dass du dieses Ziel erreichen kannst?" value={form.confidenceScore} onChange={setValue} low="gar nicht zuversichtlich" high="sehr zuversichtlich" />
                            </StepShell>
                        )}

                        {step === 2 && (
                            <StepShell eyebrow="Schritt 3 von 6" title="Was läuft in solchen Momenten automatisch ab?" intro="Wir suchen noch keine Lösung. Wir sammeln zunächst die einzelnen Teile deines Musters, damit wir sie im Gespräch gemeinsam einordnen können.">
                                <TextArea label="Was löst das Muster typischerweise aus?" name="trigger" value={form.trigger} onChange={handleChange} hint="Zum Beispiel eine Situation, ein Satz, ein Verhalten oder ein innerer Gedanke." />
                                <TextArea label="Was bedeutet dieser Moment für dich – ganz automatisch?" name="automaticMeaning" value={form.automaticMeaning} onChange={handleChange} hint="Welcher schnelle Schluss entsteht in dir, noch bevor du bewusst darüber nachdenkst?" />
                                <TextArea label="Welche Gefühle tauchen auf?" name="feelings" value={form.feelings} onChange={handleChange} rows={3} maxLength={800} />
                                <ScoreField name="feelingIntensity" label="Wie stark sind diese Gefühle meistens?" value={form.feelingIntensity} onChange={setValue} low="kaum spürbar" high="sehr stark" />
                                <TextArea label="Wo oder wie bemerkst du es in deinem Körper?" name="bodyResponse" value={form.bodyResponse} onChange={handleChange} required={false} rows={3} maxLength={800} hint="Optional – zum Beispiel Enge, Druck, Unruhe, Erstarren oder Erschöpfung." />
                                <TextArea label="Was tust du dann – oder was vermeidest du?" name="typicalResponse" value={form.typicalResponse} onChange={handleChange} />
                                <RadioCards legend="Wie häufig begegnet dir dieses Muster ungefähr?" name="patternFrequency" value={form.patternFrequency} onChange={handleChange} options={[["selten", "Seltener"], ["monatlich", "Etwa monatlich"], ["woechentlich", "Etwa wöchentlich"], ["mehrmals_woechentlich", "Mehrmals pro Woche"], ["taeglich", "Fast täglich"]]} />
                            </StepShell>
                        )}

                        {step === 3 && (
                            <StepShell eyebrow="Schritt 4 von 6" title="Die innere Logik deines Musters" intro="Auch ein belastendes Muster hatte oder hat meist eine Schutzfunktion. Diese Fragen helfen uns, sie behutsam sichtbar zu machen.">
                                <TextArea label="Wovor schützt dich deine Reaktion kurzfristig?" name="shortTermProtection" value={form.shortTermProtection} onChange={handleChange} />
                                <TextArea label="Was kostet dich dieses Muster auf längere Sicht?" name="longTermCost" value={form.longTermCost} onChange={handleChange} />
                                <TextArea label="Was befürchtest du, würde passieren, wenn du nicht mehr wie gewohnt reagieren würdest?" name="fearedConsequence" value={form.fearedConsequence} onChange={handleChange} />
                                <TextArea label="Gibt es Ausnahmen – Momente, in denen das Muster schwächer ist oder du schon anders handeln kannst?" name="exceptions" value={form.exceptions} onChange={handleChange} required={false} />
                                <div className="rounded-3xl bg-[#e8f3f0] p-5 sm:p-6">
                                    <p className="font-bold text-[#075f62]">Vervollständige die Sätze spontan.</p>
                                    <p className="mt-1 text-sm leading-6 text-[#648082]">Es geht nicht um perfekte Formulierungen, sondern um das, was zuerst auftaucht.</p>
                                    <div className="mt-5 space-y-4">
                                        <TextField label="Ich bin …" name="identityStatement" value={form.identityStatement} onChange={handleChange} maxLength={800} />
                                        <TextField label="Andere Menschen sind …" name="othersStatement" value={form.othersStatement} onChange={handleChange} maxLength={800} />
                                        <TextField label="Die Welt ist …" name="worldStatement" value={form.worldStatement} onChange={handleChange} maxLength={800} />
                                        <TextField label="Deshalb muss ich …" name="mustStatement" value={form.mustStatement} onChange={handleChange} maxLength={800} />
                                        <TextField label="Ich darf nicht …" name="mustNotStatement" value={form.mustNotStatement} onChange={handleChange} maxLength={800} />
                                    </div>
                                </div>
                                <TextArea label="Erinnert dich dieses Muster an etwas aus deiner früheren Geschichte oder deiner Familie?" name="earlyEcho" value={form.earlyEcho} onChange={handleChange} required={false} hint="Optional. Du entscheidest selbst, was du an dieser Stelle teilen möchtest." />
                            </StepShell>
                        )}

                        {step === 4 && (
                            <StepShell eyebrow="Schritt 5 von 6" title="Dein Ausgangspunkt heute" intro="Bitte beziehe dich auf die vergangenen 14 Tage. Dieselben Fragen beantworten wir am Ende noch einmal, damit deine Veränderungen sichtbar werden.">
                                <div className="rounded-2xl border border-[#0f8b8d]/18 bg-[#f5faf8] p-4 text-sm leading-6 text-[#557274]"><strong>Skala 0–10:</strong> Wähle jeweils den Wert, der deinem Erleben in den letzten 14 Tagen am nächsten kommt.</div>
                                <ScoreField name="h01" label="Ich konnte bewusst entscheiden, statt nur automatisch zu reagieren." value={form.h01} onChange={setValue} low="trifft gar nicht zu" high="trifft vollständig zu" />
                                <ScoreField name="h02" label="Ich konnte meine eigenen Bedürfnisse und Grenzen wahrnehmen." value={form.h02} onChange={setValue} low="trifft gar nicht zu" high="trifft vollständig zu" />
                                <ScoreField name="h03" label="Ich konnte auch in schwierigen Situationen bei mir bleiben." value={form.h03} onChange={setValue} low="trifft gar nicht zu" high="trifft vollständig zu" />
                                <ScoreField name="h04" label="Ich habe mich selbst als handlungsfähig erlebt." value={form.h04} onChange={setValue} low="trifft gar nicht zu" high="trifft vollständig zu" />
                                <ScoreField name="h05" label="Ich konnte Schritte gehen, die wirklich zu mir passen." value={form.h05} onChange={setValue} low="trifft gar nicht zu" high="trifft vollständig zu" />
                                <ScoreField name="b01" label="Mein beschriebenes Muster hat mich im Alltag belastet." value={form.b01} onChange={setValue} low="gar nicht" high="sehr stark" />
                                <ScoreField name="b02" label="Das Muster hat meine Beziehungen oder Entscheidungen eingeschränkt." value={form.b02} onChange={setValue} low="gar nicht" high="sehr stark" />
                                <ScoreField name="b03" label="Nach schwierigen Situationen brauchte ich lange, um wieder in meine Kraft zu kommen." value={form.b03} onChange={setValue} low="gar nicht" high="sehr stark" />
                            </StepShell>
                        )}

                        {step === 5 && (
                            <StepShell eyebrow="Schritt 6 von 6" title="Was du für einen sicheren Rahmen brauchst" intro="Diese letzten Fragen helfen uns einzuschätzen, wie wir dich verantwortungsvoll und respektvoll begleiten können.">
                                <RadioCards legend="Fühlst du dich aktuell stabil genug für einen intensiven, interaktiven Gruppenprozess?" name="stability" value={form.stability} onChange={handleChange} options={[["ja", "Ja"], ["unsicher", "Ich bin unsicher"], ["nein", "Nein"]]} />
                                <RadioCards legend="Bist du aktuell zusätzlich in ärztlicher, psychotherapeutischer oder beratender Begleitung?" name="professionalSupport" value={form.professionalSupport} onChange={handleChange} required={false} options={[["ja", "Ja"], ["nein", "Nein"], ["keine_angabe", "Möchte ich nicht angeben"]]} />
                                <TextArea label="Was sollten wir wissen oder beachten, damit du dich sicher und respektvoll begleitet fühlst?" name="safeSupport" value={form.safeSupport} onChange={handleChange} required={false} />
                                <TextArea label="Was hilft dir normalerweise, dich zu stabilisieren und wieder bei dir anzukommen?" name="resources" value={form.resources} onChange={handleChange} hint="Zum Beispiel Menschen, Orte, Routinen, Bewegung, Natur oder professionelle Unterstützung." />
                                <RadioCards legend="Hast du eine Person oder Anlaufstelle, an die du dich in einer Krise wenden kannst?" name="crisisContact" value={form.crisisContact} onChange={handleChange} options={[["ja", "Ja"], ["unsicher", "Ich bin unsicher"], ["nein", "Nein"]]} />

                                <div className="space-y-4 rounded-3xl border border-[#d4af37]/45 bg-[#fbf5df] p-5 sm:p-6">
                                    <div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-[#806918]" /><div><h3 className="font-bold">Vertrauliche Verarbeitung</h3><p className="mt-1 text-sm leading-6 text-[#665f49]">Deine Angaben werden zur Vorbereitung, Durchführung und Auswertung der 8-Wochen-Begleitung gespeichert und sind nur über geschützte, berechtigte Zugänge einsehbar. Du kannst deine Einwilligung für die Zukunft widerrufen und Auskunft oder Löschung verlangen.</p></div></div>
                                    <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-[#3e5455]"><input type="checkbox" name="privacyConsent" checked={form.privacyConsent} onChange={handleChange} required className="mt-1 h-5 w-5 shrink-0 accent-[#0f8b8d]" /><span>Ich willige ausdrücklich ein, dass meine hier gemachten – möglicherweise auch gesundheitsbezogenen – Angaben für die beschriebene 8-Wochen-Begleitung verarbeitet werden.<span className="ml-1 text-[#a05a35]" aria-hidden="true">*</span></span></label>
                                    <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-[#3e5455]"><input type="checkbox" name="nonMedicalAcknowledgement" checked={form.nonMedicalAcknowledgement} onChange={handleChange} required className="mt-1 h-5 w-5 shrink-0 accent-[#0f8b8d]" /><span>Mir ist bewusst, dass Spirit Healing keine medizinische oder psychotherapeutische Behandlung ersetzt. In akuten Krisen wende ich mich an eine geeignete professionelle Anlaufstelle.<span className="ml-1 text-[#a05a35]" aria-hidden="true">*</span></span></label>
                                    <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-[#3e5455]"><input type="checkbox" name="aggregateConsent" checked={form.aggregateConsent} onChange={handleChange} className="mt-1 h-5 w-5 shrink-0 accent-[#0f8b8d]" /><span>Optional: Meine Angaben dürfen ohne Namens- oder Kontaktbezug gemeinsam mit anderen Begleitungsdaten ausgewertet werden, um die 8-Wochen-Begleitung weiterzuentwickeln.</span></label>
                                    <p className="text-xs leading-5 text-[#6d6753]">Weitere Informationen findest du in unserer <Link to="/datenschutz" target="_blank" className="font-bold text-[#075f62] underline">Datenschutzerklärung</Link>.</p>
                                </div>
                                <div className="sr-only" aria-hidden="true"><label>Firma<input name="company" value={form.company} onChange={handleChange} tabIndex={-1} autoComplete="off" /></label></div>
                            </StepShell>
                        )}

                        {error && <div role="alert" className="mt-7 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-800">{error}</div>}

                        <div className="mt-9 flex flex-col-reverse gap-3 border-t border-[#0f8b8d]/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
                            {step > 0 ? <button type="button" onClick={previous} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#0f8b8d]/30 px-6 font-bold text-[#0f8b8d] transition hover:bg-[#eaf4f1]"><ArrowLeft className="h-5 w-5" /> Zurück</button> : <span />}
                            {step < steps.length - 1 ? <button type="button" onClick={next} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0f8b8d] px-7 font-bold text-white transition hover:bg-[#0a6f71]">Weiter <ArrowRight className="h-5 w-5" /></button> : <button type="submit" disabled={status === "submitting"} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#d4af37] px-7 font-bold text-[#143f40] transition hover:bg-[#e2c456] disabled:opacity-60">{status === "submitting" ? "Wird sicher gespeichert …" : <><Sparkles className="h-5 w-5" /> Fragebogen absenden</>}</button>}
                        </div>
                    </div>
                </form>
            </div>

            <footer className="px-4 pb-8 text-center text-sm text-[#648082]">
                <p className="inline-flex items-center gap-2"><Leaf className="h-4 w-4" /> Spirit Healing · Sabine & Selcan</p>
                <p className="mt-2"><Link to="/datenschutz" className="hover:underline">Datenschutz</Link><span className="mx-2">·</span><Link to="/impressum" className="hover:underline">Impressum</Link><span className="mx-2">·</span><a href="mailto:info@spirit-healing.tr" className="inline-flex items-center gap-1 hover:underline"><Mail className="h-3.5 w-3.5" /> Hilfe</a></p>
            </footer>
        </main>
    );
};
