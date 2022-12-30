import express from 'express';
import * as task from '../controllers/task.controller';
import { authenticationMiddleware } from '../middlewares/auth.middleware';
import { validateSchema } from '../middlewares/validateSchema';
import { TaskSchema } from '../middlewares/joiSchemas/task.schema';
require('express-async-errors');

const routers = express.Router();

routers.post(
	'/:columnId',
	authenticationMiddleware,
	validateSchema(TaskSchema),
	task.createTask
);

export default routers;
