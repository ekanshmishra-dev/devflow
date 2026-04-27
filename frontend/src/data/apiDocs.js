export const apiDocs = [
  {
    group: "Authentication",
    id: "auth",
    endpoints: [
      {
        id: "register",
        title: "Register New User",
        method: "POST",
        path: "/api/auth/register",
        description: "Creates a new user account and returns a JWT token for authentication.",
        authRequired: false,
        body: `{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "strongpassword123"
}`,
        response: `{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5...",
  "user": {
    "id": "60d5ec49c...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "user"
  }
}`,
        curl: `curl -X POST http://localhost:5000/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Jane Doe", "email": "jane@example.com", "password": "strongpassword123"}'`
      },
      {
        id: "login",
        title: "Login",
        method: "POST",
        path: "/api/auth/login",
        description: "Authenticates an existing user and returns a JWT token.",
        authRequired: false,
        body: `{
  "email": "jane@example.com",
  "password": "strongpassword123"
}`,
        response: `{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5...",
  "user": {
    "id": "60d5ec49c...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "user"
  }
}`,
        curl: `curl -X POST http://localhost:5000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email": "jane@example.com", "password": "strongpassword123"}'`
      },
      {
        id: "get-me",
        title: "Get Current User",
        method: "GET",
        path: "/api/auth/me",
        description: "Retrieves the profile of the currently authenticated user based on the provided JWT token.",
        authRequired: true,
        response: `{
  "success": true,
  "data": {
    "id": "60d5ec49c...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "user",
    "createdAt": "2026-04-27T10:00:00.000Z"
  }
}`,
        curl: `curl -X GET http://localhost:5000/api/auth/me \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`
      }
    ]
  },
  {
    group: "Projects",
    id: "projects",
    endpoints: [
      {
        id: "get-all-projects",
        title: "Get All Projects",
        method: "GET",
        path: "/api/projects",
        description: "Retrieves a list of all projects associated with the authenticated user.",
        authRequired: true,
        response: `{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "60d5...",
      "name": "Website Redesign",
      "description": "Modernizing the corporate website",
      "status": "active"
    }
  ]
}`,
        curl: `curl -X GET http://localhost:5000/api/projects \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`
      },
      {
        id: "create-project",
        title: "Create Project",
        method: "POST",
        path: "/api/projects",
        description: "Creates a new project workspace.",
        authRequired: true,
        body: `{
  "name": "Website Redesign",
  "description": "Modernizing the corporate website",
  "status": "planning"
}`,
        response: `{
  "success": true,
  "data": {
    "id": "60d5...",
    "name": "Website Redesign",
    "status": "planning"
  }
}`,
        curl: `curl -X POST http://localhost:5000/api/projects \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Website Redesign"}'`
      }
    ]
  },
  {
    group: "Tasks",
    id: "tasks",
    endpoints: [
      {
        id: "get-all-tasks",
        title: "Get All Tasks",
        method: "GET",
        path: "/api/tasks",
        description: "Retrieves all tasks for the user. Can be filtered via query parameters.",
        authRequired: true,
        response: `{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "60d5...",
      "title": "Implement JWT Auth",
      "priority": "high",
      "status": "in-progress"
    }
  ]
}`,
        curl: `curl -X GET http://localhost:5000/api/tasks \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`
      },
      {
        id: "create-task",
        title: "Create Task",
        method: "POST",
        path: "/api/tasks",
        description: "Creates a new task within an optional project.",
        authRequired: true,
        body: `{
  "title": "Implement JWT Auth",
  "description": "Set up passport.js and JWT middleware",
  "project": "60d5...",
  "priority": "high",
  "status": "todo"
}`,
        response: `{
  "success": true,
  "data": {
    "id": "60d5...",
    "title": "Implement JWT Auth",
    "priority": "high",
    "status": "todo"
  }
}`,
        curl: `curl -X POST http://localhost:5000/api/tasks \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"title": "Implement JWT Auth", "priority": "high"}'`
      }
    ]
  },
  {
    group: "AI Features",
    id: "ai",
    isAi: true,
    endpoints: [
      {
        id: "generate-subtasks",
        title: "Generate Subtasks",
        method: "POST",
        path: "/api/ai/tasks/:taskId/generate-subtasks",
        description: "Uses Claude AI to intelligently break down a parent task into 3-5 smaller, actionable subtasks based on its description.",
        useCase: "When a developer creates a massive 'Epic' ticket like 'Migrate to AWS', this endpoint will instantly generate the step-by-step checklist required to accomplish it.",
        authRequired: true,
        response: `{
  "success": true,
  "message": "Subtasks generated successfully",
  "data": [
    {
      "title": "Provision RDS PostgreSQL instance",
      "priority": "high"
    },
    {
      "title": "Setup VPC and Security Groups",
      "priority": "critical"
    }
  ]
}`,
        curl: `curl -X POST http://localhost:5000/api/ai/tasks/60d5.../generate-subtasks \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`
      },
      {
        id: "analyze-code",
        title: "Analyze Code",
        method: "POST",
        path: "/api/ai/code/analyze",
        description: "Submit a code snippet. Claude AI acts as a senior engineer, providing a quality score out of 10, highlighting issues, and suggesting best practices.",
        useCase: "Developers can paste a confusing function before opening a Pull Request to get instant feedback and catch obvious bugs.",
        authRequired: true,
        body: `{
  "language": "javascript",
  "code": "function add(a,b) { return a+b }"
}`,
        response: `{
  "success": true,
  "data": {
    "score": 8,
    "issues": [],
    "suggestions": [
      "Add input validation to ensure a and b are numbers",
      "Add JSDoc type definitions"
    ]
  }
}`,
        curl: `curl -X POST http://localhost:5000/api/ai/code/analyze \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"language": "javascript", "code": "function add(a,b) { return a+b }"}'`
      },
      {
        id: "suggest-priority",
        title: "Suggest Priority",
        method: "POST",
        path: "/api/ai/tasks/:taskId/suggest-priority",
        description: "Analyzes a task's title and description to predict its urgency level (low, medium, high, critical) and estimate the hours required.",
        useCase: "During Sprint Planning, instead of debating story points, the AI reads the task context and provides a baseline estimate with logical reasoning.",
        authRequired: true,
        response: `{
  "success": true,
  "data": {
    "priority": "critical",
    "estimatedHours": 8,
    "reasoning": "This task involves production database changes which inherently carry high risk and require careful migration planning."
  }
}`,
        curl: `curl -X POST http://localhost:5000/api/ai/tasks/60d5.../suggest-priority \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`
      },
      {
        id: "parse-notes",
        title: "Parse Meeting Notes",
        method: "POST",
        path: "/api/ai/meeting-notes/parse",
        description: "Submit a raw, unstructured blob of text (like a Zoom transcript). The AI will extract all action items and format them as tasks.",
        useCase: "Project Managers can copy-paste the entire 30-minute daily standup transcript, and DevFlow will automatically create the Jira tickets for the team.",
        authRequired: true,
        body: `{
  "projectId": "60d5...",
  "notes": "John said he will deploy the frontend by tomorrow. Sarah needs to fix the caching bug."
}`,
        response: `{
  "success": true,
  "extractedTasksCount": 2,
  "data": [
    {
      "title": "Deploy the frontend",
      "dueDate": "2026-04-28"
    },
    {
      "title": "Fix the caching bug",
      "dueDate": null
    }
  ]
}`,
        curl: `curl -X POST http://localhost:5000/api/ai/meeting-notes/parse \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"notes": "John will deploy frontend by tomorrow"}'`
      },
      {
        id: "smart-search",
        title: "Smart Search",
        method: "GET",
        path: "/api/ai/search",
        description: "A semantic search endpoint that allows users to find tasks using conversational natural language.",
        useCase: "Instead of clicking through complex filter dropdowns, simply type 'show me high priority backend tasks that are stuck'.",
        authRequired: true,
        response: `{
  "success": true,
  "data": [
    {
      "id": "60d5...",
      "title": "Fix DB connection pool leak",
      "priority": "critical",
      "status": "in-progress"
    }
  ]
}`,
        curl: `curl -G "http://localhost:5000/api/ai/search" \\
  --data-urlencode "query=high priority backend tasks" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`
      }
    ]
  }
];
