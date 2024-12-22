'use client'
import Drive from "@/components/dashboard/Drive";
import NewHeader from "@/components/dashboard/NewHeader";
import { getRequest } from "@/lib/apiRequest";
import formDateFromString from "@/lib/formDateFromString";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";




export default function DrivesPage() {

  const [drives, setdrives] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const {data:session, status} = useSession();
const router = useRouter()
  useEffect(() => {
    const fetchdrives = async () => {
      // drives
      const data = await getRequest(`drives`)

      setdrives(data);

    }
    fetchdrives();
    setLoading(false)
  }, []);

if (session?.user?.role === 'USER') {
  router.push('/profileCheck')
}
  return (
    <div>
      <NewHeader title={"Drives"} link={'/drives/new'} />
      <div className="px-16 grid grid-cols-4 gap-y-6">
        {drives.map((drive, i) => {


          const driveDate = formDateFromString(drive.driveDate)
          const lastDriveDate = formDateFromString(drive.lastDriveDate)

          return (
            <Drive key={i} id={drive.id} title={drive.title} img={drive.imageUrl || '/logo.jpg'} date={driveDate} last_date={lastDriveDate} />
          )
        }

        )}


      </div>
    </div>
  )
}
