import { conn } from "@/libs/mysql";
import { NextResponse }  from "next/server";


export async function GET() {
    const result = await conn.query('SELECT NOW()')
    console.log(result)
    return NextResponse.json({message:"Hello"})
    
}