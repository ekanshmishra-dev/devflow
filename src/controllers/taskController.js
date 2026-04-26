const Task = require('../models/Task');
const { validationResult } = require('express-validator');

const createTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const taskData = { ...req.body, createdBy: req.user._id };
        const task = await Task.create(taskData);

        req.app.get('io').emit('task:created', task);

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllTasks = async (req, res) => {
    try {
        const { project, status, priority } = req.query;
        let query = {};

        if (project) query.project = project;
        if (status) query.status = status;
        if (priority) query.priority = priority;

        const tasks = await Task.find(query)
            .populate('assignedTo', 'name email')
            .populate('project', 'name');

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('assignedTo', 'name email')
            .populate('project', 'name');

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (error) {
        if (error.kind === 'ObjectId') return res.status(404).json({ error: 'Task not found' });
        res.status(500).json({ error: error.message });
    }
};

const updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        if (req.body.status) {
            req.app.get('io').emit('task:updated', task);
        }

        res.status(200).json(task);
    } catch (error) {
        if (error.kind === 'ObjectId') return res.status(404).json({ error: 'Task not found' });
        res.status(500).json({ error: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        if (error.kind === 'ObjectId') return res.status(404).json({ error: 'Task not found' });
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createTask, getAllTasks, getTaskById, updateTask, deleteTask };
