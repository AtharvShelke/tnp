import db from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (request) => {
    try {
        const applications = await db.driveApplication.findMany();
        
        return NextResponse.json({ applications });
    } catch (error) {
        console.error("Error fetching applications:", error);
        return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
    }
};
