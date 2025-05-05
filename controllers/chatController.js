import Chat from "../models/chatModel.js";

export async function sendMessage(req, res) {
    try {
        const { senderId, receiverId, message } = req.body;
        const newMessage = await Chat.create({ senderId, receiverId, message });
        res.status(201).json(newMessage);
        console.log("Message sent:", newMessage);
      } catch (error) {
        res.status(500).json({ error: "Failed to send message" });
        console.log(error);
      }
}

export async function getMessages(req,res){
    const { user1, user2 } = req.body;
    try {
        const messages = await Chat.find({
          $or: [
            { senderId: user1, receiverId: user2 },
            { senderId: user2, receiverId: user1 }
          ]
        }).sort({ timestamp: 1 });
        res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
}