import Joi from 'joi';

export const ColumnSchema = Joi.object({
	columnName: Joi.string().required(),
});
