import Patient from '../models/patientModel.js';
import Therapist from '../models/therapistModel.js';
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

  