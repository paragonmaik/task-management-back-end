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
