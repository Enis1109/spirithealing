import { Gsp } from '@/sections/undersections/Gespraech';
import { ConversationTherapyOffer } from '@/components/ConversationTherapyOffer';
export const ConversationTherapy = () => <main className="min-h-screen bg-card px-4 pb-16 pt-28 sm:px-8" lang="de" data-no-translate>
    <header className="mx-auto max-w-6xl py-6 text-white"><h1 className="font-serif text-4xl sm:text-5xl">Gesprächs- und Verhaltenstherapie mit Selcan</h1></header>
    <ConversationTherapyOffer showDetails={false}/>
    <div className="mx-auto max-w-6xl"><Gsp/></div>
</main>;
