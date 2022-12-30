import Joi from 'joi';

export const TaskSchema = Joi.object({
	description: Joi.string().required(),
});
