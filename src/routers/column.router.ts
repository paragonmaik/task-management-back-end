import express from 'express';
import * as column from '../controllers/column.controller';
import { authenticationMiddleware } from '../middlewares/auth.middleware';
import { validateSchema } from '../middlewares/validateSchema';
import { ColumnSchema } from '../middlewares/joiSchemas/column.schema';
import { ColumnTasksSchema } from '../middlewares/joiSchemas/columnTasks.schema';
require('express-async-errors');

const routers = express.Router();

routers.post(
	'/:id',
	authenticationMiddleware,
	validateSchema(ColumnSchema),
	column.createColumn
);
routers.get('/:id', authenticationMiddleware, column.getColumns);
routers.put(
	'/:columnId',
	authenticationMiddleware,
	validateSchema(ColumnSchema),
	column.updateColumnTitle
);
routers.put(
	'/tasks/:boardId',
	authenticationMiddleware,
	validateSchema(ColumnTasksSchema),
	column.updateColumnTasks
);
routers.delete('/:columnId', authenticationMiddleware, column.deleteColumnById);

export default routers;
