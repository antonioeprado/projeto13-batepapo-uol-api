import { Message } from "@/models/messages.model";
import { Participant } from "@/models/participants.model";
import dotenv from "dotenv";
import { Collection, MongoClient } from "mongodb";

dotenv.config();

export class Database {
  private client: MongoClient;
  public readonly participants: Collection<Participant>;
  public readonly messages: Collection<Message>;
  constructor() {
    this.client = new MongoClient(process.env.MONGO_URI);
    this.init();
    this.participants = this.client.db("batePapoUOL").collection("participants");
    this.messages = this.client.db("batePapoUOL").collection("messages");
  }

  async init() {
    try {
      await this.client.connect();
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
      console.log(error);
    }
  }

  async close() {
    await this.client.close();
    console.log("Connection closed");
  }
}
