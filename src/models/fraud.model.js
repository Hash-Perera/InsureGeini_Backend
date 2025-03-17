import mongoose from "mongoose";

const fraudSchema = new mongoose.Schema({
  claimId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Claim",
  },
  modelResult: { type: mongoose.Schema.Types.Mixed },
  faceResult: { type: mongoose.Schema.Types.Mixed },
  readLicenceResult: { type: mongoose.Schema.Types.Mixed },
  readInsuranceResult: { type: mongoose.Schema.Types.Mixed },
  numberPlates: { type: mongoose.Schema.Types.Mixed },
  similarityScore: { type: mongoose.Schema.Types.Mixed },
  vinNumber: { type: mongoose.Schema.Types.Mixed },
  color: { type: mongoose.Schema.Types.Mixed },
});

const Fraud = mongoose.model("Fraud", fraudSchema);

export default Fraud;
