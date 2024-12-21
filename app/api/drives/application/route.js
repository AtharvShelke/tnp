import db from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (req) => {
    const data = await req.json();
    console.log(data)

    const driveApplication = await db.driveApplication.create({ data })
    return NextResponse.json(driveApplication)
}
export const GET = async (req) => {
    try {

        const applications = await db.driveApplication.findMany();


        if (!applications || applications.length === 0) {
            return NextResponse.json({ message: 'No applications found' }, { status: 404 });
        }

        const enrichedApplications = await Promise.all(
            applications.map(async (app) => {
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

                    const drive = await db.drive.findUnique({
                        where: {
                            id: app.driveId,
                        },
                    });

                    return {
                        isplaced: student.placed,
                        prn:student.PRN,
                        userId: app.userId,
                        driveId: app.driveId,
                        status: app.status,
                        name: user ? user.name : 'Unknown User',
                        department: department ? department.title : 'Unknown Department',
                        referenceNumber: drive ? drive.referenceNumber : 'No Reference',
                        title: drive ? drive.title : 'No Title',
                    };
                } catch (error) {
                    console.error('Error fetching related data for application:', error);
                    return null; 
                }
            })
        );

        
        const filteredApplications = enrichedApplications.filter(app => app !== null);

        return NextResponse.json(filteredApplications);


    } catch (error) {

        return NextResponse.json(
            { error: 'An error occurred while fetching applications' },
            { status: 500 }
        );
    }
};
