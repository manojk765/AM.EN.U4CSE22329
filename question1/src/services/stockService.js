const axios = require('axios');
const authService = require('./authService');

const API_BASE_URL = 'http://20.244.56.144/evaluation-service';

const stockCache = {};

const CACHE_EXPIRATION = 60000;

exports.getStockData = async (ticker, minutes) => {
  try {
    const cacheKey = `${ticker}_${minutes}`;
    const cachedData = stockCache[cacheKey];
    
    if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_EXPIRATION) {
      return cachedData.data;
    }
    
    const token = await authService.getBearerToken();
    
    const response = await axios.get(`${API_BASE_URL}/stocks/${ticker}?minutes=${minutes}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.data) {
      throw new Error('No data received from stock API');
    }
    
    stockCache[cacheKey] = {
      data: response.data,
      timestamp: Date.now()
    };
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching stock data for ${ticker}:`, error);
    if (error.response && error.response.status === 404) {
      return [];
    }
    throw new Error(`Failed to fetch stock data: ${error.message || 'Unknown error'}`);
  }
};

exports.testExternalApi = async () => {
  try {
    const token = await authService.getBearerToken();
    
    const response = await axios.get(`${API_BASE_URL}/stocks/NVDA?minutes=30`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return {
      status: 'success',
      apiStatus: 'Connected',
      data: response.data ? 'Data received' : 'No data',
      token: token.substring(0, 10) + '...'
    };
  } catch (error) {
    console.error('Error testing external API:', error);
    return {
      status: 'error',
      message: `API connection test failed: ${error.message || 'Unknown error'}`,
      responseStatus: error.response ? error.response.status : 'No response',
      responseData: error.response ? error.response.data : 'No data'
    };
  }
};