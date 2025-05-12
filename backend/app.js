require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect db
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));

module.exports = app;