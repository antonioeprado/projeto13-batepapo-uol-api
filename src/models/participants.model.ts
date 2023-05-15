import Joi from "joi";

export type Participant = {
  name: string;
  lastStatus: number;
};

export const userValidationModel = Joi.object({
  name: Joi.string().min(3).max(30).required(),
});
