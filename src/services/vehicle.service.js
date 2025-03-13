import awsService from "./aws.service.js";
import Vehicle from "../models/vehicle.model.js";
import mongoose from "mongoose";

export const createVehicle = async (req, res) => {
  try {
    const role = req.role;
    const fileData = req.files;

    // Ensure only "admin" can create vehicles
    if (role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access.",
      });
    }

    const jsonData = JSON.parse(req.body.jsonData);
    const userId = jsonData.userId;

    // Manually generate vehicle ID
    const vehicleId = new mongoose.Types.ObjectId();

    // Create folder path based on vehicle ID
    const folderPath = `${userId}/${vehicleId}`;

    // Upload the insurance card images (front and back)
    const insuranceCardImageFront = await awsService.uploadSingleFile(
      fileData.insuranceCardImageFront[0],
      folderPath
    );
    const insuranceCardImageBack = await awsService.uploadSingleFile(
      fileData.insuranceCardImageBack[0],
      folderPath
    );

    // Upload the vehicle photos (front, back, left, right)
    const vehiclePhotoFront = await awsService.uploadSingleFile(
      fileData.vehiclePhotosFront[0],
      folderPath
    );
    const vehiclePhotoBack = await awsService.uploadSingleFile(
      fileData.vehiclePhotosBack[0],
      folderPath
    );
    const vehiclePhotoLeft = await awsService.uploadSingleFile(
      fileData.vehiclePhotosLeft[0],
      folderPath
    );
    const vehiclePhotoRight = await awsService.uploadSingleFile(
      fileData.vehiclePhotosRight[0],
      folderPath
    );

    // Upload the number plate images (front and back)
    const numberPlateImageFront = await awsService.uploadSingleFile(
      fileData.numberPlateImageFront[0],
      folderPath
    );
    const numberPlateImageBack = await awsService.uploadSingleFile(
      fileData.numberPlateImageBack[0],
      folderPath
    );

    // Create a new vehicle object
    const vehicle = new Vehicle({
      _id: vehicleId,
      userId: userId, // Reference to the User model
      insurancePolicy: jsonData.insurancePolicy,
      policyAdOns: {
        generaProtection: jsonData.policyAdOns.generaProtection,
        vehicleSpecific: jsonData.policyAdOns.vehicleSpecific,
        usageSpecific: jsonData.policyAdOns.usageSpecific,
        workRelated: jsonData.policyAdOns.workRelated,
      },
      vehicleModel: jsonData.vehicleModel,
      engineNo: jsonData.engineNo,
      chassisNo: jsonData.chassisNo,
      vinNumber: jsonData.vinNumber,
      vehicleColor: jsonData.vehicleColor,
      vehicleNumberPlate: jsonData.vehicleNumberPlate,
      numberPlateImages: {
        front: numberPlateImageFront,
        back: numberPlateImageBack,
      },
      insuranceCard: {
        front: insuranceCardImageFront,
        back: insuranceCardImageBack,
      },
      vehiclePhotos: {
        front: vehiclePhotoFront,
        back: vehiclePhotoBack,
        left: vehiclePhotoLeft,
        right: vehiclePhotoRight,
      },
    });

    // Save the vehicle object
    await vehicle.save();
    return res.status(201).json({
      success: true,
      vehicleId: vehicleId,
      message: "Vehicle created successfully.",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "An error occurred." });
  }
};

export const deleteVehicle = async (req, res) => {
  try {
    const role = req.role;
    const vehicleId = req.params.id;

    // Ensure only "admin" can delete vehicles
    if (role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access.",
      });
    }

    // Find the vehicle by ID and delete it
    const deletedVehicle = await Vehicle.findByIdAndDelete(vehicleId);

    if (!deletedVehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully.",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "An error occurred." });
  }
};

export const getVehiclesByUserId = async (req, res) => {
  try {
    const userId = req.user;

    // Find all vehicles by user ID
    const vehicles = await Vehicle.find({ userId });
    return res.status(200).json({
      success: true,
      vehicles: vehicles,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "An error occurred." });
  }
};
