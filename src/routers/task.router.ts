import express from 'express';
import * as task from '../controllers/task.controller';
import { authenticationMiddleware } from '../middlewares/auth.middleware';
require('express-async-errors');

const routers = express.Router();

routers.post('/:columnId', task.createTask);

export default routers;
