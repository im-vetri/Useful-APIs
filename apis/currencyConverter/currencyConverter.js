/**
 * Currency Converter API
 * Real-time currency conversion using ExchangeRate-API
 * 
 * @author Useful-APIs Contributors
 * @version 1.0.0
 */

const BASE_URL = "https://api.exchangerate-api.com/v4/latest";

/**
 * Converts an amount from one currency to another
 * @param {number} amount - The amount to convert
 * @param {string} fromCurrency - Source currency code (e.g., 'USD', 'EUR', 'GBP')
 * @param {string} toCurrency - Target currency code (e.g., 'USD', 'EUR', 'GBP')
 * @returns {Promise<Object>} Conversion result with rate and converted amount
 */
async function convert(amount, fromCurrency, toCurrency) {
    try {
        if (!amount || typeof amount !== "number" || amount <= 0) {
            throw new Error("Amount must be a positive number");
        }
        if (!fromCurrency || typeof fromCurrency !== "string") {
            throw new Error("fromCurrency must be a valid currency code");
        }
        if (!toCurrency || typeof toCurrency !== "string") {
            throw new Error("toCurrency must be a valid currency code");
        }

        const from = fromCurrency.toUpperCase();
        const to = toCurrency.toUpperCase();

        const response = await fetch(`${BASE_URL}/${from}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch exchange rates for ${from}`);
        }

        const data = await response.json();

        if (!data.rates || !data.rates[to]) {
            throw new Error(`Currency code ${to} not found`);
        }

        const rate = data.rates[to];
        const convertedAmount = (amount * rate).toFixed(2);

        return {
            amount: amount,
            fromCurrency: from,
            toCurrency: to,
            rate: rate,
            convertedAmount: parseFloat(convertedAmount),
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error("Error converting currency:", error);
        throw error;
    }
}

/**
 * Gets exchange rates for all supported currencies from a base currency
 * @param {string} baseCurrency - Base currency code (e.g., 'USD')
 * @returns {Promise<Object>} Exchange rates object with all supported currencies
 */
async function getExchangeRates(baseCurrency) {
    try {
        if (!baseCurrency || typeof baseCurrency !== "string") {
            throw new Error("baseCurrency must be a valid currency code");
        }

        const base = baseCurrency.toUpperCase();
        const response = await fetch(`${BASE_URL}/${base}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch exchange rates for ${base}`);
        }

        const data = await response.json();

        return {
            base: data.base,
            date: data.date,
            rates: data.rates,
            supportedCurrencies: Object.keys(data.rates)
        };
    } catch (error) {
        console.error("Error fetching exchange rates:", error);
        throw error;
    }
}

/**
 * Gets the latest exchange rate between two specific currencies
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @returns {Promise<number>} The exchange rate
 */
async function getRate(fromCurrency, toCurrency) {
    try {
        if (!fromCurrency || typeof fromCurrency !== "string") {
            throw new Error("fromCurrency must be a valid currency code");
        }
        if (!toCurrency || typeof toCurrency !== "string") {
            throw new Error("toCurrency must be a valid currency code");
        }

        const from = fromCurrency.toUpperCase();
        const to = toCurrency.toUpperCase();

        const response = await fetch(`${BASE_URL}/${from}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch exchange rates for ${from}`);
        }

        const data = await response.json();

        if (!data.rates || !data.rates[to]) {
            throw new Error(`Currency code ${to} not found`);
        }

        return data.rates[to];
    } catch (error) {
        console.error("Error fetching rate:", error);
        throw error;
    }
}

/**
 * Converts multiple amounts from one currency to another
 * @param {number[]} amounts - Array of amounts to convert
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @returns {Promise<Array>} Array of conversion results
 */
async function convertMultiple(amounts, fromCurrency, toCurrency) {
    try {
        if (!Array.isArray(amounts) || amounts.length === 0) {
            throw new Error("amounts must be a non-empty array");
        }
        if (!fromCurrency || typeof fromCurrency !== "string") {
            throw new Error("fromCurrency must be a valid currency code");
        }
        if (!toCurrency || typeof toCurrency !== "string") {
            throw new Error("toCurrency must be a valid currency code");
        }

        const from = fromCurrency.toUpperCase();
        const to = toCurrency.toUpperCase();

        const response = await fetch(`${BASE_URL}/${from}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch exchange rates for ${from}`);
        }

        const data = await response.json();

        if (!data.rates || !data.rates[to]) {
            throw new Error(`Currency code ${to} not found`);
        }

        const rate = data.rates[to];
        const results = amounts.map(amount => ({
            amount: amount,
            convertedAmount: parseFloat((amount * rate).toFixed(2)),
            rate: rate
        }));

        return results;
    } catch (error) {
        console.error("Error converting multiple amounts:", error);
        throw error;
    }
}

// Export for Node.js and Browser
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        convert,
        getExchangeRates,
        getRate,
        convertMultiple
    };
}

if (typeof window !== "undefined") {
    window.currencyConverterAPI = {
        convert,
        getExchangeRates,
        getRate,
        convertMultiple
    };
}
