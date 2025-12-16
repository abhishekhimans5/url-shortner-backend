import express from 'express';
import authRouter from './authRoutes.js';
import urlRoutes from './urlRoutes.js';

const allRoutes = express.Router();

allRoutes.use('/auth', authRouter);
allRoutes.use('/url', urlRoutes);

export default allRoutes;