import Url from '../models/urlModel.js';
import { generateHash } from '../util/generateHash.js';

export const shortenUrl = async (urlData, userId) => {

    const prefixUrl = process.env.APP_URL || 'http://localhost:8000/url';
    console.log(urlData)
    let {originalUrl,accessType,accessCode,expiresAt} = urlData
    try {
        if(originalUrl.startsWith(prefixUrl)){
            throw new Error('URL is already shortened');
        }
        else if(!originalUrl.startsWith('http://') && !originalUrl.startsWith('https://')){
            throw new Error('Invalid URL format');
        }else if(accessType === 'protected' && !accessCode){
            throw new Error('Password needed for protected urls');
        }
        accessType = accessType === 'protected' ? 'PASSWORD_PROTECTED' : (accessType === 'private' ? 'PRIVATE' : 'PUBLIC')
        const shortUrlId = generateHash(7);
        const shortUrlExists = await Url.findOne({ shortUrlId: shortUrlId });
        if (shortUrlExists) {
            return shortenUrl(originalUrl, userId);
        }
        const newUrlData = {
            longUrl: originalUrl,
            shortUrlId,
            userId,
            accessType: accessType ?? 'PUBLIC',
            password: accessType === 'PASSWORD_PROTECTED' ? accessCode : undefined
        };

        if (expiresAt) {
            newUrlData.expiresAt = new Date(expiresAt);
        }

        const newUrlToInsert = new Url(newUrlData);

        console.log(newUrlToInsert)
        const a = await newUrlToInsert.save();
        console.log(a)
        return {
            shortUrl: prefixUrl + shortUrlId,
            longUrl: originalUrl
        };
    } 
    catch (error) {
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
        throw error;
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

export const getAllUrls = async(userId) => {
    try{
        if(!userId){
            throw new Error(`User Id shouldn't be null`);
        }else{

            const urlList = await Url.find({userId: userId})
                                .select('urlName longUrl shortUrlId accessType expiresAt')
                                .sort({createdAt: -1});
            const prefixUrl = (process.env.APP_URL || 'http://localhost:8000/url')+'/';
            
            return urlList.map(url => ({
                urlName: url.urlName,
                longUrl: url.longUrl,
                shortUrl: prefixUrl + url.shortUrlId,
                accessType: url.accessType,
                isExpired: url.expiresAt ? (url.expiresAt < new Date()) : false,
            }));
        }

    }catch(err){
        throw err;
    }
}