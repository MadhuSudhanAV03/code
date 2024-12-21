const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const router = express.Router();

// Middleware for authentication
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, req.app.locals.config.jwtSecret);
        const user = await User.findById(decoded.id);
        
        if (!user) throw new Error();
        
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Please authenticate' });
    }
};

// // Sign up
// router.post('/signup', async (req, res) => {
//     try {
//         const { fullName, email, password, phone } = req.body;
//         console.log("Request came to server: ", req.body);
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: 'Email already exists' });
//         }

//         const user = new User({
//             fullName,
//             email,
//             password,
//             phone
//         });

//         await user.save();
        
//         const token = jwt.sign(
//             { id: user._id }, 
//             req.app.locals.config.jwtSecret, 
//             { expiresIn: '24h' }
//         );

//         res.status(201).json({ user, token });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });


router.post('/signup', async (req, res) => {
    try {
        const { fullName, email, password, phone } = req.body;
        console.log("Request came to server: ", req.body);
        
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const user = new User({
            fullName,
            email: email.toLowerCase(),
            password,  // Will be hashed by pre-save middleware
            phone
        });

        const savedUser = await user.save();
        
        // Remove password from response
        const userResponse = savedUser.toObject();
        delete userResponse.password;
        
        const token = jwt.sign(
            { id: savedUser._id }, 
            req.app.locals.config.jwtSecret, 
            { expiresIn: '24h' }
        );

        res.status(201).json({ user: userResponse, token });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(400).json({ message: error.message });
    }
});
// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Request came to login: ", req.body)
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id }, 
            req.app.locals.config.jwtSecret, 
            { expiresIn: '24h' }
        );

        res.json({ user, token });

        console.log("Login Successfull")
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get current user
router.get('/me', auth, async (req, res) => {
    res.json(req.user);
});

// Update user profile
router.patch('/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['fullName', 'phone', 'emergencyContacts'];
    
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).json({ message: 'Invalid updates' });
    }

    try {
        updates.forEach(update => req.user[update] = req.body[update]);
        await req.user.save();
        res.json(req.user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;