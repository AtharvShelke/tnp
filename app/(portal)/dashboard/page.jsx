"use client";

import { DashboardCard } from "@/components/dashboard/DashboardCard";
import Loader from "@/components/Loader";
import { getRequest } from "@/lib/apiRequest";
import { 
  User, 
  Briefcase, 
  FileText, 
  Users, 
  Building, 
  AlertTriangle, 
  PlusCircle, 
  FileSearch, 
  UserCog,
  Clock,
  Activity,
  BarChart2,
  CheckCircle,
  Mail
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const checkCoordinatorStatus = async (id) => {
  try {
    const response = await getRequest(`coordinator/${id}`);
    console.log(response);
    if (response.isCoordinator === false) {
      redirect('/coordinators/new');
    } 
  } catch (error) {
    console.error("Error checking coordinator status:", error);
    throw error;
  }
};

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const userId = session?.user?.id;
  const userRole = session?.user?.role;

  const [counts, setCounts] = useState({
    students: 0,
    drives: 0,
    recruiters: 0,
    coordinators: 0,
    activities: 0,
    booklets: 0,
    pendingApplications: 0,
    upcomingDrives: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recruiterStatus, setRecruiterStatus] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);

  if (userRole === "COORDINATOR") {
    checkCoordinatorStatus(userId);
  }


  const roleMessages = {
    ADMIN: "Manage all placements and system operations.",
    COORDINATOR: "Oversee recruitment activities and student interactions.",
    RECRUITER: "Manage hiring drives and student connections.",
    STUDENT: "Track your applications and upcoming opportunities.",
  };
  
  const roleColors = {
    ADMIN: "bg-gradient-to-r from-red-500 to-red-600",
    COORDINATOR: "bg-gradient-to-r from-teal-500 to-teal-600",
    RECRUITER: "bg-gradient-to-r from-blue-500 to-blue-600",
    STUDENT: "bg-gradient-to-r from-purple-500 to-purple-600",
  };

  const dashboardItems = [
    {
      name: "Students",
      number: counts.students,
      icon: <Users className="h-6 w-6" />,
      href: "/students",
      roles: ["ADMIN", "COORDINATOR", "RECRUITER"],
      gradient: "from-blue-500 to-blue-600",
    },
    {
      name: "Hiring Drives",
      number: counts.drives,
      icon: <Briefcase className="h-6 w-6" />,
      href: "/drives",
      roles: ["ADMIN", "COORDINATOR", "RECRUITER", "STUDENT"],
      gradient: "from-green-500 to-green-600",
    },
    // {
    //   name: "Upcoming Drives",
    //   number: counts.upcomingDrives,
    //   icon: <Clock className="h-6 w-6" />,
    //   href: "/drives?status=upcoming",
    //   roles: ["ADMIN", "COORDINATOR", "STUDENT"],
    //   gradient: "from-yellow-500 to-yellow-600",
    // },
    {
      name: "Recruiters",
      number: counts.recruiters,
      icon: <Building className="h-6 w-6" />,
      href: "/recruiters",
      roles: ["ADMIN", "COORDINATOR"],
      gradient: "from-orange-500 to-orange-600",
    },
    {
      name: "Coordinators",
      number: counts.coordinators,
      icon: <User className="h-6 w-6" />,
      href: "/coordinators",
      roles: ["ADMIN"],
      gradient: "from-purple-500 to-purple-600",
    },
    {
      name: "Activities",
      number: counts.activities,
      icon: <Activity className="h-6 w-6" />,
      href: "/activities",
      roles: ["ADMIN", "COORDINATOR"],
      gradient: "from-pink-500 to-pink-600",
    },
    {
      name: "Booklets",
      number: counts.booklets,
      icon: <FileText className="h-6 w-6" />,
      href: "/booklets",
      roles: ["ADMIN", "COORDINATOR", "STUDENT"],
      gradient: "from-indigo-500 to-indigo-600",
    },
    // {
    //   name: "Pending Applications",
    //   number: counts.pendingApplications,
    //   icon: <CheckCircle className="h-6 w-6" />,
    //   href: "/applications?status=pending",
    //   roles: ["ADMIN", "COORDINATOR"],
    //   gradient: "from-amber-500 to-amber-600",
    // },
  ];

  const quickActions = [
    {
      name: "Create Drive",
      icon: <PlusCircle className="h-5 w-5" />,
      href: "/drives/new",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      roles: ["ADMIN", "COORDINATOR"],
    },
    {
      name: "View Students",
      icon: <Users className="h-5 w-5" />,
      href: "/students",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      roles: ["ADMIN", "COORDINATOR", "RECRUITER"],
    },
    // {
    //   name: "View Reports",
    //   icon: <BarChart2 className="h-5 w-5" />,
    //   href: "/reports",
    //   bgColor: "bg-yellow-100",
    //   textColor: "text-yellow-600",
    //   roles: ["ADMIN", "COORDINATOR"],
    // },
    {
      name: "Edit Profile",
      icon: <UserCog className="h-5 w-5" />,
      href: "/profile",
      bgColor: "bg-gray-100",
      textColor: "text-gray-600",
      roles: ["ADMIN", "COORDINATOR", "RECRUITER", "STUDENT"],
    },
    // {
    //   name: "Check Mail",
    //   icon: <Mail className="h-5 w-5" />,
    //   href: "/messages",
    //   bgColor: "bg-red-100",
    //   textColor: "text-red-600",
    //   roles: ["ADMIN", "COORDINATOR", "RECRUITER", "STUDENT"],
    // },
    {
      name: "My Applications",
      icon: <FileSearch className="h-5 w-5" />,
      href: "/student/applications",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
      roles: ["STUDENT"],
    },
  ];

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const [
          countsData,
          activityData,
          recruiterData
        ] = await Promise.all([
          getRequest("count"),
          getRequest("activities/recent"),
          userRole === "RECRUITER" ? getRequest(`recruiter/${userId}`) : Promise.resolve(null)
        ]);

        setCounts({
          students: countsData.studentCount || 0,
          drives: countsData.driveCount || 0,
          recruiters: countsData.recruiterCount || 0,
          coordinators: countsData.coordinatorCount || 0,
          activities: countsData.activityCount || 0,
          booklets: countsData.bookletCount || 0,
          pendingApplications: countsData.pendingApplicationCount || 0,
          upcomingDrives: countsData.upcomingDriveCount || 0,
        });

        setRecentActivity(activityData?.slice(0, 5) || []);
        
        if (userRole === "RECRUITER") {
          setRecruiterStatus(recruiterData?.status ?? null);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userId, userRole]);

  if (loading) return <Loader />;
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6">
        <div className="max-w-md w-full p-6 bg-white rounded-xl shadow-md border border-red-200">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <h2 className="text-xl font-semibold text-red-600">Error Loading Dashboard</h2>
          </div>
          <p className="mt-3 text-gray-600">{error}</p>
          <div className="mt-4 flex space-x-3">
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Try Again
            </button>
            <Link 
              href="/"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (userRole === "RECRUITER" && recruiterStatus === "PENDING") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6">
        <div className="max-w-md w-full p-6 bg-white rounded-xl shadow-md border border-yellow-200">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
            <h2 className="text-xl font-semibold text-yellow-700">Account Pending Approval</h2>
          </div>
          <p className="mt-3 text-gray-600">
            Your account request has been sent to the <strong>Training and Placement Office</strong>. 
            You'll receive an email notification once your account is approved.
          </p>
          <div className="mt-4 pt-4 border-t border-yellow-100">
            <p className="text-sm text-yellow-600">
              For urgent inquiries, please contact the TPO office directly.
            </p>
          </div>
          <button
            onClick={() => signOut()}
            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className={`${roleColors[userRole] || "bg-gradient-to-r from-gray-500 to-gray-600"} rounded-2xl p-6 shadow-lg text-white mb-8`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Welcome back, {session?.user?.name}!
              </h1>
              <p className="mt-2 opacity-90 max-w-2xl">
                {roleMessages[userRole]}
                {userRole === "STUDENT" && (
                  <span className="block mt-2 text-sm">
                    You have {counts.pendingApplications} pending applications in your dashboard.
                  </span>
                )}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                <span className="text-sm font-medium">
                  {userRole?.[0] + userRole?.slice(1).toLowerCase()} Dashboard
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dashboardItems
              .filter((item) => item.roles.includes(userRole))
              .map((item, i) => (
                <DashboardCard 
                  key={i}
                  name={item.name}
                  number={item.number}
                  icon={item.icon}
                  href={item.href}
                  gradient={item.gradient}
                />
              ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions
                .filter((action) => action.roles.includes(userRole))
                .map((action, i) => (
                  <Link key={i} href={action.href} className={`${action.bgColor} p-4 rounded-xl hover:shadow-md transition-all cursor-pointer block`}>
                   
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${action.textColor}`}>
                          {action.icon}
                        </div>
                        <span className="font-medium text-gray-700">{action.name}</span>
                      </div>
                    
                  </Link>
                ))}
            </div>
          </div>

          {/* Recent Announcements */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Announcements</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="font-medium text-blue-800">Campus Recruitment Drive</h3>
                <p className="text-sm text-blue-600 mt-1">Google is visiting on June 15th</p>
                <p className="text-xs text-blue-400 mt-2">2 days ago</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <h3 className="font-medium text-green-800">Resume Workshop</h3>
                <p className="text-sm text-green-600 mt-1">Session on June 10th at 2PM</p>
                <p className="text-xs text-green-400 mt-2">1 week ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
            <Link href="/activities" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
             
                View All
             
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg flex items-start">
                  <div className="bg-white p-2 rounded-full mr-3 shadow-sm">
                    {activity.type === 'drive' ? (
                      <Briefcase className="h-4 w-4 text-blue-500" />
                    ) : activity.type === 'application' ? (
                      <FileText className="h-4 w-4 text-green-500" />
                    ) : (
                      <Activity className="h-4 w-4 text-purple-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800">{activity.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-600">No recent activity yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}