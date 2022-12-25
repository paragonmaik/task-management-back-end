import userModel from '../models/user.model';
import { hashPassword } from '../utils/auth';
import { user } from './seeds/data';

export const dbSeed = async () => {
	await userModel.create({
		userName: user.userName,
		email: user.email,
		password: await hashPassword(user.password),
	});
};
