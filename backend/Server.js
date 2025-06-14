const express = require('express'); 
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Define a range of ports to try
const BASE_PORT = 5050;
const MAX_PORT_ATTEMPTS = 10;

// CORS configuration
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-auth-token']
})); 

// Middleware
app.use(express.json());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection with retry logic
const connectDB = async () => {
    const URL = process.env.MONGODB_URL;
    try {
        await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        setTimeout(connectDB, 5000);
    }
};

connectDB();

mongoose.connection.on('error', err => {
    console.error('MongoDB error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected. Attempting to reconnect...');
    connectDB();
});

// Routes
const userRouter = require('./routes/Users');
const productRouter = require('./routes/Products');

app.use('/api/users', userRouter);
app.use('/api/products', productRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (err.name === 'MongoError' || err.name === 'MongooseError') {
        return res.status(503).json({ message: 'Database error. Please try again later.' });
    }
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Something went wrong on the server.' });
});

// Function to start server on an available port
const startServer = (port) => {
    const server = app.listen(port)
        .on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                if (port < BASE_PORT + MAX_PORT_ATTEMPTS) {
                    console.log(`Port ${port} is busy, trying port ${port + 1}`);
                    startServer(port + 1);
                } else {
                    console.error('No available ports found in range');
                    process.exit(1);
                }
            } else {
                console.error('Server error:', err);
            }
        })
        .on('listening', () => {
            const actualPort = server.address().port;
            console.log(`Server is running on port ${actualPort}`);
        });
};

// Start the server
startServer(BASE_PORT);




