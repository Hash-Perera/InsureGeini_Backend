import awsService from "../services/aws.service.js";
import queueService from "../services/queue.service.js";
import Claim from "../models/claim.model.js";

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

    // Save claim data to DB
    const newClaim = new Claim({
      ...claimData,
      userId: userId,
    });
    const savedClaim = await newClaim.save();

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
    console.log("Getting claim by id...");
    const claimId = req.params.id;
    const claim = await Claim.findById(claimId);

    res.status(200).json({ success: true, data: claim });
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
export default {
  addClaim,
  getClaims,
  getClaimById,
  upload,
  addClaim2,
  addToQueue,
  getQueueDetails,
};
