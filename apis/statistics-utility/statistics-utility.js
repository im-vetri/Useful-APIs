export function getStatistics(arr) {
  if (!Array.isArray(arr) || arr.length === 0) throw new Error("Input must be a non-empty array");

  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;

  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];

  const frequency = {};
  arr.forEach(num => frequency[num] = (frequency[num] || 0) + 1);
  const maxFreq = Math.max(...Object.values(frequency));
  const mode = Object.keys(frequency)
    .filter(k => frequency[k] === maxFreq)
    .map(Number);

  const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
  const stdDev = Math.sqrt(variance);

  return { mean, median, mode, variance, stdDev };
}

// Example:
console.log(getStatistics([2, 4, 4, 4, 5, 5, 7, 9]));
