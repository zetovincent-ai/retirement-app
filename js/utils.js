// === UTILITY FUNCTIONS ===
// Shared helper functions used across multiple modules.
// Keep this file free of DOM or state dependencies.

/**
 * Formats a number as USD currency string.
 * @param {number} num - The number to format.
 * @returns {string} Formatted currency string (e.g., "$1,234.56").
 */
export function formatCurrency(num) {
    return num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}
