import express from "express";
import { getPatientWallet, addCoins, createCheckoutSession, getTherapistWallet, addCoinsToTherapist } from "../controllers/walletController.js";

const walletRouter = express.Router();

walletRouter.get("/get_patient_wallet", getPatientWallet);
walletRouter.get("/get_therapist_wallet", getTherapistWallet);
walletRouter.post("/add_coins", addCoins); 
walletRouter.post("/add_coins_to_therapist", addCoinsToTherapist); 
walletRouter.post("/create-checkout-session", createCheckoutSession);

export default walletRouter;