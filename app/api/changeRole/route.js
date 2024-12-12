import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const data = await request.json();
        const { userId } = data;

        console.log("userId received in request:", userId);
        if (!userId) {
            return NextResponse.json({ message: "Invalid userId" }, { status: 400 });
        }

        const user = await db.user.findUnique({ where: { id: userId } });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 400 });
        }

        const updatedUser = await db.user.update({
            where: { id: userId },
            data: { role: "ADMIN" }
        });
        if (!updatedUser) {
            throw new Error("Failed to update user role");
        }

        const adminExists = await db.admin.findUnique({
            where: { userId },
        });
        console.log("Admin existence check:", adminExists);

        if (!adminExists) {
            await db.admin.create({
                data: {
                    userId,
                    isProfileComplete: true,
                }
            });
        }

        return NextResponse.json({ message: "Admin created successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error details:", error.message, error.stack);
        return NextResponse.json(
            { message: "Internal server error.", details: error.message },
            { status: 500 }
        );
    }
}
