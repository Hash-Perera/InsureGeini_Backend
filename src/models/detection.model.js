import mongoose from "mongoose";

const damageDetectionSchema = new mongoose.Schema({
  part: {
    type: String,
    required: true,
  },
  damageType: {
    type: [String], // Array of strings
    required: true,
  },
  severity: {
    type: String,
    required: true,
  },
  obd_code: {
    type: Boolean,
    required: true,
  },
  internal: {
    type: String,
    required: true,
  },
  decision: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  flag: {
    type: String,
    required: true,
  },
  claimId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to another collection
    ref: "Claim", // Assuming the related model is called 'Claim'
    required: true,
  },
});

const DamageDetection = mongoose.model("detection", damageDetectionSchema);

export default DamageDetection;
