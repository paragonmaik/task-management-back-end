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
});
