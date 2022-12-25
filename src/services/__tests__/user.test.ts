import * as user from '../user.service';
import { findUserByUniqueField } from '../helpers/helpers';
import { connectDB, disconnectDB } from '../../database/connection';
import { userExample1 } from './mocks/userMocks';

describe('User service', () => {
	beforeEach(async () => {
		connectDB();
	});

	afterAll(async () => {
		disconnectDB();
	});

	describe('Registers new user', () => {
		it('tests whether a token is returned', async () => {
			const token = await user.registerNewUser(userExample1);

			expect(typeof token).toBe(typeof '');
		});

		it('tests whether user was registered successfully', async () => {
			const resgisteredUser = await findUserByUniqueField(
				'email',
				userExample1.email
			);

			expect(resgisteredUser?.email).toBe(userExample1.email);
			expect(resgisteredUser?.userName).toBe(userExample1.userName);
		});
	});
});
