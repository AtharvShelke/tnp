import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function POST(req, { params }) {
  try {
    // Get session with proper parameters
    const session = await getServerSession(req, { authOptions });

    // Check if user is authenticated and an admin
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Only admins can verify students.' },
        { status: 403 }
      );
    }

    // Validate student ID
    const studentId = parseInt(params.id);
    if (isNaN(studentId)) {
      return NextResponse.json(
        { error: 'Invalid student ID' },
        { status: 400 }
      );
    }

    // Check if student exists
    const student = await db.student.findUnique({
      where: { id: studentId }, // Assuming 'id' is the primary key of the student table
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Check if already verified
    if (student.isVerified) {
      return NextResponse.json(
        { error: 'Student is already verified' },
        { status: 400 }
      );
    }

    // Update student verification status
    await db.student.update({
      where: { id: studentId },
      data: { isVerified: true },
    });

    return NextResponse.json(
      { message: 'Student verified successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error verifying student:', error);
    return NextResponse.json(
      { error: 'Failed to verify student' },
      { status: 500 }
    );
  }
}

// Handle non-POST requests
export async function handler(req, { params }) {
  if (req.method !== 'POST') {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }
  return POST(req, { params });
}