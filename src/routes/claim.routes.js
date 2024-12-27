const express = require("express");
const router = express.Router();
const claimService = require("../services/claim.service.js");
const upload = require("../middlewares/upload.js");

router.post(
  "/add",
  upload.fields([
    { name: "insuranceFront", maxCount: 1 },
    { name: "insuranceBack", maxCount: 1 },
    { name: "nicFront", maxCount: 1 },
    { name: "nicBack", maxCount: 1 },
    { name: "drivingLicenseFront", maxCount: 1 },
    { name: "drivingLicenseBack", maxCount: 1 },
  ]),
  claimService.addClaim
);
router.get("/get", claimService.getClaims);

module.exports = router;
