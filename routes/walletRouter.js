import express from "express";
import { getPatientWallet, addCoins, createCheckoutSession } from "../controllers/walletController.js";

const walletRouter = express.Router();

walletRouter.get("/get_patient_wallet", getPatientWallet);
walletRouter.post("/add_coins", addCoins); 
walletRouter.post("/create-checkout-session", createCheckoutSession);

export default walletRouter;
