import express from 'express';
import * as board from '../controllers/board.controller';
import { authenticationMiddleware } from '../middlewares/auth.middleware';
import { validateSchema } from '../middlewares/validateSchema';
import { BoardSchema } from '../middlewares/joiSchemas/board.schema';
import { BoardColumnsSchema } from '../middlewares/joiSchemas/boardColumns.schema';
require('express-async-errors');

const routers = express.Router();

routers.post(
	'/',
	authenticationMiddleware,
	validateSchema(BoardSchema),
	board.createBoard
);
routers.get('/', authenticationMiddleware, board.getBoards);
routers.get('/:id', authenticationMiddleware, board.getSingleBoard);
routers.put(
	'/:id',
	authenticationMiddleware,
	validateSchema(BoardSchema),
	board.updateBoardTitle
);
routers.put(
	'/columns/:boardId',
	authenticationMiddleware,
	validateSchema(BoardColumnsSchema),
	board.updateBoardColumns
);
routers.delete('/:boardId', authenticationMiddleware, board.deleteBoardById);

export default routers;
