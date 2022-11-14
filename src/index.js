import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";
import dayjs from "dayjs";
import { stripHtml } from "string-strip-html";
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
	const sanitizedName = stripHtml(req.body.name.trim()).result;
	const { error, value } = userSchema.validate({ name: sanitizedName });
	if (error) {
		res.status(422).send(error.message);
		return;
	}
	try {
		const participant = await participantsCollection.findOne({
			name: value.name,
		});
		if (participant) {
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
			time: dayjs().format("HH:mm:ss"),
		});
		res.sendStatus(201);
	} catch (error) {
		console.log(error);
	}
});

app.get("/participants", async (req, res) => {
	try {
		const participants = await participantsCollection.find().toArray();
		res.send(participants);
	} catch (error) {
		console.log(error);
	}
});

app.post("/messages", async (req, res) => {
	const sanitizedObjMessage = {
		to: stripHtml(req.body.to).result.trim(),
		text: stripHtml(req.body.text).result.trim(),
		type: stripHtml(req.body.type).result.trim(),
	};
	try {
		const { error, value } = messageSchema.validate(sanitizedObjMessage);
		const participant = await participantsCollection.findOne({
			name: stripHtml(req.headers.user).result.trim(),
		});
		if (error || !participant) {
			res.status(422).send(error ? error.message : "Usuário não registrado!");
			return;
		}
		await messagesCollection.insertOne({
			from: participant,
			to: value.to,
			text: value.text,
			type: value.type,
			time: dayjs().format("HH:mm:ss"),
		});
		res.sendStatus(201);
	} catch (error) {
		console.log(error);
	}
});

app.get("/messages", async (req, res) => {
	try {
		const limit = req.query.limit;
		const user = req.headers.user;
		const messages = await messagesCollection
			.find({ $or: [{ to: user }, { to: "Todos" }] })
			.sort({ $natural: 1 })
			.toArray();
		messages.reverse();
		if (limit) {
			res.send(messages.filter((value, index) => index < limit));
			return;
		}
		res.send(messages);
	} catch (error) {
		console.log(error);
	}
});

app.post("/status", async (req, res) => {
	try {
		const participant = await participantsCollection.findOne({
			name: req.headers.user,
		});
		if (!participant) {
			res.sendStatus(404);
			return;
		}
		await participantsCollection.updateOne(participant, {
			$set: { lastStatus: Date.now() },
		});
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
	}
});

setInterval(async () => {
	try {
		const timeNow = Date.now();
		const isInactive = await participantsCollection
			.find({
				$expr: {
					$gt: [{ $subtract: [timeNow, "$lastStatus"] }, 10000],
				},
			})
			.toArray();
		isInactive.forEach(async (participant) => {
			await messagesCollection.insertOne({
				from: participant.name,
				to: "Todos",
				text: "sai da sala...",
				type: "status",
				time: dayjs(timeNow),
			});
			await participantsCollection.deleteOne(participant);
		});
	} catch (error) {
		console.log(error);
	}
}, 15000);

app.listen(5000, () => {
	console.log("Server running on port: 5000");
});
