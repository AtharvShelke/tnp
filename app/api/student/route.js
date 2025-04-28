import db from '@/lib/db';
import { stringToArray } from '@/lib/splitStringToArray';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const data = await req.json();
        const {
            PRN,
            phone,
            address,
            departmentId,
            gender,
            dob,
            passOutYear,
            cgpa,
            otherInterests,
            language,
            githubLink,
            linkedIn,
            about,
            liveBack,
            deadBack,
            yearGap,
            preference1,
            preference2,
            preference3,
            admissionType,
            education = [],
            technicalSkill = [],
            project = [],
            studentDocument = [],
            userId,
            isProfileComplete,
            placed,
        } = data;

        console.log("Received backend data: ", data);

        // Validate required IDs
        if (!userId || userId === "") {
            return NextResponse.json(
                { error: "User ID is required and cannot be empty" },
                { status: 400 }
            );
        }

        if (!departmentId || departmentId === "") {
            return NextResponse.json(
                { error: "Department ID is required and cannot be empty" },
                { status: 400 }
            );
        }

        // Create student data object
        const studentData = {
            PRN,
            phone,
            address,
            gender,
            dob: new Date(dob),
            passOutYear,
            cgpa,
            otherInterests: stringToArray(otherInterests),
            language: stringToArray(language),
            githubLink,
            linkedIn,
            about,
            liveBack,
            deadBack,
            yearGap,
            preference1,
            preference2,
            preference3,
            admissionType,
            isProfileComplete,
            placed,
            education: {
                create: education.map((item) => ({
                    title: item.title,
                    address: item.address,
                    institute: item.institute,
                    marks: item.marks,
                    year: item.year,
                })),
            },
            technicalSkill: {
                create: technicalSkill.map((item) => ({
                    domain: item.domain,
                    name: stringToArray(item.name),
                })),
            },
            project: {
                create: project.map((item) => ({
                    name: item.name,
                    type: item.type,
                    description: item.description,
                    technologies: stringToArray(item.technologies),
                    role: item.role,
                    githubLink: item.githubLink,
                })),
            },
            studentDocument: {
                create: studentDocument.map((item) => ({
                    title: item.title,
                    link: item.link,
                })),
            },
            user: {
                connect: {
                    id: userId,
                },
            },
            department: {
                connect: {
                    id: departmentId,
                },
            },
        };

        const result = await db.$transaction([
            // Create the student
            db.student.create({
                data: studentData,
            }),
            // Update the user role
            db.user.update({
                data: {
                    role: "STUDENT",
                },
                where: {
                    id: userId,
                },
            }),
        ]);

        const [student, user] = result;

        return NextResponse.json({ student, user });
    } catch (error) {
        // Log the complete error object
        console.error("Error in POST handler:", {
            message: error.message,
            stack: error.stack,
            name: error.name,
            code: error.code,
            meta: error.meta,
        });

        if (error.code === "P2002") {
            return NextResponse.json(
                {
                    error: "A unique constraint violation occurred.",
                    details: error.meta?.target,
                },
                { status: 400 }
            );
        }

        if (error.code === "P2023") {
            return NextResponse.json(
                {
                    error: "Invalid ID format. MongoDB ObjectIDs must be 12-byte hex strings.",
                    details: error.meta,
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                error: error.message || "An error occurred while processing the request",
                details: error,
            },
            { status: 500 }
        );
    }
}

export const GET = async (request) => {
    try {
        const students = await db.student.findMany({
            include:{
                technicalSkill:true,
                education:true,
                project:true,
                studentDocument:true
            }
        });
        
        return NextResponse.json(students);
    } catch (error) {
        return NextResponse.json({error, message:"error "})
    }
};