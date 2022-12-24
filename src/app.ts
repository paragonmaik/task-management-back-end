import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import routers from './routers';
import { ErrorHandler } from './middlewares/ErrorHandler';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(routers);
app.use(ErrorHandler);

export default app;
