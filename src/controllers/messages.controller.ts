import { changeMessage, findMessages, registerMessage, removeMessage } from "@/services/messages.service";
import { Response, Request } from "express";
import httpStatus from "http-status";

export async function postMessage(req: Request, res: Response) {
  try {
    const message = req.body;
    await registerMessage(message);
    res.sendStatus(httpStatus.CREATED);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(httpStatus.BAD_REQUEST).send(error.message);
    }
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function getMessages(req: Request, res: Response) {
  try {
    const { limit } = req.query;
    const { user } = req.headers;
    const messages = await findMessages(+limit, user as string);
    res.status(httpStatus.OK).send(messages);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(httpStatus.NOT_FOUND).send(error.message);
    }
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function deleteMessages(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const { user } = req.headers;
    await removeMessage(user as string, id);
    res.sendStatus(httpStatus.OK);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(httpStatus.NOT_FOUND).send(error.message);
    }
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function updateMessage(req: Request, res: Response) {
  try {
    const message = req.body;
    const id = req.params.id;
    await changeMessage(message.from, message, id);
    res.sendStatus(httpStatus.OK);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(httpStatus.NOT_FOUND).send(error.message);
    }
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
