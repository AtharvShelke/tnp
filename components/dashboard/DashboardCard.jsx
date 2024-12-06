import { ExternalLink } from 'lucide-react'
import React from 'react'

export default function DashboardCard(props) {
    return (
        <div >


            <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow">
                
                
                    <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 ">{props.name}</h5>
                
                <p className="mb-3 font-normal text-gray-500 ">{props.number}</p>
                <a href={props.href} className="inline-flex font-medium items-center text-blue-600 hover:underline">
                    See More
                    <ExternalLink />
                </a>
            </div>

            
        </div>
    )
}
