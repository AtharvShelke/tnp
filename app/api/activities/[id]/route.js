import db from "@/lib/db";
import {ObjectId} from 'mongodb';
import { NextResponse } from "next/server";

const extractActivityId = (pathname) => {
    const match = pathname.match(/\/api\/activities\/([^/]+)/);
    return match ? match[1] : null;
};
export const GET = async (req) => {
    const id = extractActivityId(req.nextUrl.pathname);
    if (!id) return NextResponse.json({ message: "Invalid ID" }, { status: 400 });

    try {
        const activity = await db.activity.findUnique({
            where: { id },
            include:{
                
                activityDepartments:true
            }
        })
       
        return NextResponse.json(activity)
    } catch (error) {
        console.error("Error posting data:", error);
        return NextResponse.json(
            { error: error.message || "An error occurred while posting data" },
            { status: 500 }
        );
    }
    return NextResponse.json({ id })
}

// PUT: Update an existing activity.
// The client should send a JSON body with the updated fields.
export const PUT = async (req) => {
    const id = extractActivityId(req.nextUrl.pathname);
    if (!id) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }
  
    try {
      const body = await req.json();
      const objectId = new ObjectId(id);
      // Format the date as "2024-12-11T00:00:00.000+00:00"
      const formattedDate = new Date(body.date)
        .toISOString()
        .replace("Z", "+00:00");
  
      console.log("Date ", formattedDate);
      console.log("ID ", objectId);
      console.log("Title ", body.title);
      console.log("refno ", body.referenceNumber);
      console.log("desc ", body.description);
      console.log("link  ", body.link);
      console.log("img  ", body.imageUrl);
  
      const updatedActivity = await db.activity.update({
        where: { id: objectId  },
        data: {
          title: body.title,
          referenceNumber: body.referenceNumber,
          description: body.description,
          date: formattedDate,
          link: body.link,
          imageUrl: body.imageUrl,
        },
      });
      return NextResponse.json(updatedActivity);
    } catch (error) {
      console.error('Error updating activity:', error);
      return NextResponse.json(
        { error: error.message || 'An error occurred while updating the activity' },
        { status: 500 }
      );
    }
  };
  
  
  // DELETE: Remove an activity.
  export const DELETE = async (req) => {
    const id = extractActivityId(req.nextUrl.pathname);
    if (!id) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }
  
    try {
      const deletedActivity = await db.activity.delete({
        where: { id },
      });
      return NextResponse.json(deletedActivity);
    } catch (error) {
      console.error('Error deleting activity:', error);
      return NextResponse.json(
        { error: error.message || 'An error occurred while deleting the activity' },
        { status: 500 }
      );
    }
  };