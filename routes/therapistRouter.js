// therapistRouter.js
import express from 'express';
import { registerTherapist, loginTherapist, getPendingTherapists, approveTherapist, getApprovedTherapists, sendPendingReqEmail, rejectTherapist, getCurrentTherapist, updateTherapistProfilePicture } from '../controllers/therapistController.js';
import upload from '../middleware/uploadMiddleware.js';

const therapistRouter = express.Router();

therapistRouter.post(
  "/register",
  upload.fields([
    { name: "licenseDocument", maxCount: 1 },
    { name: "cvOrResumeUrl", maxCount: 1 },
    { name: "profilePicture", maxCount: 1 },
  ]),
  registerTherapist
);

therapistRouter.post("/login", loginTherapist);
therapistRouter.get("/pending", getPendingTherapists);
therapistRouter.put("/approve/:id", approveTherapist);
therapistRouter.get("/reject/:id", rejectTherapist); 
therapistRouter.get("/approved", getApprovedTherapists);
therapistRouter.post("/sendPendingEmail", sendPendingReqEmail)
therapistRouter.get("/me", getCurrentTherapist)
therapistRouter.get("/updateTherapistProfilePicture", updateTherapistProfilePicture);

export default therapistRouter;
