import { ArrowRight, Calendar1, Heart } from "lucide-react"
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
        "Dein System schützt dich – auch wenn es sich schwer anfühlt",
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
        "Vom Alarm in mehr innere Sicherheit",
        description3:
        "Wir arbeiten daran, dass dein Nervensystem nicht mehr jede Situation wie eine Gefahr behandeln muss.",
    },
    {
        image:
        "/traumasensibel/Traumasensibel3.jpeg",
        icon:
        "/traumasensibel/Blumegelb.png",
        description2:
        "Zusammenhänge statt Einzelbaustellen",
        description3:
        "Körper, Gefühle, innere Anteile und Beziehungserfahrungen werden als ein zusammenhängender Prozess betrachtet.",
    },
    {
        image:
        "/traumasensibel/Traumasensibel4.jpeg",
        icon:
        "/traumasensibel/Blumegelb.png",
        description2:
        "Ein Tempo, das dein System mittragen kann",
        description3:
        "Veränderung braucht weder Druck noch eine perfekte Leistung, sondern einen verlässlichen und klaren Rahmen.",
    },
];

{/*Was bedeutet traumasensible Begleitunf*/}
const supportThemes = [
    {
        number: "01",
        title: "Alarm und Erschöpfung",
        text: "Du bist dauerhaft unter Strom oder erschöpft, obwohl du nach außen weiter funktionierst.",
    },
    {
        number: "02",
        title: "Nähe und Schutz",
        text: "Beziehungen kosten viel Kraft; du ziehst dich zurück oder erlebst Gefühle sehr intensiv.",
    },
    {
        number: "03",
        title: "Selbstbild und Orientierung",
        text: "Selbstkritik, Scham oder das Gefühl, nicht richtig zu sein, bestimmen deinen inneren Ton.",
    },
];

const changePhases = [
    {
        number: "01",
        title: "Dein System lesen lernen",
        text: "Du erkennst, was dich aktiviert und wie dein Nervensystem wieder in einen tragfähigeren Zustand findet.",
    },
    {
        number: "02",
        title: "Dir selbst anders begegnen",
        text: "Selbstkritik verliert an Macht. Bedürfnisse und Grenzen werden klarer und dürfen ausgesprochen werden.",
    },
    {
        number: "03",
        title: "Neue Entscheidungen verkörpern",
        text: "Veränderung bleibt nicht nur ein Gedanke: Sie zeigt sich in Beziehungen, im Alltag und im Kontakt mit dir selbst.",
    },
];

