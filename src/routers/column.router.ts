import express from 'express';
import * as column from '../controllers/column.controller';
import { authenticationMiddleware } from '../middlewares/auth.middleware';
import { validateSchema } from '../middlewares/validateSchema';
import { ColumnSchema } from '../middlewares/joiSchemas/column.schema';
require('express-async-errors');

const routers = express.Router();

routers.post(
	'/:id',
	authenticationMiddleware,
	validateSchema(ColumnSchema),
	column.createColumn
);

export default routers;
