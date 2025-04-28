import db from "@/lib/db";
import { NextResponse } from "next/server";

const extractDepartmentId = (pathname) => {
    const match = pathname.match(/\/api\/departments\/([^/]+)/);
    return match ? match[1] : null;
};
export const GET = async (req) => {
    const id = extractDepartmentId(req.nextUrl.pathname);
    if (!id) return NextResponse.json({ message: "Invalid ID" }, { status: 400 });

    try {
        const departments = await db.department.findUnique({
            where: { id }


        })

        return NextResponse.json(departments)
    } catch (error) {
        console.error("Error posting data:", error);
        return NextResponse.json(
            { error: error.message || "An error occurred while posting data" },
            { status: 500 }
        );
    }
    return NextResponse.json({ id })
}

// PUT method to update an existing department
export const PUT = async (req) => {
    const id = extractDepartmentId(req.nextUrl.pathname);
    if (!id) return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  
    try {
      const data = await req.json();
      // Update the department with the new data (e.g., title)
      const updatedDepartment = await db.department.update({
        where: { id },
        data, // Expecting the updated fields from the client (for example, { title: "New Title" })
      });
      return NextResponse.json(updatedDepartment);
    } catch (error) {
      console.error("Error updating department:", error);
      return NextResponse.json(
        { error: error.message || "An error occurred while updating the department" },
        { status: 500 }
      );
    }
  };

  // DELETE method to remove a department
export const DELETE = async (req) => {
    const id = extractDepartmentId(req.nextUrl.pathname);
    if (!id) return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  
    try {
      const deletedDepartment = await db.department.delete({
        where: { id },
      });
      return NextResponse.json(deletedDepartment);
    } catch (error) {
      console.error("Error deleting department:", error);
      return NextResponse.json(
        { error: error.message || "An error occurred while deleting the department" },
        { status: 500 }
      );
    }
  };