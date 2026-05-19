import { ArrowBigRight, ArrowRight, Check, Calendar1 } from "lucide-react"
import { Button } from "@/components/Button"

{/*was,wenn deine Symptome Schutz sind*/}
const number_one = [
    {
        description:
        "Du funktionierst – aber fühlst dich innerlich leer",
    },
    {
        description:
        "Du wünschst dir Nähe – und ziehst dich gleichzeitig zurück",
    },
    {
        description:
        "Du möchtest entspannen – aber dein Körper bleibt angespannt",
    },
];

{/*Was bedeutet traumasensible Begleitunf*/}
const number_two = [
    {
        description:
        "dich innerlich angespannt oder dauerhaft „unter Strom“ fühlst",
    },
    {
        description:
        "erschöpft bist, obwohl du funktionierst",
    },
    {
        description:
        "dich emotional abgeschnitten oder überfordert erlebst",
    },
    {
        description:
        "Schwierigkeiten in Beziehungen hast",
    },
    {
        description:
        "stark selbstkritisch bist oder dich schämst",
    },
    {
        description:
        "dich oft unsicher, orientierungslos oder „nicht richtig“ fühlst",
    },
];

{/*Was ist ein Trauma wirklich*/}
const number_three = [
    {
        description:
        "emotionale Vernachlässigung",
    },
    {
        description:
        "ehlende Sicherheit oder Geborgenheit",
    },
    {
        description:
        "Kritik, Abwertung oder Überforderung",
    },
    {
        description:
        "instabile oder unsichere Beziehungen",
    },
];

{/*Typische Folgen zeigen sich oft so:*/}
const number_four = [
    {
        description:
        "Du stellst deine eigenen Bedürfnisse zurück",
    },
    {
        description:
        "Du versuchst, es allen recht zu machen",
    },
    {
        description:
        "Du vermeidest Gefühle oder lenkst dich ab",
    },
    {
        description:
        "Du ziehst dich zurück oder wirst schnell überwältigt",
    },
     {
        description:
        "Du fühlst dich leer, angespannt oder innerlich abgeschnitten",
    },
];

{/*Was du bei uns lernst*/}
const number_five = [
    {
        description:
        "dein Nervensystem zu verstehen und zu regulieren",
    },
    {
        description:
        "mit emotionalen Auslösern sicher umzugehen",
    },
    {
        description:
        "Selbstkritik zu reduzieren und dich selbst anzunehmen",
    },
    {
        description:
        "deine Bedürfnisse wahrzunehmen und zu vertreten",
    },
     {
        description:
        "wieder in Verbindung mit dir selbst zu kommen",
    },
];

{/*Unsere Arbeit mit dir*/}
const number_six = [
    {
        description:
        "Gespräch & Reflexion",
    },
    {
        description:
        "körperliche und emotionale Wahrnehmung",
    },
    {
        description:
        "traumasensible Prozessarbeit",
    },
    {
        description:
        "Integration innerer Anteile",
    },
];

