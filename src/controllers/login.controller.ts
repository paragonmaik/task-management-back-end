import { Request, Response } from 'express';
import { ILogin } from '../interfaces/ILogin';
import { StatusCodes } from 'http-status-codes';
import * as login from '../services/login.service';

export const signIn = async (
	req: Request<unknown, unknown, ILogin>,
	res: Response
) => {
	const token = await login.authUser(req.body);
};
