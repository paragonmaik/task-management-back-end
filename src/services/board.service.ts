import boardModel from '../models/board.model';
import { IBoard } from '../interfaces/IBoard';
import { IJWTPayload } from '../interfaces/IJWTPayload';
import { findUserByUniqueField } from './helpers/helpers';
import { Types, Document } from 'mongoose';
import { HttpException } from '../middlewares/HttpException';
import { StatusCodes } from 'http-status-codes';
import * as columnService from './column.service';
import columnsModel from '../models/columns.model';

const addBoardToUser = async (email: string, boardId: Types.ObjectId) => {
	const user = await findUserByUniqueField('email', email);

	user?.boards?.unshift(boardId);
	await user?.save();
};

const addUserToBoard = async (
	board: Document<unknown, any, IBoard> & IBoard & { _id: Types.ObjectId },
	userPayload: IJWTPayload
) => {
	board.members?.unshift({ ...userPayload, role: 'owner' });
	await board.save();
};

export const createNewBoard = async (
	board: IBoard,
	userPayload: IJWTPayload
) => {
	const createdBoard = await boardModel.create({
		boardName: board.boardName,
	});

	await addBoardToUser(userPayload.email, createdBoard.id);
	await addUserToBoard(createdBoard, userPayload);

	return createdBoard;
};

export const getAllBoards = async (email: string) => {
	const boards = await boardModel.find({
		members: { $elemMatch: { email } },
	});

	return boards;
};

export const getBoardById = async (boardId: string) => {
	const board = await boardModel.findById(boardId);

	if (!board) {
		throw new HttpException(StatusCodes.NOT_FOUND, 'Board does not exist!');
	}

	return board;
};

export const updateBoardTitleById = async (
	boardId: string,
	boardName: string
) => {
	const board = await boardModel.findByIdAndUpdate(
		boardId,
		{ boardName },
		{ new: true }
	);

	if (!board) {
		throw new HttpException(StatusCodes.NOT_FOUND, 'Board does not exist!');
	}

	return board;
};

export const updateBoardColumnsOrder = async (
	boardId: string,
	boardColums: Types.ObjectId[]
) => {
	const board = await boardModel.findByIdAndUpdate(
		boardId,
		{ columns: boardColums },
		{ new: true }
	);

	if (!board) {
		throw new HttpException(StatusCodes.NOT_FOUND, 'Board does not exist!');
	}

	return board;
};

export const deleteBoard = async (boardId: string) => {
	await boardModel.findByIdAndDelete(boardId);

	const columns = await columnsModel.find({
		ownerBoard: boardId,
	});

	columns.forEach(async (column) => {
		await columnService.deleteColumn(column.id);
	});
};
