import Joi from 'joi';

export const UserSchema = Joi.object({
	userName: Joi.string().required().min(6),
	password: Joi.string().required().min(8),
	email: Joi.string().email({
		minDomainSegments: 2,
		tlds: { allow: ['com', 'net'] },
	}),
});
