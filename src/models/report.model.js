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
  status: {
    type: ["Pending", "Approved", "Rejected"],
    default: "Pending",
    required: true,
  },
  estimation_requested: {
    type: String,
    required: true,
  },
  estimation_approved: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  incidentReport: {
    type: String,
    required: true,
  },
  decisionReport: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Report = mongoose.model("Report", reportSchema);

export default Report;
