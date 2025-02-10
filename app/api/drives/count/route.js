import db from '@/lib/db';
import { NextResponse } from 'next/server';

export const GET = async (request) => {
    try {
        const driveCount = await db.drive.count();
        
        return NextResponse.json(driveCount);
    } catch (error) {
        return NextResponse.json({error, message:"error "})
    }
};