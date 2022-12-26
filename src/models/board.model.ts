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
	members: [
		{
			userName: {
				type: String,
			},
			email: {
				type: String,
			},
			role: {
				type: String,
			},
		},
	],
});

export default mongoose.model<IBoard>('Board', boardSchema);
