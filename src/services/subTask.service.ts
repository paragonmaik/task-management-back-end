import { ISubTask } from '../interfaces/ISubTask';
import subTasksModel from '../models/subTasks.model';
import tasksModel from '../models/tasks.model';

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
