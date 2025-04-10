import db from "@/lib/db";
import { NextResponse } from "next/server";

// Optional: A helper function to extract the coordinator ID from the URL.
const extractCoordinatorId = (pathname) => {
  const match = pathname.match(/\/api\/coordinator\/([^/]+)/);
  return match ? match[1] : null;
};

// Using named exports with async functions
export async function GET(req) {
  const id = extractCoordinatorId(req.nextUrl.pathname);
  if (!id) return NextResponse.json({ message: "Invalid ID" }, { status: 400 });

  try {
    const coordinator = await db.coordinator.findUnique({
      where: { userId: id },
    });

    if (coordinator) {
      const department = await db.department.findUnique({
        where:{
          id:coordinator.departmentId
        }
      })
      const data = {
        
        coordinator,
        dept: department.title
      }
      return NextResponse.json({ isCoordinator: true, data:data });
    } else {
      const user = await db.user.findUnique({
        where: { id: id },
      });
     
      if (user) {
        return NextResponse.json({ isCoordinator: false, data:user });
      } else {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred while fetching data" },
      { status: 500 }
    );
  }
}
export async function DELETE(req) {
    const id = req.nextUrl.pathname.split("/").pop();
    if (!id) return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    
    try {
      const coordinator = await db.coordinator.findUnique({ where: { userId: id } });
      console.log("Found coordinator:", coordinator);
    
      if (coordinator) {
        await db.coordinator.delete({ where: { userId: id } });
        await db.user.delete({ where: { id } });

        return NextResponse.json({ message: "Coordinator deleted successfully" }, { status: 200 });
      } else {
        return NextResponse.json({ message: "Coordinator not found" }, { status: 404 });
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      return NextResponse.json({ message: error.message || "Error deleting coordinator" }, { status: 500 });
    }
  }
  



export async function PUT(req) {
    const id = req.nextUrl.pathname.split("/").pop();
    
    // Validate if ID exists
    if (!id) {
        return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    try {
        const { name, email, phoneNo } = await req.json();
        console.log("Updating user:", id, "with email:", email);

        // Update coordinator table
        await db.coordinator.update({
            where: { userId: id }, // Use ID as a string (no ObjectId conversion needed)
            data: { phone: phoneNo },
        });

        // Update user table
        await db.user.update({
            where: { id: id }, // Use ID as a string
            data: { name, email },
        });

        console.log("Updating user:", id, "with email:", email);

        return NextResponse.json({
            message: "Coordinator updated successfully",
            data: { id, name, email, phoneNo },
        });
    } catch (error) {
        console.error("Error updating data:", error);
        return NextResponse.json(
            { error: error.message || "An error occurred while updating data" },
            { status: 500 }
        );
    }
}
