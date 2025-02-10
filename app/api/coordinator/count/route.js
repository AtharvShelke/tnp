import db from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (request) => {
    try {
        const coordinatorCount = await db.coordinator.count();
        
        return NextResponse.json(coordinatorCount);
    } catch (error) {
        return NextResponse.json({ error: error.message, message: "error" })
    }
};