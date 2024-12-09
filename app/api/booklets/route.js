import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const data = await request.json();
        console.log('Backend data:', data)
        const { 
            title,
            bookletDepartments,
            imageUrl,
            pdfUrl
         } = data;
         const booklet = await db.booklet.create({
            data:{
                title,
                bookletDepartments:{
                    create:bookletDepartments.map((round)=>({
                        title:round.title
                    }))
                },
                imageUrl,
                pdfUrl
            }
         })
        return NextResponse.json(booklet)
    } catch (error) {
        return NextResponse.json({
            error:error.message,
            message:'Failed to create a booklet'
        },{
            status:500
        })
    }
}
export const GET = async (request) => {
    try {
        const booklets = await db.booklet.findMany({
            include:{
                
                bookletDepartments:true
            }
        });
        
        return NextResponse.json(booklets);
    } catch (error) {
        return NextResponse.json({ error: error.message, message: "error" })
    }
};