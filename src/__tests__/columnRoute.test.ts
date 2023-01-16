import request from 'supertest';
import app from '../app';
import * as board from '../services/board.service';
import * as column from '../services/column.service';
import * as task from '../services/task.service';
import columnsModel from '../models/columns.model';
import { disconnectDB, testSetup } from '../database/connection';
import { StatusCodes } from 'http-status-codes';
import { badColumnExampleList1 } from '../services/__tests__/mocks/userMocks';

const userPayload = { userName: 'donkeykong', email: 'donkey@example.com' };
const taskData1 = { description: 'First task' };
const taskData2 = { description: 'Second task' };
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
				userPayload
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
				userPayload
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
				userPayload
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
				{ boardName: 'Donkey kong VII' },
				userPayload
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

	describe('PUT /column/tasks', () => {
		it('tests whether column tasks are updated', async () => {
			const loginResponse = await request(app).post('/login').send(loginData);
			const createdBoard = await board.createNewBoard(
				{ boardName: 'Donkey kong V' },
				userPayload
			);
			const createdColumn1 = await column.createNewColumn(
				{ columnName: 'To do' },
				createdBoard.id
			);

			const createdTask1 = await task.createNewTask(
				taskData1,
				createdColumn1.id
			);
			const createdTask2 = await task.createNewTask(
				taskData2,
				createdColumn1.id
			);

			createdColumn1.tasks = [createdTask2.id, createdTask1.id];

			const requestBody = { updatedColumns: [createdColumn1] };

			const { body, statusCode } = await request(app)
				.put(`/column/tasks/${createdBoard._id}`)
				.send(requestBody)
				.set('Authorization', loginResponse.body.token);

			expect(statusCode).toBe(StatusCodes.OK);
			expect(body[0].tasks).toBeDefined();
		});

		it('tests request with invalid body input', async () => {
			const loginResponse = await request(app).post('/login').send(loginData);
			const createdBoard = await board.createNewBoard(
				{ boardName: 'Donkey kong V' },
				userPayload
			);

			const createdColumn1 = await column.createNewColumn(
				{ columnName: 'To do' },
				createdBoard.id
			);

			const createdTask1 = await task.createNewTask(
				taskData1,
				createdColumn1.id
			);

			createdColumn1.tasks = [createdTask1.id];

			const { body, statusCode } = await request(app)
				.put(`/column/tasks/${createdBoard._id}`)
				.send({ updatedColumns: [] })
				.set('Authorization', loginResponse.body.token);

			expect(statusCode).toBe(StatusCodes.BAD_REQUEST);
			expect(body.message).toBeDefined();
		});
	});

	describe('DELETE /column/:columnId', () => {
		it('tests whether column is deleted', async () => {
			const loginResponse = await request(app).post('/login').send(loginData);

			const createdBoard = await board.createNewBoard(
				{ boardName: 'Donkey kong III' },
				userPayload
			);

			const createdColumn = await column.createNewColumn(
				{ columnName: 'To do' },
				createdBoard.id
			);

			const deleteResponse = await request(app)
				.delete(`/column/${createdColumn.id}`)
				.set('Authorization', loginResponse.body.token);

			const findResponse = await columnsModel.findById(createdColumn.id);

			expect(deleteResponse.statusCode).toBe(StatusCodes.NO_CONTENT);
			expect(findResponse).toBeNull();
		});
	});
});
