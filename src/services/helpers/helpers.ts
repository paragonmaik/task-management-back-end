import userModel from '../../models/user.model';

type UserQueryField = 'email' | 'userName';

export const findUserByUniqueField = async (
	field: UserQueryField,
	value: string
) => {
	const user = await userModel
		.findOne({ [field]: value }, { _id: 0, boards: 0 })
		.exec();

	return user;
};
