import express from "express";
import claimService from "../services/claim.service.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post(
  "/add",
  upload.fields([
    { name: "insuranceFront", maxCount: 1 },
    { name: "insuranceBack", maxCount: 1 },
    { name: "nicFront", maxCount: 1 },
    { name: "nicBack", maxCount: 1 },
    { name: "drivingLicenseFront", maxCount: 1 },
    { name: "drivingLicenseBack", maxCount: 1 },
    { name: "driverFace", maxCount: 1 },
  ]),
  claimService.addClaim
);

router.get("/get", claimService.getClaims);

router.post(
  "/upload",
  upload.fields([{ name: "file1", maxCount: 1 }]),
  claimService.upload
);

export default router;
