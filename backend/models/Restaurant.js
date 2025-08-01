const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: String,
    isAvailable: { type: Boolean, default: true },
    image: String
});

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    cuisine: [String],
    menu: [menuItemSchema],
    rating: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    image: String
}, { timestamps: true });

restaurantSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

restaurantSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Restaurant', restaurantSchema);