export const Coaching = () => {
    return <section id="coaching" className="relative flex">
        <div className="container min-w-screen z-10 pb-0 relative">
            <div className="container mx-auto px-4 sm:px-6">
                    <div className="grid gap-10 pb-16 pt-28 md:grid-cols-[1fr_0.9fr] md:items-center md:pt-32 lg:gap-16">
                        <div className="animate-fade-in">
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Traumasensible Prozessbegleitung</p>
                            <h1 className="mt-4 text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
                                Verstehen, was dein Nervensystem schützen will.
                            </h1>
                            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85">
                                Manche Reaktionen fühlen sich zu stark an, andere wie völlige Leere. Beides kann eine nachvollziehbare Antwort auf Erfahrungen sein, die dein System einmal überfordert haben.
                            </p>
                            <div className="mt-7 rounded-2xl border-l-4 border-primary bg-white/[0.07] px-5 py-4">
                                <p className="font-semibold text-white">Vielleicht kennst du Gedanken wie:</p>
                                <p className="mt-2 leading-7 text-white/80">„Irgendetwas stimmt mit mir nicht.“ · „Ich reagiere zu stark.“ · „Warum kann ich mich nicht einfach entspannen?“</p>
                            </div>
                            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/85">
                                Wir helfen dir, diese Schutzreaktionen einzuordnen und wieder mehr Sicherheit, Selbstkontakt und Handlungsspielraum zu entwickeln – in deinem Tempo und ohne Druck.
                            </p>
                        </div>
                        <div className="min-h-72 overflow-hidden md:min-h-full">
                            <img src="/traumasensibel/Traumasensibel1.jpeg" className="h-full w-full object-cover object-center sm:mask-b-from-80% sm:mask-radial-from-50% sm:mask-l-from-80% sm:mask-r-from-80%"/>
                        </div>
                    </div>
                    <div className="space-y-6 pt-4 pb-8 animate-fade-in animation-delay-200">
                        <div className="glass-strong glow-border rounded-2xl px-4 py-6 sm:px-8 lg:px-16">
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
                                                <img src={item.image} className="h-32 w-48 rounded-2xl object-cover object-center"/>
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
                                                <img src={item.image} className="aspect-[4/3] w-full rounded-2xl object-cover object-center"/>
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
                <div className="bg-secondary pb-20 pt-6 animate-fade-in">
                    <div className="container mx-auto space-y-6 py-16">
                        <div className="grid lg:grid-cols-2 gap-4">
                            <div className="max-md:text-center">
                                <h3 className="text-xl md:text-xl leading-tight font-bold text-primary">Was bedeutet
                                    <span className="font-serif italic font-normal text-white"> traumasensible Prozessbegleitung?</span>
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
                                <h3 className="mt-7 text-xl font-bold leading-tight">Woran wir mit dir arbeiten</h3>
                                <ol className="mt-5 border-t border-white/20">
                                    {supportThemes.map((item) => (
                                        <li key={item.number} className="grid grid-cols-[2.5rem_1fr] gap-3 border-b border-white/15 py-4">
                                            <span className="pt-1 text-sm font-bold tracking-[0.16em] text-primary">{item.number}</span>
                                            <div>
                                                <p className="font-bold">{item.title}</p>
                                                <p className="mt-1 leading-7 text-white/80">{item.text}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                            <div className="min-h-72 overflow-hidden rounded-2xl">
                                    <img src="/traumasensibel/grubel.jpeg" className="h-full w-full rounded-2xl object-cover object-center"/>
                            </div> 
                        </div>
                        <div className="grid lg:grid-cols-2 gap-4">
                            <div className="min-h-72 overflow-hidden rounded-2xl">
                                    <img src="/traumasensibel/stein.jpeg" className="h-full w-full rounded-2xl object-cover object-center"/>
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
                                    <p className="mt-5 border-l-2 border-primary pl-4 text-lg leading-8">
                                        Prägend kann sein, wenn Sicherheit und Geborgenheit fehlen, Beziehungen unberechenbar sind oder Kritik, Abwertung und Überforderung zum Alltag gehören.
                                    </p>
                                    <p className="mt-5 leading-7">Nicht immer ist es der eine große Moment. Manchmal ist es die lange Wiederholung dessen, was ein Mensch zu früh und zu lange allein tragen musste.</p>
                                    <p className="mt-4 leading-7">Anpassung und das Zurückhalten von Gefühlen waren damals sinnvoll. Heute können dieselben Schutzbewegungen Nähe, Freiheit und eine klare Wahrnehmung der eigenen Bedürfnisse erschweren.</p>
                            </div>
                        </div>
                        <div className="glass rounded-2xl glow-border overflow-hidden">
                            <div className="grid md:grid-cols-2">
                                <div className="pt-16 px-4 py-4">
                                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Im Alltag</p>
                                    <h3 className="mt-3 text-2xl font-bold leading-tight md:text-3xl">Schutz ist oft leiser, als man denkt</h3>
                                    <p className="mt-5 text-lg leading-8 text-white/85">
                                        Vielleicht stellst du eigene Bedürfnisse zurück und versuchst, es allen recht zu machen. Gefühle werden weggeschoben, bis Rückzug, Überforderung oder eine schwer erklärbare innere Leere entstehen.
                                    </p>
                                    <blockquote className="mt-7 border-l-2 border-primary pl-5 text-xl font-semibold leading-8">
                                        Du reagierst nicht falsch. Dein System reagiert folgerichtig auf das, was es gelernt hat.
                                    </blockquote>
                                </div>
                                <div className="min-h-72 overflow-hidden rounded-2xl">
                                    <img src="/traumasensibel/steg.jpg" className="h-full w-full object-cover object-center md:mask-l-from-60%"/>
                                </div> 
                            </div>
                        </div>   
                    </div>
                </div>
                <div className="bg-secondary pb-8 animate-fade-in animation-delay-400">
                    <div className="container mx-auto space-y-6 py-16">
                        <div className="grid lg:grid-cols-2">
                            <div className="pb-6 pt-4">
                                <div className="px-4 sm:px-6">
                                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Veränderung im Alltag</p>
                                    <h3 className="mt-3 text-2xl font-bold leading-tight md:text-3xl">Woran du merkst, dass sich wirklich etwas bewegt</h3>
                                    <ol className="mt-6 space-y-5">
                                        {changePhases.map((item) => (
                                            <li key={item.number} className="grid grid-cols-[2.5rem_1fr] gap-3">
                                                <span className="pt-1 text-sm font-bold tracking-[0.16em] text-primary">{item.number}</span>
                                                <div>
                                                    <p className="font-bold">{item.title}</p>
                                                    <p className="mt-1 leading-7 text-white/80">{item.text}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            </div>
                            <div className="min-h-72 overflow-hidden rounded-2xl">
                                    <img src="/traumasensibel/gucken.jpeg" className="h-full w-full object-cover object-center"/>
                            </div>
                        </div>
                        <div className="grid lg:grid-cols-2 mb-12 gap-6">
                            <div className="min-h-72 overflow-hidden rounded-2xl">
                                    <img src="/traumasensibel/wald.jpeg" className="h-full w-full object-cover object-center"/>
                            </div>
                            <div>
                                <div className="grid lg:grid-cols-2 gap-2 h-full">
                                    <div className="flex items-center justify-center">
                                        <div>
                                            <h3 className="text-xl md:text-xl leading-tight max-lg:text-center font-bold text-primary">Unsere Arbeit
                                                <span className="font-serif italic font-normal text-white"> mit dir</span>
                                            </h3>
                                            <p className="mt-6 leading-7 max-lg:text-center">Wir verbinden Gespräch und Reflexion mit körperlicher und emotionaler Wahrnehmung, traumasensibler Prozessarbeit und systemischer Anteilearbeit.</p>
                                            <p className="mt-4 leading-7 max-lg:text-center">Nicht als Methodenkatalog, sondern als abgestimmten Prozess: Wir setzen dort an, wo sich dein Thema gerade tatsächlich zeigt.</p>
                                            <p className="mt-4 font-semibold leading-7 max-lg:text-center">So kann aus Verstehen allmählich ein anderes Erleben – und daraus eine neue Handlungsmöglichkeit – werden.</p>
                                        </div>
                                    </div>
                                    <div className="min-h-72 overflow-hidden rounded-2xl">
                                        <img src="/traumasensibel/pflanze.jpeg" className="h-full w-full object-cover object-center"/>
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
                                <div className="min-h-72 overflow-hidden rounded-2xl">
                                    <img src="/traumasensibel/strand.jpeg" className="h-full w-full object-cover object-center lg:mask-l-from-60%"/>
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
}
