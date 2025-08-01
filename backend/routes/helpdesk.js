const express = require('express');
const HelpDesk = require('../models/HelpDesk');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Create help ticket
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, subject, message, category } = req.body;
        
        const helpTicket = new HelpDesk({
            name,
            email,
            phone,
            subject,
            message,
            category,
            ...(req.user && { user: req.user._id })
        });

        await helpTicket.save();
        res.status(201).json({ message: 'Help ticket created successfully', ticket: helpTicket });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user's help tickets
router.get('/my', auth, async (req, res) => {
    try {
        const tickets = await HelpDesk.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all help tickets (Admin only)
router.get('/all', auth, adminAuth, async (req, res) => {
    try {
        const { status, category, priority } = req.query;
        const filter = {};
        
        if (status) filter.status = status;
        if (category) filter.category = category;
        if (priority) filter.priority = priority;

        const tickets = await HelpDesk.find(filter)
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update help ticket (Admin only)
router.put('/:id', auth, adminAuth, async (req, res) => {
    try {
        const { status, priority, adminResponse } = req.body;
        
        const updateData = { status, priority };
        if (adminResponse) {
            updateData.adminResponse = adminResponse;
            updateData.responseDate = new Date();
        }

        const ticket = await HelpDesk.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.json({ message: 'Ticket updated successfully', ticket });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get help ticket by ID
router.get('/:id', async (req, res) => {
    try {
        const ticket = await HelpDesk.findById(req.params.id).populate('user', 'name email');
        
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;