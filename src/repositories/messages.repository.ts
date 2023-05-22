import { Message } from "@/models/messages.model";
import { ObjectId } from "mongodb";
import { db } from "..";

export function createMessage(params: Message) {
  return db.messages.insertOne(params);
}

export function readMessage(id: string) {
  return db.messages.findOne({ _id: new ObjectId(id) });
}

export function readMessages(user?: string) {
  return db.messages
    .find({ $or: [{ from: user }, { to: user }, { type: "PUBLIC" }] })
    .sort({ $natural: 1 })
    .toArray();
}

export function updateMessage(id: string, params: Message) {
  return db.messages.updateOne({ _id: new ObjectId(id) }, { $set: { ...params } });
}

export function deleteMessage(id: string) {
  return db.messages.deleteOne({ _id: new ObjectId(id) });
}
