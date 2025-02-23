import db from "@/lib/db";
import { NextResponse } from "next/server";


const extractRecruiterId = (pathname) => {
  const match = pathname.match(/\/api\/recruiter\/([^/]+)/);
  return match ? match[1] : null;
};

export const GET = async (request) => {
  try {
    const id = extractRecruiterId(request.nextUrl.pathname);

    if (!id) {
      return NextResponse.json({ error: "Recruiter ID is required" }, { status: 400 });
    }

    const recruiter = await db.recruiter.findUnique({
      where: { userId: id },
    });

    if (!recruiter) {
      return NextResponse.json({ error: "Recruiter not found" }, { status: 404 });
    }

    return NextResponse.json(recruiter);
  } catch (error) {
    console.error("Error fetching recruiter data:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching recruiter data" },
      { status: 500 }
    );
  }
};
