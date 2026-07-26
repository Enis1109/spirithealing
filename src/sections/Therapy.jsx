import { Github, Instagram, Twitter, Check, Calendar1 } from "lucide-react";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { Nlp } from "@/sections/undersections/Nlp"
import { Gsp } from "@/sections/undersections/Gespraech"
import { Fam } from "@/sections/undersections/Fam"
import { Schaman } from "@/sections/undersections/Schaman"
import { Link } from "react-router-dom"

{/*Integrative Therapie*/}
const number_one = [
    {
        description:
        "anhaltende innere Unruhe oder Erschöpfung",
    },
    {
        description:
        "wiederkehrende Gedanken- und Gefühlsmuster",
    },
    {
        description:
        "Schwierigkeiten in Beziehungen",
    },
    {
        description:
        "ein Gefühl von „feststecken“",
    },
    {
        description:
        "fehlende Klarheit oder Orientierung",
    },
];

{/*integrative Ansatz*/}
const number_two = [
    {
        description:
        "körperlichen",
    },
    {
        description:
        "bindungsorientierten",
    },
    {
        description:
        "psychologischen",
    },
    {
        description:
        "energetischen“",
    },
    {
        description:
        "emotionalen",
    },
    {
        description:
        "und unbewussten Dynamiken.",
    },
];

{/*Der weg zurück*/}
const number_three = [
    {
        description:
        "die Fähigkeit, innezuhalten",
    },
    {
        description:
        "wahrzunehmen",
    },
    {
        description:
        "und neu zu wählen",
    },
];

{/* Arten der Therapie*/}
const number_four = [
    {
        description:
        "Gesprächstherapie",
        short:
        <Gsp/>,
    },
    {
        description:
        "NLP",
        short:
        <Nlp/>,
    },
    {
        description:
        "Familienaufstellung",
        short:
        <Fam/>,
    },
    {
        description:
        "Schamanische Arbeit",
        short:
        <Schaman/>,
    },
];

{/* typische folgen zeigen sich of 1*/}
const number_five = [
    {
        description:
        "im unmittelbaren Erleben",
    },
    {
        description:
        "im Nervensystem",
    },
    {
        description:
        "in inneren Mustern",
    },
    {
        description:
        "in der Beziehung zu dir selbst",
    },
];

{/* typische folgen zeigen sich of 2*/}
const number_six = [
    {
        description:
        "Stabilität.",
    },
    {
        description:
        "Klarheit.",
    },
    {
        description:
        "Selbstverbundenheit.",
    },
];

{/* Wie wir arbeiten*/}
const number_seven = [
    {
        description:
        "traumasensibel",
    },
    {
        description:
        "strukturiert",
    },
    {
        description:
        "und in deinem Tempo",
    },
];

{/*Unser Ansatz*/}
const number_eight = [
    {
        description:
        "innere Anteile",
    },
    {
        description:
        "energetische Wahrnehmung",
    },
    {
        description:
        "Körperwahrnehmung",
    },
    {
        description:
        "emotionale Wahrnehmung",
    },
    {
        description:
        "unbewusste Wahrnehmung",
    },
    {
        description:
        "Bindungsdynamiken",
    },
    {
        description:
        "systemische Perspektiven",
    },
    {
        description:
        "Bewusstseinsarbeit",
    },
];

