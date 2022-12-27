import * as board from '../board.service';
import { disconnectDB, testSetup } from '../../database/connection';

describe('Board service', () => {
	beforeAll(async () => {
		await testSetup();
	});

	afterAll(async () => {
		await disconnectDB();
	});

	describe('Creates new board', () => {
		it('tests whether a new board is created', async () => {
			const createdBoard = await board.createNewBoard(
				{
					boardName: 'Donkey kong III',
				},
				{ userName: 'donkeykong', email: 'donkey@example.com' }
			);

			expect(createdBoard).toBeTruthy();
		});
	});

	describe("Get all user's board", () => {
		it('tests whether a list of all boards are returned', async () => {
			await board.createNewBoard(
				{
					boardName: 'Donkey kong IV',
				},
				{ userName: 'donkeykong', email: 'donkey@example.com' }
			);

			const boardsList = await board.getAllBoards('donkey@example.com');

			expect(boardsList.length).toBe(2);
		});
	});

	describe('Get board', () => {
		it('tests whether a board is returned', async () => {
			const createdBoard = await board.createNewBoard(
				{
					boardName: 'Donkey kong V',
				},
				{ userName: 'donkeykong', email: 'donkey@example.com' }
			);

			const singleBoard = await board.getBoardById(createdBoard.id);

			expect(singleBoard.boardName).toBe(createdBoard.boardName);
		});
	});
});
