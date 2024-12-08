'use client'
import Drive from "@/components/dashboard/Drive";
import NewHeader from "@/components/dashboard/NewHeader";
import { useEffect, useState } from "react";

const formDateFromString = (string) => {
  const date = new Date(string);

  const formattedDate = date.toISOString().split('T')[0];

   return formattedDate;
} 


export default function DrivesPage() {
  const [drives, setdrives] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchdrives = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/drives`, {
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
      <NewHeader title={"Drives"} link={'/drives/new'} />
      <div className="px-16 grid grid-cols-4 gap-y-6">
        {drives.map((drive, i) => {
         
         
          const driveDate = formDateFromString(drive.driveDate) 
          const lastDriveDate = formDateFromString(drive.lastDriveDate) 

          return (<Drive key={i} title={drive.title} img={drive.img || '/tcs.png'} date={driveDate} last_date={lastDriveDate} />)
        }

        )}


      </div>
    </div>
  )
}
