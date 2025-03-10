'use client';
import Drive from "@/components/dashboard/Drive";
import NewHeader from "@/components/dashboard/NewHeader";
import Loader from "@/components/Loader";
import { getRequest } from "@/lib/apiRequest";
import formDateFromString from "@/lib/formDateFromString";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function MyPosts() {
    const [myDrives, setMyDrives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { data: session } = useSession();

    useEffect(() => {
        if (!session?.user?.id) return;

        const fetchDrives = async () => {
            try {
                const allDrives = await getRequest("drives");

                // Filter drives created by the logged-in user
                const userDrives = allDrives.filter(drive => drive.creatorId === session.user.id);

                // Ensure correct data mapping
                const enrichedDrives = userDrives.map(drive => ({
                    ...drive,
                    driveDate: formDateFromString(drive.driveDate),
                    lastDriveDate: formDateFromString(drive.lastDriveDate),
                }));

                setMyDrives(enrichedDrives);
            } catch (err) {
                setError("Failed to fetch your drives.");
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
            <NewHeader title="My Drives" link="/drives/new" />
            {myDrives.length === 0 ? (
                <p className="text-center text-gray-600 mt-6">No drives created yet.</p>
            ) : (
                <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {myDrives.map(drive => (
                        <Drive
                            key={drive.id}
                            id={drive.id}
                            title={drive.title}
                            img={drive.imageUrl || "/logo.jpg"}
                            date={drive.driveDate}
                            last_date={drive.lastDriveDate}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
