const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    status: {
        type: String,
        enum: ['planning', 'active', 'on-hold', 'completed'],
        default: 'planning'
    },
    startDate: { type: Date },
    endDate: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);
