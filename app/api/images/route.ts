import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
//app/api/images/route.ts
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const fileStr = body.data; // base64 de l'image
    const result = await cloudinary.uploader.upload(fileStr, {
      folder: "next-upload-demo",
    });
    return NextResponse.json({ success: true, url: result.secure_url });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const publicId = body.public_id;

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });

    return NextResponse.json({ success: true, url: result.secure_url });
  } catch (err) {
    console.error("Error deleting image:", err);
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
