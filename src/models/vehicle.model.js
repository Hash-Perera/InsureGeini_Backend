import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  insurancePolicy: {
    type: String,
    required: true,
  },
  policyAdOns: {
    generaProtection: {
      type: [String],
      required: true,
    },
    vehicleSpecific: {
      type: [String],
      required: true,
    },
    usageSpecific: {
      type: [String],
      required: true,
    },
    workRelated: {
      type: [String],
      required: true,
    },
  },

  insuranceCard: {
    front: {
      type: String, // Store the front insurance card image URL or path
      required: true,
    },
    back: {
      type: String, // Store the back insurance card image URL or path
      required: true,
    },
  },
  vehicleModel: {
    type: String,
    required: true,
  },
  vehiclePhotos: {
    front: {
      type: String, // Store the front photo URL or path
      required: true,
    },
    back: {
      type: String, // Store the back photo URL or path
      required: true,
    },
    left: {
      type: String, // Store the left photo URL or path
      required: true,
    },
    right: {
      type: String, // Store the right photo URL or path
      required: true,
    },
  },
  engineNo: {
    type: String,
    required: true,
  },
  chassisNo: {
    type: String,
    required: true,
  },
  vinNumber: {
    type: String,
    required: true,
  },
  vehicleColor: {
    type: String,
    required: true,
  },
  vehicleNumberPlate: {
    type: String,
    required: true,
  },
  numberPlateImages: {
    front: {
      type: String, // Store the front number plate image URL or path
      required: true,
    },
    back: {
      type: String, // Store the back number plate image URL or path
      required: true,
    },
  },
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;
