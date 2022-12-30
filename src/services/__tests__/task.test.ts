import * as board from '../board.service';
import * as column from '../column.service';
import * as task from '../task.service';
import { disconnectDB, testSetup } from '../../database/connection';

const userPayload = { userName: 'donkeykong', email: 'donkey@example.com' };
const taskData = { description: 'Beat all of the donkey kong games.' };

describe('Column service', () => {
	beforeAll(async () => {
		await testSetup();
	});

	afterAll(async () => {
		await disconnectDB();
	});

	describe('Creates new task', () => {
		it('tests whether a new task is created', async () => {
			const createdBoard = await board.createNewBoard(
				{
					boardName: 'Donkey kong III',
				},
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
});
