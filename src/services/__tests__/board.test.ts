import * as board from '../board.service';
import { disconnectDB, testSetup } from '../../database/connection';

const userPayload = { userName: 'donkeykong', email: 'donkey@example.com' };

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
				userPayload
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
				userPayload
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
				userPayload
			);

			const singleBoard = await board.getBoardById(createdBoard.id);

			expect(singleBoard.boardName).toBe(createdBoard.boardName);
		});
	});

	describe('Update board', () => {
		it('tests whether the selected board is updated', async () => {
			const newBoardName = 'Donkey Kong V: Empire Strikes Back';
			const createdBoard = await board.createNewBoard(
				{
					boardName: 'Donkey kong V',
				},
				userPayload
			);

			const updatedBoard = await board.updateBoardTitleById(
				createdBoard.id,
				newBoardName
			);

			expect(updatedBoard.boardName).toBe(newBoardName);
		});
	});
});
