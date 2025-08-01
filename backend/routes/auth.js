const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const DeliveryBoy = require('../models/DeliveryBoy');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Generate JWT Token
const generateToken = (userId, role) => {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '30d'
    });
};

// Customer Registration
router.post('/customer/register', async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({ name, email, password, phone, address });
        await user.save();

        const token = generateToken(user._id, 'customer');
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { id: user._id, name: user.name, email: user.email, role: 'customer' }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Customer Login
router.post('/customer/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id, user.role);
        res.json({
            message: 'Login successful',
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Restaurant Registration
router.post('/restaurant/register', async (req, res) => {
    try {
        const { name, email, password, phone, address, cuisine } = req.body;
        
        const existingRestaurant = await Restaurant.findOne({ email });
        if (existingRestaurant) {
            return res.status(400).json({ message: 'Restaurant already exists' });
        }

        const restaurant = new Restaurant({ name, email, password, phone, address, cuisine });
        await restaurant.save();

        const token = generateToken(restaurant._id, 'restaurant');
        res.status(201).json({
            message: 'Restaurant registered successfully',
            token,
            user: { id: restaurant._id, name: restaurant.name, email: restaurant.email, role: 'restaurant' }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Restaurant Login
router.post('/restaurant/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const restaurant = await Restaurant.findOne({ email });
        if (!restaurant || !(await restaurant.comparePassword(password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(restaurant._id, 'restaurant');
        res.json({
            message: 'Login successful',
            token,
            user: { id: restaurant._id, name: restaurant.name, email: restaurant.email, role: 'restaurant' }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delivery Boy Registration
router.post('/delivery/register', async (req, res) => {
    try {
        const { name, email, password, phone, vehicleType, vehicleNumber } = req.body;
        
        const existingDelivery = await DeliveryBoy.findOne({ email });
        if (existingDelivery) {
            return res.status(400).json({ message: 'Delivery boy already exists' });
        }

        const deliveryBoy = new DeliveryBoy({ name, email, password, phone, vehicleType, vehicleNumber });
        await deliveryBoy.save();

        const token = generateToken(deliveryBoy._id, 'delivery');
        res.status(201).json({
            message: 'Delivery boy registered successfully',
            token,
            user: { id: deliveryBoy._id, name: deliveryBoy.name, email: deliveryBoy.email, role: 'delivery' }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delivery Boy Login
router.post('/delivery/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const deliveryBoy = await DeliveryBoy.findOne({ email });
        if (!deliveryBoy || !(await deliveryBoy.comparePassword(password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(deliveryBoy._id, 'delivery');
        res.json({
            message: 'Login successful',
            token,
            user: { id: deliveryBoy._id, name: deliveryBoy.name, email: deliveryBoy.email, role: 'delivery' }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Profile
router.get('/profile', auth, async (req, res) => {
    try {
        res.json({
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.userRole
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;