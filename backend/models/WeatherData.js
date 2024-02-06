import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const weatherDataSchema = new Schema({
    city: {
        type: String,
        required: true,
    },
    temperature: {
        type: Number,
    },
    weatherDescription: {
        type: String,
    },
    latitude: {
        type: Number,
    },
    longitude: {
        type: Number,
    },
    feelsLike: {
        type: Number,
    },
    humidity: {
        type: Number,
    },
    pressure: {
        type: Number,
    },
    windSpeed: {
        type: Number,
    },
    icon: {
        type: String,
    }
}, { timestamps: true });

const WeatherData = mongoose.model('WeatherData', weatherDataSchema);

export default WeatherData;
