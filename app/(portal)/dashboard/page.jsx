"use client";

import DashboardCard from "@/components/dashboard/DashboardCard";
import { getRequest } from "@/lib/apiRequest";
import { User } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const userId = session?.user?.id;
    const userRole = session?.user?.role;
    const [counts, setCounts] = useState({
        students: 0,
        coordinators: 0,
        drives: 0,
        activities: 0,
        booklets: 0,
        recruiters: 0,
    });

    const [isCoordinator, setIsCoordinator] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recruiterStatus, setRecruiterStatus] = useState(null);

    const dashboardItems = useMemo(() => [
        { name: "Students", number: counts.students, icon: <User />, href: "/students", roles: ["ADMIN", "COORDINATOR"] },
        { name: "Coordinator", number: counts.coordinators, icon: <User />, href: "/coordinators", roles: ["ADMIN"] },
        { name: "Drives", number: counts.drives, icon: <User />, href: "/drives", roles: ["ADMIN", "COORDINATOR"] },
        { name: "Activities", number: counts.activities, icon: <User />, href: "/activities", roles: ["ADMIN", "COORDINATOR"] },
        { name: "Booklets", number: counts.booklets, icon: <User />, href: "/booklets", roles: ["ADMIN", "COORDINATOR"] },
        { name: "Recruiters", number: counts.recruiters, icon: <User />, href: "/dashboard", roles: ["ADMIN", "COORDINATOR"] },
    ], [counts]);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const [coordinatorCount, studentCount, driveCount, activityCount, bookletCount, coordinatorData] = await Promise.all([
                    getRequest("coordinator/count"),
                    getRequest("student/count"),
                    getRequest("drives/count"),
                    getRequest("activities/count"),
                    getRequest("booklets/count"),
                    // getRequest("recruiters/count"),
                    getRequest(`coordinator/${userId}`)
                ]);

                setCounts({
                    students: studentCount,
                    coordinators: coordinatorCount,
                    drives: driveCount,
                    activities: activityCount,
                    booklets: bookletCount,
                    // recruiters: recruiterCount,
                });

                setIsCoordinator(coordinatorData?.isCoordinator ?? false);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    useEffect(() => {
        if (!loading && userRole === "COORDINATOR" && !isCoordinator) {
            router.replace("/coordinators/new");
        }
    }, [loading, userRole, isCoordinator, router]);

    useEffect(() => {
        if (!loading && userRole === "STUDENT") {
            router.replace("/drives");
        }
    }, [loading, userRole, router]);

    useEffect(() => {
        const fetchRecruiterData = async () => {
            if (!loading && userRole === "RECRUITER") {
                try {
                    const data = await getRequest(`recruiter/${userId}`);
                    setRecruiterStatus(data?.status ?? null);
                } catch (error) {
                    console.error("Error fetching recruiter data:", error);
                }
            }
        };
        fetchRecruiterData();
    }, [loading, userRole, userId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    if (userRole === "RECRUITER") {
        if (recruiterStatus === "PENDING") {
            return <div className="flex flex-col items-center justify-center min-h-[90vh] p-6 bg-gray-100 rounded-lg shadow-md border border-gray-300">
            <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-md w-full max-w-md">
                <h2 className="text-lg font-semibold">Account Request Pending</h2>
                <p className="mt-2 text-sm">
                    Your account request has been sent to the <strong>Training and Placement Office of MGM University</strong>.  
                    Please wait for approval. You will be notified once your account is activated.
                </p>
            </div>
        </div>
        
        }
        return <div>This is the recruiter dashboard</div>;
    }

    return (
        <div className="p-6">
            {userRole === "ADMIN" && (
                <div className="grid grid-cols-4 px-10 py-10 gap-10 border">
                    {["drives", "activities", "booklets", "departments"].map((path) => (
                        <Link key={path} href={`/${path}/new`}>
                            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow flex items-center justify-center">
                                Create New {path.charAt(0).toUpperCase() + path.slice(1)}
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            <div className={`grid ${userRole === "ADMIN" ? "grid-cols-3" : "grid-cols-2"} gap-5 px-10 py-5 border`}>
                {dashboardItems
                    .filter((item) => item.roles.includes(userRole))
                    .map((item, i) => (
                        <DashboardCard key={i} {...item} />
                    ))}
            </div>
        </div>
    );
}
