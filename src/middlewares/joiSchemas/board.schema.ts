import Joi from 'joi';

export const BoardSchema = Joi.object({
	boardName: Joi.string().required(),
});
