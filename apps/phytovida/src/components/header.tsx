import logo from "@/assets/logo.svg";
import { UserButton, useAuth, useUser } from "@clerk/clerk-react";
import { Button } from "@repo/ui/components/button";
import { ArrowUpRight, LayoutDashboard, Leaf, Menu, Scan, Sprout, User } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@repo/ui/components/sheet";

export function Header() {
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  }

  useEffect(() => {
    closeMenu();
  }, [isSignedIn])

  return (
    <header className="relative flex justify-between items-center py-4 px-5">
      <Link to="/">
        <img src={logo} alt="pythovida logo" />
      </Link>

      {/* Desktop nav */}
      <nav className="hidden md:flex gap-6 px-6 py-2">
        <Link
          to={isSignedIn ? "/dashboard" : "/auth/sign-in"}
          className="font-sans text-sm font-bold text-base text-accent4 hover:text-link transition-colors duration-200"
        >
          Dashboard
        </Link>
        <Link
          to={isSignedIn ? "/my-garden" : "/auth/sign-in"}
          className="font-sans text-sm font-bold text-base text-accent4 hover:text-link transition-colors duration-200"
        >
          My Garden
        </Link>
        <Link
          to="/plant-library"
          className="font-sans text-sm font-bold text-base text-accent4 hover:text-link transition-colors duration-200"
        >
          Plant Library
        </Link>
        <Link
          to="/ask-ai"
          className="font-sans text-sm font-bold text-base text-accent4 hover:text-link transition-colors duration-200"
        >
          PhytoScan
        </Link>
      </nav>

      {/* Desktop auth button */}
      <div className="hidden md:block">
        {!isSignedIn ? (
          <Button className="rounded-full" asChild>
            <Link to="/auth/sign-in" state={{ from: location.pathname }}>
              <span className="sr-only">Log in</span>
              Log in
              <ArrowUpRight />
            </Link>
          </Button>
        ) : (
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox:
                  "w-16 h-16 rounded-full border border-accent2",
              },
            }}
          />
        )}
      </div>

      {/* Mobile nav */}
      <div className="md:hidden">
        {!menuOpen &&
          <button
            className="hamburger"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>}
      </div>

      {/* Mobile dropdown menu */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen} modal={false}>
        <SheetContent className="w-full max-w-sm">
          <SheetHeader className="p-6">
            <SheetTitle className="pb-4">
              <Link
                to="/"
                onClick={closeMenu}
              >
                PythoVida
              </Link></SheetTitle>
            <SheetDescription className="sr-only">Mobile navigation menu</SheetDescription>
            {isSignedIn ? (
              <div className="flex items-center gap-3 border-b p-4">
                <UserButton />

                <div className="flex flex-col">
                  <span className="font-medium">
                    {user?.fullName}
                  </span>

                  <span className="text-sm text-muted-foreground">
                    {user?.primaryEmailAddress?.emailAddress}
                  </span>
                </div>
              </div>
            ) :
              <div className="border-b p-4">
                <Link to="/auth/sign-in" state={{ from: location.pathname }}>
                  <span className="flex items-center gap-2 text-primary font-bold"><User />Log in
                  </span>
                </Link>
              </div>
            }
          </SheetHeader>

          <div className="flex h-full w-full flex-col pl-16 gap-4">
            <Link
              onClick={closeMenu}
              to={isSignedIn ? "/dashboard" : "/auth/sign-in"}
              className="text-md text-base text-accent4 hover:text-link transition-colors duration-200"
            >
              <span className="flex gap-2 items-center"><LayoutDashboard width={20} height={20} /> Dashboard</span>
            </Link>
            <Link
              onClick={closeMenu}
              to={isSignedIn ? "/my-garden" : "/auth/sign-in"}
              className="text-md text-base text-accent4 hover:text-link transition-colors duration-200"
            >
              <span className="flex gap-2 items-center"><Leaf width={20} height={20} />My Garden</span>
            </Link>
            <Link
              onClick={closeMenu}
              to="/plant-library"
              className="text-md text-base text-accent4 hover:text-link transition-colors duration-200"
            >
              <span className="flex gap-2 items-center"><Sprout width={20} height={20} />Plant Library</span>
            </Link>
            <Link
              onClick={closeMenu}
              to="/ask-ai"
              className="text-md text-base text-accent4 hover:text-link transition-colors duration-200"
            >
              <span className="flex gap-2 items-center"><Scan width={20} height={20} />PhytoScan</span>
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
