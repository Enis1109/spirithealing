import { Link } from "react-router-dom";

const sizeClasses = {
    sm: "px-5 py-2.5 text-sm",
    default: "px-6 py-3 text-base",
    lg: "px-8 py-3 text-lg",
};

export const Button = ({
    className = "",
    size = "default",
    children,
    to = "/kontakt",
    onClick,
}) => (
    <Link
        to={to}
        onClick={onClick}
        className={`inline-flex min-h-11 items-center justify-center rounded-full bg-primary font-semibold text-muted-foreground transition duration-200 hover:bg-surface hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${sizeClasses[size] ?? sizeClasses.default} ${className}`}
    >
        {children}
    </Link>
);
