import express from "express";
import { getDetectionsByClaimId } from "../services/detection.service.js";

const router = express.Router();

router.get("/all/:claimId", getDetectionsByClaimId);

export default router;
