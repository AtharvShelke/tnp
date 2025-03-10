'use client'

import ApplicationTable from '@/components/dashboard/ApplicationTable';
import { getRequest } from '@/lib/apiRequest';
import React, { useEffect, useState } from 'react'

export default function ApplicationPage() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchApplications = async () => {
            
            const response = await getRequest('drives/application')
            console.log(response)
            setData(response);
        };
        fetchApplications();
    }, []);
    const columns = ['Reference Number', 'Title', 'PRN', 'Name', 'Department', 'Status', 'Is Placed']
    return (
        <>
            <div className=' py-12 sm:w-[80vw] w-[90vw] md:px-10 mx-auto'>
                <div className='font-bold mb-5 flex justify-between items-center'>
                    <h1 className='text-xl'>All Students</h1>
                </div>
                <ApplicationTable data={data} columns={columns} />
            </div>

        </>
    )
}
