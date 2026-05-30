import { Github, Instagram, Twitter, Check, Calendar1 } from "lucide-react";
import { Button } from "@/components/Button"
import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { Nlp } from "@/sections/undersections/Nlp"
import { Gsp } from "@/sections/undersections/Gespraech"
import { Fam } from "@/sections/undersections/Fam"
import { Schaman } from "@/sections/undersections/Schaman"
import { Link } from "react-router-dom"

{/*Wie läuft eine Sitzung bei euch ab ?*/}
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

{/*Arbeitet ihr auch mit körperlichen Symptomen oder Schmerzen ?*/}
const number_two = [
    {
        description:
        "Nervensystem,",
    },
    {
        description:
        "emotionalem Erleben,",
    },
    {
        description:
        "Stresszuständen,",
    },
    {
        description:
        "inneren Konflikten,",
    },
    {
        description:
        "Beziehungsmustern",
    },
    {
        description:
        "und systemischen Dynamiken.",
    },
];

{/*Arbeitet ihr auch mit körperlichen Symptomen oder Schmerzen ?*/}
const number_three = [
    {
        description:
        "dir vor der Sitzung möglichst etwas Ruhe zu nehmen,",
    },
    {
        description:
        "nicht direkt aus Stress oder Verpflichtungen in den Termin zu springen,",
    },
    {
        description:
        "und dir nach der Sitzung möglichst ebenfalls Zeit für dich einzuplanen.",
    },
];

{/*Arbeitet ihr auch mit körperlichen Symptomen oder Schmerzen ?*/}
const number_four = [
    {
        description:
        "Alkohol,",
    },
    {
        description:
        "bewusstseinsverändernde Substanzen,",
    },
    {
        description:
        "oder andere Dinge, die deine Wahrnehmung und emotionale Präsenz stark beeinflussen könnten.",
    },
];

const number_five = [
    {
        description:
        "in Berlin,",
    },
    {
        description:
        "in Österreich nahe Graz",
    },
    {
        description:
        "und perspektivisch auch in der Türkei.",
    },
];

const number_six = [
    {
        description:
        "emotionaler Prozessarbeit,",
    },
    {
        description:
        "Teilearbeit,",
    },
    {
        description:
        "Nervensystemarbeit,",
    },
    {
        description:
        "systemischer Arbeit,",
    },
    {
        description:
        "Hypnose,",
    },
    {
        description:
        "schamanischer Prozessarbeit,",
    },
    {
        description:
        "Körper- und Energiearbeit",
    },
    {
        description:
        "sowie Bewusstseins- und Beziehungsthemen.",
    },
];

const number_seven = [
    {
        description:
        "systemische Aufstellungsarbeit,",
    },
    {
        description:
        "schamanische Prozessarbeit,",
    },
    {
        description:
        "oder Seelenanteilsarbeit.",
    },
];

