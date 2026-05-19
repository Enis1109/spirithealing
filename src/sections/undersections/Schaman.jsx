import { Code2, Lightbulb, Rocket, Users, ArrowRight, Check, Calendar1 } from "lucide-react"
import { useState } from "react";
import { Button } from "@/components/Button"

{/* Oft entstehen über Jahre innere Schleifen: */}
const number_one = [
    {
        description:
        "im Nervensystem",
    },
    {
        description:
        "im Körper",
    },
    {
        description:
        "im Energiefeld",
    },
    {
        description:
        "im emotionalen Gedächtnis",
    },
    {
        description:
        "und auf seelischer Ebene",
    },
];

{/* Der Blick nach innen */}
const number_two = [
    {
        description:
        "körperlich",
    },
    {
        description:
        "energetisch",
    },
    {
        description:
        "beziehungshaft",
    },
    {
        description:
        "oder als wiederkehrende innere Muster.",
    },
];

{/* Warum Veränderung oft nicht funktioniert */}
const number_three = [
    {
        description:
        "innere Schwere",
    },
    {
        description:
        "chronische Erschöpfung",
    },
    {
        description:
        "das Gefühl, nicht richtig „im Leben“ zu sein",
    },
    {
        description:
        "emotionale Taubheit",
    },
    {
        description:
        "innere Zerrissenheit",
    },
    {
        description:
        "oder das Gefühl, von sich selbst abgeschnitten zu sein.",
    },
];

{/* Der Weg zur inneren Klärung */}
const number_four = [
    {
        description:
        "Reinigung energetischer Verdichtungen",
    },
    {
        description:
        "Harmonisierung der Chakren",
    },
    {
        description:
        "Lösung gespeicherter emotionaler Informationen",
    },
    {
        description:
        "Arbeit mit inneren Bildern und Wahrnehmungen",
    },
    {
        description:
        "energetischer Neuordnung",
    },
];

{/* Der Weg zur inneren Klärung */}
const number_five = [
    {
        description:
        "das Gefühl, nicht ganz da zu sein",
    },
    {
        description:
        "innere Leere",
    },
    {
        description:
        "fehlende Lebendigkeit",
    },
    {
        description:
        "emotionale Abgeschnittenheit",
    },
    {
        description:
        "oder das Gefühl, sich selbst verloren zu haben.",
    },
];

const number_six = [
    {
        description:
        "Nervensystemarbeit",
    },
    {
        description:
        "emotionale Prozessarbeit",
    },
    {
        description:
        "Bindungsdynamiken",
    },
    {
        description:
        "Körperwahrnehmung",
    },
    {
        description:
        "und schamanische Bewusstseinsarbeit.",
    },
];

const number_seven = [
    {
        description:
        "mehr innere Ruhe",
    },
    {
        description:
        "stärkeren Selbstkontakt",
    },
    {
        description:
        "emotionale Öffnung",
    },
    {
        description:
        "neue Klarheit",
    },
    {
        description:
        "mehr Lebendigkeit",
    },
    {
        description:
        "das Gefühl,  sich selbst wieder näher zu sein",
    },
];

