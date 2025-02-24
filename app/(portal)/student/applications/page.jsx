'use client'

import  { useEffect, useState } from 'react';
import MyApplicationTable from '@/components/dashboard/MyApplicationTable';
import { useSession } from 'next-auth/react';
import formDateFromString from '@/lib/formDateFromString';
import { getRequest } from '@/lib/apiRequest';

export default function Page() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState([]);
  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) return;

    const fetchApplications = async () => {
      try {
        const data = await getRequest(`application/${userId}`);
        const applicationsData = data.application || [];

        const formattedApplications = await Promise.all(
          applicationsData.map(async (app) => {
            const drive = await getRequest(`drives/${app.driveId}`);

            return {
              referenceNumber: drive.referenceNumber || 'N/A',
              title: drive.title || 'Untitled',
              dateOfApplication: formDateFromString(app.createdAt),
              status: app.status || 'Unknown',
            };
          })
        );

        setApplications(formattedApplications);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    fetchApplications();
  }, [userId]);

  const columns = ['Reference Number', 'Title', 'Date of Application', 'Status', 'Action'];

  return (
    <div className='py-12 px-10 bg-gray-100 min-h-screen'>
      <div className='font-bold mb-5 flex justify-between items-center bg-white p-6 rounded-lg shadow-md'>
        <h1 className='text-2xl text-gray-900'>My Applications</h1>
      </div>
      <div className='bg-white p-6 rounded-lg shadow-md'>
        <MyApplicationTable columns={columns} data={applications} />
      </div>
    </div>
  );
}
