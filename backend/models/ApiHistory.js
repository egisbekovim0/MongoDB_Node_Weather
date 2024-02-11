import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const apiHistorySchema = new Schema({
    timestamp: { 
        type: Date, 
        default: Date.now 
    },
    endpoint: String,
    query: Object,
    response: Object,
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
})

const ApiHistory = mongoose.model('ApiHistory', apiHistorySchema)

export default ApiHistory