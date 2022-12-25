import request from 'supertest';
import app from '../app';
import { connectDB, disconnectDB } from '../database/connection';
import { StatusCodes } from 'http-status-codes';
import { userExample1 } from '../services/__tests__/mocks/userMocks';

describe('POST /user', () => {
	beforeEach(async () => {
		connectDB();
	});

	afterAll(async () => {
		disconnectDB();
	});

	it('tests a successful user registration request', async () => {
		const response = await request(app).post('/user').send(userExample1);

		expect(response.statusCode).toBe(StatusCodes.CREATED);
		expect(response.body.token).toBeDefined();
	});

	it('tests an unsuccessful user registration request', async () => {
		const response = await request(app).post('/user').send(userExample1);

		expect(response.body.message).toBe('User already registered!');
	});
});
