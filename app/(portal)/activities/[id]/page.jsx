'use client'
import EditActivityModal from '@/components/dashboard/EditActivityModal';
import { getRequest } from '@/lib/apiRequest';
import formDateFromString from '@/lib/formDateFromString';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function ActivityPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchActivity = async (id) => {
      try {
        const data = await getRequest(`activities/${id}`);
        setActivity(data);
      } catch (error) {
        console.error("Error fetching data:", error);
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

  // Sends updated activity data to the backend using a PUT request.
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
      if(response){
        window.location.reload();
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

  // Sends a DELETE request to the backend to remove the activity.
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this activity?")) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/activities/${activity.id}`,
        {
          method: 'DELETE',
        }
      );
      if (!response.ok) {
        throw new Error('Failed to delete activity');
      }
      await response.json();
      toast.success("Activity deleted successfully");
      router.push("/activities"); // Redirect to activities list after deletion.
    } catch (error) {
      console.error("Error deleting activity:", error);
      toast.error("Activity deletion failed");
    }
  };

  return (
    <div className="border max-w-screen-xl my-5 mx-5 rounded-xl shadow-lg bg-white">
      <div className="flex items-center justify-between py-5 px-6 border-b bg-gray-50">
        <div className="flex items-center gap-4">
          <img
            className="w-30 h-24 object-contain"
            src={loading ? '/logo.jpg' : activity.imageUrl || '/logo.jpg'}
            alt="Activity"
          />
          <div className="font-medium">
            <div className="font-bold text-xl">
              {loading ? 'Loading' : activity.title}
            </div>
            <div className="text-sm text-gray-600 flex gap-1 items-center">
              {loading ? 'Loading' : formDateFromString(activity.date)}
            </div>
            <div className="text-sm text-gray-600 flex gap-1 items-center">
              {loading ? 'Loading' : activity.referenceNumber}
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-600 flex gap-1 items-center">
          <a 
            onClick={handleEdit} 
            className="px-3 font-medium text-blue-600 hover:underline cursor-pointer"
          >
            Edit
          </a>
          <a 
            onClick={handleDelete} 
            className="px-3 mr-2 font-medium text-red-600 hover:underline cursor-pointer"
          >
            Delete
          </a>
          <a
            href={loading ? 'Loading' : activity.link}
            className="border border-gray-900 px-4 py-2 rounded-md text-gray-900 hover:bg-gray-900 hover:text-white transition-all"
          >
            Apply
          </a>
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
    </div>
  );
}
