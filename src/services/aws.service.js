import s3 from "../config/aws-config.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

const BUCKET_NAME = process.env.BUCKET_NAME;

const uploadSingleFile = async (file) => {
  try {
    const buffer = await sharp(file.buffer)
      .resize({ height: 1920, width: 1080, fit: "contain" })
      .toBuffer();

    const params = {
      Bucket: BUCKET_NAME,
      Key: `${Date.now()}-${file.originalname}`,
      Body: buffer,
      ContentType: file.mimetype,
    };
    console.log("Uploading to S3...");
    const command = new PutObjectCommand(params);
    const s3Response = await s3.send(command);
    return s3Response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const uploadMultipleFiles = async (files) => {
  console.log(files);
};

export default { uploadSingleFile, uploadMultipleFiles };
