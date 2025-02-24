'use client';

import { Link, UserRoundX, ChevronDown } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (status === 'loading') {
    return <p className="text-gray-600">Loading User...</p>;
  }

  return (
    <header className="bg-white shadow-sm h-14 flex items-center justify-between px-6 border-b">
      {/* Title */}
      <h1 className="text-xl font-semibold text-gray-800">Training & Placement</h1>

      {/* User Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 border px-4 py-2 rounded-md text-gray-800 hover:bg-gray-100 transition"
        >
          {session?.user?.name || (
            <div className="w-20 h-5 bg-gray-300 rounded animate-pulse"></div>
          )}
          <ChevronDown className="w-5 h-5 text-gray-600" />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-md overflow-hidden border z-20 animate-fade-in">
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
            >
              <Link className="w-5 h-5" />
              ERP
            </a>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
            >
              <UserRoundX className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
