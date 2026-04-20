const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    startDate: { type: Date },
    endDate: { type: Date },
    priority: { type: String, default: 'low' },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Todo', todoSchema);
