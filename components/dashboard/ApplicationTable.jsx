import React, { useState } from 'react';
import EditApplicationModal from './EditApplicationModal';
import { updateRequest, deleteRequest } from '@/lib/apiRequest';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function ApplicationTable({ data, columns, onDataChange }) {
  const [showModal, setShowModal] = useState(false);
  const [currentApplication, setCurrentApplication] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);
 
  const handleEdit = (application) => {
    console.log("edit application: ",JSON.stringify(application))
    setCurrentApplication(application);
    setShowModal(true);
  };

  const handleUpdate = async (formData) => {
    try {
      const response = await updateRequest('drives/application', formData);
      toast.success('Application updated successfully');
      setShowModal(false);
      if (onDataChange) {
        onDataChange();
      }
      return response;
    } catch (error) {
      console.error('Failed to update application:', error);
      toast.error(error.message || 'Failed to update application');
      throw error;
    }
  };

  const handleDeleteClick = (id) => {
    setApplicationToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setApplicationToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!applicationToDelete) return;

    setIsDeleting(true);
    try {
      await deleteRequest(`drives/application?id=${applicationToDelete}`);
      toast.success('Application deleted successfully');
      if (onDataChange) {
        onDataChange();
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      toast.error(error.message || 'Failed to delete application');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setApplicationToDelete(null);
    }
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            {columns.map((column, i) => (
              <th scope="col" key={i} className="px-6 py-3">
                {column}
              </th>
            ))}
            <th scope="col" className="px-6 py-3 text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr className="bg-white border-b hover:bg-gray-50" key={item.id}>
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {item.drive.referenceNumber}
              </th>
              <td className="px-6 py-4">{item.drive.title}</td>
              <td className="px-6 py-4">{item.user.Student?.[0]?.PRN || 'N/A'}</td>
              <td className="px-6 py-4">{item.user.name}</td>
              <td className="px-6 py-4">{item.user.Student?.[0]?.department?.title || 'N/A'}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs ${item.status === 'approved' ? 'bg-green-100 text-green-800' :
                    item.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                  }`}>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4">
                {item.user.Student?.[0]?.placed ? (
                  <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">Placed</span>
                ) : (
                  <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs">Not Placed</span>
                )}
              </td>
              <td className="px-6 py-4 flex justify-end gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                  title="Edit"
                >
                  <FiEdit2 />
                </button>
                <button
                  onClick={() => handleDeleteClick(item.id)}
                  disabled={isDeleting}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                  title="Delete"
                >
                  <FiTrash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

      {showModal && currentApplication && (
        <EditApplicationModal
          application={currentApplication}
          onClose={() => setShowModal(false)}
          onUpdate={handleUpdate}
        />
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this application? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-400"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}