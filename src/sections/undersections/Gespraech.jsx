import { Code2, Lightbulb, Rocket, Users, ArrowRight, Check, Calendar1, Sun, Leaf, UserCheck } from "lucide-react"
import { useState } from "react";
import { Button } from "@/components/Button"

{/* Oft entstehen über Jahre innere Schleifen: */}
const number_one = [
    {
        description:
        "Grübeln",
    },
    {
        description:
        "Selbstkritik",
    },
];

const number_three = [
    {
        description:
        "Scham",
    },
    {
        description:
        "Rückzug",
    },
    {
        description:
        "Anpassung",
    },
    {
        description:
        "Kontrolle",
    },
    {
        description:
        "innerer Druck",
    },
];

{/* Der Blick nach innen */}
const number_two = [
    {
        description:
        "welche Dynamiken wirken",
    },
    {
        description:
        "welche Schutzmechanismen aktiv sind",
    },
    {
        description:
        "welche inneren Konflikte bestehen",
    },
    {
        description:
        "welche emotionalen Erfahrungen darunterliegen",
    },
];

const number_onenew = [
    {
        icon: UserCheck,
        description:
        "Viele Menschen haben gelernt, ihre Gefühle zu erklären.",
    },
    {
        icon: Leaf,
        description:
        "Aber nicht, sie wirklich zu fühlen.",
    },
    {
        icon: Sun,
        description:
        "Oder überhaupt wahrzunehmen, was in ihnen passiert.",
    },
];


