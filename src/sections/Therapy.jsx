import { Github, Instagram, Twitter, Check, Calendar1 } from "lucide-react";
import { Button } from "@/components/Button"
import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { Nlp } from "@/sections/undersections/Nlp"
import { Gsp } from "@/sections/undersections/Gespraech"
import { Fam } from "@/sections/undersections/Fam"
import { Schaman } from "@/sections/undersections/Schaman"

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
        <section id="about" className="pt-20 font-serif relative overflow-hidden">
            <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"/>
            <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-highlight/5 rounded-full blur-3xl"/>
            <div className="container relative z-10 min-w-screen">
                <div className="container mx-auto">
                    <div className="space-y-8 pt-6" >
                        <h1 className="text-2xl text-center md:text-4xl font-bold leading-tight animate-fade-in animation-delay-100 text-primary glow-text">
                        Integrative Therapie – 
                        <span className="font-serif italic font-normal text-white"> Ganzheitliche Begleitung auf mehreren Ebenen</span>
                        </h1>
                        <div className="grid gap-12 grid-cols-4 px-2 animate-fade-in animation-delay-100">
                            <div/>
                            <div className="h-0.5 bg-linear-to-l from-primary via-primary/60 to-transparent"/>
                            <div className="h-0.5 bg-linear-to-r from-primary via-primary/60 to-transparent"/>
                        </div>
                        <div className="flex -mt-20 -mb-8 items-center justify-center animate-fade-in animation-delay-100">
                            <img src="/traumasensibel/Blume.png" className="w-26 h-24 rounded-full"/>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8 animate-fade-in animation-delay-300">
                            <div className="glass glow-border rounded-2xl overflow-hidden">
                                <div className="grid h-full lg:grid-cols-2">
                                    <div className="flex lg:-ml-32 lg:mr-8 lg:-mt-16 max-md:-mt-80">
                                        <img src="/Integ/pflanzelinks.JPG" className="flex object-fill lg:mask-r-from-70%"/>
                                    </div>
                                    <div className="pt-6 lg:-ml-20 text-white lg:pr-6">
                                        <div className="flex items-center h-full">
                                            <div>
                                                <h3 className="text-xl md:text-xl text-center leading-tight  font-bold text-primary pb-6">Finde zurück
                                                    <span className="font-serif italic font-normal text-white"> zu innerer Stabilität, Klarheit und Verbindung </span>
                                                <br/>
                                                </h3>
                                                <div className="grid gap-16 grid-cols-2 px-2">
                                                    <div className="h-0.5 bg-linear-to-l from-primary via-primary/60 to-transparent"/>
                                                    <div className="h-0.5 bg-linear-to-r from-primary via-primary/60 to-transparent"/>
                                                </div>
                                                <div className="flex -mt-12 -mb-8 items-center justify-center">
                                                    <img src="/traumasensibel/Blume.png" className="w-26 h-24 rounded-full"/>
                                                </div>
                                                <br/>
                                                <p className="text-center text-sm -mt-4">
                                                    Im Laufe des Lebens entstehen Herausforderungen, die sich nicht nur auf einer Ebene zeigen.
                                                </p>
                                                <br/>
                                                <p className="text-center text-sm">
                                                    Emotionale Belastungen, innere Anspannung oder wiederkehrende Muster sind oft Ausdruck tiefer liegender Prozesse, die Körper, 
                                                    Psyche und Nervensystem gleichzeitig betreffen.
                                                </p>
                                                <br/>
                                                <p className="text-center text-sm">
                                                    Vielleicht kennst du das: 
                                                </p>
                                                <br/>
                                                <div className="flex items-center justify-center">
                                                    <div className="pl-6">
                                                        {number_one.map((item, idx) => (
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
                                                <p className="text-center text-sm">
                                                    Diese Zustände sind nicht zufällig. Sie haben eine Geschichte.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="glass glow-border rounded-2xl overflow-hidden">
                                <div className="grid h-full lg:grid-cols-2 w-full">
                                    <div className="lg:pl-6 pt-6 pb-9">
                                        <div className="flex items-center h-full">
                                            <div>
                                                <h3 className="text-xl md:text-xl text-center leading-tight pb-6 font-bold text-primary">Wenn Symptome
                                                    <span className="font-serif italic font-normal text-white"> nicht nur Symptome sind </span>
                                                <br/>
                                                </h3>
                                                <div className="grid gap-16 grid-cols-2 px-2">
                                                    <div className="h-0.5 bg-linear-to-l from-primary via-primary/60 to-transparent"/>
                                                    <div className="h-0.5 bg-linear-to-r from-primary via-primary/60 to-transparent"/>
                                                </div>
                                                <div className="flex -mt-12 -mb-8 items-center justify-center">
                                                    <img src="/traumasensibel/Blume.png" className="w-26 h-24 rounded-full"/>
                                                </div>
                                                <div className="text-white text-sm max-lg:text-center pt-2">
                                                    <p>
                                                        Viele Menschen versuchen jahrelang, ihre Reaktionen zu kontrollieren.
                                                    </p>
                                                    <br/>
                                                    <p >
                                                        Sie analysieren sich. Optimieren sich. Versuchen ruhiger, stabiler oder „normaler“ zu werden.
                                                    </p>
                                                    <br/>
                                                    <p>
                                                        Und trotzdem wiederholen sich dieselben Muster. 
                                                    </p>
                                                    <br/>
                                                    <p>
                                                        Vielleicht, weil das eigentliche Thema tiefer liegt.
                                                    </p>
                                                    <br/>
                                                    <p>
                                                        Nicht nur im Denken. Sondern im Nervensystem.
                                                    </p>
                                                    <br/>
                                                    <p>
                                                    In Bindung. In emotionalen Prägungen.
                                                    </p>
                                                    <br/>
                                                    <p>
                                                    In inneren Schutzmechanismen.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex lg:-mt-8 max-lg:items-center max-lg:justify-center max-md:rounded-3xl max-lg:overflow-hidden">
                                        <img src="/Integ/steinerechts.JPG" className="flex object-fill max-md:-mt-80 max-md:overflow-hidden max-md:rounded-3xl lg:mask-l-from-70%"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid h-full md:grid-cols-2 gap-8 pb-8 animate-fade-in animation-delay-300">
                            <div className="glass rounded-2xl glow-border overflow-hidden">
                                <div className="grid h-full lg:grid-cols-2">
                                    <div className="flex -ml-6">
                                        <img src="/Integ/tellerlinks.JPG" className="flex object-fill lg:mask-r-from-70%"/>
                                    </div>
                                    <div className="lg:-ml-16 py-6 lg:pr-6 max-lg:text-center">
                                        <h3 className="text-xl md:text-xl text-center leading-tight pb-6 font-bold text-primary">Der
                                            <span className="font-serif italic font-normal text-white"> intergrative Ansatz </span>
                                        <br/>
                                        </h3>
                                        <div className="grid gap-16 grid-cols-2 px-2">
                                            <div className="h-0.5 bg-linear-to-l from-primary via-primary/60 to-transparent"/>
                                            <div className="h-0.5 bg-linear-to-r from-primary via-primary/60 to-transparent"/>
                                        </div>
                                        <div className="flex -mt-12 -mb-8 items-center justify-center">
                                            <img src="/traumasensibel/Blume.png" className="w-26 h-24 rounded-full"/>
                                        </div>
                                        <p className="text-center text-sm font-medium italic pt-2">
                                            Unsere Arbeit ist <span className="font-bold">ursachenauflösend ausgerichtet</span>.
                                        </p>
                                        <p className="text-center text-sm font-medium italic">Das bedeutet:</p>
                                        <p className="text-center text-sm font-medium italic">Wir arbeiten nicht nur mit dem, was sich an der Oberfläche zeigt, sondern mit den tieferen Zusammenhängen zwischen:</p>
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
                                        <p className="text-center text-sm font-medium italic">Integrative Therapie bedeutet für uns, diese Ebenen nicht getrennt zu betrachten, sondern im Zusammenspiel.
                                        </p>
                                    </div>
                                </div>
                            </div>
                             <div className="glass rounded-2xl glow-border overflow-hidden">
                                <div className="grid lg:grid-cols-2 h-full">
                                    <div className="pt-6 lg:pl-6 max-lg:text-center">
                                        <h3 className="text-xl md:text-xl text-center leading-tight pb-6 font-bold text-primary">Unser
                                            <span className="font-serif italic font-normal text-white"> Ansatz </span>
                                        <br/>
                                        </h3>
                                        <div className="grid gap-16 grid-cols-2 px-2">
                                            <div className="h-0.5 bg-linear-to-l from-primary via-primary/60 to-transparent"/>
                                            <div className="h-0.5 bg-linear-to-r from-primary via-primary/60 to-transparent"/>
                                        </div>
                                        <div className="flex -mt-12 -mb-8 items-center justify-center">
                                            <img src="/traumasensibel/Blume.png" className="w-26 h-24 rounded-full"/>
                                        </div>
                                        <p className="text-sm text-center pt-2">
                                        Wir verbinden in einem Integrativen Prozess.
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
                                        <p className="text-sm text-center">So dass du wieder bewusste und freie Entscheidungen triffst und handlungsfähig bist.
                                        </p>
                                    </div>
                                    <div className="flex -mb-16 -mr-6">
                                        <img src="/Integ/pflanzerechts.JPG" className="flex object-fill lg:mask-l-from-70%"/>
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
                                <div className="flex -mx-32">
                                        <img src="/Integ/Schiff.jpeg" className="flex object-fill lg:mask-l-from-70%"/>
                                    </div>
                            </div>
                        </div>
                        <div className="flex glass-strong rounded-2xl items-center justify-center glow-border overflow-hidden">
                            <div className="grid lg:grid-cols-2">    
                                <div className="py-6 lg:pl-12 max-lg:text-center">
                                    <h2 className="text-2xl md:text-3xl text-center font-serif leading-tight text-muted-foreground">Der
                                        <span className="font-serif font-normal text-primary"> Weg zurück</span>
                                    <br/>
                                    </h2>
                                    <br/>
                                    <p className="text-lg text-muted-foreground">
                                        Der Weg zurück in die innere Freiheit bedeutet nicht, etwas hinzuzufügen.
                                    </p>
                                    <br/>
                                    <p className="text-lg text-muted-foreground">
                                        Sondern etwas wieder zugänglich zu machen, das bereits in dir angelegt ist:
                                    </p>
                                    <br/>
                                        <div className="pl-6">
                                            {number_three.map((item, idx) => (
                                                    <div 
                                                        key={idx} 
                                                        className="p-0"
                                                    >
                                                        <span className="text-lg text-muted-foreground inline-flex items-center justify-center gap-4">
                                                            <ArrowRight className="w-3 h-3 text-primary items-center bg-primary rounded-full"/>
                                                            {item.description}
                                                        </span>
                                                    </div>
                                                ))}
                                        </div>
                                    <br/>
                                    <p className="text-lg text-primary">
                                        Genau hier beginnt echte Veränderung.
                                    </p>
                                    <br/>
                                    <p className="text-lg text-muted-foreground">
                                        Nicht im Außen – sondern in der Art und Weise, wie du auf dein Leben antwortest.
                                    </p>
                                </div>
                                <div className="flex -mb-16 -ml-12">
                                    <img src="/Integ/wegzrk.jpeg" className="flex object-fill lg:mask-l-from-70% object-bottom"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className=" bg-card rounded-t-4xl pb-8 -mt-8 shadow-[0px_-1px_5px_10px_rgba(0,0,0,0.3)] animate-fade-in animation-delay-400">
                    <div className="container mx-auto py-8">
                        <h2 className="text-2xl md:text-3xl text-center font-serif leading-tight  font-bold text-primary">Unser integrativer Ansatz
                            <span className="font-serif italic font-normal text-white"> in der Praxis </span>
                        </h2>
                        <br/>
                        <div className="px-6 font-serif">
                            <p className="text-lg text-center">Wir verbinden verschiedene therapeutische und begleitende Ansätze zu einem ganzheitlichen Konzept.</p>
                            <p className="text-lg text-center">Dabei geht es nicht darum, möglichst viele Methoden anzuwenden, sondern genau das, was dich in deinem Prozess unterstützt.
                            </p>
                            <p className="text-lg text-center">Die Auswahl erfolgt individuell, achtsam und prozessorientiert.</p>
                            <br/>
                            <p className="text-lg text-center">Unsere Arbeit umfasst unter anderem:</p>
                            <br/>
                            <div className="grid lg:grid-cols-4 md:grid-cols-2 items-center justify-center">
                                {number_four.map((item, idx) => (
                                    <div 
                                        key={idx}
                                        className="flex items-center justify-center py-2"
                                    >
                                        <button 
                                            onClick={() => setActiveIdx(idx)}
                                            className= {
                                            idx === activeIdx
                                                ? "bg-primary rounded-full p-2 hover:cursor-pointer text-muted-foreground inline-flex items-center justify-center border-primary border-2"
                                                : "hover:bg-primary hover:text-muted-foreground  hover:cursor-pointer rounded-full p-2 inline-flex items-center justify-center border-primary border-2"
                                                }
                                            >
                                            {item.description}
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-4"> 
                                {number_four[activeIdx].short}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-secondary rounded-t-4xl -mt-8 shadow-[0px_-1px_5px_10px_rgba(0,0,0,0.3)] animate-fade-in">
                    <div className="container mx-auto py-8">
                        <h3 className="text-2xl md:text-2xl text-center leading-tight  font-bold text-primary">Typische Folgen
                        <span className="font-serif italic font-normal text-white"> zeigen sich oft so: </span>
                        </h3>
                            <br/>
                                <div className="grid md:grid-cols-2 pb-4 gap-8">
                                    <div className="flex rounded-2xl overflow-hidden">
                                        <img src="/Integ/bildpf.jpeg" className="flex object-fill"/>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="space-y-4 max-md:text-center">
                                            <p className="text-lg">Wir arbeiten nicht nur auf einer Ebene – sondern dort, wo Veränderung tatsächlich entsteht:
                                            </p>
                                            <div className="pl-6">
                                                {number_five.map((item, idx) => (
                                                    <div 
                                                        key={idx} 
                                                        className="p-0"
                                                    >
                                                        <span className="inline-flex items-center justify-center gap-4">
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
                                            <div className="pl-6 pb-4">
                                                {number_six.map((item, idx) => (
                                                    <div 
                                                        key={idx} 
                                                        className="p-0"
                                                    >
                                                        <span className="inline-flex items-center justify-center gap-4">
                                                            <ArrowRight className="w-2 h-2 text-primary items-center bg-primary rounded-full"/>
                                                                {item.description}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div> 
                            <div className="flex glow-border border-primary/50 border-2 rounded-2xl overflow-hidden items-center justify-center">
                                <div className="grid md:grid-cols-3 ">
                                    <div className="flex rounded-2xl -mr-16">
                                        <img src="/Integ/pfrlmp2.JPG" className="flex object-fill  md:mask-r-from-70%"/>
                                    </div>
                                    <div className="py-4 md:-mx-16 max-md:text-center max-md:px-4">
                                        <h2 className="text-3xl md:text-3xl text-center leading-tight pb-4 ">Wie 
                                            <span className="font-serif font-normal text-primary"> wir arbeiten </span>
                                        </h2>
                                        <div className="grid gap-12 grid-cols-4">
                                            <div/>
                                            <div className="h-0.5 bg-linear-to-l from-primary via-primary/60 to-transparent"/>
                                            <div className="h-0.5 bg-linear-to-r from-primary via-primary/60 to-transparent"/>
                                        </div>
                                        <div className="flex -mt-12 items-center justify-center">
                                            <img src="/traumasensibel/Blume.png" className="w-26 h-24 rounded-full"/>
                                        </div>
                                        <p className="-mt-8 text-center pb-2">
                                            Unsere Begleitung findet in einem geschützten Online-Rahmen statt.
                                        </p>
                                        <p className="text-center pb-4">
                                            Wir arbeiten:
                                        </p>
                                        <div className="flex items-center pb-4 justify-center">
                                            <div className="pl-6">
                                                {number_seven.map((item, idx) => (
                                                        <div 
                                                            key={idx} 
                                                            className="p-0"
                                                        >
                                                            <span className="inline-flex items-center justify-center gap-4">
                                                                <ArrowRight className="w-2 h-2 text-primary items-center bg-primary rounded-full"/>
                                                                {item.description}
                                                            </span>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                        <p className="text-center pb-2">
                                            Du musst nichts leisten. Nichts beweisen.
                                        </p>
                                        <p className="text-center pb-2">
                                            Du darfst ankommen – mit dem, was da ist.
                                        </p>
                                        <p className="text-center pb-2">
                                            Und genau dort beginnen wir.
                                        </p>
                                    </div>
                                    <div className="flex rounded-2xl -ml-16">
                                        <img src="/Integ/pfrlmp.jpeg" className="flex object-fill  md:mask-l-from-70%"/>
                                    </div>
                                </div>
                            </div>   
                    </div>
                </div>
                <div className="bg-gray-500 -mt-8">
                    <div className="container mx-auto">
                        <div className="flex flex-row py-16 gap-8 items-center">
                            <Calendar1 className="w-96 h-96"/>
                            <div className="flex items-center justify-center flex-col space-y-8">    
                                <span className="text-5xl flex pl-6 items-center justify-center text-center">Manchmal ist es nur ein kleiner erster Schritt, der alles in Bewegung setzt.</span>
                                <p className="text-3xl flex items-center pl-10 justify-center text-center">
                                    Wenn du möchtest, finden wir in einem kostenfreien Gespräch heraus, was dir gut tut.
                                    Ganz unverbindlich und nur für dich.
                                </p>
                                <div className=" animate-fade-in animation-delay-300">
                                    <Button size="lg">
                                        <div className="inline-flex justify-center text-black items-center">
                                        Kennenlernen <ArrowRight className="w-5 h-5"/>
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}