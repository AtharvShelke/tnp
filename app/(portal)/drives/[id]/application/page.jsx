'use client';

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DataTable from '@/components/dashboard/StudentTable';
import ApplicationTable from "@/components/dashboard/ApplicationTable";
import ApplicantTable from "@/components/dashboard/ApplicantTable";
import { getRequest, putRequest, deleteRequest } from "@/lib/apiRequest";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

export default function DriveApplication() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const fetchDriveApplicants = async () => {
      try {
        const result = await getRequest(`drives/${id}/application`);
        console.log("Drive application Result: ", result)
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDriveApplicants();
  }, [id]);

  const handleStatusUpdate = async (userId, newStatus) => {
    try {
      await putRequest(`/application/${userId}`, { status: newStatus });
      setData(data.map(item => 
        item.userId === userId ? { ...item, status: newStatus } : item
      ));
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDeleteClick = (userId) => {
    setItemToDelete(userId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteRequest(`/application/${itemToDelete}`);
      setData(data.filter(item => item.userId !== itemToDelete));
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Failed to delete application:", err);
      setShowDeleteModal(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const columnNames = [ "PRN", "Name", "Email", "Phone","Department", "CGPA", "Expected Grad", "Status"];

  // ... rest of your loading/error/empty states remain the same ...

  return (
    <div className="max-w-6xl mt-10 mx-auto py-10 px-6 bg-white rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">All Applicants</h1>
      </div>
      <ApplicantTable 
        columns={columnNames} 
        data={data} 
        onStatusUpdate={handleStatusUpdate}
        onDeleteClick={handleDeleteClick}
      />
      
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Application"
        message="Are you sure you want to delete this application? This action cannot be undone."
      />
    </div>
  );
}