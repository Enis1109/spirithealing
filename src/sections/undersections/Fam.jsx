import { Code2, Lightbulb, Rocket, Users, ArrowRight, Check, Calendar1 } from "lucide-react"
import { useState } from "react";
import { Button } from "@/components/Button"

{/* Oft entstehen über Jahre innere Schleifen: */}
const number_one = [
    {
        description:
        "unbewusste Loyalitäten",
    },
    {
        description:
        "Bindungen innerhalb des Familiensystems",
    },
    {
        description:
        "übernommene Gefühle",
    },
    {
        description:
        "verdeckte Konflikte",
    },
    {
        description:
        "emotionale Verstrickungen",
    },
];

{/* Der Blick nach innen */}
const number_two = [
    {
        description:
        "Berlin",
    },
    {
        description:
        "Österreich (Raum Graz)",
    },
    {
        description:
        "zukünftig auch in Antalya",
    },
];

export const Fam = () => {
    
    return (
        <section id="about" className="relative overflow-hidden">
            <div className="bg-muted-foreground/50 rounded-2xl overflow-hidden mb-4">
                <div className="grid md:grid-cols-2">
                    <div className="pt-16 pb-8 md:pl-8 max-md:text-center">
                        <h2 className="text-2xl text-center md:text-3xl leading-tight pb-6 text-primary">FAMILIENAUFSTELLUNG
                        </h2>
                        <div className="grid gap-12 grid-cols-4">
                            <div/>
                            <div className="h-0.5 bg-linear-to-l from-primary via-primary/60 to-transparent"/>
                            <div className="h-0.5 bg-linear-to-r from-primary via-primary/60 to-transparent"/>
                        </div>
                        <div className="flex items-center justify-center -mt-12">
                            <img src="/traumasensibel/Blume.png" className="w-26 h-24 rounded-full"/>
                        </div>
                        <h3 className="text-xl md:text-2xl">
                            Manche Gefühle gehören <br/> nicht nur zu dir. 
                        </h3>
                        <br/>
                        <p className="">Manche Menschen tragen Spannungen, <br/> Schuldgefühle, Traurigkeit oder innere <br/> Lasten, 
                            die älter wirken als ihre eigene Geschichte.
                        </p>
                        <br/>
                        <p className="">Oft existieren Dynamiken, <br/>die nicht bewusst sichtbar sind.
                        </p>
                        <br/>
                        <p className="">Und trotzdem Beziehungen, Entscheidungen,<br/> Bindungen und Selbstbilder beeinflussen.
                        </p>
                        <br/>
                    </div>
                    <div className="flex rounded-2xl -ml-32">
                        <img src="/familie/aust.jpeg" className="flex object-fill  md:mask-l-from-60% md:mask-radial-[70%_90%] md:mask-radial-from-80%"/>
                    </div>
                </div>
            </div>
                <div className="rounded-2xl mb-4 overflow-hidden">
                    <div className="bg-[url('/familie/baumhint.png')] bg-center -ml-12 bg-scale-down py-6">    
                        <h3 className="text-2xl md:text-2xl text-center leading-tight text-primary pb-4">Was Aufstellungen
                            <span className="font-serif italic font-normal text-white"> sichtbar machen können </span>
                        </h3>
                        <div className="grid gap-12 grid-cols-4">
                            <div/>
                            <div className="h-0.5 bg-linear-to-l from-primary via-primary/60 to-transparent"/>
                            <div className="h-0.5 bg-linear-to-r from-primary via-primary/60 to-transparent"/>
                        </div>
                        <div className="flex -mt-12 items-center justify-center">
                            <img src="/traumasensibel/Blume.png" className="w-26 h-24 rounded-full"/>
                        </div>
                        <p className="text-lg text-center -mt-8">Aufstellungen machen innere Dynamiken sichtbar.
                        </p>
                        <p className="text-lg text-center">Nicht theoretisch. Sondern erlebbar.
                        </p>
                        <p className="text-lg text-center">Oft zeigen sich:
                        </p>
                        <div className="flex items-center justify-center pl-12 py-4">
                            <div className="grid lg:grid-cols-6 md:grid-cols-4 gap-4 px-12">
                                <div className="h-full border-2 border-primary rounded-2xl items-center justify-center">
                                    <div className="flex items-center justify-center">
                                        <div className="w-32 h-32 bg-[url('/familie/Herzmensch2.PNG')] bg-cover bg-center">
                                        </div>
                                    </div>
                                    <p className="text-sm text-center items-center justify-center md:-mt-4 pb-6 md:px-4">
                                        unbewusste Loyalitäten
                                    </p>
                                </div>
                                <div className="h-full border-2 border-primary rounded-2xl items-center justify-center">
                                    <div className="flex items-center justify-center">
                                        <div className="w-32 h-32  bg-[url('/familie/binden.PNG')] bg-cover bg-center">
                                        </div>
                                    </div>
                                    <p className="text-sm text-center items-center justify-center md:-mt-4 pb-6 md:px-4">
                                        Bindungen innerhalb des Familiensystems
                                    </p>
                                </div>
                                <div className="h-full border-2 border-primary rounded-2xl items-center justify-center">
                                    <div className="flex items-center justify-center">
                                        <div className="w-32 h-32  bg-[url('/familie/hrz.PNG')] bg-cover bg-center">
                                        </div>
                                    </div>
                                    <p className="text-sm text-center items-center justify-center md:-mt-4 pb-6 md:px-4">
                                        übernommene Gefühle
                                    </p>
                                </div>
                                <div className="h-full border-2 border-primary rounded-2xl items-center justify-center">
                                    <div className="flex items-center justify-center">
                                        <div className="w-32 h-32 bg-[url('/familie/Kreise.PNG')] bg-cover bg-center">
                                        </div>
                                    </div>
                                    <p className="text-sm text-center items-center justify-center md:-mt-4 pb-6 md:px-4">
                                        verdeckte Konflikte
                                    </p>
                                </div>
                                <div className="h-full border-2 border-primary rounded-2xl items-center justify-center">
                                    <div className="flex items-center justify-center">
                                        <div className="w-32 h-32 bg-[url('/familie/2mensch.PNG')] bg-cover bg-center">
                                        </div>
                                    </div>
                                    <p className="text-sm text-center items-center justify-center md:-mt-4 pb-6 md:px-4">
                                        emotionale Verstrickungen
                                    </p>
                                </div>
                            </div>
                        </div>
                        <p className="text-lg pl-24">Viele Menschen erleben dabei zum ersten Mal, <br/>dass bestimmte Muster nicht einfach „Persönlichkeit“ sind.
                        </p>
                        <br/>
                        <p className="text-lg text-primary pl-24">Sondern Teil tieferer systemischer Dynamiken.
                        </p>
                        <br/>
                    </div>
                </div>
            <div className="glass-strong rounded-2xl overflow-hidden">
                <div className="grid grid-cols-3">
                    <div className="flex rounded-2xl">
                        <img src="/familie/berlin.jpeg" className="flex object-fill  mask-r-from-60%"/>
                    </div>    
                    <div className="-mx-16 py-4">
                        <h3 className="text-2xl md:text-2xl text-center leading-tight pb-4 text-primary">Online
                            <span className="font-serif italic font-normal text-muted-foreground"> & vor Ort</span>
                        </h3>
                        <div className="grid gap-12 grid-cols-4">
                            <div/>
                            <div className="h-0.5 bg-linear-to-l from-primary via-primary/60 to-transparent"/>
                            <div className="h-0.5 bg-linear-to-r from-primary via-primary/60 to-transparent"/>
                        </div>
                        <div className="flex -mt-12 items-center justify-center">
                            <img src="/traumasensibel/Blume.png" className="w-26 h-24 rounded-full"/>
                        </div>
                        <p className="text-muted-foreground -mt-8 text-center pb-2">Unsere Aufstellungen finden sowohl online als auch vor Ort statt.
                        </p>
                        <p className="text-muted-foreground text-center pb-2">Aktuell in:
                        </p>
                        <div className="flex items-center justify-center">
                            <div className="grid lg:grid-cols-3 gap-4">
                                <div className="h-full items-center justify-center">
                                    <div className="flex items-center justify-center">
                                        <div className="h-18 w-18 items-center justify-center rounded-full bg-[url('/familie/berlin3.JPG')] border-2 border-primary bg-center bg-cover  overflow-hidden">
                                        </div>
                                    </div>
                                    <div className="flex pt-2 items-center justify-center ">
                                        <p className="text-sm text-center text-muted-foreground">
                                            Berlin
                                        </p>
                                    </div>
                                </div>
                                <div className="h-full items-center justify-center">
                                    <div className="flex items-center justify-center">
                                        <div className="h-18 w-18 items-center justify-center rounded-full bg-[url('/familie/ost3.JPG')] border-2 border-primary bg-center bg-cover  overflow-hidden">
                                        </div>
                                    </div>
                                    <div className="flex pt-2 items-center justify-center ">
                                        <p className="text-sm text-center text-muted-foreground">
                                            Österreich <br/> (Raum Graz)
                                        </p>
                                    </div>
                                </div>
                                <div className="h-full items-center justify-center">
                                    <div className="flex items-center justify-center">
                                        <div className="h-18 w-18 items-center justify-center rounded-full bg-[url('/familie/antlogo2.JPG')] border-2 border-primary bg-center bg-cover  overflow-hidden">
                                        </div>
                                    </div>
                                    <div className="flex pt-2 items-center justify-center ">
                                        <p className="text-sm text-center text-muted-foreground">
                                            zukünftig auch <br/> in Antalya
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex rounded-2xl ">
                        <img src="/familie/antalya.jpeg" className="flex object-fill  mask-l-from-60%"/>
                    </div>
                </div>
            </div>
        </section>
    );
}