import db from "@/lib/db"
import { NextResponse } from "next/server";

export const GET = async (request) => {
    const applications = await db.driveApplication.findMany();
    return NextResponse.json({applications})
}