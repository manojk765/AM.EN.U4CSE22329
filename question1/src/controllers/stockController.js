const stockService = require('../services/stockService');
const averageUtil = require('../utils/average');
const correlationUtil = require('../utils/correlation');

exports.getStockAverage = async (req, res) => {
  try {
    const { ticker } = req.params;
    const { minutes, aggregation } = req.query;

    if (!ticker || !minutes) {
      return res.status(400).json({ error: 'Ticker and minutes are required' });
    }

    if (aggregation && aggregation !== 'average') {
      return res.status(400).json({ error: 'Only average aggregation is supported' });
    }

    const stockData = await stockService.getStockData(ticker, minutes);
    
    if (!stockData || !stockData.length) {
      return res.status(200).json({
        averageStockPrice: 0,
        priceHistory: [],
        message: 'No stock data found'
      });
    }

    const prices = stockData.map(item => item.price);
    const averagePrice = averageUtil.calculateAverage(prices);

    return res.status(200).json({
      averageStockPrice: averagePrice,
      priceHistory: stockData
    });
  } catch (error) {
    console.error('Error in getStockAverage:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

exports.getStockCorrelation = async (req, res) => {
  try {
    const { minutes, ticker } = req.query;
    
    if (!minutes) {
      return res.status(400).json({ error: 'Minutes parameter is required' });
    }

    if (!ticker || !Array.isArray(ticker) || ticker.length !== 2) {
      return res.status(400).json({ error: 'Exactly two ticker parameters are required' });
    }
    
    const [ticker1, ticker2] = ticker;
    
    const [stock1Data, stock2Data] = await Promise.all([
      stockService.getStockData(ticker1, minutes),
      stockService.getStockData(ticker2, minutes)
    ]);
    
    if (!stock1Data.length && !stock2Data.length) {
      return res.status(200).json({
        correlation: 0,
        message: 'No data available for either stock',
        stocks: {
          [ticker1]: { averagePrice: 0, priceHistory: [] },
          [ticker2]: { averagePrice: 0, priceHistory: [] }
        }
      });
    }
    
    const alignedData = correlationUtil.alignTimestamps(stock1Data, stock2Data);
    
    if (!alignedData.prices1.length || !alignedData.prices2.length || 
        alignedData.prices1.length < 2 || alignedData.prices1.length !== alignedData.prices2.length) {
      
      const avg1 = stock1Data.length ? averageUtil.calculateAverage(stock1Data.map(item => item.price)) : 0;
      const avg2 = stock2Data.length ? averageUtil.calculateAverage(stock2Data.map(item => item.price)) : 0;
      
      return res.status(200).json({
        correlation: 0,
        message: 'Insufficient data points for correlation calculation',
        stocks: {
          [ticker1]: {
            averagePrice: avg1,
            priceHistory: stock1Data
          },
          [ticker2]: {
            averagePrice: avg2,
            priceHistory: stock2Data
          }
        }
      });
    }
    
    const correlation = correlationUtil.calculateCorrelation(
      alignedData.prices1, 
      alignedData.prices2
    );
    
    const avg1 = averageUtil.calculateAverage(stock1Data.map(item => item.price));
    const avg2 = averageUtil.calculateAverage(stock2Data.map(item => item.price));
    
    return res.status(200).json({
      correlation,
      stocks: {
        [ticker1]: {
          averagePrice: avg1,
          priceHistory: stock1Data
        },
        [ticker2]: {
          averagePrice: avg2,
          priceHistory: stock2Data
        }
      }
    });
  } catch (error) {
    console.error('Error in getStockCorrelation:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

exports.testConnection = async (req, res) => {
  try {
    const result = await stockService.testExternalApi();
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in testConnection:', error);
    return res.status(500).json({ error: error.message || 'Failed to connect to external API' });
  }
};
