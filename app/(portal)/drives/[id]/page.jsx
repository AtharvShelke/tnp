'use client';
import { getRequest } from '@/lib/apiRequest';
import formDateFromString from '@/lib/formDateFromString';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import EditDriveModal from './model/EditDriveModal';
import { useRouter } from 'next/navigation';



export default function DrivePage() {
  const params = useParams();
  const { id } = params;
  const [drive, setDrive] = useState(null);
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);
  const userId = session?.user?.id;

  const handleEdit = () => {
    setShowModal(true);
    
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const fetchAppl = async () => {
      const data = {
        userId: userId,
        driveId: id,
      };

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/drives/application/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok && result.message === 'Application already exists') {
          setApplied(true);
        } else {
          setApplied(false);
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    if (userId) fetchAppl();
  }, [userId, id]);

  useEffect(() => {
    const fetchDrives = async () => {
      // drives/${id}
      try {
        const data = await getRequest(`drives/${id}`)
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

    if (id) fetchDrives();
  }, [id]);

  const apply = async () => {
    if (!userId) {
      toast.error('User is not logged in or invalid session.');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/drives/application`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, driveId: id, status: 'Pending' }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Successfully applied for the drive');
        setApplied(true);
      } else {
        toast.error(`Error: ${data.error || 'An error occurred'}`);
      }
    } catch (error) {
      toast.error('Network error occurred. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center my-10">
       ...loading
      </div>
    );
  }

  const router = useRouter();

  const handleDelete = async (driveId) => {
    const confirmation = window.confirm("Are you sure you want to delete this drive?");
    if (!confirmation) return;
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/drives/application/${driveId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ driveId }),
      });
  
      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        // Redirect to the list of all drives after deletion
        router.push('/drives');
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error deleting drive:", error);
      alert("An error occurred while deleting the drive.");
    }
  };
  
  



  return (
    <div className="border max-w-screen-xl my-5 mx-5 rounded-xl shadow-lg bg-white">
      <div className="flex items-center justify-between py-5 px-6 border-b bg-gray-50">
        <div className="flex items-center gap-4">
          <img
            className="w-30 h-24 object-contain"
            src={drive?.imageUrl || '/logo.jpg'}
            alt="Drive"
          />
          <div className="font-medium">
            <div className="font-bold text-xl">{drive.title}</div>
            <div className="text-sm text-gray-600 flex gap-1 items-center">{drive.industryType}</div>
            <div className="text-sm text-gray-600 flex gap-1 items-center">{drive.referenceNumber}</div>
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-600 flex gap-1 items-center">
            <a onClick={()=> handleEdit()} className="px-3 font-medium text-blue-600  hover:underline cursor-pointer">Edit</a>
            <a onClick={() => handleDelete(drive.id)} className="px-3 mr-2 font-medium text-red-600  hover:underline cursor-pointer">Delete</a>
            {session?.user?.role === 'STUDENT' ? (
              <>
                <a
                  href={drive.link}
                  className="border border-gray-900 px-4 py-2 rounded-md text-gray-900 hover:bg-gray-900 hover:text-white transition-all"
                >
                  Application Link
                </a>
                {applied ? (
                  <button
                    disabled
                    className="border border-green-700 px-4 py-2 rounded-md bg-green-700 text-white"
                  >
                    Applied
                  </button>
                ) : (
                  <button
                    onClick={apply}
                    className="border border-gray-900 px-4 py-2 rounded-md text-gray-900 hover:bg-gray-900 hover:text-white"
                  >
                    Apply
                  </button>
                )}
              </>
            ) : (
              <a href={`${process.env.NEXT_PUBLIC_BASE_URL}/drives/${id}/application`} className="border border-gray-900 px-4 py-2 rounded-md text-gray-900 hover:bg-gray-900 hover:text-white">
                View Applied Student
              </a>
            )}
            
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className="col-span-1 border-r bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-bold mb-2">Job Location</h2>
          <p className="text-gray-600">{drive.location}</p>
          <h2 className="text-lg font-bold mt-6 mb-2">Job Role</h2>
          <p className="text-gray-600">{drive.role}</p>
          <h2 className="text-lg font-bold mt-6 mb-2">Job CTC</h2>
          <p className="text-gray-600">{drive.ctc}</p>
          <h2 className="text-lg font-bold mt-6 mb-2">Bond requirement</h2>
          <p className="text-gray-600">{drive.bond}</p>
          <h2 className="text-lg font-bold mt-6 mb-2">Departments</h2>
          <ul className="list-disc ml-6 text-gray-600">
              {drive?.driveDepartments?.length > 0 ? (
                drive.driveDepartments.map((department, i) => (
                  <li key={i}>{department.title}</li>
                ))
              ) : (
                <li>No departments available</li>
              )}
            </ul>

            <h2 className="text-lg font-bold mt-6 mb-2">Rounds</h2>
            <ul className="list-disc ml-6 text-gray-600">
              {drive?.rounds?.length > 0 ? (
                drive.rounds.map((round, i) => (
                  <li key={i}>{round.title}</li>
                ))
              ) : (
                <li>No rounds available</li>
              )}
            </ul>

        </div>
        <div className="relative col-span-2 px-6 py-4">
          <h2 className="text-lg font-bold mb-3">Drive Date</h2>
          <p className="text-gray-600">{drive.driveDate}</p>
          <h2 className="text-lg font-bold mb-3">Last Date</h2>
          <p className="text-gray-600">{drive.lastDriveDate}</p>
          <h2 className="text-lg font-bold my-3">About</h2>
          <p className="text-gray-600">{drive.about}</p>
          <h2 className="text-lg font-bold my-3">Job Description</h2>
          <p className="text-gray-600">{drive.description}</p>
          <h2 className="text-lg font-bold my-3">Job Eligibility</h2>
          <p className="text-gray-600">{drive.eligibility}</p>
        </div>
      </div>
      <EditDriveModal
        show={showModal}
        handleClose={handleCloseModal}
        drive={drive}
        setDrive={setDrive}
      />
    </div>
  );
}
