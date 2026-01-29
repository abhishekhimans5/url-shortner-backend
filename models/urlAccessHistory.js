import mongoose from 'mongoose';
const urlAccessHistorySchema = new mongoose.Schema({
    urlId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Url',
        required: true
    },
    accessedAt : {
        type: Date,
        default:Date.now,
        required:true
    },
    ipAddress : {
        type:String,
        required:false
    },
    userAgent : {
        type:String,
        required:false
    }, 
});

const UrlAccessHistory = mongoose.model("UrlAccessHistory", urlAccessHistorySchema);
export default UrlAccessHistory;