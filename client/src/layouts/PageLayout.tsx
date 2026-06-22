import { Button, Input } from '@/components';
import { Bell, Loader, LogOut, Menu, WavesArrowDown, ZodiacAquarius, Search, ChartBarStacked } from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Link, Outlet } from 'react-router';
import { useLogoutMutation } from '@/features/auth/hooks';

import { useState } from 'react';
import { ProfileSheet } from '@/features/users/components';
import { toast } from 'sonner'  ;
import { useMe } from '@/features/users/hooks';
import logo_small from '../components/assets/vrt_logo_small.png';
import logo_text from '../components/assets/vrt_logo_text.png';

export const PageLayout = () => {
  const { data: user } = useMe();
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ');
  const logoutMutation = useLogoutMutation();
  const [isProfileSheetOpen, setProfileSheetOpen] = useState(false);

  function handleLogout(e: Event) {
    e.preventDefault();
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('Logged out successfully');
      },
    });
  }

  function handleOpenProfileSheet() {
    setProfileSheetOpen(true);
  }

  return (
    <div className='h-screen overflow-hidden flex'>
      <div className='h-full w-80 md:w-96 flex flex-col gap-2 p-2 border-r'>
        <div className='flex items-center gap-2 pb-2 border-b-2'>
            <img src={logo_small} alt='VRT Logo' className='h-12 w-auto' />
            <img src={logo_text} alt='VRT Logo' className='h-6 w-auto' />
          </div>
        <div className='flex gap-2'>
          
          <InputGroup>
            <InputGroupInput placeholder='Search...' name='search' />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupAddon align='inline-end'>12 results</InputGroupAddon>
          </InputGroup>
        </div>

        <nav>
          <ul className='flex flex-col gap-1'>
            <li>
              <Link to='' className='flex items-center gap-2 p-2 rounded-md hover:bg-slate-100'>
                <ChartBarStacked />
                Přehled
              </Link>
              <Link to='' className='flex items-center gap-2 p-2 rounded-md hover:bg-slate-100'>
                <WavesArrowDown />
                Vrtané studny
              </Link>
              <Link to='' className='flex items-center gap-2 p-2 rounded-md hover:bg-slate-100'>
                <ZodiacAquarius />
                Geotermální vrty
              </Link>
            </li>
          </ul>
        </nav>

        <div className='mt-auto flex items-center justify-between gap-3 rounded-xl border-2 border-brand-secondary p-3'>
          <Button variant='ghost'  onClick={handleOpenProfileSheet} size='sm'>
            <div className='truncate text-lg font-semibold text-slate-900 flex gap-2'>
                <span>{user?.statusEmoji || '😎'}</span>
              {fullName || 'Přihlášený uživatel'}
            </div>
          </Button>
          <Button
            variant='secondary'
            size='icon'
            onClick={handleLogout}
            className='border border-brand-secondary text-border-secondary'
            disabled={logoutMutation.isPending}
            aria-label='Logout'
          >
            <LogOut className={`${logoutMutation.isPending ? 'animate-spin' : undefined} text-white`} />
          </Button>
        </div>
      </div>

      <div className='h-full overflow-auto flex-1 flex flex-col relative'>        
        <Outlet />
      </div>

      <ProfileSheet isOpen={isProfileSheetOpen} onOpenChange={setProfileSheetOpen} />
    </div>
  );
};
