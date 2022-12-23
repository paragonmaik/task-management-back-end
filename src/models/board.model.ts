import mongoose from 'mongoose';
import { IBoard } from '../interfaces/IBoard';

export const boardSchema = new mongoose.Schema({
	boardName: {
		type: String,
		required: true,
	},
	columns: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Column',
		},
	],
});

export default mongoose.model<IBoard>('Board', boardSchema);
