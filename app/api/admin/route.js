import db from "@/lib/db";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const data = await request.json();
        console.log('Backend Data: ', data)
        const { email, password, confirmPassword, role, isProfileComplete } = data;

        // password validation 
        if (password !== confirmPassword) {
            return NextResponse.json({ message: "Passwords do not match." }, { status: 400 });
        }
        //user validation
        const existingUser = await db.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return NextResponse.json({ message: "User with this email already exists." }, { status: 409 })

        }
        //password hashing
        const saltRounds = 10;
        const hashedPassword = await hash(password, saltRounds)

        //new user
        const newUser = await db.user.create({
            data: {
                email,
                password: hashedPassword,
                role,
                isProfileComplete
            }
        })
        if (role === "COORDINATOR") {
            // Create an approval request for the coordinator role
            await db.coordinatorApproval.create({
                data: {
                    coordinatorId: newUser.id,
                    adminId: "some-admin-id", // Replace with logic to fetch the admin ID
                },
            });
        }
            return NextResponse.json({ message: "User created successfully", user: newUser }, { status: 201 })
        }
    catch (error) {
            console.error("Error creating user:", error);
            return NextResponse.json(
                { message: "Internal server error." },
                { status: 500 }
            );
        }
    } 