import awsService from "../services/aws.service.js";
import Claim from "../models/claim.model.js";

// Add Claim Service
const addClaim = async (req, res) => {
  try {
    console.log("Claim request processing...");
    const claimData = req.body.dto ? JSON.parse(req.body.dto) : {};
    const fileData = req.files;

    ///
    const userMongo = "6748472eae0fb7cdbf7190fa";
    const previousClaimCount = await Claim.countDocuments({ user: userMongo });
    const claimId = `CLM-${previousClaimCount + 1}`;
    const folderPath = `${userMongo}/${claimId}`;

    console.log(fileData.insuranceFront[0]);
    claimData.insuranceFront = await awsService.uploadSingleFile(
      fileData.insuranceFront[0]
    );
    console.log(claimData.insuranceFront);
    // claimData.insuranceBack = await awsService.uploadSingleFile(
    //   fileData.insuranceBack[0],
    //   folderPath
    // );
    // claimData.nicFront = await awsService.uploadSingleFile(
    //   fileData.nicFront[0],
    //   folderPath
    // );
    // claimData.nicBack = await awsService.uploadSingleFile(
    //   fileData.nicBack[0],
    //   folderPath
    // );
    // claimData.drivingLicenseFront = await awsService.uploadSingleFile(
    //   fileData.drivingLicenseFront[0],
    //   folderPath
    // );
    // claimData.drivingLicenseBack = await awsService.uploadSingleFile(
    //   fileData.drivingLicenseBack[0],
    //   folderPath
    // );
    // claimData.driverFace = await awsService.uploadSingleFile(
    //   fileData.driverFace[0],
    //   folderPath
    // );

    // claimData.damageImages = await awsService.uploadMultipleFiles(
    //   fileData.damageImages,
    //   folderPath
    // );

    console.log(claimData);

    // Respond with success
    res.status(200).json({ success: true, data: { claimData, fileData } });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create claim. Please try again.",
    });
  }
};

// Get Claims Service
const getClaims = async (req, res) => {
  try {
    // Fetch claims from the database (mocked here for now)
    const claims = []; // Replace with actual database query
    res.status(200).json({ success: true, data: claims });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get claims. Please try again.",
    });
  }
};

const upload = async (req, res) => {
  const fileData = req.files.file1[0];
  const response = await awsService.uploadSingleFile(fileData);
  console.log("Upload Response");
  console.log(response);
};

export default {
  addClaim,
  getClaims,
  upload,
};
