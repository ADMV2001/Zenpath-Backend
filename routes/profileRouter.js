// routes/profileRouter.js
import express from "express";
import { getProfile } from "../controllers/profileController.js";

const profileRouter = express.Router();
profileRouter.get("/", getProfile);

export default profileRouter;
