import { ITask } from '../interfaces/ITask';
import tasksModel from '../models/tasks.model';
import columnsModel from '../models/columns.model';

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
