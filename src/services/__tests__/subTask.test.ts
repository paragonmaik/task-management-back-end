import * as board from '../board.service';
import * as column from '../column.service';
import * as task from '../task.service';
import * as subTask from '../subTask.service';
import { disconnectDB, testSetup } from '../../database/connection';

const userPayload = { userName: 'donkeykong', email: 'donkey@example.com' };
const taskData = { description: 'Beat all of the donkey kong games.' };
const subTaskData = { description: '100% all of the donkey kong games' };

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
});
