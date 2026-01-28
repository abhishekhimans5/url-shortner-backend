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
    lastAccessed: {
        type: Date,
        default: null
    }
});
const UrlAnalytics = mongoose.model("UrlAnalytics", urlAnalyticsSchema);
export default UrlAnalytics;