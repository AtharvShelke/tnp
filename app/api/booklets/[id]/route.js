import db from "@/lib/db";
import { NextResponse } from "next/server";

const extractBookletId = (pathname) => {
    const match = pathname.match(/\/api\/booklets\/([^/]+)/);
    return match ? match[1] : null;
};
export const GET = async (req) => {
    const id = extractBookletId(req.nextUrl.pathname);
    if (!id) return NextResponse.json({ message: "Invalid ID" }, { status: 400 });

    try {
        const booklet = await db.booklet.findUnique({
            where: { id },
            include:{
                
                bookletDepartments:true
            }
        })
       
        return NextResponse.json(booklet)
    } catch (error) {
        console.error("Error posting data:", error);
        return NextResponse.json(
            { error: error.message || "An error occurred while posting data" },
            { status: 500 }
        );
    }
    return NextResponse.json({ id })
}