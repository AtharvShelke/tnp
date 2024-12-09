'use client'
import formDateFromString from '@/lib/formDateFromString';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ActivityPage() {
    const params = useParams();
    const { id } = params;
    const [activity, setActivity] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchactivities = async (id) => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/activities/${id}`, {
            method: "GET",
            headers: {
              "Cache-Control": 'no-store',
              "Pragma": 'no-cache',
            },
          });
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setActivity(data);
          setLoading(false);  // Set loading to false once data is fetched
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoading(false);
        }
      };
      fetchactivities(id);
    }, [id]);
    
    useEffect(() => {
      if (loading) {
        console.log('Loading...');
      } else if (activity) {
        console.log('frontend:', activity);
        
      } else {
        console.log('no activity');
      }
    }, [activity, loading]);
    
      
    




    return (
        // <>{loading?'Loading...':activity.imageUrl}</>
        <div className="border max-w-screen-xl my-5 mx-5 rounded-xl shadow-lg bg-white">
            
            <div className="flex items-center justify-between py-5 px-6 border-b bg-gray-50">
                <div className="flex items-center gap-4">
                    <img
                        className="w-30 h-24  object-contain"
                        src= {loading?'/logo.jpg':activity.imageUrl||'/logo.jpg'}
                        alt="Profile"
                    />
                    <div className="font-medium">
                        <div className="font-bold text-xl">
                            {loading?'Loading':activity.title}
                        </div>
                        <div className="text-sm text-gray-600 flex gap-1 items-center">
                            {loading?'Loading':formDateFromString(activity.date)}
                        </div>
                        <div className="text-sm text-gray-600 flex gap-1 items-center">
                        {loading?'Loading':activity.referenceNumber}
                        </div>


                    </div>

                </div>
                <div>
                    <div className="text-sm text-gray-600 flex gap-1 items-center">
                        
                        <a href={loading?'Loading':activity.link} className="border border-gray-900 px-4 py-2 rounded-md text-gray-900 hover:bg-gray-900 hover:text-white transition-all">
                            Apply
                        </a>
                    </div>

                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="col-span-1 border-r bg-gray-50 px-6 py-4">
                    
                    
                    <h2 className="text-lg font-bold mt-6 mb-2">Departments</h2>
                    <ul className="list-disc ml-6 text-gray-600">
                    {loading?'Loading':activity.activityDepartments.map((round, i) => (
                            <li key={i}>{round.title}</li>
                        ))}
                    </ul>
                    
                    
                    

                </div>
                <div className="relative col-span-2 px-6 py-4">
                   
                    <h2 className="text-lg font-bold mb-3">Activity Description</h2>
                    <p className="text-gray-600">{loading?'Loading':activity.description}</p>
                    
                    

                </div>

            </div>
        </div>
    );
}
