import request from 'supertest';
import app from '../app';
import * as board from '../services/board.service';
import * as column from '../services/column.service';
import * as task from '../services/task.service';
import { disconnectDB, testSetup } from '../database/connection';
import { StatusCodes } from 'http-status-codes';
import { badTaskExampleList1 } from '../services/__tests__/mocks/userMocks';

const loginData = {
	email: 'donkey@example.com',
	password: 'aquaticambience',
};

const taskData = {
	description: 'Beat all of the donkey kong games',
};

const columnData = { columnName: 'To do' };

describe('/task ROUTE', () => {
	beforeAll(async () => {
		await testSetup();
	});

	afterAll(async () => {
		await disconnectDB();
	});

	describe('POST /task/columnId', () => {
		it('tests a successful task creation request', async () => {
			const loginResponse = await request(app).post('/login').send(loginData);
			const createdBoard = await board.createNewBoard(
				{ boardName: 'Donkey kong V' },
				{ userName: 'donkeykong', email: 'donkey@example.com' }
			);
			const createdColumn = await column.createNewColumn(
				columnData,
				createdBoard.id
			);

			const taskResponse = await request(app)
				.post(`/task/${createdColumn.id}`)
				.send(taskData)
				.set('Authorization', loginResponse.body.token);

			expect(taskResponse.statusCode).toBe(StatusCodes.CREATED);
			expect(taskResponse.body.subTasks).toBeDefined();
			expect(taskResponse.body.description).toBe(taskData.description);
		});

		it('tests request with invalid body input', async () => {
			const loginResponse = await request(app).post('/login').send(loginData);
			const createdBoard = await board.createNewBoard(
				{ boardName: 'Donkey kong V' },
				{ userName: 'donkeykong', email: 'donkey@example.com' }
			);
			const createdColumn = await column.createNewColumn(
				columnData,
				createdBoard.id
			);

			for (const badTask of badTaskExampleList1) {
				const columnResponse = await request(app)
					.post(`/task/${createdColumn.id}`)
					.send(badTask)
					.set('Authorization', loginResponse.body.token);

				expect(columnResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
				expect(columnResponse.body.message).toBeDefined();
			}
		});
	});

	describe('GET /task/columnId', () => {
		it('tests whether all tasks are returned', async () => {
			const loginResponse = await request(app).post('/login').send(loginData);
			const createdBoard = await board.createNewBoard(
				{ boardName: 'Donkey kong VI' },
				{ userName: 'donkeykong', email: 'donkey@example.com' }
			);

			const createdColumn = await column.createNewColumn(
				columnData,
				createdBoard.id
			);

			await task.createNewTask(taskData, createdColumn.id);

			const taskResponse = await request(app)
				.get(`/task/${createdColumn.id}`)
				.set('Authorization', loginResponse.body.token);

			expect(taskResponse.statusCode).toBe(StatusCodes.OK);

			for (const task of taskResponse.body) {
				expect(task.ownerColumn).toBe(createdColumn.id);
			}
		});
	});

	describe('PUT /task/taskId', () => {
		it('tests whether task description is updated', async () => {
			const requestBody = { description: '100% all donkey kong games' };
			const loginResponse = await request(app).post('/login').send(loginData);

			const createdBoard = await board.createNewBoard(
				{ boardName: 'Donkey kong VII' },
				{ userName: 'donkeykong', email: 'donkey@example.com' }
			);

			const createdColumn = await column.createNewColumn(
				columnData,
				createdBoard.id
			);

			const createdTask = await task.createNewTask(taskData, createdColumn.id);

			const taskResponse = await request(app)
				.put(`/task/${createdTask.id}`)
				.send(requestBody)
				.set('Authorization', loginResponse.body.token);

			expect(taskResponse.statusCode).toBe(StatusCodes.OK);
			expect(taskResponse.body.description).toBe(requestBody.description);
		});
	});
});
