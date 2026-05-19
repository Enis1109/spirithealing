import { Calendar1, CloudLightning, Github, GlassWater, Heart, Instagram, Twitter, Users } from "lucide-react";
import { Button } from "@/components/Button"
import { Link } from "react-router-dom";
import { ArrowRight, Menu, X } from "lucide-react";

const highlitghts = [
    {
        icon: Heart,
        title: "Seelenlesung",
        description:
        "Erfahren Sie, was Ihr spiritueller Weg für Sie bereithält und gewinnen Sie Klarheit über Ihre innere Welt.",
    },
    {
        icon: CloudLightning,
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
    {
        icon: GlassWater,
        title: "Energiearbeit",
        description:
            "Lassen Sie negative Energien hinter sich und bringen Sie Ihre Lebensenergie wieder ins Fließen.",            
    },
];

const left_side = [
    {
        description:
        "Du stellst deine eigenen Bedürfnisse hinter die von anderen.",
    },
    {
        description:
            "Du bist dir deiner eigenen Bedürfnisse nicht bewusst.",
    },
    {
        description:
            "Du spürst eine innere Blockade.",            
    },
    {
        description:
            "Eine kritische Stimme in dir sagt: „Ich schaffe es nicht.“",            
    },
    {
        description:
            "Du möchtest alles perfekt machen und fürchtest dich davor zu versagen.",            
    },
    {
        description:
            "Deine persönlichen Grenzen sind verschwommen.",            
    },
    {
        description:
            "Der Sinn deines Lebens bleibt für dich unklar.",            
    },
    {
        description:
            "Du neigst dazu, selbstkritisch zu sein.",            
    },
    {
        description:
            "Deine Selbstachtung leidet unter Vernachlässigung.",            
    },
    {
        description:
            "Soziale Situationen lösen häufig Unsicherheit in dir aus.",            
    },
    {
        description:
            "Du verspürst häufig Lustlosigkeit und Erschöpfung.",            
    },
    {
        description:
            "Der Drang, dich ständig beweisen zu müssen, belastet dich.",            
    },
    {
        description:
            "Endloses Grübeln und ein Gedankenkarussell halten dich gefangen.",            
    },
];

const right_side = [
    {
        description:
        "dich in dir selbst sicher und getragen zu fühlen.",
    },
    {
        description:
            "innere Anspannung loszulassen und mehr Gelassenheit zu erleben.",
    },
    {
        description:
            "wieder mehr Energie, Lebendigkeit und Klarheit in deinem Alltag zu spüren.",            
    },
    {
        description:
            "dir selbst mit Akzeptanz und Wertschätzung zu begegnen.",            
    },
    {
        description:
            "deine eigenen Bedürfnisse besser wahrzunehmen und ihnen Raum zu geben.",            
    },
    {
        description:
            "dich unabhängig von äußeren Umständen innerlich stabil zu fühlen.",            
    },
    {
        description:
            "mit Stress bewusster umgehen zu können und deine emotionalen Grenzen zu achten.",            
    },
    {
        description:
            "Beziehungen zu erleben, die von Sicherheit, Vertrauen und gegenseitiger Wertschätzung geprägt sind.",            
    },
];

const number_four = [
    {
        description:
        "Nervensystemzustände",
    },
    {
        description:
        "Bindungsmuster",
    },
    {
        description:
        "innere Konflikte",
    },
    {
        description:
        "emotionale Schutzstrategien",
    },
    {
        description:
        "frühe Prägungen",
    },
    {
        description:
        "verdrängte Gefühle",
    },
    {
        description:
        "Selbstwert- und Schamdynamiken",
    },
];

const number_five = [
    {
        description:
        "trauma-sensitive Prozessarbeit",
    },
    {
        description:
        "Arbeit mit inneren Anteilen",
    },
    {
        description:
        "Bindungs- und Beziehungsthemen",
    },
    {
        description:
        "Nervensystemarbeit",
    },
    {
        description:
        "emotionale Prozessbegleitung",
    },
    {
        description:
        "körperorientierte Wahrnehmung",
    },
    {
        description:
        "systemische Dynamiken",
    },
    {
        description:
        "energetische Wahrnehmung",
    },
    {
        description:
        "Bewusstseinsarbeit",
    },
];




export const Herotest = () => {
    return <section id="hero" className="relative overflow-hidden">
        <div className="container relative z-10 min-w-screen">
            <div className=" bg-[url('/herobg.jpeg')] bg-center bg-cover">
                <div className="container mx-auto pt-6 pb-32">
                        <div className="grid lg:grid-cols-2 gap-12">
                            <div className="flex pt-20 pr-16">
                                <div className="rounded-2xl py-4 px-4 space-y-8 animate-fade-in">
                                    <div className="space-y-0">    
                                        <h1 className="text-5xl md:text-6xl lg:text-7xl text-primary font-bold leading-tight">Online 
                                            <span className="text-muted-foreground font-serif italic font-normal glow-text"> Praxis</span>
                                            <br/>
                                        </h1>
                                        <br/>
                                        <span className="py-4 text-muted-foreground lg:text-4xl md:text-3xl text-2xl">
                                            Für integrative Therapie, Coaching & Beratung
                                        </span>
                                        <br/>
                                        <br/>
                                        <p className=" text-black">
                                            Bei Menschen, die viel tragen, viel fühlen- und trotzdem das Gefühl haben, 
                                            sich selbst irgendwo verloren zu haben. Wir begleiten emotionale Prozesse, 
                                            innere Muster und Nervensystemdynamiken mit Tiefe, Klarheit und echter menschlicher Präsenz.
                                        </p>
                                    </div>
                                    <div>
                                        <Button size="lg">
                                            <div className="inline-flex justify-center items-center">
                                            Kontakt <ArrowRight className="w-5 h-5"/>
                                            </div>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
            <div className="glass rounded-t-4xl pb-8 -mt-8 shadow-[0px_-1px_5px_10px_rgba(0,0,0,0.3)] animate-fade-in animation-delay-400">
                <div className="container mx-auto">
                    <div className="space-y-8 py-8 pb-16 items-center justify-center">
                        <div className="bg-card/70 glow-border p-8 rounded-2xl flex">
                            <div className="grid md:flex">
                                <div className="flex items-center justify-center md:px-1 sm:px-60 px-42 ">
                                    <img src="/Hero/Blumehero.png" className="w-136 2xl:h-64 xl:h-52 lg:h-40 md:h-30 sm:h-24 h-24 rounded-full border-6 border-primary/80 object-cover"/>
                                </div>
                                <div className="pl-4">
                                    <p>
                                        Vielleicht kennst du das Gefühl, stark sein zu müssen – vieles zu tragen, 
                                        für andere da zu sein und dabei deine eigenen Bedürfnisse aus dem Blick zu verlieren.
                                        Vielleicht begleitet dich die Sorge, dass alles zusammenbrechen könnte, wenn du einmal innehältst. 
                                        Oder du spürst, dass deine Kraft langsam erschöpft ist und weißt nicht, 
                                        wie du etwas verändern kannst.
                                    </p> <br/>
                                    <div className="grid gap-16 grid-cols-6 px-2">
                                        <div className=""/>
                                        <div className=""/>
                                            <div className="h-0.5 bg-linear-to-l from-primary via-primary/60 to-transparent"/>
                                            <div className="h-0.5 bg-linear-to-r from-primary via-primary/60 to-transparent"/>
                                        </div>
                                    <div className="flex -mt-15 -mb-8 items-center justify-center">
                                        <img src="/traumasensibel/Blume.png" className="w-36 h-32 rounded-full"/>
                                    </div>
                                    <p>
                                        In unserer Begleitung darf alles Raum haben, was gerade da ist. 
                                        Wir schauen gemeinsam und behutsam auf das, was dich innerlich bewegt – 
                                        in deinem Tempo und mit einem traumasensiblen Blick auf deine Erfahrungen und 
                                        dein Nervensystem.
                                    </p> <br/>
                                    <p>
                                        Du beginnst zu verstehen, warum bestimmte Muster immer wieder auftauchen. 
                                        Warum du dich vielleicht zurückhältst, dich anpasst oder festhältst, 
                                        obwohl ein Teil von dir sich nach mehr Freiheit und innerer Sicherheit sehnt. 
                                        Schritt für Schritt kann sich lösen, was dich bisher eingeengt hat.
                                    </p> <br/>
                                    <p>
                                        So kann wieder Vertrauen in dich selbst entstehen. 
                                        Du spürst klarer, was dir wirklich wichtig ist und was dich stärkt.
                                    </p>
                                    <p>
                                        Du musst diesen Weg nicht allein gehen.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className=" glass rounded-t-4xl pb-8 -mt-8 shadow-[0px_-1px_5px_10px_rgba(0,0,0,0.3)] animate-fade-in animation-delay-400">
                <div className="container mx-auto space-y-6 py-16">
                    <div className="grid md:grid-cols-2 gap-12 h-full">
                         <div className="bg-card rounded-2xl overflow-hidden">
                            <div className="grid md:grid-cols-2 h-full">
                                <div className="md:pl-16 max-md:px-16 py-12 md:-mr-16">
                                    <div className="flex -mt-15 -mb-8 items-center justify-center">
                                        <img src="/traumasensibel/Blume.png" className="w-42 h-38 rounded-full"/>
                                    </div>
                                    <h2 className="text-lg md:text-lg leading-tight font-bold text-primary">Traumasensible Prozessbegleitung
                                        <span className="font-serif italic font-normal text-white"> für Menschen, die funktionieren – und innerlich trotzdem kämpfen. </span>
                                        <br/>
                                    </h2>
                                    <br/>
                                    <div className="grid gap-8 grid-cols-2 px-2">
                                        <div className="h-0.5 bg-linear-to-l from-primary via-primary/60 to-transparent"/>
                                        <div className="h-0.5 bg-linear-to-r from-primary via-primary/60 to-transparent"/>
                                    </div>
                                    <div className="flex -mt-8 -mb-8 items-center justify-center">
                                        <img src="/traumasensibel/Blume.png" className="w-18 h-16 rounded-full"/>
                                    </div>
                                    <br/>
                                    <p className="text-center text-sm">
                                    Manche Menschen wirken stabil. Und brechen innerlich trotzdem jeden Tag ein Stück zusammen.
                                    </p>
                                    <p className="text-center text-sm">
                                    Nicht sichtbar. Nicht laut. Aber konstant.
                                    </p>
                                    <p className="text-center text-sm text-primary">
                                    Vielleicht kennst du das:
                                    </p>
                                    <p className="text-center text-sm">
                                    Du denkst viel. Du reflektierst dich. <br/>
                                    Du verstehst oft sogar, warum du reagierst, wie du reagierst. <br/>
                                    Und trotzdem gerätst du immer wieder in dieselben inneren Schleifen.
                                    </p>
                                    <br/>
                                    <p className="text-center text-sm">
                                    Nähe fühlt sich gleichzeitig schön und gefährlich an. <br/>
                                    Ruhe wird plötzlich unerträglich. Ein Teil von dir sehnt sich nach Verbindung.<br/>
                                    Ein anderer zieht sich zurück.
                                    </p>
                                    <br/>
                                    <p className="text-center text-sm">
                                    Vielleicht hast du gelernt zu funktionieren. <br/>
                                    Aber nie wirklich Sicherheit in dir aufgebaut. Unsere Arbeit beginnt genau dort.
                                    </p>
                                    <br/>
                                    <p className="text-center text-sm">
                                    Nicht mit Optimierung. Nicht mit toxischer Positivität.  <br/>
                                    Nicht mit schnellen Lösungen.
                                    </p>
                                    <br/>
                                    <p className="text-center text-sm">
                                    Sondern mit dem Versuch zu verstehen, warum dein System geworden ist, <br/>
                                    wie es geworden ist.
                                    </p>
                                </div>
                                <div className="flex md:-ml-16 max-md:items-center max-md:justify-center">
                                    <img src="/Hero/heroplant3.JPG" className="object-cover max-md:rounded-3xl md:mask-radial-[100%_80%] md:mask-radial-from-80% md:mask-l-from-0%"/>
                                </div>
                            </div>
                        </div>
                        <div className="bg-card rounded-2xl overflow-hidden">
                            <div className="grid h-full md:grid-cols-2 w-full">
                                <div className="md:pl-16 py-14 md:-mr-24">
                                    <div className="flex -mt-15 -mb-8 items-center justify-center">
                                        <img src="/traumasensibel/Blume.png" className="w-42 h-38 rounded-full"/>
                                    </div>
                                    <h3 className="text-lg md:text-lg text-center leading-tight  font-bold text-primary">Was
                                        <span className="font-serif italic font-normal text-white"> viele Menschen bei uns zum ersten Mal erleben </span>
                                        <br/>
                                    </h3>
                                    <br/>
                                    <br/>
                                    <br/>
                                    <div className="grid gap-8 grid-cols-2 px-2">
                                        <div className="h-0.5 bg-linear-to-l from-primary via-primary/60 to-transparent"/>
                                        <div className="h-0.5 bg-linear-to-r from-primary via-primary/60 to-transparent"/>
                                    </div>
                                    <div className="flex -mt-8 -mb-8 items-center justify-center">
                                        <img src="/traumasensibel/Blume.png" className="w-18 h-16 rounded-full"/>
                                    </div>
                                    <br/>
                                    <p className="text-center text-sm">
                                        Dass ihre Schutzmechanismen nicht bewertet werden.
                                    </p>
                                    <p className="text-center text-sm">
                                        Nicht die Wut. Nicht der Rückzug. Nicht die Scham. Nicht die Kontrolle. Nicht die Angst. <br/>
                                        Nicht die emotionale Überforderung.
                                    </p>
                                    <p className="text-center text-sm">
                                        Sondern verstanden.
                                    </p>
                                    <p className="text-center text-sm">
                                        Viele Muster wirken von außen irrational. Von innen ergeben sie oft vollkommen Sinn.
                                    </p>
                                    <br/>    
                                    <p className="text-sm text-center text-primary"> Unser Fokus liegt nicht nur auf Verhalten. Sondern auf den Dynamiken darunter:</p>        
                                    <br/>    
                                        <div className="flex items-center justify-center">
                                            <div>
                                                {number_four.map((item, idx) => (                            
                                                <div 
                                                    key={idx}                                 
                                                    className="p-0"
                                                >                                
                                                    <span className="text-center text-sm inline-flex items-center justify-center gap-4">
                                                    <ArrowRight className="w-2 h-2 text-primary items-center bg-primary rounded-full"/>
                                                        {item.description}
                                                    </span>
                                                </div>
                                                ))}
                                            </div>
                                        </div>
                                        <br/>
                                    <p className="text-sm text-center "> Denn oft ist nicht „etwas falsch“ mit dir.</p>
                                    <p className="text-sm text-center "> Sondern ein Teil deines Systems lebt noch immer in alten Überlebensmustern.</p>
                                    <br/>
                                    <br/>
                                    <br/>
                                </div>
                                <div className="flex md:-ml-8 md:-mb-2 max-md:items-center max-md:justify-center">
                                    <img src="/Hero/herostein2.PNG" className="object-cover max-md:rounded-3xl md:mask-radial-[100%_80%] md:mask-radial-from-80% md:mask-l-from-0%"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>                    
            </div>
            <div className=" bg-card rounded-t-4xl pb-8 -mt-8 shadow-[0px_-1px_5px_10px_rgba(0,0,0,0.3)] animate-fade-in animation-delay-400">
                    <div className="container mx-auto space-y-6 py-16">
                        <div className="glass flex rounded-2xl glow-border tiems-center justify-center overflow-hidden">
                            <div className="grid md:grid-cols-2">
                                <div className="mt-0 mb-0 max-md:px-6 py-6 md:pl-8 md:-mr-24">
                                    <h3 className="text-2xl md:text-3xl text-center leading-tight  font-bold text-primary">Der Weg
                                        <span className="font-serif italic font-normal text-white"> zurück zu dir </span>
                                    <br/>
                                    </h3>
                                    <br/>
                                    <div className="grid gap-8 grid-cols-6 px-2">
                                        <div/>
                                        <div/>
                                        <div className="h-0.5 bg-linear-to-l from-primary via-primary/60 to-transparent"/>
                                        <div className="h-0.5 bg-linear-to-r from-primary via-primary/60 to-transparent"/>
                                    </div>
                                    <div className="flex -mt-8 -mb-8 items-center justify-center">
                                        <img src="/traumasensibel/Blume.png" className="w-18 h-16 rounded-full"/>
                                    </div>
                                    <br/>
                                    <p className="text-sm">
                                        Jeder Mensch bringt seine eigene Geschichte, Erfahrungen und inneren Dynamiken mit. 
                                        Deshalb verläuft auch jeder Veränderungsprozess anders. Manchmal genügt ein behutsames Hinschauen,
                                        manchmal braucht es mehr Zeit und tiefere innere Arbeit,
                                        damit sich wirklich etwas verändern kann.
                                    </p>
                                    <br/>
                                    <p className="text-sm">
                                        Im Mittelpunkt steht dabei immer die Verbindung zu dir selbst: zu deinen Bedürfnissen, 
                                        deinen Grenzen und dem, was dir wirklich wichtig ist.
                                    </p>
                                    <br/>
                                    <p className="text-sm">
                                        So kannst du Schritt für Schritt erkennen, 
                                        welche inneren Muster dich bisher eingeschränkt haben – 
                                        und beginnen, das loszulassen, 
                                        was dir nicht mehr entspricht.
                                    </p>
                                    <br/>
                                    <br/>
                                    <p className="text-sm">
                                        Hier findest du Möglichkeiten, wie wir dich auf diesem Weg begleiten können: traumasensibel, 
                                        achtsam und in deinem eigenen Tempo.
                                    </p>
                                </div>
                                <div className="flex md:-ml-8 -mb-2">
                                    <img src="/Hero/steine.jpeg" className="object-cover md:mask-l-from-60%"/>
                                </div>
                            </div>
                        </div>
                    <div className="grid lg:grid-cols-2 gap-12">
                        <div className="flex">
                            <div className="glass glow-border rounded-2xl overflow-hidden">
                                <div className="space-y-0">
                                    <div className="flex -mt-32 pb-4">
                                        <img src="/Hero/traumasens.jpeg" className="object-cover mask-b-from-80%"/>
                                    </div>
                                    <div className="flex items-center justify-center pb-4">
                                        <h2 className="text-2xl md:text-2xl text-center text-primary font-bold leading-tight">Traumasensible 
                                            <span className="text-white font-serif italic glow-text"> Begleitung</span>
                                            <br/>
                                        </h2>
                                    </div>
                                    <div className="grid gap-8 grid-cols-6 px-2">
                                        <div/>
                                        <div/>
                                        <div className="h-0.5 bg-linear-to-l from-primary via-primary/60 to-transparent"/>
                                        <div className="h-0.5 bg-linear-to-r from-primary via-primary/60 to-transparent"/>
                                    </div>
                                    <div className="flex -mt-8 -mb-8 items-center justify-center">
                                        <img src="/traumasensibel/Blume.png" className="w-18 h-16 rounded-full"/>
                                    </div>
                                    <div className="px-16 pt-4">
                                        <p className="text-sm text-center">
                                            Die Auswirkungen belastender Erfahrungen – sei es durch frühe Entwicklungsprägungen 
                                            oder durch überwältigende Ereignisse – können Menschen oft über viele Jahre begleiten. 
                                            Sie zeigen sich in innerer Anspannung, wiederkehrenden Mustern, Unsicherheit oder dem Gefühl, 
                                            sich selbst nicht wirklich vertrauen zu können.
                                        </p>
                                        <br/>
                                        <p className="text-sm text-center">
                                            In unserer traumasensiblen Begleitung unterstützen wir dich dabei, diese Zusammenhänge behutsam 
                                            zu verstehen und Schritt für Schritt neue innere Stabilität zu entwickeln. 
                                            Dabei arbeiten wir nicht nur mit dem, was im Denken sichtbar ist, 
                                            sondern auch mit den emotionalen und körperlichen Reaktionen deines Nervensystems.
                                        </p>
                                        <br/>
                                        <p className="text-sm text-center">
                                            So kann sich nach und nach lösen, was dich bisher innerlich festgehalten hat. Gleichzeitig stärkst 
                                            du deine Fähigkeit, dich selbst besser wahrzunehmen, 
                                            deine Grenzen zu achten und wieder mehr Vertrauen in dich und dein Leben zu entwickeln.
                                        </p>
                                        <br/>
                                    </div>
                                </div>
                                <div className=" flex items-center justify-center mb-6">
                                    <div className="flex bg-primary items-center justify-center rounded-full px-4 hover:bg-surface">   
                                        <Link 
                                            to="/coaching"
                                            className="px-8 py-2 text-xl text-muted-foreground hover:text-primary-foreground rounded-full"
                                        >
                                            Mehr Erfahren
                                        </Link>
                                        <ArrowRight className="text-muted-foreground"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex ">
                            <div className="glass rounded-2xl overflow-hidden">
                                <div className="space-y-0">
                                    <div className="flex -mt-32 pb-4">
                                        <img src="/Hero/psyschberatung.jpeg" className="object-cover mask-b-from-80%"/>
                                    </div>
                                    <div className="flex items-center justify-center pb-4">
                                        <h2 className="text-2xl md:text-2xl text-center text-primary font-bold leading-tight">Therapeutische
                                            <span className="text-white font-serif italic glow-text"> Begleitung</span>
                                            <br/>
                                        </h2>
                                    </div>
                                    <div className="grid gap-8 grid-cols-6 px-2">
                                        <div/>
                                        <div/>
                                        <div className="h-0.5 bg-linear-to-l from-primary via-primary/60 to-transparent"/>
                                        <div className="h-0.5 bg-linear-to-r from-primary via-primary/60 to-transparent"/>
                                    </div>
                                    <div className="flex -mt-8 -mb-8 items-center justify-center">
                                        <img src="/traumasensibel/Blume.png" className="w-18 h-16 rounded-full"/>
                                    </div>
                                    <div className="px-16 pt-4">
                                        <p className="text-sm text-center">
                                            Manchmal geraten wir in Kreisläufe aus Erwartungsdruck, Überforderung und Selbstkritik. 
                                            Gedanken drehen sich im Kreis, 
                                            der Anspruch an sich selbst wird immer größer und das Gefühl entsteht, nie wirklich zu genügen.
                                        </p>
                                        <br/>
                                        <p className="text-sm text-center">
                                            In unserer therapeutische Begleitung unterstützen wir dich dabei, diese Muster besser zu 
                                            verstehen und einen achtsameren Umgang mit dir selbst zu entwickeln. 
                                            Gemeinsam schauen wir auf die inneren Überzeugungen und Erfahrungen, die dein Erleben geprägt haben.
                                        </p>
                                        <br/>
                                        <p className="text-sm text-center">
                                            Handle Jetzt!
                                        </p>
                                        <br/>
                                        <p className="text-sm text-center pb-4">
                                            So kann Schritt für Schritt mehr Selbstakzeptanz, Klarheit und innere Stabilität entstehen – 
                                            und du findest wieder einen Zugang zu deinen eigenen Bedürfnissen und Ressourcen.
                                        </p>
                                        <br/>
                                        <br/>
                                    </div>
                                </div>
                                <div className=" flex items-center justify-center mb-6">
                                    <div className="flex bg-primary items-center justify-center rounded-full px-4 hover:bg-surface">   
                                        <Link 
                                            to="/therapie"
                                            className="px-8 py-2 text-xl text-muted-foreground hover:text-primary-foreground rounded-full"
                                        >
                                            Mehr Erfahren
                                        </Link>
                                        <ArrowRight className="text-muted-foreground"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className=" bg-card rounded-t-4xl pb-8 -mt-8 shadow-[0px_-1px_5px_10px_rgba(0,0,0,0.3)] animate-fade-in animation-delay-400">
                <div className="container mx-auto space-y-6 py-16">
                    <div className="glass rounded-2xl glow-border overflow-hidden">
                        <div className="grid md:grid-cols-2 w-full h-full">
                            <div className="py-6">
                                <h3 className="text-2xl md:text-2xl text-center leading-tight pb-2 font-bold text-primary">Unsere
                                    <span className="font-serif italic font-normal text-white"> Arbeit </span>
                                    <br/>
                                </h3>
                                <div className="grid gap-8 grid-cols-6 px-2">
                                    <div/>
                                    <div/>
                                    <div className="h-0.5 bg-linear-to-l from-primary via-primary/60 to-transparent"/>
                                    <div className="h-0.5 bg-linear-to-r from-primary via-primary/60 to-transparent"/>
                                </div>
                                <div className="flex -mt-8 -mb-8 items-center justify-center">
                                    <img src="/traumasensibel/Blume.png" className="w-18 h-16 rounded-full"/>
                                </div>
                                <p className="text-sm text-center pt-2 pb-2"> Unsere Begleitung verbindet:</p>
                                    <div className="flex items-center justify-center">
                                        <div>
                                            {number_five.map((item, idx) => (                            
                                            <div 
                                                key={idx}                                 
                                                className="p-0"
                                            >                                
                                                <span className="text-center text-sm inline-flex items-center justify-center gap-4">
                                                    <ArrowRight className="w-2 h-2 text-primary items-center bg-primary rounded-full"/>
                                                    {item.description}
                                                </span>
                                            </div>
                                            ))}
                                        </div>
                                    </div>
                                    <br/>
                                <p className="text-sm text-center "> Dabei arbeiten wir nicht nach starren Konzepten.</p>
                                <p className="text-sm text-center "> Wir folgen dem, was sich im System wirklich zeigt.</p>
                                <br/>
                                <p className="text-sm text-center "> Manchmal ruhig und stabilisierend. Manchmal direkt.</p>
                                <p className="text-sm text-center "> Manchmal konfrontierend. Aber niemals beschämend.</p>
                            </div>
                            <div className="flex justify-end">
                                <img src="/Hero/bild.jpeg" className="flex object-fill md:mask-l-from-70%"/>
                            </div>
                        </div>
                    </div>
                    <div className="grid lg:grid-cols-2 lg:gap-12 gap-8 w-full">
                        <div className="flex">
                            <div className="bg-[url('Hero/pflanzelinks.jpeg')] bg-right bg-cover glow-border rounded-2xl overflow-hidden py-6 lg:pl-44 md:pl-80 sm:pl-48 max-sm:px-12">
                                <h3 className="text-2xl md:text-2xl text-center leading-tight font-bold text-black">Wie Menschen
                                    <span className="font-serif italic font-normal text-muted-foreground"> unsere Arbeit oft erleben </span>
                                    <br/>
                                </h3>
                                <br/>
                                <div className="grid gap-8 grid-cols-4 px-2">
                                    <div/>
                                    <div className="h-0.5 bg-linear-to-l from-primary via-primary/60 to-transparent"/>
                                    <div className="h-0.5 bg-linear-to-r from-primary via-primary/60 to-transparent"/>
                                </div>
                                <div className="flex -mt-8 -mb-8 items-center justify-center">
                                    <img src="/traumasensibel/Blume.png" className="w-18 h-16 rounded-full"/>
                                </div>
                                <br/>
                                <div>
                                    <p className="text-center text-black">
                                        Viele Menschen kommen zu uns, weil sie bereits viel ausprobiert haben.
                                    </p>
                                    <p className="text-center text-black">
                                        Sie haben reflektiert. Gelesen. Analysiert.
                                    </p>
                                    <p className="text-center text-black">
                                        Therapien gemacht. Methoden gelernt.
                                    </p>
                                    <p className="text-center text-black">
                                        Und trotzdem bleibt etwas bestehen.
                                    </p> 
                                    <br/>  
                                    <p className="text-center text-black"> Oft hören wir Sätze wie:</p>
                                    <br/>
                                    <p className="text-center text-black"> „Ich habe mich zum ersten Mal wirklich verstanden gefühlt.“</p>
                                    <p className="text-center text-black"> „Ihr habt Dinge ausgesprochen, die ich selbst nicht greifen konnte.“</p>
                                    <p className="text-center text-black"> „Es war intensiv, aber nicht überfordernd.“</p>
                                    <p className="text-center text-black"> „Ich musste mich nicht verstellen.“</p>
                                    <p className="text-center text-black"> „Zum ersten Mal hatte ich das Gefühl, dass jemand wirklich sieht, was in mir passiert.“</p>
                                    <br/>
                                    <p className="text-center text-black"> Vielleicht, weil Menschen weniger perfekte Antworten brauchen.</p>
                                    <p className="text-center text-black"> Und mehr Räume, in denen sie nicht kämpfen müssen, um verstanden zu werden.</p> 
                                </div>
                            </div>
                        </div>
                        <div className="flex ">
                            <div className="bg-[url('Hero/steinerechts.jpeg')] bg-left bg-cover glow-border rounded-2xl overflow-hidden py-6 pr-16 pl-6">
                                <div className="lg:flex lg:items-center h-full lg:justify-center md:pr-32">
                                    <div>    
                                        <h3 className="text-2xl md:text-2xl text-center leading-tight  font-bold text-black">Unsere
                                        <span className="font-serif italic font-normal text-muted-foreground"> Haltung </span>
                                        <br/>
                                        </h3>
                                        <br/>
                                        <div className="grid gap-8 grid-cols-4 px-2">
                                            <div/>
                                            <div className="h-0.5 bg-linear-to-l from-primary via-primary/60 to-transparent"/>
                                            <div className="h-0.5 bg-linear-to-r from-primary via-primary/60 to-transparent"/>
                                        </div>
                                        <div className="flex -mt-8 -mb-8 items-center justify-center">
                                            <img src="/traumasensibel/Blume.png" className="w-18 h-16 rounded-full"/>
                                        </div>
                                        <br/>
                                        <p className="text-center text-black">
                                            Wir glauben nicht, dass Menschen einfach „positiver denken“ müssen.
                                        </p>
                                        <p className="text-center text-black">
                                            Wir glauben auch nicht, dass Heilung darin besteht, sich über Schmerz hinwegzuspiritualisieren.
                                        </p>
                                        <br/>
                                        <p className="text-center text-black">
                                            Viele Reaktionen entstehen nicht aus Schwäche. Sondern aus Anpassung.
                                        </p>
                                        <p className="text-center text-black">
                                            Aus Nervensystemlogik. Aus Bindung. Aus Schutz.
                                        </p>
                                        <br/>
                                        <p className="text-center text-black">
                                            Deshalb arbeiten wir nicht gegen Symptome. Sondern versuchen, die innere Logik dahinter zu verstehen.  
                                        </p>
                                        <br/>
                                        <p className="text-center text-black"> Vielleicht musst du nicht härter gegen dich kämpfen.</p> 
                                        <br/>   
                                        <p className="text-center text-black"> Vielleicht braucht dein System nicht noch mehr Druck.</p>
                                        <p className="text-center text-black"> Sondern zum ersten Mal einen Raum, in dem es nicht falsch ist.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-500"> 
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