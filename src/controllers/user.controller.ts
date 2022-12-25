import { Request, Response } from 'express';
import { IUser } from '../interfaces/IUser';
import { StatusCodes } from 'http-status-codes';
import * as user from '../services/user.service';

export const createUser = async (
	req: Request<unknown, unknown, IUser>,
	res: Response
) => {
	const token = await user.registerNewUser(req.body);

	res.status(StatusCodes.CREATED).json({ token });
};
