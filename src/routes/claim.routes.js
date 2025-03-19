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
    { name: "damageImages", maxCount: 10 },
    { name: "frontLicencePlate", maxCount: 1 },
    { name: "backLicencePlate", maxCount: 1 },
    { name: "vinNumber", maxCount: 1 },
    { name: "audio", maxCount: 1 },
    { name: "vehicleFront", maxCount: 1 },
  ]),
  claimService.addClaim
);

router.get("/all", claimService.getClaims);

router.get("/detail/:id", claimService.getClaimById);

router.post("/add2", claimService.addClaim2);

router.post(
  "/upload",
  upload.fields([{ name: "file1", maxCount: 1 }]),
  claimService.upload
);

router.post("/queue", claimService.addToQueue);

router.get("/queue-details", claimService.getQueueDetails);

router.get("/claimFraud/:id", claimService.fraudCompare);

router.post("/fraudApprove", claimService.fraudApprove);

router.post("/sendToDamage", claimService.sendToDamageDetectionQueue);

router.post("/sendToPolicy", claimService.sendToPolicyQueue);

export default router;