export const FAQ = () => {

    const [activeIdx, setActiveIdx] = useState(0);

    return ( 
        <section id="about" className="pt-20 relative overflow-hidden">
            <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"/>
            <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-highlight/5 rounded-full blur-3xl"/>
            <div className="container relative z-10 min-w-screen">
                <div className="container mx-auto pb-20 animate-fade-in">
                    <div className="space-y-8 pt-6">
                        <h1 className="text-4xl text-center md:text-5xl font-bold leading-tight text-primary glow-text">
                        Häufige Fragen 
                        <span className="font-serif italic font-normal text-white"> (FAQ)</span>
                        </h1>
                        <h2 className="text-2xl md:text-3xl text-center leading-tight  font-bold text-primary">Wie
                            <span className="font-serif italic font-normal text-primary "> läuft eine Sitzung bei euch ab ? </span>
                        </h2>
                        <p className="text-center text-lg">
                            Nach deiner Terminbuchung erhältst du zunächst:
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
                        <p className="text-center text-lg">
                            Der Fragebogen hilft uns, uns bereits etwas auf dich, deine Themen und deinen aktuellen Prozess einzustimmen.<br/> 
                            Du musst dabei nichts „perfekt formulieren“. 
                            Oft reichen ehrliche Gedanken oder Stichpunkte vollkommen aus.<br/><br/>
                            Die Sitzungen finden online über Zoom statt und dauern – je nach gebuchtem Format – zwischen ca. 
                            60 Minuten und mehreren Stunden bei Intensivprozessen. 
                        </p>
                        <h2 className="text-2xl md:text-3xl text-center leading-tight  font-bold text-primary">Arbeitet ihr
                            <span className="font-serif italic font-normal text-primary "> auch mit körperlichen Symptomen oder Schmerzen ?</span>
                        </h2>
                        <p className="text-center text-lg">
                            Ja - viele Menschen kommen auch mit körperlichen Beschwerden oder Symptomen zu uns.<br/><br/> 
                            Wir betrachten körperliche Symptome nicht isoliert,
                            sondern im Zusammenhang mit: 
                        </p>
                        <div className="flex items-center justify-center">
                            <div className="pl-6">
                                {number_two.map((item, idx) => (
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
                        <p className="text-center text-lg">
                            Dabei arbeiten wir nicht symptomorientiert im klassischen medizinischen Sinne,
                            sondern versuchen zu verstehen,<br/>
                            welche emotionalen, inneren oder biografischen Prozesse möglicherweise mit dem körperlichen Erleben verbunden sind. 
                        </p>
                        <p className="text-center text-lg">
                            Viele Menschen erleben ihren Körper dabei nicht mehr als „Gegner“,
                            sondern beginnen langsam zu verstehen,
                            warum ihr System überhaupt reagiert. 
                        </p>
                        <h2 className="text-2xl md:text-3xl text-center leading-tight  font-bold text-primary">Muss ich
                            <span className="font-serif italic font-normal text-primary "> mich auf die Sitzung vorbereiten ?</span>
                        </h2>
                        <p className="text-center text-lg">
                            Du musst nichts Besonderes leisten oder „richtig machen“.
                        </p>
                        <p className="text-center text-lg">
                            Trotzdem empfehlen wir:
                        </p>
                        <div className="flex items-center justify-center">
                            <div className="pl-6">
                                {number_three.map((item, idx) => (
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
                        <p className="text-center text-lg">
                            Gerade tiefere emotionale, systemische oder schamanische Prozesse wirken oft noch nach.
                        </p>
                        <p className="text-center text-lg">
                            Viele Menschen empfinden es als hilfreich, danach nicht sofort wieder in Arbeit, Termine oder soziale Verpflichtungen zu wechseln.
                        </p>
                        <h2 className="text-2xl md:text-3xl text-center leading-tight  font-bold text-primary">Sollte ich
                            <span className="font-serif italic font-normal text-primary "> vor der Sitzung Alkohol oder andere Substanzen vermeiden ?</span>
                        </h2>
                        <p className="text-center text-lg">
                            Ja.
                        </p>
                        <p className="text-center text-lg">
                            Bitte verzichte am Tag der Sitzung möglichst auf:
                        </p>
                        <div className="flex items-center justify-center">
                            <div className="pl-6">
                                {number_four.map((item, idx) => (
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
                        <p className="text-center text-lg">
                            Unsere Arbeit lebt davon, dass du möglichst klar mit dir selbst in Kontakt sein kannst.
                        </p>
                        <p className="text-center text-lg">
                            Falls du Medikamente einnimmst, gib dies bitte einfach im Fragebogen an.
                        </p>
                        <h2 className="text-2xl md:text-3xl text-center leading-tight  font-bold text-primary">Finden die Sitzungen
                            <span className="font-serif italic font-normal text-primary "> online oder vor Ort statt ?</span>
                        </h2>
                        <p className="text-center text-lg">
                            Der Großteil unserer Arbeit findet aktuell online über Zoom statt.
                        </p>
                        <p className="text-center text-lg">
                            Zusätzlich bieten wir bestimmte Intensivprozesse und Aufstellungsarbeit auch live vor Ort an:
                        </p>
                        <div className="flex items-center justify-center">
                            <div className="pl-6">
                                {number_five.map((item, idx) => (
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
                        <h2 className="text-2xl md:text-3xl text-center leading-tight  font-bold text-primary">Muss ich
                            <span className="font-serif italic font-normal text-primary "> bereits genau wissen, was mein Thema ist ?</span>
                        </h2>
                        <p className="text-center text-lg">
                            Nein.
                        </p>
                        <p className="text-center text-lg">
                            Viele Menschen spüren zunächst nur:<br/><br/>
                            dass sich etwas innerlich immer wiederholt,<br/>
                            dass sie feststecken,<br/>
                            erschöpft sind,<br/>
                            innerlich unter Spannung stehen<br/>
                            oder bestimmte Beziehungsmuster nicht verlassen können.<br/><br/>
                            Oft zeigt sich erst im gemeinsamen Prozess, worum es eigentlich tiefer geht.
                        </p>
                        <h2 className="text-2xl md:text-3xl text-center leading-tight  font-bold text-primary">Arbeitet ihr
                            <span className="font-serif italic font-normal text-primary "> therapeutisch ?</span>
                        </h2>
                        <p className="text-center text-lg">
                            Unsere Arbeit ersetzt keine medizinische oder psychiatrische Behandlung.<br/><br/>
                            Wir arbeiten begleitend und prozessorientiert mit emotionalen, systemischen, 
                            nervensystemischen, bindungsorientierten und bewusstseinsbezogenen Dynamiken.<br/><br/>
                            Dabei verbinden wir unterschiedliche Ansätze aus:
                        </p>
                        <div className="flex items-center justify-center">
                            <div className="pl-6">
                                {number_six.map((item, idx) => (
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
                        <h2 className="text-2xl md:text-3xl text-center leading-tight  font-bold text-primary">Was bedeutet
                            <span className="font-serif italic font-normal text-primary "> „trauma-sensibel“ bei euch ?</span>
                        </h2>
                        <p className="text-center text-lg">
                            Trauma-sensibel bedeutet für uns:<br/>
                            nicht gegen Schutzmechanismen zu arbeiten, sondern sie zuerst zu verstehen. <br/><br/>
                            Viele Muster entstehen nicht aus „Schwäche“, sondern aus inneren Überlebensstrategien.<br/><br/>
                            Deshalb arbeiten wir nicht mit Druck, Überforderung oder künstlicher Positivität - sondern orientieren uns daran, <br/>
                            was dein Nervensystem im jeweiligen Moment wirklich tragen kann.
                        </p>
                        <h2 className="text-2xl md:text-3xl text-center leading-tight  font-bold text-primary">Wie tief
                            <span className="font-serif italic font-normal text-primary "> geht eure Arbeit ?</span>
                        </h2>
                        <p className="text-center text-lg">
                            Das ist sehr individuell.<br/><br/>
                            Manche Sitzungen sind eher stabilisierend und ordnend.
                            Andere können emotional sehr tief gehen. <br/><br/>
                            Wir arbeiten nicht nach starren Abläufen, sondern orientieren uns an dem, was sich im jeweiligen Prozess tatsächlich zeigt.<br/><br/>
                            Dabei achten wir immer darauf, dass emotionale Prozesse nicht unnötig überfordernd werden.<br/>
                        </p>
                        <h2 className="text-2xl md:text-3xl text-center leading-tight  font-bold text-primary">Was ist
                            <span className="font-serif italic font-normal text-primary "> der Unterschied zwischen einer normalen Sitzung und einem Intensivprozess ?</span>
                        </h2>
                        <p className="text-center text-lg">
                            Normale Sitzungen dauern in der Regel etwa 60 Minuten.<br/><br/>
                            Intensivprozesse bieten deutlich mehr Raum und Zeit für tiefere Arbeit - zum Beispiel:
                        </p>
                        <div className="flex items-center justify-center">
                            <div className="pl-6">
                                {number_seven.map((item, idx) => (
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
                        <p className="text-center text-lg">
                            Diese Prozesse dauern meist mehrere Stunden und ermöglichen ein tieferes Eintauchen in emotionale, systemische oder innere Dynamiken.
                        </p>
                        <h2 className="text-2xl md:text-3xl text-center leading-tight  font-bold text-primary">Muss ich
                            <span className="font-serif italic font-normal text-primary "> spirituell sein, um mit euch zu arbeiten ?</span>
                        </h2>
                        <p className="text-center text-lg">
                            Nein.
                        </p>
                        <p className="text-center text-lg">
                            Viele Menschen kommen eher über die psychologische oder emotionale Ebene zu uns. Andere über Körperarbeit, Nervensystemthemen oder spirituelle Erfahrungen.
                        </p>
                        <p className="text-center text-lg">
                            Unsere Arbeit verbindet geerdete psychologische Prozessarbeit mit intuitiven und teilweise spirituellen Perspektiven - ohne dass du an etwas Bestimmtes glauben musst.
                        </p>
                        <h2 className="text-2xl md:text-3xl text-center leading-tight  font-bold text-primary">Arbeitet ihr
                            <span className="font-serif italic font-normal text-primary "> einzeln oder gemeinsam ?</span>
                        </h2>
                        <p className="text-center text-lg">
                            Beides.<br/><br/>
                            Manche Sitzungen finden mit nur einer von uns statt. Andere gemeinsam als Team. <br/><br/>
                            Gerade in gemeinsamen Sitzungen entstehen oft mehrere Wahrnehmungsebenen gleichzeitig -<br/><br/>
                            emotional,<br/>
                            psychologisch,<br/>
                            systemisch,<br/>
                            körperlich und intuitiv.<br/><br/>
                            Viele Menschen erleben genau das als besonders tief und hilfreich.
                        </p>
                        <h2 className="text-2xl md:text-3xl text-center leading-tight  font-bold text-primary">Was passiert,
                            <span className="font-serif italic font-normal text-primary "> wenn ich während einer Sitzung emotional werde ?</span>
                        </h2>
                        <p className="text-center text-lg">
                            Dann darf genau das da sein.<br/><br/>
                            Du musst dich bei uns nicht „zusammenreißen“ oder funktionieren. <br/><br/>
                            Emotionale Reaktionen werden nicht bewertet, sondern als Teil innerer Prozesse verstanden.<br/><br/>
                            Wir arbeiten dabei nicht gegen Gefühle -
                            sondern versuchen gemeinsam zu verstehen, was dahinter wirkt.
                        </p>
                    </div>
                    <div className=" flex items-center justify-center my-16">
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
            </div>
        </section>
    );
}