'use client';
import DashboardCard from "@/components/dashboard/DashboardCard";
import { User } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [coordinatorFlag, setCoordinatorFlag] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { data: session, status } = useSession();
    const userId = session?.user?.id;
    const router = useRouter();

    const dashboardItems = [
        { name: 'Students', number: 10, icon: <User />, href: '/students', roles: ['ADMIN', 'COORDINATOR'] },
        { name: 'Coordinator', number: 10, icon: <User />, href: '/coordinators', roles: ['ADMIN'] },
        { name: 'Drives', number: 10, icon: <User />, href: '/drives', roles: ['ADMIN', 'COORDINATOR'] },
        { name: 'Activities', number: 10, icon: <User />, href: '/activities', roles: ['ADMIN', 'COORDINATOR'] },
        { name: 'Booklets', number: 10, icon: <User />, href: '/booklets', roles: ['ADMIN', 'COORDINATOR'] },
        { name: 'Companies', number: 10, icon: <User />, href: '/dashboard', roles: ['ADMIN', 'COORDINATOR'] },
    ];

    useEffect(() => {
        if (!userId) {
            setLoading(false); // Stop loading if no userId
            return;
        }

        const fetchData = async () => {
            try {
                const response = await fetch(`/api/coordinator/${userId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const result = await response.json();
                setCoordinatorFlag(result.isCoordinator);
                setData(result.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    useEffect(() => {
        if (data?.role === "COORDINATOR" && !coordinatorFlag) {
            router.push('/coordinators/new');
        }
    }, [data, coordinatorFlag, router]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const renderCards = (role) =>
        dashboardItems
            .filter((item) => item.roles.includes(role))
            .map((item, i) => (
                <DashboardCard
                    key={i}
                    name={item.name}
                    number={item.number}
                    icon={item.icon}
                    href={item.href}
                />
            ));

    if (session?.user?.role === "COORDINATOR") {
        return (
            <div className="p-6">
                <div className="grid grid-cols-3 gap-5 px-10 py-5 border">
                    {renderCards("COORDINATOR")}
                </div>
            </div>
        );
    }

    if (session?.user?.role === "ADMIN") {
        return (
            <div>
                <div className="grid grid-cols-4 px-10 py-10 gap-10 border">
                    {['drives', 'activities', 'booklets', 'departments'].map((path) => (
                        <Link key={path} href={`/${path}/new`}>
                            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow flex items-center justify-center">
                                Create New {path.charAt(0).toUpperCase() + path.slice(1)}
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="grid grid-cols-3 gap-5 px-10 py-5 border">
                    {renderCards("ADMIN")}
                </div>
            </div>
        );
    }

    if (session?.user?.role === 'STUDENT') {
        router.push('/drives')
    }
}
