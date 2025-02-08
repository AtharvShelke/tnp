import UpdateStudent from "@/app/(portal)/student/profile/edit/[id]/page";
import db from "@/lib/db";
import { NextResponse } from "next/server";

const extractStudentId = (pathname) => {
    const match = pathname.match(/\/api\/student\/([^/]+)/);
    return match ? match[1] : null;
};

export const GET = async (req) => {
    const id = extractStudentId(req.nextUrl.pathname);
    if (!id) return NextResponse.json({ message: "Invalid ID" }, { status: 400 });

    try {
        const student = await db.student.findUnique({
            where: { userId: id },
            include: {
                education: true,
                technicalSkill: true,
                project: true,
                studentDocument: true
            }
        });

        return NextResponse.json(student)
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json(
            { error: error.message || "An error occurred while fetching data" },
            { status: 500 }
        );
    }
};

// export const PUT = async(req)=>{
//     const id = extractStudentId(req.nextUrl.pathname);
//     if (!id) {
//         return NextResponse.json(
//             { message: "Invalid ID: The ID parameter is missing or malformed" },
//             { status: 400 }
//         )
//     }
//     try {
//         const data = await req.json();
//         console.log("Recieved data:", data);
//         const {id:removedId, ...updateData} = data;
//         // if(removedId) {
//         //     return NextResponse.json(
//         //         { message: "Invalid update data: 'id' field cannot be updated" },
//         //         { status: 400 }
//         //     );
//         // }
//         const student = await db.student.findUnique({where:{id:userId}});
//         if (!student) {
//             return NextResponse.json(
//                 { message: `student not found with ID: ${id}` },
//                 { status: 404 }
//             );
//         }
//         const updateStudent = await db.student.update({
//             where:{id},
//             data :updateData,
//         })
//         return NextResponse.json(updateStudent)
//         // return NextResponse.json(data)
//     } catch (error) {
//         if (error instanceof SyntaxError && error.message.includes("JSON")) {
//             return NextResponse.json(
//                 { message: "Invalid JSON in request body" },
//                 { status: 400 }
//             );
//         }

//         if (error.code) {
//             return NextResponse.json(
//                 { message: `Database error: ${error.code}` },
//                 { status: 500 }
//             );
//         }

//     }
// }
export const PUT = async (request) => {
    try {
        const userId = extractStudentId(request.nextUrl.pathname);

        if (!userId) {
            return NextResponse.json(
                { message: "Invalid ID: The ID parameter is missing or malformed" },
                { status: 400 }
            );
        }

        const data = await request.json();

        if ("id" in data) {
            return NextResponse.json(
                { message: "Invalid update: 'id' field cannot be modified" },
                { status: 400 }
            );
        }

        const student = await db.student.findUnique({ where: { userId } });

        if (!student) {
            return NextResponse.json(
                { message: `Student not found with ID: ${userId}` },
                { status: 404 }
            );
        }

        const updateStudent = await db.student.update({
            where: { userId },
            data
        });

        return NextResponse.json({ updateStudent });

    } catch (error) {
        console.error("Update Error:", error);

        if (error instanceof SyntaxError && error.message.includes("JSON")) {
            return NextResponse.json(
                { message: "Invalid JSON in request body" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: `Internal Server Error: ${error.message}` },
            { status: 500 }
        );
    }
};