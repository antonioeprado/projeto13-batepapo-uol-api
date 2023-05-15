import { deleteMessages, getMessages, postMessage, updateMessage } from "@/controllers/messages.controller";
import { Router } from "express";

const messagesRouter = Router();

messagesRouter.get("/messages", getMessages);
messagesRouter.post("/messages", postMessage);
messagesRouter.patch("/messages/:id", updateMessage);
messagesRouter.delete("/messages/:id", deleteMessages);

export default messagesRouter;
