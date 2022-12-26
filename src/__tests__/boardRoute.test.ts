import request from 'supertest';
import app from '../app';
import { disconnectDB, testSetup } from '../database/connection';
import { StatusCodes } from 'http-status-codes';

describe('POST /board', () => {
	beforeAll(async () => {
		await testSetup();
	});

	afterAll(async () => {
		await disconnectDB();
	});

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
});
