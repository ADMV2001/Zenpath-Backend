import Wallet from "../models/walletModel.js";


export async function getPatientWallet(req, res) {
  const userId = req.user.id;

  let wallet = await Wallet.findOne({ userId });

  if (!wallet) {
    wallet = await Wallet.create({ userId, coins: 0 });
  }
  res.json(wallet);
}

export async function addCoins(req, res) {
  const { userId, coins } = req.body;
  const wallet = await Wallet.findOneAndUpdate(
    { userId },
    { $inc: { coins } },
    { new: true }
  );
  res.json(wallet);
}
