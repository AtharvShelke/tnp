import db from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (request) => {
    try {
        let data;
        try {
            data = await request.json();
        } catch (error) {
            return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
        }

        const { userId, phone, about, linkedIn, company, companyDescription, isProfileComplete } = data;

        console.log("Backend received data: ", data);

        // ✅ Check required fields
        if (!userId || !phone || !linkedIn || !company) {
            return NextResponse.json(
                { error: "Missing required fields. userId, phone, linkedIn, and company are mandatory." },
                { status: 400 }
            );
        }

        // ✅ Ensure user exists
        const user = await db.user.findUnique({ where: { id: userId } });
        if (!user) {
            return NextResponse.json({ error: "User not found." }, { status: 404 });
        }

        // ✅ Check if recruiter already exists
        const existingRecruiter = await db.recruiter.findUnique({ where: { userId } });
        if (existingRecruiter) {
            return NextResponse.json({ error: "Recruiter profile already exists." }, { status: 409 });
        }

        // ✅ Create new recruiter profile
        const newRecruiter = await db.recruiter.create({
            data: {
                userId,
                phone,
                about,
                linkedIn,
                company,
                companyDescription,
                isProfileComplete: true,
            },
        });

        // ✅ Update user role if necessary
        if (!["RECRUITER"].includes(user.role)) {
            await db.user.update({
                where: { id: userId },
                data: { role: "RECRUITER" },
            });
        }

        return NextResponse.json(
            { message: "Recruiter profile created successfully!", recruiter: newRecruiter },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error creating recruiter:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
};

export const GET = async () => {
    try {
        const recruiters = await db.recruiter.findMany();
        return NextResponse.json(recruiters, { status: 200 });
    } catch (error) {
        console.error("Error fetching recruiters:", error);
        return NextResponse.json(
            { message: "Failed to fetch recruiters. Please try again later." },
            { status: 500 }
        );
    }
};
