import db from "@/lib/db";
import { NextResponse } from "next/server";

const extractStudentId = (pathname) => {
    const match = pathname.match(/\/api\/student\/([^/]+)/);
    return match ? match[1] : null;
};

export const GET = async (req) => {
    const id = extractStudentId(req.nextUrl.pathname);
    if (!id) return NextResponse.json({ message: "Invalid ID" }, { status: 400 });

    try {
        const student = await db.student.findUnique({
            where: { userId: id },
            include:{
                education:true,
                technicalSkill:true,
                project:true,
                studentDocuments:true
            }
        });

       return NextResponse.json(student)
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json(
            { error: error.message || "An error occurred while fetching data" },
            { status: 500 }
        );
    }
};
