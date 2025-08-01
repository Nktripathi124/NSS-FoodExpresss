const express = require('express');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all restaurants
router.get('/', async (req, res) => {
    try {
        const restaurants = await Restaurant.find({ isActive: true }).select('-password');
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get restaurant by ID
router.get('/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id).select('-password');
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add menu item (Restaurant only)
router.post('/menu', auth, async (req, res) => {
    try {
        if (req.userRole !== 'restaurant') {
            return res.status(403).json({ message: 'Restaurant access required' });
        }

        const { name, description, price, category, image } = req.body;
        const restaurant = await Restaurant.findById(req.user._id);
        
        restaurant.menu.push({ name, description, price, category, image });
        await restaurant.save();

        res.status(201).json({ message: 'Menu item added successfully', menu: restaurant.menu });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update menu item
router.put('/menu/:itemId', auth, async (req, res) => {
    try {
        if (req.userRole !== 'restaurant') {
            return res.status(403).json({ message: 'Restaurant access required' });
        }

        const restaurant = await Restaurant.findById(req.user._id);
        const menuItem = restaurant.menu.id(req.params.itemId);
        
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        Object.assign(menuItem, req.body);
        await restaurant.save();

        res.json({ message: 'Menu item updated successfully', menuItem });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete menu item
router.delete('/menu/:itemId', auth, async (req, res) => {
    try {
        if (req.userRole !== 'restaurant') {
            return res.status(403).json({ message: 'Restaurant access required' });
        }

        const restaurant = await Restaurant.findById(req.user._id);
        restaurant.menu.id(req.params.itemId).remove();
        await restaurant.save();

        res.json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get restaurant orders
router.get('/orders/my', auth, async (req, res) => {
    try {
        if (req.userRole !== 'restaurant') {
            return res.status(403).json({ message: 'Restaurant access required' });
        }

        const orders = await Order.find({ restaurant: req.user._id })
            .populate('customer', 'name phone')
            .populate('deliveryBoy', 'name phone')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update order status
router.put('/orders/:id/status', auth, async (req, res) => {
    try {
        if (req.userRole !== 'restaurant') {
            return res.status(403).json({ message: 'Restaurant access required' });
        }

        const { status } = req.body;
        const order = await Order.findOneAndUpdate(
            { _id: req.params.id, restaurant: req.user._id },
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({ message: 'Order status updated', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;