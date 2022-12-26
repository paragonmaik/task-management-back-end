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
		const boardResponse = await request(app).post('/board').send({
			boardName: 'Donkey kong III',
		});

		console.log(boardResponse.body);
		expect(boardResponse.statusCode).toBe(StatusCodes.CREATED);
		expect(boardResponse.body.columns).toBeDefined();
		expect(boardResponse.body.boardName).toBe('Donkey kong III');
	});
});
