const constellationThemes = [
    { number: "01", image: "/familie/Herzmensch2.PNG", title: "Unbewusste Loyalitäten", text: "Bindungen, die stärker wirken können als der eigene bewusste Entschluss." },
    { number: "02", image: "/familie/binden.PNG", title: "Bindungen im Familiensystem", text: "Nähe, Distanz und Verantwortung, die über Generationen weitergegeben werden." },
    { number: "03", image: "/familie/hrz.PNG", title: "Übernommene Gefühle", text: "Emotionen, die vertraut wirken und doch nicht vollständig zur eigenen Geschichte gehören." },
    { number: "04", image: "/familie/Kreise.PNG", title: "Verdeckte Konflikte", text: "Spannungen, über die nie gesprochen wurde und die dennoch Entscheidungen beeinflussen." },
    { number: "05", image: "/familie/2mensch.PNG", title: "Emotionale Verstrickungen", text: "Der Versuch, durch eigenes Tragen die Zugehörigkeit zu einem Menschen zu sichern." },
];

export const Fam = () => {
    
    return (
        <section id="about" className="relative overflow-hidden">
            <div className="mb-4 overflow-hidden rounded-2xl border border-white/10 bg-[#0B777A]">
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
                    <div className="min-h-72 overflow-hidden rounded-2xl">
                        <img src="/familie/aust.jpeg" className="h-full w-full object-cover object-center md:mask-l-from-60% md:mask-radial-[70%_90%] md:mask-radial-from-80%"/>
                    </div>
                </div>
            </div>
                <div className="rounded-2xl mb-4 overflow-hidden">
                    <div className="bg-[url('/familie/baumhint.png')] bg-center bg-scale-down py-6">
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
                        <p className="mx-auto -mt-8 max-w-3xl text-center text-lg leading-8">Eine Aufstellung erklärt nicht nur. Sie macht räumlich und emotional erfahrbar, wie Beziehungen, Loyalitäten und übernommene Lasten im inneren System angeordnet sind.</p>
                        <div className="mx-auto mt-8 grid max-w-5xl gap-x-10 px-5 md:grid-cols-2 md:px-10">
                            {constellationThemes.map((item) => (
                                <article key={item.number} className="grid grid-cols-[4.5rem_1fr] gap-4 border-t border-white/20 py-5">
                                    <div className="relative h-16 w-16 overflow-hidden rounded-full border border-primary/60 bg-card">
                                        <img src={item.image} alt="" className="h-full w-full object-cover object-center" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold tracking-[0.18em] text-primary">{item.number}</span>
                                        <h4 className="mt-1 text-lg font-bold">{item.title}</h4>
                                        <p className="mt-1 leading-7 text-white/75">{item.text}</p>
                                    </div>
                                </article>
                            ))}
                        </div>
                        <p className="mx-auto mt-6 max-w-3xl px-5 text-center text-lg leading-8">So kann spürbar werden, dass ein hartnäckiges Muster nicht einfach „Persönlichkeit“ ist, sondern Teil einer tieferen systemischen Ordnung.</p>
                        <br/>
                    </div>
                </div>
            <div className="glass-strong rounded-2xl overflow-hidden">
                <div className="grid md:grid-cols-3">
                    <div className="min-h-56 overflow-hidden rounded-2xl">
                        <img src="/familie/berlin.jpeg" className="h-full w-full object-cover object-center mask-r-from-60%"/>
                    </div>    
                    <div className="px-4 py-6 md:-mx-16 md:px-0 md:py-4">
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
                        <p className="text-muted-foreground -mt-8 text-center pb-2">Unsere Aufstellungen finden online sowie vor Ort in Berlin und Antalya statt.
                        </p>
                        <p className="text-muted-foreground text-center pb-2">Vor Ort in:
                        </p>
                        <div className="flex items-center justify-center">
                            <div className="grid grid-cols-2 gap-8">
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
                                        <div className="h-18 w-18 items-center justify-center rounded-full bg-[url('/familie/antlogo2.JPG')] border-2 border-primary bg-center bg-cover  overflow-hidden">
                                        </div>
                                    </div>
                                    <div className="flex pt-2 items-center justify-center ">
                                        <p className="text-sm text-center text-muted-foreground">
                                            Antalya
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="min-h-56 overflow-hidden rounded-2xl">
                        <img src="/familie/antalya.jpeg" className="h-full w-full object-cover object-center mask-l-from-60%"/>
                    </div>
                </div>
            </div>
        </section>
    );
}
