import Joi from 'joi';

export const BoardColumnsSchema = Joi.object({
	columns: Joi.array().required().min(1),
});
