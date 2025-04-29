// routes/phqResultRouter.js
import express from "express";
import { submitPhqResult } from "../controllers/phqResultController.js";

const phqRouter = express.Router();

phqRouter.post("/submit", submitPhqResult);

export default phqRouter;
