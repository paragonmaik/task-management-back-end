import express from 'express';
import userRouter from './user.router';
import loginRouter from './login.router';

const routers = express.Router();

routers.use('/user', userRouter);
routers.use('/login', loginRouter);

export default routers;
