import db from "@/lib/db";
import { NextResponse } from "next/server";

const extractUserId = (pathname) => {
    const match = pathname.match(/\/api\/user\/([^/]+)/);
    return match ? match[1] : null;
};
export const GET = async (req) => {
    const id = extractUserId(req.nextUrl.pathname);
    if (!id) return NextResponse.json({ message: "Invalid ID" }, { status: 400 });

    try {
        const user = await db.user.findUnique({
            where: { id },
            
        })
       
        return NextResponse.json(user)
    } catch (error) {
        console.error("Error posting data:", error);
        return NextResponse.json(
            { error: error.message || "An error occurred while posting data" },
            { status: 500 }
        );
    }
    return NextResponse.json({ id })
}