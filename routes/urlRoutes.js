
import express from 'express';
import { shortenUrl, redirectToLongUrl,verifyPasswordForUrl } from '../services/urlServices.js';
import { onError, onSuccess } from '../middleware/responseFormatter.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { decodeToken } from '../services/jwtServises.js';
import { getAllUrls } from '../services/urlServices.js';
import { getUrlAnalytics } from '../services/urlServices.js';
import { parseUserAgentInfo } from '../util/parseUserAgentInfo.js';
import path from 'path';
import { fileURLToPath } from 'url';

const urlRoutes = express.Router();

urlRoutes.post('/shorten', authMiddleware, async (req, res) => {
    try {
        const { originalUrl, userId,accessCode,accessType,expiresAt,urlName} = req.body;
        const userIdFromToken = decodeToken(req.headers.authorization.split(' ')[1]).id;

        if (userId && userId !== userIdFromToken.id) {
            return onError(res, 'Unauthorized: User ID does not match token', 401);
        }
        const urlData = {
            originalUrl,
            accessCode,
            accessType,
            expiresAt,
            urlName
        }
        const result = await shortenUrl(urlData, userIdFromToken);
        onSuccess(res, result, "URL shortened successfully", 201);  
        
    } catch (error) {
        onError(res, error.message, 500);
    }
});

urlRoutes.get('/all', authMiddleware, async(req,res) => {
    try {
        const userIdFromToken = decodeToken(req.headers.authorization.split(' ')[1]).id;
        const result = await getAllUrls(userIdFromToken);
        onSuccess(res, result, "URLs fetched successfully", 200);   
    } catch (error) {
        onError(res, error.message, 500);
    }
});

urlRoutes.get('/:shortId', async (req, res) => {
    try {
        const { shortId } = req.params;
        const userAgentString = req.headers['user-agent'] || '';
        const userAgent = parseUserAgentInfo(userAgentString);
        const longUrl = await redirectToLongUrl(shortId,userAgent);
        if(longUrl === 'password_required'){
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            //return res.sendFile('D:/Projects/NodeProjects/url-shortner-backend/serverPages/verifyProtectedUrl.html');
            return res.sendFile(
                path.join(__dirname, '../serverPages/verifyProtectedUrl.html')
            );
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


urlRoutes.get('/analytics/:shortId', authMiddleware, async(req,res) => {
    try {
        const { shortId } = req.params;
        const userIdFromToken = decodeToken(req.headers.authorization.split(' ')[1]).id;
        const result = await getUrlAnalytics(shortId, userIdFromToken);
        onSuccess(res, result, "URL analytics fetched successfully", 200);
    } catch (error) {
        onError(res, error.message, 500);
    }
});

export default urlRoutes;