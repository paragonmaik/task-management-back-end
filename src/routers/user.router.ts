import express from 'express';
import * as user from '../controllers/user.controller';
import { authenticationMiddleware } from '../middlewares/auth.middleware';
import { validateSchema } from '../middlewares/validateSchema';
import { UserSchema } from '../middlewares/joiSchemas/user.schema';
require('express-async-errors');

const routers = express.Router();

routers.post('/', validateSchema(UserSchema), user.createUser);
routers.delete('/me', authenticationMiddleware, user.deleteUserByEmail);

export default routers;
