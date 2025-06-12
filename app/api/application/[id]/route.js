import db from "@/lib/db";
import { NextResponse } from "next/server";

// individual student logic
export const GET = async (request) => {
    const id  = ((request.nextUrl.pathname).split('/'))[3];
    const application = await db.driveApplication.findMany({
        where:{
            userId:id
        }
    })
    console.log("Application:", application)
    return NextResponse.json({application});
}

export const PUT = async (request, { params }) => {
    try {
        const { userid } = params;
        const { status } = await request.json();
        
        // Validate the input
        if (!status || typeof status !== 'string') {
            return NextResponse.json(
                { error: "Status is required and must be a string" },
                { status: 400 }
            );
        }

        // Update the application status
        const updatedApplication = await db.driveApplication.updateMany({
            where: {
                userId: userid
            },
            data: {
                status: status
            }
        });

        // Check if any record was updated
        if (updatedApplication.count === 0) {
            return NextResponse.json(
                { error: "Application not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Application status updated successfully",
            data: updatedApplication
        });

    } catch (error) {
        console.error("Error updating application status:", error);
        return NextResponse.json(
            { error: "Failed to update application status" },
            { status: 500 }
        );
    }
}

export const DELETE = async (request, { params }) => {
    try {
        const { userid } = params;
        
        // Delete the application
        const deletedApplication = await db.driveApplication.deleteMany({
            where: {
                userId: userid
            }
        });

        // Check if any record was deleted
        if (deletedApplication.count === 0) {
            return NextResponse.json(
                { error: "Application not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Application deleted successfully",
            data: deletedApplication
        });

    } catch (error) {
        console.error("Error deleting application:", error);
        return NextResponse.json(
            { error: "Failed to delete application" },
            { status: 500 }
        );
    }
}