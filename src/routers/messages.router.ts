import { deleteMessages, getMessages, postMessage, updateMessage } from "@/controllers/messages.controller";
import { validateBody } from "@/middlewares/validate.middleware";
import { messageValidationModel } from "@/models/messages.model";
import { Router } from "express";

const messagesRouter = Router();

messagesRouter.get("/messages", getMessages);
messagesRouter.post("/messages", validateBody(messageValidationModel), postMessage);
messagesRouter.patch("/messages/:id", validateBody(messageValidationModel), updateMessage);
messagesRouter.delete("/messages/:id", deleteMessages);

export default messagesRouter;
