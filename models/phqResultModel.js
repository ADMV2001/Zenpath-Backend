// models/phqResultModel.js
import mongoose from "mongoose";

const phqResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to user
  name: String,
  email: String,
  Q1: Number,
  Q2: Number,
  Q3: Number,
  Q4: Number,
  Q5: Number,
  Q6: Number,
  Q7: Number,
  Q8: Number,
  Q9: Number,
  score: Number,
  status: String, // Interpretation like "Mild depression"
  date: { type: Date, default: Date.now },
});

export default mongoose.model("PhqResult", phqResultSchema);
