import { Code2, Lightbulb, Rocket, Users, ArrowRight, Check, Calendar1 } from "lucide-react"
import { useState } from "react";
import { Button } from "@/components/Button"
import { InlineWidget, PopupButton } from "react-calendly";


export const Imp = () => {
    const [isSchmidt, setIsSchmidt] = useState(true);
    
    return (
        <section id="imp" className="pt-20 relative overflow-hidden">
            <div className="container relative z-10 min-w-screen animate-fade-in">
                <div className="container mx-auto">
                    <div className="space-y-6 py-6">
                        <h1 className="text-2xl md:text-3xl leading-tight  font-bold text-primary">Impressum
                        </h1>
                        <p className="text-lg">
                            Fatma Selcan Yilmaz <br/>
                            Spirit Healing <br/>
                            Ragazerstr. 15 <br/>
                            13407 Berlin <br/>
                        </p>
                        <h2 className="text-2xl md:text-3xl leading-tight  font-bold text-primary">Kontakt
                        </h2>
                        <p className="text-lg">
                            Telefon: 00491775022131 <br/>
                            E-Mail: kontakt@spirit-healing.coach <br/>
                        </p>
                        <h2 className="text-2xl md:text-3xl leading-tight  font-bold text-primary">Verbraucherstreitbeilegung/Universalschlichtungsstelle
                        </h2>
                        <p className="text-lg">
                            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer <br/>
                            Verbraucherschlichtungsstelle teilzunehmen. <br/>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}