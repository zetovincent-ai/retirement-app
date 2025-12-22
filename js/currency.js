// === CURRENCY SERVICE ===
// Handles interaction with the Frankfurter API for exchange rates.

const BASE_URL = 'https://api.frankfurter.app';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour cache
let rateCache = {}; // Simple in-memory cache: { "JPY-2024-01-01": { rate: 145.2, timestamp: 12345 } }

/**
 * Fetch exchange rate for a specific date and currency.
 * @param {string} fromCurrency - e.g., 'USD'
 * @param {string} toCurrency - e.g., 'JPY'
 * @param {string} date - ISO format 'YYYY-MM-DD' or 'latest'
 * @returns {Promise<number>} - The exchange rate
 */
export async function getExchangeRate(fromCurrency, toCurrency, date = 'latest') {
    // 1. Optimization: If currencies match, rate is always 1.0
    if (fromCurrency === toCurrency) return 1.0;

    // 2. Check Cache
    const cacheKey = `${fromCurrency}-${toCurrency}-${date}`;
    const now = Date.now();
    if (rateCache[cacheKey] && (now - rateCache[cacheKey].timestamp < CACHE_DURATION)) {
        console.log(`Using cached rate for ${cacheKey}`);
        return rateCache[cacheKey].rate;
    }

    // 3. Handle "Today" vs "Historical"
    // Frankfurter uses 'latest' for current, or YYYY-MM-DD for past
    // It does NOT support future dates, so we fallback to 'latest' for future plans.
    let queryDate = date;
    const today = new Date().toISOString().split('T')[0];
    if (date > today) {
        queryDate = 'latest';
    }

    const url = `${BASE_URL}/${queryDate}?from=${fromCurrency}&to=${toCurrency}`;

    try {
        console.log(`Fetching rate from: ${url}`);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Rate fetch failed: ${response.status}`);
        
        const data = await response.json();
        
        // API returns: { amount: 1.0, base: 'USD', date: '...', rates: { JPY: 148.5 } }
        const rate = data.rates[toCurrency];

        // 4. Update Cache
        rateCache[cacheKey] = { rate: rate, timestamp: now };
        
        return rate;
    } catch (error) {
        console.error("Currency API Error:", error);
        return null; // Return null so UI can ask user for manual input
    }
}

/**
 * Format a value in the target currency.
 * @param {number} amount 
 * @param {string} currencyCode 
 */
export function formatCurrency(amount, currencyCode) {
    return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: currencyCode 
    }).format(amount);
}