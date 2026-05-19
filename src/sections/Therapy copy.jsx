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
        "NLP/Hypnose",
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
        "Schamanische Arbeit & Energetische Prozessarbeit",
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
        <section id="about" className="pt-20 relative overflow-hidden">
            <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"/>
            <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-highlight/5 rounded-full blur-3xl"/>
            <div className="container relative z-10 min-w-screen">
                <div className="container mx-auto pb-20">
                    <div className="space-y-8 pt-6">
                        <h1 className="text-4xl text-center md:text-5xl font-bold leading-tight animate-fade-in animation-delay-100 text-primary glow-text">
                        Integrative Therapie – 
                        <span className="font-serif italic font-normal text-white"> Ganzheitliche Begleitung auf mehreren Ebenen</span>
                        </h1>
                        <div className="grid lg:grid-cols-2 gap-12 pb-8">
                            <div className="glass glow-border rounded-2xl py-6 px-10">
                                <h3 className="text-2xl md:text-3xl text-center leading-tight  font-bold text-primary">Finde zurück
                                    <span className="font-serif italic font-normal text-white"> zu innerer Stabilität, Klarheit und Verbindung </span>
                                <br/>
                                </h3>
                                <br/>
                                <div className="space-y-4 text-white">
                                    <p className="text-center">
                                        Im Laufe des Lebens entstehen Herausforderungen, die sich nicht nur auf einer Ebene zeigen.
                                    </p>
                                    <p className="text-center">
                                        Emotionale Belastungen, innere Anspannung oder wiederkehrende Muster sind oft Ausdruck tiefer liegender Prozesse, die Körper, 
                                        Psyche und Nervensystem gleichzeitig betreffen.
                                    </p>
                                    <p className="text-center">
                                        Vielleicht kennst du das: 
                                    </p>
                                    <div className="flex items-center justify-center">
                                        <div className="pl-6">
                                            {number_one.map((item, idx) => (
                                                    <div 
                                                        key={idx} 
                                                        className="p-0"
                                                    >
                                                        <span className="text-white inline-flex items-center justify-center gap-4">
                                                            <ArrowRight className="w-3 h-3 text-primary items-center bg-primary rounded-full"/>
                                                            {item.description}
                                                        </span>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                    <p className="text-center">
                                        Diese Zustände sind nicht zufällig. Sie haben eine Geschichte.
                                    </p>
                                </div>
                            </div>
                            <div className="glass glow-border rounded-2xl py-6 px-10">
                                <h3 className="text-2xl md:text-3xl text-center leading-tight  font-bold text-primary">Wenn Symptome
                                    <span className="font-serif italic font-normal text-white"> nicht nur Symptome sind </span>
                                <br/>
                                </h3>
                                <br/>
                                <br/>
                                <br/>
                                <div className="space-y-4 text-white">
                                    <p className="text-center">
                                        Viele Menschen versuchen jahrelang, ihre Reaktionen zu kontrollieren.
                                    </p>
                                    <p className="text-center">
                                        Sie analysieren sich. Optimieren sich. Versuchen ruhiger, stabiler oder „normaler“ zu werden.
                                    </p>
                                    <p className="text-center">
                                        Und trotzdem wiederholen sich dieselben Muster. 
                                    </p>
                                    <p className="text-center">
                                        Vielleicht, weil das eigentliche Thema tiefer liegt.
                                    </p>
                                    <p className="text-center">
                                        Nicht nur im Denken. Sondern im Nervensystem.
                                    </p>
                                    <p className="text-center">
                                       In Bindung. In emotionalen Prägungen.
                                    </p>
                                    <p className="text-center">
                                       In inneren Schutzmechanismen.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="grid lg:grid-cols-2 gap-12 pb-8">
                            <div className="glass rounded-2xl p-6 glow-border animate-fade-in animation-delay-300">
                                <h3 className="text-center text-2xl">Der integrative Ansatz</h3>
                                <br/>
                                <p className="text-lg font-medium italic text-center">
                                    Unsere Arbeit ist <span className="font-bold">ursachenauflösend ausgerichtet</span>.
                                </p>
                                <p className="text-lg font-medium italic text-center">Das bedeutet:</p>
                                <br/>
                                <p className="text-lg font-medium italic text-center">Wir arbeiten nicht nur mit dem, was sich an der Oberfläche zeigt, sondern mit den tieferen Zusammenhängen zwischen:</p>
                                <br/>
                                <div className="flex items-center justify-center">
                                    <div className="pl-6">
                                        {number_two.map((item, idx) => (
                                                <div 
                                                    key={idx} 
                                                    className="p-0"
                                                >
                                                    <span className="text-white text-lg inline-flex items-center justify-center gap-4">
                                                        <ArrowRight className="w-3 h-3 text-primary items-center bg-primary rounded-full"/>
                                                        {item.description}
                                                    </span>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                                <br/>
                                <p className="text-lg font-medium italic text-center">Integrative Medizin bedeutet für uns, diese Ebenen nicht getrennt zu betrachten, sondern im Zusammenspiel.
                                </p>
                            </div>
                             <div className="glass rounded-2xl p-6 glow-border animate-fade-in animation-delay-300">
                                <h3 className="text-center text-2xl">Unser Ansatz</h3>
                                <br/>
                                <p className="text-lg font-medium italic text-center">
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
                                                    <span className="text-white text-lg inline-flex items-center justify-center gap-4">
                                                        <ArrowRight className="w-3 h-3 text-primary items-center bg-primary rounded-full"/>
                                                        {item.description}
                                                    </span>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                                <br/>
                                <p className="text-lg font-medium italic text-center">So dass du wieder bewusste und freie Entscheidungen triffst und handlungsfähig bist.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className=" bg-secondary rounded-t-4xl pb-8 shadow-[0px_-1px_5px_10px_rgba(0,0,0,0.3)] animate-fade-in">
                    <div className="container mx-auto space-y-12 py-16">
                        <div className="glass rounded-2xl p-6 glow-border animate-fade-in animation-delay-300">
                            <h2 className="text-2xl md:text-3xl text-center leading-tight  font-bold text-primary">Der Weg
                            <span className="font-serif italic font-normal text-white"> zur inneren Freiheit </span>
                            <br/>
                            </h2>
                            <br/>
                            <div className="grid lg:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-lg ">Wenn wir beginnen, Trauma nicht mehr nur als ein Ereignis zu verstehen, sondern als einen inneren Prozess, 
                                        eröffnet sich ein neuer Zugang zu Veränderung.
                                    </p>
                                    <p className="text-lg ">
                                        Ein Trauma ist eine psychische Wunde – ein Bruch oder Riss im inneren Erleben, entstanden durch belastende oder verletzende Erfahrungen.
                                        <br/>Diese Wunde wirkt nicht statisch, sondern dynamisch.
                                        <br/>Sie organisiert unser Erleben oft jenseits unseres bewussten Zugriffs.
                                    </p>
                                    <br/>
                                    <p className="text-lg ">
                                        Trauma ist nicht das, was dir passiert ist –
                                        sondern das, was in dir daraus geworden ist.
                                    </p>
                                    <p className="text-lg ">
                                        Solange diese inneren Prozesse unbewusst bleiben, 
                                        prägen sie weiterhin, wie du wahrnimmst, bewertest und reagierst.
                                    </p>
                                    <p className="text-lg ">
                                        Dein Blick auf die Welt beginnt sich daran auszurichten – wie durch eine „zerbrochene Linse“.
                                    </p>
                                    <p className="text-lg ">
                                        Die Vergangenheit wirkt strukturierend und beeinflusst dein Erleben im Hier und Jetzt.
                                    </p>
                                    <br/>
                                    <p className="text-lg ">
                                        So entsteht eine Wirklichkeit, die nicht objektiv ist, sondern innerlich geformt wird.
                                    </p>
                                    <p className="text-lg ">
                                        Die Welt, an die du glaubst, wird zu der Welt, in der du lebst.
                                    </p>
                                    <p className="text-lg ">
                                        Dabei kann sich auch deine Handlungsfähigkeit verändern:
                                        <br/>Die Fähigkeit, zwischen Reiz und Reaktion innezuhalten und bewusst zu wählen, wird eingeschränkt.
                                    </p>
                                    <p className="text-lg ">
                                        Was eigentlich ein Raum von Freiheit wäre,
                                        wird zu einem automatisierten Ablauf.
                                    </p>
                                    <br/>
                                    <p className="text-lg ">
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
                                <div className="flex glass rounded-2xl items-center justify-center">
                                        <span className="text-4xl text-black">BILD?</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex glass rounded-2xl items-center justify-center glow-border">
                            <div className="rounded-2xl py-6 px-12 ">
                                <h3 className="text-2xl text-center font-bold">Der Weg zurück</h3>
                                <br/>
                                <p className="text-lg text-center">
                                    Der Weg zurück in die innere Freiheit bedeutet nicht, etwas hinzuzufügen.
                                </p>
                                <br/>
                                <p className="text-lg text-center">
                                    Sondern etwas wieder zugänglich zu machen, das bereits in dir angelegt ist:
                                </p>
                                <br/>
                                <div className="flex items-center justify-center">
                                    <div className="pl-6">
                                        {number_three.map((item, idx) => (
                                                <div 
                                                    key={idx} 
                                                    className="p-0"
                                                >
                                                    <span className="text-lg inline-flex items-center justify-center gap-4">
                                                        <ArrowRight className="w-3 h-3 text-primary items-center bg-primary rounded-full"/>
                                                        {item.description}
                                                    </span>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                                <br/>
                                <p className="text-lg text-center">
                                    Genau hier beginnt echte Veränderung.
                                </p>
                                <br/>
                                <p className="text-lg text-center">
                                    Nicht im Außen – sondern in der Art und Weise, wie du auf dein Leben antwortest.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className=" bg-card rounded-t-4xl pb-8 -mt-8 shadow-[0px_-1px_5px_10px_rgba(0,0,0,0.3)] animate-fade-in animation-delay-400">
                    <div className="container mx-auto space-y-6 py-16">
                        <h2 className="text-2xl md:text-3xl text-center leading-tight  font-bold text-primary">Unser integrativer Ansatz
                        <span className="font-serif italic font-normal text-white"> in der Praxis </span>
                        </h2>
                        <div className="px-6">
                            <p className="text-lg text-center">Wir verbinden verschiedene therapeutische und begleitende Ansätze zu einem ganzheitlichen Konzept.</p>
                            <br/>
                            <p className="text-lg text-center">Dabei geht es nicht darum, möglichst viele Methoden anzuwenden, sondern genau das, was dich in deinem Prozess unterstützt.
                            </p>
                            <br/>
                            <p className="text-lg text-center">Die Auswahl erfolgt individuell, achtsam und prozessorientiert.</p>
                            <br/>
                            <p className="text-lg text-center">Unsere Arbeit umfasst unter anderem:</p>
                            <br/>
                            <br/>
                                <div className="glass glow-border p-6 rounded-4xl">
                                            <div className="grid lg:grid-cols-4 items-center justify-center">
                                                {number_four.map((item, idx) => (
                                                    <div 
                                                        key={idx}
                                                        className="flex items-center justify-center py-2"
                                                    >
                                                        <button 
                                                        onClick={() => setActiveIdx(idx)}
                                                            className= {
                                                            idx === activeIdx
                                                                ? "bg-primary rounded-full p-2 hover:cursor-pointer text-muted-foreground text-xl inline-flex items-center justify-center"
                                                                : "hover:bg-primary hover:text-muted-foreground  hover:cursor-pointer rounded-full p-2 text-xl inline-flex items-center justify-center"
                                                            }
                                                        >
                                                            {item.description}
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        
                                    <div className="pt-8"> 
                                        {number_four[activeIdx].short}
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
                <div className="bg-secondary rounded-t-4xl -mt-8 shadow-[0px_-1px_5px_10px_rgba(0,0,0,0.3)] animate-fade-in">
                    <div className="container mx-auto space-y-6 py-16">
                        <h2 className="text-2xl md:text-3xl text-center leading-tight  font-bold text-primary">Typische Folgen
                        <span className="font-serif italic font-normal text-white"> zeigen sich oft so: </span>
                        </h2>
                            <br/>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex glass rounded-2xl items-center justify-center">
                                        <span className="text-4xl text-black">BILD?</span>
                                    </div>
                                    <div className="space-y-6">
                                        <p className="text-lg">Wir arbeiten nicht nur auf einer Ebene – sondern dort, wo Veränderung tatsächlich entsteht:
                                        </p>
                                        <div className="pl-6">
                                            {number_five.map((item, idx) => (
                                                <div 
                                                    key={idx} 
                                                    className="p-0"
                                                >
                                                    <span className="text-lg inline-flex items-center justify-center gap-4">
                                                        <ArrowRight className="w-4 h-4 text-primary items-center bg-primary rounded-full"/>
                                                            {item.description}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-lg">Unser Ziel ist es nicht, etwas an dir zu „reparieren“.
                                        </p>
                                        <p className="text-lg">Sondern dich dabei zu begleiten,
                                            wieder Zugang zu dem zu bekommen,
                                            was bereits in dir angelegt ist:
                                        </p>
                                        <p className="text-lg">Sondern dich dabei zu begleiten,
                                            wieder Zugang zu dem zu bekommen,
                                            was bereits in dir angelegt ist:
                                        </p>
                                        <div className="pl-6">
                                            {number_six.map((item, idx) => (
                                                <div 
                                                    key={idx} 
                                                    className="p-0"
                                                >
                                                    <span className="text-lg inline-flex items-center justify-center gap-4">
                                                        <ArrowRight className="w-4 h-4 text-primary items-center bg-primary rounded-full"/>
                                                            {item.description}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div> 
                            <div className="flex glass rounded-2xl items-center justify-center">
                                <div className="rounded-2xl py-6 px-12 ">
                                    <h3 className="text-2xl text-center font-bold">Wie wir arbeiten</h3>
                                    <br/>
                                    <p className="text-lg text-center">
                                        Unsere Begleitung findet in einem geschützten Online-Rahmen statt.
                                    </p>
                                    <br/>
                                    <p className="text-lg text-center">
                                        Wir arbeiten:
                                    </p>
                                    <br/>
                                    <div className="flex items-center justify-center">
                                        <div className="pl-6">
                                            {number_seven.map((item, idx) => (
                                                    <div 
                                                        key={idx} 
                                                        className="p-0"
                                                    >
                                                        <span className="text-lg inline-flex items-center justify-center gap-4">
                                                            <ArrowRight className="w-3 h-3 text-primary items-center bg-primary rounded-full"/>
                                                            {item.description}
                                                        </span>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                    <br/>
                                    <p className="text-lg text-center">
                                        Du musst nichts leisten. Nichts beweisen.
                                    </p>
                                    <br/>
                                    <p className="text-lg text-center">
                                        Du darfst ankommen – mit dem, was da ist.
                                    </p>
                                    <br/>
                                    <p className="text-lg text-center">
                                        Und genau dort beginnen wir.
                                    </p>
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