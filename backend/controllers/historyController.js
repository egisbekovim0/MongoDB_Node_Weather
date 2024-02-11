import ApiHistory from '../models/ApiHistory.js';

export const getApiHistory = async (req, res) => {
    try {
        
        if (!req.session.user) {
            return res.render('login', { error: 'Unauthorized. Please log in first.' });
        }
        
        const userId = req.session.user._id;
        const pageSize = 10;
        const page = req.query.page || 1; 
        
        const totalApiRecords = await ApiHistory.countDocuments({ user: userId });

        const totalPages = Math.ceil(totalApiRecords / pageSize);
        
        const apiHistory = await ApiHistory.find({ user: userId }).sort({ timestamp: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        res.render('histories', { user: req.session.user,  apiHistory, currentPage: page, totalPages });
    } catch (error) {
        console.error('Error retrieving API history:', error);
        res.status(500).send('Internal Server Error');
    }
};