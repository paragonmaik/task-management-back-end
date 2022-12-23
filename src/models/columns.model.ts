import mongoose from 'mongoose';
import { IColumn } from '../interfaces/IColumn';

export const columnSchema = new mongoose.Schema({
	columnName: {
		type: String,
		required: true,
	},
	tasks: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Task',
		},
	],
});

export default mongoose.model<IColumn>('Column', columnSchema);
