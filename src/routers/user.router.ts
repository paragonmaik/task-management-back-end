import express from 'express';
import * as user from '../controllers/user.controller';
require('express-async-errors');

const routers = express.Router();

routers.post('/', user.createUser);

export default routers;
