import express from 'express';
import * as user from '../controllers/user.controller';
import { validateSchema } from '../middlewares/validateSchema';
import { UserSchema } from '../middlewares/joiSchemas/user.schema';
require('express-async-errors');

const routers = express.Router();

routers.post('/', validateSchema(UserSchema), user.createUser);

export default routers;
