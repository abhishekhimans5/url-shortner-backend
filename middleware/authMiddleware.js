import { decodeToken, verifyToken } from "../services/jwtServises.js";
import { onError } from "./responseFormatter.js";


export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {

        const token = authHeader.split(' ')[1];
        console.log(decodeToken(token));
        if (verifyToken(token)) {
            next();
        } else {
            onError(res, 'Unauthorized: Invalid token', 401);
        }
    } else {
        onError(res, 'Unauthorized: No token provided', 401);
    }
};