import { Code2, Lightbulb, Rocket, Users, ArrowRight, Check, Calendar1, UserRound, Puzzle, ShieldHalf, SlidersHorizontal, Zap, DoorOpen, Flame, LockKeyhole, Star, Angry, BrainCircuit, HeartCrack, ShieldQuestionMark, CalendarDays, Heart, EyeClosed, Repeat, BrainCog, Leaf, Hourglass } from "lucide-react"
import { useState } from "react";
import { Button } from "@/components/Button"

{/* Verstehe deine inneren Muster und finde neue Handlungsspielräume */}
const number_one = [
    {
        description:
        "Wann ist dieser Anteil entstanden?",
    },
    {
        description:
        "Wovor schützt er?",
    },
    {
        description:
        "Welche Erfahrung trägt er?",
    },
    {
        description:
        "Welche Gefühle durfte der Mensch damals nicht fühlen?",
    },
    {
        description:
        "Welche Dynamik wiederholt sich heute noch?",
    },
    {
        description:
        "Und was passiert im Nervensystem, wenn bestimmte Situationen aktiviert werden?",
    },
];

{/* Der Blick nach innen */}
const number_two = [
    {
        description:
        "dass ihre inneren Reaktionen Sinn ergeben,",
    },
    {
        description:
        "dass Scham nicht ihre Identität ist,",
    },
    {
        description:
        "dass hinter Wut oft Schmerz liegt,",
    },
    {
        description:
        "dass Kontrolle manchmal Angst schützt,",
    },
    {
        description:
        "oder dass ein Anteil noch immer glaubt, in einer alten Realität überleben zu müssen.",
    },
];

{/* Warum Veränderung oft nicht funktioniert */}
const number_three = [
    {
        description:
        "dich zu „kontrollieren“",
    },
    {
        description:
        "anders zu denken",
    },
    {
        description:
        "dich zusammenzureißen",
    },
];

{/* Der Weg zur inneren Klärung */}
const number_four = [
    {
        description:
        "welche inneren Stimmen in dir wirken",
    },
    {
        description:
        "welche Bedürfnisse dahinter stehen",
    },
    {
        description:
        "und warum du in bestimmten Situationen so reagierst",
    },
];

{/* Der Weg zur inneren Klärung */}
const number_five = [
    {
        description:
        "Ein Teil möchte Sicherheit",
    },
    {
        description:
        "ein anderer möchte Veränderung",
    },
    {
        description:
        "ein weiterer hält an alten Mustern fest",
    },
];

const number_onenew = [
    {
        icon: UserRound,
        description:
        "Diese Anteile kämpfen oft gegeneinander, ohne dass wir es bewusst merken.",
    },
    {
        icon: Puzzle,
        description:
        "Ein Teil möchte Nähe. Ein anderer hat Angst davor.",
    },
    {
        icon: ShieldHalf,
        description:
        "Ein Teil möchte sichtbar sein. Ein anderer schämt sich zutiefst dafür.",
    },
    {
        icon: SlidersHorizontal,
        description:
        "Ein Teil hält alles unter Kontrolle. Ein anderer sehnt sich nach Freiheit.",
    },
];

const number_twonew = [
    {
        icon: Zap,
        description:
        "Wut",
    },
    {
        icon: DoorOpen,
        description:
        "Rückzug",
    },
    {
        icon: Flame,
        description:
        "Eifersucht",
    },
    {
        icon: LockKeyhole,
        description:
        "Kontrolle",
    },
    {
        icon: Star,
        description:
        "Kontrolle",
    },
    {
        icon: BrainCircuit,
        description:
        "Kontrolle",
    },
    {
        icon: Angry,
        description:
        "Kontrolle",
    },
    {
        icon: HeartCrack,
        description:
        "Kontrolle",
    },
];

const number_threenew = [
    {
        icon: CalendarDays,
        description:
        "Wann ist dieser Anteil entstanden ?",
    },
    {
        icon: ShieldQuestionMark,
        description:
        "Wovor schützt er ?",
    },
    {
        icon: Heart,
        description:
        "Welche Erfahrung trägt er ?",
    },
    {
        icon: EyeClosed,
        description:
        "Welche Gefühle durfte der Mensch damals nicht fühlen ?",
    },
    {
        icon: Repeat,
        description:
        "Welche Dynamik wiederholt sich heute ?",
    },
    {
        icon: BrainCog,
        description:
        "Und was passiert im Nervensystem, wenn bestimmte Situationen aktiviert werden ?",
    },
];

