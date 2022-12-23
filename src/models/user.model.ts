import mongoose from 'mongoose';
import { IUser } from '../interfaces/IUser';

const userSchema = new mongoose.Schema({
	userName: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	boards: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Board',
		},
	],
});

export default mongoose.model<IUser>('User', userSchema);
