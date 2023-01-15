import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as task from '../services/task.service';

export const createTask = async (req: Request, res: Response) => {
	const createdTask = await task.createNewTask(req.body, req.params.columnId);

	res.status(StatusCodes.CREATED).json(createdTask);
};

export const getTasks = async (req: Request, res: Response) => {
	const tasksList = await task.getTaskByColumnId(req.params.columnId);

	res.status(StatusCodes.OK).json(tasksList);
};

export const updateTaskDescription = async (req: Request, res: Response) => {
	const updatedTask = await task.updateDescriptionById(
		req.params.taskId,
		req.body.description
	);

	res.status(StatusCodes.OK).json(updatedTask);
};

export const deleteTaskById = async (req: Request, res: Response) => {
	await task.deleteTask(req.params.taskId);

	res.status(StatusCodes.NO_CONTENT).end();
};
