import db from "@/lib/db";
import { NextResponse } from "next/server";

const extractRecruiterId = (url) => {
    try {
        const match = new URL(url).pathname.match(/\/api\/recruiter\/approval\/([^/]+)/);
        return match ? match[1] : null;
    } catch (error) {
        console.error("Error extracting recruiter ID:", error);
        return null;
    }
};

export const PUT = async (request) => {
    try {
        const id = extractRecruiterId(request.url);

        if (!id) {
            console.error("Missing recruiter ID in URL:", request.url);
            return NextResponse.json({ error: "Invalid URL: Missing recruiter ID" }, { status: 400 });
        }

        let data;
        try {
            data = await request.json();
        } catch (error) {
            console.error("Invalid JSON received:", error);
            return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        const { status } = data;
        if (!status) {
            return NextResponse.json({ error: "Status field is required" }, { status: 400 });
        }

        const recruiter = await db.recruiter.findUnique({ where: { userId: id } });

        if (!recruiter) {
            return NextResponse.json({ error: "Recruiter not found" }, { status: 404 });
        }

        const updatedRecruiter = await db.recruiter.update({
            where: { userId: id },
            data: { status },
        });

        return NextResponse.json(updatedRecruiter);
    } catch (error) {
        console.error("Error updating recruiter:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
};
