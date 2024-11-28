const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  insuranceId: {
    type: String,
    required: true,
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
    required: false,
  },
});

module.exports = mongoose.model("User", userSchema);
