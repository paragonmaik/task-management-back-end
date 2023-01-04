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

export const getSubTasks = async (req: Request, res: Response) => {
	const tasksList = await subTask.getSubTaskByTaskId(req.params.taskId);

	res.status(StatusCodes.OK).json(tasksList);
};

export const updateSubTaskDescription = async (req: Request, res: Response) => {
	const updatedTask = await subTask.updateDescriptionById(
		req.params.subTaskId,
		req.body.description
	);

	res.status(StatusCodes.OK).json(updatedTask);
};
