// routes/emergency.js
const express = require('express');
const { EmergencyContact } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

// Get nearby emergency facilities
router.get('/nearby', async (req, res) => {
    try {
        const { longitude, latitude, type, maxDistance = 10000 } = req.query;

        const query = {
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    $maxDistance: parseInt(maxDistance)
                }
            }
        };

        if (type) {
            query.type = type;
        }

        const facilities = await EmergencyContact.find(query);
        res.json(facilities);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Add emergency contact
router.post('/', auth, async (req, res) => {
    try {
        const contact = new EmergencyContact(req.body);
        await contact.save();
        res.status(201).json(contact);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;