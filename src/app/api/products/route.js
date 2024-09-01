import { conn } from "@/libs/mysql";

const { NextResponse } = require("next/server");

export function GET() {
    return NextResponse.json("listando productos")
    
}

export async function POST(request) {
    const {name, description, price} = await request.json()
    const result = await conn.query('INSERT INTO product set ?',{name, description , price})
    console.log(result)
    return NextResponse.json("Creando productos")
}