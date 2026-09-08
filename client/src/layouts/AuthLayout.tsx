import { Outlet, Navigate } from 'react-router';
import { useMe } from '@/features/users/hooks';
import logo from '../components/assets/vrt_logo.png';

export const AuthLayout = () => {
  const { data: user, isLoading } = useMe();

  if (isLoading) {
    return null;
  }

  if (user) {
    // TODO: Show a toast message "You are already logged in" or something like that
    return <Navigate to='/projects' replace />;
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-slate-50 p-4'>
      <div className='w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-sm border border-slate-100'>
        <div className='flex justify-center pb-4 mb-4 border-b-2 border-brand'>
          <img src={logo} alt='VRT Logo' className=' w-1/2' />
        </div>

        <div className=''>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
