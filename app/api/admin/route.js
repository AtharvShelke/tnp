import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const data = await request.json();
        const { userId } = data;

        if (!userId) {
            return NextResponse.json({ message: "Invalid userId" }, { status: 400 });
        }

        const user = await db.user.findUnique({ where: { id: userId } });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const admin = await db.admin.findUnique({ where: { userId } });
        if (!admin) {
            await db.$transaction([
                db.admin.create({ data: { userId, isProfileComplete: true } }),
                db.user.update({ where: { id: userId }, data: { role: "ADMIN" } }),
            ]);
        }

        return NextResponse.json({ message: "Admin Created" }, { status: 201 });
    } catch (error) {
        console.error("Error details:", error.message, error.stack);
        return NextResponse.json(
            { message: "Internal server error.", details: error.message },
            { status: 500 }
        );
    }
}
