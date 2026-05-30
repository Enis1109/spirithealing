import { Code2, Lightbulb, Rocket, Users, ArrowRight, Check, Calendar1 } from "lucide-react"
import { useState } from "react";
import { Button } from "@/components/Button"
import { Link } from "react-router-dom"

const highlitghts = [
    {
        icon: Lightbulb,
        title: "Seelenlesung",
        description:
        "Erfahren Sie, was Ihr spiritueller Weg für Sie bereithält und gewinnen Sie Klarheit über Ihre innere Welt.",
    },
    {
        icon: Rocket,
        title: "Heilungsrituale",
        description:
            "Nutzen Sie unsere Rituale, um emotionale Blockaden zu lösen und neue Energie zu tanken.",
    },
    {
        icon: Users,
        title: "Energiearbeit",
        description:
            "Lassen Sie negative Energien hinter sich und bringen Sie Ihre Lebensenergie wieder ins Fließen.",            
    },
];

{/*Header*/}
const number_one = [
    {
        description:
        "Überforderung.",
    },
    {
        description:
        "Bindungsangst.",
    },
    {
        description:
        "Verlustangst.",
    },
    {
        description:
        "Scham.",
    },
    {
        description:
        "Selbsthass.",
    },
    {
        description:
        "Innere Zerrissenheit.",
    },
];

{/*Selcan*/}
const number_two = [
    {
        description:
        "Ruhig.",
    },
    {
        description:
        "Präsent.",
    },
    {
        description:
        "Nicht erschrocken.",
    },
    {
        description:
        "Nicht wertend.",
    },
];

{/*Sabine*/}
const number_three = [
    {
        description:
        "Nicht weichgespült.",
    },
    {
        description:
        "Nicht oberflächlich motivierend.",
    },
    {
        description:
        "Sondern ehrlich.",
    },
    {
        description:
        "Direkt.",
    },
    {
        description:
        "Und gleichzeitig haltgebend.",
    },
];

{/*Wie wir gemeinsam arbeiten*/}
const number_four = [
    {
        description:
        "emotional",
    },
    {
        description:
        "psychologisch",
    },
    {
        description:
        "körperlich",
    },
    {
        description:
        "bindungsorientiert",
    },
    {
        description:
        "energetisch",
    },
    {
        description:
        "systemisch",
    },
];

const number_five = [
    {
        description:
        "Mit Wahrnehmung.",
    },
    {
        description:
        "Mit Präsenz.",
    },
    {
        description:
        "Mit Tiefe.",
    },
];

