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

	it('tests a login request with valid data', async () => {
		const response = await request(app).post('/login').send({
			email: 'donkey@example.com',
			password: 'aquaticambience',
		});

		expect(response.statusCode).toBe(StatusCodes.OK);
		expect(response.body.token).toBeDefined();
	});

	it('tests request with invalid email', async () => {
		const response = await request(app).post('/login').send({
			email: 'kong@example.com',
			password: 'aquaticambience',
		});

		expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
		expect(response.body.message).toBe('Invalid email or password!');
	});

	it('tests request with invalid password', async () => {
		const response = await request(app).post('/login').send({
			email: 'donkey@example.com',
			password: 'stickerbushsymphony',
		});

		expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
		expect(response.body.message).toBe('Invalid email or password!');
	});
});
