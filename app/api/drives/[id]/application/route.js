import db from "@/lib/db";
import { NextResponse } from "next/server";

const extractDriveId = (pathname) => {
    const match = pathname.match(/\/api\/drives\/([^/]+)/);
    return match ? match[1] : null;
};

export const GET = async (req) => {
    const driveId = extractDriveId(req.nextUrl.pathname);
    try {
        const driveApplication = await db.driveApplication.findMany({
            where: {
                driveId: driveId
            }
        })
        const finalData = await Promise.all(
            driveApplication.map(async (app) => {
                try {
                    const user = await db.user.findUnique({
                        where: {
                            id: app.userId,
                        },
                    });

                    const student = await db.student.findUnique({
                        where: {
                            userId: app.userId,
                        },
                    });

                    const department = student ? await db.department.findUnique({
                        where: {
                            id: student.departmentId,
                        },
                    }) : null;

                

                    return {
                        ...student,
                        userId: app.userId,
                        email:user.email,
                        
                        status: app.status,
                        name: user ? user.name : 'Unknown User',
                        department: department ? department.title : 'Unknown Department',
                        
                    };
                } catch (error) {
                    console.error('Error fetching related data for application:', error);
                    return null;
                }
            })
        )
        return NextResponse.json(finalData)
    } catch (error) {
        console.error("Error fetching data:", error);
        console.error("Error message:", error.message);
        console.error("Error stack trace:", error.stack);

        return NextResponse.json(
            {
                error: error.message || "An error occurred while fetching data",
                stack: error.stack || null,
            },
            { status: 500 }
        );
    }

}