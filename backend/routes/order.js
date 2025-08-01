const express = require('express');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const DeliveryBoy = require('../models/DeliveryBoy');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create order
router.post('/', auth, async (req, res) => {
    try {
        if (req.userRole !== 'customer') {
            return res.status(403).json({ message: 'Customer access required' });
        }

        const { restaurant, items, deliveryAddress, specialInstructions } = req.body;
        
        // Calculate total amount
        const restaurantData = await Restaurant.findById(restaurant);
        let totalAmount = 0;
        
        for (let item of items) {
            const menuItem = restaurantData.menu.id(item.menuItem);
            if (menuItem) {
                totalAmount += menuItem.price * item.quantity;
            }
        }

        const order = new Order({
            customer: req.user._id,
            restaurant,
            items,
            totalAmount,
            deliveryAddress,
            specialInstructions
        });

        await order.save();
        await order.populate(['customer', 'restaurant']);

        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get customer orders
router.get('/my', auth, async (req, res) => {
    try {
        if (req.userRole !== 'customer') {
            return res.status(403).json({ message: 'Customer access required' });
        }

        const orders = await Order.find({ customer: req.user._id })
            .populate('restaurant', 'name address')
            .populate('deliveryBoy', 'name phone')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('customer', 'name phone address')
            .populate('restaurant', 'name address phone')
            .populate('deliveryBoy', 'name phone vehicleNumber');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check authorization
        if (req.userRole === 'customer' && order.customer._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this order' });
        }
        if (req.userRole === 'restaurant' && order.restaurant._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this order' });
        }
        if (req.userRole === 'delivery' && order.deliveryBoy && order.deliveryBoy._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this order' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Assign delivery boy to order
router.put('/:id/assign', auth, async (req, res) => {
    try {
        if (req.userRole !== 'delivery') {
            return res.status(403).json({ message: 'Delivery boy access required' });
        }

        const order = await Order.findOneAndUpdate(
            { _id: req.params.id, status: 'ready', deliveryBoy: null },
            { deliveryBoy: req.user._id, status: 'picked' },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found or already assigned' });
        }

        res.json({ message: 'Order assigned successfully', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get available orders for delivery
router.get('/delivery/available', auth, async (req, res) => {
    try {
        if (req.userRole !== 'delivery') {
            return res.status(403).json({ message: 'Delivery boy access required' });
        }

        const orders = await Order.find({ status: 'ready', deliveryBoy: null })
            .populate('restaurant', 'name address')
            .populate('customer', 'name address phone')
            .sort({ createdAt: 1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get delivery boy's orders
router.get('/delivery/my', auth, async (req, res) => {
    try {
        if (req.userRole !== 'delivery') {
            return res.status(403).json({ message: 'Delivery boy access required' });
        }

        const orders = await Order.find({ deliveryBoy: req.user._id })
            .populate('restaurant', 'name address phone')
            .populate('customer', 'name address phone')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update delivery status
router.put('/:id/delivery-status', auth, async (req, res) => {
    try {
        if (req.userRole !== 'delivery') {
            return res.status(403).json({ message: 'Delivery boy access required' });
        }

        const { status } = req.body;
        const order = await Order.findOneAndUpdate(
            { _id: req.params.id, deliveryBoy: req.user._id },
            { status, ...(status === 'delivered' && { deliveryTime: new Date() }) },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({ message: 'Delivery status updated', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;