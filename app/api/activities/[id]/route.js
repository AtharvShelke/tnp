import db from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
    const { id } = await params;

    try {
        const activity = await db.activity.findUnique({
            where: { id },
            include: {
                activityDepartments: true
            }
        });

        if (!activity) {
            return NextResponse.json(
                { message: "Activity not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(activity);
    } catch (error) {
        console.error("Error fetching activity:", error);
        return NextResponse.json(
            {
                message: "Failed to fetch activity",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            },
            { status: 500 }
        );
    }
};

export const PUT = async (request, { params }) => {
    const { id } = await params;

    try {
        const body = await request.json();

        // First, update the activity
        const updatedActivity = await db.activity.update({
            where: { id },
            data: {
                title: body.title,
                referenceNumber: body.referenceNumber,
                description: body.description,
                link: body.link,
                date: body.date ? new Date(body.date) : undefined,
                imageUrl: body.imageUrl,
            },
        });

        // Then update departments if provided
        if (body.activityDepartments) {
            // First delete existing departments
            await db.activityDepartment.deleteMany({
                where: { activityId: id }
            });

            // Then create new ones
            await db.activityDepartment.createMany({
                data: body.activityDepartments.map(dept => ({
                    activityId: id,
                    departmentId: dept.departmentId,
                    // Other department fields if needed
                }))
            });
        }

        // Return the full activity with departments
        const fullActivity = await db.activity.findUnique({
            where: { id },
            include: {
                activityDepartments: true
            }
        });

        return NextResponse.json(fullActivity);

    } catch (error) {
        console.error('Error updating activity:', error);
        return NextResponse.json(
            {
                message: "Failed to update activity",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            },
            { status: 500 }
        );
    }
};

export const DELETE = async (request, { params }) => {
    const { id } = await params;

    try {
        // Use the correct model name (ActivityDepartments instead of activityDepartment)
        await db.$transaction([
            db.activityDepartments.deleteMany({
                where: { activityId: id }
            }),
            db.activity.delete({
                where: { id }
            })
        ]);

        return NextResponse.json(
            { message: "Activity deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting activity:', error);
        return NextResponse.json(
            { 
                message: "Failed to delete activity",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            },
            { status: 500 }
        );
    }
};