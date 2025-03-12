import Report from "../models/report.model.js";
import moment from "moment"; // You might need to install this package for date manipulation

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

/* export const getReportStats = async (req, res) => {
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
}; */

export const getReportStats = async (req, res) => {
  try {
    const { startDate, endDate, status, timeInterval: filter } = req.query;
    console.log(req.query);

    // Initialize the query object
    let query = {};

    // Handle filters
    const now = moment().utc(); // Get the current time in UTC

    if (filter) {
      switch (filter) {
        case "7days":
          query.createdAt = {
            $gte: now.clone().subtract(7, "days").startOf("day").toDate(),
            $lte: now.clone().endOf("day").toDate(), // Ensure it's the end of the day
          };
          break;
        case "1month":
          query.createdAt = {
            $gte: now.clone().subtract(1, "month").startOf("month").toDate(),
            $lte: now.clone().endOf("day").toDate(),
          };
          break;
        case "3months":
          query.createdAt = {
            $gte: now.clone().subtract(3, "months").startOf("month").toDate(),
            $lte: now.clone().endOf("day").toDate(),
          };
          break;
        case "6months":
          query.createdAt = {
            $gte: now.clone().subtract(6, "months").startOf("month").toDate(),
            $lte: now.clone().endOf("day").toDate(),
          };
          break;
        default:
          break;
      }
    } else if (startDate || endDate) {
      // If startDate or endDate are provided directly in query
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Fetch reports from the database
    const reports = await Report.find(query);

    // If no reports found, return the time intervals with zero values
    if (reports.length === 0) {
      let emptyChartData = [];
      if (filter === "7days") {
        for (let i = 6; i >= 0; i--) {
          const day = now.clone().subtract(i, "days").startOf("day");
          emptyChartData.push({
            timeInterval: day.format("YYYY-MM-DD"),
            estimated: 0,
            approved: 0,
          });
        }
      } else if (filter === "1month") {
        for (let i = 0; i < 4; i++) {
          emptyChartData.push({
            timeInterval: `Week ${i + 1}`,
            estimated: 0,
            approved: 0,
          });
        }
      } else if (filter === "3months" || filter === "6months") {
        const numMonths = filter === "3months" ? 3 : 6;
        for (let i = 0; i < numMonths; i++) {
          const month = now.clone().subtract(i, "months").format("MMMM");
          emptyChartData.push({
            timeInterval: month,
            estimated: 0,
            approved: 0,
          });
        }
      }
      return res.status(200).json({
        success: true,
        data: {
          totalReports: 0,
          approvedReports: 0,
          rejectedReports: 0,
          pendingReports: 0,
          chartData: emptyChartData,
        },
      });
    }

    // Group reports by the specified filter
    let chartData = [];

    if (filter === "7days") {
      // Group by day for the past 7 days
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const day = now.clone().subtract(i, "days").startOf("day"); // Ensure start of day
        const dayReports = reports.filter((report) =>
          moment(report.createdAt).isSame(day, "day")
        );
        const estimated = dayReports.reduce(
          (sum, report) => sum + report.estimation_requested,
          0
        );
        const approved = dayReports.reduce(
          (sum, report) => sum + report.estimation_approved,
          0
        );

        days.push({
          timeInterval: day.format("YYYY-MM-DD"),
          estimated,
          approved,
        });
      }
      chartData = days;
    } else if (filter === "1month") {
      // Group by week for the past month
      const weeks = [];
      for (let i = 0; i < 4; i++) {
        const startOfWeek = now.clone().subtract(i, "weeks").startOf("week");
        const endOfWeek = now.clone().subtract(i, "weeks").endOf("week");
        const weekReports = reports.filter((report) =>
          moment(report.createdAt).isBetween(
            startOfWeek,
            endOfWeek,
            "days",
            "[]"
          )
        );
        const estimated = weekReports.reduce(
          (sum, report) => sum + report.estimation_requested,
          0
        );
        const approved = weekReports.reduce(
          (sum, report) => sum + report.estimation_approved,
          0
        );

        weeks.push({
          timeInterval: `Week ${i + 1}`,
          estimated,
          approved,
        });
      }
      chartData = weeks;
    } else if (filter === "3months" || filter === "6months") {
      // Group by month for the past 3 or 6 months
      const months = [];
      const numMonths = filter === "3months" ? 3 : 6;
      for (let i = 0; i < numMonths; i++) {
        const month = now.clone().subtract(i, "months").format("MMMM");
        const monthReports = reports.filter((report) =>
          moment(report.createdAt).isSame(
            now.clone().subtract(i, "months"),
            "month"
          )
        );
        const estimated = monthReports.reduce(
          (sum, report) => sum + report.estimation_requested,
          0
        );
        const approved = monthReports.reduce(
          (sum, report) => sum + report.estimation_approved,
          0
        );

        months.push({
          timeInterval: month,
          estimated,
          approved,
        });
      }
      chartData = months;
    }

    // Aggregate total reports for statistics
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

    // Respond with the calculated statistics and chart data
    res.status(200).json({
      success: true,
      data: {
        totalReports,
        approvedReports,
        rejectedReports,
        pendingReports,
        chartData, // Include chart data
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
