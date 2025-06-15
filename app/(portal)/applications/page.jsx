'use client'

import ApplicationTable from '@/components/dashboard/ApplicationTable';
import { getRequest } from '@/lib/apiRequest';
import React, { useEffect, useState } from 'react'
import { FiFileText, FiRefreshCw } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ApplicationPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
    const router = useRouter();

    const fetchApplications = async (page = 1, limit = 10) => {
        setLoading(true);
        try {
            const response = await getRequest(`application`);
            
            setData(response?.applications || []);
            setPagination(response?.pagination || { page, limit, total: 0 });
        } catch (error) {
            console.error('Failed to fetch applications:', error);
            toast.error('Failed to load applications');
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handlePageChange = (newPage) => {
        fetchApplications(newPage, pagination.limit);
    };

    const columns = ['Reference Number', 'Title', 'PRN', 'Name', 'Department', 'Status', 'Is Placed'];
    
    return (
        <div className='py-12 px-4 sm:px-6 lg:px-8 max-w-[1350px] mx-auto'>
            <div className='font-bold mb-5 flex justify-between items-center'>
                <h1 className='text-2xl'>Student Applications</h1>
                <button 
                    onClick={() => fetchApplications(pagination.page, pagination.limit)}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                >
                    {loading ? <FiRefreshCw className="animate-spin" /> : <FiRefreshCw />}
                    Refresh
                </button>
            </div>
            {loading ? (
                <div className="text-center py-10">Loading applications...</div>
            ) : data.length === 0 ? (
                <div className="text-center py-10 border border-dashed rounded-lg">
                    <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No applications found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        There are currently no student applications.
                    </p>
                </div>
            ) : (
                <>
                    <ApplicationTable 
                        data={data} 
                        columns={columns} 
                        onDataChange={() => fetchApplications(pagination.page, pagination.limit)} 
                    />
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-gray-700">
                            Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                            {pagination.total} entries
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page === 1}
                                className="px-4 py-2 border rounded-md disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page * pagination.limit >= pagination.total}
                                className="px-4 py-2 border rounded-md disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}