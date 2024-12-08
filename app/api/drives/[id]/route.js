import db from "@/lib/db";
import { NextResponse } from "next/server";

const extractDriveId = (pathname) => {
    const match = pathname.match(/\/api\/drives\/([^/]+)/);
    return match ? match[1] : null;
};
export const GET = async (req) => {
    const id = extractDriveId(req.nextUrl.pathname);
    if (!id) return NextResponse.json({ message: "Invalid ID" }, { status: 400 });

    try {
        const drive = await db.drive.findUnique({
            where: { id },
            include:{
                rounds:true,
                driveDepartments:true
            }
        })
       
        return NextResponse.json(drive)
    } catch (error) {
        console.error("Error posting data:", error);
        return NextResponse.json(
            { error: error.message || "An error occurred while posting data" },
            { status: 500 }
        );
    }
    return NextResponse.json({ id })
}