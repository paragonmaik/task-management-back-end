import { findUserByUniqueField } from '../user.service';
import { connectDB, disconnectDB } from '../../database/connection';

describe('Test helper functions', () => {
	beforeEach(async () => {
		connectDB();
	});

	afterEach(async () => {
		disconnectDB();
	});

	it('tests whether find user function returns expected result', async () => {
		const user = await findUserByUniqueField('userName', 'bonjovi');
		expect(user).toBe('');
	});
});
