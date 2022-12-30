import express from 'express';
import userRouter from './user.router';
import loginRouter from './login.router';
import boardRouter from './board.router';
import columnRouter from './column.router';
import taskRouter from './task.router';

const routers = express.Router();

routers.use('/user', userRouter);
routers.use('/login', loginRouter);
routers.use('/board', boardRouter);
routers.use('/column', columnRouter);
routers.use('/task', taskRouter);

export default routers;
