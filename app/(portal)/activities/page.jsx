'use client'
import Activity from '@/components/dashboard/Activity'
import Drive from '@/components/dashboard/Drive'
import NewHeader from '@/components/dashboard/NewHeader'
import { getRequest } from '@/lib/apiRequest'
import formDateFromString from '@/lib/formDateFromString'
import React, { useEffect, useState } from 'react'

export default function page() {
  const [drives, setdrives] = useState([])
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchdrives = async () => {
     
      const data = await getRequest(`activities`);
      setdrives(data);

    }
    fetchdrives();
    setLoading(false)
  }, []);

  return (
    <div>
      <NewHeader title={"Activities"} link={'/activities/new'} />
      <div className="px-16 grid grid-cols-4 gap-y-6">
        {drives.map((drive, i) => {
          const formattedDate = formDateFromString(drive.date)
          return (
            <Activity key={i} title={drive.title} img={drive.imageUrl || '/logo.jpg'} date={formattedDate} id={drive.id} />
          )
        })}
      </div>
    </div>
  )
}
