'use client';
import Loader from '@/components/Loader';
import { getRequest } from '@/lib/apiRequest';
import { Mail, Phone, University, UserRoundPen, Edit, GraduationCap, Briefcase, Calendar, Shield, Globe, BookOpen } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import EditCoordinatorModal from './EditCoordinatorModal';


export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const userId = session?.user?.id;
  const [coordinatorData, setCoordinatorData] = useState(null);
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();
 const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'STUDENT') {
      router.push('/student/profile');
      return;
    }

    if (userId && session?.user?.role === "COORDINATOR") {
      const fetchCoordinatorDetails = async () => {
        try {
          const response = await getRequest(`coordinator/${userId}`);

          if (response?.data?.coordinator) {
            setCoordinatorData(response.data.coordinator);
            setDepartment(response.data.dept);
          } else {
            throw new Error('Invalid response structure');
          }
        } catch (error) {
          toast.error('Failed to fetch user details');
        } finally {
          setLoading(false);
        }
      };

      fetchCoordinatorDetails();
    } else {
      setLoading(false);
    }
  }, [userId, session?.user?.role, status, router]);
 const handleUpdate = async (updatedCoordinatorData, updatedName, updatedEmail) => {
    setCoordinatorData(updatedCoordinatorData);
    
    // Update the session data
    await update({
      ...session.user,
      name: updatedName,
      email: updatedEmail
    });
   
  };
  if (status === 'loading' || loading) {
    return <Loader />;
  }

  if (status !== 'authenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <EditCoordinatorModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          coordinatorData={coordinatorData}
          department={department}
          onUpdate={handleUpdate}
        />
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="md:flex">
            <div className="md:flex-shrink-0 md:w-48 bg-gradient-to-b from-blue-600 to-blue-800 flex items-center justify-center p-4">
              <img
                className="h-40 w-40 rounded-full border-4 border-white object-cover shadow-lg bg-white"
                src={session?.user?.pfp || '/default-avatar.svg'}
                alt="Profile"
              />
            </div>
            <div className="p-8 flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{session?.user?.name}</h1>
                  <div className="flex items-center mt-1">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {session?.user?.role}
                    </span>
                    {department && (
                      <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {department}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Edit className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-gray-700">{session?.user?.email}</span>
                </div>
                {coordinatorData?.phone && (
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-gray-700">{coordinatorData.phone}</span>
                  </div>
                )}
                {department && (
                  <div className="flex items-center">
                    <University className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-gray-700">{department} Department</span>
                  </div>
                )}
                {coordinatorData?.designation && (
                  <div className="flex items-center">
                    <Briefcase className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-gray-700">{coordinatorData.designation}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('activities')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'activities' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Activities
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'settings' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Settings
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <GraduationCap className="w-5 h-5 text-blue-600 mr-2" />
                      <h3 className="font-medium text-gray-800">Training Programs</h3>
                    </div>
                    <p className="text-gray-600">View and manage upcoming training programs for students.</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Briefcase className="w-5 h-5 text-green-600 mr-2" />
                      <h3 className="font-medium text-gray-800">Placement Statistics</h3>
                    </div>
                    <p className="text-gray-600">Track placement records and company interactions.</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Calendar className="w-5 h-5 text-purple-600 mr-2" />
                      <h3 className="font-medium text-gray-800">Upcoming Events</h3>
                    </div>
                    <p className="text-gray-600">Manage campus recruitment drives and workshops.</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Shield className="w-5 h-5 text-yellow-600 mr-2" />
                      <h3 className="font-medium text-gray-800">Department Resources</h3>
                    </div>
                    <p className="text-gray-600">Access department-specific training materials.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activities' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Conducted soft skills workshop</p>
                      <p className="text-sm text-gray-500">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-green-100 p-2 rounded-full">
                      <Globe className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Scheduled campus recruitment with TechCorp</p>
                      <p className="text-sm text-gray-500">1 week ago</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Settings</h2>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Profile Information</h3>
                    <p className="text-sm text-gray-600 mb-3">Update your personal details and contact information.</p>
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                      Edit Profile
                    </button>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Security</h3>
                    <p className="text-sm text-gray-600 mb-3">Change your password and manage security settings.</p>
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

