import s3 from "../config/aws-config.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

const BUCKET_NAME = process.env.BUCKET_NAME;
const BUCKET_REGION = process.env.BUCKET_REGION;

const uploadSingleFile = async (file, folderPath) => {
  try {
    const fileKey = folderPath
      ? `${folderPath}/${Date.now()}-${file.originalname}`
      : `${Date.now()}-${file.originalname}`;
    const buffer = await sharp(file.buffer)
      .resize({ height: 1920, width: 1080, fit: "contain" })
      .toBuffer();

    console.log(file);

    const params = {
      Bucket: BUCKET_NAME,
      Key: `${Date.now()}-${file.originalname}`,
      Body: buffer,
      ContentType: file.mimetype,
    };

    // Upload the file
    const command = new PutObjectCommand(params);
    console.log("Uploading...");
    await s3.send(command);

    // Dynamically construct the public URL
    const fileUrl = `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${fileKey}`;

    // Return the URL
    console.log(fileUrl);
    return fileUrl;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
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
