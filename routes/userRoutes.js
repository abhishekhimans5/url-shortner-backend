import express from 'express';
import { onError, onSuccess } from '../middleware/responseFormatter.js';
import { getUserDetails, updateUserProfile } from '../services/userServices.js';
import { decodeToken } from '../services/jwtServises.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import User from '../models/userModel.js';
import { generateAndSendOTP, verifyOTP } from '../services/otpServices.js';

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

userRoutes.post('/verify',authMiddleware,async(req,res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            onError(res, "User ID and token are required", 400);
        }else{
            const userId = decodeToken(token).id;
            const user = await User.findById(userId);

            if(user){
                await generateAndSendOTP(user.email,'Email Verification');
                onSuccess(res,'','OTP sent successfully',201);
                return;
            }
            onError(res,'Something wrong happened!')

        }
    } catch (error) {
        onError(res,error.message,500);
    }
});

userRoutes.post('/verify-otp',authMiddleware, async(req,res) => {

    try {
        const token = req.headers.authorization?.split(' ')[1];
        const otp = req.body.otp;
        if (!token) {
            onError(res, "User ID and token are required", 400);
        }else{
            const userId = decodeToken(token).id;
            const user = await User.findById(userId);

            if(user){
                const otpData = {
                    email : user.email,
                    otp : otp
                }
                const isVerified = await verifyOTP(otpData);

                if(isVerified){
                    const data = await updateUserProfile(userId,
                                    {
                                        isVerified : true,
                                    }
                                )
                    onSuccess(res,data,'Email verified successfully')
                }else{
                    onError(res,'Wrong OTP')
                }
            }
        }

    } catch (error) {
        onError(res,error.message);
    }
})


export default userRoutes;
