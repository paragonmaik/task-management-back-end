import mongoose from 'mongoose';
import { ISubTask } from '../interfaces/ISubTask';

export const subTaskSchema = new mongoose.Schema({
	description: {
		type: String,
		required: true,
	},
});

export default mongoose.model<ISubTask>('SubTask', subTaskSchema);
