const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// MongoDB Connection with better error handling
console.log('Attempting to connect to MongoDB...');

const MONGODB_URI = 'mongodb+srv://rashel4gunarathne:rasel2323@cluster0.3kaez.mongodb.net/LibraryManagement';

mongoose.connect(MONGODB_URI, {
    dbName: 'LibraryManagement',    // Explicitly specify database name
    serverSelectionTimeoutMS: 10000 // 10 second timeout
})
.then(() => {
    console.log('✅ Connected to MongoDB Atlas successfully');
    // Only start the server after successful database connection
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
    });
})
.catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    if (err.name === 'MongoServerSelectionError') {
        console.error('Please check if:');
        console.error('1. Your MongoDB Atlas cluster is running');
        console.error('2. Your IP address is whitelisted in MongoDB Atlas');
        console.error('3. Your username and password are correct');
        console.error('4. The database name "LibraryManagement" is correct');
    }
    if (err.name === 'MongoParseError') {
        console.error('Invalid MongoDB connection string');
    }
    process.exit(1); // Exit if cannot connect to database
});

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
    console.log('🔄 Mongoose connected to MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
    console.error('🔴 Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('🔸 Mongoose disconnected');
});

// Routes
const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');

app.use('/api/books', bookRoutes);
app.use('/api', userRoutes);  // This will make the register endpoint available at /api/register
app.use('/api/orders', orderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
}); 