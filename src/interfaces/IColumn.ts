import { Types } from 'mongoose';

export interface IColumn {
	columnName: string;
	tasks?: Array<Types.ObjectId>;
	ownerBoard?: Types.ObjectId;
}
