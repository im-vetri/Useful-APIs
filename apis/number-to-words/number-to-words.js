export function numberToWords(num) {
  if (num === 0) return "zero";

  const belowTwenty = [
    "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
    "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
    "seventeen", "eighteen", "nineteen"
  ];
  const tens = [
    "", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"
  ];
  const thousands = ["", "thousand", "million", "billion"];

  const helper = n => {
    if (n === 0) return "";
    else if (n < 20) return belowTwenty[n] + " ";
    else if (n < 100)
      return tens[Math.floor(n / 10)] + " " + helper(n % 10);
    else
      return belowTwenty[Math.floor(n / 100)] + " hundred " + helper(n % 100);
  };

  let i = 0, words = "";
  while (num > 0) {
    if (num % 1000 !== 0)
      words = helper(num % 1000) + thousands[i] + " " + words;
    num = Math.floor(num / 1000);
    i++;
  }

  return words.trim();
}

// Example usage:
console.log(numberToWords(1234567)); // "one million two hundred thirty four thousand five hundred sixty seven"
