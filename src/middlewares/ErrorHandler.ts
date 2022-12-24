import { ReasonPhrases } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import { HttpException } from './HttpException';

export function ErrorHandler(
	err: HttpException,
	_req: Request,
	res: Response,
	_next: NextFunction
) {
	const errResponse = {
		status: err.status,
		message: err.message,
	};

	return res.status(errResponse.status || 500).json(
		errResponse || {
			status: 500,
			message: ReasonPhrases.INTERNAL_SERVER_ERROR,
		}
	);
}
