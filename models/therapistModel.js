// therapistModel.js
import mongoose from "mongoose";

const therapistSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },
  licenseNumber: { type: String, required: true },
  licenseIssuingAuthority: { type: String },
  licenseExpiry: { type: Date },
  certifications: { type: String },
  specialties: { type: String },
  experience: { type: String },
  education: { type: String },
  bio: { type: String },
  website: { type: String },
  linkedinProfile: { type: String },
  cvOrResumeUrl: { type: String },
  licenseDocument: { type: String },
  profilePicture: { type: String },
  userRole: { type: String, default: "therapist" },

  //Approval 
  isApproved: { type: String, default: "Pending" },
  registeredAt: { type: Date, default: Date.now },
});

export default mongoose.model("therapist", therapistSchema);
