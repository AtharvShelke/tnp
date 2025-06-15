import db from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (request) => {
    try {
        const data = await request.json();

        // Validate request body
        if (!data || !data.studentId || !data.recruiterId) {
            return NextResponse.json({ error: "Student ID and Recruiter ID are required" }, { status: 400 });
        }

        const { studentId, recruiterId } = data;

        // Check if student exists
        const student = await db.student.findUnique({
            where: { userId: studentId },
        });
        if (!student) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 });
        }

        // Check if recruiter exists
        const recruiter = await db.recruiter.findUnique({
            where: { userId: recruiterId },
        });
        if (!recruiter) {
            return NextResponse.json({ error: "Recruiter not found" }, { status: 404 });
        }

        // Check if student is already shortlisted by this recruiter
        const existingShortlist = await db.shortlistedStudents.findFirst({
            where: { userId: studentId, recruiterId },
        });

        if (existingShortlist) {
            return NextResponse.json({ error: "Student already shortlisted by this recruiter" }, { status: 400 });
        }

        // Create shortlist entry
        const shortlist = await db.shortlistedStudents.create({
            data: {
                userId: studentId,
                recruiterId,
            },
        });

        return NextResponse.json({ message: "Student successfully shortlisted", shortlist }, { status: 201 });

    } catch (error) {
        console.error("Error in POST /shortlist:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
};

// get all shortlisted students


export const GET = async (req) => {
    try {
        const shortlistedStudents = await db.shortlistedStudents.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        pfp: true,
                        role: true,
                        Student: {
                            include: {
                                department: true
                            }
                        },
                    },
                },
                recruiter: true,
            },
        });

        return NextResponse.json(shortlistedStudents);
    } catch (error) {
        console.error('Error fetching shortlisted students:', error);
        return NextResponse.json(
            { error: 'Failed to fetch shortlisted students' },
            { status: 500 }
        );
    }
};