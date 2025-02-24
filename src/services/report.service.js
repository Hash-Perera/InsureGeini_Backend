import Report from "../models/report.model";

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
    const userId = req.user?._id;

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
