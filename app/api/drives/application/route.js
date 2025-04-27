// app/api/drives/application/route.js - Update this file to handle DELETE requests

import db from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (req) => {
    const data = await req.json();
    console.log(data)

    const driveApplication = await db.driveApplication.create({ data })
    return NextResponse.json(driveApplication)
}

export const GET = async (req) => {
    try {
        const applications = await db.driveApplication.findMany();

        if (!applications || applications.length === 0) {
            return NextResponse.json({ message: 'No applications found' }, { status: 404 });
        }

        const enrichedApplications = await Promise.all(
            applications.map(async (app) => {
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

                    const drive = await db.drive.findUnique({
                        where: {
                            id: app.driveId,
                        },
                    });

                    return {
                        id: app.id,
                        isplaced: student.placed,
                        prn: student.PRN,
                        userId: app.userId,
                        driveId: app.driveId,
                        status: app.status,
                        name: user ? user.name : 'Unknown User',
                        department: department ? department.title : 'Unknown Department',
                        referenceNumber: drive ? drive.referenceNumber : 'No Reference',
                        title: drive ? drive.title : 'No Title',
                    };
                } catch (error) {
                    console.error('Error fetching related data for application:', error);
                    return null; 
                }
            })
        );
        
        const filteredApplications = enrichedApplications.filter(app => app !== null);

        return NextResponse.json(filteredApplications);
    } catch (error) {
        return NextResponse.json(
            { error: 'An error occurred while fetching applications' },
            { status: 500 }
        );
    }
};

// Updated PUT method for updating application
export const PUT = async (req) => {
    try {
        const { 
            id, 
            status, 
            isplaced, 
            name,
            prn,
            department,
            driveId
        } = await req.json();
        
        if (!id) {
            return NextResponse.json(
                { error: 'Application ID is required' },
                { status: 400 }
            );
        }

        // Get the current application to find associated records
        const currentApp = await db.driveApplication.findUnique({
            where: { id }
        });

        if (!currentApp) {
            return NextResponse.json(
                { error: 'Application not found' },
                { status: 404 }
            );
        }

        // Update application status and driveId
        const updatedApplication = await db.driveApplication.update({
            where: { id },
            data: { 
                status,
                driveId: driveId || currentApp.driveId
            }
        });

        // Find the student record
        const student = await db.student.findUnique({
            where: { userId: currentApp.userId }
        });

        if (student) {
            // Update student information
            await db.student.update({
                where: { id: student.id },
                data: { 
                    placed: isplaced,
                    PRN: prn || student.PRN 
                }
            });

            // Find department ID by title if department is provided
            if (department) {
                const deptRecord = await db.department.findFirst({
                    where: { title: department }
                });
                
                if (deptRecord) {
                    await db.student.update({
                        where: { id: student.id },
                        data: { departmentId: deptRecord.id }
                    });
                }
            }
        }

        // Update user name if provided
        if (name) {
            await db.user.update({
                where: { id: currentApp.userId },
                data: { name }
            });
        }

        return NextResponse.json({
            message: 'Application updated successfully',
            application: updatedApplication
        });
    } catch (error) {
        console.error('Error updating application:', error);
        return NextResponse.json(
            { error: 'An error occurred while updating the application' },
            { status: 500 }
        );
    }
};

// // Fixed DELETE method that's compatible with your deleteRequest function
// export const DELETE = async (req) => {
//     try {
//         const url = new URL(req.url);
//         const id = url.searchParams.get('id');
        
//         if (!id) {
//             return NextResponse.json(
//                 { error: 'Application ID is required' },
//                 { status: 400 }
//             );
//         }

//         // Find application by ID
//         const application = await db.driveApplication.findUnique({
//             where: { id }
//         });

//         if (!application) {
//             return NextResponse.json(
//                 { error: 'Application not found' },
//                 { status: 404 }
//             );
//         }

//         // Delete the application
//         await db.driveApplication.delete({
//             where: { id }
//         });

//         return NextResponse.json({
//             message: 'Application deleted successfully'
//         });
//     } catch (error) {
//         console.error('Error deleting application:', error);
//         return NextResponse.json(
//             { error: 'An error occurred while deleting the application' },
//             { status: 500 }
//         );
//     }
// };

export const DELETE = async (req) => {
    try {
      const url = new URL(req.url);
      let id = url.searchParams.get('id');
      
      // Clean the ID by removing anything after "?" if present
      if (id && id.includes('?')) {
        id = id.split('?')[0];
      }
      
      if (!id) {
        return NextResponse.json(
          { error: 'Application ID is required' },
          { status: 400 }
        );
      }
      
      // Find application by ID
      const application = await db.driveApplication.findUnique({
        where: { id }
      });
      
      if (!application) {
        return NextResponse.json(
          { error: 'Application not found' },
          { status: 404 }
        );
      }
      
      // Delete the application
      await db.driveApplication.delete({
        where: { id }
      });
      
      return NextResponse.json({ message: 'Application deleted successfully' });
    } catch (error) {
      console.error('Error deleting application:', error);
      return NextResponse.json(
        { error: 'An error occurred while deleting the application' },
        { status: 500 }
      );
    }
  };