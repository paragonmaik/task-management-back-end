import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { HttpException } from './HttpException';
import { ObjectSchema } from 'joi';

export const validateSchema =
	(schema: ObjectSchema) =>
	async (req: Request, _res: Response, next: NextFunction) => {
		try {
			await schema.validateAsync(req.body);
			return next();
		} catch (err) {
			if (err instanceof Error) {
				throw new HttpException(StatusCodes.BAD_REQUEST, err.message);
			}
		}
	};
