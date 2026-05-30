import { ArrowBigRight, ArrowRight, Check, Calendar1, Heart } from "lucide-react"
import { Button } from "@/components/Button"
import { Link } from "react-router-dom"

{/*was,wenn deine Symptome Schutz sind*/}
const number_one = [
    {
        image:
        "/traumasensibel/kreisel.png",
        description:
        "Du funktionierst –",
        description2:
        "aber fühlst dich innerlich leer",
        description3:
        "Dein System schützt dich - auch wenn es sich schwer anfühlt",
    },
    {
        image:
        "/traumasensibel/Handherz.png",
        description:
        "Du wünschst dir Nähe –",
        description2:
        "und ziehst dich gleichzeitig zurück",
        description3:
        "Dein Nervensystem prüft, ob es sicher ist, sich zu öffnen.",
    },
    {
        image:
        "/traumasensibel/traurig.png",
        description:
        "Du möchtest entspannen –",
        description2:
        "aber dein Körper bleibt angespannt",
        description3:
        "Dein Körper versucht, dich vor Überforderung zu schützen.",
    },
];

const number_seven = [
    {
        image:
        "/traumasensibel/Traumasensibel2.jpeg",
        icon:
        "/traumasensibel/Blatt.png",
        description2:
        "Raus aus dem Überlebensmodus",
        description3:
        "Wir helfen deinem Nervensystem, wieder in Sicherheit zu kommen",
    },
    {
        image:
        "/traumasensibel/Traumasensibel3.jpeg",
        icon:
        "/traumasensibel/Blumegelb.png",
        description2:
        "Heilung auf allen Ebenen",
        description3:
        "Integration von Körper, Emotionen, Verstand und inneren Anteilen.",
    },
    {
        image:
        "/traumasensibel/Traumasensibel4.jpeg",
        icon:
        "/traumasensibel/Blumegelb.png",
        description2:
        "Dein Weg. Dein Tempo",
        description3:
        "Wir begleiten dich wertfrei, achtsam und in echter Verbidung",
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
        "fehlende Sicherheit oder Geborgenheit",
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
        <div className="container min-w-screen z-10 pb-0 relative">
            <div className="container mx-auto">
                    <div className="grid md:grid-cols-2">
                        <div className="ml-auto">
                            <div className="container md:pr-44 pt-24 animate-fade-in">
                                <div className="pb-8">
                                    <h1 className="text-3xl md:text-3xl font-bold leading-tight max-sm:text-center text-primary glow-text">
                                    Traumasensible <br/> <span className="text-white"> Prozessbegleitung</span>
                                    </h1>
                                </div>
                                <div className="pr-8">
                                    <div className="grid gap-16 grid-cols-2 px-2">
                                        <div className="h-0.5 bg-linear-to-l from-primary via-primary/60 to-transparent"/>
                                        <div className="h-0.5 bg-linear-to-r from-primary via-primary/60 to-transparent"/>
                                    </div>
                                    <div className="flex -mt-15 -mb-8 items-center justify-center">
                                        <img src="/traumasensibel/Blume.png" className="w-36 h-32 rounded-full"/>
                                    </div>
                                </div>
                                <div className="max-md:text-center">
                                    <h2 className="text-lg font-bold leading-tight">Kennst du die Stimme in dir, die dir sagt:</h2>
                                    <p className=" text-lg">„Irgendetwas stimmt mit mir nicht.“</p>
                                    <p className=" text-lg">„Ich reagiere zu stark.“</p>
                                    <p className=" text-lgs">„Warum kann ich mich nicht einfach entspannen?“</p>
                                    <p className="text-lg">Wenn du dich darin wiedererkennst: <br/><br/> Du bist nicht allein. Und vor allem – 
                                    <span className="font-bold">du bist nicht falsch.</span>
                                    </p>
                                    <p className="text-lg">Oft ist es nicht „du“, sondern dein Nervensystem, das zu lange im Überlebensmodus war.</p>
                                    <br/>
                                    <p className="text-lg">Wir begleiten dich einfühlsam zurück zu dir selbst. In deinem Tempo. Ohne Druck. In echter Verbindung.</p>             
                                </div>
                            </div>
                        </div>
                        <div className="flex -ml-56 -mb-16">
                            <img src="/traumasensibel/Traumasensibel1.jpeg" className="object-cover sm:mask-b-from-80% mask-radial-[80%_60%] sm:mask-radial-from-50% sm:mask-l-from-80% sm:mask-r-from-80%"/>
                        </div>
                    </div>
                    <div className="space-y-6 pt-4 pb-8 animate-fade-in animation-delay-200">
                        <div className="glass-strong rounded-2xl py-6 px-16 glow-border">
                            <h3 className="text-2xl md:text-3xl text-center leading-tight  font-bold text-primary">Was,
                                <span className="font-serif italic font-normal text-muted-foreground"> wenn deine Symptome Schutz sind?</span>
                                <br/>
                            </h3>
                            <p className="text-lg font-medium italic text-center text-muted-foreground">
                            Vielleicht kennst du das:
                            </p>
                            <br/>
                            <div className="grid lg:grid-cols-3 items-center justify-center">
                                    {number_one.map((item, idx) => (
                                        <div 
                                            key={idx} 
                                            className="p-0"
                                        >
                                            <div className="flex items-center justify-center">
                                                <img src={item.image} className="w-48 h-32 rounded-ful"/>
                                            </div>
                                            <div className="pb-2">
                                                <p className="text-muted-foreground text-center font-bold">{item.description}</p>
                                                <p className="text-muted-foreground text-center">{item.description2}</p>
                                            </div>
                                            <div className="flex items-center -mb-1.25 justify-center">
                                                <ArrowRight className="w-2 h-2 text-primary/80 items-center bg-primary/80 rounded-full"/>
                                            </div>
                                            <div className="grid gap-4 grid-cols-2 px-12">
                                                <div className="h-0.5 bg-linear-to-l from-primary/70 via-primary/30 to-transparent"/>
                                                <div className="h-0.5 bg-linear-to-r from-primary/70 via-primary/30 to-transparent"/>
                                            </div>
                                            <div className="px-8 pt-4">
                                                <p className="text-black text-center">{item.description3}</p>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                            <br/>
                            <p className="text-muted-foreground text-lg font-medium italic text-center">Diese Muster entstehen nicht zufällig.<br/> Sie sind Schutzreaktionen auf Erfahrungen, die dich überfordert oder verletzt haben.
                            </p>
                            <div className="flex items-center justify-center py-2">
                                <Heart className="w-6 h-6 text-primary"/>
                            </div>
                            <p className="text-lg text-muted-foreground text-center">Dein System hat dich geschützt.<br/>Doch heute hält dich genau das oft fest.
                            </p>
                        </div>
                        <h3 className="text-2xl md:text-3xl text-center leading-tight  font-bold">Wir begleiten dich sanft
                            <span className="font-serif italic text-primary font-bold"> zurück zu dir</span>
                            <br/>
                        </h3>
                        <div className="-mt-4">
                            <div className="flex items-center -mb-1.75 justify-center">
                                <ArrowRight className="w-3 h-3 text-primary items-center bg-primary rounded-full"/>
                            </div>
                            <div className="grid gap-6 grid-cols-6 px-12">
                                <div className=" border-b-2 border-card"/>
                                <div className=" border-b-2 border-card"/>
                                <div className="h-0.5 bg-linear-to-l from-primary/80 via-primary/50 to-transparent"/>
                                <div className="h-0.5 bg-linear-to-r from-primary/80 via-primary/50 to-transparent"/>
                                <div className=" border-b-2 border-card"/>
                                <div className=" border-b-2 border-card"/>
                            </div>
                            <div className="grid lg:grid-cols-3 gap-8 items-center justify-center pt-4 pb-4">
                                    {number_seven.map((item, idx) => (
                                        <div 
                                            key={idx} 
                                            className="p-0"
                                        >
                                            <div className="flex items-center justify-center">
                                                <img src={item.image} className="rounded-2xl"/>
                                            </div>
                                            <div className="flex justify-center items-center">
                                                <div className="flex items-center justify-center -mr-6 -ml-8">
                                                    <img src={item.icon} className="w-54 h-22 rounded-full object-center object-scale-down"/>
                                                </div>
                                                <div className="-pr-12 -mt-2">
                                                    <p className="font-bold text-sm">{item.description2}</p>
                                                    <p className=" text-sm">{item.description3}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                            <div className="grid gap-12 grid-cols-6 px-12">
                                <div className=" border-b-2 border-card"/>
                                <div className=" border-b-2 border-card"/>
                                <div className="h-0.5 bg-linear-to-l from-primary/80 via-primary/50 to-transparent"/>
                                <div className="h-0.5 bg-linear-to-r from-primary/80 via-primary/50 to-transparent"/>
                                <div className=" border-b-2 border-card"/>
                                <div className=" border-b-2 border-card"/>
                            </div>
                            <div className="flex -mt-11 -mb-8 items-center justify-center">
                                <img src="/traumasensibel/Blume.png" className="w-28 h-24 rounded-full"/>
                            </div>
                            <p className="text-center">Du musst diesen Weg nicht allein gehen. <br/> Wir sind an deiner Seite</p>
                        </div>                        
                    </div>
                </div>    
                <div className="bg-secondary rounded-t-4xl shadow-[0px_-1px_5px_10px_rgba(0,0,0,0.3)] pt-6 pb-20 animate-fade-in">
                    <div className="container mx-auto space-y-6 py-16">
                        <div className="grid lg:grid-cols-2 gap-4">
                            <div className="max-md:text-center">
                                <h3 className="text-xl md:text-xl leading-tight font-bold text-primary">Was bedeutet
                                    <span className="font-serif italic font-normal text-white"> traumasensible Prozessbegleitung ?</span>
                                </h3>
                                <br/>
                                <p className="">Unsere Arbeit ist 
                                    <span className="font-bold"> ursachenauflösend ausgerichtet.</span>
                                </p>
                                <p className="">Wir arbeiten nicht nur mit den sichtbaren Symptomen, sondern mit den tieferen emotionalen und biografischen Prägungen, aus denen sie entstanden sind.</p>
                                <p className="">Dabei geht es nicht um Leistung – sondern um <br/>
                                    <span className="font-bold"> Selbstregulation, Sicherheit und echte Veränderung von innen heraus.</span>
                                </p>
                                <br/>
                                <h3 className="font-bold leading-tight">Dabei unterstützen wir dich, wenn du…<br/></h3>
                                <br/>
                                <div className="flex">
                                        <div className="pl-6">
                                            {number_two.map((item, idx) => (
                                                    <div 
                                                        key={idx} 
                                                        className="p-0"
                                                    >
                                                        <span className="inline-flex items-center justify-center gap-4">
                                                            <ArrowRight className="w-4 h-4 text-primary items-center bg-primary rounded-full"/>
                                                            {item.description}
                                                        </span>
                                                    </div>
                                                ))}
                                        </div>
                                </div>
                            </div>
                            <div className="flex items-start rounded-2xl">
                                    <img src="/traumasensibel/grubel.jpeg" className="rounded-2xl"/>
                            </div> 
                        </div>
                        <div className="grid lg:grid-cols-2 gap-4">
                            <div className="flex items-start rounded-2xl">
                                    <img src="/traumasensibel/stein.jpeg" className="rounded-2xl"/>
                            </div>
                             <div className="glass rounded-2xl px-4 pt-6">
                                <h3 className="text-xl md:text-xl leading-tight font-bold text-primary">Was ist
                                    <span className="font-serif italic font-normal text-white"> ein Trauma wirklich?</span>
                                    <br/>
                                </h3> 
                                <br/>   
                                    <p className="">Ein Trauma entsteht, wenn dein Nervensystem etwas erlebt,
                                    <br/>das zu viel, zu schnell oder zu überwältigend war.</p>
                                    <p >Das kann ein einzelnes Ereignis sein –
                                    oder viele kleine Erfahrungen über längere Zeit.</p>
                                    <p>
                                    Besonders prägend sind oft:</p> <br/>
                                        <div className="pl-4">
                                            {number_three.map((item, idx) => (
                                                <div 
                                                    key={idx} 
                                                    className="p-0"
                                                >
                                                    <span className="inline-flex items-center justify-center gap-4">
                                                        <ArrowRight className="w-3 h-3 text-primary bg-primary rounded-full"/>
                                                            {item.description}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    <br/>
                                    <p className="">Damals war es notwendig, dich anzupassen oder Gefühle zu unterdrücken.<br/>
                                    Heute verhindern genau diese Schutzmechanismen, dass du dich wirklich frei fühlst.</p>
                            </div>
                        </div>
                        <div className="glass rounded-2xl glow-border overflow-hidden">
                            <div className="grid md:grid-cols-2">
                                <div className="pt-16 px-4 py-4">
                                    <h3 className="text-xl md:text-xl leading-tight  font-bold text-primary">Typische Folgen
                                            <span className="font-serif italic font-normal text-white"> zeigen sich oft so:</span>
                                            <br/>
                                    </h3>
                                    <br/>
                                        <div>
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
                                    <br/>
                                    <p className="font-medium italic text-center lg:pt-14 md:text-xl">Das sind keine Schwächen. <br/> Das sind intelligente Schutzstrategien.
                                    </p>
                                </div>
                                <div className="flex -ml-16">
                                    <img src="/traumasensibel/steg.jpg" className="rounded-2xl md:mask-l-from-60%"/>
                                </div> 
                            </div>
                        </div>   
                    </div>
                </div>
                <div className=" bg-secondary rounded-t-4xl pb-8 -mt-8 shadow-[0px_-1px_5px_10px_rgba(0,0,0,0.3)] animate-fade-in animation-delay-400">
                    <div className="container mx-auto space-y-6 py-16">
                        <div className="grid lg:grid-cols-2">
                            <div className="pb-6 pt-4">
                                <h3 className="text-2xl md:text-2xl text-center leading-tight  font-bold text-primary">Was du
                                    <span className="font-serif italic font-normal text-white"> bei uns lernst</span>
                                    <br/>
                                </h3>
                                <br/>
                                <div className="px-6">
                                    <p className="  text-center font-bold">In unserer Begleitung lernst du:<br/>
                                    </p>
                                    <br/>
                                    <div className="flex items-center justify-center">
                                        <div className="pl-6 space-y-2">
                                            {number_five.map((item, idx) => (
                                                <div 
                                                    key={idx} 
                                                    className="p-0"
                                                >
                                                    <span className=" inline-flex items-center justify-center gap-4">
                                                        <ArrowRight className="w-3 h-3 text-primary items-center bg-primary rounded-full"/>
                                                        {item.description}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <br/>
                                </div>
                            </div>
                            <div className="flex">
                                    <img src="/traumasensibel/gucken.jpeg" className="rounded-2xl "/>
                            </div>
                        </div>
                        <div className="grid lg:grid-cols-2 mb-12 gap-6">
                            <div className="flex">
                                    <img src="/traumasensibel/wald.jpeg" className="rounded-2xl "/>
                            </div>
                            <div>
                                <div className="grid lg:grid-cols-2 gap-2 h-full">
                                    <div className="flex items-center justify-center">
                                        <div>
                                            <h3 className="text-xl md:text-xl leading-tight max-lg:text-center font-bold text-primary">Unsere Arbeit
                                                <span className="font-serif italic font-normal text-white"> mit dir</span>
                                            </h3>
                                            <p className=" text-sm font-bold mt-6 max-lg:text-center">Wir begleiten dich auf mehreren Ebenen:</p>
                                            <br/>
                                            <div className="max-lg:flex max-lg:items-center max-lg:justify-center">
                                                <div>    
                                                    {number_six.map((item, idx) => (
                                                            <div 
                                                                key={idx} 
                                                                className="p-0"
                                                            >
                                                                <span className=" text-sm max-lg:text-center inline-flex items-center justify-center gap-4">
                                                                    <ArrowRight className="w-2 h-2 text-primary items-center bg-primary rounded-full"/>
                                                                    {item.description}
                                                                </span>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                            <br/>
                                            <p className="text-sm max-lg:text-center">Schritt für Schritt kann sich lösen,<br/>
                                            was dich bisher innerlich festgehalten hat.</p>
                                            <p className="text-sm max-lg:text-center">Du beginnst, dich wieder zu spüren.<br/>
                                            Dir selbst zu vertrauen.<br/>
                                            Und dein Leben bewusster zu gestalten.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <img src="/traumasensibel/pflanze.jpeg" className="rounded-2xl object-cover object-right"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex glass rounded-2xl items-center justify-center glow-border">
                            <div className="grid lg:grid-cols-2 h-full">
                                <div className="flex items-center justify-center ">
                                    <div>
                                        <h3 className="text-2xl md:text-2xl leading-tight max-lg:text-center font-bold text-primary">Du bist
                                            <span className="font-serif italic font-normal text-white"> nicht dein Trauma</span>
                                            <br/>
                                        </h3>
                                        <br/>
                                        <p className="max-lg:text-center">
                                            Du bist nicht dein Schmerz.<br/>Und auch nicht deine Schutzstrategie.
                                        </p>
                                        <br/>
                                        <p className="max-lg:text-center">
                                            Der Weg zurück zu dir ist möglich.<br/>Und du musst ihn nicht alleine gehen.
                                        </p>
                                        <br/>
                                    </div>
                                </div>
                                <div className="flex">
                                    <img src="/traumasensibel/strand.jpeg" className="rounded-2xl lg:mask-l-from-60%"/>
                                </div>
                            </div>
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
                            <img src="/breachright.jpeg" className="flex object-cover md:mask-l-from-50%  md:mask-b-from-50%"/>
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
}