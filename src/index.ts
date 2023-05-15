import cors from "cors";
import dayjs from "dayjs";
import express, { Express } from "express";
import { Database } from "./config/database";
import { createMessage } from "./repositories/messages.repository";
import { deleteParticipant } from "./repositories/participants.repository";
import messagesRouter from "./routers/messages.router";
import participantsRouter from "./routers/participants.router";
import statusRouter from "./routers/status.router";

export const db = new Database();

const app = express();

app.use(cors());
app.use(express.json());
app.use(participantsRouter);
app.use(messagesRouter);
app.use(statusRouter);

setInterval(async () => {
  try {
    const timeNow = Date.now();
    const isInactive = await db.participants
      .find({
        $expr: {
          $gt: [{ $subtract: [timeNow, "$lastStatus"] }, 10000],
        },
      })
      .toArray();
    isInactive.forEach(async (participant) => {
      await createMessage({
        from: participant.name,
        to: "Todos",
        text: "sai da sala...",
        type: "STATUS",
        time: dayjs(timeNow).format("HH:mm:ss"),
      });
      await deleteParticipant(participant);
    });
  } catch (error) {
    console.log(error);
  }
}, 15000);

export function init(): Promise<Express> {
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await db.close();
}

export default app;
