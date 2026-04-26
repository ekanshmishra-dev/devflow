const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';

/**
 * Core helper to make a fetch call to Anthropic and parse the resulting JSON cleanly.
 */
const callAnthropicAPI = async (prompt) => {
    if (!ANTHROPIC_API_KEY) {
        throw new Error("ANTHROPIC_API_KEY is not defined in the environment variables.");
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: MODEL,
                max_tokens: 1500,
                messages: [
                    { role: 'user', content: prompt }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Anthropic API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const textResponse = data.content?.[0]?.text;

        if (!textResponse) {
            throw new Error('Received empty text from Anthropic API');
        }

        // Try to parse the response safely: Claude sometimes wraps JSON block in markdown
        const jsonMatch = textResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
        const jsonString = jsonMatch ? jsonMatch[1].trim() : textResponse.trim();

        try {
            return JSON.parse(jsonString);
        } catch (parseError) {
            console.error('Failed to parse AI JSON:', jsonString);
            throw new Error('Failed to parse AI response as JSON');
        }
    } catch (error) {
        console.error('Error invoking Anthropic AI:', error);
        throw error;
    }
};

const generateSubtasks = async (taskDescription) => {
    const prompt = `You are a strict task breakdown assistant system. Process the following task description and generate 3 to 5 logical subtasks.
You MUST reply ONLY with a valid JSON array, without any conversational text before or after.
Each object in the array must exactly have:
- "title": a short string describing the subtask
- "description": a string with more details about how to complete it

Task Description:
${taskDescription}`;

    return await callAnthropicAPI(prompt);
};

const analyzeCode = async (code, language) => {
    const prompt = `You are a strict code review system. Analyze the following ${language} code.
You MUST reply ONLY with valid JSON, without any conversational text before or after.
The JSON object must exactly have:
- "quality_score": an integer from 1 to 10 evaluating the overall quality
- "issues": an array of strings listing bugs, anti-patterns, or architectural flaws
- "suggestions": an array of strings listing improvements

Code to analyze:
\`\`\`${language}
${code}
\`\`\``;

    return await callAnthropicAPI(prompt);
};

const suggestPriority = async (title, description, projectContext) => {
    const prompt = `You are a strict AI technical project manager system. Calculate the priority of the given task in the provided project context.
You MUST reply ONLY with valid JSON, without any conversational text before or after.
The JSON object must exactly have:
- "priority": exactly one of the strings "low", "medium", "high", or "critical"
- "estimatedHours": a number estimating how long the task will take
- "reasoning": a brief string explaining your logic

Task Title: ${title}
Task Description: ${description}
Project Context: ${projectContext}`;

    return await callAnthropicAPI(prompt);
};

const parseMeetingNotes = async (notes) => {
    const prompt = `You are a strict action-item extraction AI. Extract all tasks and action items from the provided meeting notes.
You MUST reply ONLY with a valid JSON array, without any conversational text before or after.
Each object in the array must exactly have:
- "title": a string describing the extracted task
- "assignee": a string name of the person responsible, or null if no one is explicitly assigned
- "dueDate": a string in "YYYY-MM-DD" format if a deadline is mentioned, or null

Meeting Notes:
${notes}`;

    return await callAnthropicAPI(prompt);
};

module.exports = {
    generateSubtasks,
    analyzeCode,
    suggestPriority,
    parseMeetingNotes
};
