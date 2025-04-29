import express from "express";
import { submitBasicInfo } from "../controllers/basicInfoController.js";
const router = express.Router();

router.post("/submit", submitBasicInfo);

export default router;
