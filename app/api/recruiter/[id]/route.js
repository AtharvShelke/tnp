import db from "@/lib/db";
import { NextResponse } from "next/server";

const extractRecruiterId = (pathname) => {
    const match = pathname.match(/\/api\/recruiter\/([^/]+)/);
    return match ? match[1] : null;
};

export const GET = async (request, {params}) => {
    try {
        const {id} = await params;

        if (!id) {
            return NextResponse.json(
                { error: "Recruiter ID is required" },
                { status: 400 }
            );
        }

        const recruiter = await db.recruiter.findUnique({
            where: { userId: id },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        pfp: true
                    }
                }
            }
        });

        if (!recruiter) {
            return NextResponse.json(
                { error: "Recruiter not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(recruiter);
    } catch (error) {
        console.error("Error fetching recruiter data:", error);
        return NextResponse.json(
            { error: "An error occurred while fetching recruiter data" },
            { status: 500 }
        );
    }
};

export const PUT = async (request) => {
    try {
        const id = extractRecruiterId(request.nextUrl.pathname);
        const data = await request.json();

        if (!id) {
            return NextResponse.json(
                { error: "Recruiter ID is required" },
                { status: 400 }
            );
        }

        const updatedRecruiter = await db.recruiter.update({
            where: { id },
            data: {
                company: data.company,
               
                status: data.status
            }
        });

        return NextResponse.json(updatedRecruiter);
    } catch (error) {
        console.error("Error updating recruiter:", error);
        return NextResponse.json(
            { error: "An error occurred while updating recruiter" },
            { status: 500 }
        );
    }
};

export const DELETE = async (request) => {
    try {
        const id = extractRecruiterId(request.nextUrl.pathname);

        if (!id) {
            return NextResponse.json(
                { error: "Recruiter ID is required" },
                { status: 400 }
            );
        }

        await db.recruiter.delete({
            where: { id }
        });

        return NextResponse.json(
            { message: "Recruiter deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting recruiter:", error);
        return NextResponse.json(
            { error: "An error occurred while deleting recruiter" },
            { status: 500 }
        );
    }
};