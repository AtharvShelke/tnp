import db from "@/lib/db";
import { NextResponse } from "next/server";

const extractDriveId = (pathname) => {
    const match = pathname.match(/\/api\/drives\/([^/]+)/);
    return match ? match[1] : null;
};

export const GET = async (req) => {
    const id = extractDriveId(req.nextUrl.pathname);

    if (!id) {
        return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    try {
        const drive = await db.drive.findUnique({
            where: { id },
            include: {
                rounds: true,
                driveDepartments: true
            }
        });

        if (!drive) {
            return NextResponse.json({ message: "Drive not found" }, { status: 404 });
        }

        return NextResponse.json(drive);
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json(
            { error: "An error occurred while fetching data" },
            { status: 500 }
        );
    }
};
export const PUT = async (req, {params}) => {
    const {id} = await params;

    if (!id) {
        return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    try {
        const body = await req.json();
        
        // Validate required fields
        if (!body.title || !body.referenceNumber || !body.driveDate || !body.lastDriveDate) {
            return NextResponse.json(
                { error: "Title, reference number, and dates are required" },
                { status: 400 }
            );
        }
   const minCGPA = body.minCGPA ? parseFloat(body.minCGPA) : null;
        const maxBacklogs = body.maxBacklogs !== undefined ? parseInt(body.maxBacklogs) : null;
        // Start transaction to update drive and related data
        const updatedDrive = await db.$transaction(async (prisma) => {
            // Update the drive
            const drive = await db.drive.update({
                where: { id },
                data: {
                    title: body.title,
                    industryType: body.industryType,
                    referenceNumber: body.referenceNumber,
                    location: body.location,
                    role: body.role,
                    ctc: body.ctc,
                    bond: body.bond,
                    link: body.link,
                    downloadlink: body.downloadlink,
                    about: body.about,
                    description: body.description,
                    eligibility: body.eligibility,
                    minCGPA: minCGPA,
                    maxBacklogs: maxBacklogs,
                    driveDate: new Date(body.driveDate),
                    lastDriveDate: new Date(body.lastDriveDate),
                }
            });

            // Update rounds
            if (body.rounds && Array.isArray(body.rounds)) {
                // Delete existing rounds
                await db.round.deleteMany({
                    where: { driveId: id }
                });

                // Create new rounds if there are any
                if (body.rounds.length > 0) {
                    await db.round.createMany({
                        data: body.rounds.map(round => ({
                            title: round.title,
                            driveId: id
                        }))
                    });
                }
            }

            // Update departments
            if (body.driveDepartments && Array.isArray(body.driveDepartments)) {
                // Delete existing department associations
                await db.driveDepartments.deleteMany({
                    where: { driveId: id }
                });

                // Create new department associations if there are any
                if (body.driveDepartments.length > 0) {
                    await db.driveDepartments.createMany({
                        data: body.driveDepartments.map(dept => ({
                            driveId: id,
                            title: dept.title,
                            
                        }))
                    });
                }
            }

            // Return the updated drive with all relations
            return await db.drive.findUnique({
                where: { id },
                include: {
                    rounds: true,
                    driveDepartments: true
                }
            });
        });

        return NextResponse.json(updatedDrive);
    } catch (error) {
        console.error("Error updating drive:", error);
        return NextResponse.json(
            { error: "An error occurred while updating the drive" },
            { status: 500 }
        );
    }
};
export const DELETE = async (req) => {
    const id = extractDriveId(req.nextUrl.pathname);

    if (!id) {
        return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    try {
        // First check if the drive exists
        const existingDrive = await db.drive.findUnique({
            where: { id },
        });

        if (!existingDrive) {
            return NextResponse.json(
                { error: "Drive not found" },
                { status: 404 }
            );
        }

        // Use transaction to ensure all related data is deleted
        await db.$transaction([
            // Delete related applications first
            db.driveApplication.deleteMany({
                where: { driveId: id },
            }),
            // Delete related rounds
            db.round.deleteMany({
                where: { driveId: id },
            }),
            // Delete related departments
            db.driveDepartments.deleteMany({
                where: { driveId: id },
            }),
            // Finally delete the drive
            db.drive.delete({
                where: { id },
            }),
        ]);

        return NextResponse.json(
            { message: "Drive deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting drive:", error);
        return NextResponse.json(
            { error: "An error occurred while deleting the drive" },
            { status: 500 }
        );
    }
};