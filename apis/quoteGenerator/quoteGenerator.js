// File: ./apis/quoteGenerator/quoteGenerator.js

const quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "Don’t let yesterday take up too much of today.", author: "Will Rogers" },
  { text: "It’s not whether you get knocked down, it’s whether you get up.", author: "Vince Lombardi" },
  { text: "If you are working on something exciting, it will keep you motivated.", author: "Steve Jobs" },
  { text: "Success is not in what you have, but who you are.", author: "Bo Bennett" }
];

// Get a random quote
async function getRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

// Search quotes by keyword or author
async function searchQuotes(keyword) {
  return quotes.filter(q =>
    q.text.toLowerCase().includes(keyword.toLowerCase()) ||
    q.author.toLowerCase().includes(keyword.toLowerCase())
  );
}

module.exports = { getRandomQuote, searchQuotes };
