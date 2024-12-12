import db from "@/lib/db";
import { NextResponse } from "next/server";

const extractCoordinatorId = (pathname) => {
    const match = pathname.match(/\/api\/coordinator\/([^/]+)/);
    return match ? match[1] : null;
};

export const GET = async (req) => {
    const id = extractCoordinatorId(req.nextUrl.pathname);
    if (!id) return NextResponse.json({ message: "Invalid ID" }, { status: 400 });

    try {
        const coordinator = await db.coordinator.findUnique({
            where: { userId: id },
        });

        if (coordinator) {
            return NextResponse.json({ isCoordinator: true, data: coordinator });
        } else {
            const user = await db.user.findUnique({
                where: { id: id },
            });

            if (user) {
                return NextResponse.json({ isCoordinator: false, data: user });
            } else {
                return NextResponse.json({ message: "User not found" }, { status: 404 });
            }
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json(
            { error: error.message || "An error occurred while fetching data" },
            { status: 500 }
        );
    }
};
