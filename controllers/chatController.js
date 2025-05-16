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
        const update = await Chat.updateMany(
          { senderId: user2, receiverId: user1, isRead: false },
          { $set: { isRead: true } }
        );
        res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
}

export async function getUnreadCount(req,res){
  try{
    if(req.user == null){
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    const unreadCount= await Chat.countDocuments({ receiverId: userId, isRead: false });
    if(unreadCount == null){
      res.json({ count: 0});
    }
    res.json({ count: unreadCount });
  }
  catch(err){
    console.log(err);
    res.status(500).json({ message: "Error fetching unread messages." });
  }

}

export async function getUnreadUsers(req,res){
  try{
    if(req.user == null){
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
     const unreadUsers = await Chat.aggregate([
      {
        $match: {
          receiverId: userId,
          isRead: false
        }
      },
      {
        $group: {
          _id: "$senderId",// count unread messages per sender
          unreadCount: { $sum: 1 }
        }
      },
      {
        $project: {
          senderId: "$_id",
          unreadCount: 1,
          _id: 0
        }
      }
    ]);
    console.log(unreadUsers);
    res.json({ unreadUsers });
  }
  catch(err){
    console.log(err);
    res.status(500).json({ message: "Error fetching unread messages..." });
  }
}