import * as board from '../board.service';
import * as column from '../column.service';
import * as task from '../task.service';
import * as subTask from '../subTask.service';
import { disconnectDB, testSetup } from '../../database/connection';
import subTasksModel from '../../models/subTasks.model';

const userPayload = { userName: 'donkeykong', email: 'donkey@example.com' };
const taskData = { description: 'Beat all of the donkey kong games.' };
const subTaskData = { description: '100% all of the donkey kong games' };
const newSubTaskDescription = 'speedrun all donkey kong games.';

describe('Board service', () => {
	beforeAll(async () => {
		await testSetup();
	});

	afterAll(async () => {
		await disconnectDB();
	});

	describe('Creates new subtask', () => {
		it('tests whether a new subtask is created', async () => {
			const createdBoard = await board.createNewBoard(
				{ boardName: 'Donkey kong III' },
				userPayload
			);

			const createdColumn = await column.createNewColumn(
				{ columnName: 'To do' },
				createdBoard.id
			);

			const createdTask = await task.createNewTask(taskData, createdColumn.id);

			const createdSubTask = await subTask.createNewSubTask(
				subTaskData,
				createdTask.id
			);

			expect(createdSubTask).toBeTruthy();
		});
	});

	describe('Get all subtasks', () => {
		it('tests whether a list of all subtasks are returned', async () => {
			const createdBoard = await board.createNewBoard(
				{ boardName: 'Donkey kong III' },
				userPayload
			);

			const createdColumn = await column.createNewColumn(
				{ columnName: 'To do' },
				createdBoard.id
			);

			const createdTask = await task.createNewTask(taskData, createdColumn.id);

			await subTask.createNewSubTask(subTaskData, createdTask.id);
			await subTask.createNewSubTask(subTaskData, createdTask.id);

			const subTaskList = await subTask.getSubTaskByTaskId(createdTask.id);

			expect(subTaskList.length).toBe(2);
		});
	});

	describe('Update subtask', () => {
		it('tests whether the selected subtask is updated', async () => {
			const createdBoard = await board.createNewBoard(
				{
					boardName: 'Donkey kong V',
				},
				userPayload
			);
			const createdColumn = await column.createNewColumn(
				{ columnName: 'To do' },
				createdBoard.id
			);

			const createdTask = await task.createNewTask(taskData, createdColumn.id);

			const createdSubTask = await subTask.createNewSubTask(
				subTaskData,
				createdTask.id
			);

			const updateSubTask = await subTask.updateDescriptionById(
				createdSubTask.id,
				newSubTaskDescription
			);

			expect(updateSubTask.description).toBe(newSubTaskDescription);
		});
	});

	describe('Delete registered user from the database', () => {
		it('tests whether user is deleted', async () => {
			const createdBoard = await board.createNewBoard(
				{ boardName: 'Donkey kong III' },
				userPayload
			);

			const createdColumn = await column.createNewColumn(
				{ columnName: 'To do' },
				createdBoard.id
			);

			const createdTask = await task.createNewTask(taskData, createdColumn.id);

			const createdSubTask = await subTask.createNewSubTask(
				subTaskData,
				createdTask.id
			);

			await subTask.deleteSubTask(createdSubTask.id);

			const deletedSubTask = await subTasksModel.findById(createdSubTask.id);

			expect(deletedSubTask).toBeNull();
		});
	});
});
