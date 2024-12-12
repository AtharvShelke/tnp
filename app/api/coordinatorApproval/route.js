import db from "@/lib/db";
import { ApprovalStatus } from "@prisma/client";
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

       

        const coordinator = await db.coordinator.findUnique({
            where: { userId },
        });
        console.log("coordinator existence check:", coordinator);
        const coordinatorReq = await db.coordinatorApproval.findUnique({
            where: { userId },
        });
        console.log("coordinator request check:", coordinatorReq);

        if (!coordinator) {
            await db.coordinatorApproval.create({
                data: {
                    userId,
                    
                }
            });
        }

        return NextResponse.json({ message: "Coordinator Request sent to Admin" }, { status: 201 });
    } catch (error) {
        console.error("Error details:", error.message, error.stack);
        return NextResponse.json(
            { message: "Internal server error.", details: error.message },
            { status: 500 }
        );
    }
}

export const GET = async (request) => {
    try {
        const requests = await db.coordinatorApproval.findMany();
        
        return NextResponse.json(requests);
    } catch (error) {
        return NextResponse.json({ error: error.message, message: "error" })
    }
};