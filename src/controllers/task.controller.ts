import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as task from '../services/task.service';

export const createTask = async (req: Request, res: Response) => {
	const createdTask = await task.createNewTask(req.body, req.params.columnId);

	res.status(StatusCodes.CREATED).json(createdTask);
};
