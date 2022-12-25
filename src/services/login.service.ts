import { findUserByUniqueField } from './helpers/helpers';
import { ILogin } from '../interfaces/ILogin';
import { HttpException } from '../middlewares/HttpException';
import { StatusCodes } from 'http-status-codes';

export const authUser = async ({ email, password }: ILogin) => {
	const user = await findUserByUniqueField('email', email);

	if (!user) {
		throw new HttpException(
			StatusCodes.BAD_REQUEST,
			'Invalid email or password!'
		);
	}
	console.log(user);
	return '';
};
