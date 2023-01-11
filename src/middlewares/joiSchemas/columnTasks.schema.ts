import Joi from 'joi';

export const ColumnTasksSchema = Joi.object({
	updatedColumns: Joi.array().required().min(1),
});
