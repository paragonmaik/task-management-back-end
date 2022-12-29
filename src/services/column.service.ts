import columnModel from '../models/columns.model';
import boardModel from '../models/board.model';
import { IColumn } from '../interfaces/IColumn';

export const createNewColumn = async (column: IColumn, boardId: string) => {
	const createdColumn = await columnModel.create({
		columnName: column.columnName,
		ownerBoard: boardId,
	});

	await boardModel.findByIdAndUpdate(boardId, {
		$push: { columns: createdColumn.id },
	});

	return createdColumn;
};

export const getColumnsByBoardId = async (boardId: string) => {
	const columnsList = await columnModel.find({
		ownerBoard: { $in: boardId },
	});

	return columnsList;
};
