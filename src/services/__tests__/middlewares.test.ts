import { Request } from 'express';
import { authenticationMiddleware } from '../../middlewares/auth.middleware';
import { HttpException } from '../../middlewares/HttpException';
import { createToken } from '../../utils/auth';

const payload = {
	userName: 'redschuhart',
	email: 'red@institute.com',
};

describe('Auth middleware tests', () => {
	it('tests if the user token is verified', async () => {
		try {
			const token = await createToken(payload);
			const req: any = { headers: { authorization: token } };
			const res: any = { locals: { payload: {} } };
			const next: any = (err: HttpException) =>
				expect(err instanceof HttpException).toBeFalsy();

			await authenticationMiddleware(req, res, next);
		} catch (err) {
			expect(err instanceof HttpException).toBeTruthy();
		}
	});

	it('tests whether an exception  is thrown given invalid data', async () => {
		try {
			const req: any = { headers: { authorization: 'invalid-token' } };
			const res: any = { locals: { payload: {} } };
			const next: any = (err: HttpException) =>
				expect(err instanceof HttpException).toBeTruthy();

			await authenticationMiddleware(req, res, next);
		} catch (err) {
			expect(err instanceof HttpException).toBeTruthy();
		}
	});
});
