import { findParticipants, registerUser, updateParticipantStatus } from "@/services/participants.service";
import { Response, Request } from "express";
import httpStatus from "http-status";

export async function postParticipants(req: Request, res: Response) {
  try {
    const { name } = req.body;
    await registerUser(name);
    res.sendStatus(httpStatus.CREATED);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function getParticipants(req: Request, res: Response) {
  try {
    const participants = await findParticipants();
    res.status(httpStatus.OK).send(participants);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(httpStatus.NOT_FOUND).send(error.message);
    }
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function updateStatus(req: Request, res: Response) {
  try {
    const name = req.headers.user as string;
    await updateParticipantStatus(name);
    res.sendStatus(httpStatus.OK);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(httpStatus.NOT_FOUND).send(error.message);
    }
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
