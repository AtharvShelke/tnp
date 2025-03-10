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
  BookPlus,
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
      setLinks([
        { name: "Dashboard", icon: <LayoutDashboard />, href: "/dashboard" },
        { name: "Profile", icon: <CircleUserRound />, href: "/profile" },
        { name: "Drives", icon: <CopyCheck />, href: "/drives" },
        { name: "My Posts", icon: <BookPlus />, href: "/posts" },
        { name: "Students", icon: <Users />, href: "/students" },
        { name: "Shortlisted Students", icon: <UserSearch />, href: `/shortlist/${session?.user?.id}` },
      ]);
    }
  }, [session]);

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="md:hidden p-2 text-white bg-gray-800 rounded-lg fixed top-1 left-1 z-50 shadow-lg hover:bg-gray-700 transition-all"
      >
        {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
      </button>

      <aside
        className={`fixed md:flex flex-col w-64 h-screen bg-gray-900 shadow-xl border-r border-gray-700 px-6 py-8 z-40 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex flex-col items-center mb-4">
          <img
            className="object-cover w-24 h-24 rounded-full border-4 border-gray-600 shadow-lg"
            src={session?.user?.pfp || "/logo.jpg"}
            alt="User Avatar"
          />
          <h4 className="mt-3 text-lg font-semibold text-white">{session?.user?.name}</h4>
          <p className="text-sm text-gray-400">{session?.user?.email}</p>
        </div>

        <nav className="flex gap-1 flex-col">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.href}
              className={`flex items-center px-3 py-[0.75rem] rounded-xl transition-all duration-300 text-gray-300 hover:bg-gray-800 hover:text-white ${
                path.includes(link.href) ? "bg-gray-800 text-white" : ""
              }`}
            >
              {link.icon}
              <span className="ml-4 font-medium">{link.name}</span>
            </a>
          ))}
        </nav>
      </aside>

      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
        ></div>
      )}
    </>
  );
}
