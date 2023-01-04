import mongoose from 'mongoose';
import { ISubTask } from '../interfaces/ISubTask';

export const subTaskSchema = new mongoose.Schema({
	description: {
		type: String,
		required: true,
	},
	ownerTask: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Task',
	},
	done: {
		type: Boolean,
		default: false,
	},
});

export default mongoose.model<ISubTask>('SubTask', subTaskSchema);
