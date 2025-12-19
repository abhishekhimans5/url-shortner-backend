import express from 'express';
import authRouter from './authRoutes.js';
import urlRoutes from './urlRoutes.js';
import userRoutes from './userRoutes.js';

const allRoutes = express.Router();

allRoutes.use('/auth', authRouter);
allRoutes.use('/url', urlRoutes);
allRoutes.use('/user', userRoutes);

export default allRoutes;