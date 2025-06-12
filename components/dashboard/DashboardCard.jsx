
import Link from 'next/link';
import React from 'react';

export const DashboardCard = ({ name, number, icon, href, gradient }) => {
  return (
    <Link href={href}>
        
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden">
        <div className={`h-2 bg-gradient-to-r ${gradient}`}></div>
        <div className="p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">{name}</p>
              <h3 className="text-2xl font-bold mt-1">{number}</h3>
            </div>
            <div className="p-3 rounded-lg bg-gray-50">
              {icon}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
