import Wallet from "../models/walletModel.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.stripe_secret);


export async function getPatientWallet(req, res) {
  const userId = req.user.id;

  let wallet = await Wallet.findOne({ userId });

  if (!wallet) {
    wallet = await Wallet.create({ userId, coins: 0 });
  }
  res.json(wallet);
}

export async function addCoins(req, res) {
    const userId = req.user.id;
    const { coins } = req.body;
  
    const wallet = await Wallet.findOneAndUpdate(
      { userId },
      { $inc: { coins } },
      { new: true }
    );
  
    res.json(wallet);
  }
  

export async function createCheckoutSession(req, res) {
    try {
      const { coins } = req.body;
      const userId = req.user.id; // assuming you use auth middleware
  
      // Calculate price (example: 1 coin = 1000 LKR, in cents for Stripe)
      const pricePerCoin = 1000; // LKR
      const totalAmount = coins * pricePerCoin;
  
      // Create Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{
          price_data: {
            currency: "lkr", // or "usd" if you use USD
            product_data: {
              name: "ZenCoin",
            },
            unit_amount: pricePerCoin * 100, // Stripe expects amount in cents (if using LKR, check if supported)
          },
          quantity: coins,
        }],
        mode: "payment",
        success_url: "http://localhost:5173/patient_wallet?success=true",
        cancel_url: "http://localhost:5173/patient_wallet?canceled=true",

        metadata: {
          userId,
          coins,
        },
      });
  
      res.json({ url: session.url });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating Stripe session" });
    }
  }