import request from 'supertest';
import app from '../app';
import { disconnectDB, testSetup } from '../database/connection';
import { StatusCodes } from 'http-status-codes';

describe('POST /login', () => {
	beforeAll(async () => {
		await testSetup();
	});

	afterAll(async () => {
		await disconnectDB();
	});

	it('tests request with invalid email', async () => {
		const response = await request(app).post('/login').send();

		expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
		expect(response.body.message).toBe('Invalid email or password!');
	});
});
