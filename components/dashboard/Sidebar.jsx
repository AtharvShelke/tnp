"use client";
import {
  CircleUserRound,
  CopyCheck,
  FileChartColumn,
  FileCheck2,
  GraduationCap,
  Landmark,
  LayoutDashboard,
  LayoutList,
  Presentation,
  UserCog,
  Users,
  UserSearch,
  Menu,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function Sidebar() {
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const [links, setLinks] = useState([]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (session?.user?.role === "ADMIN") {
      setLinks([
        { name: "Dashboard", icon: <LayoutDashboard />, href: "/dashboard" },
        { name: "Profile", icon: <CircleUserRound />, href: "/profile" },
        { name: "Drives", icon: <CopyCheck />, href: "/drives" },
        { name: "Activities", icon: <Presentation />, href: "/activities" },
        { name: "Students", icon: <Users />, href: "/students" },
        { name: "Coordinators", icon: <UserCog />, href: "/coordinators" },
        { name: "Recruiters", icon: <UserSearch />, href: "/recruiter" },
        { name: "Booklets", icon: <FileChartColumn />, href: "/booklets" },
        { name: "Applications", icon: <LayoutList />, href: "/applications" },
        { name: "Departments", icon: <Landmark />, href: "/departments" },
      ]);
    } else if (session?.user?.role === "COORDINATOR") {
      setLinks([
        { name: "Dashboard", icon: <LayoutDashboard />, href: "/dashboard" },
        { name: "Profile", icon: <CircleUserRound />, href: "/profile" },
        { name: "Drives", icon: <CopyCheck />, href: "/drives" },
        { name: "Activities", icon: <Presentation />, href: "/activities" },
        { name: "Students", icon: <Users />, href: "/students" },
        { name: "Approvals", icon: <FileCheck2 />, href: "/approvals" },
        { name: "Booklets", icon: <FileChartColumn />, href: "/booklets" },
        { name: "Applications", icon: <LayoutList />, href: "/applications" },
      ]);
    } else if (session?.user?.role === "STUDENT") {
      setLinks([
        { name: "Profile", icon: <CircleUserRound />, href: "/student/profile" },
        { name: "Drives", icon: <CopyCheck />, href: "/drives" },
        { name: "Activities", icon: <Presentation />, href: "/activities" },
        { name: "My Applications", icon: <LayoutDashboard />, href: "/student/applications" },
        { name: "Booklets", icon: <FileChartColumn />, href: "/booklets" },
      ]);
    } else {
      setLinks([]);
    }
  }, [session]);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-2 text-gray-200 bg-gray-800 rounded-lg fixed top-3 left-4 z-50 shadow-lg hover:bg-gray-700 transition"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:flex flex-col w-64 h-screen bg-gray-900 shadow-xl border-r border-gray-700 px-5 py-6 z-40 transform transition-all duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* User Profile Section */}
        <div className="flex flex-col items-center mb-6">
          <img
            className="object-cover w-20 h-20 rounded-full border-2 border-gray-600"
            src={session?.user?.pfp || "/logo.jpg"}
            alt="avatar"
          />
          <h4 className="mt-2 font-semibold text-gray-200">{session?.user?.name}</h4>
          <p className="text-sm text-gray-400">{session?.user?.email}</p>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.href}
              className={`flex items-center p-3 rounded-lg transition-all duration-300 text-gray-400 hover:bg-gray-800 hover:text-gray-200 ${
                path.includes(link.href) ? "bg-gray-800 text-gray-200" : ""
              }`}
            >
              {link.icon}
              <span className="ml-4 font-medium">{link.name}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* Overlay for small screens */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
        ></div>
      )}
    </>
  );
}
