import express from 'express';
import * as login from '../controllers/login.controller';
require('express-async-errors');

const routers = express.Router();

routers.post('/', login.signIn);

export default routers;
