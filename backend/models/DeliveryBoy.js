const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const deliveryBoySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    vehicleType: { type: String, enum: ['bike', 'car', 'bicycle'], required: true },
    vehicleNumber: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    currentLocation: {
        lat: Number,
        lng: Number
    },
    rating: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

deliveryBoySchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

deliveryBoySchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('DeliveryBoy', deliveryBoySchema);