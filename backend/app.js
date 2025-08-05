import 'dotenv/config.js';
import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';

const app = express();

// Start CORS
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'], 
    credentials: true // If need send cookies/head of verification
  }));

// Connect db
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/auth', rateLimit({ windowMs: 10 * 60 * 1000, max: 100 }));

export default app;