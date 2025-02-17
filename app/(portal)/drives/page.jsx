'use client'
import Drive from "@/components/dashboard/Drive";
import NewHeader from "@/components/dashboard/NewHeader";
import { getRequest } from "@/lib/apiRequest";
import formDateFromString from "@/lib/formDateFromString";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DrivesPage() {
  const [allDrives, setAllDrives] = useState([]);
  const [drive, setDrive] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [department, setDepartment] = useState(null)
  const { data: session, status } = useSession()
  const router = useRouter();
  
  useEffect(() => {
    if (session?.user?.role === "USER") {
      router.push("/profileCheck");
    }

    const fetchUserRoleData = async () => {
      if (session?.user?.role === "COORDINATOR") {
        const coordinator = await getRequest(`coordinator/${session.user.id}`);
        
        console.log(coordinator.departmentId);
      }
      if (session?.user?.role === "STUDENT") {
        const student = await getRequest(`student/${session.user.id}`);
        // console.log("student: ", student.departmentId)
        setDepartment(student.departmentId);
        

      }
    };

    if (session?.user?.role === "COORDINATOR" || session?.user?.role === "STUDENT") {
      fetchUserRoleData();
    }
  }, [session, router]);

  useEffect(() => {
    console.log("student department: ", department)
    if (department) {
      const fetchDrives = async () => {
      
        try {
          const data = await getRequest("drives");
          data.map((drive)=>{
            
            const ddp = drive.driveDepartments;
            ddp.forEach(element => {
              console.log("Element: ", element)
            });
          })
          setAllDrives(data);
        } catch (err) {
          setError("Failed to fetch drives.");
        } finally {
          setLoading(false);
        }
      };
      fetchDrives();
    }
    
  }, [department]);

  

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <NewHeader title={"Drives"} link={"/drives/new"} />
      <div className="w-max grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
        {allDrives.map((drive, i) => {
          const driveDate = formDateFromString(drive.driveDate);
          const lastDriveDate = formDateFromString(drive.lastDriveDate);
         
         
            return (
              <Drive 
                key={drive.id} 
                id={drive.id} 
                title={drive.title} 
                img={drive.imageUrl || "/logo.jpg"} 
                date={driveDate} 
                last_date={lastDriveDate} 
              />
            );
          
          
        })}
      </div>
    </div>
  );
}
