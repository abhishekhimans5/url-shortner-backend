
import OTP from "../models/otpModel.js";
import { sendEmailNotification } from "./emailServices.js";

export const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
}

export const generateAndSendOTP = async (email, purpose) => {
  try {
    const localOtp = generateOTP();

    const templateData = {
      email,
      subject: "OTP Verification",
      otp: localOtp
    };

    await Promise.all([
      OTP.findOneAndUpdate(
        { email },
        {
          $set: {
            otp: localOtp,
            email,
            generatedAt: new Date(),
            purpose,
            usedStatus: false
          }
        },
        { upsert: true, new: true }
      ),
      sendEmailNotification(templateData)
    ]);

    return true;
  } catch (error) {
    throw error;
  }
};


export const verifyOTP = async (otpData) => {
    try {
        const {email,otp} = otpData;
        const dbOtp = await OTP.findOne({email : email});

        if(!dbOtp){
            throw new Error('OTP not generated yet');
        }

        if(dbOtp.otp == otp){
            if(dbOtp.usedStatus){
                throw new Error('OTP already used')
            }
            await OTP.findOneAndUpdate(
                {email : email},
                {
                    usedStatus : true,
                }
            )
            return true;
        }
        return false;

    } catch (error) {
        throw error
    }
}