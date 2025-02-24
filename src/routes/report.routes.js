// report.routes.js
import express from "express";
import {
  createReport,
  updateReportByClaimId,
  getReportsByUserId,
  getAllReports,
  getReportStats,
} from "../services/report.service.js";

const router = express.Router();

// Route to create a new report
router.post("/add", createReport);

// Route to update a report by claimId
router.put("/update/:claimId", updateReportByClaimId);

// Route to get reports for a specific user
router.get("/user", getReportsByUserId);

// Route to get all reports (admin access)
router.get("/all", getAllReports);

// Route to get report statistics
router.get("/stats", getReportStats);

export default router;
