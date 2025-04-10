import db from '@/lib/db';
import { NextResponse } from 'next/server';

export const GET = async (request) => {
    try {
        const studentCount = await db.student.count();
        const activityCount = await db.activity.count();
        const bookletCount = await db.booklet.count();
        const recruiterCount = await db.recruiter.count(); 
        const coordinatorCount = await db.coordinator.count(); 
        const driveCount = await db.drive.count();

        return NextResponse.json({
            studentCount,
            activityCount,
            bookletCount,
            recruiterCount,
            coordinatorCount,
            driveCount,
        });
    } catch (error) {
        console.error('GET /api/counts error:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Unknown error',
            message: 'Failed to fetch counts',
        }, { status: 500 });
    }
};
