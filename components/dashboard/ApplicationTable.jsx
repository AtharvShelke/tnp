// components/dashboard/ApplicationTable.jsx
import React, { useState } from 'react';
import EditApplicationModal from './EditApplicationModal';
import { updateRequest, deleteRequest } from '@/lib/apiRequest';
import toast from 'react-hot-toast';

export default function ApplicationTable({ data, columns, onDataChange }) {
  const [showModal, setShowModal] = useState(false);
  const [currentApplication, setCurrentApplication] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (application) => {
    setCurrentApplication(application);
    setShowModal(true);
  };

  const handleUpdate = async (formData) => {
    try {
      await updateRequest('drives/application', formData);
      if (onDataChange) {
        onDataChange(); // Refresh data after update
      }
    } catch (error) {
      console.error('Failed to update application:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      setIsDeleting(true);
      try {
        // Pass the ID as a query parameter through your existing function
        await deleteRequest(`drives/application?id=${id}`);
        
        // If successful, refresh the data
        if (onDataChange) {
          onDataChange();
        }
      } catch (error) {
        // Error handling is done in the deleteRequest function
        console.error('Error in component delete handler:', error);
      } finally {
        setIsDeleting(false);
      }
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
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr className="odd:bg-white even:bg-gray-50 border-b" key={i}>
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {item.referenceNumber}
              </th>
              <td className="px-6 py-4">{item.title}</td>
              <td className="px-6 py-4">{item.prn}</td>
              <td className="px-6 py-4">{item.name}</td>
              <td className="px-6 py-4">{item.department}</td>
              <td className="px-6 py-4">{item.status}</td>
              <td className="px-6 py-4">{item.isplaced ? 'True' : 'False'}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleEdit(item)}
                  className="font-medium text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={isDeleting}
                  className="ml-5 font-medium text-red-600 hover:underline"
                >
                  Delete
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
    </div>
  );
}