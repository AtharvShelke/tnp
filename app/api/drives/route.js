import db from '@/lib/db';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const data = await req.json();

        const {
            referenceNumber,
            title,
            driveDepartments,

            industryType,
            ctc,
            about,
            bond,
            role,
            location,
            description,
            eligibility,
            link,
            downloadlink,
            driveDate,
            lastDriveDate,
            imageUrl,
            rounds,
            creatorId,
            minCGPA,
            maxBacklogs
        } = data;
        const fminCGPA = minCGPA ? parseFloat(minCGPA) : 0;
        const imaxBacklogs = maxBacklogs !== undefined ? parseInt(maxBacklogs) : 0;
        const drive = await prisma.drive.create({
            data: {
                referenceNumber,
                title,
                driveDepartments: {
                    create: driveDepartments.map((dept) => ({
                        title: dept.title,
                    })),
                },

                industryType,
                ctc,
                about,
                bond,
                role,
                location,
                description,
                eligibility,
                link,
                downloadlink,
                driveDate: new Date(driveDate),
                lastDriveDate: new Date(lastDriveDate),
                imageUrl,
                creatorId,
                minCGPA:fminCGPA,
                maxBacklogs:imaxBacklogs,
                rounds: {
                    create: rounds.map((round) => ({
                        title: round.title,
                    })),
                },
            },
        });

        return NextResponse.json({ drive });
    } catch (error) {
        console.error("Error posting data:", error);
        return NextResponse.json(
            { error: error.message || "An error occurred while posting data" },
            { status: 500 }
        );
    }
}

export const GET = async (request) => {
    try {
        const drives = await db.drive.findMany({
            include: {
                rounds: true,
                driveDepartments: true
            }
        });

        return NextResponse.json(drives);
    } catch (error) {
        return NextResponse.json({ error, message: "error " })
    }
};



