import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { IJWTPayload } from '../interfaces/IJWTPayload';

const SECRET = process.env.JWT_SECRET || 'secret_key';

export const hashPassword = (password: string) => {
	return bcrypt.hash(password, 5);
};

export const comparePasswords = (password: string, hashedPassword: string) => {
	return bcrypt.compare(password, hashedPassword);
};

export const createToken = (payload: IJWTPayload) => jwt.sign(payload, SECRET);

export const authToken = async (token: string) => {
	try {
		const introspection = await jwt.verify(token, SECRET);

		if (typeof introspection === 'string') {
			throw new Error('Something went wrong');
		}

		return introspection;
	} catch (e) {
		return {
			status: StatusCodes.UNAUTHORIZED,
			message: 'Expired or invalid token',
		};
	}
};
