import boardModel from '../models/board.model';
import { IBoard } from '../interfaces/IBoard';

export const createNewBoard = async (board: IBoard) => {
	const createdBoard = await boardModel.create({
		boardName: board.boardName,
	});

	return createdBoard;
};
