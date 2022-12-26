import request from 'supertest';
import app from '../app';
import { disconnectDB, testSetup } from '../database/connection';
import { StatusCodes } from 'http-status-codes';
import { findUserByUniqueField } from '../services/helpers/helpers';
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

		expect(response.statusCode).toBe(StatusCodes.CONFLICT);
		expect(response.body.message).toBe('User already registered!');
	});

	it('tests request with invalid body input', async () => {
		for (const badUser of badUserExampleList1) {
			const response = await request(app).post('/user').send(badUser);

			expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
			expect(response.body.message).toBeDefined();
		}
	});

	describe('DELETE /user/me', () => {
		it('tests whether user is deleted', async () => {
			const loginResponse = await request(app).post('/login').send({
				email: userExample1.email,
				password: userExample1.password,
			});

			const deleteResponse = await request(app)
				.delete('/user/me')
				.set('Authorization', loginResponse.body.token);

			const findResponse = await findUserByUniqueField(
				'email',
				userExample1.email
			);

			expect(deleteResponse.statusCode).toBe(StatusCodes.NO_CONTENT);
			expect(findResponse).toBeNull();
		});
	});
});
