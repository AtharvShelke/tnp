import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const data = await request.json();
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
                activityDepartments: {
                    create: activityDepartments?.map((dept) => ({
                        departmentId: dept.departmentId,
                        // Include other department fields if needed
                    })) || [],
                },
            },
            include: {
                activityDepartments: true
            }
        });

        return NextResponse.json(activity, { status: 201 });

    } catch (error) {
        console.error('[ACTIVITIES_POST]', error);
        return NextResponse.json(
            { 
                message: "Failed to create activity",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            },
            { status: 500 }
        );
    }
}

export const GET = async (request) => {
    try {
        const { searchParams } = new URL(request.url);
        
        // Query parameters
        const page = searchParams.get('page');
        const limit = searchParams.get('limit');
        const departmentId = searchParams.get('departmentId');

        // Base query options
        const queryOptions = {
            include: {
                activityDepartments: true,
            },
            orderBy: {
                date: 'desc', // Using 'date' field from schema
            },
        };

        // Add pagination if requested
        if (page && limit) {
            const pageNumber = parseInt(page, 10);
            const limitNumber = parseInt(limit, 10);
            queryOptions.skip = (pageNumber - 1) * limitNumber;
            queryOptions.take = limitNumber;
        }

        // Filter by department if specified
        if (departmentId) {
            queryOptions.where = {
                activityDepartments: {
                    some: {
                        departmentId,
                    },
                },
            };
        }

        const activities = await db.activity.findMany(queryOptions);

        // Get total count for pagination metadata
        let totalCount = null;
        if (page && limit) {
            totalCount = await db.activity.count({
                where: queryOptions.where,
            });
        }

        const response = { data: activities };
        if (totalCount !== null) {
            response.meta = {
                total: totalCount,
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
            };
        }

        return NextResponse.json(response);

    } catch (error) {
        console.error('[ACTIVITIES_GET]', error);
        return NextResponse.json(
            { 
                message: "Internal server error",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            },
            { status: 500 }
        );
    }
};