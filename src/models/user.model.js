import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  insuranceId: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role", // Add a reference to the Role model if applicable
    required: true,
  },
  // New fields for client registration
  dob: {
    type: Date,
    required: false,
  },
  NIC_No: {
    type: String,
    required: false,
  },
  NIC_image: {
    type: String, // Store the image URL or path
    required: false,
  },
  drivingLicenseNo: {
    type: String,
    required: false,
  },
  drivingLicenseImage: {
    type: String, // Store the image URL or path
    required: false,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
