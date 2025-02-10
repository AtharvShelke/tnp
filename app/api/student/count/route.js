import db from '@/lib/db';
import { NextResponse } from 'next/server';

export const GET = async (request) => {
    try {
        const studentCount = await db.student.count();
        
        return NextResponse.json(studentCount);
    } catch (error) {
        return NextResponse.json({error, message:"error "})
    }
};