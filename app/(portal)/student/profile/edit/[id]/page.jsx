'use client';

import UpdateStudent from '@/components/Forms/UpdateStudent';
import { getRequest } from '@/lib/apiRequest';
import React, { use, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function UpdateStudentPage({ params }) {
  // Unwrap the params promise
  const { id } = use(params);
  const [departments, setDepartments] = useState(null);
  const [error, setError] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async (id) => {
      try {
        setLoading(true);
        
        // Fetch data in parallel
        const [departmentData, studentResponse] = await Promise.all([
          getRequest('departments'),
          getRequest(`student/${id}`)
        ]);

        // Format date if it exists
        if (studentResponse?.dob) {
          studentResponse.dob = new Date(studentResponse.dob).toISOString().split('T')[0];
        }

        setDepartments(departmentData);
        setStudentData(studentResponse);
      } catch (error) {
        console.error('Failed to fetch student data:', error);
        setError('Failed to load student data');
        toast.error('Failed to fetch student information');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData(id);
  }, [id]);

  if (loading) return <div className="text-center py-8">Loading student data...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {departments && studentData ? (
        <UpdateStudent
          departments={departments} 
          isUpdate={true} 
          initialData={studentData} 
          studentId={id}  // Use the unwrapped id here
        />
      ) : (
        <div className="text-center py-8">No student data found</div>
      )}
    </div>
  );
}