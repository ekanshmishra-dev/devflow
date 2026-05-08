require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
const connectDB = require('./src/config/db');
const { apiLimiter, aiLimiter } = require('./src/middleware/rateLimiter');
const { errorHandler } = require('./src/utils/errorHandler');

// Connect to database
connectDB();

const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Expose io object to all express requests like req.app.get('io')
app.set('io', io);

// Socket.io Authentication Middleware
io.use((socket, next) => {
    const token = socket.handshake.auth && socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error: No token provided'));

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return next(new Error('Authentication error: Invalid format or expired'));
        socket.user = decoded; // store verified user ID payload safely onto the socket instance
        next();
    });
});

io.on('connection', (socket) => {
    console.log(`User connected via Socket.io: ${socket.user.id}`);

    socket.on('disconnect', () => {
        console.log(`User disconnected via Socket.io: ${socket.user.id}`);
    });
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiters
app.use('/api', apiLimiter);
app.use('/api/ai', aiLimiter);

// Basic route
app.get('/', (req, res) => {
    const statusData = {
        status: 'healthy',
        service: 'DevFlow API',
        version: '1.0.0',
        uptime: process.uptime(),
        endpoints: {
            auth: '/api/auth',
            projects: '/api/projects',
            tasks: '/api/tasks',
            ai: '/api/ai'
        },
        timestamp: new Date().toISOString()
    };

    const jsonStr = JSON.stringify(statusData, null, 2);

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>DevFlow API Status</title>
            <style>
                body {
                    background: radial-gradient(circle at top left, #1e293b, #0f172a);
                    color: #e2e8f0;
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    margin: 0;
                }
                .container {
                    background: rgba(30, 41, 59, 0.5);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 1rem;
                    padding: 2rem;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    max-width: 600px;
                    width: 90%;
                }
                h1 {
                    font-size: 1.5rem;
                    margin-bottom: 1rem;
                    color: #38bdf8;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                h1::before {
                    content: '';
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    background: #10b981;
                    border-radius: 50%;
                    box-shadow: 0 0 10px #10b981;
                }
                pre {
                    background: #0b1329;
                    padding: 1.5rem;
                    border-radius: 0.75rem;
                    border: 1px solid #1e293b;
                    overflow-x: auto;
                    color: #a7f3d0;
                    font-family: 'Fira Code', 'Courier New', monospace;
                    font-size: 0.9rem;
                    line-height: 1.5;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>DevFlow API Status</h1>
                <pre>${jsonStr}</pre>
            </div>
        </body>
        </html>
    `);
});

// App Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/projects', require('./src/routes/projects'));
app.use('/api/tasks', require('./src/routes/tasks'));
app.use('/api/ai', require('./src/routes/ai'));

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
