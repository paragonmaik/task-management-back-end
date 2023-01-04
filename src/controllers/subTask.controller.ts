import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as subTask from '../services/subTask.service';

export const createSubTask = async (req: Request, res: Response) => {
	const createdSubTask = await subTask.createNewSubTask(
		req.body,
		req.params.taskId
	);

	res.status(StatusCodes.CREATED).json(createdSubTask);
};
