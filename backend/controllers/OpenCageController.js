import OpenCageData from "../models/OpenCage.js";
import ApiHistory from '../models/ApiHistory.js'
import axios from 'axios'

export const getOpenCage = async (req, res) => {
    const one_user = req.session.user 
    const userId = one_user._id
    const city = req.query.city;
    const openCageApiKey = 'ba632e6b069148ba86390f448c956f43';     
    const openCageUrl = `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${openCageApiKey}`

    let  cage, error, flagsImageUrl = null;

    try {
        const response = await axios.get(openCageUrl);
        cage = response.data;

        const newOpenCageData = new OpenCageData({
            countryCode: cage.results[0].components['ISO_3166-1_alpha-2'],
            city: cage.results[0].components.city,
            country: cage.results[0].components.country,
            state: cage.results[0].components.state,
            postcode: cage.results[0].components.postcode,
            currency: cage.results[0].annotations.currency.name,
        })
        await newOpenCageData.save()

        const apiHistory = new ApiHistory({
            endpoint: '/cage',
            query: { city },
            response: { openCageData: newOpenCageData },
            user: userId
        });
        await apiHistory.save();

        const latestOpenCageData = await OpenCageData.findOne().sort({ createdAt: -1 })

        const countryCode = cage.results[0].components['ISO_3166-1_alpha-2'];
        flagsImageUrl = `https://flagsapi.com/${countryCode}/flat/64.png`;

        res.render("openCage", { flagsImageUrl, latestOpenCageData, error });
        
    } catch (err) {
        error = "Error, Please try again";
        res.render("openCage", { flagsImageUrl, latestOpenCageData: null, error });
    }

}