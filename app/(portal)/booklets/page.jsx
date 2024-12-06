import Drive from '@/components/dashboard/Drive'
import NewHeader from '@/components/dashboard/NewHeader'
import { Plus } from 'lucide-react'
import React from 'react'

export default function BookletsPage() {
  const drives = [
    { title: 'TCS Drive 2025', img: '/tcs.png', date: "Oct. 16, 2024", last_date: "Oct. 30, 2024" },
    { title: 'Wipro Drive 2025', img: '/tcs.png', date: "Oct. 16, 2024", last_date: "Oct. 30, 2024" },
    { title: 'Infosys Drive 2025', img: '/tcs.png', date: "Oct. 16, 2024", last_date: "Oct. 30, 2024" },
    { title: 'Tech Mahindra Drive 2025', img: '/tcs.png', date: "Oct. 16, 2024", last_date: "Oct. 30, 2024" },
    { title: 'Accenture Drive 2025', img: '/tcs.png', date: "Oct. 16, 2024", last_date: "Oct. 30, 2024" },
  ]
  return (
    <div>
      <NewHeader title={"Booklet"} link={'/booklets/new'}/>
      <div className="px-16 grid grid-cols-2 gap-y-6 sm:grid-cols-4">
        {drives.map((drive, i) => (
          <Drive key={i} title={drive.title} img={drive.img} date={drive.date} last_date={drive.last_date} />
        ))}
      </div>
    </div>
  )
}