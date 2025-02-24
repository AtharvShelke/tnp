'use client';

import { getRequest } from '@/lib/apiRequest';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BookletPage() {
    const { id } = useParams();
    const [booklet, setBooklet] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooklet = async () => {
            try {
                const data = await getRequest(`booklets/${id}`);
                setBooklet(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBooklet();
    }, [id]);

    return (
        <div className="max-w-screen-lg mx-auto my-5 p-6 bg-white border rounded-xl shadow-lg">
            {/* Header Section */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 bg-gray-50 px-6">
                <div className="flex items-center gap-4">
                    {/* Booklet Image */}
                    {loading ? (
                        <div className="w-32 h-24 bg-gray-300 animate-pulse rounded-md" />
                    ) : (
                        <img
                            className="w-32 h-24 object-contain rounded-md"
                            src={booklet?.imageUrl || '/logo.jpg'}
                            alt="Booklet"
                        />
                    )}

                    {/* Title */}
                    <div className="font-medium">
                        <div className="font-bold text-xl text-gray-800">
                            {loading ? <div className="w-48 h-6 bg-gray-300 animate-pulse rounded-md"></div> : booklet?.title}
                        </div>
                    </div>
                </div>

                {/* Download Button */}
                <div>
                    {loading ? (
                        <div className="w-32 h-10 bg-gray-300 animate-pulse rounded-md" />
                    ) : (
                        <a
                            href={booklet?.pdfUrl}
                            download
                            className="border border-gray-900 px-4 py-2 rounded-md text-gray-900 hover:bg-gray-900 hover:text-white transition-all"
                        >
                            Download PDF
                        </a>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sidebar - Departments */}
                <div className="col-span-1 border-r bg-gray-50 px-6 py-4">
                    <h2 className="text-lg font-bold mb-3">Departments</h2>
                    {loading ? (
                        <div className="h-20 bg-gray-300 animate-pulse rounded-md"></div>
                    ) : (
                        <ul className="list-disc ml-6 text-gray-600">
                            {booklet?.bookletDepartments?.length > 0 ? (
                                booklet.bookletDepartments.map((dept, i) => (
                                    <li key={i}>{dept.title}</li>
                                ))
                            ) : (
                                <li>No departments available</li>
                            )}
                        </ul>
                    )}
                </div>

                {/* Main Content - PDF Viewer */}
                <div className="col-span-2 px-6 py-4">
                    <h2 className="text-lg font-bold mb-3">Preview</h2>
                    {loading ? (
                        <div className="w-full h-[600px] bg-gray-300 animate-pulse rounded-md"></div>
                    ) : (
                        <iframe
                            src={booklet?.pdfUrl}
                            className="w-full h-[600px] rounded-md border"
                            frameBorder="0"
                        ></iframe>
                    )}
                </div>
            </div>
        </div>
    );
}
