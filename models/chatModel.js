import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  });

const Chat = mongoose.model("Chat", chatSchema);


export default Chat;
