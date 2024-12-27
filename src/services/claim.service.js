exports.addClaim = async (req, res) => {
  try {
    const claimData = req.body.dto ? JSON.parse(req.body.dto) : {};
    const fileData = {};

    if (req.files) {
      for (const key of Object.keys(req.files)) {
        if (req.files[key].length > 0) {
          fileData[key] = {
            originalname: req.files[key][0].originalname,
            mimetype: req.files[key][0].mimetype,
            size: req.files[key][0].size,
            buffer: req.files[key][0].buffer,
          };
        }
      }
    }

    console.log("Claim Data:", claimData);
    console.log("Files Data:", fileData);

    // if (req.files) {
    //   console.log("Uploaded Files:", Object.keys(req.files));
    // }
  } catch (error) {
    console.log(error.message);
    throw new Error("Failed to create claim. Please try again.");
  }
};

exports.getClaims = async (req, res) => {
  try {
    // const claims = await Claim.find();
    res.status(200);
    // res.json({ success: true, data: claims });
  } catch (error) {
    console.log(error.message);
    throw new Error("Failed to get claims. Please try again.");
  }
};
