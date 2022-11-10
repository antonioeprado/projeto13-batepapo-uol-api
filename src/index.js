import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";
import dayjs from "dayjs";
import { userSchema, messageSchema } from "./validationSchema.js";

const app = express();

app.use(express.json());
app.use(cors());
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);

await mongoClient.connect();
const db = mongoClient.db("batePapoUOL");
const participantsCollection = db.collection("participants");
const messagesCollection = db.collection("messages");

app.post("/participants", async (req, res) => {
	const { error, value } = userSchema.validate(req.body);
	if (error) {
		res.status(422).send(error.message);
		return;
	}
	try {
		const participant = await participantsCollection
			.find({ name: value.name })
			.toArray();
		if (participant.length !== 0) {
			res.status(409).send("Usuário já existe!");
			return;
		}
		await participantsCollection.insertOne({
			name: value.name,
			lastStatus: Date.now(),
		});
		await messagesCollection.insertOne({
			from: value.name,
			to: "Todos",
			text: "entra na sala...",
			type: "status",
			time: dayjs("HH:mm:ss"),
		});
		res.sendStatus(201);
	} catch (error) {
		console.log(error);
	}
});

app.post("/messages", async (req, res) => {
	const { error, value } = messageSchema.validate(req.body);
	const participant = await participantsCollection
		.find({ name: req.headers.user })
		.toArray();
	if (error || participant.length === 0) {
		res.status(422).send(error ? error.message : "Usuário não registrado!");
		return;
	}
	await messagesCollection.insertOne({
		from: participant,
		to: value.to,
		text: value.text,
		type: value.type,
		time: dayjs("HH:mm:ss"),
	});
	res.sendStatus(201);
});

app.listen(5000, () => {
	console.log("Server running on port: 5000");
});
