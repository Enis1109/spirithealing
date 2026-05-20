import { Button } from "@/components/Button"
import { ArrowDown, Menu, X } from "lucide-react";
import {useEffect, useState} from "react"
import { Link } from "react-router-dom";

const navLinks = [
    { href: "/coaching", label: "Traumasensible Prozessbegleitung"},
    { href: "/therapie", label: "Integrative Therapie"},
    { href: "/about", label: "Über uns"},
    { href: "/prices", label: "Preise/Termine"},
    { href: "/faq", label: "FAQ"}
];

export const Navbar = () => {
    
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.addEventListener("scroll", handleScroll);
    }, []);

    return (
    <header className={isScrolled ? "transition-all duration-500 glass-strong py-3 fixed top-0 left-0 right-0 z-50" : "transition-all duration-500 fixed top-0 left-0 right-0 z-50 bg-transparent py-3"}>
        <nav className=" container  px-6 flex items-center justify-between min-w-screen">
            <div className=" flex items-center">  
                <img src="Logo.png" className="w-16 h-16"/>
                <Link to="/" className={isScrolled ? "text-2xl font-bold tracking-tight hover:text-primary text-muted-foreground" : "text-2xl font-bold tracking-tight hover:text-primary"}>
                Spirit Healing<span className="text-primary"></span>
                </Link>
            </div>
            {/*Navbar pc */}
            <div className="hidden md:flex  gap-1">
                <div className="glass rounded-full px-2 py-1 flex items-center gap-1">
                    {navLinks.map((link, index) => (
                        <Link 
                            to={link.href}
                            key={index}
                            className="px-4 py-2 text-sm text-muted-foreground hover:text-primary-foreground rounded-full hover:bg-surface"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
            <div className="hidden md:block">
                        <Button size="sm">
                            Kontakt
                        </Button>
                    </div>
            <button className="md:hidden p-2 text-fourground cursor-pointer" onClick={() => setIsMobileMenuOpen((prev) => !prev)}>
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24}/>}
            </button>
        </nav>
        {isMobileMenuOpen && (
            <div className="md:hidden glass-strong animate-fade-in">
                <div className="container mx-auto px-6 py-6 flex flex-col gap-4 ">
                    {navLinks.map((link, index) => (
                            <Link 
                                to={link.href}
                                key={index}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-lg text-muted-foreground hover:text-foreground py-2"
                            >
                                {link.label}
                            </Link>
                        ))}
                    <Button onClick={() => setIsMobileMenuOpen(false)}>
                        Kontakt
                    </Button>
                </div>
            </div>
        )}
    </header>
    )
}