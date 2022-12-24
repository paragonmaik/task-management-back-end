import * as user from '../user.service';
import { userExample1 } from './mocks/userMocks';

describe('User service', () => {
	describe('Register new user functions', () => {
		it('tests whether a token is returned', async () => {
			const token = await user.registerNewUser(userExample1);
			expect(typeof token).toBe(typeof '');
		});
	});
});
