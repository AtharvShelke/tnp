'use client'
import Activity from '@/components/dashboard/Activity'
import Drive from '@/components/dashboard/Drive'
import NewHeader from '@/components/dashboard/NewHeader'
import { getRequest } from '@/lib/apiRequest'
import formDateFromString from '@/lib/formDateFromString'
import React, { useEffect, useState } from 'react'
import { ClipLoader } from 'react-spinners'

export default function page() {
  const [drives, setdrives] = useState([])
  const [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#324sdf");

  useEffect(() => {
    const fetchdrives = async () => {
      try {
        const data = await getRequest('activities');
        setdrives(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching the data or encountering an error
      }
    };
    
    fetchdrives();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex items-center gap-2 text-gray-700">
          <span className="animate-spin h-5 w-5 border-t-2 border-gray-600 rounded-full"></span>
          <span>Loading activities...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NewHeader title={"Activities"} link={'/activities/new'} />
      <div className="px-16 grid grid-cols-4 gap-y-6">
        {drives.map((drive, i) => {
          const formattedDate = formDateFromString(drive.date);
          return (
            <Activity
              key={i}
              title={drive.title}
              img={drive.imageUrl || '/logo.jpg'}
              date={formattedDate}
              id={drive.id}
            />
          );
        })}
      </div>
    </div>
  );
}
