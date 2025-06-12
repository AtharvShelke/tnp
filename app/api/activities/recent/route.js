import db from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        const recentActivities = await db.activity.findMany({
            orderBy: {
                date: 'desc' // Using 'date' field instead of 'createdAt'
            },
            take: 5,
            select: {
                id: true,
                title: true,
                description: true,
                date: true, // Changed from createdAt to date
                // Note: 'type' field doesn't exist in your schema, removed it
                referenceNumber: true, // Added other fields you might want
                link: true
            }
        });
        
        const formattedActivities = recentActivities.map(activity => ({
            id: activity.id,
            message: activity.title,
            description: activity.description,
            timestamp: activity.date, // Using date field
            referenceNumber: activity.referenceNumber,
            link: activity.link
        }));
        
        return NextResponse.json(formattedActivities);
    } catch (error) {
        console.error('[ACTIVITIES_RECENT_GET]', error);
        return NextResponse.json(
            { 
                message: "Failed to fetch recent activities",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            },
            { status: 500 }
        );
    }
};