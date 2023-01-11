import * as board from '../board.service';
import * as column from '../column.service';
import * as task from '../task.service';
import { disconnectDB, testSetup } from '../../database/connection';

const taskData1 = { description: 'First task' };
const taskData2 = { description: 'Second task' };
const userPayload = { userName: 'donkeykong', email: 'donkey@example.com' };

describe('Column service', () => {
	beforeAll(async () => {
		await testSetup();
	});

	afterAll(async () => {
		await disconnectDB();
	});

	describe('Creates new board', () => {
		it('tests whether a new column is created', async () => {
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

			expect(createdColumn).toBeTruthy();
		});
	});

	describe('Get all columns', () => {
		it('tests whether a list of all columns are returned', async () => {
			const createdBoard = await board.createNewBoard(
				{
					boardName: 'Donkey kong III',
				},
				userPayload
			);

			await column.createNewColumn({ columnName: 'To do' }, createdBoard.id);
			await column.createNewColumn(
				{ columnName: 'In review' },
				createdBoard.id
			);

			const columnsList = await column.getColumnsByBoardId(createdBoard.id);

			expect(columnsList.length).toBe(2);
		});
	});

	describe('Update column', () => {
		it('tests whether the selected column is updated', async () => {
			const newColumnName = 'Done';
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

			const updatedColumn = await column.updateColumnTitleById(
				createdColumn.id,
				newColumnName
			);

			expect(updatedColumn.columnName).toBe(newColumnName);
		});
	});

	describe('Update column tasks list', () => {
		it('tests whether a single selected column is updated', async () => {
			const createdBoard = await board.createNewBoard(
				{ boardName: 'Donkey kong V' },
				userPayload
			);
			const createdColumn = await column.createNewColumn(
				{ columnName: 'Teste 1' },
				createdBoard.id
			);

			const createdTask1 = await task.createNewTask(
				taskData1,
				createdColumn.id
			);
			const createdTask2 = await task.createNewTask(
				taskData2,
				createdColumn.id
			);

			const sortedTasksList = [createdTask2.id, createdTask1.id];
			createdColumn.tasks = sortedTasksList;

			const updatedColumns = await column.updateColumnTasksOrder([
				createdColumn,
			]);

			expect(updatedColumns[0].tasks?.length).toBe(2);
		});
	});

	describe('Update column tasks list', () => {
		it('tests whether source and destination column are updated', async () => {
			const createdBoard = await board.createNewBoard(
				{ boardName: 'Donkey kong V' },
				userPayload
			);
			const createdColumn1 = await column.createNewColumn(
				{ columnName: 'Teste 2' },
				createdBoard.id
			);
			const createdColumn2 = await column.createNewColumn(
				{ columnName: 'Teste 3' },
				createdBoard.id
			);

			const createdTask1 = await task.createNewTask(
				taskData1,
				createdColumn1.id
			);

			createdColumn1.tasks = [createdTask1._id];

			const updatedColumns = await column.updateColumnTasksOrder([
				createdColumn1,
				createdColumn2,
			]);

			expect(updatedColumns[0].tasks).toBeDefined();
		});
	});
});
