import WeatherData from "../models/WeatherData.js";
import ApiHistory from '../models/ApiHistory.js'
import axios from 'axios'

export const getWeather = async (req, res) => {
    if (!req.session.user) {
        return res.render("index", { latestWeatherData: null, error: "Unauthorized. Please log in first." });
    }

    const one_user = req.session.user 
    const userId = one_user._id
    const city = req.query.city;
    const apiKey = "2cfe730f0d4e1da90e9ab48860bd6122";
    const unit = 'metric';
    const APIUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
    
    let weather, error = null;

    try {
        const response = await axios.get(APIUrl);
        weather = response.data;

        const newWeatherData = new WeatherData({
            city: city,
            temperature: weather.main.temp,
            weatherDescription: weather.weather[0].description,
            latitude: weather.coord.lat,
            longitude: weather.coord.lon,
            feelsLike: weather.main.feels_like,
            humidity: weather.main.humidity,
            pressure: weather.main.pressure,
            windSpeed: weather.wind.speed,
            icon: weather.weather[0].icon
        })
        await newWeatherData.save()

        const apiHistory = new ApiHistory({
            endpoint: '/weather',
            query: { city },
            response: { weatherData: newWeatherData },
            user: userId
        });
        await apiHistory.save();

        const latestWeatherData = await WeatherData.findOne().sort({ createdAt: -1 })

        res.render("index", { latestWeatherData, error });
        
    } catch (err) {
        error = "Error, Please try again";
        res.render("index", { latestWeatherData: null, error });
    }

}