const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { createTask, getAllTasks, getTaskById, updateTask, deleteTask } = require('../controllers/taskController');
const auth = require('../middleware/auth');

// Protect all task routes with JWT auth middleware
router.use(auth);

router.route('/')
    .get(getAllTasks)
    .post([
        check('title', 'Title is required').not().isEmpty()
    ], createTask);

router.route('/:id')
    .get(getTaskById)
    .put(updateTask)
    .delete(deleteTask);

module.exports = router;
