const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
    getProjects, getProject,
    createProject, updateProject, deleteProject
} = require('../controllers/projectController');

router.route('/')
    .get(auth, getProjects)
    .post(auth, createProject);

router.route('/:id')
    .get(auth, getProject)
    .put(auth, updateProject)
    .delete(auth, deleteProject);

module.exports = router;