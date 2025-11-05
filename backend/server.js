require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

// Import routes
const authRoutes = require('./src/routes/auth.js');
const productRoutes = require('./src/routes/products.js');
const orderRoutes = require('./src/routes/orders.js');
const paymentRoutes = require('./src/routes/payments.js');
const visitRoutes = require('./src/routes/visits.js');
const vaccinationRoutes = require('./src/routes/vaccinations.js');
const adminRoutes = require('./src/routes/admin.js');
const userRoutes = require('./src/routes/users.js');
const seedRoute = require('./src/routes/seed.js');

const app = express();

// Security middleware
app.use(helmet());

// --- THIS IS THE CORRECT, COMBINED CORS CONFIGURATION ---
// We define all allowed URLs in an array.
const allowedOrigins = [
  'http://localhost:3000',       // For your local testing
  'https://gmchicks.vercel.app', // Your main production domain
  /\.vercel\.app$/               // This REGEX allows all Vercel preview domains
];

// If you still have a FRONTEND_URL in Render, this will add it too.
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: function (origin, callback) {
    // This function checks if the request origin is in our allowlist.
    // !origin is added to allow tools like Postman (which have no origin).
    if (!origin || allowedOrigins.some(o => o instanceof RegExp ? o.test(origin) : o === origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('This origin is not allowed by CORS')); // Block the request
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// --- END OF CORS CONFIGURATION ---


// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compression middleware
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/vaccinations', vaccinationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/seed', seedRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

module.exports = app;

// --- DO NOT PUT ANY CODE AFTER THIS LINE ---