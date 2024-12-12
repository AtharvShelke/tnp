import db from "@/lib/db";
import { NextResponse } from "next/server";

// Utility to extract the coordinator ID from the API route
const extractCoordinatorId = (pathname) => {
    const match = pathname.match(/\/api\/coordinatorApproval\/([^/]+)/);
    return match ? match[1] : null;
};

export const PUT = async (req) => {
    try {
        // Extract ID from the URL
        const id = extractCoordinatorId(new URL(req.url).pathname);
        if (!id) {
            return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
        }

        // Parse request body
        const data = await req.json();
        const { status } = data;

        if (!status || !["APPROVED", "REJECTED"].includes(status)) {
            return NextResponse.json({ message: "Invalid status" }, { status: 400 });
        }

        // Debugging logs
        console.log("Backend received ID:", id);
        console.log("Backend received data:", data);

        const user = await db.coordinatorApproval.findUnique({ where: { userId: id } });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 400 });
        }
       console.log('User found in approval')
       await db.coordinatorApproval.update({
        where:{userId:id},
        data:{status}
       })
       await db.user.update({
        where:{id},
        data:{role:"COORDINATOR"}
       })

        return NextResponse.json({ message: "Coordinator status updated successfully" });
    } catch (error) {
        console.error("Error updating coordinator status:", error);
        return NextResponse.json(
            {
                error: error.message || error,
                message: "Failed to approve/reject a coordinator",
            },
            { status: 500 }
        );
    }
};
// 6759cb61cc530e02a6716a6d