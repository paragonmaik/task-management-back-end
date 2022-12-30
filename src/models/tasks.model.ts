import mongoose from 'mongoose';
import { ITask } from '../interfaces/ITask';

export const taskSchema = new mongoose.Schema({
	description: {
		type: String,
		required: true,
	},
	subTasks: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'SubTask',
		},
	],
	ownerColumn: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Column',
	},
});

export default mongoose.model<ITask>('Task', taskSchema);