export const About = () => {
    const [isSchmidt, setIsSchmidt] = useState(true);
    
    return (
        <section id="about" className="pt-20 relative overflow-hidden">
            <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"/>
            <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-highlight/5 rounded-full blur-3xl"/>
            <div className="container relative z-10 min-w-screen">
                <div className="container mx-auto pt-6 pb-20">
                    <h1 className="text-4xl text-center md:text-5xl font-bold leading-tight animate-fade-in animation-delay-100 text-primary glow-text">
                        Über uns – 
                        <span className="font-serif italic font-normal text-white"> Zwei Menschen. Eine gemeinsame Arbeit</span>
                    </h1>
                    <div className="grid lg:grid-cols-2 gap-6">
                        <div className="space-y-8">
                            <br/>
                            <div className="space-y-4 text-white animate-fade-in animation-delay-200">
                                <div className="glass rounded-2xl glow-border py-6">
                                    <p className="text-center text-lg">
                                    Wir kommen beide nicht aus einer rein theoretischen Coaching-Welt.
                                </p>
                                <br/>
                                <p className="text-center text-lg">
                                Unsere Arbeit ist nicht aus Büchern entstanden.
                                Sondern aus jahrelanger direkter Erfahrung mit Trauma, psychischen Extremsituationen, Bindungsdynamiken, 
                                Nervensystemzuständen, Kontrollverlust, Scham, Angst, Ohnmacht und tiefen emotionalen Prozessen.
                                </p>
                                <br/>
                                <p className="text-center text-lg">
                                Wir kennen Zustände, <br/>
                                in denen Menschen gleichzeitig funktionieren und innerlich zerbrechen.
                                </p>
                                <br/>
                                    <p className="text-center text-lg">
                                    Wir kennen:
                                </p>
                                <br/>
                                <div className="flex items-center justify-center">
                                    <div className="pl-6">
                                        {number_one.map((item, idx) => (
                                                <div 
                                                    key={idx} 
                                                    className="p-0"
                                                >
                                                    <span className="text-white text-lg inline-flex items-center justify-center gap-4">
                                                        <ArrowRight className="w-4 h-4 text-primary items-center bg-primary rounded-full"/>
                                                        {item.description}
                                                    </span>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                                <br/>
                                <p className="text-center text-lg">
                                Und das Gefühl, nicht richtig zu sein. Und genau deshalb arbeiten wir heute anders.
                                </p>
                                <br/>
                                <p className="text-center text-lg">
                                    Nicht aus einer distanzierten Expertenrolle. <br/>
                                    Nicht mit spirituellen Floskeln.
                                </p>
                                <br/>
                                <p className="text-center text-lg">
                                Sondern aus echter Erfahrung.
                                </p>
                                </div>
                            </div>
                            
                        </div>
                        <div className="rounded-4xl pt-6 animate-fade-in animation-delay-200">
                            <img src="ueberuns.jpeg"className=" w-full h-full rounded-2xl glow-border" >
                            </img>
                        </div>
                    </div>
                    {/*<div className="grid sm:grid-cols-3 gap-6 py-6">
                            {highlitghts.map((item, idx) => (
                                <div 
                                    key={idx} 
                                    className="glass p-6 rounded-2xl animate-fade-in"
                                    style={{animationDelay: '${(idx + 1) * 100}ms'}} 
                                >
                                    <div className="w-12 h-12 rounded-xl bg-primar/10 flex items-center justify-center mb-4 hover:bg-primary/20">
                                        <item.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                </div>
                            ))}
                    </div>*/}
                </div>
                {/*<div className=" bg-secondary rounded-t-4xl pb-8 shadow-[0px_-1px_5px_10px_rgba(0,0,0,0.3)] animate-fade-in">
                    <div className="container mx-auto space-y-6 py-16">
                        <span className="text-5xl text-center text-black font-bold leading-tight">Wie wir arbeiten:</span>
                        <p className="text-black text-lg font-bold italic text-center"> <br/>Unsere Begleitung verbindet:
                        </p>
                        <div className="justify-center items-center flex">
                            <div>
                                {number_two.map((item, idx) => (
                                    <div 
                                        key={idx} 
                                        className="p-0s"
                                    >
                                        <span className="text-black text-lg italic inline-flex items-center justify-center gap-4">
                                            <ArrowRight className="w-4 h-4 text-black items-center bg-primary rounded-full"/>
                                            {item.description}
                                        </span>                                
                                    </div>
                                ))}
                            </div>
                        </div>
                        <p className="text-black text-lg  italic text-center">Immer angepasst an dich.<br/>Immer in deinem Tempo.
                        </p>
                        <p className="text-black text-lg italic text-center">Du stehst im Mittelpunkt – nicht die Methode.
                        </p>                            
                    </div>
                </div>*/}
                <div className=" bg-card rounded-t-4xl pb-8 -mt-8 shadow-[0px_-1px_5px_10px_rgba(0,0,0,0.3)] animate-fade-in animation-delay-400">
                    <div className="container mx-auto space-y-6 py-16">
                        <h3 className="text-4xl md:text-5xl text-center leading-tight glow-text font-bold text-primary">Wer wir
                            <span className="font-serif italic font-normal text-white"> sind </span>
                            <br/>
                        </h3>
                        <div className="px-6 space-y-6">
                            <div className="flex rounded-full gap-6 items-center justify-center">
                                <div className="space-x-6 glass py-4 rounded-full px-4">
                                    <a
                                        className={isSchmidt ? "p-4 rounded-full bg-primary text-muted-foreground cursor-pointer" : "cursor-pointer hover:bg-primary hover:text-muted-foreground rounded-full p-4"}
                                        onClick={() => setIsSchmidt(true)}
                                    >
                                        Sabine Schmidt
                                    </a>
                                    <a 
                                        className={isSchmidt ? "hover:bg-primary hover:text-muted-foreground rounded-full p-4 cursor-pointer" : "p-4 cursor-pointer rounded-full bg-primary text-muted-foreground"}
                                        onClick={() => setIsSchmidt(false)}
                                    >
                                        Selcan Yilmaz
                                    </a>
                                </div>
                                
                            </div>
                            <div  className={isSchmidt ? "glass glow-border rounded-2xl p-6" : "hidden"}>
                                    <p className="text-lg text-center">Sabines Stärke liegt besonders in der Wahrnehmung tiefer emotionaler Prozesse, innerer Dynamiken und unbewusster Schutzstrukturen.</p>
                                    <br/>
                                    <p className="text-lg text-center">Sie arbeitet sehr intuitiv, gleichzeitig präzise.</p>
                                    <br/>
                                    <p className="text-lg text-center">Oft erkennt sie emotionale Muster, noch bevor Menschen sie selbst greifen können.</p>
                                    <br/>
                                    <p className="text-lg text-center">Ihre Arbeit verbindet emotionale Tiefe mit Klarheit.</p>
                                    <br/>
                                    <div className="flex items-center justify-center">
                                        <div className="pl-6">
                                            {number_three.map((item, idx) => (
                                                    <div 
                                                        key={idx} 
                                                        className="p-0"
                                                    >
                                                        <span className="text-white text-lg inline-flex items-center justify-center gap-4">
                                                            <ArrowRight className="w-4 h-4 text-primary items-center bg-primary rounded-full"/>
                                                            {item.description}
                                                        </span>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                    <br/>
                                    <p className="text-lg text-center">Besonders die Arbeit mit inneren Anteilen, Schamräumen, Beziehungsmustern und emotionalen Ambivalenzen prägt ihre Begleitung.</p>
                                    <br/>
                                    <p className="text-lg text-center">Zusätzlich begleitet sie Menschen seit Jahren auch in Erfahrungsgruppen, Gruppenprozessen und Ausbildungsräumen.</p>
                                    <br/>
                                    <p className="text-lg text-center">Dabei entsteht oft ein sehr ehrlicher Raum, in dem Menschen nicht nur Inhalte lernen, sondern beginnen,
                                    ihre eigenen Muster, Schutzmechanismen und inneren Dynamiken bewusster wahrzunehmen.</p>
                            </div>
                            <div  className={isSchmidt ? "hidden" : "glass glow-border rounded-2xl p-6"}>
                                    <p className="text-lg text-center">Selcan bringt eine außergewöhnlich feine Wahrnehmung für psychische Dynamiken, Nervensystemzustände und emotionale Schutzmechanismen mit.</p>
                                    <br/>
                                    <p className="text-lg text-center">
                                        Als Heilpraktikerin für Psychotherapie und durch viele Jahre praktischer Arbeit mit Menschen in psychischen 
                                        Extremsituationen entstand eine sehr präzise Fähigkeit,
                                        auch dort Orientierung zu behalten,
                                        wo andere Menschen innerlich den Boden verlieren.</p>
                                    <br/>
                                    <p className="text-lg text-center">
                                        Zusätzlich arbeitete sie über viele Jahre als Einzelfallhelferin mit Menschen,
                                        die ihren Alltag aufgrund psychischer Belastungen kaum noch alleine bewältigen konnten.</p>
                                    <br/>
                                    <p className="text-lg text-center">Diese Erfahrung prägt ihre Arbeit bis heute.</p>
                                    <br/>
                                    <div className="flex items-center justify-center">
                                        <div className="pl-6">
                                            {number_two.map((item, idx) => (
                                                    <div 
                                                        key={idx} 
                                                        className="p-0"
                                                    >
                                                        <span className="text-white text-lg inline-flex items-center justify-center gap-4">
                                                            <Check className="w-4 h-4 text-primary items-center bg-primary rounded-full"/>
                                                            {item.description}
                                                        </span>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                    <br/>
                                    <p className="text-lg text-center">Parallel dazu begleitet sie seit vielen Jahren Menschen auch in Gruppen- und Ausbildungsprozessen.</p>
                                    <br/>
                                    <p className="text-lg text-center">Als Dozentin verbindet sie psychologisches Verständnis, emotionale Tiefe und direkte Prozessarbeit mit einer sehr klaren, regulierenden Präsenz.</p>
                                     <br/>
                                    <p className="text-lg text-center">Viele Menschen erleben bei ihr zum ersten Mal,
                                    dass sie mit ihren inneren Zuständen nicht „zu viel“ sind.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-card rounded-t-4xl pb-8 -mt-8 shadow-[0px_-1px_5px_10px_rgba(0,0,0,0.3)] animate-fade-in animation-delay-400">
                    <div className="container mx-auto space-y-6 py-16">
                        <h3 className="text-4xl md:text-5xl text-center leading-tight glow-text font-bold text-primary">Wie wir
                            <span className="font-serif italic font-normal text-white"> gemeinsam arbeiten </span>
                            <br/>
                        </h3>
                        <p className="text-center text-lg">
                               Das Besondere an unserer Arbeit ist, dass wir gemeinsam arbeiten.
                        </p>
                        <div className="glass rounded-2xl glow-border py-6">    
                            <p className="text-lg text-center"> Dadurch entstehen oft mehrere Ebenen gleichzeitig:</p>
                            <div className="flex items-center justify-center py-6">
                                <div>
                                    {number_four.map((item, idx) => (                            
                                        <div 
                                            key={idx}                                 
                                            className="p-0"
                                        >                                
                                            <span className="text-center text-lg inline-flex items-center justify-center gap-4">
                                                <ArrowRight className="w-4 h-4 text-primary items-center bg-primary rounded-full"/>
                                                {item.description}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <p className="text-center text-lg">
                            Oft nimmt einer von uns stärker die emotionale oder energetische Ebene wahr, während der andere Schutzmechanismen, Dynamiken oder strukturelle Muster erkennt. <br/>
                            Dadurch entsteht eine sehr dichte, präzise Form der Prozessarbeit. <br/>
                            Viele Menschen beschreiben, dass dadurch Dinge sichtbar werden, die sie alleine nie erkannt hätten.
                        </p>
                    </div>
                </div>
                <div className=" bg-card rounded-4xl pb-8 -mt-8 shadow-[0px_-1px_5px_10px_rgba(0,0,0,0.3)] animate-fade-in animation-delay-400">
                    <div className="container mx-auto space-y-6 py-16">
                        <h3 className="text-4xl md:text-5xl text-center leading-tight glow-text font-bold text-primary">Was uns
                            <span className="font-serif italic font-normal text-white"> wichtig ist </span>
                            <br/>
                        </h3>
                        <p className="text-lg text-center "> Wir versuchen nicht, Menschen „positiv umzuprogrammieren“.</p>
                        <p className="text-lg text-center "> Uns interessiert nicht nur Verhalten.
                        Uns interessiert, warum ein System überhaupt so geworden ist.
                        </p>
                        <p className="text-lg text-center "> Viele Muster entstehen nicht aus Schwäche.
                        Sondern aus Überlebensstrategien.            
                        </p>
                        <p className="text-lg text-center ">Deshalb betrachten wir Wut, Rückzug, Kontrolle, Eifersucht, Ohnmacht oder Selbstsabotage nicht moralisch.</p>
                        <p className="text-lg text-center ">Sondern als Hinweise :<br/>
                        Auf Bindung. <br/>
                        Auf Schutz. <br/>
                        Auf alte emotionale Erfahrungen.
                        </p>
                        <div className="glass rounded-2xl glow-border py-6">    
                            <p className="text-2xl text-center font-bold"> Unsere Arbeit ist kein perfekter Coaching-Raum.</p>
                            <br/>
                            <p className="text-lg text-center"> Wir eröffnen einen geschützten Raum.</p>
                            <div className="flex items-center justify-center py-6">
                                <div>
                                    {number_five.map((item, idx) => (                            
                                        <div 
                                            key={idx}                                 
                                            className="p-0"
                                        >                                
                                            <span className="text-center text-lg inline-flex items-center justify-center gap-4">
                                                <ArrowRight className="w-4 h-4 text-primary items-center bg-primary rounded-full"/>
                                                {item.description}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <p className="text-lg text-center"> Und mit der Möglichkeit, sich selbst Stück für Stück wieder näherzukommen.</p>
                        </div>
                    </div>
                </div>
                <div className="bg-card"> 
                    <div className="grid md:grid-cols-3 ">
                        <div className="flex items-center justify-center py-8">
                            <Calendar1 className="md:w-36 md:h-36 w-24 h-24 text-primary"/>
                        </div>
                        <div className="md:-mx-8 py-8">    
                            <p className="md:text-2xl text-lg text-center">Manchmal ist es nur ein kleiner erster Schritt, </p> 
                            <p className="text-center md:text-2xl text-lg">der <span className="text-primary text-center"> alles in Bewegung </span> setzt. </p>
                            <div className="grid gap-8 grid-cols-2 px-2 pt-4">
                                <div className="h-0.5 bg-linear-to-l from-primary via-primary/60 to-transparent"/>
                                <div className="h-0.5 bg-linear-to-r from-primary via-primary/60 to-transparent"/>
                            </div>
                            <div className="flex -mt-8 -mb-8 items-center justify-center">
                                <img src="/traumasensibel/Blume.png" className="w-18 h-16 rounded-full"/>
                            </div>
                            <p className="text-center pt-4">
                                Wenn du möchtest, finden wir in einem kostenfreien Gespräch heraus, was dir gut tut.
                                Ganz unverbindlich und nur für dich.
                            </p>
                            <div className="flex items-center justify-center pt-4">
                                <Button size="lg">
                                    <div className="inline-flex justify-center text-black items-center">
                                    Kennenlernen <ArrowRight className="w-5 h-5"/>
                                    </div>
                                </Button>
                            </div>
                        </div>
                        <div className="flex">
                            <img src="/breachright.jpeg" className="flex object-cover md:mask-l-from-50% md:mask-b-from-60%"/>
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