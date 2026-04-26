# 🚀 AI-Enhanced Task Management API

A robust, enterprise-grade RESTful API backend that fuses solid task management mechanics with cutting-edge AI integrations. Designed specifically to offload manual project management by autonomously breaking down, prioritizing, and generating tasks using Anthropic's Claude AI.

## ✨ Features
- **Secure Authentication:** JWT-based stateless user authentication alongside `bcrypt` salted passwords.
- **Real-Time Synergy:** Full Socket.io integration actively broadcasting status changes and AI task generation completion instantly.
- **RESTful CRUD Operations:** Comprehensive endpoints filtering tasks by project, priority, and completion status.
- **Intelligent Subtask Generation:** AI actively reads your high-level objective and generates highly specific subtasks.
- **Automated Priority Processing:** Using context arrays, the API intelligently negotiates priority levels and time estimates.
- **Meeting Notes Parsing:** Paste entire rough meeting transcripts, and the system gracefully extracts due dates, titles, and assigns tasks out as actual database objects.
- **Enterprise Middleware:** Protected from DDos via `express-rate-limit`, validated via `express-validator`, and strictly handled using a centralized global `AppError` class guarding Mongoose schema faults.

## 🛠 Tech Stack
| Technology | Why it was chosen |
|------------|--------------------|
| **Node.js + Express** | High concurrency and asynchronous handling capabilities. Perfect for a fast REST API. |
| **MongoDB + Mongoose** | Flexible, document-oriented schema handling natively mapping to Javascript objects. |
| **Anthropic Claude AI** | Superior at strict context following for zero-shot text extraction (e.g., JSON string generation). |
| **Socket.io** | Bidirectional real-time event streaming allowing instant Web UI dashboard synchronization. |
| **JWT & Bcrypt** | Industry-standard architecture enforcing stateless security tokens and unbreakable password hashing. |

## 🏗 Architecture
The backend strictly enforces an **API-First MVC (Model-View-Controller)** pattern.
- **Models**: Defines database schema strictly via Mongoose.
- **Controllers**: Responsible for parsing requests, triggering database logic, and firing HTTP responses.
- **Routes**: Secure entry points matching HTTP methods, bound securely utilizing JWT auth middleware.
- **Helpers**: Deep business logic decoupled entirely from standard controllers.

### 🧠 AI as a Utility Layer
We treated the AI explicitly as an external "dumb" extraction engine. The `aiHelper.js` utility layer holds absolutely zero awareness of HTTP requests or MongoDB persistence layers. It exists only to receive plaintext context, heavily enforce structure using strict Prompt Engineering, process via Claude's logic matrix, and return robustly sanitized JSON arrays. The core `aiController.js` handles the actual MongoDB validation keeping our persistent architecture immune to LLM hallucination issues.

## ⚙️ Setup Instructions

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/ai-task-manager.git
cd ai-task-manager
npm install
```

### 2. Environment Setup
Create a `.env` file systematically in the root directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai_task_management
JWT_SECRET=supersecure_secret_key_change_me
ANTHROPIC_API_KEY=your_claude_api_key_here
```

### 3. Run Application
```bash
node server.js
```

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user account |
| POST | `/api/auth/login` | Authenticate and retrieve Bearer JWT token |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Fetch all tasks (supports query filters) |
| POST | `/api/tasks` | Create standard task |
| PUT | `/api/tasks/:id` | Modify existing task |
| DELETE | `/api/tasks/:id` | Remove task entirely |

### AI Integrations
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/code/analyze` | Generates a detailed 1-10 code inspection object |
| POST | `/api/ai/meeting-notes/parse` | Scans string blob for specific DB-level tasks |
| POST | `/api/ai/tasks/:taskId/generate-subtasks` | AI auto-creates 3-5 subtasks attached to parent |
| POST | `/api/ai/tasks/:taskId/suggest-priority` | Generates intelligence scoring replacing manual effort |

## 🔎 Example AI Call Flow

**1. POST Request:** `/api/ai/meeting-notes/parse`
```json
// Request Body
{
  "notes": "Jane needs to launch the marketing campaign by 2026-05-10."
}
```

**2. How the AI Pipeline Works:**
```text
[Client App] 
    │ (Sends Notes param)
    ▼
[Express Router (ai.js)] → Validates JWT Token -> Forwards to Controller
    │
[AI Controller] → Extracts req.body.notes
    │ (Hands string blindly to isolated AI Helper)
    ▼
[AI Helper (aiHelper.js)] → Applies Strict Prompts & Native Fetch -> Claude API
    │ (Returns cleaned JSON Object[] through error handlers)
    ▼
[AI Controller] 
    │ (Iterates through JSON safely mapping into Mongoose Task.create())
    ▼
[MongoDB Database] // Permanently created the mapped task
    │ (Simultaneously emits 'task:created' via req.app.get('io') to WebSockets)
    ▼ 
[Client App] ← Returns HTTP 201 Created Array confirmation
```

**3. Standard Array Response:**
```json
{
  "message": "Tasks parsed from notes effectively",
  "extractedTasksCount": 1,
  "tasks": [
    {
      "title": "launch the marketing campaign",
      "dueDate": "2026-05-10T00:00:00.000Z",
      "aiGenerated": true,
      "createdBy": "65e2..."
    }
  ]
}
```
