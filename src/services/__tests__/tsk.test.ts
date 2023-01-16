import * as board from '../board.service';
import * as column from '../column.service';
import * as task from '../task.service';
import { disconnectDB, testSetup } from '../../database/connection';
import tasksModel from '../../models/tasks.model';

const userPayload = { userName: 'donkeykong', email: 'donkey@example.com' };
const taskData = { description: 'Beat all of the donkey kong games.' };
const newTaskDescription = '100% all donkey kong games.';

describe('Task service', () => {
	beforeAll(async () => {
		await testSetup();
	});

	afterAll(async () => {
		await disconnectDB();
	});

	describe('Creates new task', () => {
		it('tests whether a new task is created', async () => {
			const createdBoard = await board.createNewBoard(
				{ boardName: 'Donkey kong III' },
				userPayload
			);

			const createdColumn = await column.createNewColumn(
				{ columnName: 'To do' },
				createdBoard.id
			);

			const createdTask = await task.createNewTask(taskData, createdColumn.id);

			expect(createdTask).toBeTruthy();
		});
	});

	describe('Get all tasks', () => {
		it('tests whether a list of all tasks are returned', async () => {
			const createdBoard = await board.createNewBoard(
				{ boardName: 'Donkey kong III' },
				userPayload
			);

			const createdColumn = await column.createNewColumn(
				{ columnName: 'To do' },
				createdBoard.id
			);

			await task.createNewTask(taskData, createdColumn.id);
			await task.createNewTask(taskData, createdColumn.id);

			const tasksList = await task.getTaskByColumnId(createdColumn.id);

			expect(tasksList.length).toBe(2);
		});
	});

	describe('Update task', () => {
		it('tests whether the selected task is updated', async () => {
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
			const updateTask = await task.updateDescriptionById(
				createdTask.id,
				newTaskDescription
			);

			expect(updateTask.description).toBe(newTaskDescription);
		});
	});

	describe('Delete task from the database', () => {
		it('tests whether task is deleted', async () => {
			const createdBoard = await board.createNewBoard(
				{ boardName: 'Donkey kong III' },
				userPayload
			);

			const createdColumn = await column.createNewColumn(
				{ columnName: 'To do' },
				createdBoard.id
			);

			const createdTask = await task.createNewTask(taskData, createdColumn.id);

			await task.deleteTask(createdTask.id);

			const deletedTask = await tasksModel.findById(createdTask.id);

			expect(deletedTask).toBeNull();
		});
	});
});
