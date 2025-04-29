import Therapist from '../models/therapistModel.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

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

export async function registerTherapist(req, res) {
    try {
      const data = req.body;
  
      // Attach file paths
      if (req.files.licenseDocument) {
        data.licenseDocument = req.files.licenseDocument[0].path;
      }
      if (req.files.cvOrResumeUrl) {
        data.cvOrResumeUrl = req.files.cvOrResumeUrl[0].path;
      }
  
      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;
  
      const newTherapist = new Therapist({ ...data, isApproved: "Pending" });
      await newTherapist.save();

      const message = {
        from: "scottleon1985@gmail.com",
        to: newTherapist.email,
        subject: "Registration Request - Pending...",
        text: "Your registration request is pending approval. You will be notified once it is approved.",
      };
  
      transport.sendMail(message, (err, info) => {
        if (err) {
          console.error("Email error:", err);
        } else {
          console.log("Pending registration email sent:", info.response);
        }
      });
  
      res.status(201).json({ message: "Registration submitted. Awaiting admin approval." });
    } catch (err) {
      console.error("Register Error:", err);
      res.status(500).json({ message: err.message });
    }
  }
  


export async function loginTherapist(req, res) {
    const loginData = req.body;
  
    try {
      const therapist = await Therapist.findOne({ email: loginData.email });
  
      if (!therapist) {
        return res.status(400).json({ message: "Invalid email or password!" });
      }
  
      const isMatch = await bcrypt.compare(loginData.password, therapist.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password!" });
      }
  
      if (therapist.isApproved=== "Pending" || therapist.isApproved === "Rejected") {
        return res.status(403).json({ message: "Your account is not yet approved by admin." });
      }
  
      const token = jwt.sign(
        {
          id: therapist._id,
          name: therapist.name,
          email: therapist.email,
          userRole: therapist.userRole,
          isApproved: therapist.isApproved
        },
        process.env.jwt_secret
      );
  
      return res.status(200).json({
        message: "Login successful!",
        token,
        therapist: {
          name: therapist.name,
          email: therapist.email,
          userRole: therapist.userRole,
          isApproved: therapist.isApproved
        }
      });
  
    } catch (err) {
      console.error("Login Error:", err);
      return res.status(500).json({ message: err.message || "An error occurred during login" });
    }
  }

  // Get all unapproved therapists
export async function getPendingTherapists(req, res) {
    try {
      const pending = await Therapist.find({ isApproved: "Pending" });
      res.status(200).json(pending);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  
  // Approve a therapist
  export async function approveTherapist(req, res) {
    try {
      const { id } = req.params;
  
      // Find the therapist to get their email
      const therapist = await Therapist.findById(id);
      if (!therapist) {
        return res.status(404).json({ message: "Therapist not found." });
      }
  
      // Update approval
      therapist.isApproved = "Approved";
      await therapist.save();
  
      // ✅ Send approval email
      const message = {
        from: "scottleon1985@gmail.com",
        to: therapist.email,
        subject: "Registration Approved ✅",
        text: `Hello ${therapist.name},\n\nYour registration has been approved. You can now log in and start using the platform.\n\nThank you!`
      };
  
      transport.sendMail(message, (err, info) => {
        if (err) {
          console.error("Error sending approval email:", err);
        } else {
          console.log("Approval email sent:", info.response);
        }
      });
  
      res.status(200).json({ message: "Therapist Approved!" });
    } catch (err) {
      console.error("Approve Error:", err);
      res.status(500).json({ message: err.message });
    }
  }

  export async function rejectTherapist(req, res) {
    try {
      const { id } = req.params;
  
      // Find the therapist to get their email
      const therapist = await Therapist.findById(id);
      if (!therapist) {
        return res.status(404).json({ message: "Therapist not found." });
      }
  
      // ✅ Send approval email
      const message = {
        from: "scottleon1985@gmail.com",
        to: therapist.email,
        subject: "Registration Rejected ❌",
        text: `Hello ${therapist.name},\n\nYour registration has been rejected. You can contact us for further details.\n\nThank you!`
      };
  
      transport.sendMail(message, (err, info) => {
        if (err) {
          console.error("Error sending email:", err);
        } else {
          console.log("Rejected email sent:", info.response);
        }
      });
  
      res.status(200).json({ message: "Therapist Rejected!" });
    } catch (err) {
      console.error("Reject Error:", err);
      res.status(500).json({ message: err.message });
    }
  }
  
  
  // Get all approved therapists
export async function getApprovedTherapists(req, res) {
  try {
    const approved = await Therapist.find({ isApproved: "Approved" });
    res.status(200).json(approved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function sendPendingReqEmail(req, res){
  const message = {
    from : "scottleon1985@gmail.com",
    to : req.body.email,
    subject : "Registration Request - Pending...",
    text : "Your registration request is pending approval. You will be notified once it is approved.",
  }

  transport.sendMail(message, (err, info) => {
    if(err){
      console.log(err)
      res.json({message : "Error in sending email"})
    }
    else{
      console.log("Email sent: " + info.response)
      res.json({message : "Email sent successfully"})
    }
  })
}

export async function getCurrentTherapist(req, res) {
  if (!req.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const therapist = await Therapist
      .findById(req.user.id)
      .select("-password");    // omit password hash

    if (!therapist) {
      return res.status(404).json({ message: "Therapist not found" });
    }
    res.json(therapist);
  } catch (err) {
    console.error("GetCurrent Error:", err);
    res.status(500).json({ message: err.message });
  }
}

export async function updateTherapistProfilePicture(req, res) {
  const therapistId = req.user.id; 
  const { profilePicture } = req.body;

  if (!profilePicture) {
    return res.status(400).json({ message: "Profile picture URL is required!" });
  }

  try {
    const updatedTherapist = await Therapist.findByIdAndUpdate(
      therapistId,
      { profilePicture },
      { new: true }
    );

    if (!updatedTherapist) {
      return res.status(404).json({ message: "Therapist not found!" });
    }

    return res.status(200).json({ message: "Profile picture updated successfully!", therapist: updatedTherapist });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    return res.status(500).json({ message: "Server error while updating profile picture!" });
  }
}

export async function getOneTherapist(req, res){
  
  try{
    const id = req.params.id;

    const therapist = await Therapist.findOne({_id: id})

    if (!therapist) {
      return res.status(404).json({ message: "Therapist not found" });
    }

    return res.json(therapist);
  }
  catch(err){
    console.error(err)
    return res.status(500).json({message : "Error in getting therapist"})
  }
}


  