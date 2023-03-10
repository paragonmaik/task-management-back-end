import request from 'supertest';
import app from '../app';
import * as board from '../services/board.service';
import * as column from '../services/column.service';
import * as task from '../services/task.service';
import * as subTask from '../services/subTask.service';
import { disconnectDB, testSetup } from '../database/connection';
import { StatusCodes } from 'http-status-codes';
import { badSubTaskExampleList1 } from '../services/__tests__/mocks/userMocks';
import subTasksModel from '../models/subTasks.model';

const userPayload = { userName: 'donkeykong', email: 'donkey@example.com' };
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
				userPayload
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
				userPayload
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
				userPayload
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

	describe('PUT /subtask/subTaskId', () => {
		it('tests whether subTask description is updated', async () => {
			const requestBody = { description: 'speedrun all donkey kong games' };
			const loginResponse = await request(app).post('/login').send(loginData);

			const createdBoard = await board.createNewBoard(
				{ boardName: 'Donkey kong VII' },
				userPayload
			);

			const createdColumn = await column.createNewColumn(
				columnData,
				createdBoard.id
			);

			const createdTask = await task.createNewTask(taskData, createdColumn.id);

			const createdSubTask = await subTask.createNewSubTask(
				subTaskData,
				createdTask.id
			);

			const subTaskResponse = await request(app)
				.put(`/subtask/${createdSubTask.id}`)
				.send(requestBody)
				.set('Authorization', loginResponse.body.token);

			expect(subTaskResponse.statusCode).toBe(StatusCodes.OK);
			expect(subTaskResponse.body.description).toBe(requestBody.description);
		});
	});

	describe('DELETE /subtask/:subtaskId', () => {
		it('tests whether user is deleted', async () => {
			const loginResponse = await request(app).post('/login').send(loginData);

			const createdBoard = await board.createNewBoard(
				{ boardName: 'Donkey kong III' },
				userPayload
			);

			const createdColumn = await column.createNewColumn(
				{ columnName: 'To do' },
				createdBoard.id
			);

			const createdTask = await task.createNewTask(taskData, createdColumn.id);

			const createdSubTask = await subTask.createNewSubTask(
				subTaskData,
				createdTask.id
			);

			const deleteResponse = await request(app)
				.delete(`/subtask/${createdSubTask.id}`)
				.set('Authorization', loginResponse.body.token);

			const findResponse = await subTasksModel.findByIdAndDelete(
				createdSubTask.id
			);

			expect(deleteResponse.statusCode).toBe(StatusCodes.NO_CONTENT);
			expect(findResponse).toBeNull();
		});
	});
});
