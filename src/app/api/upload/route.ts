import { NextRequest, NextResponse } from "next/server";
import cloudinary from "../../../lib/cloudinary/cloudinary";
import { Readable } from "stream";


export async function POST(req: NextRequest) {
    // 👇 Parse the form data from the incoming request:
  const formData = await req.formData();
  const file = formData.get("file") as File;

  console.log("checking to see if theres a file");
  if (!file) {
    console.log("Error:No file uploaded");
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  };
  console.log("file detected...")

  const buffer = Buffer.from(await file.arrayBuffer());
    console.log("done buffering...")


  const uploadToCloudinary = () => {
      console.log("running cloudinary...")
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "my-next-estate" },
        (error, result) => {
          if (error) {
            reject(error);
            console.log(`rejected Error:`,error);
          } else {
            resolve(result);
            console.log(`result:`,result)
          }
        }
      );
      Readable.from(buffer).pipe(stream);
    });
  };

  try {
    const result = await uploadToCloudinary();
    return NextResponse.json({ result });
  } catch (error) {
    console.log("Error:upload failed");
    return NextResponse.json({ error: "upload failed" }, { status: 500 });
  }
}
