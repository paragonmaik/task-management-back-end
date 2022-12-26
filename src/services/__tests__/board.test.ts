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
			const createdBoard = await board.createNewBoard({
				boardName: 'teste',
			});

			console.log(createdBoard);
			expect(createdBoard).toBeTruthy();
		});
	});
});
