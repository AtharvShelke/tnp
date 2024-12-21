import db from "@/lib/db";
import { NextResponse } from "next/server";

const extractDriveId = (pathname) => {
    const match = pathname.match(/\/api\/drives\/([^/]+)/);
    return match ? match[1] : null;
};

export const GET = async (req) => {
    const id = extractDriveId(req.nextUrl.pathname);

    if (!id) {
        return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    try {
        const drive = await db.drive.findUnique({
            where: { id },
            include: {
                rounds: true,
                driveDepartments: true
            }
        });

        if (!drive) {
            return NextResponse.json({ message: "Drive not found" }, { status: 404 });
        }

        return NextResponse.json(drive);
    } catch (error) {
        console.error("Error fetching data:", error);
        console.error("Error message:", error.message);
        console.error("Error stack trace:", error.stack);

        return NextResponse.json(
            {
                error: error.message || "An error occurred while fetching data",
                stack: error.stack || null,  
            },
            { status: 500 }
        );
    }
};
