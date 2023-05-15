import { createMessage } from "@/repositories/messages.repository";
import {
  createParticipant,
  readParticipant,
  readParticipants,
  updateParticipant,
} from "@/repositories/participants.repository";
import dayjs from "dayjs";

export async function registerUser(name: string) {
  await isRegistered(name);
  await createParticipant({ name, lastStatus: Date.now() });
  await announceParticipant(name);
}

export async function findParticipants() {
  const participants = await readParticipants();
  if (participants.length === 0) throw new Error("Couldn't find participants");
  return participants;
}

export async function isRegistered(name: string) {
  const isRegistered = await readParticipant(name);
  if (isRegistered) throw new Error("User already registered!");
}

export async function findParticipant(name: string) {
  return await readParticipant(name);
}

export async function updateParticipantStatus(name: string) {
  const user = await findParticipant(name);
  await updateParticipant(user);
}

async function announceParticipant(name: string) {
  await createMessage({
    from: name,
    to: "Todos",
    text: "entra na sala...",
    type: "STATUS",
    time: dayjs().format("HH:mm:ss"),
  });
}
