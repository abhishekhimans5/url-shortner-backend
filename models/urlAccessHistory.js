
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
        required:true
    },
    userAgent : {
        type:String,
        required:true
    }, 
});

const UrlAccessHistory = mongoose.model("UrlAccessHistory", urlAccessHistorySchema);
export default UrlAccessHistory;