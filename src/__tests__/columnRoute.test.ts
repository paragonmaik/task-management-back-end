import request from 'supertest';
import app from '../app';
import * as board from '../services/board.service';
import * as column from '../services/column.service';
import { disconnectDB, testSetup } from '../database/connection';
import { StatusCodes } from 'http-status-codes';
import { badColumnExampleList1 } from '../services/__tests__/mocks/userMocks';

const loginData = {
	email: 'donkey@example.com',
	password: 'aquaticambience',
};

const columnData = {
	columnName: 'To do',
};

describe('/column ROUTE', () => {
	beforeAll(async () => {
		await testSetup();
	});

	afterAll(async () => {
		await disconnectDB();
	});

	describe('POST /column', () => {
		it('tests a successful column creation request', async () => {
			const loginResponse = await request(app).post('/login').send(loginData);
			const createdBoard = await board.createNewBoard(
				{
					boardName: 'Donkey kong V',
				},
				{ userName: 'donkeykong', email: 'donkey@example.com' }
			);

			const columnResponse = await request(app)
				.post(`/column/${createdBoard.id}`)
				.send(columnData)
				.set('Authorization', loginResponse.body.token);

			expect(columnResponse.statusCode).toBe(StatusCodes.CREATED);
			expect(columnResponse.body.tasks).toBeDefined();
			expect(columnResponse.body.columnName).toBe(columnData.columnName);
		});

		it('tests request with invalid body input', async () => {
			const loginResponse = await request(app).post('/login').send(loginData);
			const createdBoard = await board.createNewBoard(
				{
					boardName: 'Donkey kong V',
				},
				{ userName: 'donkeykong', email: 'donkey@example.com' }
			);

			for (const badColumn of badColumnExampleList1) {
				const columnResponse = await request(app)
					.post(`/column/${createdBoard.id}`)
					.send(badColumn)
					.set('Authorization', loginResponse.body.token);

				expect(columnResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
				expect(columnResponse.body.message).toBeDefined();
			}
		});
	});

	describe('GET /column/id', () => {
		it('tests whether all columns are returned', async () => {
			const loginResponse = await request(app).post('/login').send(loginData);
			const createdBoard = await board.createNewBoard(
				{
					boardName: 'Donkey kong VI',
				},
				{ userName: 'donkeykong', email: 'donkey@example.com' }
			);

			await column.createNewColumn({ columnName: 'To do' }, createdBoard.id);
			await column.createNewColumn(
				{ columnName: 'In review' },
				createdBoard.id
			);

			const columnsResponse = await request(app)
				.get(`/column/${createdBoard.id}`)
				.set('Authorization', loginResponse.body.token);

			expect(columnsResponse.statusCode).toBe(StatusCodes.OK);

			for (const column of columnsResponse.body) {
				expect(column.ownerBoard).toBe(createdBoard.id);
			}
		});
	});

	describe('PUT /column/columnId', () => {
		it('tests whether column title is updated', async () => {
			const requestBody = { columnName: 'Done' };
			const loginResponse = await request(app).post('/login').send(loginData);

			const createdBoard = await board.createNewBoard(
				{
					boardName: 'Donkey kong VII',
				},
				{ userName: 'donkeykong', email: 'donkey@example.com' }
			);

			const createdColumn = await column.createNewColumn(
				columnData,
				createdBoard.id
			);

			const columnResponse = await request(app)
				.put(`/column/${createdColumn.id}`)
				.send(requestBody)
				.set('Authorization', loginResponse.body.token);

			expect(columnResponse.statusCode).toBe(StatusCodes.OK);
			expect(columnResponse.body.columnName).toBe(requestBody.columnName);
		});
	});
});
