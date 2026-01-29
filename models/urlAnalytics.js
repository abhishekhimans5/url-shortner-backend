import mongoose from "mongoose";

const urlAnalyticsSchema = new mongoose.Schema({
    urlId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Url',
        required: true
    },
    noOfClicks: {
        type: Number,
        default: 0
    },
    urlHistoryId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UrlAccessHistory',
        required: false
    },
    
});
const UrlAnalytics = mongoose.model("UrlAnalytics", urlAnalyticsSchema);
export default UrlAnalytics;