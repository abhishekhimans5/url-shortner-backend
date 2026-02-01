import Url from '../models/urlModel.js';
import UrlAnalytics from '../models/urlAnalytics.js';
import UrlAccessHistory from '../models/urlAccessHistory.js';
import { generateHash } from '../util/generateHash.js';
import mongoose from 'mongoose';

export const shortenUrl = async (urlData, userId) => {

    const prefixUrl = process.env.APP_URL || 'http://localhost:8000/url';
    let {originalUrl,accessType,accessCode,expiresAt,urlName} = urlData;
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
            urlName: urlName || '--',
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

        const a = await newUrlToInsert.save();
        return {
            shortUrl: prefixUrl + shortUrlId,
            longUrl: originalUrl
        };
    } 
    catch (error) {
        throw error;
    }
}

export const redirectToLongUrl = async (shortUrlId,userAgent) => {
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
                updateUrlHistoryAndAnalytics(urlEntry._id, '', userAgent);
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
            if(urlEntry.password === password){
                updateUrlHistoryAndAnalytics(urlEntry._id, '', '');
                return urlEntry.longUrl;
            }else{
                throw new Error('Incorrect password');
            }
        }
    } catch (error) {
        throw error;
    }
}



export const getAllUrls = async (userId) => {
  if (!userId) {
    throw new Error(`User Id shouldn't be null`);
  }

  const prefixUrl = process.env.APP_URL || 'http://localhost:8000/url/';

  const urls = await Url.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId) // ✅ required
      }
    },
    {
      $lookup: {
        from: 'urlanalytics', // ✅ correct collection
        localField: '_id',
        foreignField: 'urlId',
        as: 'analytics'
      }
    },
    {
      $addFields: {
        clickCount: {
          $ifNull: [
            { $arrayElemAt: ['$analytics.noOfClicks', 0] },
            0
          ]
        }
      }
    },
    {
      $project: {
        urlName: 1,
        longUrl: 1,
        shortUrlId: 1,
        accessType: 1,
        expiresAt: 1,
        clickCount: 1,
        createdAt: 1
      }
    },
    {
      $sort: { createdAt: -1 }
    }
  ]);

  return urls.map(url => ({
    urlId: url._id,
    urlName: url.urlName,
    longUrl: url.longUrl,
    shortUrl: `${prefixUrl}${url.shortUrlId}`,
    accessType: url.accessType,
    clickCount: url.clickCount,
    status: url.expiresAt
      ? url.expiresAt < new Date() ? 'EXPIRED' : 'ACTIVE'
      : 'ACTIVE'
  }));
};



export const getUrlAnalytics = async(shortUrlId, userId) => {
    try{
        if(!userId || !shortUrlId){
            throw new Error(`User Id and Short URL Id shouldn't be null`);
        }
        const urlEntry = await Url.findOne({_id: shortUrlId, userId: userId});
        if (!urlEntry) {
            throw new Error('Short URL not found');
        }
        const analyticsData = await UrlAnalytics.findOne({urlId: urlEntry._id})
                                        .select('noOfClicks urlId -_id');
        const accessHistory = await UrlAccessHistory.find({urlId: urlEntry._id})
                                        .select('accessedAt ipAddress userAgent -_id')
                                        .sort({accessedAt: -1});
                                        
        let result = {};
        if(analyticsData){
            result = {
                ...analyticsData.toObject(),
                accessHistory:accessHistory
            }
        }
        return result || {};
    }catch(err){
        throw err;
    }
}


export const updateUrlHistoryAndAnalytics = async(urlId, ipAddress, userAgent) => {
    const session = await mongoose.startSession();
    try{
        session.startTransaction();
        await UrlAccessHistory.create(
                [
                    {
                        urlId,
                        accessedAt: new Date(),
                        ipAddress,
                        userAgent
                    }
                ],
                { session }
                );

        await UrlAnalytics.findOneAndUpdate(
            {urlId : urlId},
            {
                $inc : {
                    noOfClicks : 1,
                }
            },{upsert:true, new:true, session}
        );

        await session.commitTransaction();
    }catch(err){
        await session.abortTransaction();
        console.error("Error updating URL history and analytics:", err);
        throw err;
    }
    finally{
        session.endSession();
    }
}