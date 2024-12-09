'use client'
import Activity from '@/components/dashboard/Activity'
import Drive from '@/components/dashboard/Drive'
import NewHeader from '@/components/dashboard/NewHeader'
import formDateFromString from '@/lib/formDateFromString'
import React, { useEffect, useState } from 'react'

export default function page() {
  const [drives, setdrives] = useState([])
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchdrives = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/activities`, {
        method: "GET",
        headers: {
          "Cache-Control": 'no-store',
          'Pragma': 'no-cache',
        },
      })
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json()

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
