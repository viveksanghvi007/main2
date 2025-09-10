// server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';  // ← use named import here
import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4001;

// Middleware to handle CORS
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Connect Database
connectDB();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Increase timeout for AI operations
app.use('/api/resume/analyze', (req, res, next) => {
  req.setTimeout(120000); // 2 minutes for AI analysis
  res.setTimeout(120000);
  next();
});

app.use('/api/resume/analyze-upload', (req, res, next) => {
  req.setTimeout(120000); // 2 minutes for AI analysis with file upload
  res.setTimeout(120000);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
 
// Server uploads folder
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, _path) => {
      res.set('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:5173');
    },
  })
);

// ✅ API Root Route
app.get('/', (req, res) => {
  res.json({ 
    message: 'ResumeXpert API is working!',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test validation endpoint
app.post('/test-validation', (req, res) => {
  console.log('🧪 Test validation endpoint called');
  console.log('Request body:', req.body);
  res.json({ 
    message: 'Test endpoint working',
    receivedData: req.body
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📧 Email service: ${process.env.EMAIL_USER ? 'Configured' : 'Not configured'}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log(`\n⚠️  EMAIL CONFIGURATION REQUIRED:`);
    console.log(`   1. Create .env file in backend folder`);
    console.log(`   2. Add your Gmail credentials:`);
    console.log(`      EMAIL_USER=your-email@gmail.com`);
    console.log(`      EMAIL_PASSWORD=your-app-password`);
    console.log(`   3. For now, OTP will be logged to console\n`);
  }
});
