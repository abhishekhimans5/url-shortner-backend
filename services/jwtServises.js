import jwt from 'jsonwebtoken';

export const generateToken = (payload) => {

    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });
    return token;
}

export const verifyToken = (token) => {
    try {
        jwt.verify(token, process.env.SECRET_KEY);
        return true;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}
export const decodeToken = (token) => {
    try {
        const decoded = jwt.decode(token);
        return decoded;
    } catch (error) {
        throw new Error('Failed to decode token');
    }
}