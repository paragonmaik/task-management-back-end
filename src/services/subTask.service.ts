import { ISubTask } from '../interfaces/ISubTask';
import subTasksModel from '../models/subTasks.model';
import tasksModel from '../models/tasks.model';
import { HttpException } from '../middlewares/HttpException';
import { StatusCodes } from 'http-status-codes';

export const createNewSubTask = async (subTask: ISubTask, taskId: string) => {
	const createdSubTask = await subTasksModel.create({
		description: subTask.description,
		ownerTask: taskId,
	});

	await tasksModel.findByIdAndUpdate(taskId, {
		$push: { subTasks: createdSubTask.id },
	});

	return createdSubTask;
};

export const getSubTaskByTaskId = async (taskId: string) => {
	const tasksList = await subTasksModel.find({
		ownerTask: { $in: taskId },
	});

	return tasksList;
};

export const updateDescriptionById = async (
	subTaskId: string,
	description: string
) => {
	const subTask = await subTasksModel.findByIdAndUpdate(
		subTaskId,
		{ description },
		{ new: true }
	);

	if (!subTask) {
		throw new HttpException(StatusCodes.NOT_FOUND, 'Subtask does not exist!');
	}

	return subTask;
};

export const deleteSubTask = async (subTaskId: string) =>
	subTasksModel.findByIdAndDelete(subTaskId);
