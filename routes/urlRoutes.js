
import express from 'express';
import { shortenUrl, redirectToLongUrl,verifyPasswordForUrl } from '../services/urlServices.js';
import { onError, onSuccess } from '../middleware/responseFormatter.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { decodeToken } from '../services/jwtServises.js';

const urlRoutes = express.Router();

urlRoutes.post('/shorten', authMiddleware, async (req, res) => {
    try {
        const { originalUrl, userId,accessCode,accessType,expiresAt } = req.body;
        const userIdFromToken = decodeToken(req.headers.authorization.split(' ')[1]).id;

        if (userId && userId !== userIdFromToken.id) {
            return onError(res, 'Unauthorized: User ID does not match token', 401);
        }
        const urlData = {
            originalUrl,
            accessCode,
            accessType,
            expiresAt
        }
        const result = await shortenUrl(urlData, userIdFromToken);
        onSuccess(res, result, "URL shortened successfully", 201);  
        
    } catch (error) {
        console.log()
        onError(res, error.message, 500);
    }
});



urlRoutes.get('/:shortId', async (req, res) => {
    try {
        const { shortId } = req.params;
        const longUrl = await redirectToLongUrl(shortId);
        if(longUrl === 'password_required'){
            return res.sendFile('D:/Projects/NodeProjects/url-shortner-backend/serverPages/verifyProtectedUrl.html');
        }
        res.redirect(longUrl);
    } catch (error) {
        onError(res, error.message, 500);
    }
});



urlRoutes.post('/:shortId/verify-password', async(req,res) => {
    try {
        const { shortId } = req.params;
        const { accessCode } = req.body;
        const result = await verifyPasswordForUrl(shortId, accessCode);
        
        onSuccess(res, {redirectUrl: result}, "Password verified successfully", 200);   
    } catch (error) {
        onError(res, error.message, 500);
    }
});


export default urlRoutes;