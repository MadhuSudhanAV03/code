// routes/doctors.js
const express = require('express');
const { Doctor, User } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

// Get nearby doctors
router.get('/nearby', async (req, res) => {
    try {
        const { longitude, latitude, maxDistance = 10000 } = req.query;

        const doctors = await Doctor.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    $maxDistance: parseInt(maxDistance)
                }
            }
        }).populate('userId', 'fullName phone');

        res.json(doctors);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get doctor availability
router.get('/:id/availability', async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.json(doctor.availability);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
module.exports = router;