import { IUser } from '../interfaces/IUser';
import userModel from '../models/user.model';

export const findUserByUniqueField = async (field: string, value: string) => {
	const user = await userModel.findOne({ value }).exec();
	console.log(user);
	return user;
};

export const registerNewUser = async (user: IUser) => {
	return '';
};
