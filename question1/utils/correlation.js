
exports.alignTimestamps = (stock1Data, stock2Data) => {
  const map1 = new Map();
  const map2 = new Map();
  
  stock1Data.forEach(item => {
    map1.set(item.timestamp, item.price);
  });
  
  stock2Data.forEach(item => {
    map2.set(item.timestamp, item.price);
  });
  
  const commonTimestamps = [...map1.keys()].filter(timestamp => map2.has(timestamp));
  
  if (commonTimestamps.length >= 2) {
    const prices1 = [];
    const prices2 = [];
    
    commonTimestamps.forEach(timestamp => {
      prices1.push(map1.get(timestamp));
      prices2.push(map2.get(timestamp));
    });
    
    return { prices1, prices2 };
  } 
  
  return findApproximateMatches(stock1Data, stock2Data);
};


function findApproximateMatches(stock1Data, stock2Data) {
  if (!stock1Data.length || !stock2Data.length) {
    return { prices1: [], prices2: [] };
  }
  
  // Sort both arrays by timestamp
  const sorted1 = [...stock1Data].sort((a, b) => a.timestamp - b.timestamp);
  const sorted2 = [...stock2Data].sort((a, b) => a.timestamp - b.timestamp);
  
  const prices1 = [];
  const prices2 = [];
  
  const MAX_TIME_DIFF = 15 * 60 * 1000;  
  
  for (let i = 0; i < sorted1.length; i++) {
    const time1 = sorted1[i].timestamp;
    let closestIndex = -1;
    let minDiff = Infinity;
    
    for (let j = 0; j < sorted2.length; j++) {
      const diff = Math.abs(time1 - sorted2[j].timestamp);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = j;
      }
    }
    
    if (closestIndex !== -1 && minDiff <= MAX_TIME_DIFF) {
      prices1.push(sorted1[i].price);
      prices2.push(sorted2[closestIndex].price);
    }
  }
  
  if (prices1.length < 2) {
    const min = Math.min(sorted1.length, sorted2.length);
    if (min >= 2) {
      return {
        prices1: sorted1.slice(0, min).map(item => item.price),
        prices2: sorted2.slice(0, min).map(item => item.price)
      };
    }
  }
  
  return { prices1, prices2 };
}


exports.calculateCorrelation = (x, y) => {
  if (!x || !y || x.length < 2 || y.length < 2 || x.length !== y.length) {
    return 0;
  }
  
  const n = x.length;
  
  let sumX = 0;
  let sumY = 0;
  
  for (let i = 0; i < n; i++) {
    sumX += x[i];
    sumY += y[i];
  }
  
  const meanX = sumX / n;
  const meanY = sumY / n;
  
  let covariance = 0;
  let varX = 0;
  let varY = 0;
  
  for (let i = 0; i < n; i++) {
    const diffX = x[i] - meanX;
    const diffY = y[i] - meanY;
    
    covariance += diffX * diffY;
    varX += diffX * diffX;
    varY += diffY * diffY;
  }
  
  if (varX === 0 || varY === 0) {
    return 0;
  }
  
  const stdDevX = Math.sqrt(varX);
  const stdDevY = Math.sqrt(varY);
  
  const correlation = covariance / (stdDevX * stdDevY);
  
  return Math.max(-1, Math.min(1, parseFloat(correlation.toFixed(4))));
}; 