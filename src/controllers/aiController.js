const Task = require('../models/Task');
const {
    generateSubtasks: aiGenerateSubtasks,
    analyzeCode: aiAnalyzeCode,
    suggestPriority: aiSuggestPriority,
    parseMeetingNotes: aiParseMeetingNotes
} = require('../utils/aiHelper');

const generateSubtasks = async (req, res, next) => {
    try {
        const { taskId } = req.params;
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const taskDescription = task.description || task.title;
        const subtaskList = await aiGenerateSubtasks(taskDescription);

        // Save subtasks to MongoDB as individual tasks
        const createdTasks = await Promise.all(
            subtaskList.map(async (sub) => {
                return await Task.create({
                    title: sub.title,
                    description: sub.description,
                    aiGenerated: true,
                    createdBy: req.user._id,
                    project: task.project // Inherit parent task's project
                });
            })
        );

        req.app.get('io').emit('ai:subtasks-ready', { taskId: task._id, subtasks: createdTasks });

        res.status(201).json(createdTasks);
    } catch (error) {
        next(error); // Pass to global error handler
    }
};

const analyzeCode = async (req, res, next) => {
    try {
        const { code, language } = req.body;
        if (!code || !language) {
            return res.status(400).json({ error: 'Please provide code and language in request body' });
        }

        const analysis = await aiAnalyzeCode(code, language);
        res.status(200).json(analysis);
    } catch (error) {
        next(error);
    }
};

const suggestPriority = async (req, res, next) => {
    try {
        const { taskId } = req.params;
        const task = await Task.findById(taskId).populate('project');

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const projectContext = task.project ? task.project.description : 'No explicit project context available.';
        const suggestion = await aiSuggestPriority(task.title, task.description || '', projectContext);

        // Save AI suggestions physically onto the Task document
        task.aiSuggestions = suggestion;
        await task.save();

        res.status(200).json({
            message: 'Priority suggested and saved successfully',
            suggestion: suggestion
        });
    } catch (error) {
        next(error);
    }
};

const parseMeetingNotes = async (req, res, next) => {
    try {
        const { notes } = req.body;
        if (!notes) {
            return res.status(400).json({ error: 'Please provide meeting notes' });
        }

        const aiTasks = await aiParseMeetingNotes(notes);

        // Convert pure JSON responses to actionable MongoDB Tasks
        const createdTasks = await Promise.all(
            aiTasks.map(async (parsedData) => {
                let parsedDueDate = null;
                // Basic check for valid date parsing so it doesn't crash MongoDB
                if (parsedData.dueDate && !isNaN(Date.parse(parsedData.dueDate))) {
                    parsedDueDate = new Date(parsedData.dueDate);
                }

                return await Task.create({
                    title: parsedData.title,
                    dueDate: parsedDueDate,
                    aiGenerated: true,
                    createdBy: req.user._id,
                });
            })
        );

        res.status(201).json({
            message: 'Tasks parsed from notes effectively',
            extractedTasksCount: createdTasks.length,
            tasks: createdTasks
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    generateSubtasks,
    analyzeCode,
    suggestPriority,
    parseMeetingNotes
};
