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