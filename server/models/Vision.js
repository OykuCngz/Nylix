const mongoose = require('mongoose');

const visionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, default: 'General' },
    description: { type: String },
    images: [{ type: String }], // Multi-image support
    layout: { type: String, enum: ['focus', 'grid', 'mosaic'], default: 'focus' },
    size: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vision', visionSchema);
