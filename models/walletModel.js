import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "patient", 
    required: true, 
    unique: true 
},
  coins: { 
    type: Number, 
    default: 0 
},
}, { collection: 'wallets' });

export default mongoose.model("wallet", walletSchema);
