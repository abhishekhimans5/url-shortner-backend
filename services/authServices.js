import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import { generateToken } from "./jwtServises.js";


export const login = async (email, password) => {
    try{
        const user = await User.findOne({email : email});

        if(!user){
            throw new Error('User not found');
        }else{
            const isValidPassword = await bcrypt.compare(password, user.password);

            if(!isValidPassword){
                throw new Error('Invalid password');
            }else if(!user.isActive){
                throw new Error('User account is inactive');
            }
            else{
                const token =  generateToken({id: user._id, email: user.email});
                return {
                    token: token,
                    email: user.email,
                    name: user.name,
                    id: user._id
                }
            }

        }
    }catch(err){
        throw err;
    }
}

export const register = async (name, email, password) => {
    try{
        const existingUser = await User.findOne({email: email});

        if(existingUser){
            throw new Error('User already exists');
        }else{
            const hashedPassword = await bcrypt.hash(password, 10);  
            const newUser = new User({
                name: name,
                email: email,
                password: hashedPassword
            }); 
            await newUser.save();
            return generateToken({id: newUser._id, email: newUser.email});
        }   
    }catch(err){
        throw err;
    }
}   