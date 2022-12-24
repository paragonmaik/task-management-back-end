import { findUserByUniqueField } from '../user.service';
import { connectDB, disconnectDB } from '../../database/connection';

describe('Test helper functions', () => {
	beforeEach(async () => {
		connectDB();
	});

	afterAll(async () => {
		disconnectDB();
	});

	it('tests whether find findUserByUniqueField returns a user by email', async () => {
		const user = await findUserByUniqueField('email', 'jonbovi@example.com');
		expect(user?.password).toBeDefined();
		expect(user?.userName).toBeDefined();
		expect(user?.email).toBeDefined();
		expect(user?._id).toBeUndefined();
	});

	it('tests whether find findUserByUniqueField returns a user by userName', async () => {
		const user = await findUserByUniqueField('userName', 'bonjovi');
		expect(user?.password).toBeDefined();
		expect(user?.userName).toBeDefined();
		expect(user?.email).toBeDefined();
		expect(user?._id).toBeUndefined();
	});
});
