import { findUserByUniqueField } from '../helpers/helpers';
import { disconnectDB, testSetup } from '../../database/connection';

describe('Test helper functions', () => {
	beforeAll(async () => {
		await testSetup();
	});

	afterAll(async () => {
		await disconnectDB();
	});

	it('tests whether find findUserByUniqueField returns a user by email', async () => {
		const user = await findUserByUniqueField('email', 'donkey@example.com');
		expect(user?.password).toBeDefined();
		expect(user?.userName).toBeDefined();
		expect(user?.email).toBeDefined();
		expect(user?._id).toBeUndefined();
	});

	it('tests whether find findUserByUniqueField returns a user by userName', async () => {
		const user = await findUserByUniqueField('userName', 'donkeykong');
		expect(user?.password).toBeDefined();
		expect(user?.userName).toBeDefined();
		expect(user?.email).toBeDefined();
		expect(user?._id).toBeUndefined();
	});
});
