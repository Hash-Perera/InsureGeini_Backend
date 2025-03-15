import s3 from "../config/aws-config.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import sharp from "sharp";

const BUCKET_NAME = process.env.BUCKET_NAME;
const BUCKET_REGION = process.env.BUCKET_REGION;

const uploadSingleFile = async (file, folderPath) => {
  try {
    const fileKey = folderPath
      ? `${folderPath}/${Date.now()}-${file.originalname}`
      : `${Date.now()}-${file.originalname}`;

    let buffer = file.buffer;

    // Optimize image processing (if file is an image)
    if (file.mimetype.startsWith("image/")) {
      buffer = await sharp(file.buffer)
        .resize({ height: 1920, width: 1080, fit: "contain" })
        .toBuffer();
    }

    // Use Multipart Upload for better reliability
    const upload = new Upload({
      client: s3,
      params: {
        Bucket: BUCKET_NAME,
        Key: fileKey,
        Body: buffer,
        ContentType: file.mimetype,
      },
      partSize: 25 * 1024 * 1024, // 25MB chunks
    });

    console.log("Uploading...");
    await upload.done();

    // Construct the public URL dynamically
    const fileUrl = `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${fileKey}`;

    console.log("Upload successful:", fileUrl);
    return fileUrl;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    if (error.name === "TimeoutError") {
      console.log("Retrying upload due to timeout...");
      return uploadSingleFile(file, folderPath); // Retry on timeout
    }
    throw error;
  }
};

const uploadMultipleFiles = async (files, folderPath) => {
  const fileUrls = [];

  for (const file of files) {
    const fileUrl = await uploadSingleFile(file, folderPath);
    fileUrls.push(fileUrl);
  }

  return fileUrls;
};

export default { uploadSingleFile, uploadMultipleFiles };
