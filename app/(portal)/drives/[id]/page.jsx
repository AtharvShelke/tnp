'use client'
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DrivePage() {
    const params = useParams();
    const { id } = params;
    const [drive, setDrive] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchdrives = async (id) => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/drives/${id}`, {
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
          setDrive(data);
          setLoading(false);  // Set loading to false once data is fetched
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoading(false);
        }
      };
      fetchdrives(id);
    }, [id]);
    
    useEffect(() => {
      if (loading) {
        console.log('Loading...');
      } else if (drive) {
        console.log('frontend:', drive);
      } else {
        console.log('no drive');
      }
    }, [drive, loading]);
    
      
    




    return (
        
        <div className="border max-w-screen-xl my-5 mx-5 rounded-xl shadow-lg bg-white">
            
            <div className="flex items-center justify-between py-5 px-6 border-b bg-gray-50">
                <div className="flex items-center gap-4">
                    <img
                        className="w-30 h-24  object-contain"
                        src= {loading?'/logo.jpg':drive.imageUrl}
                        alt="Profile"
                    />
                    <div className="font-medium">
                        <div className="font-bold text-xl">
                            {loading?'Loading':drive.title}
                        </div>
                        <div className="text-sm text-gray-600 flex gap-1 items-center">
                            {loading?'Loading':drive.industryType}
                        </div>
                        <div className="text-sm text-gray-600 flex gap-1 items-center">
                        {loading?'Loading':drive.referenceNumber}
                        </div>


                    </div>

                </div>
                <div>
                    <div className="text-sm text-gray-600 flex gap-1 items-center">
                        <a href={loading?'Loading':drive.link} className="border border-gray-900 px-4 py-2 rounded-md text-gray-900 hover:bg-gray-900 hover:text-white transition-all">
                            Download
                        </a>
                        <a href={loading?'Loading':drive.link} className="border border-gray-900 px-4 py-2 rounded-md text-gray-900 hover:bg-gray-900 hover:text-white transition-all">
                            Apply
                        </a>
                    </div>

                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="col-span-1 border-r bg-gray-50 px-6 py-4">
                    <h2 className="text-lg font-bold mb-2">Job Location</h2>
                    <p className="text-gray-600">{loading?'Loading':drive.location}</p>
                    <h2 className="text-lg font-bold mt-6 mb-2">Job Role</h2>
                    <p className="text-gray-600">{loading?'Loading':drive.role}</p>
                    <h2 className="text-lg font-bold mt-6 mb-2">Job CTC</h2>
                    <p className="text-gray-600">{loading?'Loading':drive.ctc}</p>
                    <h2 className="text-lg font-bold mt-6 mb-2">Bond requirement</h2>
                    <p className="text-gray-600">{loading?'Loading':drive.bond}</p>
                    <h2 className="text-lg font-bold mt-6 mb-2">Departments</h2>
                    <ul className="list-disc ml-6 text-gray-600">
                    {loading?'Loading':drive.driveDepartments.map((round, i) => (
                            <li key={i}>{round.title}</li>
                        ))}
                    </ul>
                    <h2 className="text-lg font-bold mt-6 mb-2">Rounds</h2>
                    <ul className="list-disc ml-6 text-gray-600">
                    {loading?'Loading':drive.rounds.map((round, i) => (
                            <li key={i}>{round.title}</li>
                        ))}
                    </ul>

                </div>
                <div className="relative col-span-2 px-6 py-4">
                    <h2 className="text-lg font-bold mb-3">Drive Date</h2>
                    <p className="text-gray-600">{loading?'Loading':drive.driveDate}</p>
                    <h2 className="text-lg font-bold mb-3">Last Date</h2>
                    <p className="text-gray-600">{loading?'Loading':drive.lastDriveDate}</p>
                    <h2 className="text-lg font-bold my-3">About</h2>
                    <p className="text-gray-600">{loading?'Loading':drive.about}</p>
                    <h2 className="text-lg font-bold my-3">Job Description</h2>
                    <p className="text-gray-600">{loading?'Loading':drive.description}</p>
                    <h2 className="text-lg font-bold my-3">Job Eligibility</h2>
                    <p className="text-gray-600">{loading?'Loading':drive.eligibility}</p>
                    

                </div>

            </div>
        </div>
    );
}
