import { Participant } from "@/models/participants.model";
import { db } from "..";

export function createParticipant(params: Participant) {
  return db.participants.insertOne(params);
}

export function readParticipant(name: string) {
  return db.participants.findOne({ name });
}

export function readParticipants() {
  return db.participants.find().toArray();
}

export function updateParticipant(param: Participant) {
  return db.participants.updateOne(param, { $set: { lastStatus: Date.now() } });
}

export function deleteParticipant(param: Participant) {
  return db.participants.deleteOne(param);
}
