'use client'

import { Link, UserRoundX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';


export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  
  
  const router = useRouter()
  
  
  
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };


  return (
    <div className="bg-gray-100 h-12 flex items-center justify-between pl-20 border-b border-slate-200">
      <div className="flex justify-center gap-5 w-5/6">
        <h1 className="font-semibold text-2xl">Training and Placement  </h1>
      </div>
      <div className="flex">
        {/* plus */}
        <div className="flex flex-row">
          <div className="relative inline-block text-left">
            {/* Dropdown button */}
            <button
              onClick={toggleDropdown}
              className="flex items-center justify-between w-full py-2 px-3 border-l border-gray-300 text-gray-700 rounded hover:bg-gray-100 "
            >
              John
              
              <svg
                className="w-4 h-4 ml-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown menu */}
            {isOpen && (
              <div className="absolute right-0 z-10 mt-2 w-40 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ">
                
                  
                <div className="py-1">
                <a href='#'
                    
                    className="flex items-center gap-5 px-4 py-2 w-full text-sm text-gray-700 hover:bg-gray-100 "
                  >
                    <Link className='h-5 w-5'/>
                    ERP
                  </a>
                <button
                    
                    className="flex items-center gap-5 px-4 py-2 w-full text-sm text-gray-700 hover:bg-gray-100 "
                  >
                    <UserRoundX className='h-5 w-5'/>
                    Sign out
                  </button>
                </div>
                
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
      
  );
}
