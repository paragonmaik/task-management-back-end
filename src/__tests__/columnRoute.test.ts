import request from 'supertest';
import app from '../app';
import { disconnectDB, testSetup } from '../database/connection';
import { StatusCodes } from 'http-status-codes';
import * as board from '../services/board.service';
import { badColumnExampleList1 } from '../services/__tests__/mocks/userMocks';

const loginData = {
	email: 'donkey@example.com',
	password: 'aquaticambience',
};

const columnData = {
	columnName: 'To do',
};

describe('/column ROUTE', () => {
	beforeAll(async () => {
		await testSetup();
	});

	afterAll(async () => {
		await disconnectDB();
	});

	describe('POST /column', () => {
		it('tests a successful column creation request', async () => {
			const loginResponse = await request(app).post('/login').send(loginData);
			const createdBoard = await board.createNewBoard(
				{
					boardName: 'Donkey kong V',
				},
				{ userName: 'donkeykong', email: 'donkey@example.com' }
			);

			const columnResponse = await request(app)
				.post(`/column/${createdBoard.id}`)
				.send(columnData)
				.set('Authorization', loginResponse.body.token);

			expect(columnResponse.statusCode).toBe(StatusCodes.CREATED);
			expect(columnResponse.body.tasks).toBeDefined();
			expect(columnResponse.body.columnName).toBe(columnData.columnName);
		});

		it('tests request with invalid body input', async () => {
			const loginResponse = await request(app).post('/login').send(loginData);
			const createdBoard = await board.createNewBoard(
				{
					boardName: 'Donkey kong V',
				},
				{ userName: 'donkeykong', email: 'donkey@example.com' }
			);

			for (const badColumn of badColumnExampleList1) {
				const columnResponse = await request(app)
					.post(`/column/${createdBoard.id}`)
					.send(badColumn)
					.set('Authorization', loginResponse.body.token);

				expect(columnResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
				expect(columnResponse.body.message).toBeDefined();
			}
		});
	});
});
//
