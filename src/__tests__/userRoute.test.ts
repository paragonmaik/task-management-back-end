import request from 'supertest';
import app from '../app';
import { disconnectDB, testSetup } from '../database/connection';
import { StatusCodes } from 'http-status-codes';
import {
	userExample1,
	badUserExampleList1,
} from '../services/__tests__/mocks/userMocks';

describe('POST /user', () => {
	beforeAll(async () => {
		await testSetup();
	});

	afterAll(async () => {
		await disconnectDB();
	});

	it('tests a successful user registration request', async () => {
		const response = await request(app).post('/user').send(userExample1);

		expect(response.statusCode).toBe(StatusCodes.CREATED);
		expect(response.body.token).toBeDefined();
	});

	it('tests whether user is already registered', async () => {
		const response = await request(app).post('/user').send(userExample1);

		expect(response.body.message).toBe('User already registered!');
	});

	it('tests request with invalid data', async () => {
		for (const badUser of badUserExampleList1) {
			const response = await request(app).post('/user').send(badUser);

			expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
			expect(response.body.message).toBeDefined();
		}
	});
});
