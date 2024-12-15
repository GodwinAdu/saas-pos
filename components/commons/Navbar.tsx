import Link from 'next/link';
import UserDropdown from './user/user-dropdown';
import { currentUser } from '@/lib/helpers/current-user';
import { cn } from '@/lib/utils';
import { buttonVariants } from '../ui/button';


const Navbar = async () => {
    const user = await currentUser()
  return (
    <nav className="bg-background shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center font-extrabold">
              <span className='text-green-700'>POS</span>ify
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/features" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Features
              </Link>
              <Link href="/pricing" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Pricing
              </Link>
              <Link href="/contact" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Contact
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
                <UserDropdown username={user.fullName} email={user.email} avatarUrl={user.avatarUrl} notificationCount={100} />
            ):(
                <Link href="/sign-in" className={cn(buttonVariants({size:"sm"}))}>
                  Sign In
                </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

