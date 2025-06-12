'use client'
import Drive from "@/components/dashboard/Drive";
import NewHeader from "@/components/dashboard/NewHeader";
import Loader from "@/components/Loader";
import { getRequest } from "@/lib/apiRequest";
import formDateFromString from "@/lib/formDateFromString";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, Filter, Calendar as CalendarIcon } from 'lucide-react';

export default function DrivesPage() {
  const [allDrives, setAllDrives] = useState([]);
  const [filteredDrives, setFilteredDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [department, setDepartment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
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
          status: getDriveStatus(drive.driveDate, drive.lastDriveDate)
        }));

        setAllDrives(enrichedDrives);
        setFilteredDrives(enrichedDrives);
      } catch (err) {
        setError("Failed to fetch drives.");
      } finally {
        setLoading(false);
      }
    };

    fetchDrives();
  }, [session?.user?.id]);

  useEffect(() => {
    filterDrives();
  }, [searchTerm, statusFilter, allDrives]);

  const getDriveStatus = (driveDate, lastDriveDate) => {
    const today = new Date();
    const eventDate = new Date(driveDate);
    const lastEventDate = new Date(lastDriveDate);

    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    lastEventDate.setHours(0, 0, 0, 0);

    if (eventDate > today) return "upcoming";
    if (today > lastEventDate) return "closed";
    return "active";
  };

  const filterDrives = () => {
    let filtered = [...allDrives];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(drive => 
        drive.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (drive.description && drive.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(drive => drive.status === statusFilter);
    }
    
    setFilteredDrives(filtered);
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4 sm:p-6 min-h-screen bg-gray-50">
      <NewHeader title={"Campus Drives"} link={"/drives/new"} />
      
      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search drives by title or description..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              className="bg-gray-50 border border-gray-300 text-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {filteredDrives.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No drives found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? "Try adjusting your search or filter criteria."
              : "There are currently no drives available."}
          </p>
        </div>
      ) : (
        <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDrives.map((drive) => {
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
                status={drive.status}
                company={drive.companyName}
                description={drive.description}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}