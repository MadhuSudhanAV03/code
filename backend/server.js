const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For generating JWTs
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const app = express();

// Use only one PORT declaration
const PORT = 5000; // You can change this to 3000 if preferred

// Middleware
app.use(express.json());
app.use(express.static('uploads'));

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/Code', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
}).catch((err) => {
    console.log('MongoDB connection error: ', err);
});

// Models (User, Report, Doctor)
const User = mongoose.model('User', {
    fullName: String,
    email: { type: String, unique: true },
    password: String,
    phone: String
});

const Report = mongoose.model('Report', {
    userId: mongoose.Schema.Types.ObjectId,
    fileName: String,
    filePath: String,
    uploadDate: { type: Date, default: Date.now },
    reportType: String
});

const Doctor = mongoose.model('Doctor', {
    name: String,
    specialization: String,
    hospital: String,
    location: {
        address: String,
        coordinates: {
            latitude: Number,
            longitude: Number
        }
    },
    contact: String
});

// Multer configuration
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Routes (Signup, Login, Upload, Get Reports, Search Doctors)

// Signup Route
app.post('http://127.0.0.1:27017/Code/api/signup', async (req, res) => {
    const { fullName, email, password, phone } = req.body;
    
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            phone
        });

        // Save the user to the database
        await newUser.save();
        
        // Send a success response
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error during signup', error: err.message });
    }
});

// Login Route
app.post('http://127.0.0.1:27017/Code/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

        // Send the token in the response
        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error during login', error: err.message });
    }
});

// Report Upload Route
app.post('http://127.0.0.1:27017/Code/api/reports/upload', upload.single('report'), async (req, res) => {
    const { userId, reportType } = req.body;  // Expect userId and reportType from the request body
    const file = req.file;  // File uploaded

    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        // Create a new report document
        const newReport = new Report({
            userId,
            fileName: file.filename,
            filePath: file.path,
            reportType,
        });

        // Save the report to the database
        await newReport.save();
        
        // Send a success response
        res.status(201).json({ message: 'Report uploaded successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error uploading report', error: err.message });
    }
});

// Fetch Reports Route
app.get('http://127.0.0.1:27017/Code/api/reports/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Fetch all reports for the user
        const reports = await Report.find({ userId });

        if (reports.length === 0) {
            return res.status(404).json({ message: 'No reports found for this user' });
        }

        // Send the reports in the response
        res.status(200).json(reports);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching reports', error: err.message });
    }
});

// Search Doctors Route
app.get('http://127.0.0.1:27017/Code/api/doctors/search', async (req, res) => {
    try {
        const { name, specialization, location } = req.query; // Extract query parameters
        
        // Build the query filter based on the provided search parameters
        let searchCriteria = {};

        if (name) {
            searchCriteria.name = { $regex: name, $options: 'i' };  // Case-insensitive search for name
        }

        if (specialization) {
            searchCriteria.specialization = { $regex: specialization, $options: 'i' };  // Case-insensitive search for specialization
        }

        if (location) {
            searchCriteria['location.address'] = { $regex: location, $options: 'i' };  // Case-insensitive search for location address
        }

        // Query the database using the search criteria
        const doctors = await Doctor.find(searchCriteria);

        if (doctors.length > 0) {
            // If doctors are found, send them in the response
            res.status(200).json(doctors);
        } else {
            // If no doctors are found matching the criteria
            res.status(404).json({ message: 'No doctors found matching the search criteria' });
        }
    } catch (err) {
        // If there's an error with the database operation
        console.error(err);
        res.status(500).json({ message: 'Error fetching doctors', error: err.message });
    }
});

// Add Sample Doctors
async function addSampleDoctors() {
    const existingDoctors = await Doctor.findOne();
    if (!existingDoctors) {
        const sampleDoctors = [
            {
                name: "Dr. Sarah Johnson",
                specialization: "Obstetrics & Gynecology",
                hospital: "City Maternity Hospital",
                location: {
                    address: "Bangalore, Karnataka",
                    coordinates: {
                        latitude: 12.9716,
                        longitude: 77.5946
                    }
                },
                contact: "+91-9876543210"
            },
            {
                name: "Dr. Priya Sharma",
                specialization: "Obstetrics & Gynecology",
                hospital: "Mother Care Hospital",
                location: {
                    address: "Mumbai, Maharashtra",
                    coordinates: {
                        latitude: 19.0760,
                        longitude: 72.8777
                    }
                },
                contact: "+91-9876543211"
            }
        ];

        await Doctor.insertMany(sampleDoctors);
        console.log('Sample doctors added successfully');
    } else {
        console.log('Doctors already exist in the database');
    }
}

// Start Server
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);

    // Wait for MongoDB connection and then add sample doctors
    await addSampleDoctors();
});
