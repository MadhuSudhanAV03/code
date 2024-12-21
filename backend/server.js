const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const doctorRoutes = require('./routes/doctors');
const emergencyRoutes = require('./routes/emergency');
const userRoutes = require('./routes/auth');

const app = express();

// Configuration
const config = {
    mongoURI: 'mongodb://127.0.0.1:27017/wieproject',
    jwtSecret: 'your-secure-jwt-secret-key-here',
    port: 5000
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database connection
mongoose.connect(config.mongoURI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Make config available throughout the app
app.locals.config = config;

// Routes
app.use('/api', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});