import db from '@/lib/db';
import { NextResponse } from 'next/server';

export const GET = async (request) => {
    try {
        const recruiterCount = await db.recruiter.count();	        
        return NextResponse.json(recruiterCount);
    } catch (error) {
        return NextResponse.json({error, message:"error "})
    }
};