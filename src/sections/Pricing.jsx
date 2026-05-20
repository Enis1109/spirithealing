import { Code2, Lightbulb, Rocket, Users, ArrowRight, Check, Calendar1 } from "lucide-react"
import { useState } from "react";
import { Button } from "@/components/Button"
import { InlineWidget, PopupButton } from "react-calendly";

const booking_one = [
    {
        title: "Erstgespräch mit Sabine",
        dauer: "15 min",
        description:
        "Ein erstes Kennenlernen, um gemeinsam zu schauen, was dich aktuell bewegt und welche Form der Begleitung für dich passend sein könnte.",
        price: "Kostenlos",
        link: "https://calendly.com/spirit-healing/partner-einschreiben",
    },
    {
        title: "Erstgespräch mit Selcan",
        dauer: "15 min",
        description:
        "Ein ruhiger erster Raum für deine Fragen, dein Anliegen und ein erstes gemeinsames Spüren, ob die Zusammenarbeit für dich stimmig ist.",
        price: "Kostenlos",
        link: "https://calendly.com/selcan1975/erstgesprach",
    },
];

const booking_two = [
    {
        title: "Erstsitzung mit Sabine",
        dauer: "60 min",
        description:
            "Für Menschen, die tiefer auf emotionale Muster, Nervensystem, Beziehungsthemen oder innere Dynamiken schauen möchten.",
        price: "222 €",
        link: "https://calendly.com/spirit-healing/einzelsitzung-sabine",
    },
    {
        title: "Erstsitzung mit Selcan",
        dauer: "60 min",
        description:
            "Ein erster tiefergehender Prozessraum für emotionale Themen, innere Spannungen, Bindungsdynamiken und Selbstkontakt.",
        price: "222 €",
        link: "https://calendly.com/selcan1975/erstsitzung-selcan",            
    },
    {
        title: "Folgesitzung mit Sabine",
        dauer: "60 min",
        description:
            "Vertiefende Begleitung für deinen weiteren Prozess und das, was sich seit der letzten Sitzung gezeigt oder verändert hat.",
        price: "222 €",
        link: "https://calendly.com/spirit-healing/folgesitzung-sabine",            
    },
    {
        title: "Folgesitzung mit Selcan",
        dauer: "60 min",
        description:
            "Raum für weitere emotionale Prozessarbeit, innere Dynamiken und die nächste Ebene deines Weges.",
        price: "222 €",
        link: "https://calendly.com/selcan1975/folgesitzung-selcan",
    },
];

const booking = [
     {
        title: "Erstsitzung mit Sabine & Selcan",
        dauer: "60 min",
        description:
            "Gemeinsame Begleitung auf mehreren Ebenen gleichzeitig — emotional, psychologisch, systemisch und intuitiv.",
        price: "333 €",
        link: "https://calendly.com/d/ct8z-zk5-7yc/gemeinsame-erstsitzung",
    },
    {
        title: "Folgesitzung mit Sabine & Selcan",
        dauer: "60 min",
        description:
        "Gemeinsame prozessorientierte Begleitung mit tiefer emotionaler, systemischer und intuitiver Wahrnehmung.g",
        price: "333 €",
        link: "https://calendly.com/d/cvrv-kgh-zvr/gemeinsame-folgesitzung",
    },
    {
        title: "Intensivsitzung mit Selcan",
        dauer: "150 min",
        description:
            "Tiefergehende Prozessarbeit mit systemischer Aufstellungsarbeit oder schamanischer Seelenrückholung.",
        price: "333 €",
        link: "https://calendly.com/selcan1975/aufstellungsarbeit-selcan",            
    },
];

