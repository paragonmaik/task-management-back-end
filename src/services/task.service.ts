import tasksModel from '../models/tasks.model';
import columnsModel from '../models/columns.model';
import { ITask } from '../interfaces/ITask';
import { HttpException } from '../middlewares/HttpException';
import { StatusCodes } from 'http-status-codes';
import subTasksModel from '../models/subTasks.model';

export const createNewTask = async (task: ITask, columnId: string) => {
	const createdTask = await tasksModel.create({
		description: task.description,
		ownerColumn: columnId,
	});

	await columnsModel.findByIdAndUpdate(columnId, {
		$push: { tasks: createdTask.id },
	});

	return createdTask;
};

export const getTaskByColumnId = async (columnId: string) => {
	const tasksList = await tasksModel.find({
		ownerColumn: { $in: columnId },
	});

	return tasksList;
};

export const updateDescriptionById = async (
	taskId: string,
	description: string
) => {
	const task = await tasksModel.findByIdAndUpdate(
		taskId,
		{ description },
		{ new: true }
	);

	if (!task) {
		throw new HttpException(StatusCodes.NOT_FOUND, 'Task does not exist!');
	}

	return task;
};

export const deleteTask = async (taskId: string) => {
	await tasksModel.findByIdAndDelete(taskId);

	await subTasksModel.deleteMany({
		ownerTask: { $in: taskId },
	});
};
