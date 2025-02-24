import mongoose, { Types } from "mongoose";

const reportSchema = new mongoose.Schema({
  userId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  claimId: {
    type: Types.ObjectId,
    ref: "Claim",
    required: true,
  },
  audioToTextConvertedContext: {
    type: String,
    required: true,
  },
  status: {
    type: ["Pending", "Approved", "Rejected"],
    default: "Pending",
    required: true,
  },
  estimation_requested: {
    type: String,
    required: false,
  },
  estimation_approved: {
    type: String,
    required: false,
  },
  reason: {
    type: String,
    required: false,
  },
  incidentReport: {
    type: String,
    required: false,
  },
  decisionReport: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Report = mongoose.model("Report", reportSchema);

export default Report;
