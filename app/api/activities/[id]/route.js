import db from "@/lib/db";
import { NextResponse } from "next/server";

const extractActivityId = (pathname) => {
    const match = pathname.match(/\/api\/activities\/([^/]+)/);
    return match ? match[1] : null;
};
export const GET = async (req) => {
    const id = extractActivityId(req.nextUrl.pathname);
    if (!id) return NextResponse.json({ message: "Invalid ID" }, { status: 400 });

    try {
        const activity = await db.activity.findUnique({
            where: { id },
            include:{
                
                activityDepartments:true
            }
        })
       
        return NextResponse.json(activity)
    } catch (error) {
        console.error("Error posting data:", error);
        return NextResponse.json(
            { error: error.message || "An error occurred while posting data" },
            { status: 500 }
        );
    }
    return NextResponse.json({ id })
}