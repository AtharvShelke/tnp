import React from 'react'
import DataTable from '@/components/dashboard/StudentTable'
import MyApplicationTable from '@/components/dashboard/MyApplicationTable';
export default function page() {
    const columns = ['Type','Title', 'Date_of_Application','Round1','Round2', 'Round3', 'Round4', 'Round5','Selected']
  
const applications = [
  {
    Type: 'Activity',
    Title: 'John',
    Date_of_Application: '16-Oct-2024',
    Round1:null,
    Round2:null, 
    Round3:null, 
    Round4:null, 
    Round5:null,
    Selected:null
  },
  {
    Type: 'Drive',
    Title: 'Jane',
    Date_of_Application: '16-Oct-2024',
    Round1:null,
    Round2:null, 
    Round3:null, 
    Round4:null, 
    Round5:null,
    Selected:null
  }
];
  return (
    <div className='py-12 px-10'>
      <div className=' font-bold  mb-5 flex justify-between items-center'>
      <h1 className='text-xl'>My Applications</h1>
      
      </div>
      <MyApplicationTable columns={columns} data={applications}/>
    </div>
  )
}
