
import User from '../models/userModel.js';
export const getUserDetails = async (userId) => {
    try{
        const user = await User.findById(userId);
        if(!user){
            throw new Error('User not found');  
        }
        return {
            id: user._id,
            name: user.name,
            email: user.email,
            isVerified: user.isVerified
        };
    }catch(err){
        throw err;
    }
}

export const updateUserProfile = async(id,userData) => {
    try {
        let user = await User.findById(id);
        if(user){
            if(userData?.name){
                user.name = userData.name;
            }
            if(userData?.isVerified){
                user.isVerified = userData.isVerified;
            }
            if(userData?.isActive){
                user.isActive = userData.isActive;
            }
            if(userData?.password){
                const hashedPassword = await bcrypt.hash(userData.password, 10); 
                user.password = hashedPassword;
            }
            user = await user.save();
            return {
                id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified
            };
        }else{
            throw new Error('Something went wrong')
        }
    } catch (error) {
        throw error;
    }
}

