import request from 'supertest';
import app from '../app';
import { disconnectDB, testSetup } from '../database/connection';
import { StatusCodes } from 'http-status-codes';
import { badBoardExampleList1 } from '../services/__tests__/mocks/userMocks';

describe('/board ROUTE', () => {
	beforeAll(async () => {
		await testSetup();
	});

	afterAll(async () => {
		await disconnectDB();
	});

	describe('POST /board', () => {
		it('tests a successful board creation request', async () => {
			const loginResponse = await request(app).post('/login').send({
				email: 'donkey@example.com',
				password: 'aquaticambience',
			});

			const boardResponse = await request(app)
				.post('/board')
				.send({
					boardName: 'Donkey kong III',
				})
				.set('Authorization', loginResponse.body.token);

			expect(boardResponse.statusCode).toBe(StatusCodes.CREATED);
			expect(boardResponse.body.columns).toBeDefined();
			expect(boardResponse.body.boardName).toBe('Donkey kong III');
		});

		it('tests request with invalid body input', async () => {
			const loginResponse = await request(app).post('/login').send({
				email: 'donkey@example.com',
				password: 'aquaticambience',
			});

			for (const badBoard of badBoardExampleList1) {
				const boardResponse = await request(app)
					.post('/board')
					.send(badBoard)
					.set('Authorization', loginResponse.body.token);

				expect(boardResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
				expect(boardResponse.body.message).toBeDefined();
			}
		});
	});

	describe('GET /board', () => {
		it('tests whether all boards are returned', async () => {
			const loginResponse = await request(app).post('/login').send({
				email: 'donkey@example.com',
				password: 'aquaticambience',
			});

			const boardsResponse = await request(app)
				.get('/board')
				.set('Authorization', loginResponse.body.token);

			expect(boardsResponse.statusCode).toBe(StatusCodes.OK);
			for (const board of boardsResponse.body) {
				expect(board.members[0].email).toBe('donkey@example.com');
			}
		});
	});
});
