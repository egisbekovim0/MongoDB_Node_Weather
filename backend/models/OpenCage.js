import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const openCageDataSchema = new Schema({
    countryCode: {
        type: String,
    },
    city: {
        type: String,
    },
    country: {
        type: String,
    },
    state: {
        type: String,
    },
    postcode: {
        type: String,
    },
    currency: {
        type: String,
    },
}, { timestamps: true });

const OpenCageData = mongoose.model('OpenCageData', openCageDataSchema);

export default OpenCageData;