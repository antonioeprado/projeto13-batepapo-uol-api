import { getParticipants, postParticipants } from "@/controllers/participants.controller";
import { validateBody } from "@/middlewares/validate.middleware";
import { userValidationModel } from "@/models/participants.model";
import { Router } from "express";

const participantsRouter = Router();

participantsRouter.get("/participants", getParticipants);
participantsRouter.post("/participants", validateBody(userValidationModel), postParticipants);

export default participantsRouter;
