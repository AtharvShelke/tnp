'use client'
import EditActivityModal from '@/components/dashboard/EditActivityModal';
import { getRequest } from '@/lib/apiRequest';
import formDateFromString from '@/lib/formDateFromString';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function ActivityPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  useEffect(() => {
    const fetchActivity = async (id) => {
      try {
        const data = await getRequest(`activities/${id}`);
        setActivity(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load activity");
        toast.error("Failed to load activity");
      } finally {
        setLoading(false);
      }
    };
    fetchActivity(id);
  }, [id]);

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
  };

  const handleSaveChanges = async (updatedActivity) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/activities/${updatedActivity.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedActivity),
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to update activity');
      }
      
      const data = await response.json();
      setActivity(data);
      setEditModalOpen(false);
      toast.success("Activity updated successfully");
    } catch (error) {
      console.error("Error updating activity:", error);
      toast.error("Activity update failed");
    }
  };

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/activities/${id}`,
            {
                method: 'DELETE',
            }
        );
        
        console.log("Delete response:", response);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Delete error details:", errorData);
            throw new Error(errorData.message || 'Failed to delete activity');
        }
        
        toast.success("Activity deleted successfully");
        router.push("/activities");
    } catch (error) {
        console.error("Full delete error:", error);
        toast.error(error.message || "Activity deletion failed");
    } finally {
        setIsDeleting(false);
        setDeleteModalOpen(false);
    }
};

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !activity) {
    return <div className="p-6 text-red-500">{error || 'Activity not found'}</div>;
  }

  return (
    <div className="border max-w-screen-xl my-5 mx-5 rounded-xl shadow-lg bg-white">
      <div className="flex items-center justify-between py-5 px-6 border-b bg-gray-50">
        <div className="flex items-center gap-4">
          <img
            className="w-30 h-24 object-contain"
            src={activity?.imageUrl || '/logo.jpg'}
            alt="Activity"
          />
          <div className="font-medium">
            <div className="font-bold text-xl">
              {activity?.title || 'Untitled Activity'}
            </div>
            <div className="text-sm text-gray-600 flex gap-1 items-center">
              {activity?.date ? formDateFromString(activity.date) : 'No date specified'}
            </div>
            <div className="text-sm text-gray-600 flex gap-1 items-center">
              {activity?.referenceNumber || 'No reference number'}
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-600 flex gap-1 items-center">
          {userRole === "ADMIN" || userRole === "COORDINATOR" ? (
            <>
              <a
                onClick={handleEdit}
                className="px-3 font-medium text-blue-600 hover:underline cursor-pointer"
              >
                Edit
              </a>
              <a
                onClick={handleDeleteClick}
                className="px-3 mr-2 font-medium text-red-600 hover:underline cursor-pointer"
              >
                Delete
              </a></>
          ) : userRole === "STUDENT" ? (
            <>
              <a
                href={loading ? 'Loading' : activity.link}
                className="border border-gray-900 px-4 py-2 rounded-md text-gray-900 hover:bg-gray-900 hover:text-white transition-all"
              >
                Register
              </a>
              </>
          ) : (<></>)}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className="col-span-1 border-r bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-bold mt-6 mb-2">Departments</h2>
          <ul className="list-disc ml-6 text-gray-600">
            {loading
              ? 'Loading'
              : activity.activityDepartments.map((dept, i) => (
                <li key={i}>{dept.title}</li>
              ))}
          </ul>
        </div>
        <div className="relative col-span-2 px-6 py-4">
          <h2 className="text-lg font-bold mb-3">Activity Description</h2>
          <p className="text-gray-600">
            {loading ? 'Loading' : activity.description}
          </p>
        </div>
      </div>
      
      <EditActivityModal
        isOpen={editModalOpen}
        onClose={handleCloseModal}
        activity={activity}
        onSave={handleSaveChanges}
      />
      
      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6">Are you sure you want to delete this activity? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-300"
                disabled={isDeleting}
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