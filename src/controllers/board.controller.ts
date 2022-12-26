import { Request, Response } from 'express';
import { IBoard } from '../interfaces/IBoard';
import { StatusCodes } from 'http-status-codes';
import * as board from '../services/board.service';

export const createBoard = async (
	req: Request<unknown, unknown, IBoard>,
	res: Response
) => {
	const createdBoard = await board.createNewBoard(req.body);

	res.status(StatusCodes.CREATED).json(createdBoard);
};
