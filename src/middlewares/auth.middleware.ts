import { authToken } from '../utils/auth';
import { Request, Response, NextFunction } from 'express';
import { HttpException } from './HttpException';
import { StatusCodes } from 'http-status-codes';

export const authenticationMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = req.headers.authorization;
	if (!token) {
		throw new HttpException(StatusCodes.UNAUTHORIZED, 'Token not found');
	}
	const payload = await authToken(token);
	if (payload.status === 401) {
		throw new HttpException(payload.status, payload.message);
	}

	res.locals.payload = payload;
	next();
};
