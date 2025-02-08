import db from "@/lib/db";
import { NextResponse } from "next/server";

// individual student logic
export const GET = async (request) => {
    const id  = ((request.nextUrl.pathname).split('/'))[3];
    const application = await db.driveApplication.findMany({
        where:{
            userId:id
        }
    })
    console.log(application)
    return NextResponse.json({application});
}