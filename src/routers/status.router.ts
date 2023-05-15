import { updateStatus } from "@/controllers/participants.controller";
import { Router } from "express";

const statusRouter = Router();

statusRouter.post("/status", updateStatus);

export default statusRouter;
