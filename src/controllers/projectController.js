const Project = require('../models/Project');

exports.getProjects = async (req, res, next) => {
    try {
        const projects = await Project.find().populate('createdBy', 'name email').sort('-createdAt');
        res.status(200).json({ success: true, count: projects.length, data: projects });
    } catch (error) { next(error); }
};

exports.getProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id).populate('createdBy', 'name email');
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
        res.status(200).json({ success: true, data: project });
    } catch (error) { next(error); }
};

exports.createProject = async (req, res, next) => {
    try {
        req.body.createdBy = req.user.id;
        const project = await Project.create(req.body);
        res.status(201).json({ success: true, data: project });
    } catch (error) { next(error); }
};

exports.updateProject = async (req, res, next) => {
    try {
        let project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
        project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, data: project });
    } catch (error) { next(error); }
};

exports.deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
        await project.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (error) { next(error); }
};