export const Coaching = () => {
    return <section id="coaching" className="realtive flex">
        <div className="container z-10 pt-24 pb-0 min-w-screen relative">
            <div className="container mx-auto pt-6 pb-20">
                <h1 className="text-4xl text-center md:text-5xl font-bold leading-tight animate-fade-in animation-delay-100 text-primary glow-text">
                Traumasensible Prozess-Begleitung
                </h1>
                <br/>
                <h2 className="text-2xl text-center font-bold leading-tight">Kennst du die Stimme in dir, die dir sagt:</h2>
                <br/>
                <div className="px-6 pb-8">
                    <div className="flex items-center justify-center">
                        <div className="">
                            <p className=" text-lg">„Irgendetwas stimmt mit mir nicht.“</p>
                            <p className=" text-lg">„Ich reagiere zu stark.“</p>
                            <p className=" text-lgs">„Warum kann ich mich nicht einfach entspannen?“</p>
                        </div>
                    </div>
                    <br/>
                    <p className=" text-center text-lg">Wenn du dich darin wiedererkennst: Du bist nicht allein. Und vor allem – 
                    <span className="font-bold">du bist nicht falsch.</span>
                    </p>
                    <br/>
                    <p className="text-center text-lg">Oft ist es nicht „du“, sondern dein Nervensystem, das zu lange im Überlebensmodus war.</p>
                    <br/>
                    <p className="text-center text-lg">Wir begleiten dich einfühlsam zurück zu dir selbst. In deinem Tempo. Ohne Druck. In echter Verbindung.</p>
                </div>
                <div className="glass rounded-2xl p-6 glow-border animate-fade-in animation-delay-300">
                    <h3 className="text-2xl md:text-3xl text-center leading-tight  font-bold text-primary">Was,
                        <span className="font-serif italic font-normal text-white"> wenn deine Symptome Schutz sind?</span>
                        <br/>
                    </h3>
                    <br/>
                    <p className="text-lg font-medium italic text-center">
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
                                    <span className="text-white text-lg inline-flex items-center justify-center gap-4">
                                        <ArrowRight className="w-3 h-3 text-primary items-center bg-primary rounded-full"/>
                                        {item.description}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <br/>
                    <p className="text-lg font-medium italic text-center">Diese Muster entstehen nicht zufällig.<br/> Sie sind Schutzreaktionen auf Erfahrungen, die dich überfordert oder verletzt haben.
                    </p>
                    <br/>
                    <p className="text-lg font-medium italic text-center">Dein System hat dich geschützt.<br/>Doch heute hält dich genau das oft fest.
                    </p>
                </div>                
            </div>    
                <div className="bg-secondary rounded-t-4xl shadow-[0px_-1px_5px_10px_rgba(0,0,0,0.3)] pt-6 pb-20 animate-fade-in">
                    <div className="container mx-auto space-y-6 py-16">
                        <div className="grid lg:grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-2xl md:text-3xl text-center leading-tight  font-bold text-primary">Was bedeutet
                                    <span className="font-serif italic font-normal text-white"> traumasensible Prozessbegleitung?</span>
                                    <br/>
                                </h3>
                                <br/>
                                <p className="text-lg">Unsere Arbeit ist 
                                    <span className="font-bold"> ursachenauflösend ausgerichtet.</span>
                                </p>
                                <p className=" text-lg">Wir arbeiten nicht nur mit den sichtbaren Symptomen, sondern mit den tieferen emotionalen und biografischen Prägungen, aus denen sie entstanden sind.</p>
                                <p className=" text-lg">Dabei geht es nicht um Leistung – sondern um <br/>
                                    <span className="font-bold"> Selbstregulation, Sicherheit und echte Veränderung von innen heraus.</span>
                                </p>
                                <br/>
                                <h3 className="text-lg font-bold leading-tight">Dabei unterstützen wir dich, wenn du…<br/></h3>
                                <br/>
                                <div className="flex">
                                        <div className="pl-6">
                                            {number_two.map((item, idx) => (
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
                                    <span className="text-4xl text-black">BILD?</span>
                            </div> 
                        </div>
                        <div className="grid lg:grid-cols-2">
                            <div className="flex glass rounded-2xl items-center justify-center">
                                        <span className="text-4xl text-black">BILD?</span>
                            </div>
                             <div>
                                <h3 className="text-2xl md:text-3xl text-center leading-tight  font-bold text-primary">Was ist
                                    <span className="font-serif italic font-normal text-white"> ein Trauma wirklich?</span>
                                    <br/>
                                </h3>    
                                <div className="px-6">
                                    <br/>
                                    <p className="text-lg">Ein Trauma entsteht, wenn dein Nervensystem etwas erlebt,<br/>
                                    das zu viel, zu schnell oder zu überwältigend war.</p>
                                    <br/>
                                    <p className="text-lg">Das kann ein einzelnes Ereignis sein –<br/>
                                    oder viele kleine Erfahrungen über längere Zeit.</p>
                                    <br/>
                                    <p className="text-lg">
                                    Besonders prägend sind oft:</p>
                                    <br/>
                                    <div className="grid grid-cols-2">
                                        <div className="pl-6">
                                            {number_three.map((item, idx) => (
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
                                    <br/>
                                    <p className="text-lg">Damals war es notwendig, dich anzupassen oder Gefühle zu unterdrücken.<br/>
                                    Heute verhindern genau diese Schutzmechanismen, dass du dich wirklich frei fühlst.</p>
                                </div>
                            </div>
                        </div>
                        <div className="glass rounded-2xl p-6 glow-border animate-fade-in animation-delay-300">
                            <h3 className="text-2xl md:text-3xl text-center leading-tight  font-bold text-primary">Typische Folgen
                                    <span className="font-serif italic font-normal text-white"> zeigen sich oft so:</span>
                                    <br/>
                            </h3>
                            <br/>
                            <div className="flex items-center justify-center">
                                <div className="pl-6">
                                    {number_four.map((item, idx) => (
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
                            <p className="text-lg font-medium italic text-center">Das sind keine Schwächen. <br/> Das sind intelligente Schutzstrategien.
                            </p>

                        </div>   
                    </div>
                </div>
                <div className=" bg-secondary rounded-t-4xl pb-8 -mt-8 shadow-[0px_-1px_5px_10px_rgba(0,0,0,0.3)] animate-fade-in animation-delay-400">
                    <div className="container mx-auto space-y-6 py-16">
                        <div className="grid lg:grid-cols-2">
                            <div>
                                <h3 className="text-2xl md:text-3xl text-center leading-tight  font-bold text-primary">Was du
                                    <span className="font-serif italic font-normal text-white"> bei uns lernst</span>
                                    <br/>
                                </h3>
                                <br/>
                                <div className="px-6">
                                    <p className=" text-lg text-center font-bold">In unserer Begleitung lernst du:<br/>
                                    </p>
                                    <br/>
                                    <div className="flex items-center justify-center">
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
                                    </div>
                                    <br/>
                                </div>
                            </div>
                            <div className="flex glass rounded-2xl items-center justify-center">
                                    <span className="text-4xl text-black">BILD?</span>
                            </div>
                        </div>
                        <div className="grid lg:grid-cols-2 mb-12">
                            <div className="flex glass rounded-2xl items-center justify-center">
                                    <span className="text-4xl text-black">BILD?</span>
                            </div>
                            <div>
                                <h3 className="text-2xl md:text-3xl text-center leading-tight  font-bold text-primary">Unsere Arbeit
                                    <span className="font-serif italic font-normal text-white"> mit dir</span>
                                    <br/>
                                </h3>
                                <p className="text-lg text-center font-bold mt-6">Wir arbeiten mit dir auf mehreren Ebenen:</p>
                                <br/>
                                <div className="flex items-center justify-center">
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
                                    <p className="text-center text-lg mt-6">Schritt für Schritt kann sich lösen,<br/>
                                    was dich bisher innerlich festgehalten hat.</p>
                                    <p className="text-center text-lg mt-6">Du beginnst, dich wieder zu spüren.<br/>
                                    Dir selbst zu vertrauen.<br/>
                                    Und dein Leben bewusster zu gestalten.</p>
                            </div>
                        </div>
                        <div className="flex glass rounded-2xl items-center justify-center glow-border">
                            <div className="rounded-2xl py-6 px-12 ">
                                <h3 className="text-2xl md:text-3xl text-center leading-tight  font-bold text-primary">Du bist
                                    <span className="font-serif italic font-normal text-white"> nicht dein Trauma</span>
                                    <br/>
                                </h3>
                                <br/>
                                <p className="text-lg text-center">
                                    Du bist nicht dein Schmerz.<br/>Und auch nicht deine Schutzstrategie.
                                </p>
                                <br/>
                                <p className="text-lg text-center">
                                    Der Weg zurück zu dir ist möglich.<br/>Und du musst ihn nicht alleine gehen.
                                </p>
                                <br/>
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
}