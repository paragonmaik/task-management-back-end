import boardModel from '../models/board.model';
import { IBoard } from '../interfaces/IBoard';
import { IJWTPayload } from '../interfaces/IJWTPayload';
import { findUserByUniqueField } from './helpers/helpers';
import { Types, Document } from 'mongoose';

export const addBoardToUser = async (
	email: string,
	boardId: Types.ObjectId
) => {
	const user = await findUserByUniqueField('email', email);
	if (!user) return;

	user.boards?.unshift(boardId);
	await user?.save();
};

export const addUserToBoard = async (
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
