import { Link } from "react-router-dom";

export const Button = ({className = "", size = "default", children}) => {
    
    return (
            <Link 
                to="/prices"
                className="bg-primary px-8 py-2 text-lg text-muted-foreground hover:text-primary-foreground rounded-full hover:bg-surface"
            >
                Kontakt
            </Link>
    )
}