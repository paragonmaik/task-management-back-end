import express from 'express';
import * as login from '../controllers/login.controller';
import { validateSchema } from '../middlewares/validateSchema';
import { LoginSchema } from '../middlewares/joiSchemas/login.schema';
require('express-async-errors');

const routers = express.Router();

routers.post('/', validateSchema(LoginSchema), login.signIn);

export default routers;
