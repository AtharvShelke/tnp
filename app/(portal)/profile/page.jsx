'use client';
import { getRequest } from '@/lib/apiRequest';
import { Mail, Phone, University, UserRoundPen } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const [coordinator, setCoordinator] = useState(null);
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true); 
  const timestamp = new Date().getTime();
  useEffect(() => {
    if (!userId) return;

    const fetchCoordinatorDetails = async () => {
      try {
        
        const data = await getRequest(`coordinator/${userId}`)
        setCoordinator(data);
      } catch (error) {
        console.error('Failed to fetch coordinator details:', error.message);
        toast.error('Failed to fetch user details');
      }
    };

    const fetchDepartmentDetails = async () => {
      if (!coordinator?.data?.departmentId) return;

      try {
        const data = await getRequest(`departments/${coordinator?.data?.departmentId}`)

        
        setDepartment(data);
      } catch (error) {
        console.error('Failed to fetch department details:', error.message);
        toast.error('Failed to fetch user details');
      }
    };

    
    Promise.all([fetchCoordinatorDetails(), fetchDepartmentDetails()]).finally(() => {
      setLoading(false);
    });
  }, [userId, coordinator?.data?.departmentId]);

  const router = useRouter();

  if (status === 'authenticated' && session?.user?.role === 'STUDENT') {
    router.push('/student/profile');
    return null; 
  }

  if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
    return (
      <div className='min-h-screen flex items-center justify-center mt-[-30px]'>
        <div className='w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-lg'>
          <img
            className='object-contain object-center w-full h-60'
            src={session?.user?.pfp || '/logo.jpg'}
            alt='avatar'
          />

          <div className='flex items-center px-6 py-3 bg-gray-900'>
            <UserRoundPen className='text-white' />
            <h1 className='mx-3 text-lg font-semibold text-white'>{session?.user?.role}</h1>
          </div>

          <div className='px-6 py-4'>
            <h1 className='text-xl font-semibold text-gray-800'>{session?.user?.name}</h1>
            <p className='py-2 text-gray-700 flex gap-3'>
              <Mail className='w-5' />
              {session?.user?.email}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'authenticated' && session?.user?.role === 'COORDINATOR') {
    if (loading) {
      return (
        <div className='min-h-screen flex items-center justify-center'>
          <p>Loading...</p> {/* Loading state */}
        </div>
      );
    }

    return (
      <div className='min-h-screen flex items-center justify-center mt-[-30px]'>
        <div className='w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-lg'>
          <img
            className='object-contain object-center w-full h-60'
            src={session?.user?.pfp || '/logo.jpg'}
            alt='avatar'
          />

          <div className='flex items-center px-6 py-3 bg-gray-900'>
            <UserRoundPen className='text-white' />
            <h1 className='mx-3 text-lg font-semibold text-white'>{session?.user?.role}</h1>
          </div>

          <div className='px-6 py-4'>
            <h1 className='text-xl font-semibold text-gray-800'>{session?.user?.name}</h1>
            <p className='py-2 text-gray-700 flex gap-3'>
              <Mail className='w-5' />
              {session?.user?.email}
            </p>
            <p className='py-2 text-gray-700 flex gap-3'>
              <University className='w-5' />
              {department?.title}
            </p>
            <p className='py-2 text-gray-700 flex gap-3'>
              <Phone className='w-5' />
              {coordinator?.data?.phone}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null; 
}
