const express = require('express');
const cors = require('cors');
require('dotenv').config();

const stockRoutes = require('./routes/stocks');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/stocks', stockRoutes);


app.get('/stockcorrelation', async (req, res) => {
    const { minutes, ticker: tickers } = req.query;

    if (!tickers || tickers.length < 2) {
        return res.status(400).json({ error: 'At least two tickers required' });
    }

    const tickerArray = Array.isArray(tickers) ? tickers : [tickers];
    try {
        const priceHistories = await Promise.all(
            tickerArray.map(async (ticker) => {
                const url = `http://20.244.56.144/evaluation-service/stocks/${ticker}?minutes=${minutes}`;
                const response = await axios.get(url);
                return { ticker, prices: response.data.map(p => p.price) };
            })
        );

        const x = priceHistories[0].prices;
        const y = priceHistories[1].prices;

        const correlation = pearsonCorrelation(x, y);
        res.json({
            correlation,
            stocks: {
                [priceHistories[0].ticker]: priceHistories[0].prices,
                [priceHistories[1].ticker]: priceHistories[1].prices
            }
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error computing correlation' });
    }
});

function pearsonCorrelation(x, y) {
    if (x.length !== y.length || x.length === 0) return null;

    const meanX = x.reduce((a, b) => a + b, 0) / x.length;
    const meanY = y.reduce((a, b) => a + b, 0) / y.length;

    const numerator = x.map((xi, i) => (xi - meanX) * (y[i] - meanY)).reduce((a, b) => a + b, 0);
    const denominator = Math.sqrt(
        x.map(xi => (xi - meanX) ** 2).reduce((a, b) => a + b, 0) *
        y.map(yi => (yi - meanY) ** 2).reduce((a, b) => a + b, 0)
    );

    return (denominator === 0) ? 0 : +(numerator / denominator).toFixed(4);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Stock microservice running at http://localhost:${PORT}`);
});
 