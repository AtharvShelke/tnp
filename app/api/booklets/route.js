import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const data = await request.json();
        console.log('Backend data:', data)
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({
            error,
            message:'Failed to create a drive'
        },{
            status:500
        })
    }
}