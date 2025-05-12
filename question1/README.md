# Stock Price Aggregation Microservice

A Node.js microservice for stock price analysis, built with Express.js.

## Features

- Gets the average price of a stock over the past m minutes
- Calculates correlation between two stock prices over the past m minutes
- Bearer token authentication for API requests
- In-memory caching to reduce external API calls

## API Endpoints

### 1. Get Stock Average

```
GET /stocks/:ticker?minutes=<m>&aggregation=average
```

Example:
```
GET /stocks/NVDA?minutes=30&aggregation=average
```

Response:
```json
{
  "averageStockPrice": 453.56,
  "priceHistory": [...]
}
```

### 2. Get Stock Correlation

```
GET /stockcorrelation?minutes=<m>&ticker=<ticker1>&ticker=<ticker2>
```

Example:
```
GET /stockcorrelation?minutes=30&ticker=NVDA&ticker=TSLA
```

Response:
```json
{
  "correlation": 0.8342,
  "stocks": {
    "NVDA": {
      "averagePrice": 453.56,
      "priceHistory": [...]
    },
    "TSLA": {
      "averagePrice": 254.32,
      "priceHistory": [...]
    }
  }
}
```

### 3. Test Connection

```
GET /test
```

Returns information about the connection to the external API.

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm start
   ```

## Configuration

The service uses the following environment variables:

- `PORT`: The port to run the service on (default: 3000)

You can create a `.env` file in the root directory to set these variables.

## Development

To run in development mode with automatic restarts:

```
npm run dev
``` 