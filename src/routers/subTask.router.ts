import express from 'express';
import * as subTask from '../controllers/subTask.controller';
import { authenticationMiddleware } from '../middlewares/auth.middleware';
import { validateSchema } from '../middlewares/validateSchema';
import { TaskSchema } from '../middlewares/joiSchemas/task.schema';
require('express-async-errors');

const routers = express.Router();

routers.post(
	'/:taskId',
	authenticationMiddleware,
	validateSchema(TaskSchema),
	subTask.createSubTask
);
routers.get('/:taskId', authenticationMiddleware, subTask.getSubTasks);
routers.put(
	'/:subTaskId',
	authenticationMiddleware,
	validateSchema(TaskSchema),
	subTask.updateSubTaskDescription
);
routers.delete(
	'/:subtaskId',
	authenticationMiddleware,
	subTask.deleteSubTaskById
);

export default routers;
