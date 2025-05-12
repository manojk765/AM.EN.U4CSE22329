const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

router.get('/stocks/:ticker', stockController.getStockAverage);

router.get('/stockcorrelation', stockController.getStockCorrelation);

router.get('/test', stockController.testConnection);

module.exports = router; 