'use client'
import { getRequest } from '@/lib/apiRequest';
import formDateFromString from '@/lib/formDateFromString';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BookletPage() {
    const params = useParams();
    const { id } = params;
    const [booklet, setBooklet] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooklet = async (id) => {
            // booklets/${id}
            try {
                const data = await getRequest(`booklets/${id}`)
                setBooklet(data);
                setLoading(false);  
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };
        fetchBooklet(id);
    }, [id]);

    useEffect(() => {
        if (loading) {
            console.log('Loading...');
        } else if (booklet) {
            console.log('frontend:', booklet);

        } else {
            console.log('no booklet');
        }
    }, [booklet, loading]);







    return (
        // <>{loading?'Loading...':activity.imageUrl}</>
        <div className="border max-w-screen-xl my-5 mx-5 rounded-xl shadow-lg bg-white">

            <div className="flex items-center justify-between py-5 px-6 border-b bg-gray-50">
                <div className="flex items-center gap-4">
                    <img
                        className="w-30 h-24  object-contain"
                        src={loading ? '/logo.jpg' : booklet.imageUrl || '/logo.jpg'}
                        alt="Profile"
                    />
                    <div className="font-medium">
                        <div className="font-bold text-xl">
                            {loading ? 'Loading' : booklet.title}
                        </div>



                    </div>

                </div>
                <div>
                    <div className="text-sm text-gray-600 flex gap-1 items-center">

                        <a href={loading ? '#' : booklet.pdfUrl} download className="border border-gray-900 px-4 py-2 rounded-md text-gray-900 hover:bg-gray-900 hover:text-white transition-all">
                            {loading ? 'Loading...' : 'Download'}
                        </a>
                    </div>

                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="col-span-1 border-r bg-gray-50 px-6 py-4">


                    <h2 className="text-lg font-bold mt-6 mb-2">Departments</h2>
                    <ul className="list-disc ml-6 text-gray-600">
                        {loading ? 'Loading' : booklet.bookletDepartments.map((round, i) => (
                            <li key={i}>{round.title}</li>
                        ))}
                    </ul>




                </div>
                <div className="relative col-span-2 px-6 py-4">

                    <h2 className="text-lg font-bold mb-3">Booklet pdf</h2>
                    <iframe src={loading ? '#' : booklet.pdfUrl}  frameBorder="0" width={'100%'} height={'600px'}></iframe>



                </div>

            </div>
        </div>
    );
}
