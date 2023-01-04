import request from 'supertest';
import app from '../app';
import * as board from '../services/board.service';
import * as column from '../services/column.service';
import * as task from '../services/task.service';
import * as subTask from '../services/subTask.service';
import { disconnectDB, testSetup } from '../database/connection';
import { StatusCodes } from 'http-status-codes';
import { badSubTaskExampleList1 } from '../services/__tests__/mocks/userMocks';

const loginData = {
	email: 'donkey@example.com',
	password: 'aquaticambience',
};

const columnData = { columnName: 'To do' };

const taskData = {
	description: 'Beat all of the donkey kong games',
};

const subTaskData = {
	description: '100% all of the donkey kong games',
};

describe('/subTask ROUTE', () => {
	beforeAll(async () => {
		await testSetup();
	});

	afterAll(async () => {
		await disconnectDB();
	});

	describe('POST /subtask', () => {
		it('tests a successful subTask creation request', async () => {
			const loginResponse = await request(app).post('/login').send(loginData);
			const createdBoard = await board.createNewBoard(
				{ boardName: 'Donkey kong V' },
				{ userName: 'donkeykong', email: 'donkey@example.com' }
			);
			const createdColumn = await column.createNewColumn(
				columnData,
				createdBoard.id
			);

			const createdTask = await task.createNewTask(taskData, createdColumn.id);

			const subTaskResponse = await request(app)
				.post(`/subtask/${createdTask.id}`)
				.send(subTaskData)
				.set('Authorization', loginResponse.body.token);

			expect(subTaskResponse.statusCode).toBe(StatusCodes.CREATED);
			expect(subTaskResponse.body.done).toBeDefined();
			expect(subTaskResponse.body.ownerTask).toBeDefined();
			expect(subTaskResponse.body.description).toBe(subTaskData.description);
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

			const createdTask = await task.createNewTask(taskData, createdColumn.id);

			for (const badSubTask of badSubTaskExampleList1) {
				const subTaskResponse = await request(app)
					.post(`/subtask/${createdTask.id}`)
					.send(badSubTask)
					.set('Authorization', loginResponse.body.token);

				expect(subTaskResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
				expect(subTaskResponse.body.message).toBeDefined();
			}
		});
	});

	describe('GET /subtask/taskId', () => {
		it('tests whether all subtasks are returned', async () => {
			const loginResponse = await request(app).post('/login').send(loginData);
			const createdBoard = await board.createNewBoard(
				{ boardName: 'Donkey kong VI' },
				{ userName: 'donkeykong', email: 'donkey@example.com' }
			);

			const createdColumn = await column.createNewColumn(
				columnData,
				createdBoard.id
			);

			const createdTask = await task.createNewTask(taskData, createdColumn.id);

			await subTask.createNewSubTask(subTaskData, createdTask.id);
			await subTask.createNewSubTask(subTaskData, createdTask.id);

			const subTaskResponse = await request(app)
				.get(`/subtask/${createdTask.id}`)
				.set('Authorization', loginResponse.body.token);

			expect(subTaskResponse.statusCode).toBe(StatusCodes.OK);

			for (const subTask of subTaskResponse.body) {
				expect(subTask.ownerTask).toBe(createdTask.id);
			}
		});
	});
});
