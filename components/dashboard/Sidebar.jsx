"use client";
import {
  CircleUserRound,
  CopyCheck,
  FileChartColumn,
  FileCheck2,
  Landmark,
  LayoutDashboard,
  LayoutList,
  Presentation,
  UserCog,
  Users,
  UserSearch,
  Menu,
  X,
  BookPlus,
  ChevronRight,
  UserRoundX
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const [links, setLinks] = useState([]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const adminLinks = [
      { name: "Dashboard", icon: <LayoutDashboard size={18} />, href: "/dashboard" },
      { name: "Profile", icon: <CircleUserRound size={18} />, href: "/profile" },
      { name: "Drives", icon: <CopyCheck size={18} />, href: "/drives" },
      { name: "Activities", icon: <Presentation size={18} />, href: "/activities" },
      { name: "Students", icon: <Users size={18} />, href: "/students" },
      { name: "Coordinators", icon: <UserCog size={18} />, href: "/coordinators" },
      { name: "Recruiters", icon: <UserSearch size={18} />, href: "/recruiter" },
      { name: "Booklets", icon: <FileChartColumn size={18} />, href: "/booklets" },
      { name: "Applications", icon: <LayoutList size={18} />, href: "/applications" },
      { name: "Departments", icon: <Landmark size={18} />, href: "/departments" },
    ];

    const coordinatorLinks = [
      { name: "Dashboard", icon: <LayoutDashboard size={18} />, href: "/dashboard" },
      { name: "Profile", icon: <CircleUserRound size={18} />, href: "/profile" },
      { name: "Drives", icon: <CopyCheck size={18} />, href: "/drives" },
      { name: "Activities", icon: <Presentation size={18} />, href: "/activities" },
      { name: "Students", icon: <Users size={18} />, href: "/students" },
      { name: "Approvals", icon: <FileCheck2 size={18} />, href: "/approvals" },
      { name: "Booklets", icon: <FileChartColumn size={18} />, href: "/booklets" },
      { name: "Applications", icon: <LayoutList size={18} />, href: "/applications" },
    ];

    const studentLinks = [
      { name: "Profile", icon: <CircleUserRound size={18} />, href: "/student/profile" },
      { name: "Drives", icon: <CopyCheck size={18} />, href: "/drives" },
      { name: "Activities", icon: <Presentation size={18} />, href: "/activities" },
      { name: "My Applications", icon: <LayoutDashboard size={18} />, href: "/student/applications" },
      { name: "Booklets", icon: <FileChartColumn size={18} />, href: "/booklets" },
    ];

    const recruiterLinks = [
      { name: "Dashboard", icon: <LayoutDashboard size={18} />, href: "/dashboard" },
      { name: "Profile", icon: <CircleUserRound size={18} />, href: "/profile" },
      { name: "Drives", icon: <CopyCheck size={18} />, href: "/drives" },
      { name: "My Posts", icon: <BookPlus size={18} />, href: "/posts" },
      { name: "Students", icon: <Users size={18} />, href: "/students" },
      { name: "Shortlisted", icon: <UserSearch size={18} />, href: `/shortlist/${session?.user?.id}` },
    ];

    setLinks(
      session?.user?.role === "ADMIN" ? adminLinks :
      session?.user?.role === "COORDINATOR" ? coordinatorLinks :
      session?.user?.role === "STUDENT" ? studentLinks :
      recruiterLinks
    );
  }, [session]);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-2 text-gray-700 bg-white rounded-lg fixed top-4 left-4 z-50 shadow-lg hover:bg-gray-100 transition-all"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative flex flex-col w-64 h-screen bg-white shadow-xl border-r border-gray-200 px-4 py-6 z-40 transform transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* User Profile */}
        <div className="flex flex-col items-center mb-8 px-2">
          <div className="relative mb-4">
            <img
              className="w-16 h-16 rounded-full border-2 border-white shadow-md"
              src={session?.user?.pfp || "/default-avatar.png"}
              alt="User Avatar"
              onError={(e) => {
                e.target.src = "/default-avatar.png";
              }}
            />
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <h4 className="text-lg font-semibold text-gray-800">{session?.user?.name}</h4>
          <p className="text-sm text-gray-500 truncate w-full text-center">{session?.user?.email}</p>
          <div className="mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            {session?.user?.role}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto">
          <div className="space-y-1">
            {links.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  path.includes(link.href) 
                    ? "bg-blue-50 text-blue-600 font-medium" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center">
                  <span className={`mr-3 ${
                    path.includes(link.href) ? "text-blue-500" : "text-gray-400"
                  }`}>
                    {link.icon}
                  </span>
                  <span>{link.name}</span>
                </div>
                {path.includes(link.href) && <ChevronRight size={16} className="text-blue-400" />}
              </Link>
            ))}
          </div>
        </nav>

      
        
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
        ></div>
      )}
    </>
  );
}