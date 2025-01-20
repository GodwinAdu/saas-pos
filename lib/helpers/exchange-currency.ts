type Currency = 'USD' | 'EUR' | 'GBP' | 'GHS'; // Add other currencies as needed

const exchangeRates: Record<Currency, number> = {
    USD: 1,       // Base currency
    EUR: 0.92,    // Example exchange rate
    GBP: 0.8,     // Example exchange rate
    GHS: 11.5,    // Example exchange rate
};

function convertCurrency(
    amount: number,
    fromCurrency: Currency,
    toCurrency: Currency
): number {
    if (fromCurrency === toCurrency) return amount;

    const baseAmount = amount / exchangeRates[fromCurrency]; // Convert to USD (base)
    return parseFloat((baseAmount * exchangeRates[toCurrency]).toFixed(2)); // Convert to target
}

// Example usage:
const convertedAmount = convertCurrency(100, 'USD', 'GHS');
console.log(`Converted amount: ${convertedAmount} GHS`);
