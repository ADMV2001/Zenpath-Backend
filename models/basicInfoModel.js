// basicInfoModel.js
import mongoose from "mongoose";

const basicInfoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: String,
  email: String,
  age: String,
  gender: String,
  country: String,
  relationshipStatus: String,
  children: String,
  sexualOrientation: String,
  employmentStatus: String,
  mentalHealthSupport: String,
  submittedAt: { type: Date, default: Date.now }
});

export default mongoose.model("BasicInfo", basicInfoSchema);
