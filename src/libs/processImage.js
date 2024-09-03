import { writeFile, unlink } from "fs/promises";
import path from "path";
import process from "process";
import { v2 as cloudinary } from 'cloudinary';


export async function processImage(image) {
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filePath =await path.join(process.cwd(), 'public', image.name)
    writeFile(filePath, buffer)
  

    return filePath
}