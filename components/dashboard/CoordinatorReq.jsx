'use client';
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";

export default function CoordinatorReq({ columns, data }) {
    const router = useRouter();
    const [loadingId, setLoadingId] = useState(null); // Track which row is loading

    // Function to handle API requests for approval/rejection
    const updateStatus = async (id, status) => {
        if (!confirm(`Are you sure you want to ${status.toLowerCase()} this request?`)) return;

        setLoadingId(id); // Set loading state
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/coordinatorApproval/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });

            if (response.ok) {
                toast.success(`Coordinator ${status.toLowerCase()} successfully`);
                router.refresh(); // Refresh the data
            } else {
                const responseData = await response.json();
                handleError(response.status, responseData);
            }
        } catch (error) {
            console.error("API Error:", error);
            toast.error("Oops! Something went wrong.");
        } finally {
            setLoadingId(null); // Reset loading state
        }
    };

    // Handle API response errors
    const handleError = (status, responseData) => {
        if (status === 409) {
            toast.error("User with this Email already exists");
        } else {
            console.error("Server Error:", responseData.message || "No message provided");
            toast.error("Oops! Something went wrong.");
        }
    };

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        {columns.map((column, i) => (
                            <th scope="col" key={i} className="px-6 py-3">
                                {column}
                            </th>
                        ))}
                        <th scope="col" className="px-6 py-3">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id} className="odd:bg-white even:bg-gray-50 border-b">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.id}</td>
                            <td className="px-6 py-4">{item.name}</td>
                            <td className="px-6 py-4">{item.email}</td>
                            <td className="px-6 py-4">{item.status}</td>
                            <td className="px-6 py-4">
                                {item.status === 'APPROVED' ? (
                                    <button className="text-blue-600 hover:underline">Approved</button>
                                ) : (item.status === 'REJECTED') ? ( <button className="text-red-600 hover:underline">Rejected</button>) : (
                                    <>
                                        <button
                                            onClick={() => updateStatus(item.id, "APPROVED")}
                                            className="text-blue-600 hover:underline"
                                            disabled={loadingId === item.id}
                                        >
                                            {loadingId === item.id ? "Approving..." : "Accept"}
                                        </button>
                                        <button
                                            onClick={() => updateStatus(item.id, "REJECTED")}
                                            className="ml-5 text-red-600 hover:underline"
                                            disabled={loadingId === item.id}
                                        >
                                            {loadingId === item.id ? "Rejecting..." : "Reject"}
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
