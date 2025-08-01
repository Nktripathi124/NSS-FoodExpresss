const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const DeliveryBoy = require('../models/DeliveryBoy');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        let user;
        if (decoded.role === 'customer' || decoded.role === 'admin') {
            user = await User.findById(decoded.userId);
        } else if (decoded.role === 'restaurant') {
            user = await Restaurant.findById(decoded.userId);
        } else if (decoded.role === 'delivery') {
            user = await DeliveryBoy.findById(decoded.userId);
        }

        if (!user) {
            return res.status(401).json({ message: 'Token is not valid' });
        }

        req.user = user;
        req.userRole = decoded.role;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

const adminAuth = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

module.exports = { auth, adminAuth };