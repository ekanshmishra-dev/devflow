const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const callGemini = async (prompt) => {
  const result = await model.generateContent(prompt);
  return result.response.text();
};

exports.generateSubtasks = async (taskTitle, taskDescription) => {
  const prompt = `Given this task:
Title: "${taskTitle}"
Description: "${taskDescription}"

Generate 3-5 subtasks. Return ONLY valid JSON array, no markdown:
[{"title": "subtask title", "description": "what to do"}]`;

  const response = await callGemini(prompt);
  const clean = response.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
};

exports.analyzeCode = async (code, language) => {
  const prompt = `Review this ${language} code:
\`\`\`${language}
${code}
\`\`\`
Return ONLY valid JSON, no markdown:
{"quality_score": 7, "issues": ["issue1"], "suggestions": ["suggestion1"], "summary": "overall assessment"}`;

  const response = await callGemini(prompt);
  const clean = response.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
};

exports.suggestPriority = async (taskTitle, taskDescription, projectContext) => {
  const prompt = `Analyze this task:
Title: "${taskTitle}"
Description: "${taskDescription}"
Project: "${projectContext}"

Return ONLY valid JSON, no markdown:
{"priority": "high", "estimatedHours": 4, "reasoning": "explanation"}`;

  const response = await callGemini(prompt);
  const clean = response.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
};

exports.parseMeetingNotes = async (meetingNotes) => {
  const prompt = `Extract action items from these meeting notes:
"${meetingNotes}"

Return ONLY valid JSON array, no markdown:
[{"title": "task title", "description": "details", "assignee": "name or null", "dueDate": "YYYY-MM-DD or null"}]`;

  const response = await callGemini(prompt);
  const clean = response.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
};

exports.naturalLanguageSearch = async (naturalQuery) => {
  const prompt = `Convert this to MongoDB query for task management:
"${naturalQuery}"
Fields: title, status(todo/in-progress/review/done), priority(low/medium/high/critical), tags

Return ONLY valid JSON MongoDB query, no markdown:
{"status": "in-progress"}`;

  const response = await callGemini(prompt);
  const clean = response.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
};
