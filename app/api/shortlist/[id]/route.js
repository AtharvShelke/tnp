import db from "@/lib/db";
import { NextResponse } from "next/server";

const extractRecruiterId = (pathname) => {
    const match = pathname.match(/\/api\/shortlist\/([^/]+)/);
    return match ? match[1] : null;
};

export const GET = async (req, {params}) => {
   const {id} = await params;
    
    if (!id) return NextResponse.json({ message: "Invalid ID" }, { status: 400 });

    try {
      const shortlist = await db.shortlistedStudents.findMany({
  where: { recruiterId: id },
  include: {
    user: {
      select: {
        name: true,
        email: true,
        pfp: true,
        role: true,
        Student: {
            include:{
                department:true
            }
        }, // ✅ include related student model here
      },
    },
    recruiter: true,
  },
});


        return NextResponse.json(shortlist)
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json(
            { error: error.message || "An error occurred while fetching data" },
            { status: 500 }
        );
    }
};