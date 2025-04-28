// app/(portal)/application/page.jsx
'use client'

import ApplicationTable from '@/components/dashboard/ApplicationTable';
import { getRequest } from '@/lib/apiRequest';
import React, { useEffect, useState } from 'react'

export default function ApplicationPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const response = await getRequest('drives/application');
            setData(response);
        } catch (error) {
            console.error('Failed to fetch applications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const columns = ['Reference Number', 'Title', 'PRN', 'Name', 'Department', 'Status', 'Is Placed'];
    
    return (
        <>
            <div className='py-12 px-10 max-w-[1250px]'>
                <div className='font-bold mb-5 flex justify-between items-center'>
                    <h1 className='text-xl'>All Students</h1>
                </div>
                {loading ? (
                    <div className="text-center py-10">Loading applications...</div>
                ) : (
                    <ApplicationTable 
                        data={data} 
                        columns={columns} 
                        onDataChange={fetchApplications} 
                    />
                )}
            </div>
        </>
    )
}