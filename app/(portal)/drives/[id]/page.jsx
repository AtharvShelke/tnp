'use client';
import { getRequest } from '@/lib/apiRequest';
import formDateFromString from '@/lib/formDateFromString';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import EditDriveModal from './model/EditDriveModal';
import Loader from '@/components/Loader';
import DeletionConfirmationModal from './model/DeletionConfirmationModal';
import Image from 'next/image';

export default function DrivePage() {
   const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [drive, setDrive] = useState(null);
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [eligibilityCheck, setEligibilityCheck] = useState({
    isEligible: false,
    message: '',
    departmentMatch: false,
    cgpaCheck: false,
    backlogCheck: false
  });
  const userId = session?.user?.id;

  const getDriveStatus = (driveDate, lastDriveDate) => {
    const today = new Date();
    const eventDate = new Date(driveDate);
    const lastEventDate = new Date(lastDriveDate);

    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    lastEventDate.setHours(0, 0, 0, 0);

    if (eventDate > today) return "upcoming";
    if (today > lastEventDate) return "closed";
    return "active";
  };

  // Check student eligibility (only for STUDENT role)
  const checkEligibility = async (driveData, userData) => {
    if (userData?.role !== 'STUDENT') {
      setEligibilityCheck({
        isEligible: false,
        message: '',
        departmentMatch: false,
        cgpaCheck: false,
        backlogCheck: false
      });
      return false;
    }

    try {
      // Fetch student profile
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/student/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch student profile');
      
      const studentProfile = await response.json();
      console.log("STUDENT PROFILE:  ", studentProfile)
      // Basic checks
      const departmentMatch = driveData.driveDepartments.some(dept => 
        studentProfile.department.title === dept.title
      );
      
      const cgpaCheck = studentProfile.cgpa >= (driveData.minCGPA || 0);
      const backlogCheck = parseInt(studentProfile.liveBack) <= (driveData.maxBacklogs || 0);
      
      const isEligible = departmentMatch && cgpaCheck && backlogCheck;
      
      let message = '';
      if (!departmentMatch) {
        message = 'Your department is not eligible for this drive';
      } else if (!cgpaCheck) {
        message = `Your CGPA (${studentProfile.cgpa}) is below the required minimum (${driveData.minCGPA || 0})`;
      } else if (!backlogCheck) {
        message = `Your backlog count (${studentProfile.backlogs}) exceeds the allowed maximum (${driveData.maxBacklogs || 0})`;
      } else {
        message = 'You meet all eligibility criteria';
      }
      
      setEligibilityCheck({
        isEligible,
        message,
        departmentMatch,
        cgpaCheck,
        backlogCheck
      });
      
      return isEligible;
    } catch (error) {
      console.error('Eligibility check failed:', error);
      setEligibilityCheck({
        isEligible: false,
        message: 'Unable to verify eligibility at this time',
        departmentMatch: false,
        cgpaCheck: false,
        backlogCheck: false
      });
      return false;
    }
  };

  useEffect(() => {
    const fetchApplicationStatus = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/drives/application/status?userId=${userId}&driveId=${id}`);
        if (response.ok) {
          const result = await response.json();
          setApplied(result.exists);
        }
      } catch (error) {
        console.error('Error fetching application status:', error);
      }
    };

    fetchApplicationStatus();
  }, [userId, id]);

  useEffect(() => {
    const fetchDriveDetails = async () => {
      try {
        const data = await getRequest(`drives/${id}`);
        const status = getDriveStatus(data.driveDate, data.lastDriveDate);
        const driveData = {
          ...data,
          driveDate: formDateFromString(data.driveDate),
          lastDriveDate: formDateFromString(data.lastDriveDate),
          status: status,
        };
        setDrive(driveData);
        
        // Check eligibility only if user is a student
        await checkEligibility(driveData, session?.user);
      } catch (error) {
        console.error('Error fetching drive:', error);
        toast.error('Failed to load drive details');
      } finally {
        setLoading(false);
      }
    };

    fetchDriveDetails();
  }, [id, session]);

  const handleApply = async () => {
    if (!userId) {
      toast.error('Please log in to apply.');
      return;
    }

    // Only check eligibility for STUDENT role
    if (session?.user?.role === 'STUDENT' && !eligibilityCheck.isEligible) {
      toast.error(eligibilityCheck.message || 'You are not eligible for this drive');
      return;
    }

    setApplying(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/drives/application`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, driveId: id }),
      });

      const result = await response.json();
      
      if (response.ok) {
        toast.success('Successfully applied for the drive');
        setApplied(true);
      } else {
        toast.error(result.error || 'Failed to apply for the drive');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setApplying(false);
    }
  };
  const handleDeleteDrive = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/drives/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        toast.success('Drive deleted successfully');
        router.push('/drives');
      } else {
        const result = await response.json();
        toast.error(result.error || 'Failed to delete drive');
      }
    } catch (error) {
      toast.error('An error occurred while deleting the drive');
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleDriveUpdate = (updatedDrive) => {
    setDrive({
      ...updatedDrive,
      driveDate: formDateFromString(updatedDrive.driveDate),
      lastDriveDate: formDateFromString(updatedDrive.lastDriveDate),
    });
    setShowEditModal(false);
  };

  if (loading) {
    return <Loader />;
  }

  if (!drive) {
    return <div className="text-center py-10">Drive not found</div>;
  }
  
  const renderStudentActions = () => {
    switch (drive.status) {
      case "active":
       return (
          <div className="flex flex-col gap-3">
            {drive?.link && (
              <a
                href={drive.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors text-center"
              >
                Application Link
              </a>
            )}
            
            {/* Only show eligibility message for STUDENT role */}
            {session?.user?.role === 'STUDENT' && eligibilityCheck.message && (
              <div className={`text-sm p-2 rounded-md ${
                eligibilityCheck.isEligible 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {eligibilityCheck.message}
              </div>
            )}
            
            <button
              onClick={handleApply}
              disabled={applied || applying || (session?.user?.role === 'STUDENT' && !eligibilityCheck.isEligible)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                applied
                  ? 'bg-green-600 text-white cursor-not-allowed'
                  : applying
                  ? 'bg-gray-600 text-white cursor-wait'
                  : session?.user?.role === 'STUDENT' && !eligibilityCheck.isEligible
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-gray-800 hover:bg-gray-900 text-white'
              }`}
            >
              {applying ? 'Applying...' : applied ? 'Applied' : 'Apply'}
            </button>
          </div>
        );
      case "upcoming":
        return (
          <button
            disabled
            className="px-4 py-2 text-sm font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-md cursor-not-allowed"
          >
            Upcoming Drive
          </button>
        );
      case "closed":
        return (
          <button
            disabled
            className="px-4 py-2 text-sm font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-md cursor-not-allowed"
          >
            Drive Closed
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-4 sm:p-6 rounded-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 shadow-sm">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between p-4 sm:p-6 bg-gray-50 dark:bg-gray-800 rounded-lg mb-6">
        <div className="flex items-start gap-4">
          <Image
            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
            src={drive?.imageUrl || '/logo.jpg'}
            alt="Drive"
            width={96}
            height={96}
            priority
          />
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">{drive?.title}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
              <span className="text-sm text-gray-600 dark:text-gray-300">{drive?.industryType}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{drive?.referenceNumber}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full md:w-auto mt-4 md:mt-0">
          {session?.user?.role === 'ADMIN' && (
            <div className="flex flex-wrap gap-2">
              <a
                href={`/drives/${id}/application`}
                className="px-4 py-2 text-sm font-medium bg-gray-700 hover:bg-gray-800 text-white rounded-md transition-colors"
              >
                View Applications
              </a>
              <button
                onClick={() => setShowEditModal(true)}  
                className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => setShowDeleteModal(true)} 
                className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          )}
          {session?.user?.role === 'COORDINATOR' && (
            <a
              href={`/drives/${id}/application`}
              className="block px-4 py-2 text-sm font-medium bg-gray-700 hover:bg-gray-800 text-white rounded-md transition-colors"
            >
              View Applications
            </a>
          )}
          {session?.user?.role === 'STUDENT' && renderStudentActions()}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Job Details Card */}
        <div className="p-4 sm:p-5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Job Details</h2>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Location</p>
              <p className="text-gray-900 dark:text-gray-200">{drive?.location || '-'}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Role</p>
              <p className="text-gray-900 dark:text-gray-200">{drive?.role || '-'}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">CTC</p>
              <p className="text-gray-900 dark:text-gray-200">{drive?.ctc || '-'}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Bond</p>
              <p className="text-gray-900 dark:text-gray-200">{drive?.bond || '-'}</p>
            </div>
            
            <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-700">
              <h3 className="text-md font-medium mb-2 text-gray-900 dark:text-white">Departments</h3>
              <ul className="space-y-1">
                {drive?.driveDepartments?.length ? 
                  drive.driveDepartments.map((d, i) => (
                    <li key={i} className="text-gray-700 dark:text-gray-300">{d.title}</li>
                  )) : 
                  <li className="text-gray-500 dark:text-gray-400">No departments available</li>
                }
              </ul>
            </div>
          </div>
        </div>

        {/* Drive Information Card */}
        <div className="md:col-span-2 p-4 sm:p-5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Drive Information</h2>
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Drive Date</p>
                <p className="text-gray-900 dark:text-gray-200">{drive?.driveDate || '-'}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Last Date</p>
                <p className="text-gray-900 dark:text-gray-200">{drive?.lastDriveDate || '-'}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-2 text-gray-900 dark:text-white">Description</h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {drive?.description || 'No description available'}
              </p>
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-2 text-gray-900 dark:text-white">Eligibility</h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {drive?.eligibility || 'No eligibility criteria specified'}
              </p>
              {drive?.minCGPA && (
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  <strong>Minimum CGPA:</strong> {drive.minCGPA}
                </p>
              )}
              {drive?.maxBacklogs && (
                <p className="mt-1 text-gray-700 dark:text-gray-300">
                  <strong>Maximum Backlogs Allowed:</strong> {drive.maxBacklogs}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditDriveModal 
        show={showEditModal} 
        handleClose={() => setShowEditModal(false)} 
        drive={drive} 
        onUpdate={handleDriveUpdate} 
      />

      <DeletionConfirmationModal
        show={showDeleteModal}
        onConfirm={handleDeleteDrive}
        onCancel={() => setShowDeleteModal(false)}
        itemName={drive.title}
      />
    </div>
  );
}