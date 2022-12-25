import * as login from '../login.service';
import { disconnectDB, testSetup } from '../../database/connection';

const loginData = {
	email: 'donkey@example.com',
	password: 'aquaticambience',
};

describe('Login service', () => {
	beforeEach(async () => {
		await testSetup();
	});

	afterAll(async () => {
		await disconnectDB();
	});

	describe('User login', () => {
		it('tests whether a token is returned', async () => {
			const token = await login.authUser(loginData);

			expect(typeof token).toBe(typeof '');
		});
	});
});
