'use client'

import React, { useEffect, useState } from 'react'
import MyApplicationTable from '@/components/dashboard/MyApplicationTable';
import { useSession } from 'next-auth/react';
import formDateFromString from '@/lib/formDateFromString';
import { getRequest } from '@/lib/apiRequest';

export default function Page() {

  const { data: session } = useSession();
  const [applications, setApplications] = useState([]);
  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) {
      console.log('User not found');
      return;
    }

    const fetchApplications = async () => {
      // application/${userId}
      try {

        const data = await getRequest(`application/${userId}`)
        const formattedData = data.map(item => ({
          ...item,
          createdAt: formDateFromString(item.createdAt) 
        }));

        setApplications(formattedData); 
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    fetchApplications();
  }, [userId]);

  const columns = ['Reference Number', 'Title', 'Date of Application', 'Status']

  return (
    <div className='py-12 px-10'>
      <div className='font-bold mb-5 flex justify-between items-center'>
        <h1 className='text-xl'>My Applications</h1>
      </div>
      <MyApplicationTable columns={columns} data={applications} />
    </div>
  )
}
