import express from "express";
import { sendMessage,getMessages } from "../controllers/chatController.js";    

const chatRouter = express.Router();

chatRouter.post("/get-messages", getMessages);
chatRouter.post("/send-message", sendMessage);

export default chatRouter;