export const Therapie = () => {

    const [activeIdx, setActiveIdx] = useState(0);

    return ( 
        <section id="about" className="relative overflow-hidden pt-20">
            <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"/>
            <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-highlight/5 rounded-full blur-3xl"/>
            <div className="container relative z-10 min-w-screen">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="space-y-8 pb-12 pt-12 sm:pt-16" >
                        <header className="max-w-4xl animate-fade-in animation-delay-100">
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Integrative Therapie</p>
                            <h1 className="mt-4 text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
                                Zusammenhänge verstehen. Innere Stabilität entwickeln.
                            </h1>
                            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/85">
                                Belastende Erfahrungen wirken oft gleichzeitig auf Gefühle, Körper, Beziehungen und Nervensystem. Wir betrachten diese Ebenen im Zusammenhang und richten die Begleitung an deiner persönlichen Situation aus.
                            </p>
                        </header>
                        <div className="grid md:grid-cols-2 gap-8 animate-fade-in animation-delay-300">
                            <div className="overflow-hidden rounded-3xl border border-white/15 bg-white/[0.07] shadow-xl shadow-black/10">
                                <div className="grid h-full lg:grid-cols-2">
                                    <div className="h-72 overflow-hidden lg:h-auto lg:min-h-full">
                                        <img src="/Integ/pflanzelinks.JPG" className="h-full w-full object-cover object-center lg:mask-r-from-70%"/>
                                    </div>
                                    <div className="p-6 text-white">
                                        <div className="flex items-center h-full">
                                            <div>
                                                <h3 className="pb-5 text-2xl font-bold leading-tight text-primary">Zurück zu Stabilität, Klarheit und Verbindung</h3>
                                                <p className="text-sm leading-6">
                                                    Im Laufe des Lebens entstehen Herausforderungen, die sich nicht nur auf einer Ebene zeigen.
                                                </p>
                                                <br/>
                                                <p className="text-sm leading-6">
                                                    Emotionale Belastungen, innere Anspannung oder wiederkehrende Muster sind oft Ausdruck tiefer liegender Prozesse, die Körper, 
                                                    Psyche und Nervensystem gleichzeitig betreffen.
                                                </p>
                                                <br/>
                                                <p className="text-sm font-semibold">
                                                    Vielleicht kennst du das: 
                                                </p>
                                                <br/>
                                                <div>
                                                    <div className="space-y-1">
                                                        {number_one.map((item, idx) => (
                                                                <div 
                                                                    key={idx} 
                                                                    className="p-0"
                                                                >
                                                                    <span className="inline-flex items-start gap-3 text-sm text-white">
                                                                        <ArrowRight className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary text-primary"/>
                                                                        {item.description}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                    </div>
                                                </div>
                                                <br/>
                                                <p className="text-sm leading-6">
                                                    Diese Zustände sind nicht zufällig. Sie haben eine Geschichte.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-hidden rounded-3xl border border-white/15 bg-white/[0.07] shadow-xl shadow-black/10">
                                <div className="grid h-full lg:grid-cols-2 w-full">
                                    <div className="p-6">
                                        <div className="flex items-center h-full">
                                            <div>
                                                <h3 className="pb-5 text-2xl font-bold leading-tight text-primary">Wenn Symptome mehr als Symptome sind</h3>
                                                <div className="space-y-4 text-sm leading-6 text-white">
                                                    <p>
                                                        Viele Menschen versuchen jahrelang, ihre Reaktionen zu kontrollieren.
                                                    </p>
                                                    <p >
                                                        Sie analysieren sich. Optimieren sich. Versuchen ruhiger, stabiler oder „normaler“ zu werden.
                                                    </p>
                                                    <p>
                                                        Und trotzdem wiederholen sich dieselben Muster. 
                                                    </p>
                                                    <p>
                                                        Vielleicht, weil das eigentliche Thema tiefer liegt.
                                                    </p>
                                                    <p>
                                                        Nicht nur im Denken. Sondern im Nervensystem.
                                                    </p>
                                                    <p>
                                                    In Bindung. In emotionalen Prägungen.
                                                    </p>
                                                    <p>
                                                    In inneren Schutzmechanismen.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-72 overflow-hidden lg:h-auto lg:min-h-full">
                                        <img src="/Integ/steinerechts.JPG" className="h-full w-full object-cover object-center lg:mask-l-from-70%"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid h-full md:grid-cols-2 gap-8 pb-8 animate-fade-in animation-delay-300">
                            <div className="overflow-hidden rounded-3xl border border-white/15 bg-white/[0.07] shadow-xl shadow-black/10">
                                <div className="grid h-full lg:grid-cols-2">
                                    <div className="h-72 overflow-hidden lg:h-auto lg:min-h-full">
                                        <img src="/Integ/tellerlinks.JPG" className="h-full w-full object-cover object-center lg:mask-r-from-70%"/>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="pb-5 text-2xl font-bold leading-tight text-primary">Zusammenhänge statt Einzelteile</h3>
                                        <p className="text-sm font-medium leading-6">
                                            Unsere Arbeit ist <span className="font-bold">ursachenauflösend ausgerichtet</span>.
                                        </p>
                                        <p className="text-sm font-medium leading-6">Das bedeutet:</p>
                                        <p className="text-sm font-medium leading-6">Wir arbeiten nicht nur mit dem, was sich an der Oberfläche zeigt, sondern mit den tieferen Zusammenhängen zwischen:</p>
                                        <br/>
                                        <div className="flex items-center justify-center">
                                            <div className="pl-6">
                                                {number_two.map((item, idx) => (
                                                        <div 
                                                            key={idx} 
                                                            className="p-0"
                                                        >
                                                            <span className="text-white text-sm inline-flex items-center justify-center gap-4">
                                                                <ArrowRight className="w-2 h-2 text-primary items-center bg-primary rounded-full"/>
                                                                {item.description}
                                                            </span>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                        <br/>
                                        <p className="text-sm font-medium leading-6">Integrative Therapie bedeutet für uns, diese Ebenen nicht getrennt zu betrachten, sondern im Zusammenspiel.
                                        </p>
                                    </div>
                                </div>
                            </div>
                             <div className="overflow-hidden rounded-3xl border border-white/15 bg-white/[0.07] shadow-xl shadow-black/10">
                                <div className="grid lg:grid-cols-2 h-full">
                                    <div className="p-6">
                                        <h3 className="pb-5 text-2xl font-bold leading-tight text-primary">Unser integrativer Ansatz</h3>
                                        <p className="text-sm font-semibold leading-6">
                                        Wir verbinden in einem integrativen Prozess:
                                        </p>
                                        <br/>
                                        <div className="flex items-center justify-center">
                                            <div className="pl-6">
                                                {number_eight.map((item, idx) => (
                                                        <div 
                                                            key={idx} 
                                                            className="p-0"
                                                        >
                                                            <span className="text-white text-sm inline-flex items-center justify-center gap-4">
                                                                <ArrowRight className="w-2 h-2 text-primary items-center bg-primary rounded-full"/>
                                                                {item.description}
                                                            </span>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                        <br/>
                                        <p className="text-sm leading-6">Damit du wieder bewusste und freie Entscheidungen treffen und handlungsfähig werden kannst.
                                        </p>
                                    </div>
                                    <div className="h-72 overflow-hidden lg:h-auto lg:min-h-full">
                                        <img src="/Integ/pflanzerechts.JPG" className="h-full w-full object-cover object-center lg:mask-l-from-70%"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className=" bg-secondary rounded-t-4xl pb-8 shadow-[0px_-1px_5px_10px_rgba(0,0,0,0.3)]">
                    <div className="container mx-auto py-8">
                        <h2 className="text-2xl md:text-3xl text-center leading-tight pb-6 font-bold text-primary">Der Weg
                            <span className="font-serif italic font-normal text-white"> zur inneren Freiheit </span>
                            <br/>
                        </h2>
                        <div className="grid gap-12 grid-cols-4">
                            <div/>
                            <div className="h-0.5 bg-linear-to-l from-primary via-primary/60 to-transparent"/>
                            <div className="h-0.5 bg-linear-to-r from-primary via-primary/60 to-transparent"/>
                        </div>
                        <div className="flex -mt-12 items-center justify-center">
                            <img src="/traumasensibel/Blume.png" className="w-26 h-24 rounded-full"/>
                        </div>
                        <div className="glass -mt-6 mb-4 rounded-2xl glow-border overflow-hidden">
                            <div className="grid lg:grid-cols-2 gap-6">
                                <div className="py-6 lg:pl-12 max-lg:text-center">
                                    <p>Wenn wir beginnen, Trauma nicht mehr nur als ein Ereignis zu verstehen, sondern als einen inneren Prozess, 
                                        eröffnet sich ein neuer Zugang zu Veränderung.
                                    </p>
                                    <p>
                                        Ein Trauma ist eine psychische Wunde – ein Bruch oder Riss im inneren Erleben, entstanden durch belastende oder verletzende Erfahrungen.
                                        <br/>Diese Wunde wirkt nicht statisch, sondern dynamisch.
                                        <br/>Sie organisiert unser Erleben oft jenseits unseres bewussten Zugriffs.
                                    </p>
                                    <br/>
                                    <p>
                                        Trauma ist nicht das, was dir passiert ist –
                                        sondern das, was in dir daraus geworden ist.
                                    </p>
                                    <p>
                                        Solange diese inneren Prozesse unbewusst bleiben, 
                                        prägen sie weiterhin, wie du wahrnimmst, bewertest und reagierst.
                                    </p>
                                    <p>
                                        Dein Blick auf die Welt beginnt sich daran auszurichten – wie durch eine „zerbrochene Linse“.
                                    </p>
                                    <p>
                                        Die Vergangenheit wirkt strukturierend und beeinflusst dein Erleben im Hier und Jetzt.
                                    </p>
                                    <br/>
                                    <p>
                                        So entsteht eine Wirklichkeit, die nicht objektiv ist, sondern innerlich geformt wird.
                                    </p>
                                    <p >
                                        Die Welt, an die du glaubst, wird zu der Welt, in der du lebst.
                                    </p>
                                    <p >
                                        Dabei kann sich auch deine Handlungsfähigkeit verändern:
                                        <br/>Die Fähigkeit, zwischen Reiz und Reaktion innezuhalten und bewusst zu wählen, wird eingeschränkt.
                                    </p>
                                    <p>
                                        Was eigentlich ein Raum von Freiheit wäre,
                                        wird zu einem automatisierten Ablauf.
                                    </p>
                                    <br/>
                                    <p>
                                        Trauma ist oft nicht nur das, was passiert ist. Sondern das, was danach im System weiterlebt.
                                        <br/>
                                        <br/>
                                        Viele Menschen leben dauerhaft unter innerer Spannung, ohne zu merken, dass ihr Nervensystem nie wirklich gelernt hat,
                                        sich sicher zu fühlen.
                                        Manche Menschen funktionieren perfekt. Und leben gleichzeitig innerlich im Alarm. 
                                        <br/>
                                        <br/>
                                        Unsere Arbeit beginnt dort,
                                        wo Menschen aufhören müssen, gegen sich selbst zu kämpfen.
                                    </p>
                                </div>
                                <div className="min-h-72 overflow-hidden lg:min-h-full">
                                        <img src="/Integ/Schiff.jpeg" className="h-full w-full object-cover object-center lg:mask-l-from-70%"/>
                                    </div>
                            </div>
                        </div>
                        <div className="overflow-hidden rounded-3xl bg-surface shadow-xl shadow-black/10">
                            <div className="grid lg:grid-cols-2">    
                                <div className="p-6 sm:p-10 lg:p-12">
                                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Der Weg zurück</p>
                                    <h2 className="mt-3 text-3xl font-bold leading-tight text-muted-foreground">Freiheit beginnt mit einem neuen Handlungsspielraum</h2>
                                    <p className="mt-6 text-lg leading-8 text-muted-foreground">
                                        Der Weg zurück in die innere Freiheit bedeutet nicht, etwas hinzuzufügen.
                                    </p>
                                    <p className="mt-4 text-lg leading-8 text-muted-foreground">
                                        Sondern etwas wieder zugänglich zu machen, das bereits in dir angelegt ist:
                                    </p>
                                        <div className="mt-5 space-y-2">
                                            {number_three.map((item, idx) => (
                                                    <div 
                                                        key={idx} 
                                                        className="p-0"
                                                    >
                                                        <span className="inline-flex items-center gap-3 text-lg text-muted-foreground">
                                                            <ArrowRight className="h-3 w-3 rounded-full bg-primary text-primary"/>
                                                            {item.description}
                                                        </span>
                                                    </div>
                                                ))}
                                        </div>
                                    <p className="mt-6 text-lg font-bold text-primary">
                                        Genau hier beginnt echte Veränderung.
                                    </p>
                                    <p className="mt-3 text-lg leading-8 text-muted-foreground">
                                        Nicht im Außen – sondern in der Art und Weise, wie du auf dein Leben antwortest.
                                    </p>
                                </div>
                                <div className="min-h-72 overflow-hidden lg:min-h-full">
                                    <img src="/Integ/wegzrk.jpeg" className="h-full w-full object-cover object-center lg:mask-l-from-70%"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-card animate-fade-in animation-delay-400">
                    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
                        <div className="max-w-3xl">
                            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Methoden, die dem Prozess folgen</p>
                            <h2 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">Unser integrativer Ansatz in der Praxis</h2>
                            <p className="mt-5 text-lg leading-8 text-white/80">Wir verbinden therapeutische und begleitende Ansätze zu einem stimmigen Gesamtprozess. Entscheidend ist nicht die Anzahl der Methoden, sondern was dich in deiner konkreten Situation unterstützt.</p>
                        </div>
                        <div className="mt-8">
                            <div className="flex flex-wrap gap-3" role="tablist" aria-label="Therapeutische Ansätze">
                                {number_four.map((item, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => setActiveIdx(idx)}
                                            role="tab"
                                            aria-selected={idx === activeIdx}
                                            className= {
                                            idx === activeIdx
                                                ? "cursor-pointer rounded-full border border-primary bg-primary px-5 py-2.5 font-bold text-primary-foreground"
                                                : "cursor-pointer rounded-full border border-white/25 px-5 py-2.5 font-semibold text-white transition hover:border-primary hover:text-primary"
                                                }
                                            >
                                            {item.description}
                                        </button>
                                ))}
                            </div>
                            <div className="mt-8" role="tabpanel">
                                {number_four[activeIdx].short}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-secondary animate-fade-in">
                    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
                        <div className="max-w-3xl">
                            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Veränderung auf mehreren Ebenen</p>
                            <h3 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">Was im Prozess wieder zugänglich werden kann</h3>
                        </div>
                                <div className="mt-8 grid gap-8 pb-8 md:grid-cols-2">
                                    <div className="min-h-72 overflow-hidden rounded-2xl">
                                        <img src="/Integ/bildpf.jpeg" className="h-full w-full object-cover object-center"/>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="space-y-4">
                                            <p className="text-lg leading-8">Wir arbeiten dort, wo Veränderung tatsächlich entstehen kann:
                                            </p>
                                            <div className="space-y-2">
                                                {number_five.map((item, idx) => (
                                                    <div 
                                                        key={idx} 
                                                        className="p-0"
                                                    >
                                                        <span className="inline-flex items-center gap-3">
                                                            <ArrowRight className="w-2 h-2 text-primary items-center bg-primary rounded-full"/>
                                                                {item.description}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                            <p>Unser Ziel ist es nicht, etwas an dir zu „reparieren“.
                                            </p>
                                            <p>Sondern dich dabei zu begleiten,
                                                wieder Zugang zu dem zu bekommen,
                                                was bereits in dir angelegt ist:
                                            </p>
                                            <div className="space-y-2 pb-4">
                                                {number_six.map((item, idx) => (
                                                    <div 
                                                        key={idx} 
                                                        className="p-0"
                                                    >
                                                        <span className="inline-flex items-center gap-3">
                                                            <ArrowRight className="w-2 h-2 text-primary items-center bg-primary rounded-full"/>
                                                                {item.description}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div> 
                            <div className="overflow-hidden rounded-3xl border border-white/15 bg-white/[0.07] shadow-xl shadow-black/10">
                                <div className="grid md:grid-cols-3 ">
                                    <div className="min-h-64 overflow-hidden rounded-2xl md:min-h-full">
                                        <img src="/Integ/pfrlmp2.JPG" className="h-full w-full object-cover object-center md:mask-r-from-70%"/>
                                    </div>
                                    <div className="relative z-10 p-6 md:-mx-6 lg:p-8">
                                        <h2 className="text-3xl font-bold leading-tight text-primary">Wie wir arbeiten</h2>
                                        <p className="mt-5 leading-7">
                                            Unsere Begleitung findet in einem geschützten Online-Rahmen statt.
                                        </p>
                                        <p className="mt-4 font-semibold">
                                            Dabei arbeiten wir:
                                        </p>
                                        <div className="mt-3 pb-4">
                                            <div className="space-y-2">
                                                {number_seven.map((item, idx) => (
                                                        <div 
                                                            key={idx} 
                                                            className="p-0"
                                                        >
                                                            <span className="inline-flex items-center gap-3">
                                                                <ArrowRight className="w-2 h-2 text-primary items-center bg-primary rounded-full"/>
                                                                {item.description}
                                                            </span>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                        <p className="mt-3 pb-2 leading-7">
                                            Du musst nichts leisten. Nichts beweisen.
                                        </p>
                                        <p className="pb-2 leading-7">
                                            Du darfst ankommen – mit dem, was da ist.
                                        </p>
                                        <p className="pb-2 font-semibold leading-7">
                                            Und genau dort beginnen wir.
                                        </p>
                                    </div>
                                    <div className="min-h-64 overflow-hidden rounded-2xl md:min-h-full">
                                        <img src="/Integ/pfrlmp.jpeg" className="h-full w-full object-cover object-center md:mask-l-from-70%"/>
                                    </div>
                                </div>
                            </div>   
                    </div>
                </div>
                <div className="border-y border-white/10 bg-[#0B777A]">
                    <div className="mx-auto grid max-w-6xl items-center md:grid-cols-[0.45fr_1.15fr_0.8fr]">
                        <div className="flex items-center justify-center p-8">
                            <Calendar1 className="md:w-36 md:h-36 w-24 h-24 text-primary"/>
                        </div>
                        <div className="px-6 py-10">
                            <h2 className="text-3xl font-bold leading-tight">Ein erster Schritt kann vieles in Bewegung bringen</h2>
                            <p className="mt-4 leading-7 text-white/85">
                                Wenn du möchtest, finden wir in einem kostenfreien Gespräch heraus, was dir guttut.
                                Ganz unverbindlich und nur für dich.
                            </p>
                            <div className="pt-6">
                                <Link to="/kontakt" className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground transition hover:bg-surface">
                                    Kennenlernen <ArrowRight className="w-5 h-5"/>
                                </Link>
                            </div>
                        </div>
                        <div className="min-h-64 overflow-hidden md:min-h-full">
                            <img src="/breachright.jpeg" className="h-full w-full object-cover object-center md:mask-l-from-50%"/>
                        </div>
                    </div>
                </div>
                <div className=" flex items-center justify-center mb-6">
                    <div className="flex items-center justify-center px-4">   
                        <Link 
                            to="/impressum"
                            className="px-8 py-2 text-sm text-white"
                        >
                            Impressum
                        </Link>
                    </div>
                    <div className="flex items-center justify-center px-4">   
                        <Link 
                            to="/datenschutz"
                            className="px-8 py-2 text-sm text-white"
                        >
                            Datenschutz
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
