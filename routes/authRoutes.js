import express from 'express';
import { isValidEmail } from '../util/isValidEmail.js';
import { onError, onSuccess } from '../middleware/responseFormatter.js';
import { login, register } from '../services/authServices.js';

const authRouter = express.Router();

authRouter.post('/login', async(req,res) => {

    try{
        const {email, password} = req.body;
        if(!email || !password || isValidEmail(email) === false){
            error(res, "Invalid email or password", 400);
        }else{
            login(email, password).then((token) => {
                onSuccess(res, {token: token}, "Login successful", 200);
            }).catch((err) => {
                onError(res, err.message, 401);
            });
        }
    }catch(err){
        onError(res, "Login failed", 500);
    }

});

authRouter.post('/register', async(req,res) => {
    try {

        const {email,password,name} = req.body;

        if(!email || !password || !name || isValidEmail(email) === false){
            onError(res, "Invalid input data", 400);
        }
        else if(!validPassword(password)){
            onError(res, "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character", 400);
        }
        else{
            register(name, email, password).then((token) => {
                onSuccess(res, {token: token}, "Registration successful", 201);
            }).catch((err) => {
                onError(res, err.message, 400);
            });
        }
        
    } catch (err) {
        console.log(err.message);
        onSuccess(res, "Registration failed", 500); 
    }

});






const validPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}   

export default authRouter;