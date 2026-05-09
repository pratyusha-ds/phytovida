import logo from '@/assets/logo.svg';
import { Link } from 'react-router';
import { Leaf, User } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';


export function Footer() {
  const { isSignedIn } = useAuth();

  return (
    <footer className='border-t border-border mt-20'>
      <div className='max-w-5xl mx-auto px-5 py-12 flex flex-col gap-4'>

        {/* Top row — three boxes */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>

          {/* Brand box */}
          <div className='rounded-2xl p-6 flex flex-col gap-4'>
            <Link to='/'>
              <img src={logo} alt='Pythovida logo' />
            </Link>
            <p className='text-sm text-accent4'>
              Helping every plant thrive, one garden at a time.
            </p>
          </div>

          {/* Grow box */}
          <div className='p-6 flex flex-col gap-3 justify-center items-center'>
            <Leaf />
            <Link to='/my-garden' className='hover:text-link transition-colors duration-200'>
              <h5 className='text-sm font-bold text-foreground'>Grow</h5>
            </Link>
          </div>

          {/* Profile box */}
          <div className='p-6 flex flex-col gap-3 justify-center items-center'>
            <User />
            {!isSignedIn ? (
              <Link to='/auth/sign-up' className='hover:text-link transition-colors duration-200'>
                <h5 className='text-sm font-bold text-foreground'>Sign up</h5>
              </Link>
            ) : (
              <Link to='/dashboard' className='hover:text-link transition-colors duration-200'>
                <h5 className='text-sm font-bold text-foreground'>Dashboard</h5>
              </Link>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className='flex flex-col md:flex-row justify-between items-center gap-2 pt-2 px-1'>
          <p className='text-xs text-accent4'>© {new Date().getFullYear()} Pythovida. All rights reserved.</p>
          <p className='text-xs text-accent4'>Made with 🌿</p>
        </div>

      </div>
    </footer>
  );
}