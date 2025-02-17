import db from "@/lib/db";
import { NextResponse } from "next/server";

// Extract userId from session in the frontend, and driveId from the request
export const POST = async (req) => {
  const data = await req.json();
  const { userId, driveId } = data;


  if (!userId || !driveId) {
    return NextResponse.json(
      { error: "Missing userId or driveId" },
      { status: 400 }
    );
  }

  try {
 
    const existingApplication = await db.driveApplication.findFirst({
      where: {
        userId: userId,
        driveId: driveId,
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { message: "Application already exists", applied: true },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Application not found", applied: false },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching applications:", error.message, error.stack);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
};

const extractUserId = (pathname) => {
  const match = pathname.match(/\/api\/drives\/application\/([^/]+)/);
  return match ? match[1] : null;
};

export const GET = async (req) => {
   const userId = extractUserId(req.nextUrl.pathname);
   if (!userId) return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
   try {
    const applications = await db.driveApplication.findMany({
      where:{
        userId:userId
      }
    });

    
    const enrichedApplications = await Promise.all(
        applications.map(async (app) => {
            
            
          

            
            
            const drive = await db.drive.findUnique({
                where: {
                    id: app.driveId,
                },
               
            });
           
            return {
              createdAt:app.createdAt,
                status:app.status,
                referenceNumber:drive.referenceNumber,
                title:drive.title
            };
        })
    );

    return NextResponse.json(enrichedApplications);
   } catch (error) {
    console.error("Error fetching data:", error);
        return NextResponse.json(
            { error: error.message || "An error occurred while fetching data" },
            { status: 500 }
        );
   }
}

export const PUT = async (req) => {
  const data = await req.json();
  const { id, ...updatedData } = data; // Extract id and keep the rest as updatedData
  console.log(data);
  console.log("ID IS : ", id);

  if (!id || !updatedData) {
    return NextResponse.json(
      { error: "Missing driveId or updatedData" },
      { status: 400 }
    );
  }

  try {
    const updatedDrive = await db.drive.update({
      where: { id },
      data: updatedData, // Only update the other fields
    });

    return NextResponse.json(updatedDrive, { status: 200 });
  } catch (error) {
    console.error("Error updating drive:", error.message, error.stack);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
};



export const DELETE = async (req) => {
  const { driveId } = await req.json();

  if (!driveId) {
    return NextResponse.json(
      { error: "Missing driveId" },
      { status: 400 }
    );
  }

  try {
    // First, delete all related applications for the drive
    await db.driveApplication.deleteMany({
      where: {
        driveId: driveId,
      },
    });

    // Then, delete the drive itself
    await db.drive.delete({
      where: {
        id: driveId,
      },
    });

    return NextResponse.json(
      { message: "Drive deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting drive:", error.message, error.stack);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
};
