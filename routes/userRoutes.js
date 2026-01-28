import express from 'express';
import { onError, onSuccess } from '../middleware/responseFormatter.js';
import { getUserDetails } from '../services/userServices.js';
import { decodeToken } from '../services/jwtServises.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const userRoutes = express.Router();

userRoutes.get('/details',authMiddleware, async (req, res) => {
    try {
        // Assuming user ID is passed as a query parameter for simplicity
        //const userId = req.query.id;
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            onError(res, "User ID and token are required", 400);
        }else{
            const userId = decodeToken(token).id;
            const userDetails = await getUserDetails(userId);
            onSuccess(res, userDetails, "User details fetched successfully", 200);
        }
    } catch (err) {
        onError(res, err.message, 500);
    }
});

export default userRoutes;
