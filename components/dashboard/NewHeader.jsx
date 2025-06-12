import { Plus } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React from 'react'

export default function NewHeader({ title, link }) {
  const { data: session, status } = useSession();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-500">Browse and manage campus recruitment drives</p>
      </div>
      {status === 'authenticated' && session?.user?.role !== 'STUDENT' ? (
        <a
          href={link}
          className="flex gap-2 items-center px-4 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Create New Drive
        </a>
      ) : null}
    </div>
  );
}