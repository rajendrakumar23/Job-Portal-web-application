
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './utils/db.js';

import authRoutes from './routes/auth.routes.js';
import jobRoutes from './routes/job.routes.js';
import applicationRoutes from './routes/application.routes.js';
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';
import aiRoutes from './routes/ai.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173',
  "https://your-netlify-url.netlify.app",
  ],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Job Portal API Running',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(
    'OPENROUTER:',
    process.env.OPENROUTER_API_KEY
  );
});