const express = require('express');
const axios = require('axios');
const router = express.Router();

const BASE_API = 'http://20.244.56.144/evaluation-service/stocks';

router.get('/list/all', async (req, res) => {
    try {
        const response = await axios.get(BASE_API);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stock list' });
    }
});

// GET /stocks/:ticker
router.get('/:ticker', async (req, res) => {
    const { ticker } = req.params;
    const { minutes, aggregation } = req.query;

    try {
        const url = minutes
            ? `${BASE_API}/${ticker}?minutes=${minutes}`
            : `${BASE_API}/${ticker}`;

        const response = await axios.get(url);

        if (!minutes) {
            // Single stock price
            return res.json(response.data);
        }

        const prices = response.data.map(p => p.price);
        const average =
            aggregation === 'average'
                ? +(prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2)
                : null;

        res.json({
            averageStockPrice: average,
            priceHistory: response.data
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stock price' });
    }
});

module.exports = router;
