const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController'); // Assuming you have this controller

router.post('/', productController.getProducts); // or .get if using GET method

module.exports = router;
