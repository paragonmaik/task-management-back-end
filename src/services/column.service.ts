import { Types } from 'mongoose';
import { HttpException } from '../middlewares/HttpException';
import { StatusCodes } from 'http-status-codes';
import { IColumn } from '../interfaces/IColumn';
import columnModel from '../models/columns.model';
import boardModel from '../models/board.model';
import tasksModel from '../models/tasks.model';
import * as taskService from './task.service';

interface UpdatedColumns extends IColumn {
	_id: Types.ObjectId;
}

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
		throw new HttpException(StatusCodes.NOT_FOUND, 'Column does not exist!');
	}

	return column;
};

export const updateColumnTasksOrder = async (
	updatedColumns: UpdatedColumns[]
) => {
	const columns: UpdatedColumns[] = [];

	for (const column of updatedColumns) {
		if (!column.tasks) {
			throw new HttpException(
				StatusCodes.NOT_FOUND,
				'Column does not contain tasks!'
			);
		}

		// updates list of tasks in each column
		await columnModel.findByIdAndUpdate(
			column._id,
			{ tasks: column.tasks },
			{ new: true }
		);

		for (const task of column.tasks) {
			await tasksModel.findByIdAndUpdate(
				task,
				{ ownerColumn: column._id },
				{ new: true }
			);
		}
		const response = await columnModel.findById(column._id);
		columns.push(response as UpdatedColumns);
	}
	return columns;
};

export const deleteColumn = async (columnId: string) => {
	await columnModel.findByIdAndDelete(columnId);

	const tasks = await tasksModel.find({
		ownerColumn: columnId,
	});

	tasks.forEach(async (task) => {
		await taskService.deleteTask(task.id);
	});
};
