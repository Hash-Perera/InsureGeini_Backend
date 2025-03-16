import mongoose from "mongoose";

const obdSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Vehicle",
  },
  obdCodes: {
    type: String,
    required: true,
  },
  updateTime: {
    type: Date,
    default: Date.now,
  },
});

const Obd = mongoose.model("Obd", obdSchema);

export default Obd;
