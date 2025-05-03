import express from "express";
import {
  registerPatient,
  loginPatient,
  sendOTP,
  verifyOtp,
  getPatientDetails
} from "../controllers/patientController.js";

const patientRouter = express.Router();

patientRouter.post("/register",           registerPatient);
patientRouter.post("/login",              loginPatient);
patientRouter.post("/send_otp",           sendOTP);
patientRouter.post("/verify_patient_email", verifyOtp);
patientRouter.post("/get_patient", getPatientDetails);

export default patientRouter;
