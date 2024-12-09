import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const data = await request.json();
        console.log('backend data:', data)
        const {
            referenceNumber,
            title,
            description,
            link,
            date,
            imageUrl,
            activityDepartments
        } = data;
        const activity = await db.activity.create({
            data: {
                referenceNumber,
                title,
                description,
                link,
                date: new Date(date),
                imageUrl,
                activityDepartments :{
                    create: activityDepartments.map((round) => ({
                        title: round.title,
                    })),
                },
            }
        })
        return NextResponse.json({activity})
    } catch (error) {
        return NextResponse.json({
            error,
            message: 'Failed to create a activity'
        }, {
            status: 500
        })
    }
}
export const GET = async (request) => {
    try {
        const activities = await db.activity.findMany({
            include:{
                
                activityDepartments:true
            }
        });
        
        return NextResponse.json(activities);
    } catch (error) {
        return NextResponse.json({ error: error.message, message: "error" })
    }
};