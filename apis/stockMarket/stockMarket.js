/**
 * Stock Market API
 * Get real-time and historical stock data using Finnhub free tier
 * 
 * @author Useful-APIs Contributors
 * @version 1.0.0
 */

// Using free API - note: Finnhub requires API key in production
// This example uses public endpoints

const FINNHUB_BASE = "https://finnhub.io/api/v1";

/**
 * Gets stock quote (requires Finnhub API key)
 * @param {string} symbol - Stock symbol (e.g., 'AAPL')
 * @param {string} apiKey - Finnhub API key
 * @returns {Promise<Object>} Stock quote data
 */
async function getStockQuote(symbol, apiKey) {
    try {
        if (!symbol || typeof symbol !== 'string') {
            throw new Error('Symbol must be a valid stock ticker');
        }

        if (!apiKey) {
            throw new Error('API key required. Get one at https://finnhub.io');
        }

        const url = `${FINNHUB_BASE}/quote?symbol=${encodeURIComponent(symbol.toUpperCase())}&token=${apiKey}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch stock data: ${response.status}`);
        }

        const data = await response.json();

        if (!data.c) {
            throw new Error(`Symbol '${symbol}' not found`);
        }

        return {
            symbol: symbol.toUpperCase(),
            current: data.c,
            high: data.h,
            low: data.l,
            open: data.o,
            previousClose: data.pc,
            change: (data.c - data.pc).toFixed(2),
            changePercent: ((data.c - data.pc) / data.pc * 100).toFixed(2),
            timestamp: new Date(data.t * 1000).toISOString()
        };
    } catch (error) {
        console.error('Error fetching stock quote:', error);
        throw error;
    }
}

/**
 * Gets company profile (requires Finnhub API key)
 * @param {string} symbol - Stock symbol
 * @param {string} apiKey - Finnhub API key
 * @returns {Promise<Object>} Company information
 */
async function getCompanyProfile(symbol, apiKey) {
    try {
        if (!symbol || typeof symbol !== 'string') {
            throw new Error('Symbol must be a valid stock ticker');
        }

        if (!apiKey) {
            throw new Error('API key required');
        }

        const url = `${FINNHUB_BASE}/stock/profile2?symbol=${encodeURIComponent(symbol.toUpperCase())}&token=${apiKey}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch company profile: ${response.status}`);
        }

        const data = await response.json();

        return {
            symbol: data.ticker,
            name: data.name,
            industry: data.finnhubIndustry,
            country: data.country,
            website: data.weburl,
            description: data.description,
            ipo: data.ipo,
            marketCap: data.marketCapitalization,
            employees: data.employees
        };
    } catch (error) {
        console.error('Error fetching company profile:', error);
        throw error;
    }
}

/**
 * Calculates profit/loss from stock purchase
 * @param {number} buyPrice - Price paid per share
 * @param {number} currentPrice - Current price per share
 * @param {number} shares - Number of shares
 * @returns {Object} Profit/loss calculation
 */
function calculateProfit(buyPrice, currentPrice, shares) {
    if (buyPrice <= 0 || currentPrice <= 0 || shares <= 0) {
        throw new Error('All values must be positive numbers');
    }

    const totalCost = buyPrice * shares;
    const currentValue = currentPrice * shares;
    const profit = (currentValue - totalCost).toFixed(2);
    const profitPercent = ((profit / totalCost) * 100).toFixed(2);

    return {
        buyPrice,
        currentPrice,
        shares,
        totalCost: totalCost.toFixed(2),
        currentValue: currentValue.toFixed(2),
        profit,
        profitPercent,
        isProfit: profit > 0
    };
}

/**
 * Gets popular stock symbols
 * @returns {Array} Array of common stock symbols
 */
function getPopularSymbols() {
    return [
        // Tech
        { symbol: 'AAPL', name: 'Apple', sector: 'Technology' },
        { symbol: 'MSFT', name: 'Microsoft', sector: 'Technology' },
        { symbol: 'GOOGL', name: 'Google', sector: 'Technology' },
        { symbol: 'AMZN', name: 'Amazon', sector: 'Consumer Cyclical' },
        { symbol: 'TSLA', name: 'Tesla', sector: 'Automotive' },
        
        // Finance
        { symbol: 'JPM', name: 'JP Morgan', sector: 'Finance' },
        { symbol: 'BAC', name: 'Bank of America', sector: 'Finance' },
        { symbol: 'WFC', name: 'Wells Fargo', sector: 'Finance' },
        
        // Energy
        { symbol: 'XOM', name: 'Exxon Mobil', sector: 'Energy' },
        { symbol: 'CVX', name: 'Chevron', sector: 'Energy' },
        
        // Healthcare
        { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare' },
        { symbol: 'PFE', name: 'Pfizer', sector: 'Healthcare' },
        { symbol: 'UNH', name: 'UnitedHealth', sector: 'Healthcare' }
    ];
}

/**
 * Validates stock symbol format
 * @param {string} symbol - Stock symbol
 * @returns {boolean} True if valid format
 */
function isValidSymbol(symbol) {
    return symbol && typeof symbol === 'string' && /^[A-Z]{1,5}$/.test(symbol.toUpperCase());
}

/**
 * Calculates portfolio value
 * @param {Array} holdings - Array of {symbol, shares, buyPrice}
 * @param {Object} currentPrices - Object with symbol: price mapping
 * @returns {Object} Portfolio statistics
 */
function calculatePortfolioValue(holdings, currentPrices) {
    if (!Array.isArray(holdings) || holdings.length === 0) {
        throw new Error('Holdings must be a non-empty array');
    }

    let totalValue = 0;
    let totalCost = 0;

    for (const holding of holdings) {
        const price = currentPrices[holding.symbol.toUpperCase()];
        if (!price) continue;

        const cost = holding.buyPrice * holding.shares;
        const value = price * holding.shares;

        totalCost += cost;
        totalValue += value;
    }

    const profit = (totalValue - totalCost).toFixed(2);
    const profitPercent = totalCost > 0 ? ((profit / totalCost) * 100).toFixed(2) : 0;

    return {
        totalCost: totalCost.toFixed(2),
        totalValue: totalValue.toFixed(2),
        profit,
        profitPercent,
        holdingCount: holdings.length
    };
}

// Export for Node.js and Browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getStockQuote,
        getCompanyProfile,
        calculateProfit,
        getPopularSymbols,
        isValidSymbol,
        calculatePortfolioValue
    };
}

if (typeof window !== 'undefined') {
    window.stockMarketAPI = {
        getStockQuote,
        getCompanyProfile,
        calculateProfit,
        getPopularSymbols,
        isValidSymbol,
        calculatePortfolioValue
    };
}
