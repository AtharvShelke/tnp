'use client'
import DataTable from '@/components/dashboard/StudentTable'
import { getRequest } from '@/lib/apiRequest';
import formDateFromString from '@/lib/formDateFromString';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import * as XLSX from 'xlsx';

export default function AllStudentsPage() {
  const [studentData, setStudentData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession()
  const userId = session?.user?.id

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      // student
      try {
        const students = await getRequest(`student`)


        const combinedUserDataPromises = students.map(async (student) => {
          // user/${student.userId}
          const userData = await getRequest(`user/${student.userId}`)
          
          const departmentData = await getRequest(`departments/${student.departmentId}`)

          return {
            user:userData.id,
            prn: student.PRN,
            name: userData.name,
            department: departmentData.title,
            dob: formDateFromString(student.dob),
            gender: student.gender,
            email: userData.email,
            phone: student.phone,
            address: student.address,
            cgpa: student.cgpa,
            yearGap: student.yearGap,
            liveBacklogs: student.liveBack,
            deadBacklogs: student.deadBack,
            admissionType: student.admissionType,
            passOutYear: student.passOutYear,
            preference1: student.preference1,
            preference2: student.preference2,
            preference3: student.preference3,
            placed: student.placed,
          }
        })
        const combinedData = await Promise.all(combinedUserDataPromises)
        setStudentData(combinedData)
      } catch (error) {
        console.error("Error details:", {
          message: error.message,
          stack: error.stack,
          cause: error.cause,
        });
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const columnNames = [
    "prn",
    "name",
    "email",
    "phone",
    "address",
    "dob",
    "gender",
    "department",
    "cgpa",
    "admissionType",
    "passOutYear",
    "liveBacklogs",
    "deadBacklogs",
    "yearGap",
    "preference1",
    "preference2",
    "preference3",
    "placed"
  ];
  const handleDownload = () => {
    const dataToExport = studentData.map(student => ({
      prn: student.prn,
      name: student.name,
      dob: formDateFromString(student.dob),
      department: student.department,
      gender: student.gender,
      email: student.email,
      phone: student.phone,
      address: student.address,
      admissionType: student.admissionType,
      passOutYear: student.passOutYear,
      department: student.department,
      cgpa: student.cgpa,
      liveBacklogs: student.liveBacklogs,
      deadBacklogs: student.deadBacklogs,
      yearGap: student.yearGap,
      preference1: student.preference1,
      preference2: student.preference2,
      preference3: student.preference3,
      placed: student.placed
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

    XLSX.writeFile(workbook, 'students.xlsx');
  };
  if (studentData) {
    console.log(studentData)
    return (
      <div className='py-12 px-10 max-w-[1250px]'>
        <div className='font-bold mb-5 flex justify-between items-center'>
          <h1 className='text-xl'>All Students</h1>
          <button
            onClick={handleDownload}
            className='border border-blue-950 px-3 py-1 rounded-md hover:bg-gray-900 hover:text-white transition-all'
          >
            Download
          </button>
        </div>
        <DataTable columns={columnNames} data={studentData} />
      </div>
    );
  }
  return null
}