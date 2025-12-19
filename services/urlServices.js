import Url from '../models/urlModel.js';
import { generateHash } from '../util/generateHash.js';

export const shortenUrl = async (originalUrl, userId) => {

    const prefixUrl = process.env.APP_URL || 'http://localhost:8000/url';
    try {
        if(originalUrl.startsWith(prefixUrl)){
            throw new Error('URL is already shortened');
        }
        else if(!originalUrl.startsWith('http://') && !originalUrl.startsWith('https://')){
            throw new Error('Invalid URL format');
        }
        const shortUrlId = generateHash(7);
        const shortUrlExists = await Url.findOne({ shortUrlId: shortUrlId });
        if (shortUrlExists) {
            return shortenUrl(originalUrl, userId);
        }
        const newUrlToInsert = new Url({
            longUrl: originalUrl,
            shortUrlId: shortUrlId,
            userId: userId
        });
        console.log("New URL to insert:", newUrlToInsert);
        console.log("url : ",prefixUrl + shortUrlId)
        await newUrlToInsert.save();
        console.log("URL saved successfully");
        return {
            shortUrl: prefixUrl + shortUrlId,
            longUrl: originalUrl
        };
    } 
    catch (error) {
        console.error("Error in shortenUrl:", error);
        throw error;
    }
}

export const redirectToLongUrl = async (shortUrlId) => {
    try {
        const urlEntry = await Url.findOne({ shortUrlId: shortUrlId });
        if (!urlEntry) {
            throw new Error('Short URL not found');
        }
        else {
            if(urlEntry.expiresAt && urlEntry.expiresAt < new Date()){
                throw new Error('This short URL has expired');
            }else if(urlEntry.accessType === 'PASSWORD_PROTECTED'){
                return 'password_required';
            }else if(urlEntry.accessType === 'PUBLIC'){
                return urlEntry.longUrl;
            }
        }
    } catch (error) {
        return error;
    } 
}


export const verifyPasswordForUrl = async(shortUrlId, password) => {
    try {
        const urlEntry = await Url.findOne({ shortUrlId: shortUrlId });
        if (!urlEntry) {
            throw new Error('Short URL not found'); 
        }
        else {
            console.log("Verifying password for URL:", shortUrlId);
            if(urlEntry.password === password){
                console.log("Password verified successfully");  
                return urlEntry.longUrl;
            }else{
                throw new Error('Incorrect password');
            }
        }
    } catch (error) {
        throw error;
    }
}