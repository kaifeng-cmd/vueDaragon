require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

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
app.use('/api/auth', require('./routes/auth'));
app.use('/api/auth', rateLimit({ windowMs: 10 * 60 * 1000, max: 100 }));

module.exports = app;