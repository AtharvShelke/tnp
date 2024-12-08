import DashboardCard from "@/components/dashboard/DashboardCard";
import { User } from "lucide-react";
import Link from "next/link";


export default function Dashboard() {
  const dashboard = [
    {
      name: 'Students', number: 10, icon: <User />,
      href: '/students'
    },
    {
      name: 'Coordinator', number: 10, icon: <User />,
      href: '/coordinators'
    },
    {
      name: 'Drives', number: 10, icon: <User />,
      href: '/drives'
    },
    {
      name: 'Activities', number: 10, icon: <User />,
      href: '/activities'
    },
    {
      name: 'Booklets', number: 10, icon: <User />,
      href: '/booklets'
    },
    {
      name: 'Companies', number: 10, icon: <User />,
      href: '/dashboard'
    },
  ]
  return (
    <div>
      <div className="grid grid-cols-3 px-10 py-10 gap-10 border">
        <Link href={"/drives/new"}>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow flex items-center justify-center ">
            Create New Drive
          </div>
        </Link>
        <Link href={"/activities/new"}>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow flex items-center justify-center ">
            Create New Activity
          </div>
        </Link>
        <Link href={"/booklets/new"}>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow flex items-center justify-center ">
            Create New Booklet
          </div>
        </Link>
        <Link href={"/students/new"}>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow flex items-center justify-center ">
            Create New Student
          </div>
        </Link>
        <Link href={"/coordinators/new"}>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow flex items-center justify-center ">
            Create New Coordinator
          </div>
        </Link>
        <Link href={"/departments/new"}>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow flex items-center justify-center ">
            Create New Department
          </div>
        </Link>
      </div>
      <div className='border grid grid-cols-3 gap-5 px-10 py-5'>
        {dashboard.map((item, i) => (
          <DashboardCard key={i} name={item.name} number={item.number} icon={item.icon} href={item.href} />
        ))}
      </div>
      
    </div>
  )
}
