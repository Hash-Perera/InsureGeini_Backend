import awsService from "../services/aws.service.js";

// Add Claim Service
const addClaim = async (req, res) => {
  try {
    const claimData = req.body.dto ? JSON.parse(req.body.dto) : {};
    const fileData = {};

    // Process files uploaded in the request
    if (req.files) {
      for (const key of Object.keys(req.files)) {
        if (req.files[key].length > 0) {
          const file = req.files[key][0];
          fileData[key] = {
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            buffer: file.buffer,
          };
        }
      }
    }

    console.log("Claim Data");
    console.log(fileData);

    // const response = await awsService.uploadSingleFile(fileData.insuranceFront);
    // console.log("Upload Response");
    // console.log(response);

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
