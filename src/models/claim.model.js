import mongoose, { Types } from "mongoose";

const claimSchema = new mongoose.Schema({
  insuranceId: {
    type: String,
    required: true,
  },

  nicNo: {
    type: String,
    required: true,
  },

  drivingLicenseNo: {
    type: String,
    required: true,
  },

  damagedAreas: {
    type: [String],
    required: true,
  },

  location: {
    type: Object,
    required: false,
  },
  imageLocation: {
    type: Object,
    required: false,
  },
  wheather: {
    type: String,
    required: false,
  },
  audio: {
    type: String,
    required: true,
  },
  userId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  vehicleId: {
    type: Types.ObjectId,
    ref: "Vehicle",
    required: true,
  },
  status: {
    type: String,
    default: "Pending",
  },
  vinNum: {
    type: String,
    required: true,
  },
  //Images
  insuranceFront: {
    type: String,
    required: true,
  },
  insuranceBack: {
    type: String,
    required: true,
  },

  nicFront: {
    type: String,
    required: true,
  },

  nicBack: {
    type: String,
    required: true,
  },

  drivingLicenseFront: {
    type: String,
    required: true,
  },

  drivingLicenseBack: {
    type: String,
    required: true,
  },

  driverFace: {
    type: String,
    required: true,
  },

  frontLicencePlate: {
    type: String,
    required: true,
  },

  backLicencePlate: {
    type: String,
    required: true,
  },

  vinNumber: {
    type: String,
    required: true,
  },

  damageImages: {
    type: [String],
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Claim = mongoose.model("Claim", claimSchema);
export default Claim;
