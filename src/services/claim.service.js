import awsService from "../services/aws.service.js";
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

//! Get Claims Service
const getClaims = async (req, res) => {
  try {
    const claims = [];
    console.log("Getting claims...");
    console.log(req.user);

    res.status(200).json({ success: true, data: claims });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get claims. Please try again.",
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

export default {
  addClaim,
  getClaims,
  upload,
  addClaim2,
};
