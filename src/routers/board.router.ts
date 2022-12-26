import express from 'express';
import * as board from '../controllers/board.controller';
import { authenticationMiddleware } from '../middlewares/auth.middleware';
require('express-async-errors');

const routers = express.Router();

routers.post('/', board.createBoard);

export default routers;
