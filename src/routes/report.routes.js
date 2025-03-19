// report.routes.js
import express from "express";
import {
  createReport,
  updateReportByClaimId,
  getReportsByUserId,
  getAllReports,
  getReportStats,
  getAverageEstimations,
  getReportCountsByStatus,
  getReportsCountOverTime,
  getReportsByClaimId,
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

// Route to get reports by claimId
router.get("/all/:claimId", getReportsByClaimId);

// Route to get report statistics
router.get("/stats", getReportStats);

// New statistical routes
router.get("/stats/average-estimations", getAverageEstimations);
router.get("/stats/status-counts", getReportCountsByStatus);
router.get("/stats/reports-over-time", getReportsCountOverTime);

export default router;
