'use client'

import React, { useEffect, useState } from 'react'
import MyApplicationTable from '@/components/dashboard/MyApplicationTable';
import { useSession } from 'next-auth/react';
import formDateFromString from '@/lib/formDateFromString';

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
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/drives/application/${userId}`, {
          method: "GET",
          headers: {
            "Cache-Control": 'no-store',
            "Pragma": 'no-cache',
          },
        });

        if (!response.ok) {
          console.log('Error in response');
          return;
        }

        const data = await response.json();
        // Assuming the response is an array of applications
        const formattedData = data.map(item => ({
          ...item,
          createdAt: formDateFromString(item.createdAt) // Format date field
        }));

        setApplications(formattedData); // Store formatted data
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
      {/* Pass the updated 'applications' data to the table */}
      <MyApplicationTable columns={columns} data={applications} />
    </div>
  )
}