export const Schaman = () => {
    
    return (
        <section id="about" className="relative overflow-hidden font-serif">
            <div className="container relative rounded-4xl z-10">
                <div className="rounded-2xl pl-8 border-primary border overflow-hidden glow-border">
                    <div className="grid lg:grid-cols-2">
                        <div className="lg:-mr-4 py-4 max-lg:text-center max-lg:px-4">
                            <h2 className="max-md:text-xl md:text-3xl leading-tight  font-bold text-primary">SCHAMANISCHE ARBEIT &
                                <span className="font-serif italic font-normal text-white"> ENERGETISCHE PROZESSARBEIT </span>
                            </h2>
                            <div className="grid gap-12 grid-cols-2 pt-4">
                                <div className="h-0.5 bg-linear-to-l from-primary via-primary/60 to-transparent"/>
                                <div className="h-0.5 bg-linear-to-r from-primary via-primary/60 to-transparent"/>
                            </div>
                            <div className="flex -mt-12 justify-center">
                                <img src="/traumasensibel/Blume.png" className="w-26 h-24 rounded-full"/>
                            </div>
                                <h3 className="text-xl -mt-8">
                                    Es gibt Ebenen im Menschen, die tiefer reichen als Sprache.
                                </h3>
                                <br/>
                                <p className="">Manche Menschen verstehen ihre Geschichte. Und bleiben innerlich trotzdem abgeschnitten.
                                </p>
                                <p className="">Sie wissen, warum sie reagieren. Warum sie Angst haben. Warum sie sich zurückziehen.
                                </p>
                                <p className="">Und trotzdem bleibt etwas bestehen.
                                </p>
                                <p className="">Eine Schwere. Eine innere Fremdheit. Das Gefühl, nicht vollständig bei sich zu sein.
                                </p>
                                <p className="">Als würde ein Teil von ihnen irgendwo unterwegs verloren gegangen sein.
                                </p>
                        </div>
                        <div className="h-full flex rounded-2xl -ml-32">
                            <img src="/schamanisch/sch1.jpeg" className="flex object-fill  lg:mask-l-from-60% mask-radial-[70%_90%] lg:mask-radial-from-80%"/>
                        </div>
                    </div>
                </div>
                <div className="grid lg:grid-cols-2 pt-4 gap-4 pb-4">
                    <div className="border border-primary glow-border pt-4 rounded-2xl px-4">
                        <h3 className="text-2xl md:text-2xl text-center leading-tight  font-bold text-primary">Unser Verständnis <br/>
                            <span className="font-serif italic font-normal text-white"> schamanischer Arbeit</span>
                        </h3>
                        <br/>
                        <p className="text-sm text-center">Das ist eine sehr alte Form menschlicher Heil- und Bewusstseinsarbeit.
                        </p>
                        <p className="text-sm text-center">Eine Arbeit, die davon ausgeht, dass Erfahrungen nicht nur psychologisch gespeichert werden.
                        </p>
                        <br/>
                        <p className="text-sm text-center">Sondern auch:
                        </p>
                        <br/>
                        <div className="flex items-center justify-center">
                            <div className="pl-6">
                                {number_one.map((item, idx) => (
                                <div 
                                    key={idx} 
                                    className="p-0"
                                >
                                    <span className="text-sm inline-flex items-center justify-center gap-4">
                                        <ArrowRight className="w-2 h-2 text-primary items-center bg-primary rounded-full"/>
                                        {item.description}
                                    </span>
                                </div>
                                ))}
                            </div>
                        </div>
                        <br/>
                        <p className="text-sm text-center">Viele Menschen spüren intuitiv, dass manche Verletzungen tiefer reichen, als Worte allein sie erreichen können.
                        </p>
                        <p className="text-sm text-center">Genau dort beginnt schamanische Arbeit.
                        </p>
                        <br/>
                    </div>
                    <div className="border border-primary glow-border rounded-2xl pl-4 overflow-hidden">
                        <div className="grid grid-cols-2">
                            <div className="-me-24 pt-4 ">
                                <h3 className="text-2xl md:text-2xl leading-tight  font-bold text-primary">Arbeit
                                    <span className="font-serif italic font-normal text-white"> mit dem Energiefeld</span>
                                </h3>
                                <br/>
                                <p className="text-sm">In der schamanischen Tradition nach Alberto Villoldo wird davon ausgegangen, dass Menschen von einem Leuchtenden Energiefeld umgeben sind.
                                </p>
                                <p className="text-sm">In diesem Feld speichern sich Erfahrungen, emotionale Prägungen, Schocks, Bindungsverletzungen und ungelöste Prozesse.
                                </p>
                                <p className="text-sm">Diese Informationen wirken oft lange weiter.
                                </p>
                                <p className="text-sm">Nicht nur emotional. Sondern manchmal auch:
                                </p>
                                <br/>
                                    {number_two.map((item, idx) => (
                                    <div 
                                        key={idx} 
                                        className="p-0"
                                    >
                                        <span className="text-sm inline-flex items-center justify-center gap-4">
                                            <ArrowRight className="w-2 h-2 text-primary items-center bg-primary rounded-full"/>
                                            {item.description}
                                        </span>
                                    </div>
                                    ))}
                                <br/>
                                <p className="text-sm">Unsere Arbeit richtet sich deshalb nicht nur auf Gedanken oder Verhalten.
                                </p>
                                <p className="text-sm">Sondern auf die tieferen Ebenen, auf denen Erfahrungen im Menschen weiterleben.
                                </p>
                                <br/>
                            </div>
                            <div className="h-full flex rounded-2xl -mr-16">
                                <img src="/schamanisch/sch22.JPG" className="flex object-fill  mask-l-from-60% mask-radial-[70%_90%] mask-radial-from-80%"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border border-primary glow-border rounded-2xl pl-4 overflow-hidden">
                    <div className="grid lg:grid-cols-2">
                            <div className="h-full flex rounded-2xl -ml-32">
                                <img src="/schamanisch/sch3.jpeg" className="flex object-fill  lg:mask-r-from-59%"/>
                            </div>
                            <div className="pt-4 lg:-ml-4 lg:pr-4 max-lg:text-center">
                                <h3 className="text-2xl md:text-2xl text-center leading-tight  font-bold text-primary">Chakrenarbeit &
                                    <span className="font-serif italic font-normal text-white"> energetische Reinigung</span>
                                </h3>
                                <br/>
                                <p className="text-sm">Ein wichtiger Teil unserer Arbeit ist die bewusste Arbeit mit den Energiezentren des Menschen.
                                </p>
                                <p className="text-sm">In vielen spirituellen Traditionen wird davon ausgegangen, dass emotionale Erfahrungen, Trauma,
                                    Scham,
                                    Angst,
                                    Wut oder Ohnmacht nicht nur psychisch,
                                    sondern auch energetisch gespeichert werden.
                                </p>
                                <p className="text-sm">Dadurch kann der Energiefluss blockiert werden.
                                </p>
                                <p className="text-sm pb-2">Menschen beschreiben dann häufig:
                                </p>
                                <div className="pl-4 pb-2 text-left">
                                    <div className="">
                                        {number_three.map((item, idx) => (
                                        <div 
                                            key={idx} 
                                            className="p-0"
                                        >
                                            <span className="text-sm inline-flex items-center justify-center gap-4">
                                                <ArrowRight className="w-2 h-2 text-primary items-center bg-primary rounded-full"/>
                                                {item.description}
                                            </span>
                                        </div>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-sm pb-2">In der schamanischen Energiearbeit arbeiten wir deshalb unter anderem mit:
                                </p>
                                 <div className="pl-4 pb-2 text-left">
                                    <div className="">
                                        {number_four.map((item, idx) => (
                                        <div 
                                            key={idx} 
                                            className="p-0"
                                        >
                                            <span className="text-sm inline-flex items-center justify-center gap-4">
                                                <ArrowRight className="w-2 h-2 text-primary items-center bg-primary rounded-full"/>
                                                {item.description}
                                            </span>
                                        </div>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-sm">iele Menschen erleben diese Prozesse als tief, bewegend und gleichzeitig überraschend klar.
                                </p>
                                <br/>
                            </div>
                        </div>
                </div>
                <div className="py-4">
                    <div className="border border-primary glow-border rounded-2xl lg:pl-4 overflow-hidden">
                        <div className="grid lg:grid-cols-2">
                            <div className="pt-4 -mr-4 pl-4">
                                <h3 className="text-2xl md:text-2xl text-center pb-4 leading-tight  font-bold text-primary">Seelenanteils
                                    <span className="font-serif italic font-normal text-white">rückholung</span>
                                </h3>
                                <p className="text-sm">Manche Erfahrungen sind für ein Nervensystem so überwältigend, dass sich Teile des eigenen Erlebens abspalten.
                                </p>
                                <p className="text-sm">In der schamanischen Tradition spricht man hier von Seelenanteilen, die sich zurückgezogen haben, <br/>
                                    um den Menschen vor zu großer emotionaler Überforderung zu schützen.
                                </p>
                                <p className="text-sm">Menschen beschreiben oft:
                                </p>
                                <div className="pl-2 py-2">
                                    <div className="">
                                        {number_five.map((item, idx) => (
                                        <div 
                                            key={idx} 
                                            className="p-0"
                                        >
                                            <span className="text-sm inline-flex items-center justify-center gap-4">
                                                <ArrowRight className="w-2 h-2 text-primary items-center bg-primary rounded-full"/> 
                                                {item.description}
                                            </span>
                                        </div>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-sm">Die Seelenanteilsrückholung ist eine sehr tiefe, heilige Form schamanischer Arbeit. 
                                </p>
                                <p className="text-sm">Dabei geht es nicht darum, etwas künstlich hinzuzufügen.
                                </p>
                                <p className="text-sm">Sondern darum, verlorene Lebendigkeit, Verbindung und innere Ganzheit wieder zugänglich zu machen. 
                                </p>
                                <p className="text-sm">Viele Menschen erleben diese Arbeit als zutiefst berührend.
                                </p>
                                <p className="text-sm">Nicht spektakulär. Sondern eher wie ein inneres Erinnern.
                                </p>
                                <br/>
                            </div>
                            <div className="h-full w-full flex rounded-2xl lg:-mr-32">
                                <img src="/schamanisch/sch4.jpeg" className="flex object-fill lg:mask-l-from-59%"/>
                            </div>
                        </div>
                    </div>
                </div>
            <div className="grid lg:grid-cols-2 gap-4 pb-4">
                    <div className="border border-primary glow-border rounded-2xl overflow-hidden">
                        <div className="grid grid-cols-2">
                            <div className="h-full flex rounded-2xl -ml-24">
                                <img src="/schamanisch/sch55.JPG" className="flex object-fill  mask-r-from-40%"/>
                            </div>
                            <div className="-ml-16 py-4 pr-4">
                                <h3 className="text-2xl md:text-2xl text-center leading-tight  font-bold text-primary">Schamanische Arbeit
                                    <span className="font-serif italic font-normal text-white"> & Trauma</span>
                                </h3>
                                <p className="text-sm">Für uns steht schamanische Arbeit nicht im Gegensatz zu psychologischer oder trauma-sensitiver Begleitung.
                                </p>
                                <p className="text-sm">Im Gegenteil.
                                </p>
                                <p className="text-sm">Gerade Menschen mit frühen Bindungsverletzungen, chronischer innerer Spannung
                                    oder tiefen Scham- und Ohnmachtsdynamiken erleben oft, dass rein kognitive Prozesse nicht ausreichen.
                                </p>
                                <p className="text-sm">Deshalb verbinden wir:
                                </p>
                                <div className="flex items-center justify-center">
                                    <div className="pl-6">
                                        {number_six.map((item, idx) => (
                                        <div 
                                            key={idx} 
                                            className="p-0"
                                        >
                                            <span className="text-sm inline-flex items-center justify-center gap-4">
                                                <ArrowRight className="w-2 h-2 text-primary items-center bg-primary rounded-full"/>
                                                {item.description}
                                            </span>
                                        </div>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-sm">Nicht als Widerspruch. Sondern als Ergänzung.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="border border-primary glow-border rounded-2xl overflow-hidden">
                        <div className="grid h-full lg:grid-cols-2">
                            <div className="py-4 max-lg:px-4 lg:-mr-16 max-lg:text-center">
                                <h3 className="text-2xl md:text-2xl text-center leading-tight  font-bold text-primary">Unsere
                                    <span className="font-serif italic font-normal text-white"> Haltung</span>
                                </h3>
                                <br/>
                                <p className="text-sm">Wir glauben nicht, dass alles rational erklärbar sein muss, um wirksam zu sein.
                                </p>
                                <br/>
                                <p className="text-sm">Und gleichzeitig verlieren wir dabei nie den Kontakt zur Realität.
                                </p>
                                <br/>
                                <p className="text-sm">Unsere Arbeit verbindet spirituelle Tiefe mit emotionaler Ehrlichkeit, psychologischer Präzision <br/>
                                und einem sehr klaren Blick auf menschliche Dynamiken.
                                </p>
                                <br/>
                                <p className="text-sm">Nicht jede Erfahrung lässt sich messen. Aber viele Erfahrungen lassen sich tief spüren.
                                </p>
                                <br/>
                            </div>
                            <div className="flex rounded-2xl lg:-mr-32 lg:-ml-16">
                                <img src="/schamanisch/sch6.jpeg" className="flex object-fill  lg:mask-l-from-59%"/>
                            </div>
                        </div>
                    </div>
            </div>
            <div className="border border-primary glow-border rounded-2xl overflow-hidden">
                <div className="grid h-full lg:grid-cols-2 gap-4">                            
                    <div className="py-4">
                        <h3 className="text-2xl md:text-2xl text-center leading-tight pb-4 font-bold text-primary">Unsere Arbeit
                            <span className="font-serif italic font-normal text-white"> ist eine Einladung.</span>
                        </h3>
                        <div className="grid lg:grid-cols-3 gap-4">
                                <div className="h-full items-center justify-center">
                                    <div className="flex items-center justify-center">
                                        <div className="h-18 w-18 items-center justify-center rounded-full bg-[url('/schamanisch/blatt1.png')] border-2 border-primary bg-center bg-cover  overflow-hidden">
                                        </div>
                                    </div>
                                    <div className="flex pt-2 items-center justify-center ">
                                        <p className="text-sm text-center text-muted-foreground">
                                            Nicht, etwas <br/> glauben zu müssen
                                        </p>
                                    </div>
                                </div>
                                <div className="h-full items-center border-x justify-center">
                                    <div className="flex items-center justify-center">
                                        <div className="h-18 w-18 items-center justify-center rounded-full bg-[url('/schamanisch/straße.png')] border-2 border-primary bg-center bg-cover  overflow-hidden">
                                        </div>
                                    </div>
                                    <div className="flex pt-2 items-center justify-center ">
                                        <p className="text-sm text-center text-muted-foreground">
                                            Sondern Erfahrungen <br/> zu machen
                                        </p>
                                    </div>
                                </div>
                                <div className="h-full items-center justify-center">
                                    <div className="flex items-center justify-center">
                                        <div className="h-18 w-18 items-center justify-center rounded-full bg-[url('/schamanisch/sonne.png')] border-2 border-primary bg-center bg-cover  overflow-hidden">
                                        </div>
                                    </div>
                                    <div className="flex pt-2 items-center justify-center ">
                                        <p className="text-sm text-center text-muted-foreground">
                                            Und vielleicht Stück <br/> für Stück
                                        </p>
                                    </div>
                                </div>
                            </div>
                        <p className="text-sm text-center pt-4 px-4 text-muted-foreground">
                           wieder Zugang zu Ebenen in dir zu bekommen, lange verschlossen waren.
                        </p>
                    </div>
                    <div className="flex rounded-2xl -mr-32 -ml-16">
                        <img src="/schamanisch/sch777.JPG" className="flex object-fill  mask-l-from-59%"/>
                    </div>
                </div>
            </div>
        </div>
    </section>
    );
}