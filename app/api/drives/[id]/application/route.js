import db from "@/lib/db";
import {ObjectId} from 'mongodb';
import { NextResponse } from "next/server";

const extractDriveId = (pathname) => {
    const match = pathname.match(/\/api\/drives\/([^/]+)/);
    return match ? match[1] : null;
};

export const GET = async (req) => {
    const driveId = extractDriveId(req.nextUrl.pathname);
    try {
        const driveApplication = await db.driveApplication.findMany({
            where: {
                driveId: driveId
            }
        })
        const finalData = await Promise.all(
            driveApplication.map(async (app) => {
                try {
                    const user = await db.user.findUnique({
                        where: {
                            id: app.userId,
                        },
                    });

                    const student = await db.student.findUnique({
                        where: {
                            userId: app.userId,
                        },
                    });

                    const department = student ? await db.department.findUnique({
                        where: {
                            id: student.departmentId,
                        },
                    }) : null;

                

                    return {
                        ...student,
                        userId: app.userId,
                        email:user.email,
                        
                        status: app.status,
                        name: user ? user.name : 'Unknown User',
                        department: department ? department.title : 'Unknown Department',
                        
                    };
                } catch (error) {
                    console.error('Error fetching related data for application:', error);
                    return null;
                }
            })
        )
        return NextResponse.json(finalData)
    } catch (error) {
        console.error("Error fetching data:", error);
        console.error("Error message:", error.message);
        console.error("Error stack trace:", error.stack);

        return NextResponse.json(
            {
                error: error.message || "An error occurred while fetching data",
                stack: error.stack || null,
            },
            { status: 500 }
        );
    }
}

export const PUT = async (req) => {
    try {
      // Extracting ID from the URL
      const id = extractDriveId(req.nextUrl.pathname);
      
      // Await to parse the JSON body
      const { name, email, phone, address, dob, gender, cgpa, admissionType, passOutYear, liveBack, deadBack, yearGap, preference1, preference2, preference3, placed} = await req.json();
  
      if (!id || !ObjectId.isValid(id)) {
        return NextResponse.json({ message: "Invalid Id Provided" }, { status: 400 });
      }
  
      // Creating an ObjectId instance from the id string
      const objectId = new ObjectId(id);
      console.log("Object Id Is: ", objectId);
  
      // Querying the database using the objectId
      const findStud = await db.student.findUnique({
        where: { userId: objectId }
      });
  
      if (!findStud) {
        return NextResponse.json({ message: "No Student Application Found" }, { status: 404 });
      }

      console.log(dob);
      // Convert the dob to ISO format (YYYY-MM-DD)
    const formattedDob = new Date(dob).toISOString();
    console.log(formattedDob)
  
      // Updating the student data with the new phone number
      const updateStudent = await db.student.update({
        where: { userId: objectId },
        data: {
          phone,
          address,
          dob: formattedDob,
          gender,
          cgpa,
          admissionType,
          passOutYear,
          liveBack,
          deadBack,
          yearGap,
          preference1,
          preference2,
          preference3,
          placed
        }
      });

      const updateUser = await db.user.update({
        where: { id: objectId},
        data: {
            name,
            email
        }
      })
  
      return NextResponse.json({ message: "Drive Application Updated" }, { status: 200 });
    } catch (error) {
      console.error("Error processing the request: ", error);
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
  };
  

  export const DELETE = async (req) => {
    try {
      const id = extractDriveId(req.nextUrl.pathname);
  
      // Check if ID is valid
      if (!id || !ObjectId.isValid(id)) {
        return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
      }
  
      // Create ObjectId from the string ID
      const objectId = new ObjectId(id);
      console.log("Object ID ",objectId);
  
      // Delete the drive application by userId
      await db.driveApplication.deleteMany({
        where: { userId: objectId }
      });
  
      // If successful, return success message
      return NextResponse.json({ message: "Drive Application Deleted Successfully" }, { status: 200 });
  
    } catch (error) {
      console.error("Error deleting the application: ", error);
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
  };
  