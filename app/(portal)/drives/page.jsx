'use client'
import Drive from "@/components/dashboard/Drive";
import NewHeader from "@/components/dashboard/NewHeader";
import Loader from "@/components/Loader";
import { getRequest } from "@/lib/apiRequest";
import formDateFromString from "@/lib/formDateFromString";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";

export default function DrivesPage() {
  const [allDrives, setAllDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [department, setDepartment] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.role === "USER") {
      router.push("/profileCheck");
    }

    const fetchUserRoleData = async () => {
      try {
        if (session?.user?.role === "COORDINATOR") {
          const coordinator = await getRequest(`coordinator/${session.user.id}`);
          console.log("Coordinator Department:", coordinator.departmentId);
        } else if (session?.user?.role === "STUDENT") {
          const student = await getRequest(`student/${session.user.id}`);
          setDepartment(student.departmentId);
        }
      } catch (err) {
        console.error("Error fetching user role data:", err);
      }
    };

    if (session?.user?.role === "COORDINATOR" || session?.user?.role === "STUDENT") {
      fetchUserRoleData();
    }
  }, [session, router]);

  useEffect(() => {
    const fetchDrives = async () => {
      try {
        const drives = await getRequest("drives");

        // Extract unique creator IDs
        const creatorIds = [...new Set(drives.map((d) => d.creatorId).filter(Boolean))];

        let users = {};
        if (creatorIds.length > 0) {
          // Fetch all users in a single API request if supported
          const usersData = await Promise.all(creatorIds.map((id) => getRequest(`/user/${id}`)));
          users = Object.fromEntries(usersData.map((user) => [user.id, user]));
        }

        // Attach user data to drives
        const enrichedDrives = drives.map((drive) => ({
          ...drive,
          creator: users[drive.creatorId] || null,
        }));

        setAllDrives(enrichedDrives);
      } catch (err) {
        setError("Failed to fetch drives.");
      } finally {
        setLoading(false);
      }
    };

    fetchDrives();
  }, [session?.user?.id]);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <NewHeader title={"Drives"} link={"/drives/new"} />
      <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allDrives.map((drive) => {
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
