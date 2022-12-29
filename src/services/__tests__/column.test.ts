import * as board from '../board.service';
import * as column from '../column.service';
import { disconnectDB, testSetup } from '../../database/connection';

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
});
