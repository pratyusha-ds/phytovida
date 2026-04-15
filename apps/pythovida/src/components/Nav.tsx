import { Link } from 'react-router';
import { Button } from "@repo/ui/components/button";


const Nav = () => {

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-transparent">
                <div className="left-section">
                    <Link to="/" className="font-serif text-xl font-bold text-headline hover:text-link-hover transition-colors duration-200">PhytoVida</Link>
                </div>

                <div className="hidden md:flex gap-6 px-6 py-2">
                    <Link to="/dashboard" className="font-sans text-sm font-bold text-base text-accent4 hover:text-link transition-colors duration-200">My Garden</Link>
                    <Link to="/dashboard" className="font-sans text-sm font-bold text-base text-accent4 hover:text-link transition-colors duration-200">Plant Library</Link>
                    <Link to="/dashboard" className="font-sans text-sm font-bold text-base text-accent4 hover:text-link transition-colors duration-200">Guides</Link>
                    <Link to="/dashboard" className="font-sans text-sm font-bold text-base text-accent4 hover:text-link transition-colors duration-200">Community</Link>
                </div>
                <div>
                    <Button asChild variant="default" className="rounded-full">
                    <Link to="dashboard" className="rounded-full px-6 py-2">Log in</Link>
                    </Button>
                </div>
            </nav>

        </>
    )

}

export default Nav