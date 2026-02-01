
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({

    otp : {
        type : Number,
        required : true,
        length : 6
    },
    email : {
        type : String,
        required : true,
    },
    generatedAt : {
        type : Date,
        default : new Date(),
        required : true,
    },
    usedStatus : {
        type : Boolean,
        required : true,
        default : false,
    },
    purpose : {
        type : String,
        required : false,
    }

});

const OTP = mongoose.model("OTP",otpSchema);
export default OTP;