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
            departmentId,
            status,
            industryType,
            role,
            location,
            description,
            eligibility,
            link,
            driveDate,
            lastDriveDate,
            rounds,
        } = data;

        const drive = await prisma.drive.create({
            data: {
                referenceNumber,
                title,
                departmentId,
                status,
                industryType,
                role,
                location,
                description,
                eligibility,
                link,
                driveDate: new Date(driveDate), // Ensure valid date conversion
                lastDriveDate: new Date(lastDriveDate), // Ensure valid date conversion
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
            include:{
                rounds:true
            }
        });
        
        return NextResponse.json(drives);
    } catch (error) {
        return NextResponse.json({error, message:"error "})
    }
};
