// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['patient', 'doctor', 'admin'],
        default: 'patient'
    },
    emergencyContacts: [{
        name: String,
        relationship: String,
        phone: String
    }]
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// models/Doctor.js
const doctorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    qualification: String,
    experience: Number,
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [Number] // [longitude, latitude]
    },
    availability: [{
        day: String,
        slots: [{
            startTime: String,
            endTime: String
        }]
    }]
}, { timestamps: true });

doctorSchema.index({ location: '2dsphere' });

// models/EmergencyContact.js
const emergencyContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: String,
    type: {
        type: String,
        enum: ['hospital', 'ambulance', 'clinic'],
        required: true
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [Number]
    }
}, { timestamps: true });

emergencyContactSchema.index({ location: '2dsphere' });

const User = mongoose.model('User', userSchema);
const Doctor = mongoose.model('Doctor', doctorSchema);
const EmergencyContact = mongoose.model('EmergencyContact', emergencyContactSchema);

module.exports = {
    User,
    Doctor,
    EmergencyContact
};