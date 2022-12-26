import { Types } from 'mongoose';

export interface ITask {
	description: string;
	subTasks?: Array<Types.ObjectId>;
}
