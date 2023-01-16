import { Request, Response } from 'express';
import { IBoard } from '../interfaces/IBoard';
import { StatusCodes } from 'http-status-codes';
import * as board from '../services/board.service';

export const createBoard = async (
	req: Request<unknown, unknown, IBoard>,
	res: Response
) => {
	const userPayload = res.locals.payload;
	const createdBoard = await board.createNewBoard(req.body, userPayload);

	res.status(StatusCodes.CREATED).json(createdBoard);
};

export const getBoards = async (_req: Request, res: Response) => {
	const { email } = res.locals.payload;
	const boards = await board.getAllBoards(email);

	res.status(StatusCodes.OK).json(boards);
};

export const getSingleBoard = async (req: Request, res: Response) => {
	const singleBoard = await board.getBoardById(req.params.id);

	res.status(StatusCodes.OK).json(singleBoard);
};

export const updateBoardTitle = async (req: Request, res: Response) => {
	const updatedBoard = await board.updateBoardTitleById(
		req.params.id,
		req.body.boardName
	);

	res.status(StatusCodes.OK).json(updatedBoard);
};

export const updateBoardColumns = async (req: Request, res: Response) => {
	const updatedBoard = await board.updateBoardColumnsOrder(
		req.params.boardId,
		req.body.columns
	);

	res.status(StatusCodes.OK).json(updatedBoard);
};

export const deleteBoardById = async (req: Request, res: Response) => {
	await board.deleteBoard(req.params.boardId);

	res.status(StatusCodes.NO_CONTENT).end();
};
