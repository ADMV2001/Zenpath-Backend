import Patient from '../models/patientModel.js';
import Therapist from '../models/therapistModel.js';
import PhqResult from '../models/phqResultModel.js';
import BasicInfo from '../models/basicInfoModel.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import OTP from '../models/otpModel.js';

dotenv.config();

//transporter to send mails using nodemialer
const transport = nodemailer.createTransport({
  service : "gmail",
  host : "smtp.gmail.com",
  port : 587,
  secure : false,
  auth : {
      user : "scottleon1985@gmail.com",
      pass : "uopomtmhhzuodzix" 
  }, 
})

export async function registerPatient(req, res){

    const patientData = req.body;

    patientData.password = bcrypt.hashSync(patientData.password, 10);

    const newPatient = new Patient(patientData);

    try{
        await newPatient.save();
        res.json({message : "Patient registered successfully!"});
    }
    catch(err){
        res.json({message : err});
    }
}

export async function loginPatient(req, res) {
    const { email, password } = req.body;
  
    try {
      // Step 1: Try finding in patients collection
      let user = await Patient.findOne({ email });
      let userType = 'patient';
  
      // Step 2: If not found, try therapists collection
      if (!user) {
        user = await Therapist.findOne({ email });
        userType = 'therapist';
      }
  
      // Step 3: If still not found
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password!" });
      }
  
      // Step 4: Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password!" });
      }
  
      // Step 5: Optional: Check therapist approval
      if (userType === 'therapist' && !user.isApproved) {
        return res.status(403).json({ message: "Your therapist account is not yet approved." });
      }
  
      // Step 6: Generate token
      const token = jwt.sign(
        {
          id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          userRole: user.userRole || userType,
          emailVerified : user.emailVerified
        },
        process.env.jwt_secret,
        { expiresIn: "1d" }
      );
  
      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          userRole: user.userRole || userType,
          emailVerified : user.emailVerified
        }
      });
  
    } catch (err) {
      console.error("Login Error:", err);
      return res.status(500).json({ message: "Server error during login." });
    }
  }

  export async function sendOTP(req, res){
    if(req.user == null){
      return res.status(401).json({message : "Unauthorized!"});
    }

    const otp = Math.floor(100000 + Math.random() * 900000) 

    const newOtp = new OTP({
        email : req.user.email,
        otp : otp
    })

    await newOtp.save()

    //creating the email body
    const message = {
        from : "scottleon1985@gmail.com",
        to : req.user.email,
        subject : "OTP for verification",
        text : "Your OTP for verification is "+ otp
    }

    transport.sendMail(message, (err, info)=>{
        if(err){
            console.log(err)
            res.json({message : "Error while sending email!"})
        }
        else{
            console.log(info)
            res.json({message : "Verification email sent successfully!"})
        }
    })

  }

  export async function verifyOtp(req, res) {
    if (req.user == null) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { otp } = req.body;
    const record = await OTP.findOne({ email: req.user.email, otp });

    if (!record) {
      return res.status(400).json({ message: "Invalid OTP!" });
    }

    // consume OTP
    await OTP.deleteOne({ _id: record._id });
    
    // mark patient verified
    await Patient.updateOne(
      { email: req.user.email },
      { emailVerified: true }
    );
    
    res.json({ message: "Email verified successfully!" });
  }

  export async function getPatientDetails(req, res) {
    if (req.user == null) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = req.body.userId._id;
    try{
    const [basicInfo, patient, phqResults] = await Promise.all([
      BasicInfo.findOne({ userId }),
      Patient.findById(userId),
      PhqResult.find({ userId })
    ]);
    res.json({
      basicInfo,
      patient,
      phqResults
    });

  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Server error" });
  }

  }

  export async function getDashboardPatient(req, res) {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = req.user.id;
  
    try {
      const patient = await Patient.findById(userId).select("-password"); // Don't send password
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      res.json(patient);
    } catch (error) {
      console.error("Error fetching patient data:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  export async function getAllPatients(req, res) {
    try {
      const patients = await Patient.find().select("-password"); // exclude passwords
      if (!patients.length) {
        return res.status(404).json({ message: "No patients found" });
      }
      res.status(200).json(patients);
    } catch (error) {
      console.error("Error fetching all patients:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  export async function updatePatientProfile(req, res) {

    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const userId = req.user.id;
    const { name, mobile } = req.body;

    try {
      const updated = await Patient.findByIdAndUpdate(
        userId,
        { name, mobile },
        { new: true }
      ).select("-password");
      res.json({ message: "Profile updated successfully.", patient: updated });

    } catch (err) {
      res.status(500).json({ message: "Error updating profile." });
    }
  }



  export async function changePatientPassword(req, res) {
    
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
  
    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: "All fields are required." });
  
    try {
      const patient = await Patient.findById(userId);
      if (!patient) return res.status(404).json({ message: "Patient not found." });
  
      const isMatch = await bcrypt.compare(currentPassword, patient.password);
      if (!isMatch)
        return res.status(400).json({ message: "Current password is incorrect." });
  
      patient.password = bcrypt.hashSync(newPassword, 10);
      await patient.save();
  
      res.json({ message: "Password updated successfully." });
    } catch (err) {
      res.status(500).json({ message: "Error updating password." });
    }

  }
  export async function deletePatient(req, res){
    const { id } = req.params;
  
    try {
      const deletedPatient = await Patient.findByIdAndDelete(id);
  
      if (!deletedPatient) {
        return res.status(404).json({ message: "Patient not found" });
      }
  
      res.status(200).json({ message: "Patient deleted successfully" });
    } catch (error) {
      console.error("Error deleting patient:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
  
  