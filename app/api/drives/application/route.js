import db from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const applicationSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  driveId: z.string().min(1, "Drive ID is required"),
  status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
});

const updateSchema = z.object({
  id: z.string().min(1, "Application ID is required"),
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
  isplaced: z.boolean().optional(),
  name: z.string().min(1, "Name cannot be empty").optional(),
  prn: z.string().min(1, "PRN cannot be empty").optional(),
  department: z.string().min(1, "Department cannot be empty").optional(),
  driveId: z.string().min(1, "Drive ID cannot be empty").optional(),
});

export const POST = async (req) => {
  try {
    const data = await req.json();
    
    const validation = applicationSchema.safeParse(data);
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: "Validation failed",
          details: validation.error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 400 }
      );
    }

    const existingApp = await db.driveApplication.findFirst({
      where: {
        userId: validation.data.userId,
        driveId: validation.data.driveId
      }
    });

    if (existingApp) {
      return NextResponse.json(
        { error: "Application already exists for this user and drive" },
        { status: 409 }
      );
    }

    const driveApplication = await db.driveApplication.create({ 
      data: validation.data 
    });
    
    return NextResponse.json(driveApplication, { status: 201 });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create application' },
      { status: 500 }
    );
  }
}

export const GET = async (req) => {
  try {
    // const url = new URL(req.url);
    // const page = parseInt(url.searchParams.get('page') || '1');
    // const limit = parseInt(url.searchParams.get('limit') || '10');
    // const search = url.searchParams.get('search') || '';
    // const status = url.searchParams.get('status') || '';
    
    // const skip = (page - 1) * limit;

    // const whereClause = {
    //   ...(search && {
    //     OR: [
    //       { user: { name: { contains: search, mode: 'insensitive' } } },
    //       { user: { Student: { some: { PRN: { contains: search, mode: 'insensitive' } } } } },
    //       { drive: { 
    //         OR: [
    //           { title: { contains: search, mode: 'insensitive' } },
    //           { referenceNumber: { contains: search, mode: 'insensitive' } }
    //         ]
    //       } }
    //     ]
    //   }),
    //   ...(status && { status })
    // };

    // const [applications, total] = await Promise.all([
    //   db.driveApplication.findMany({
    //     where: whereClause,
    //     skip,
    //     take: limit,
    //     orderBy: { createdAt: 'desc' },
    //     include: {
    //       user: {
    //         include: {
    //           Student: {
    //             include: {
    //               department: true
    //             }
    //           }
    //         }
    //       },
    //       drive: {
    //         select: {
    //           title: true,
    //           referenceNumber: true
    //         }
    //       }
    //     }
    //   }),
    //   db.driveApplication.count({ where: whereClause })
    // ]);

    // const enrichedApplications = applications.map(app => ({
    //   id: app.id,
    //   isplaced: app.user?.Student?.[0]?.placed || false,
    //   prn: app.user?.Student?.[0]?.PRN || '',
    //   userId: app.userId,
    //   driveId: app.driveId,
    //   status: app.status,
    //   name: app.user?.name || 'Unknown User',
    //   department: app.user?.Student?.[0]?.department?.title || 'Unknown Department',
    //   referenceNumber: app.drive?.referenceNumber || 'No Reference',
    //   title: app.drive?.title || 'No Title',
    // }));

    // return NextResponse.json({
    //   data: enrichedApplications,
    //   pagination: {
    //     page,
    //     limit,
    //     total,
    //     totalPages: Math.ceil(total / limit),
    //   }
    // });
    const data = await db.driveApplication.findMany({
      orderBy: { createdAt: 'desc' },
        include: {
          user: {
            include: {
              Student: {
                include: {
                  department: true
                }
              }
            }
          },
          drive: {
            select: {
              title: true,
              referenceNumber: true
            }
          }
        }
    })
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch applications' },
      { status: 500 }
    );
  }
};

export const PUT = async (req) => {
  try {
    const rawData = await req.json();
    
    const validation = updateSchema.safeParse(rawData);
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: "Validation failed",
          details: validation.error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 400 }
      );
    }
    
    const { id, ...data } = validation.data;

    const result = await db.$transaction(async (tx) => {
      const currentApp = await tx.driveApplication.findUnique({ where: { id } });
      if (!currentApp) throw new Error('Application not found');

      const updatedApplication = await tx.driveApplication.update({
        where: { id },
        data: { 
          status: data.status,
          driveId: data.driveId || currentApp.driveId
        }
      });

      if (data.isplaced !== undefined || data.prn || data.department) {
        const student = await tx.student.findFirst({
          where: { userId: currentApp.userId }
        });

        if (student) {
          let updateData = {};
          if (data.isplaced !== undefined) updateData.placed = data.isplaced;
          if (data.prn) updateData.PRN = data.prn;

          if (data.department) {
            const deptRecord = await tx.department.findFirst({
              where: { title: data.department }
            });
            if (!deptRecord) throw new Error('Department not found');
            updateData.departmentId = deptRecord.id;
          }

          await tx.student.update({
            where: { id: student.id },
            data: updateData
          });
        }
      }

      if (data.name) {
        await tx.user.update({
          where: { id: currentApp.userId },
          data: { name: data.name }
        });
      }

      return updatedApplication;
    });

    return NextResponse.json({
      message: 'Application updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Error updating application:', error);
    const status = error.message === 'Application not found' ? 404 : 500;
    return NextResponse.json(
      { error: error.message || 'Failed to update application' },
      { status }
    );
  }
};

export const DELETE = async (req) => {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      );
    }
    
    const application = await db.driveApplication.findUnique({ where: { id } });
    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }
    
    await db.driveApplication.delete({ where: { id } });
    
    return NextResponse.json({ 
      message: 'Application deleted successfully',
      data: { id }
    });
  } catch (error) {
    console.error('Error deleting application:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete application' },
      { status: 500 }
    );
  }
};