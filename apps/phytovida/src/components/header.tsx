import logo from '@/assets/logo.svg';
import { UserButton, useAuth } from '@clerk/clerk-react';
import { Button } from '@repo/ui/components/button';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useState } from 'react';

export function Header() {
  const { isSignedIn } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className='relative flex justify-between items-center py-4 px-5'>
      <Link to='/'> 
      <img
        src={logo}
        alt='pythovida logo'
      />
      </Link>

      {/* Desktop nav */}
      <nav className='hidden md:flex gap-6 px-6 py-2'>
        <Link
          to={isSignedIn ? '/dashboard' : '/auth/sign-in'}
          className='font-sans text-sm font-bold text-base text-accent4 hover:text-link transition-colors duration-200'
        >
          Dashboard
        </Link>
        <Link
          to={isSignedIn ? '/my-garden' : '/auth/sign-in'}
          className='font-sans text-sm font-bold text-base text-accent4 hover:text-link transition-colors duration-200'
        >
          My Garden
        </Link>
        <Link
          to='/plant-library'
          className='font-sans text-sm font-bold text-base text-accent4 hover:text-link transition-colors duration-200'
        >
          Plant Library
        </Link>
        <Link
          to='/ask-ai'
          className='font-sans text-sm font-bold text-base text-accent4 hover:text-link transition-colors duration-200'
        >
          Ask AI
        </Link>
      </nav>

      {/* Desktop auth button */}
      <div className='hidden md:block'>
        {!isSignedIn ? (
          <Button
            className='rounded-full'
            asChild
          >
            <Link
              to='/auth/sign-in'
              state={{ from: location.pathname }}
            >
              <span className='sr-only'>Log in</span>
              Log in
              <ArrowUpRight />
            </Link>
          </Button>
        ) : (
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox:
                  'w-16 h-16 rounded-full border border-accent2',
              },
            }}
          />
        )}
      </div>

      {/* Mobile nav */}
      <div className='md:hidden'>
        <button
          className='hamburger'
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label='Toggle menu'
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className='absolute top-full left-0 right-0 z-50 bg-background border-t flex flex-col px-5 py-4 gap-4 md:hidden shadow-md'>
          <Link
            to={isSignedIn ? '/dashboard' : '/auth/sign-in'}
            className='font-sans text-sm font-bold text-base text-accent4 hover:text-link transition-colors duration-200'
          >
            Dashboard
          </Link>
          <Link
            to={isSignedIn ? '/my-garden' : '/auth/sign-in'}
            className='font-sans text-sm font-bold text-base text-accent4 hover:text-link transition-colors duration-200'
          >
            My Garden
          </Link>
          <Link
            to='/plant-library'
            className='font-sans text-sm font-bold text-base text-accent4 hover:text-link transition-colors duration-200'
          >
            Plant Library
          </Link>
          <Link
            to='/ask-ai'
            className='font-sans text-sm font-bold text-base text-accent4 hover:text-link transition-colors duration-200'
          >
            Ask AI
          </Link>

          <div>
            {!isSignedIn ? (
              <Button
                className='rounded-full'
                asChild
              >
                <Link
                  to='/auth/sign-in'
                  state={{ from: location.pathname }}
                >
                  <span className='sr-only'>Log in</span>
                  Log in
                  <ArrowUpRight />
                </Link>
              </Button>
            ) : (
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: 'w-16 h-16 border border-border',
                  },
                }}
              />
            )}
          </div>
        </div>
      )}
    </header>
  );
}
