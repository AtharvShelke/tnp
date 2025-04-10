"use client";

import DashboardCard from "@/components/dashboard/DashboardCard";
import Loader from "@/components/Loader";
import { getRequest } from "@/lib/apiRequest";
import {
  User,
  Briefcase,
  FileText,
  Users,
  Building,
  AlertTriangle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recruiterStatus, setRecruiterStatus] = useState(null);

  const roleMessages = {
    ADMIN: "Manage all placements and system operations.",
    COORDINATOR: "Oversee recruitment activities and student interactions.",
    RECRUITER: "Manage hiring drives and student connections.",
  };

  const roleColors = {
    ADMIN: "bg-red-500",
    COORDINATOR: "bg-teal-500",
    RECRUITER: "bg-blue-500",
  };

  const dashboardItems = [
    {
      name: "Students",
      number: counts.students,
      icon: <Users className="text-blue-500" />,
      href: "/students",
      roles: ["ADMIN", "COORDINATOR", "RECRUITER"],
    },
    {
      name: "Hiring Drives",
      number: counts.drives,
      icon: <Briefcase className="text-green-500" />,
      href: "/drives",
      roles: ["ADMIN", "COORDINATOR", "RECRUITER"],
    },
    {
      name: "Recruiters",
      number: counts.recruiters,
      icon: <Building className="text-orange-500" />,
      href: "/recruiters",
      roles: ["ADMIN", "COORDINATOR"],
    },
    {
      name: "Coordinators",
      number: counts.coordinators,
      icon: <User className="text-purple-500" />,
      href: "/coordinators",
      roles: ["ADMIN"],
    },
    {
      name: "Activities",
      number: counts.activities,
      icon: <FileText className="text-pink-500" />,
      href: "/activities",
      roles: ["ADMIN", "COORDINATOR"],
    },
    {
      name: "Booklets",
      number: counts.booklets,
      icon: <FileText className="text-indigo-500" />,
      href: "/booklets",
      roles: ["ADMIN", "COORDINATOR"],
    },
  ];

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const {
          studentCount,
          driveCount,
          recruiterCount,
          coordinatorCount,
          activityCount,
          bookletCount,
        } = await getRequest("count");

        setCounts({
          students: studentCount,
          drives: driveCount,
          recruiters: recruiterCount,
          coordinators: coordinatorCount,
          activities: activityCount,
          booklets: bookletCount,
        });

        if (userRole === "RECRUITER") {
          const recruiterData = await getRequest(`recruiter/${userId}`);
          setRecruiterStatus(recruiterData?.status ?? null);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userId, userRole]);

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-red-100 border border-red-400 text-red-800 rounded-lg shadow-md">
        <AlertTriangle className="h-8 w-8" />
        <p className="mt-2 font-semibold">{error}</p>
      </div>
    );

  if (userRole === "RECRUITER" && recruiterStatus === "PENDING") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50 rounded-lg shadow-md border border-gray-300">
        <div className="p-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-md w-full max-w-md">
          <h2 className="text-xl font-semibold">Account Request Pending</h2>
          <p className="mt-2 text-sm">
            Your account request has been sent to the{" "}
            <strong>Training and Placement Office</strong>. Please wait for
            approval.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* 🎉 Welcome Banner */}
        <div
          className={`p-6 text-white rounded-xl shadow-md text-center mb-8 ${
            roleColors[userRole] || "bg-gray-400"
          }`}
        >
          <h2 className="text-3xl font-semibold">
            Welcome, {userRole?.[0] + userRole?.slice(1).toLowerCase()}!
          </h2>
          <p className="mt-2 text-lg">{roleMessages[userRole]}</p>
        </div>

        {/* 📊 Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardItems
            .filter((item) => item.roles.includes(userRole))
            .map((item, i) => (
              <DashboardCard key={i} {...item} />
            ))}
        </div>

        {/* ⚡ Quick Actions */}
        <div className="mt-10 p-6 bg-white rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link href="/drives/new">
              <div className="p-4 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition text-center font-semibold">
                + Create Drive
              </div>
            </Link>
            <Link href="/students">
              <div className="p-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition text-center font-semibold">
                View Students
              </div>
            </Link>
            <Link href="/reports">
              <div className="p-4 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition text-center font-semibold">
                View Reports
              </div>
            </Link>
            <Link href="/profile">
              <div className="p-4 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-800 transition text-center font-semibold">
                Edit Profile
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