const number_fournew = [
    {
        icon: Leaf,
        description:
        "Sie ist ein ehrlicher Blick nach innen.",
    },
    {
        icon: Heart,
        description:
        "Behutsam Tiefgehend",
    },
    {
        icon: Hourglass,
        description:
        "Im Tempo deines Systems.",
    },
];

export const Nlp = () => {
    
    return (
        <section id="about" className="relative overflow-hidden">
            <div className="border border-primary rounded-2xl overflow-hidden">
                <div className="grid lg:grid-cols-2">
                    <div className="lg:pl-16 py-6 max-lg:text-center">
                        <h2 className="text-3xl md:text-4xl leading-tight text-primary">NLP &
                            <span className="font-serif font-normal text-white"> Arbeit mit</span> <br/>
                            <span className="font-serif font-normal text-primary"> inneren Anteilen </span>
                        </h2>
                        <br/>
                        <div className="grid gap-12 lg:grid-cols-4 grid-cols-2">
                            <div className="h-0.5 bg-linear-to-l from-primary via-primary/60 to-transparent"/>
                            <div className="h-0.5 bg-linear-to-r from-primary via-primary/60 to-transparent"/>
                        </div>
                        <div className="flex max-lg:items-center max-lg:justify-center lg:pl-10 xl:pl-18.5 2xl:pl-26.5 -mt-11.5">
                            <img src="/traumasensibel/Blume.png" className="w-26 h-24 rounded-full"/>
                        </div>
                        <h3 className="-mt-4 font-bold">
                            Nicht alle Teile in dir wollen dasselbe.
                        </h3>
                        <br/>
                        <p>Viele Menschen glauben, sie hätten „ein Problem“. <br/>
                            Dabei erleben wir in unserer Arbeit immer wieder etwas ganz anderes: <br/><br/>
                        </p>
                        <div className=" pl-2">
                            <p>Ein Mensch besteht nicht nur aus einer einzigen Persönlichkeit. <br/>
                                In uns leben unterschiedliche innere Anteile - manche laut, manche still, manche verletzt, <br/>
                                kontrollierend, wütend, angepasst, funktionierend, beschämend oder vollkommen erschöpft.
                            </p>
                        </div>
                    </div>
                    <div className="flex">
                        <img src="/nlp/nlp4.jpeg" className="lg:mask-l-from-70%"/>
                    </div>
                </div>
            </div>
            <div className="grid lg:grid-cols-2 py-4 w-full h-full">
                <div className="glass-strong rounded-2xl glow-border py-4 pl-4 pr-16">
                    <h2 className="text-2xl md:text-2xl leading-tight pb-2 text-muted-foreground">Innere Anteile verstehen
                    </h2>
                    <div className="grid grid-cols-4 pl-2">
                        <div className="h-0.5 bg-linear-to-l from-primary via-primary/60 to-transparent"/>
                        <div className="h-0.5 bg-linear-to-r from-primary via-primary/60 to-transparent"/>
                    </div>
                    <div className="pl-2 pt-2">
                        {number_onenew.map((item, idx) => (
                        <div 
                            key={idx} 
                            className="p-0"
                        >
                            <div className="inline-flex gap-4">
                                <div>
                                    <item.icon className="text-primary p-2 bg-white rounded-full w-12 h-12"/>
                                </div>
                                <span className="inline-flex text-muted-foreground items-center justify-center gap-4">
                                    {item.description}
                                </span>    
                            </div>
                        </div>
                        ))}
                    </div>
                    <p className="text-black pt-2 -mr-16">Unser Ziel ist nicht, Anteile zu verändern oder webzumachen - sondern sie zu verstehen und ihre positive Absicht zu erkennen.</p>
                </div>
                <div>
                    <h2 className="text-2xl md:text-2xl leading-tight pb-2 text-white text-center">Anteile, die wir häufig begleiten
                    </h2>
                    <div className="grid grid-cols-4 pl-2">
                        <div/>
                        <div className="h-0.5 bg-linear-to-l from-primary via-primary/60 to-transparent"/>
                        <div className="h-0.5 bg-linear-to-r from-primary via-primary/60 to-transparent"/>
                    </div>
                    <div className="grid lg:grid-cols-4 grid-cols-2 pl-4 pt-2 gap-4">
                        {number_twonew.map((item, idx) => (
                        <div 
                            key={idx} 
                            className="p-0"
                        >
                            <div className="py-2 bg-muted-foreground/30 rounded-2xl">
                                <div className="flex items-center justify-center">
                                    <item.icon className="text-primary p-2 w-12 h-12"/>   
                                </div>
                                <p className="text-center pt-2 text-white justify-center gap-4">
                                        {item.description}
                                </p>
                            </div>
                        </div>
                        ))}
                    </div>
                    <p className="text-white pt-4 text-center">All das sind Überlebensstrategien eines Systems,
                        <br/>
                        das irgendwann lernen musste, sich zu schützen
                    </p>
                    <p className="text-primary text-center">Nicht gegen den Menschen. Sondern für ihn.
                    </p>
                </div>        
            </div>
            <div className="grid lg:grid-cols-2 py-4 gap-4">
                <div className="glass-strong rounded-2xl glow-border overflow-hidden">
                    <div className="grid grid-cols-2 xl:-mb-24 h-full">
                        <div className="flex -mr-32 py-4 pl-4">
                            <div className="">
                                <div className="">
                                    <h2 className="text-2xl md:text-2xl leading-tight pb-2 text-muted-foreground">Wir
                                        <span className="font-serif font-normal text-primary"> begegnen </span>
                                        den Anteilen - <br/> wir machen sie nicht weg.
                                    </h2>
                                    <div className="grid grid-cols-4 pl-2">
                                        <div className="h-0.5 bg-linear-to-l from-primary via-primary/60 to-transparent"/>
                                        <div className="h-0.5 bg-linear-to-r from-primary via-primary/60 to-transparent"/>
                                    </div>
                                </div>
                                <div className="flex max-xl:pt-4 xl:pt-8 2xl:pt-18">
                                    <div>
                                        <p className="text-muted-foreground pb-2">Wir schauen:</p>
                                        <div className="pl-2">
                                            {number_threenew.map((item, idx) => (
                                            <div 
                                                key={idx} 
                                                className="p-0"
                                            >
                                                <div className="inline-flex items-center justify-center gap-4">
                                                    <div>
                                                        <item.icon className="text-primary p-0.5 bg-muted rounded-full w-8 h-8"/>
                                                    </div>
                                                    <span className="inline-flex text-sm text-muted-foreground items-center justify-center gap-4">
                                                        {item.description}
                                                    </span>    
                                                </div>
                                            </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="">
                            <img src="/nlp/strand.JPG" className="mask-l-from-20%"/>
                        </div>
                    </div>
                </div>
                <div className="glass-strong rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-2 h-full">
                        <div className="-mr-32 py-4 pl-4">
                            <h2 className="text-2xl md:text-2xl leading-tight pb-4 text-muted-foreground">Diese Arbeit ist
                                <span className="font-serif font-normal text-primary"> keine <br/> schnelle Optimierung </span>
                            </h2>
                            <div className="grid grid-cols-4 pl-2">
                                <div className="h-0.5 bg-linear-to-l from-primary via-primary/60 to-transparent"/>
                                <div className="h-0.5 bg-linear-to-r from-primary via-primary/60 to-transparent"/>
                            </div>
                                    <div className="pl-2 pt-4 xl:pt-10 2xl:pt-16">
                                        {number_fournew.map((item, idx) => (
                                        <div 
                                            key={idx} 
                                            className="p-0"
                                        >
                                            <div className="inline-flex gap-4">
                                                <div>
                                                    <item.icon className="text-primary p-2 bg-white rounded-full w-12 h-12"/>
                                                </div>
                                                <span className="inline-flex text-muted-foreground items-center justify-center gap-4">
                                                    {item.description}
                                                </span>    
                                            </div>
                                        </div>
                                        ))}
                                    </div>
                            <p className="text-primary pt-4 text-center">Denn wirkliche Veränderung entsteht <br/>
                                aus unserer Erfahrung - nicht durch Druck, <br/>
                                sondern durch Verständnis.
                            </p>
                        </div>
                        <div className="flex">
                            <img src="/nlp/türrechts.JPG" className="mask-l-from-20%"/>
                        </div>
                    </div>
                </div>        
            </div>
        </section>
    );
}