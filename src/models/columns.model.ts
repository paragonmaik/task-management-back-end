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
	ownerBoard: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Board',
	},
});

export default mongoose.model<IColumn>('Column', columnSchema);
