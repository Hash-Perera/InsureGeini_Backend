import Report from "../models/report.model.js";

// Add Report Service
export const createReport = async (req, res) => {
  try {
    const { userId, claimId, audioToTextConvertedContext } = req.body;

    // Validate required fields
    if (!userId || !claimId || !audioToTextConvertedContext) {
      return res.status(400).json({
        success: false,
        message:
          "userId, claimId, and audioToTextConvertedContext are required.",
      });
    }

    const newReport = new Report({
      userId,
      claimId,
      audioToTextConvertedContext,
      status: "Pending", // Default status
    });

    const savedReport = await newReport.save();

    res.status(201).json({ success: true, data: savedReport });
  } catch (error) {
    console.error("Error creating report:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create report. Please try again.",
    });
  }
};

export const updateReportByClaimId = async (req, res) => {
  try {
    const { claimId } = req.params;
    const updateData = req.body;

    // Validate claimId
    if (!claimId) {
      return res.status(400).json({
        success: false,
        message: "claimId is required.",
      });
    }

    const updatedReport = await Report.findOneAndUpdate(
      { claimId },
      { $set: updateData },
      { new: true }
    );

    if (!updatedReport) {
      return res.status(404).json({
        success: false,
        message: "Report not found.",
      });
    }

    res.status(200).json({ success: true, data: updatedReport });
  } catch (error) {
    console.error("Error updating report:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update report. Please try again.",
    });
  }
};

export const getReportsByUserId = async (req, res) => {
  try {
    //const userId = req.user?._id;
    const userId = "60d0fe4f5311236168a109ca";

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    const reports = await Report.find({ userId });

    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    console.error("Error fetching reports:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reports. Please try again.",
    });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find();

    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    console.error("Error fetching all reports:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reports. Please try again.",
    });
  }
};

export const getReportStats = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;

    // Build the query object
    let query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    if (status) {
      query.status = status;
    }

    const reports = await Report.find(query);

    const totalReports = reports.length;
    const approvedReports = reports.filter(
      (report) => report.status === "Approved"
    ).length;
    const rejectedReports = reports.filter(
      (report) => report.status === "Rejected"
    ).length;
    const pendingReports = reports.filter(
      (report) => report.status === "Pending"
    ).length;

    res.status(200).json({
      success: true,
      data: {
        totalReports,
        approvedReports,
        rejectedReports,
        pendingReports,
        reports,
      },
    });
  } catch (error) {
    console.error("Error fetching report statistics:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch report statistics. Please try again.",
    });
  }
};

/* more stats */
export const getAverageEstimations = async (req, res) => {
  try {
    const result = await Report.aggregate([
      {
        $group: {
          _id: null,
          avgEstimationRequested: {
            $avg: { $toDouble: "$estimation_requested" },
          },
          avgEstimationApproved: {
            $avg: { $toDouble: "$estimation_approved" },
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    console.error("Error fetching average estimations:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch average estimations. Please try again.",
    });
  }
};

export const getReportCountsByStatus = async (req, res) => {
  try {
    const result = await Report.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching report counts by status:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch report counts by status. Please try again.",
    });
  }
};

export const getReportsCountOverTime = async (req, res) => {
  try {
    const { interval = "month" } = req.query; // Default to monthly if not specified

    // Determine the date format based on the interval
    const dateFormat =
      interval === "day" ? "%Y-%m-%d" : interval === "year" ? "%Y" : "%Y-%m";

    const result = await Report.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: dateFormat, date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // Sort by date ascending
    ]);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching reports count over time:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reports count over time. Please try again.",
    });
  }
};

export const getRejectionReasonsDistribution = async (req, res) => {
  try {
    const result = await Report.aggregate([
      { $match: { status: "Rejected" } },
      {
        $group: {
          _id: "$reason",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } }, // Sort by count descending
    ]);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(
      "Error fetching rejection reasons distribution:",
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        "Failed to fetch rejection reasons distribution. Please try again.",
    });
  }
};

export const getAverageProcessingTime = async (req, res) => {
  try {
    const result = await Report.aggregate([
      {
        $match: {
          status: { $in: ["Approved", "Rejected"] }, // Consider only processed reports
        },
      },
      {
        $project: {
          processingTimeInDays: {
            $divide: [
              { $subtract: [new Date(), "$createdAt"] },
              1000 * 60 * 60 * 24, // Convert milliseconds to days
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          avgProcessingTimeInDays: { $avg: "$processingTimeInDays" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    console.error("Error fetching average processing time:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch average processing time. Please try again.",
    });
  }
};

export const getEstimationApprovalRate = async (req, res) => {
  try {
    const totalReports = await Report.countDocuments();
    const approvedEstimations = await Report.countDocuments({
      $expr: { $eq: ["$estimation_requested", "$estimation_approved"] },
    });

    const approvalRate = (approvedEstimations / totalReports) * 100;

    res.status(200).json({
      success: true,
      data: { approvalRate },
    });
  } catch (error) {
    console.error("Error fetching estimation approval rate:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch estimation approval rate. Please try again.",
    });
  }
};

export const getReportsByUser = async (req, res) => {
  try {
    const result = await Report.aggregate([
      {
        $group: {
          _id: "$userId",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } }, // Sort by count descending
    ]);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching reports by user:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reports by user. Please try again.",
    });
  }
};
