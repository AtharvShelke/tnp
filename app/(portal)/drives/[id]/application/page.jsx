'use client';

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DataTable from '@/components/dashboard/StudentTable';
import ApplicationTable from "@/components/dashboard/ApplicationTable";
import ApplicantTable from "@/components/dashboard/ApplicantTable";

export default function DriveApplication() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchDriveApplicants = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/drives/${id}/application`);
        if (!response.ok) {
          throw new Error(`Failed to fetch drive applicants. Status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDriveApplicants();
  }, [id]);

  const columnNames = [
    "PRN",
    "Name",
    "Email",
    "Phone",
    "Adress",
    "DOB",
    "Gender",
    "Department",
    "CGPA",
    "Admission Type",
    "Expected Grad",
    "Live Backlogs",
    "Dead Backlogs",
    "Year Gap",
    "Preference 1",
    "Preference 2",
    "Preference 3",
    "Placed"
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center my-10">
        <span>Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center my-10">
        <span className="text-red-500">Error: {error}</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center my-10">
        <span>No applicants found.</span>
      </div>
    );
  }

  return (
   <div className='py-12 px-10 max-w-[1250px]'>
           <div className='font-bold mb-5 flex justify-between items-center'>
             <h1 className='text-xl'>All Students</h1>
            
           </div>
           <ApplicantTable columns={columnNames} data={data} />
         </div>
  );
}
