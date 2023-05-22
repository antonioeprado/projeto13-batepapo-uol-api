import Joi from "joi";

export type Message = {
  from: string;
  to: string;
  text: string;
  type: "PRIVATE_MESSAGE" | "PUBLIC" | "STATUS";
  time: string;
};

export type MessageInput = {
  from: string;
  to: string;
  text: string;
  type: "PRIVATE_MESSAGE" | "PUBLIC" | "STATUS";
};

export const messageValidationModel = Joi.object({
  from: Joi.string().required(),
  to: Joi.string().required(),
  text: Joi.string().required(),
  type: Joi.string().valid("PRIVATE_MESSAGE", "PUBLIC").required(),
});
