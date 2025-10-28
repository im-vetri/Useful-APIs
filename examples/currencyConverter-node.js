// Currency Converter API - Node.js Examples
// Run individual examples by uncommenting them

const {
    convert,
    getExchangeRates,
    getRate,
    convertMultiple
} = require('../apis/currencyConverter/currencyConverter.js');

// ============================================
// Example 1: Simple Currency Conversion
// ============================================
async function example1_simpleConversion() {
    console.log('\n--- Example 1: Simple Conversion ---');
    try {
        const result = await convert(100, 'USD', 'EUR');
        console.log(`${result.amount} ${result.fromCurrency} = ${result.convertedAmount} ${result.toCurrency}`);
        console.log(`Exchange Rate: 1 ${result.fromCurrency} = ${result.rate} ${result.toCurrency}`);
        console.log(`Timestamp: ${result.timestamp}`);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// ============================================
// Example 2: Get All Exchange Rates
// ============================================
async function example2_exchangeRates() {
    console.log('\n--- Example 2: Get All Exchange Rates ---');
    try {
        const rates = await getExchangeRates('USD');
        console.log(`Base Currency: ${rates.base}`);
        console.log(`Date: ${rates.date}`);
        console.log(`Total Supported Currencies: ${rates.supportedCurrencies.length}`);
        
        // Display some sample rates
        console.log('\nSample Rates:');
        ['EUR', 'GBP', 'JPY', 'INR', 'AUD'].forEach(currency => {
            if (rates.rates[currency]) {
                console.log(`  1 USD = ${rates.rates[currency]} ${currency}`);
            }
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// ============================================
// Example 3: Get Specific Exchange Rate
// ============================================
async function example3_specificRate() {
    console.log('\n--- Example 3: Get Specific Exchange Rate ---');
    try {
        const rate = await getRate('USD', 'EUR');
        console.log(`1 USD = ${rate} EUR`);

        // Calculate conversions using the rate
        const amounts = [50, 100, 500];
        console.log('\nManual conversions using the rate:');
        amounts.forEach(amount => {
            const converted = (amount * rate).toFixed(2);
            console.log(`  ${amount} USD = ${converted} EUR`);
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// ============================================
// Example 4: Convert Multiple Amounts
// ============================================
async function example4_multipleConversions() {
    console.log('\n--- Example 4: Convert Multiple Amounts ---');
    try {
        const amounts = [10, 50, 100, 500, 1000];
        const conversions = await convertMultiple(amounts, 'USD', 'EUR');
        
        console.log('Batch Conversion Results:');
        console.log('Amount (USD) | Converted (EUR) | Rate');
        console.log('-------------|-----------------|------');
        conversions.forEach(item => {
            console.log(`${item.amount.toString().padEnd(12)} | ${item.convertedAmount.toString().padEnd(15)} | ${item.rate}`);
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// ============================================
// Example 5: E-commerce Price Conversion
// ============================================
async function example5_priceConversion() {
    console.log('\n--- Example 5: E-commerce Price List Conversion ---');
    try {
        const productPrices = [9.99, 19.99, 49.99, 99.99, 199.99];
        const targetCurrency = 'EUR';
        
        console.log('Converting product prices to EUR:\n');
        const eurPrices = await convertMultiple(productPrices, 'USD', targetCurrency);
        
        eurPrices.forEach((item, index) => {
            console.log(`Product ${index + 1}: $${productPrices[index]} USD = €${item.convertedAmount} ${targetCurrency}`);
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// ============================================
// Example 6: Multi-Currency Conversion
// ============================================
async function example6_multiCurrency() {
    console.log('\n--- Example 6: Convert to Multiple Currencies ---');
    try {
        const usdAmount = 100;
        const targetCurrencies = ['EUR', 'GBP', 'JPY', 'INR', 'AUD'];
        
        console.log(`Converting ${usdAmount} USD to multiple currencies:\n`);
        
        for (const currency of targetCurrencies) {
            const result = await convert(usdAmount, 'USD', currency);
            console.log(`${result.convertedAmount} ${result.toCurrency} (rate: ${result.rate})`);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// ============================================
// Example 7: Error Handling
// ============================================
async function example7_errorHandling() {
    console.log('\n--- Example 7: Error Handling ---');
    
    // Invalid amount
    try {
        await convert(-50, 'USD', 'EUR');
    } catch (error) {
        console.log('✓ Caught error (negative amount):', error.message);
    }

    // Invalid currency code
    try {
        await convert(100, 'XYZ', 'EUR');
    } catch (error) {
        console.log('✓ Caught error (invalid currency):', error.message);
    }

    // Invalid from currency
    try {
        await convert(100, 'USD', 'INVALID');
    } catch (error) {
        console.log('✓ Caught error (invalid target):', error.message);
    }

    // Empty amounts array
    try {
        await convertMultiple([], 'USD', 'EUR');
    } catch (error) {
        console.log('✓ Caught error (empty array):', error.message);
    }
}

// ============================================
// Example 8: Live Travel Budget Converter
// ============================================
async function example8_travelBudget() {
    console.log('\n--- Example 8: Travel Budget Converter ---');
    try {
        const budgetUSD = 1000;
        const countries = {
            'EUR': 'France',
            'GBP': 'UK',
            'JPY': 'Japan',
            'INR': 'India',
            'AUD': 'Australia'
        };
        
        console.log(`Original Budget: $${budgetUSD} USD\n`);
        console.log('Budget in different countries:\n');
        
        const currencies = Object.keys(countries);
        const budgets = await convertMultiple(
            Array(currencies.length).fill(budgetUSD),
            'USD',
            currencies[0]
        );
        
        for (const currency of currencies) {
            const result = await convert(budgetUSD, 'USD', currency);
            console.log(`${countries[currency]}: ${result.convertedAmount} ${currency}`);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// ============================================
// Run Examples
// ============================================
(async () => {
    console.log('Currency Converter API - Node.js Examples');
    console.log('==========================================');

    // Uncomment individual examples to run them
    await example1_simpleConversion();
    await example2_exchangeRates();
    await example3_specificRate();
    await example4_multipleConversions();
    await example5_priceConversion();
    await example6_multiCurrency();
    await example7_errorHandling();
    await example8_travelBudget();

    console.log('\n==========================================');
    console.log('All examples completed!');
})();
