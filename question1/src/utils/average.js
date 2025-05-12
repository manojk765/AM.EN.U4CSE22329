exports.calculateAverage = (numbers) => {
  if (!numbers || numbers.length === 0) {
    return 0;
  }
  
  const sum = numbers.reduce((acc, curr) => acc + curr, 0);
  return parseFloat((sum / numbers.length).toFixed(2));
}; 