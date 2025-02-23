"use client";

import { useEffect, useState } from "react";
import { getRequest, updateRequest } from "@/lib/apiRequest";
import { FaCheck, FaTimes, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

const RecruiterManagement = () => {
    const [pendingRecruiters, setPendingRecruiters] = useState([]);
    const [approvedRecruiters, setApprovedRecruiters] = useState([]);

    useEffect(() => {
        const fetchRecruiterData = async () => {
            try {
                const response = await getRequest("recruiter");
                if (response.length > 0) {
                    const userPromises = response.map(async (res) => {
                        const user = await getRequest(`user/${res.userId}`);
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            company: res.company,
                            status: res.status,
                            pfp: user.pfp || "/logo.jpg",
                        };
                    });

                    const users = await Promise.all(userPromises);

                    setPendingRecruiters(users.filter((user) => user.status === "PENDING"));
                    setApprovedRecruiters(users.filter((user) => user.status === "APPROVED"));
                }
            } catch (error) {
                console.error("Error fetching recruiter data:", error);
            }
        };

        fetchRecruiterData();
    }, []);

    const handleApprove = async (recruiter) => {
        if (!recruiter || !recruiter.id) {
            toast.error("Invalid recruiter data");
            console.error("Invalid recruiter object:", recruiter);
            return;
        }
    
        console.log("Approving recruiter:", recruiter);
    
        try {
            const data = { status: "APPROVED" };
            const response = await updateRequest(`recruiter/approval/${recruiter.id}`, data);
    
            if (!response || response.error) {
                console.error("API Response Error:", response);
                throw new Error(response?.error || "Failed to approve recruiter");
            }
    
            toast.success(`Approved: ${recruiter.name}`);
        } catch (error) {
            console.error("Error approving recruiter:", error);
            toast.error("Approval failed. Please try again.");
        } finally {
            // Refresh the page to reflect changes
            window.location.reload();
        }
    };
    const handleReject = async(recruiter) => {
        if (!recruiter || !recruiter.id) {
            toast.error("Invalid recruiter data");
            console.error("Invalid recruiter object:", recruiter);
            return;
        }
    
        console.log("Approving recruiter:", recruiter);
    
        try {
            const data = { status: "REJECTED" };
            const response = await updateRequest(`recruiter/approval/${recruiter.id}`, data);
    
            if (!response || response.error) {
                console.error("API Response Error:", response);
                throw new Error(response?.error || "Failed to approve recruiter");
            }
    
            toast.success(`Approved: ${recruiter.name}`);
        } catch (error) {
            console.error("Error approving recruiter:", error);
            toast.error("Approval failed. Please try again.");
        } finally {
            // Refresh the page to reflect changes
            window.location.reload();
        }
    }
    const handleEdit = (recruiter) => {
        console.log("Edit:", recruiter);
    }
    const handleDelete = (recruiter) => {
        console.log("Delete:", recruiter);
    }
    const handleView = (recruiter) => {
        console.log("View:", recruiter);
    }

    const RecruiterTable = ({ title, recruiters, showStatus, isPending }) => (
        <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
            <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-md bg-white">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                        <tr>
                            <th className="px-6 py-3">Profile</th>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Company</th>
                            {showStatus && <th className="px-6 py-3">Status</th>}
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recruiters.length > 0 ? (
                            recruiters.map((recruiter, i) => (
                                <tr key={i} className="border-b odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition">
                                    <td className="px-6 py-4">
                                        <img src={recruiter.pfp} alt="Profile" className="w-10 h-10 rounded-full border" />
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{recruiter.name}</td>
                                    <td className="px-6 py-4">{recruiter.email}</td>
                                    <td className="px-6 py-4">{recruiter.company}</td>
                                    {showStatus && (
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 text-xs font-medium text-white bg-yellow-500 rounded-full">
                                                {recruiter.status}
                                            </span>
                                        </td>
                                    )}
                                    <td className="py-6 flex gap-3">
                                        {isPending ? (
                                            <>
                                                <button
                                                    onClick={() => handleApprove(recruiter)}
                                                    className="px-3 py-1 flex justify-center items-center gap-1 text-xs font-medium text-white bg-green-500 hover:bg-green-600 rounded transition"
                                                >
                                                    <FaCheck size={12} /> Approve
                                                </button>
                                                <button
                                                    onClick={() => handleReject(recruiter)}
                                                    className="px-3 py-1 flex justify-center items-center gap-1 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded transition"
                                                >
                                                    <FaTimes size={12} /> Reject
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => handleView(recruiter)}
                                                    className="text-blue-600 hover:underline flex items-center gap-1"
                                                >
                                                    <FaEye size={14} /> View
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(recruiter)}
                                                    className="text-yellow-600 hover:underline flex items-center gap-1"
                                                >
                                                    <FaEdit size={14} /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(recruiter)}
                                                    className="text-red-600 hover:underline flex items-center gap-1"
                                                >
                                                    <FaTrash size={14} /> Delete
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={showStatus ? 6 : 5} className="text-center py-4 text-gray-500">
                                    No {title.toLowerCase()} recruiters found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-5xl mx-auto">
                <RecruiterTable title="Pending Recruiters" recruiters={pendingRecruiters} showStatus={true} isPending={true} />
                <RecruiterTable title="Approved Recruiters" recruiters={approvedRecruiters} showStatus={false} isPending={false} />
            </div>
        </div>
    );
};

export default RecruiterManagement;
