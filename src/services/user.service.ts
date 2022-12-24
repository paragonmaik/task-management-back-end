import { IUser } from '../interfaces/IUser';
import userModel from '../models/user.model';

export const findUserByUniqueField = async (field: string, value: string) => {
	const user = await userModel
		.findOne({ [field]: value }, { _id: 0, boards: 0 })
		.exec();

	return user;
};

export const registerNewUser = async (user: IUser) => {
	return '';
};
