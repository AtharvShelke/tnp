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

    const application = await db.driveApplication.create({
      data:{

        userId:userId,
        driveId:driveId
      }
    })
    return (
      NextResponse.json({message:"Applied successfully", applied:true}, {status:200})
    )
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
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId query parameter" },
        { status: 400 }
      );
    }

    const applications = await db.driveApplication.findMany({
      where: { userId }
    });

    const enrichedApplications = await Promise.all(
      applications.map(async (app) => {
        const drive = await db.drive.findUnique({
          where: { id: app.driveId },
        });
        
        return drive ? {
          createdAt: app.createdAt,
          status: app.status,
          referenceNumber: drive.referenceNumber,
          title: drive.title
        } : null;
      })
    ).then(results => results.filter(Boolean));

    return NextResponse.json(enrichedApplications);
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const PUT = async (req) => {
  try {
    const data = await req.json();
    const { id, ...updatedData } = data;

    if (!id) {
      return NextResponse.json(
        { error: "Missing drive ID" },
        { status: 400 }
      );
    }

    if (Object.keys(updatedData).length === 0) {
      return NextResponse.json(
        { error: "No data provided for update" },
        { status: 400 }
      );
    }

    const updatedDrive = await db.drive.update({
      where: { id },
      data: updatedData,
    });

    return NextResponse.json(updatedDrive);
  } catch (error) {
    console.error("Error in PUT handler:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};



export const DELETE = async (req) => {
  try {
    const data = await req.json();
    const { driveId } = data;

    if (!driveId) {
      return NextResponse.json(
        { error: "Missing driveId" },
        { status: 400 }
      );
    }

    // Verify drive exists first
    const driveExists = await db.drive.findUnique({
      where: { id: driveId },
    });

    if (!driveExists) {
      return NextResponse.json(
        { error: "Drive not found" },
        { status: 404 }
      );
    }

    await db.$transaction([
      db.driveApplication.deleteMany({
        where: { driveId },
      }),
      db.drive.delete({
        where: { id: driveId },
      }),
    ]);

    return NextResponse.json(
      { message: "Drive deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE handler:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
