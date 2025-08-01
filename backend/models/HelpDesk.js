const mongoose = require('mongoose');

const helpDeskSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    subject: { type: String, required: true },
    message: { type: String, required: true },
    category: {
        type: String,
        enum: ['order', 'payment', 'delivery', 'restaurant', 'technical', 'other'],
        default: 'other'
    },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'resolved', 'closed'],
        default: 'open'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    adminResponse: String,
    responseDate: Date
}, { timestamps: true });

module.exports = mongoose.model('HelpDesk', helpDeskSchema);