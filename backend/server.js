const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { initializeDatabase } = require('./src/shared/database');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.openai.com"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, /\.onrender\.com$/]
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize database on startup
initializeDatabase().catch(console.error);

// Import routes
const profileRoutes = require('./src/routes/profile');
const goalsRoutes = require('./src/routes/goals');
const habitsRoutes = require('./src/routes/habits');
const tasksRoutes = require('./src/routes/tasks');
const aiRoutes = require('./src/routes/ai');
const stressRoutes = require('./src/routes/stress');
const focusRoutes = require('./src/routes/focus');
const expensesRoutes = require('./src/routes/expenses');
const hobbiesRoutes = require('./src/routes/hobbies');
const reflectionsRoutes = require('./src/routes/reflections');
const careerRoutes = require('./src/routes/career');
const uploadRoutes = require('./src/routes/upload');

// Use routes
app.use('/api/profile', profileRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/habits', habitsRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/stress', stressRoutes);
app.use('/api/focus', focusRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/hobbies', hobbiesRoutes);
app.use('/api/reflections', reflectionsRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'nomore API Server',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      profile: '/api/profile',
      goals: '/api/goals',
      habits: '/api/habits',
      tasks: '/api/tasks',
      ai: '/api/ai',
      stress: '/api/stress',
      focus: '/api/focus',
      expenses: '/api/expenses',
      hobbies: '/api/hobbies',
      reflections: '/api/reflections',
      career: '/api/career'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 nomore API Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});