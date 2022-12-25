import { findUserByUniqueField } from './helpers/helpers';
import { ILogin } from '../interfaces/ILogin';
import { HttpException } from '../middlewares/HttpException';
import { StatusCodes } from 'http-status-codes';
import { comparePasswords, createToken } from '../utils/auth';

const throwsInvalidDataException = () => {
	throw new HttpException(
		StatusCodes.BAD_REQUEST,
		'Invalid email or password!'
	);
};

export const authUser = async ({ email, password }: ILogin) => {
	const user = await findUserByUniqueField('email', email);

	if (!user) {
		return throwsInvalidDataException();
	}

	const isValid = await comparePasswords(password, user.password);

	if (!isValid) {
		return throwsInvalidDataException();
	}

	const payload = {
		userName: user.userName,
		email: user.email,
	};

	const token = await createToken(payload);
	return token;
};
