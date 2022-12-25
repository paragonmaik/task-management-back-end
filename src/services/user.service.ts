import { IUser } from '../interfaces/IUser';
import { HttpException } from '../middlewares/HttpException';
import { StatusCodes } from 'http-status-codes';
import { createToken, hashPassword } from '../utils/auth';
import userModel from '../models/user.model';

export const findUserByUniqueField = async (field: string, value: string) => {
	const user = await userModel
		.findOne({ [field]: value }, { _id: 0, boards: 0 })
		.exec();

	return user;
};

export const registerNewUser = async (user: IUser) => {
	const userIsFound = await findUserByUniqueField('email', user.email);

	if (userIsFound) {
		throw new HttpException(StatusCodes.CONFLICT, 'User already registered!');
	}

	await userModel.create({
		userName: user.userName,
		email: user.email,
		password: await hashPassword(user.password),
	});

	const token = createToken({ userName: user.userName, email: user.email });
	return token;
};
