'use client';

import NewStudent from '@/components/Forms/NewStudent';
import { getRequest } from '@/lib/apiRequest';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function UpdateStudent({ params }) {
  const [departments, setDepartments] = useState(null);
  const [error, setError] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchParamsAndData = async () => {
      try {

        const { id } = await params;
        setStudentId(id)
        const departmentData = await getRequest(`departments`);
        const studentData = await getRequest(`student/${id}`);
        const dateOnly = new Date("2004-01-25T00:00:00.000Z").toISOString().split("T")[0];
        studentData.dob=dateOnly
        setData(studentData)
        setDepartments(departmentData);


      } catch (error) {
        toast.error('failed to fetch department')
        console.error(error);
      }
    };

    fetchParamsAndData();
  }, [params]);
  

  return (
    <>
      {error && <p className="text-red-500">{error}</p>}
      {departments && (
        <NewStudent departments={departments} isUpdate={true} initialData={data} studentId={studentId} />
      )}
    </>
  );
}
