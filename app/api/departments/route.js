import db from "@/lib/db";
import { NextResponse } from "next/server";

const handleError = (error, message, status = 500) => {
    console.error(error);
    return NextResponse.json({ error: error.message || error, message }, { status });
};


export const POST = async (request) => {
    try {
        const data = await request.json();
        const department = await db.department.create({ data });

        console.log('Department created:', department);  
        return NextResponse.json(department); 
    } catch (error) {
       console.log(error)
    }
};


export const GET = async (request) => {
    try {
        const departments = await db.department.findMany();
        
        return NextResponse.json(departments);
    } catch (error) {
        return NextResponse.json({error, message:"error "})
    }
};

