'use client';
import Loader from '@/components/Loader';
import { getRequest } from '@/lib/apiRequest';
import { Mail, Phone, University, UserRoundPen } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const [coordinatorData, setCoordinatorData] = useState(null);
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (userId && session?.user?.role === "COORDINATOR") {
      const fetchCoordinatorDetails = async () => {
      try {
        const response = await getRequest(`coordinator/${userId}`);

        if (response?.data?.coordinator) {
          setCoordinatorData(response.data.coordinator);
          setDepartment(response.data.dept);
        } else {
          throw new Error('Invalid response structure');
        }
      } catch (error) {

        toast.error('Failed to fetch user details');
      } finally {
        setLoading(false);
      }
    };

    fetchCoordinatorDetails();
    }
    setLoading(false)
    return;

    
  }, [userId]);

  if (status === 'authenticated') {
    if (session?.user?.role === 'STUDENT') {
      router.push('/student/profile');
      return null;
    }

    if (loading) {
      return <Loader />;
    }

    return (
      <div className='min-h-screen flex items-center justify-center mt-[-30px]'>
        <div className='w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105'>
          <img
            className='object-cover object-center w-full h-60 rounded-t-lg'
            src={session?.user?.pfp || '/logo.jpg'}
            alt='avatar'
          />

          <div className='flex items-center px-6 py-3 bg-gray-900'>
            <UserRoundPen className='text-white' />
            <h1 className='mx-3 text-lg font-semibold text-white'>{session?.user?.role}</h1>
          </div>

          <div className='px-6 py-4'>
            <h1 className='text-xl font-semibold text-gray-800'>{session?.user?.name}</h1>
            <p className='py-2 text-gray-700 flex items-center gap-3'>
              <Mail className='w-5 text-gray-500' />
              {session?.user?.email}
            </p>
            {session?.user?.role === 'COORDINATOR' && (
              <>
                <p className='py-2 text-gray-700 flex items-center gap-3'>
                  <University className='w-5 text-gray-500' />
                  {department}
                </p>
                <p className='py-2 text-gray-700 flex items-center gap-3'>
                  <Phone className='w-5 text-gray-500' />
                  {coordinatorData?.phone || 'N/A'}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
