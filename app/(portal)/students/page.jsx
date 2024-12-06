
import DataTable from '@/components/dashboard/StudentTable'
import React from 'react'

export default function AllStudentsPage() {
  const columns = ['PRN','First Name', 'Last Name', 'Branch', 'Year of Graduation', 'CGPA', 'IsPlaced']
  
const students = [
  {
    PRN: '123456789',
    First_Name: 'John',
    Last_Name: 'Doe',
    Branch: 'Computer Science',
    Year_of_Graduation: 2024,
    CGPA: 8.5,
    IsPlaced: true
  },
  {
    PRN: '987654321',
    First_Name: 'Jane',
    Last_Name: 'Smith',
    Branch: 'Mechanical Engineering',
    Year_of_Graduation: 2023,
    CGPA: 9.0,
    IsPlaced: false
  },
  {
    PRN: '112233445',
    First_Name: 'Alice',
    Last_Name: 'Johnson',
    Branch: 'Electrical Engineering',
    Year_of_Graduation: 2025,
    CGPA: 7.8,
    IsPlaced: true
  }
];
  return (
    <div className='py-12 px-10'>
      <div className=' font-bold  mb-5 flex justify-between items-center'>
      <h1 className='text-xl'>All Students</h1>
      <button className='border border-blue-950 px-3 py-1 rounded-md hover:bg-gray-900 hover:text-white transition-all'>Download</button>
      </div>
      <DataTable columns={columns} data={students}/>
    </div>
  )
}
