import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as column from '../services/column.service';

export const createColumn = async (req: Request, res: Response) => {
	const createdColumn = await column.createNewColumn(req.body, req.params.id);

	res.status(StatusCodes.CREATED).json(createdColumn);
};

export const getColumns = async (req: Request, res: Response) => {
	const columnsList = await column.getColumnsByBoardId(req.params.id);

	res.status(StatusCodes.OK).json(columnsList);
};

export const updateColumnTitle = async (req: Request, res: Response) => {
	const updatedColumn = await column.updateColumnTitleById(
		req.params.columnId,
		req.body.columnName
	);

	res.status(StatusCodes.OK).json(updatedColumn);
};

export const updateColumnTasks = async (req: Request, res: Response) => {
	const updatedColumn = await column.updateColumnTasksOrder(
		req.body.updatedColumns
	);

	res.status(StatusCodes.OK).json(updatedColumn);
};
