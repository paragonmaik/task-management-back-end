import { Types } from 'mongoose';

export interface ISubTask {
	description: string;
	ownerTask?: Types.ObjectId;
	done?: boolean;
}
