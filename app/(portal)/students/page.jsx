'use client'
import DataTable from '@/components/dashboard/StudentTable'
import React from 'react'
import * as XLSX from 'xlsx';

export default function AllStudentsPage() {
  
  const columnNames = [
    "firstName",
    "middleName",
    "lastName",
    "prn",
    "dob",
    "gender",
    "email",
    "personalEmail",
    "age",
    "mobileNo",
    "alternateMobileNo",
    "localAddress",
    "permanentAddress",
    "nativePlace",
    "xPercentage",
    "xYearOfPassing",
    "xBoard",
    "xiiPercentage",
    "xiiYearOfPassing",
    "xiiBoard",
    "diplomaPercentage",
    "diplomaYearOfPassing",
    "diplomaCollege",
    "diplomaBranch",
    "admissionType",
    "passOutYear",
    "department",
    "sem1Sgpa",
    "sem2Sgpa",
    "sem3Sgpa",
    "sem4Sgpa",
    "sem5Sgpa",
    "sem6Sgpa",
    "sem7Sgpa",
    "sem8Sgpa",
    "avgCgpa",
    "avgSemPercentage",
    "liveBacklogs",
    "deadBacklogs",
    "yearGap",
    "languagesKnown",
    "minorProject",
    "majorProject",
    "preference1",
    "preference2",
    "preference3",
    "placed"
  ];
  
  const students = [
    {
      firstName: "John",
      middleName: "Doe",
      lastName: "Smith",
      prn: "123456789",
      dob: "2000-01-01",
      gender: "M",
      email: "john.doe@example.com",
      personalEmail: "john.doe@personal.com",
      age: 24,
      mobileNo: "9876543210",
      alternateMobileNo: "9123456789",
      localAddress: "123 Street, City, Country",
      permanentAddress: "456 Avenue, City, Country",
      nativePlace: "Native City",
      xPercentage: 85,
      xYearOfPassing: 2018,
      xBoard: "CBSE",
      xiiPercentage: 90,
      xiiYearOfPassing: 2020,
      xiiBoard: "CBSE",
      diplomaPercentage: 88,
      diplomaYearOfPassing: 2022,
      diplomaCollege: "ABC Polytechnic",
      diplomaBranch: "Computer Science",
      admissionType: "Regular",
      passOutYear: 2024,
      department: "Computer Science and Engineering",
      sem1Sgpa: 8.0,
      sem2Sgpa: 8.5,
      sem3Sgpa: 8.2,
      sem4Sgpa: 8.6,
      sem5Sgpa: 8.7,
      sem6Sgpa: 8.9,
      sem7Sgpa: 9.0,
      sem8Sgpa: 9.1,
      avgCgpa: 8.5,
      avgSemPercentage: 85,
      liveBacklogs: "No",
      deadBacklogs: "No",
      yearGap: "0",
      languagesKnown: ["English", "Hindi"],
      minorProject: "Project 1",
      majorProject: "Project 2",
      preference1: "Software Engineering",
      preference2: "Data Science",
      preference3: "AI/ML",
      placed: "Yes"
    },
    {
      firstName: "Jane",
      middleName: "Marie",
      lastName: "Doe",
      prn: "987654321",
      dob: "2000-05-15",
      gender: "F",
      email: "jane.doe@example.com",
      personalEmail: "jane.doe@personal.com",
      age: 24,
      mobileNo: "9876543210",
      alternateMobileNo: "9123456789",
      localAddress: "123 Street, City, Country",
      permanentAddress: "456 Avenue, City, Country",
      nativePlace: "Native City",
      xPercentage: 88,
      xYearOfPassing: 2018,
      xBoard: "CBSE",
      xiiPercentage: 92,
      xiiYearOfPassing: 2020,
      xiiBoard: "CBSE",
      diplomaPercentage: 89,
      diplomaYearOfPassing: 2022,
      diplomaCollege: "XYZ Polytechnic",
      diplomaBranch: "Electronics",
      admissionType: "Lateral",
      passOutYear: 2024,
      department: "Electrical and Computer Engineering",
      sem1Sgpa: 7.5,
      sem2Sgpa: 8.0,
      sem3Sgpa: 8.3,
      sem4Sgpa: 8.1,
      sem5Sgpa: 8.4,
      sem6Sgpa: 8.8,
      sem7Sgpa: 8.9,
      sem8Sgpa: 9.0,
      avgCgpa: 8.4,
      avgSemPercentage: 84,
      liveBacklogs: "No",
      deadBacklogs: "No",
      yearGap: "0",
      languagesKnown: ["English", "Spanish"],
      minorProject: "Project A",
      majorProject: "Project B",
      preference1: "Networking",
      preference2: "Cybersecurity",
      preference3: "Embedded Systems",
      placed: "No"
    }
  ];
  
  const handleDownload = () => {
    const dataToExport = students.map(student => ({
      firstName: student.firstName,
      middleName: student.middleName,
      lastName: student.lastName,
      prn: student.prn,
      dob: student.dob,
      gender: student.gender,
      email: student.email,
      personalEmail: student.personalEmail,
      age: student.age,
      mobileNo: student.mobileNo,
      alternateMobileNo: student.alternateMobileNo,
      localAddress: student.localAddress,
      permanentAddress: student.permanentAddress,
      nativePlace: student.nativePlace,
      xPercentage: student.xPercentage,
      xYearOfPassing: student.xYearOfPassing,
      xBoard: student.xBoard,
      xiiPercentage: student.xiiPercentage,
      xiiYearOfPassing: student.xiiYearOfPassing,
      xiiBoard: student.xiiBoard,
      diplomaPercentage: student.diplomaPercentage,
      diplomaYearOfPassing: student.diplomaYearOfPassing,
      diplomaCollege: student.diplomaCollege,
      diplomaBranch: student.diplomaBranch,
      admissionType: student.admissionType,
      passOutYear: student.passOutYear,
      department: student.department,
      sem1Sgpa: student.sem1Sgpa,
      sem2Sgpa: student.sem2Sgpa,
      sem3Sgpa: student.sem3Sgpa,
      sem4Sgpa: student.sem4Sgpa,
      sem5Sgpa: student.sem5Sgpa,
      sem6Sgpa: student.sem6Sgpa,
      sem7Sgpa: student.sem7Sgpa,
      sem8Sgpa: student.sem8Sgpa,
      avgCgpa: student.avgCgpa,
      avgSemPercentage: student.avgSemPercentage,
      liveBacklogs: student.liveBacklogs,
      deadBacklogs: student.deadBacklogs,
      yearGap: student.yearGap,
      languagesKnown: student.languagesKnown.join(', '), // Join array if it's an array
      minorProject: student.minorProject,
      majorProject: student.majorProject,
      preference1: student.preference1,
      preference2: student.preference2,
      preference3: student.preference3,
      placed: student.placed
    }));
  
    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  
    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
  
    // Write the workbook to a file and trigger download
    XLSX.writeFile(workbook, 'students.xlsx');
  };
  
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
      <DataTable columns={columnNames} data={students} />
    </div>
  );
}