export const Pricing = () => {
    const [isSchmidt, setIsSchmidt] = useState(true);
    
    return (
        <section id="about" className="pt-20 relative overflow-hidden">
            <div className="container relative z-10 min-w-screen animate-fade-in">
                <div className="container mx-auto space-y-6 py-16">
                    <h1 className="text-4xl text-center md:text-5xl font-bold leading-tight text-primary glow-text">
                        Lerne uns 
                    <span className="font-serif italic font-normal text-white"> kennen</span>
                    </h1>
                    <div className="grid lg:grid-cols-2 md:grid-cols-2 gap-8 p-16">
                        {booking_one.map((item, idx) => (
                            <div 
                                key={idx} 
                                className="glass glow-border rounded-2xl p-4" 
                            >
                                <h2 className="text-center text-xl font-bold">{booking_one[idx].title}</h2>
                                <br/>
                                <p className="text-lg text-center">{booking_one[idx].description}</p>
                                <br/>
                                <p className="text-center text-xl font-bold">Dauer: {booking_one[idx].dauer}</p>
                                <p className="text-center text-xl font-bold">Preis: {booking_one[idx].price}</p>
                                <div className="flex mt-8 items-center justify-center">
                                    <PopupButton
                                        url={booking_one[idx].link}
                                        /*
                                        * react-calendly uses React's Portal feature (https://reactjs.org/docs/portals.html) to render the popup modal. As a result, you'll need to
                                        * specify the rootElement property to ensure that the modal is inserted into the correct domNode.
                                        */
                                        className="bg-primary text-black rounded-full px-2 text-lg cursor-pointer hover:bg-primary/90"
                                        rootElement={document.getElementById("root")}
                                        text="Jetzt Buchen"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <h2 className="text-2xl md:text-3xl text-center leading-tight  font-bold text-primary">Lerne deine
                        <span className="font-serif italic font-normal text-white"> inneren Prozesse kennen</span>
                        <br/>
                    </h2>
                    <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 p-16">
                        {booking_two.map((item, idx) => (
                            <div 
                                key={idx} 
                                className="glass glow-border rounded-2xl p-4" 
                            >
                                <h2 className="text-center text-xl font-bold">{booking_two[idx].title}</h2>
                                <br/>
                                <p className="text-lg text-center">{booking_two[idx].description}</p>
                                <br/>
                                <p className="text-center text-xl font-bold">Dauer: {booking_two[idx].dauer}</p>
                                <p className="text-center text-xl font-bold">Preis: {booking_two[idx].price}</p>
                                <div className="flex mt-8 items-center justify-center">
                                    <PopupButton
                                        url={booking_two[idx].link}
                                        /*
                                        * react-calendly uses React's Portal feature (https://reactjs.org/docs/portals.html) to render the popup modal. As a result, you'll need to
                                        * specify the rootElement property to ensure that the modal is inserted into the correct domNode.
                                        */
                                        className="bg-primary text-black rounded-full px-2 text-lg cursor-pointer hover:bg-primary/90"
                                        rootElement={document.getElementById("root")}
                                        text="Jetzt Buchen"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <h2 className="text-2xl md:text-3xl text-center leading-tight  font-bold text-primary">Lerne deine
                        <span className="font-serif italic font-normal text-white"> inneren Prozesse selbst zu bestimmen</span>
                        <br/>
                    </h2>
                    <div className="px-16">
                        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 p-16">
                            {booking.map((item, idx) => (
                                <div 
                                    key={idx} 
                                    className="glass glow-border rounded-2xl p-4" 
                                >
                                    <h2 className="text-center text-xl font-bold">{booking[idx].title}</h2>
                                    <br/>
                                    <p className="text-lg text-center">{booking[idx].description}</p>
                                    <br/>
                                    <p className="text-center text-xl font-bold">Dauer: {booking[idx].dauer}</p>
                                    <p className="text-center text-xl font-bold">Preis: {booking[idx].price}</p>
                                    <div className="flex mt-8 items-center justify-center">
                                        <PopupButton
                                            url={booking[idx].link}
                                            /*
                                            * react-calendly uses React's Portal feature (https://reactjs.org/docs/portals.html) to render the popup modal. As a result, you'll need to
                                            * specify the rootElement property to ensure that the modal is inserted into the correct domNode.
                                            */
                                            className="bg-primary text-black rounded-full px-2 text-lg cursor-pointer hover:bg-primary/90"
                                            rootElement={document.getElementById("root")}
                                            text="Jetzt Buchen"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <h3 className="text-2xl md:text-3xl text-center leading-tight  font-bold text-primary">Dein Weg in die Freiheit -
                        <span className="font-serif italic font-normal text-white"> ein selbstbestimmtes Leben</span>
                        <br/>
                    </h3>
                    <h3 className="text-2xl md:text-3xl text-center leading-tight  font-bold text-primary">Lass dir ein individuelles Paket schnüren, 
                        <span className="font-serif italic font-normal text-white"> genau auf dich zugeschnitten. Butten dann zum Kontaktformular.</span>
                        <br/>
                    </h3>
                    
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
                                <img src="/breachright.jpeg" className="flex object-cover md:mask-l-from-50% md:mask-t-from-80%"/>
                            </div>
                        </div>
                </div>
            </div>
        </section>
    );
}
{/* 
    - Erstgespr. S/F/G 15min
    - Sitzung S/F/G 1std g 1.5 std
    - Aufstellung S/F/G 2std g bis zu 4std
    - Schamanische S/F/G 2std g bis zu 3 std 
    */}