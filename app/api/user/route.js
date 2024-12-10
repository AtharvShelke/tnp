import db from "@/lib/db";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const data = await request.json();
        console.log('Backend Data: ', data)
        const { email, name, password, confirmPassword, role, pfp } = data;
        
        // password validation
        if (password !== confirmPassword) {
            return NextResponse.json({ message: "Passwords do not match." }, { status: 400 });
        }
        //user validation
        const existingUser = await db.user.findUnique({
            where:{email},
        });
        if (existingUser) {
            return NextResponse.json({message:"User with this email already exists."}, {status:409})

        }
        //password hashing
        const saltRounds = 10;
        const hashedPassword = await hash(password, saltRounds)

        //new user
        const newUser = await db.user.create({
            data:{
                email,
                name,
                password:hashedPassword,
                role,
                pfp
            }
        })
       

        return NextResponse.json({message:"User created successfully", user:newUser}, {status:201})
    }
    catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
        { message: "Internal server error." },
        { status: 500 }
    );
}
} 