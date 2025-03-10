'use client';
import { getRequest } from '@/lib/apiRequest';
import formDateFromString from '@/lib/formDateFromString';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import EditDriveModal from './model/EditDriveModal';
import Loader from '@/components/Loader';

export default function DrivePage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [drive, setDrive] = useState(null);
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);
  const userId = session?.user?.id;

  useEffect(() => {
    const fetchAppl = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/drives/application/${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, driveId: id }),
        });

        const result = await response.json();
        setApplied(response.ok && result.message === 'Application already exists');
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    fetchAppl();
  }, [userId, id]);

  useEffect(() => {
    const fetchDrives = async () => {
      try {
        const data = await getRequest(`drives/${id}`);
        setDrive({
          ...data,
          driveDate: formDateFromString(data.driveDate),
          lastDriveDate: formDateFromString(data.lastDriveDate),
        });
      } catch (error) {
        console.error('Error fetching drive:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrives();
  }, [id]);

  const apply = async () => {
    if (!userId) {
      toast.error('Please log in to apply.');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/drives/application`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, driveId: id, status: 'Pending' }),
      });

      if (response.ok) {
        toast.success('Successfully applied for the drive');
        setApplied(true);
      } else {
        const data = await response.json();
        toast.error(`Error: ${data.error || 'An error occurred'}`);
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    }
  };

  const handleDelete = async (driveId) => {
    if (!window.confirm("Are you sure you want to delete this drive?")) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/drives/application/${driveId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driveId }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        router.push('/drives');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("An error occurred while deleting the drive.");
    }
  };

  if (loading) {
    return (
      <Loader/>
    );
  }

  return (
    <div className="max-w-screen-lg mx-auto my-8 p-6 rounded-xl shadow-lg bg-white dark:bg-gray-900 dark:text-gray-200">
      <div className="flex flex-col md:flex-row items-center justify-between p-6 border-b bg-gray-100 dark:bg-gray-800 rounded-t-xl">
        <div className="flex items-center gap-4">
          <img
            className="w-24 h-24 object-cover rounded-lg shadow-md"
            src={drive?.imageUrl || '/logo.jpg'}
            alt="Drive"
          />
          <div>
            <h1 className="font-bold text-2xl">{drive?.title}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">{drive?.industryType}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{drive?.referenceNumber}</p>
          </div>
        </div>
        <div className="mt-4">
  {session?.user?.role === 'ADMIN' && (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <a
        href={`/drives/${id}/application`}
        className="w-full sm:w-auto text-center px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 transition"
      >
        View Applications
      </a>
      <button
        onClick={() => setShowModal(true)}
        className="w-full sm:w-auto text-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
      >
        Edit
      </button>
      <button
        onClick={() => handleDelete(drive.id)}
        className="w-full sm:w-auto text-center px-4 py-2 bg-rose-600 text-white font-semibold rounded-lg shadow-md hover:bg-rose-700 transition"
      >
        Delete
      </button>
    </div>
  )}

  {session?.user?.role === 'STUDENT' ? (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center mt-4">
      <a
        href={drive?.link}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full sm:w-auto text-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
      >
        Application Link
      </a>
      <button
        onClick={apply}
        disabled={applied}
        className={`w-full sm:w-auto text-center px-4 py-2 font-semibold rounded-lg shadow-md transition ${applied
          ? 'bg-green-600 text-white cursor-not-allowed'
          : 'bg-gray-800 text-white hover:bg-gray-900'
        }`}
      >
        {applied ? 'Applied' : 'Apply'}
      </button>
    </div>
  ) : session?.user?.role === 'RECRUITER' && session?.user?.id === drive.creatorId ? (
    <a
      href={`/drives/${id}/application`}
      className="w-full sm:w-auto text-center px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 transition mt-4"
    >
      View Applications
    </a>
  ) : null}
</div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-md shadow-md">
          <h2 className="text-lg font-semibold">Job Details</h2>
          <p><strong>Location:</strong> {drive?.location}</p>
          <p><strong>Role:</strong> {drive?.role}</p>
          <p><strong>CTC:</strong> {drive?.ctc}</p>
          <p><strong>Bond:</strong> {drive?.bond}</p>
          <h2 className="text-lg font-semibold mt-4">Departments</h2>
          <ul className="list-disc ml-6">
            {drive?.driveDepartments?.length ? drive.driveDepartments.map((d, i) => <li key={i}>{d.title}</li>) : <li>No departments available</li>}
          </ul>
        </div>

        <div className="col-span-2 p-6 bg-gray-50 dark:bg-gray-800 rounded-md shadow-md">
          <h2 className="text-lg font-semibold">Drive Information</h2>
          <p><strong>Drive Date:</strong> {drive?.driveDate}</p>
          <p><strong>Last Date:</strong> {drive?.lastDriveDate}</p>
          <h2 className="text-lg font-semibold mt-4">Description</h2>
          <p>{drive?.description}</p>
          <h2 className="text-lg font-semibold mt-4">Eligibility</h2>
          <p>{drive?.eligibility}</p>
        </div>
      </div>

      <EditDriveModal show={showModal} handleClose={() => setShowModal(false)} drive={drive} setDrive={setDrive} />
    </div>
  );
}
