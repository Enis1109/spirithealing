export const Gsp = () => {
    
    return (
        <section id="about" className="relative overflow-hidden">
            <div className="glass-strong rounded-2xl overflow-hidden">
                <div className="grid lg:grid-cols-2">
                    <div className="lg:pl-16 pt-6 max-lg:text-center">
                        <h2 className="text-2xl md:text-3xl leading-tight pb-2 font-bold text-muted-foreground">GESPRÄCHSTHERAPIE
                        </h2>
                        <div className="grid lg:grid-cols-3 max-lg:grid-cols-2">
                            <div className="h-1 bg-primary"/>
                            <div className="h-1 bg-primary"/>
                        </div>
                        <h3 className="text-muted-foreground pt-2">
                            Manche Menschen brauchen keinen Ratschlag. Sondern einen Raum, in dem sie nicht bewertet werden. 
                        </h3>
                        <br/>
                        <p className="max-w-2xl text-lg leading-8 text-muted-foreground">Viele Menschen können ihre Gefühle sehr genau erklären und bleiben ihnen trotzdem innerlich fern. Sie wissen, was passiert – aber nicht, wie sie im entscheidenden Moment bei sich bleiben können.</p>
                        <blockquote className="mt-6 border-l-2 border-primary pl-5 text-lg font-semibold leading-8 text-muted-foreground">
                            Aus Grübeln und Selbstkritik wird über Jahre ein vertrauter innerer Kreislauf. Scham, Anpassung, Kontrolle oder Rückzug halten ihn aufrecht – häufig zusammen mit der Angst, wirklich gesehen zu werden.
                        </blockquote>
                    </div>
                    <div className="min-h-72 overflow-hidden">
                        <img src="/gespr/gespr.jpeg" className="h-full w-full object-cover object-center lg:mask-l-from-50%"/>
                    </div>
                </div>
            </div>
                <div className="grid md:grid-cols-2 gap-4 pt-4">
                    <div className="glass-strong rounded-2xl overflow-hidden">
                        <div className="grid h-full lg:grid-cols-2">
                            <div className="min-h-64 overflow-hidden lg:min-h-full">
                                <img src="/gespr/gespr3.jpeg" className="h-full w-full object-cover object-center lg:mask-r-from-50%"/>
                            </div>
                            <div className="py-4 max-lg:text-center">
                                <h3 className="text-xl md:text-xl text-center pb-2 leading-tight font-bold text-primary">Gespräche
                                    <span className="font-serif italic font-normal text-muted-foreground"> können regulieren </span>
                                </h3>
                                <div className="grid grid-cols-2 px-16">
                                    <div className="h-0.5 bg-primary"/>
                                    <div className="h-0.5 bg-primary"/>
                                </div>
                                <p className="text-muted-foreground pt-2">Nicht, weil jemand die perfekte Lösung sagt.
                                </p>
                                <p className="text-muted-foreground">Sondern weil ein Nervensystem beginnt, sich in Kontakt sicherer zu fühlen.
                                </p>
                                <p className="text-muted-foreground">Gesprächstherapie bedeutet für uns deshalb nicht nur, über Probleme zu reden.
                                </p>
                                <br/>
                                <p className="text-muted-foreground">Sondern gemeinsam herauszufinden, welche Dynamik gerade wirkt, welcher Schutzmechanismus übernimmt und welche Erfahrung unter dem aktuellen Konflikt weiterlebt.</p>
                            </div>
                        </div>
                    </div>
                    <div className="glass-strong rounded-2xl overflow-hidden">
                        <div className="grid lg:grid-cols-2 h-full">
                            <div className="min-h-64 overflow-hidden lg:min-h-full">
                                <img src="/gespr/gespr2.jpeg" className="h-full w-full object-cover object-center lg:mask-r-from-50%"/>
                            </div>
                            <div className="py-4 max-lg:text-center">
                                <h3 className="text-xl md:text-xl text-center pb-2 leading-tight font-bold text-primary">Was
                                    <span className="font-serif italic font-normal text-muted-foreground"> viele Menschen erleben</span>
                                </h3>
                                <div className="grid grid-cols-2 px-16">
                                    <div className="h-0.5 bg-primary"/>
                                    <div className="h-0.5 bg-primary"/>
                                </div>
                                <p className="text-muted-foreground pt-2">Viele Menschen kommen zu uns, weil sie sich selbst längst nicht mehr verstehen.
                                </p>
                                <p className="text-muted-foreground">Sie reagieren stärker, als sie wollen.
                                </p>
                                <p className="text-muted-foreground">Oder fühlen plötzlich gar nichts mehr.
                                </p>
                                <p className="text-muted-foreground">Manche funktionieren perfekt und fühlen sich innerlich trotzdem leer.
                                </p>
                                <p className="text-muted-foreground pb-6.5">Andere erleben starke emotionale Reaktionen, <br/><br/>
                                Scham,
                                Bindungsangst,
                                Verlustangst,
                                Wut,
                                Kontrolle,
                                Selbsthass oder Ohnmacht.
                                Nicht,
                                weil sie falsch sind.
                                Sondern weil ihr System gelernt hat,
                                so zu überleben.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
        </section>
    );
}
