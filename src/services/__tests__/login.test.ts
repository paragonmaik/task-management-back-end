import * as login from '../login.service';
import { connectDB, disconnectDB } from '../../database/connection';

describe('Login service', () => {
	beforeEach(async () => {
		await connectDB();
	});

	afterAll(async () => {
		await disconnectDB();
	});

	describe('User login', () => {
		it('tests whether a token is returned', async () => {
			const token = await login.authUser();

			expect(typeof token).toBe(typeof '');
		});

		// it('tests whether user was registered successfully', async () => {});
	});
});
