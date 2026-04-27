<div align="center">

# 🌊 DevFlow AI

**The intelligent backend that doesn't just manage your tasks—it understands them.**

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![AI Powered](https://img.shields.io/badge/AI_Powered-Anthropic_Claude-8A2BE2?style=for-the-badge&logo=anthropic&logoColor=white)](https://www.anthropic.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

</div>

---

## 🌟 Hero Section

**DevFlow AI** is a next-generation RESTful API that fuses robust task management mechanics with cutting-edge Large Language Model capabilities. Built specifically to offload manual project management, DevFlow uses Anthropic's Claude AI to autonomously break down goals, predict priorities, parse messy meeting notes, and even review your code.

**Perfect for:**
- 🚀 **Agile Teams** tired of manually grooming backlogs.
- 👨‍💻 **Developers** who want instant code quality checks tied to their tasks.
- 👔 **Project Managers** who want to turn unstructured meeting transcripts into actionable Jira-style boards instantly.

---

## 📋 Table of Contents
1. [Overview](#-overview)
2. [Key Features](#-key-features)
3. [Tech Stack](#-tech-stack)
4. [AI Features Showcase](#-ai-features-showcase)
5. [Installation Guide](#-installation-guide)
6. [Environment Variables](#-environment-variables)
7. [API Endpoints](#-api-endpoints)
8. [Usage Examples](#-usage-examples)
9. [Project Structure](#-project-structure)
10. [Testing](#-testing)
11. [Roadmap](#-future-enhancements)
12. [Contributing](#-contributing)
13. [License & Author](#-author--license)

---

## 🎯 Overview

### What is DevFlow?
DevFlow is an enterprise-grade backend API that serves as the brain for an intelligent task management system. It provides all standard CRUD operations for Users, Projects, and Tasks, but supercharges them with an AI utility layer.

### Why it's different
Unlike traditional issue trackers (Jira, Trello) where you input data manually, DevFlow acts as an active assistant. You provide raw context—like a copy-pasted Zoom transcript or a vague feature request—and DevFlow intelligently processes it into structured database entities.

### Use Cases
- **Sprint Planning**: Paste the raw sprint goals; get 20 generated, prioritized subtasks.
- **Code Reviews**: Developers paste snippets; the AI returns a quality score and attaches it to the ticket.
- **Natural Language Querying**: "Find all high-priority tasks I created yesterday."

---

## ⚡ Key Features

### 🏢 Core Functionality
- **Secure Authentication:** JWT-based stateless auth with `bcrypt` salted passwords.
- **RESTful Architecture:** Clean, standardized CRUD operations for `Projects` and `Tasks`.
- **Enterprise Security:** DDOS protection via `express-rate-limit` and robust input validation via `express-validator`.
- **Global Error Handling:** Centralized custom `AppError` handling Mongoose validation and operational faults gracefully.

### 🧠 AI Capabilities (The Brain)
- **Subtask Generation:** Break down complex epics into actionable checklists.
- **Smart Code Review:** Automated AST-like inspection and scoring of raw code.
- **Priority Predictor:** Intelligent urgency mapping based on task descriptions.
- **Meeting Notes Parser:** Zero-shot text extraction converting human conversation to DB records.
- **Semantic Search:** Query your database using plain English.

---

## 🛠 Tech Stack

| Domain | Technology | Reason |
|--------|------------|--------|
| **Framework** | Node.js + Express | High concurrency, asynchronous architecture, perfect for REST APIs. |
| **Database** | MongoDB + Mongoose | Flexible NoSQL schema mapping natively to JSON arrays. |
| **AI Engine** | Anthropic Claude API | Superior context window and strict adherence to JSON output schemas. |
| **Security** | JWT, Bcrypt, Rate Limit | Industry-standard protection against unauthorized access and brute force. |

---

## 🤖 AI Features Showcase

### 1. Smart Subtask Generator
Automatically splits a vague high-level task into 3-5 concrete, actionable steps.
```json
// POST /api/ai/tasks/:taskId/generate-subtasks
{
  "subtasks": [
    { "title": "Setup JWT middleware", "priority": "high" },
    { "title": "Create User schema in Mongoose", "priority": "critical" },
    { "title": "Write unit tests for auth routes", "priority": "medium" }
  ]
}
```

### 2. Code Review Bot
Paste raw code and specify the language. The AI acts as a senior developer, providing a score, catching bugs, and suggesting best practices.
```json
// POST /api/ai/code/analyze
{
  "score": 6,
  "issues": ["Missing error handling in catch block", "Use const instead of let"],
  "suggestions": ["Wrap the async call in a try/catch", "Add JSDoc comments"],
  "bestPractices": ["Excellent variable naming conventions"]
}
```

### 3. Priority Predictor
Struggling to prioritize? The AI reads the task description and assigns an urgency level and estimated time to complete.
```json
// POST /api/ai/tasks/:taskId/suggest-priority
{
  "priority": "critical",
  "estimatedHours": 4,
  "reasoning": "This task blocks the production deployment pipeline."
}
```

### 4. Meeting Notes Parser
Paste a messy 10-minute Zoom transcript. The AI extracts the action items and seamlessly saves them as real tasks in your database.
```json
// POST /api/ai/meeting-notes/parse
{
  "extractedTasksCount": 2,
  "tasks": [
    { "title": "Fix the CORS issue on production", "dueDate": "2026-04-28" },
    { "title": "Email the client the new Figma mockups", "dueDate": "2026-04-30" }
  ]
}
```

### 5. Natural Language Search
Search your database the way you speak.
```json
// GET /api/ai/search?query=show me unfinished critical tasks
{
  "results": [
    { "title": "Database Migration", "status": "in-progress", "priority": "critical" }
  ]
}
```

---

## 🚀 Installation Guide

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- An Anthropic API Key (for Claude AI)

### Step-by-step Setup
```bash
# 1. Clone the repository
git clone https://github.com/ekanshmishra-dev/devflow.git
cd devflow

# 2. Install backend dependencies
npm install

# 3. Create your environment file
cp .env.example .env

# 4. Start the development server
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory. Use this template:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/devflow_db

# Security
JWT_SECRET=your_super_secret_jwt_signature_key_here
JWT_EXPIRES_IN=30d

# Artificial Intelligence
ANTHROPIC_API_KEY=sk-ant-api03-... # Your Claude API Key
```

---

## 📡 API Endpoints

### 👤 Auth
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Create a new user account | No |
| POST | `/api/auth/login` | Authenticate & get JWT token | No |
| GET | `/api/auth/me` | Get current user profile | Yes |

### 📁 Projects
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/projects` | Get all user projects | Yes |
| POST | `/api/projects` | Create a new project | Yes |

### 📝 Tasks
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tasks` | Get all tasks (supports filtering) | Yes |
| POST | `/api/tasks` | Create a new task | Yes |
| PUT | `/api/tasks/:id` | Update task status/details | Yes |

### ✨ AI Integration (The Magic)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/ai/tasks/:taskId/generate-subtasks` | Auto-generate subtasks | Yes |
| POST | `/api/ai/code/analyze` | AI code inspection & scoring | Yes |
| POST | `/api/ai/tasks/:taskId/suggest-priority` | AI priority & time estimation | Yes |
| POST | `/api/ai/meeting-notes/parse` | Extract tasks from transcript | Yes |
| GET | `/api/ai/search` | Semantic natural language search | Yes |

---

## 💻 Usage Examples

### 1. Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Doe", "email": "jane@example.com", "password": "password123"}'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "jane@example.com", "password": "password123"}'
# Returns: { "token": "eyJhbGciOiJIUzI1..." }
```

### 3. Generate AI Subtasks
```bash
curl -X POST http://localhost:5000/api/ai/tasks/60d5ec49c/generate-subtasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📁 Project Structure

```text
devflow/
├── frontend/                # React Vite Dashboard (Optional UI)
├── src/
│   ├── config/              # Database connection & env validation
│   ├── controllers/         # Route logic and HTTP responses
│   ├── middleware/          # JWT Auth, Rate limiting, Error catching
│   ├── models/              # Mongoose DB Schemas (User, Project, Task)
│   ├── routes/              # Express Router definitions
│   └── utils/               # AI Helpers, Claude Prompts, Error Classes
├── .env                     # Environment variables (Ignored in Git)
├── .gitignore               # Git ignore rules
├── package.json             # Node dependencies and scripts
├── server.js                # Express App entry point
└── README.md                # You are here!
```

---

## 🧪 Testing

We recommend using **Postman** or **Thunder Client** (VS Code) to test the API endpoints. 
1. Create a User.
2. Grab the JWT token from the login response.
3. Add it to your request headers: `Authorization: Bearer <token>`.
4. Fire away at the `/api/ai/*` routes!

*(Note: Automated unit tests via Jest/Mocha are planned for v2.0)*

---

## 🗺 Future Enhancements
- [ ] **Real-time WebSockets (Socket.io):** Broadcast AI generation completion events to the frontend instantly.
- [ ] **GitHub Integration:** Automatically create PR comments based on the Code Review Bot.
- [ ] **Slack/Discord Bot:** Parse meeting notes directly from a Discord voice channel or Slack thread.
- [ ] **Role-Based Access Control (RBAC):** Admin, Manager, and Contributor roles for enterprise teams.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## ✍️ Author & License

**Built with ❤️ by Ekansh Mishra**
- GitHub: [@ekanshmishra-dev](https://github.com/ekanshmishra-dev)
- Email: ekansh.mishra.dev@gmail.com

Distributed under the **MIT License**. See `LICENSE` for more information.
