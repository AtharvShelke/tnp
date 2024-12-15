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
            dob ,
            passOutYear,
            cgpa,
            otherInterests,
            language,
            githubLink,
            linkedIn,
            about,
            liveBack,
            deadBack,
            education = [],
            technicalSkill = [],
            project = [],
            studentDocument = [],
            userId,
            isProfileComplete,
            placed,
        } = data;

        console.log("Received backend data: ", data);

        const result = await db.$transaction([
            // Create the student
            db.student.create({
                data: {
                    PRN,
                    phone,
                    address,
                    
                    gender,
                    dob:new Date(dob),
                    passOutYear,
                    cgpa,
                    otherInterests:stringToArray(otherInterests),
                    language:stringToArray(language),
                    githubLink,
                    linkedIn,
                    about,
                    liveBack,
                    deadBack,
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
                    studentDocuments: {
                        create: studentDocuments.map((item) => ({
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
                },
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
    
        return NextResponse.json(
            {
                error: error.message || "An error occurred while processing the request",
                details: error,
            },
            { status: 500 }
        );
    }
}
