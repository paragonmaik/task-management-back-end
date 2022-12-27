import express from 'express';
import * as board from '../controllers/board.controller';
import { authenticationMiddleware } from '../middlewares/auth.middleware';
import { validateSchema } from '../middlewares/validateSchema';
import { BoardSchema } from '../middlewares/joiSchemas/board.schema';
require('express-async-errors');

const routers = express.Router();

routers.post(
	'/',
	authenticationMiddleware,
	validateSchema(BoardSchema),
	board.createBoard
);
routers.get('/', authenticationMiddleware, board.getBoards);

export default routers;
