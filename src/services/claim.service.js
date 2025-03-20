import awsService from "../services/aws.service.js";
import queueService from "../services/queue.service.js";
import Claim from "../models/claim.model.js";
import Report from "../models/report.model.js";
import Vehicle from "../models/vehicle.model.js";
import Fraud from "../models/fraud.model.js";
import Obd from "../models/obd.model.js";
import { getWhether } from "../utils/getWhether.js";
import { getLocationAddress } from "../utils/getLocationAddress.js";
import mongoose from "mongoose";

//! Add Claim Service
const addClaim = async (req, res) => {
  try {
    console.log("Claim request processing...");

    // Get data from request
    const claimData = req.body.dto ? JSON.parse(req.body.dto) : {};
    const fileData = req.files;
    const userId = req.user?.toString();

    // Create AWS Path
    const previousClaimCount = await Claim.countDocuments({ userId: userId });
    const claimId = `CLM_${previousClaimCount + 1}`;
    const folderPath = `${userId}/${claimId}`;

    // Get whether data
    const _weatherData = await getWhether(
      claimData.location.latitude,
      claimData.location.longitude
    );

    const _weather = _weatherData?.data?.weather?.[0];
    const _weatherFull = _weather?.main + ", " + _weather?.description;

    const weather = _weatherFull;

    claimData.weather = weather;

    // Get location address
    const locationAddress = await getLocationAddress(
      claimData.location.latitude,
      claimData.location.longitude
    );

    claimData.locationAddress = locationAddress?.data?.plus_code?.compound_code;

    //uploading the audio file to s3
    claimData.audio = await awsService.uploadSingleFile(
      fileData.audio[0],
      folderPath
    );

    // Upload files to AWS
    claimData.insuranceFront = await awsService.uploadSingleFile(
      fileData.insuranceFront[0],
      folderPath
    );

    claimData.insuranceBack = await awsService.uploadSingleFile(
      fileData.insuranceBack[0],
      folderPath
    );
    claimData.nicFront = await awsService.uploadSingleFile(
      fileData.nicFront[0],
      folderPath
    );
    claimData.nicBack = await awsService.uploadSingleFile(
      fileData.nicBack[0],
      folderPath
    );
    claimData.drivingLicenseFront = await awsService.uploadSingleFile(
      fileData.drivingLicenseFront[0],
      folderPath
    );
    claimData.drivingLicenseBack = await awsService.uploadSingleFile(
      fileData.drivingLicenseBack[0],
      folderPath
    );
    claimData.driverFace = await awsService.uploadSingleFile(
      fileData.driverFace[0],
      folderPath
    );

    claimData.frontLicencePlate = await awsService.uploadSingleFile(
      fileData.frontLicencePlate[0],
      folderPath
    );

    claimData.backLicencePlate = await awsService.uploadSingleFile(
      fileData.backLicencePlate[0],
      folderPath
    );

    claimData.vinNumber = await awsService.uploadSingleFile(
      fileData.vinNumber[0],
      folderPath
    );

    claimData.damageImages = await awsService.uploadMultipleFiles(
      fileData.damageImages,
      folderPath
    );

    if (fileData.vehicleFront[0]) {
      claimData.vehicleFront = await awsService.uploadSingleFile(
        fileData.vehicleFront[0],
        folderPath
      );
    }

    // Save claim data to DB
    const newClaim = new Claim({
      ...claimData,
      userId: userId,
      imageLocation: randomLocation[Math.floor(Math.random() * 7)],
      fraud_verification: {
        model_verified: true,
        face_verified: true,
        license_verified: true,
        insurance_verified: true,
        number_plates_verified: true,
        prev_damage_verified: true,
        vin_number_verified: true,
        color_verified: true,
        location_verified: true,
        fraud_verified: true,
      },
    });
    const savedClaim = await newClaim.save();

    const reqBody = {
      claimId: savedClaim._id,
    };

    //Send to Damage detection queue
    queueService.sendToDamageDetectionQueue(reqBody);

    // Respond with success
    res.status(200).json({ success: true, data: savedClaim });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create claim. Please try again.",
    });
  }
};

//! Get All Claims
const getClaims = async (req, res) => {
  try {
    const userId = req.user?.toString();
    const claims = await Claim.find();

    res.status(200).json({ success: true, data: claims });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get claims. Please try again.",
    });
  }
};

