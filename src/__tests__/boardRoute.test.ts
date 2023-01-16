import request from 'supertest';
import app from '../app';
import { disconnectDB, testSetup } from '../database/connection';
import { StatusCodes } from 'http-status-codes';
import {
	badBoardExampleList1,
	badBoardColumnsExampleList1,
} from '../services/__tests__/mocks/userMocks';
import * as board from '../services/board.service';
import * as column from '../services/column.service';
import boardModel from '../models/board.model';

const userPayload = { userName: 'donkeykong', email: 'donkey@example.com' };
const loginData = {
	email: 'donkey@example.com',
	password: 'aquaticambience',
};

describe('/board ROUTE', () => {
	beforeAll(async () => {
		await testSetup();
	});

	afterAll(async () => {
		await disconnectDB();
	});

	describe('POST /board', () => {
		it('tests a successful board creation request', async () => {
			const loginResponse = await request(app).post('/login').send(loginData);

			const boardResponse = await request(app)
				.post('/board')
				.send({
					boardName: 'Donkey kong III',
				})
				.set('Authorization', loginResponse.body.token);

			expect(boardResponse.statusCode).toBe(StatusCodes.CREATED);
			expect(boardResponse.body.columns).toBeDefined();
			expect(boardResponse.body.boardName).toBe('Donkey kong III');
		});

		it('tests request with invalid body input', async () => {
			const loginResponse = await request(app).post('/login').send(loginData);

			for (const badBoard of badBoardExampleList1) {
				const boardResponse = await request(app)
					.post('/board')
					.send(badBoard)
					.set('Authorization', loginResponse.body.token);

				expect(boardResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
				expect(boardResponse.body.message).toBeDefined();
			}
		});
	});

	describe('GET /board', () => {
		it('tests whether all boards are returned', async () => {
			const loginResponse = await request(app).post('/login').send(loginData);

			const boardsResponse = await request(app)
				.get('/board')
				.set('Authorization', loginResponse.body.token);

			expect(boardsResponse.statusCode).toBe(StatusCodes.OK);

			for (const board of boardsResponse.body) {
				expect(board.members[0].email).toBe('donkey@example.com');
			}
		});
	});

	describe('GET /board/id', () => {
		it('tests whether the requested board is returned', async () => {
			const loginResponse = await request(app).post('/login').send(loginData);

			const createdBoard = await board.createNewBoard(
				{
					boardName: 'Donkey kong V',
				},
				{ userName: 'donkeykong', email: 'donkey@example.com' }
			);

			const boardResponse = await request(app)
				.get(`/board/${createdBoard.id}`)
				.set('Authorization', loginResponse.body.token);

			expect(boardResponse.statusCode).toBe(StatusCodes.OK);
			expect(boardResponse.body.boardName).toBe(createdBoard.boardName);
		});
	});

	describe('PUT /board/id', () => {
		it('tests whether board title is updated', async () => {
			const requestBody = { boardName: 'Donkey Kong V: Empire Strikes Back' };
			const loginResponse = await request(app).post('/login').send(loginData);

			const createdBoard = await board.createNewBoard(
				{
					boardName: 'Donkey kong V',
				},
				{ userName: 'donkeykong', email: 'donkey@example.com' }
			);

			const boardResponse = await request(app)
				.put(`/board/${createdBoard.id}`)
				.send(requestBody)
				.set('Authorization', loginResponse.body.token);

			expect(boardResponse.statusCode).toBe(StatusCodes.OK);
			expect(boardResponse.body.boardName).toBe(requestBody.boardName);
		});

		it('tests request with invalid body input', async () => {
			const loginResponse = await request(app).post('/login').send(loginData);
			const createdBoard = await board.createNewBoard(
				{
					boardName: 'Donkey kong V',
				},
				{ userName: 'donkeykong', email: 'donkey@example.com' }
			);

			for (const badBoard of badBoardExampleList1) {
				const boardResponse = await request(app)
					.put(`/board/${createdBoard.id}`)
					.send(badBoard)
					.set('Authorization', loginResponse.body.token);

				expect(boardResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
				expect(boardResponse.body.message).toBeDefined();
			}
		});
	});

	describe('PUT /board/columns/boardId', () => {
		it('tests whether board columns list is updated', async () => {
			const loginResponse = await request(app).post('/login').send(loginData);
			const createdBoard = await board.createNewBoard(
				{ boardName: 'Donkey kong V' },
				{ userName: 'donkeykong', email: 'donkey@example.com' }
			);
			const createdColumn1 = await column.createNewColumn(
				{ columnName: 'To do' },
				createdBoard.id
			);
			const createdColumn2 = await column.createNewColumn(
				{ columnName: 'In review' },
				createdBoard.id
			);

			const requestBody = { columns: [createdColumn2._id, createdColumn1._id] };
			const { body, statusCode } = await request(app)
				.put(`/board/columns/${createdBoard.id}`)
				.send(requestBody)
				.set('Authorization', loginResponse.body.token);

			expect(statusCode).toBe(StatusCodes.OK);
			expect(body.columns[0]).toEqual(requestBody.columns[0].toString());
			expect(body.columns[1]).toEqual(requestBody.columns[1].toString());
		});

		it('tests request with invalid body input', async () => {
			const loginResponse = await request(app).post('/login').send(loginData);
			const createdBoard = await board.createNewBoard(
				{ boardName: 'Donkey kong V' },
				{ userName: 'donkeykong', email: 'donkey@example.com' }
			);

			for (const badBoardColumns of badBoardColumnsExampleList1) {
				const boardResponse = await request(app)
					.put(`/board/columns/${createdBoard.id}`)
					.send(badBoardColumns)
					.set('Authorization', loginResponse.body.token);

				expect(boardResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
				expect(boardResponse.body.message).toBeDefined();
			}
		});
	});

	describe('DELETE /board/:boardId', () => {
		it('tests whether board is deleted', async () => {
			const loginResponse = await request(app).post('/login').send(loginData);

			const createdBoard = await board.createNewBoard(
				{ boardName: 'Donkey kong III' },
				userPayload
			);

			const deleteResponse = await request(app)
				.delete(`/board/${createdBoard.id}`)
				.set('Authorization', loginResponse.body.token);

			const findResponse = await boardModel.findById(createdBoard.id);

			expect(deleteResponse.statusCode).toBe(StatusCodes.NO_CONTENT);
			expect(findResponse).toBeNull();
		});
	});
});
