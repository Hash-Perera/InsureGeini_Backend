import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  insurancePolicyNo: {
    type: String,
    required: true,
  },
  insuranceCardImageFront: {
    type: String, // Store the front insurance card image URL or path
    required: true,
  },
  insuranceCardImageBack: {
    type: String, // Store the back insurance card image URL or path
    required: true,
  },
  vehicleModel: {
    type: String,
    required: true,
    enum: [
      "Model 1",
      "Model 2",
      "Model 3",
      "Model 4", // Replace with actual models
    ],
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
