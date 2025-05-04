import express from "express";
import { getPatientWallet, addCoins } from "../controllers/walletController.js";

const walletRouter = express.Router();

walletRouter.get("/get_patient_wallet", getPatientWallet);
walletRouter.post("/add_coins", addCoins); 

export default walletRouter;
