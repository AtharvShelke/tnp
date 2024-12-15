import db from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (request) => {
    try {
        const data = await request.json();
        
        const coordinator = await db.coordinator.create({ data })
           
        // console.log('coordinator created:', coordinator);  
        return NextResponse.json(coordinator); 
    } catch (error) {
       console.log(error)
    }
};

export const GET = async (request) => {
    try {
        const coordinators = await db.coordinator.findMany();
        
        return NextResponse.json(coordinators);
    } catch (error) {
        return NextResponse.json({ error: error.message, message: "error" })
    }
};