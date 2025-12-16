import mongoose from "mongoose";
const urlSchema = new mongoose.Schema({
    urlName: {
        type: String,
        required: false
    },
    longUrl: {
        type: String,
        required: true
    },
    shortUrlId: {
        type: String,
        required: true,
        unique: true
    },
    accessType: {
        type: String,
        enum: ['PUBLIC', 'PRIVATE','IP_RESTRICTED','PASSWORD_PROTECTED'],
        default: 'PUBLIC'
    },
    restrictedIPs: {
        type: [String],
        required: false
    },
    password: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

});

const Url = mongoose.model("Url", urlSchema);
export default Url;