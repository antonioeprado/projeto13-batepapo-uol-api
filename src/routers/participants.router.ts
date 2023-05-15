import { getParticipants, postParticipants } from "@/controllers/participants.controller";
import { Router } from "express";

const participantsRouter = Router();

participantsRouter.get("/participants", getParticipants);
participantsRouter.post("/participants", postParticipants);

export default participantsRouter;
