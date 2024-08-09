const express = require('express');
const router = express.Router();

// Import route handlers
const productRoutes = require('./productRoutes');
const summaryRoutes = require('./summaryRoutes');

// Route for handling product-related requests
router.use('/products', productRoutes);

// Route for handling summary-related requests
router.use('/summarize', summaryRoutes);

module.exports = router;
