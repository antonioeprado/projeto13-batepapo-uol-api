import Joi from "joi";

export const userSchema = Joi.object({
	name: Joi.string().min(3).max(30).required(),
});

export const messageSchema = Joi.object({
	to: Joi.string().required(),
	text: Joi.string().required(),
	type: Joi.string().valid("private_message", "message").required(),
});
