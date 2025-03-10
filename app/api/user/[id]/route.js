import db from "@/lib/db";
import { NextResponse } from "next/server";

const extractUserId = (pathname) => {
    const match = pathname.match(/\/api\/user\/([^/]+)/);
    return match ? match[1] : null;
};

export const GET = async (req) => {
    const id = extractUserId(req.nextUrl.pathname);
    if (!id) {
        return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    try {
        const user = await db.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
                // Add other fields, but exclude password
            },
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
            { error: error.message || "An error occurred while fetching user data" },
            { status: 500 }
        );
    }
};
