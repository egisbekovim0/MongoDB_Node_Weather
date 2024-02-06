import express from 'express'
import WeatherData from '../models/WeatherData.js'
import OpenCageData from '../models/OpenCage.js'
import ApiHistory from '../models/ApiHistory.js'
const router = express.Router();
import axios from 'axios'

router.get("/", async (req, res) => {
    const city = req.query.city;
    if (!city) {

        return res.render("index", { latestWeatherData: null, flagsImageUrl: null, latestOpenCageData: null, error: null });
    }
    const apiKey = "2cfe730f0d4e1da90e9ab48860bd6122";
    const unit = 'metric';
    const APIUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
    
    let weather, cage, error, flagsImageUrl = null;

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
        });
        await apiHistory.save();

        const openCageApiKey = 'ba632e6b069148ba86390f448c956f43';
        const openCageUrl = `https://api.opencagedata.com/geocode/v1/json?q=${weather.coord.lat}+${weather.coord.lon}&key=${openCageApiKey}`;
        const openCageResponse = await axios.get(openCageUrl);
        cage = openCageResponse.data;

        const newOpenCageData = new OpenCageData({
            countryCode: cage.results[0].components['ISO_3166-1_alpha-2'],
            city: cage.results[0].components.city,
            country: cage.results[0].components.country,
            state: cage.results[0].components.state,
            postcode: cage.results[0].components.postcode,
            currency: cage.results[0].annotations.currency.name,
        })
        await newOpenCageData.save()

        const latestWeatherData = await WeatherData.findOne().sort({ createdAt: -1 })
        const latestOpenCageData = await OpenCageData.findOne().sort({ createdAt: -1 })


        const countryCode = cage.results[0].components['ISO_3166-1_alpha-2'];
        flagsImageUrl = `https://flagsapi.com/${countryCode}/flat/64.png`;

        res.render("index", { latestWeatherData, flagsImageUrl, latestOpenCageData, error });
        
    } catch (err) {
        error = "Error, Please try again";
        const apiHistory = new ApiHistory({
            endpoint: '/weather',
            query: { city },
            response: { error: 'Error, Please try again' },
        });
        await apiHistory.save();
        res.render("index", { latestWeatherData: null, flagsImageUrl, latestOpenCageData: null, error });
    }
    // catch (err) {
    //     latestWeatherData = null;
    //     latestOpenCageData = null;
    //     flagsImageUrl = null;
    //     error = "Error, Please try again";
    // }

})

export default router