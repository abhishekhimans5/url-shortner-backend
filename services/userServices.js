
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
            isVarified: user.isVarified
        };
    }catch(err){
        throw err;
    }
}

export const getUserDashboardDetails = async(userId) => {
    try {
        const user = await User.findOne({_id : userId});
        if(!user){
            throw new Error('User not found');
        }
    } catch (error) {
        
    }
}
