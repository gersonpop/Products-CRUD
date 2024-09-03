import { conn } from "@/libs/mysql";
import { NextResponse } from "next/server";
import cloudinary from "@/libs/cloudinary";
import { processImage } from "@/libs/processImage";
import {  unlink } from "fs/promises";

export async function GET(request, { params }) {
    const { id } = params
    try {
        const result = await conn.query('SELECT * FROM product WHERE id=?', [id])
        console.log(result)
        if (result.length === 0)
            return NextResponse.json({
                message: 'producto no encotrado',
            },
                {
                    status: 404,
                }
            )
        return NextResponse.json(result[0])
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            message: error.message,
        },
            {
                status: 500,
            }
        )
    }
}

export async function DELETE(request, { params }) {
    try {
        const result = await conn.query('DELETE  FROM product WHERE ID=?', [params.id])
        if (result.affectedRows === 0)
            return NextResponse.json({
                message: 'producto no encotrado',
            },
                {
                    status: 404,
                }
            )
        return new Response(null, { status: 204 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            message: error.message,
        },
            {
                status: 500,
            }
        )
    }
}

export async function PUT(request, { params }) {
       let imageUrl ;
    try {
        const data = await request.formData()
        const image = data.get('image')
        const updatedItem =  {
            name: data.get('name'),
            description: data.get('description'),
            price: data.get('price')
        }
        if (!data.get('name')) {
            return NextResponse.json({ message: 'name is required' }, { status: 400 })
        }
        if (data.get('image')) {
            const filePath = await processImage(image)
            const res = await cloudinary.uploader.upload(filePath)
            updatedItem.filepath= res.secure_url
            if (res) {
                await unlink(filePath)
            }
            
        }

        const result = await conn.query('UPDATE product SET  ? WHERE id=?', [updatedItem, params.id])

        if (result.affectedRows === 0)
            return NextResponse.json({
                message: 'producto no encotrado',
            },
                {
                    status: 404,
                }
            )

        const updatedProduct = await conn.query('SELECT * FROM  product  WHERE id=?', [params.id])
        return NextResponse.json({ ...updatedProduct[0] })
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            message: error.message,
        },
            {
                status: 500,
            }
        )
    }
}
