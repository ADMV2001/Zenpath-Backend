import express from "express";
import { sendMessage,getMessages,getUnreadCount,getUnreadUsers} from "../controllers/chatController.js";    

const chatRouter = express.Router();

chatRouter.post("/get-messages", getMessages);
chatRouter.post("/send-message", sendMessage);
chatRouter.get("/get-unread-count", getUnreadCount);
chatRouter.get("/get-unread-users", getUnreadUsers);

export default chatRouter;