//! getClaimById
const getClaimById = async (req, res) => {
  try {
    const claimId = req.params.id;
    const claim = await Claim.findById(claimId);

    //getting the report for the claim
    const reports = await Report.findOne({
      claimId: claimId,
    });

    res.status(200).json({ success: true, data: claim, report: reports });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get claim. Please try again.",
    });
  }
};

//? For testing
const upload = async (req, res) => {
  const fileData = req.files.file1[0];
  const response = await awsService.uploadSingleFile(fileData);
  console.log(response);
  res.status(200).json({ success: true, data: response });
};

//? For testing
const addClaim2 = async (req, res) => {
  // create a claim object record in db
  const claim = new Claim({
    ...req.body,
  });
  const saved = await claim.save();
  res.status(200).json({ success: true, data: saved });
};

const addToQueue = async (req, res) => {
  queueService.sendToFraudDetectionQueue(req.body);
  res.status(200).json({ success: true, data: req.body });
};

const getQueueDetails = async (req, res) => {
  queueService.getQueueStats().then((stats) => {
    res.status(200).json({ success: true, data: stats });
  });
};

const fraudCompare = async (req, res) => {
  try {
    const claimId = req.params.id;
    const claim = await Claim.findById(claimId);
    if (!claim) {
      return res
        .status(404)
        .json({ success: false, message: "Claim not found" });
    }

    const vehicle = await Vehicle.findById(claim.vehicleId);
    if (!vehicle) {
      return res
        .status(404)
        .json({ success: false, message: "Vehicle not found" });
    }

    const fraudClaimId = new mongoose.Types.ObjectId(claimId);
    const fraud = await Fraud.findOne({ claim: fraudClaimId });

    const obdData = await Obd.findOne({ vehicleId: claim.vehicleId });

    res.status(200).json({ success: true, data: { vehicle, fraud, obdData } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const fraudApprove = async (req, res) => {
  console.log("Fraud Approve", req.body.claimId);
  console.log("Fraud Approve", req.body.status); // Approve // Reject

  if (req.body.status === "Approve") {
    const fraud_verification = {
      model_verified: true,
      face_verified: true,
      license_verified: true,
      insurance_verified: true,
      number_plates_verified: true,
      prev_damage_verified: true,
      vin_number_verified: true,
      color_verified: true,
      location_verified: true,
      fraud_verified: true,
    };
    const response = await Claim.findByIdAndUpdate(req.body.claimId, {
      fraud_verification,
    });

    res.status(200).json({ success: true, data: response });
  } else {
    const fraud_verification = {
      model_verified: false,
      face_verified: false,
      license_verified: false,
      insurance_verified: false,
      number_plates_verified: false,
      prev_damage_verified: false,
      vin_number_verified: false,
      color_verified: false,
      location_verified: false,
      fraud_verified: false,
    };
    const response = await Claim.findByIdAndUpdate(req.body.claimId, {
      fraud_verification,
    });

    res.status(200).json({ success: true, data: response });
  }
};

const sendToDamageDetectionQueue = async (req, res) => {
  queueService.sendToDamageDetectionQueue(req.body);
  res.status(200).json({ success: true, data: req.body });
};

const sendToPolicyQueue = async (req, res) => {
  queueService.sendToPolicyQueue(req.body);
  res.status(200).json({ success: true, data: req.body });
};

const randomLocation = [
  {
    latitude: 6.739596629877806,
    longitude: 80.09440485606127,
  },
  {
    latitude: 6.719461556662279,
    longitude: 79.90748355907672,
  },
  {
    latitude: 6.752893088105629,
    longitude: 80.01771684834235,
  },
  {
    latitude: 6.78839124153081,
    longitude: 79.98140053856469,
  },
  {
    latitude: 6.729190431284059,
    longitude: 79.90508434773373,
  },
  {
    latitude: 6.8932403520918974,
    longitude: 79.92735838876452,
  },
  {
    latitude: 6.902340034287175,
    longitude: 79.91883398471882,
  },
];

export default {
  addClaim,
  getClaims,
  getClaimById,
  upload,
  addClaim2,
  addToQueue,
  getQueueDetails,
  fraudCompare,
  fraudApprove,
  sendToDamageDetectionQueue,
  sendToPolicyQueue,
};
