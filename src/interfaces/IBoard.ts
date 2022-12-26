import { Types } from 'mongoose';
import { IMember } from './IMember';

export interface IBoard {
	boardName: string;
	columns?: Array<Types.ObjectId>;
	members?: Array<IMember>;
}
