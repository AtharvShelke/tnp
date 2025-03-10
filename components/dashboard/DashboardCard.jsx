import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function DashboardCard({ name, number, href }) {
    return (
        <div className="transition-all duration-300 transform hover:scale-105">
            <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl">
                <h5 className="mb-2 text-2xl font-bold text-gray-900">{name}</h5>
                <p className="mb-3 text-lg text-gray-500">{number}</p>
                <Link href={href} className="inline-flex items-center text-blue-600 font-medium hover:underline gap-2">
                    See More <ExternalLink className="h-5 w-5" />
                </Link>
            </div>
        </div>
    );
}
