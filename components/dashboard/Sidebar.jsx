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
} from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function Sidebar() {
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false); // State for toggling sidebar
  const { data: session, status } = useSession();
  const [links, setLinks] = useState([]); // State for storing sidebar links

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    // Set links based on user role
    if (session?.user?.role === "ADMIN") {
      setLinks([
        { name: "Dashboard", icon: <LayoutDashboard />, href: "/dashboard" },
        { name: "Profile", icon: <CircleUserRound />, href: "/profile" },
        { name: "Drives", icon: <CopyCheck />, href: "/drives" },
        { name: "Activities", icon: <Presentation />, href: "/activities" },
        { name: "Students", icon: <Users />, href: "/students" },
        { name: "Co-ordinators", icon: <UserCog />, href: "/coordinators" },
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
      setLinks([]); // Empty links for unrecognized roles
    }
  }, [session]);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-2 text-gray-200 bg-gray-800 rounded-lg fixed top-1 left-4 z-50"
      >
        {isOpen ? "Close" : "Menu"}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:flex flex-col w-64 h-screen bg-gray-900 border-r border-gray-700 px-4 py-8 z-40 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
      >
        <div className="flex flex-col items-center mt-2 -mx-2">
          <img
            className="object-cover w-24 h-24 mx-2 rounded-full"
            src={session?.user?.pfp || "/logo.jpg"}
            alt="avatar"
          />
          <h4 className="mx-2 mt-2 font-medium text-gray-200 dark:text-gray-200">
            {session?.user?.name}
          </h4>
          <p className="mx-2 mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">
            {session?.user?.email}
          </p>
        </div>

        <div className="flex flex-col justify-between flex-1 mt-2">
          <nav>
            {links.map((link, i) => (
              <a
                className={`text-base flex items-center px-4 py-2 mt-4 transition-colors duration-300 transform rounded-lg text-gray-400 hover:bg-gray-800 hover:text-gray-200 ${path.includes(link.href)
                    ? "bg-gray-800 text-gray-200"
                    : ""
                  }`}
                href={link.href}
                key={i}
              >
                {link.icon}
                <span className="mx-4 font-medium">{link.name}</span>
              </a>
            ))}
          </nav>
        </div>
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
