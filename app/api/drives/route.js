import db from '@/lib/db';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const data = await req.json();
        console.log(data)
        const {
            referenceNumber,
            title,
            driveDepartments,
            status,
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
            creatorId
        } = data;

        const drive = await prisma.drive.create({
            data: {
                referenceNumber,
                title,
                driveDepartments: {
                    create: driveDepartments.map((round) => ({
                        title: round.title,
                    })),
                },
                status,
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
                rounds:true,
                driveDepartments:true
            }
        });
        
        return NextResponse.json(drives);
    } catch (error) {
        return NextResponse.json({error, message:"error "})
    }
};



