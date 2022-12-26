import { Types } from 'mongoose';

export interface IUser {
	userName: string;
	email: string;
	password: string;
	boards?: Array<Types.ObjectId>;
}
