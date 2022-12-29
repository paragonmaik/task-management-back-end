import columnModel from '../models/columns.model';
import boardModel from '../models/board.model';
import { HttpException } from '../middlewares/HttpException';
import { StatusCodes } from 'http-status-codes';
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

export const updateColumnTitleById = async (
	columnId: string,
	columnName: string
) => {
	const column = await columnModel.findByIdAndUpdate(
		columnId,
		{ columnName },
		{ new: true }
	);

	if (!column) {
		throw new HttpException(StatusCodes.NOT_FOUND, 'Board does not exist!');
	}

	return column;
};
