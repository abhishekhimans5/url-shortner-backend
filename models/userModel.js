import mongoose from "mongoose";

const User = mongoose.model("User", 
    new mongoose.Schema({
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },  
        createdAt: {
            type: Date,
            default: Date.now,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isVerified:{
            type:Boolean,
            default:false,
        }
    }));

export default User;