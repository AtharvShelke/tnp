import db from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
    const { id } = await params;
    if (!id) return NextResponse.json({ message: "Invalid ID" }, { status: 400 });

    try {
        const student = await db.student.findUnique({
            where: { userId: id },
            include: {
              user:{
                select:{
                  email:true,
                pfp:true,
                role:true,
                name:true,
                ShortlistedStudents:true
                }
              },
              department:true,
                education: true,
                technicalSkill: true,
                project: true,
                studentDocument: true,
                
            }
        });

        if (!student) {
            return NextResponse.json({ message: "Student not found" }, { status: 404 });
        }
       
        return NextResponse.json(student);
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json(
            { error: error.message || "An error occurred while fetching data" },
            { status: 500 }
        );
    }
};

export const PUT = async (req, { params }) => {
  const { id } = await params;
  
  if (!id) {
    return NextResponse.json(
      { message: "Student ID is required" },
      { status: 400 }
    );
  }

  let updateData;
  try {
    updateData = await req.json();
    if (!updateData || typeof updateData !== 'object') {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("JSON Parse Error:", error);
    return NextResponse.json(
      { message: "Invalid JSON format" },
      { status: 400 }
    );
  }

  try {
    // Check if student exists
    const existingStudent = await db.student.findUnique({
      where: { userId: id },
    });

    if (!existingStudent) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    // Prepare the update data
    const dataToUpdate = {
      ...updateData,
      // Handle department relation
      department: updateData.departmentId ? {
        connect: { id: updateData.departmentId }
      } : undefined
    };

    // Remove fields that shouldn't be directly updated
    delete dataToUpdate.departmentId;
    delete dataToUpdate.id;
    delete dataToUpdate.userId;
    delete dataToUpdate.user;

    // Process relations
    const processRelation = (field) => {
      if (!updateData[field] || typeof updateData[field] !== 'object') return undefined;
      
      return {
        deleteMany: {},
        create: Array.isArray(updateData[field].create) ? 
          updateData[field].create : 
          [updateData[field].create]
      };
    };

    const relations = ['education', 'technicalSkill', 'project', 'studentDocument'];
    relations.forEach(relation => {
      const processed = processRelation(relation);
      if (processed) {
        dataToUpdate[relation] = processed;
      }
    });

    // Update the student record
    const updatedStudent = await db.student.update({
      where: { userId: id },
      data: dataToUpdate,
      include: {
        education: true,
        technicalSkill: true,
        project: true,
        studentDocument: true,
        department: true
      },
    });

    return NextResponse.json(updatedStudent);
  } catch (error) {
    console.error("[STUDENT_PUT]", error);
    return NextResponse.json(
      { 
        message: "Internal server error",
        error: error.message 
      },
      { status: 500 }
    );
  }
};
export const DELETE = async (req, { params }) => {
    const { id } =await params;
    if (!id) return NextResponse.json({ message: "Invalid ID" }, { status: 400 });

    try {
        // First check if student exists
        const existingStudent = await db.student.findUnique({
            where: { userId: id }
        });

        if (!existingStudent) {
            return NextResponse.json({ message: "Student not found" }, { status: 404 });
        }

        // Delete the student and related records (cascade delete should handle this if set up in schema)
        await db.student.delete({
            where: { userId: id }
        });

        return NextResponse.json({ message: "Student deleted successfully" });
    } catch (error) {
        console.error("[STUDENT_DELETE]", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
};