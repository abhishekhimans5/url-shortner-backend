
import User from '../models/userModel.js';
export const getUserDetails = async (userId) => {
    try{
        const user = await User.findById(userId);
        if(!user){
            throw new Error('User not found');  
        }
        return {
            name: user.name,
            email: user.email,
        };
    }catch(err){
        throw err;
    }
}