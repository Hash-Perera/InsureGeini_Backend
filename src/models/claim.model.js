import mongoose from "mongoose";

const claimSchema = new mongoose.Schema({
  claimId: {
    type: String,
  },
});

const Claim = mongoose.model("Claim", claimSchema);
export default Claim;
