import { conn } from "@/libs/mysql";
import { NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import fs from 'fs/promises'
import path from "path";
import process from "process";
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';
import stream from 'stream';
import { file } from "googleapis/build/src/apis/file";
import cloudinary from "@/libs/cloudinary";
import { processImage } from "@/libs/processImage";

export async function GET() {
    try {
        const results = await conn.query('SELECT * FROM product')
        console.log(results)
        return NextResponse.json(results)
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

export async function POST(request) {
    try {
        const data = await request.formData()
        const image = data.get('image')
        if (!data.get('name')) {
            return NextResponse.json({ message: 'name is required' }, { status: 400 })
        }
        if (!data.get('image')) {
            return NextResponse.json({ message: 'image is required' }, { status: 400 })
        }

        /* -----------------------------------------------------------------
                Codigo para guardar archivo en servidor, carpeta public/
        -------------------------------------------------------------------- */
        // const bytes = await image.arrayBuffer()
        // const buffer = Buffer.from(bytes)
        // const filePath = path.join(process.cwd(), 'public', image.name)
        // console.log(filePath, buffer)
        // writeFile(filePath, buffer)

        /* -----------------------------------------------------------------
        Codigo para guardar archivo un drive de google con una API de google
        -------------------------------------------------------------------- */
        // // Configuración de la autenticación con OAuth2
        // const oauth2Client = new google.auth.OAuth2(
        //     '579277608536-fkov6d3tfpf90jjfpusoau5h503fee1n.apps.googleusercontent.com',  // Client ID
        //     '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',        // Client Secret
        //     'http://localhost'        // Redirección URI
        // );
        // // Genera la URL de autorización
        // const authUrl = oauth2Client.generateAuthUrl({
        //     access_type: 'offline', // Esto es necesario para obtener el refresh_token
        //     scope: ['https://www.googleapis.com/auth/drive.file'], // Permisos que necesitas
        // });
        // // Código recibido de la URL de redirección
        // const code = '4/0AQlEd8xRiFjEpxvAvnkmzYlKjkn07bK1_IYTmZsBFkeT1TA8pe9k8nfi76fmft7PVmWqJw';
        // // Asume que tienes el token de acceso guardado o lo obtienes aquí
        // oauth2Client.setCredentials({
        //     access_token: 'ya29.a0AcM612wMqnXtPBLoK4KOEdcEfOUefPtDD3ETVv98kvBXBUZwK_cLqN3RTTh84yslHH351RL4ZOYOyS5-6uGNmzg54M7xFLy3nDWyizN2TRJpMU5xP_rbSo3zH3xNIubnxmuv-F8LmUE1xCFJ3IZ23PEWsmulP2-26Mzg-Lz2aCgYKATASARMSFQHGX2MiQcVxrtq3pUEb7Jqi_rC0Rg0175',
        //     refresh_token: '1//05LZ_Xa_Pw1uWCgYIARAAGAUSNwF-L9IrK4gUpxDwK5MdZfoWEI_qg_w1dnDbZRkDuz2ADcgsGAAWe8BIfT3CW7Bmu8wX5MYtf10'
        // });

        // const drive = google.drive({ version: 'v3', auth: oauth2Client });

        // // Convertir la imagen a un Stream para subirla
        // const bufferStream = new stream.PassThrough();
        // bufferStream.end(Buffer.from(await image.arrayBuffer()));

        // // Subir el archivo a Google Drive
        // const driveResponse = await drive.files.create({
        //     requestBody: {
        //         name: image.name,
        //         mimeType: image.type
        //     },
        //     media: {
        //         mimeType: image.type,
        //         body: bufferStream
        //     }
        // });
        // const imageUrl =`https://drive.google.com/uc?id=${driveResponse.data.id}`  // esta url solo es para 

        /* -----------------------------------------------------------------
               Codigo para guardar archivo con cloudinary
       -------------------------------------------------------------------- */

        // // Configuration se encuentra en libs
        // cloudinary.config({
        //     cloud_name: 'dkjeyv8p8',
        //     api_key: '889363213743429',
        //     api_secret: 'ANhtT_wKQYNDl22aOxUPGejYbO4' // Click 'View API Keys' above to copy your API secret
        // });
        const filePath =await processImage(image)
        const res = await cloudinary.uploader.upload(filePath)
        if (res) {
            await unlink(filePath)
        }

        const imageUrl = res.secure_url
        let result = await conn.query('INSERT INTO product set ?', {
            name: data.get('name'),
            description: data.get('description'),
            price: data.get('price'),
            filepath: imageUrl
        })

        result = await conn.query('SELECT * FROM product WHERE id=?', [result.insertId])

        return NextResponse.json({
            name: result.name,
            description: result.description,
            price: result.price,
            id: result.id
        })
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