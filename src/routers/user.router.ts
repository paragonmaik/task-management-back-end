import express from 'express';
require('express-async-errors');

const routers = express.Router();

routers.post('/');

export default routers;
