import express from "express";
const router = express.Router();
import upload from "../middlewares/upload.js";
import { createVehicle } from "../services/vehicle.service.js";

// Create a new route for vehicle creation
router.post(
  "/createVehicle",
  upload.fields([
    { name: "insuranceCardImageFront", maxCount: 1 },
    { name: "insuranceCardImageBack", maxCount: 1 },
    { name: "vehiclePhotosFront", maxCount: 1 },
    { name: "vehiclePhotosBack", maxCount: 1 },
    { name: "vehiclePhotosLeft", maxCount: 1 },
    { name: "vehiclePhotosRight", maxCount: 1 },
    { name: "numberPlateImageFront", maxCount: 1 },
    { name: "numberPlateImageBack", maxCount: 1 },
  ]),
  createVehicle // This is the controller function that handles the vehicle creation logic
);

export default router;
