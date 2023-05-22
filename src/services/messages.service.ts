import { MessageInput } from "@/models/messages.model";
import {
  createMessage,
  readMessage,
  readMessages,
  deleteMessage,
  updateMessage,
} from "@/repositories/messages.repository";
import dayjs from "dayjs";
import { findParticipant } from "./participants.service";

export async function registerMessage(messageParams: MessageInput) {
  const sender = await findParticipant(messageParams.from);
  if(!sender) throw new Error("User doesn't exist");
  if(messageParams.to === "Todos") {
  	return await createMessage({ ...messageParams, time: dayjs().format("HH:mm:ss") });
  }
  const receiver = await findParticipant(messageParams.to);
  if (!receiver) throw new Error("User doesn't exist");
  await createMessage({ ...messageParams, time: dayjs().format("HH:mm:ss") });
}

export async function findMessages(limit?: number, user?: string) {
  const messages = await readMessages(user ? user : "Todos");
  if (limit) {
    return messages.filter((value, index) => index < limit);
  }
  return messages;
}

export async function removeMessage(name: string, id: string) {
  const messageToDelete = await readMessage(id);
  if (messageToDelete.from !== name) throw new Error("Cannot delete message");
  await deleteMessage(id);
}

export async function changeMessage(name: string, message: MessageInput, id: string) {
  const messageToUpdate = await readMessage(id);
  if (messageToUpdate.from !== name) throw new Error("Cannot update message");
  await updateMessage(id, { ...message, time: dayjs().format("HH:mm:ss") });
}
