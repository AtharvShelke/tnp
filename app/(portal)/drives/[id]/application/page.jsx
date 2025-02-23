'use client';

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DataTable from '@/components/dashboard/StudentTable';
import ApplicationTable from "@/components/dashboard/ApplicationTable";
import ApplicantTable from "@/components/dashboard/ApplicantTable";
import { getRequest } from "@/lib/apiRequest";

export default function DriveApplication() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchDriveApplicants = async () => {
      try {
        const result = await getRequest(`drives/${id}/application`);
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDriveApplicants();
  }, [id]);

  const columnNames = [
    "PRN", "Name", "Email", "Phone", "Address", "DOB", "Gender",
    "Department", "CGPA", "Admission Type", "Expected Grad", 
    "Live Backlogs", "Dead Backlogs", "Year Gap",
    "Preference 1", "Preference 2", "Preference 3", "Placed"
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex items-center gap-2 text-gray-700">
          <span className="animate-spin h-5 w-5 border-t-2 border-gray-600 rounded-full"></span>
          <span>Loading applicants...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-red-600 font-medium bg-red-100 px-4 py-2 rounded-md">
          Error: {error}
        </span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-gray-500 text-lg">No applicants found.</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mt-10 mx-auto py-10 px-6 bg-white rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">All Applicants</h1>
      </div>
      <ApplicantTable columns={columnNames} data={data} />
    </div>
  );
}