export const Gsp = () => {
    
    return (
        <section id="about" className="relative overflow-hidden">
            <div className="glass-strong rounded-2xl overflow-hidden">
                <div className="grid lg:grid-cols-2">
                    <div className="lg:pl-16 pt-6 max-lg:text-center">
                        <h2 className="text-2xl md:text-3xl leading-tight pb-2 font-bold text-muted-foreground">GESPRÄCHSTHERAPIE
                        </h2>
                        <div className="grid lg:grid-cols-3 max-lg:grid-cols-2">
                            <div className="h-1 bg-primary"/>
                            <div className="h-1 bg-primary"/>
                        </div>
                        <h3 className="text-muted-foreground pt-2">
                            Manche Menschen brauchen keinen Ratschlag. Sondern einen Raum, in dem sie nicht bewertet werden. 
                        </h3>
                        <br/>
                        <div className="grid grid-cols-3 -mr-24">
                            {number_onenew.map((item, idx) => (
                            <div 
                                key={idx} 
                                className="p-0"
                            >
                                <div className="inline-flex justify-center gap-4">
                                    <div>
                                        <item.icon className="text-primary p-2 bg-white rounded-full w-12 h-12"/>
                                    </div>
                                    <span className="inline-flex text-sm text-muted-foreground items-center justify-center gap-4">
                                        {item.description}
                                    </span>    
                                </div>
                            </div>
                            ))}
                        </div>
                        <br/>
                        <p className="text-muted-foreground pt-2">Oft entstehen über Jahre innere Schleifen:
                        </p>
                        <br/>
                        <div className="lg:-mr-8 pt-2">
                            <div className="grid grid-cols-2">
                                <div className="grid grid-cols-2">
                                    {number_one.map((item, idx) => (
                                    <div 
                                        key={idx} 
                                        className="p-0"
                                    >
                                        <span className="text-muted-foreground inline-flex items-center justify-center gap-4">
                                            <ArrowRight className="w-2 h-2 text-primary items-center bg-primary rounded-full"/>
                                            {item.description}
                                        </span>
                                    </div>
                                    ))}
                                </div>
                                <span className="text-muted-foreground inline-flex items-center justify-center gap-4">
                                    <ArrowRight className="w-2 h-2 text-primary items-center bg-primary rounded-full"/>
                                    emotionale Überforderung
                                </span>
                            </div>
                        </div>
                        <div className="grid grid-cols-5 lg:-mr-24 pt-2">
                            {number_three.map((item, idx) => (
                                <div 
                                    key={idx} 
                                    className="p-0"
                                >
                                    <span className="text-muted-foreground inline-flex items-center justify-center gap-4">
                                        <ArrowRight className="w-2 h-2 text-primary items-center bg-primary rounded-full"/>
                                        {item.description}
                                    </span>
                                </div>
                                ))}
                            </div>
                            <br/>
                        <p className="text-muted-foreground pt-2">Und gleichzeitig die Angst, wirklich gesehen zu werden.
                        </p>
                    </div>
                    <div className="flex">
                        <img src="/gespr/gespr.jpeg" className="flex object-fill lg:mask-l-from-50% object-bottom"/>
                    </div>
                </div>
            </div>
                <div className="grid md:grid-cols-2 gap-4 pt-4">
                    <div className="glass-strong rounded-2xl overflow-hidden">
                        <div className="grid h-full lg:grid-cols-2">
                            <div className="flex -mx-8">
                                <img src="/gespr/gespr3.jpeg" className="flex object-fill lg:mask-r-from-50%"/>
                            </div>
                            <div className="py-4 max-lg:text-center">
                                <h3 className="text-xl md:text-xl text-center pb-2 leading-tight font-bold text-primary">Gespräche
                                    <span className="font-serif italic font-normal text-muted-foreground"> können regulieren </span>
                                </h3>
                                <div className="grid gap-16 grid-cols-2 px-2">
                                    <div className="h-0.5 bg-primary"/>
                                </div>
                                <p className="text-muted-foreground pt-2">Nicht, weil jemand die perfekte Lösung sagt.
                                </p>
                                <p className="text-muted-foreground">Sondern weil ein Nervensystem beginnt, sich in Kontakt sicherer zu fühlen.
                                </p>
                                <p className="text-muted-foreground">Gesprächstherapie bedeutet für uns deshalb nicht nur, über Probleme zu reden.
                                </p>
                                <br/>
                                <p className="text-muted-foreground">Sondern gemeinsam sichtbar zu machen:
                                </p>
                                <div className="flex items-center justify-center">
                                    <div className="pl-6">
                                        {number_two.map((item, idx) => (
                                        <div 
                                            key={idx} 
                                            className="p-0"
                                        >
                                            <span className="text-muted-foreground inline-flex items-center justify-center gap-4">
                                                <ArrowRight className="w-2 h-2 text-primary items-center bg-primary rounded-full"/>
                                                {item.description}
                                            </span>
                                        </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="glass-strong rounded-2xl overflow-hidden">
                        <div className="grid lg:grid-cols-2">
                            <div className="flex -mx-8">
                                <img src="/gespr/gespr2.jpeg" className="flex object-fill lg:mask-r-from-50%"/>
                            </div>
                            <div className="py-4 max-lg:text-center">
                                <h3 className="text-xl md:text-xl text-center pb-2 leading-tight font-bold text-primary">Was
                                    <span className="font-serif italic font-normal text-muted-foreground"> viele Menschen erleben</span>
                                </h3>
                                <div className="grid gap-16 grid-cols-2 px-2">
                                    <div className="h-0.5 bg-primary"/>
                                </div>
                                <p className="text-muted-foreground pt-2">Viele Menschen kommen zu uns, weil sie sich selbst längst nicht mehr verstehen.
                                </p>
                                <p className="text-muted-foreground">Sie reagieren stärker, als sie wollen.
                                </p>
                                <p className="text-muted-foreground">Oder fühlen plötzlich gar nichts mehr.
                                </p>
                                <p className="text-muted-foreground">Manche funktionieren perfekt und fühlen sich innerlich trotzdem leer.
                                </p>
                                <p className="text-muted-foreground pb-6.5">Andere erleben starke emotionale Reaktionen, <br/><br/>
                                Scham,
                                Bindungsangst,
                                Verlustangst,
                                Wut,
                                Kontrolle,
                                Selbsthass oder Ohnmacht.
                                Nicht,
                                weil sie falsch sind.
                                Sondern weil ihr System gelernt hat,
                                so zu überleben.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
        </section>
    );
}