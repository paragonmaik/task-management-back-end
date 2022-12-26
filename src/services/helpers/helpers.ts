import userModel from '../../models/user.model';

type UserQueryField = 'email' | 'userName';

export const findUserByUniqueField = async (
	field: UserQueryField,
	value: string
) => {
	const user = await userModel.findOne({ [field]: value }).exec();

	return user;
};
