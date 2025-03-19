import DamageDetection from "../models/detection.model.js";

export const getDetectionsByClaimId = async (req, res) => {
  try {
    const { claimId } = req.params;
    const detections = await DamageDetection.find({ claimId });
    res.status(200).json({ success: true, data: detections });
  } catch (error) {
    console.error("Error getting detections:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get detections. Please try again.",
    });
  }
};
