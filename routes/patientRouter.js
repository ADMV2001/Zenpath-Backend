import express from "express";
import {
  registerPatient,
  loginPatient,
  sendOTP,
  verifyOtp,
  getPatientDetails,
  getDashboardPatient,
  updatePatientProfile,
  changePatientPassword,
  getAllPatients,
  deletePatient
} from "../controllers/patientController.js";

const patientRouter = express.Router();

patientRouter.post("/register",           registerPatient);
patientRouter.post("/login",              loginPatient);
patientRouter.post("/send_otp",           sendOTP);
patientRouter.post("/verify_patient_email", verifyOtp);
patientRouter.post("/get_patient", getPatientDetails);
patientRouter.get("/get_dashboard_patient", getDashboardPatient);
patientRouter.get("/get_all_patients", getAllPatients);
patientRouter.put("/update_patient", updatePatientProfile);
patientRouter.put("/change_patient_password", changePatientPassword);
patientRouter.delete("/delete_patient/:id", deletePatient);

export default patientRouter;
