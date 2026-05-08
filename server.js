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
    res.json({
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
    });
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
