// === CALCULATION FUNCTIONS ===
// A module for all pure data-manipulation and calculation functions.
// These functions do not depend on DOM elements or other modules.

/**
 * Parses a 'YYYY-MM-DD' date string as UTC to avoid timezone issues.
 * @param {string} dateString - The date string to parse.
 * @returns {Date} A Date object set to midnight UTC for that date.
 */
export function parseUTCDate(dateString) {
    if (!dateString) return null;
    // T00:00:00Z specifies UTC (Zulu) time.
    const date = new Date(dateString + 'T00:00:00Z');
    if (isNaN(date.getTime())) {
         console.warn(`Invalid date string provided: ${dateString}`);
         return null;
    }
    return date;
}

export function calculateMonthlyTotal(items){
    if(!items)return 0;
    return items.reduce((total,item)=>{
        if(!item||typeof item.amount!=='number'||item.amount<0)return total;
        switch(item.interval){
            case'monthly':return total+item.amount;
            case'annually':return total+(item.amount/12);
            case'bi-annual':return total+(item.amount/6); // 2 payments / 12 months
            case'quarterly':return total+(item.amount/3);
            case'bi-weekly':return total+((item.amount*26)/12);
            case'weekly':return total+((item.amount*52)/12);
            default:return total
        }
    },0)
}

/**
 * Calculates the monthly payment and amortization schedule for a loan.
 * @param {number} principal - The initial loan amount.
 * @param {number} annualRate - The annual interest rate (e.g., 0.065 for 6.5%).
 * @param {number} termMonths - The loan term in months (e.g., 360 for 30 years).
 * @returns {object | null} An object containing the monthly payment and the schedule array, or null if inputs are invalid.
 */
export function calculateAmortization(principal, annualRate, termMonths) {
    if (principal <= 0 || annualRate < 0 || termMonths <= 0) {
        console.error("Invalid input for amortization calculation.");
        return null;
    }

    const monthlyRate = annualRate / 12;
    let monthlyPayment;

    // Calculate monthly payment using the standard formula
    // Handle edge case of 0% interest
    if (monthlyRate === 0) {
        monthlyPayment = principal / termMonths;
    } else {
        monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
    }

    let remainingBalance = principal;
    const schedule = [];

    for (let month = 1; month <= termMonths; month++) {
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        remainingBalance -= principalPayment;

        // Ensure remaining balance doesn't go negative due to rounding at the end
        if (month === termMonths && Math.abs(remainingBalance) < 0.01) {
            remainingBalance = 0;
        }
         // Handle potential minor overpayment on the last month due to rounding
         const actualPayment = (month === termMonths && remainingBalance < 0) ? monthlyPayment + remainingBalance : monthlyPayment;


        schedule.push({
            month: month,
            payment: actualPayment, // Use potentially adjusted last payment
            principalPayment: principalPayment + (month === termMonths && remainingBalance < 0 ? remainingBalance : 0), // Adjust last principal payment
            interestPayment: interestPayment,
            remainingBalance: remainingBalance > 0 ? remainingBalance : 0 // Don't show negative balance
        });

        if (remainingBalance <= 0) break; // Exit loop if balance is paid off early (unlikely with fixed payments but good practice)
    }

    return {
        monthlyPayment: monthlyPayment,
        schedule: schedule
    };
}

/**
 * Generates an array of Date objects for the first of each month to render.
 * @param {Date} startDate - The date to start from (e.g., new Date()).
 * @param {number} numMonths - The number of months to generate.
 * @returns {Date[]} An array of Date objects, each set to the 1st of the month.
 */
export function getMonthsToRender(startDate, numMonths) {
    const months = [];
    // Get the year and month of the starting date
    const startYear = startDate.getUTCFullYear();
    const startMonth = startDate.getUTCMonth();

    for (let i = 0; i < numMonths; i++) {
        // Create a new date set to the 1st of the month
        // We use UTC methods to remain consistent
        const monthDate = new Date(Date.UTC(startYear, startMonth + i, 1));
        months.push(monthDate);
    }
    return months;
}

/**
 * Calculates all occurrences of a recurring item within a given month.
 * @param {object} item - The income or expense item (must have start_date and interval).
 * @param {Date} monthDate - A Date object representing the *start* of the target month (e.g., Oct 1, 2025).
 * @returns {Date[]} An array of Date objects for each occurrence in that month.
 */
export function getOccurrencesInMonth(item, monthDate) {
    const occurrences = [];
    const itemStartDate = parseUTCDate(item.start_date);

    if (!itemStartDate) return []; // No start date, can't calculate

    // --- NEW: Determine the payoff date for loans ---
    let payoffDate = null;
    if (item.advanced_data && (item.advanced_data.item_type === 'Mortgage/Loan' || item.advanced_data.item_type === 'Car Loan')) {
        const totalPayments = item.advanced_data.total_payments;
        if (totalPayments && totalPayments > 0) {
            payoffDate = new Date(itemStartDate.getTime());
            // Set the date to the *first day* it is paid off
            // e.g., 30 payments. Start Jan 1. Last payment is June 1 (month 5 + 29). 
            // payoffDate will be July 1 (month 0 + 30).
            payoffDate.setUTCMonth(itemStartDate.getUTCMonth() + totalPayments);
        }
    }

    // Get the boundaries of the target month in UTC
    const targetYear = monthDate.getUTCFullYear();
    const targetMonth = monthDate.getUTCMonth();
    
    const monthStart = new Date(Date.UTC(targetYear, targetMonth, 1));
    // Get the *end* of the month (start of next month, minus 1 millisecond)
    const monthEnd = new Date(Date.UTC(targetYear, targetMonth + 1, 0, 23, 59, 59, 999));
    
    // Optimization: If the item starts *after* this month ends, skip it.
    if (item.interval !== 'one-time' && itemStartDate > monthEnd) {
        return [];
    }
    
    // --- NEW: Optimization: If the payoff date is *before* this month starts, skip it. ---
    if (payoffDate && payoffDate <= monthStart) {
        return [];
    }

    const itemStartDayOfMonth = itemStartDate.getUTCDate(); // e.g., 15

    switch (item.interval) {
        case 'one-time':
            if (itemStartDate >= monthStart && itemStartDate <= monthEnd) {
                // Check against payoff date (for a 1-payment loan, this would be true)
                if (!payoffDate || itemStartDate < payoffDate) {
                    occurrences.push(itemStartDate);
                }
            }
            break;

        case 'monthly':
            if (itemStartDate <= monthEnd) {
                const potentialDate = new Date(Date.UTC(targetYear, targetMonth, itemStartDayOfMonth));
                if (potentialDate.getUTCMonth() === targetMonth && potentialDate >= monthStart && potentialDate >= itemStartDate) {
                    // --- NEW: Check if this date is before the payoff date ---
                    if (!payoffDate || potentialDate < payoffDate) {
                        occurrences.push(potentialDate);
                    }
                }
            }
            break;

        case 'annually':
            if (itemStartDate.getUTCMonth() === targetMonth && itemStartDate <= monthEnd) {
                const potentialDate = new Date(Date.UTC(targetYear, targetMonth, itemStartDayOfMonth));
                if (potentialDate.getUTCMonth() === targetMonth && potentialDate >= itemStartDate) {
                     // --- NEW: Check if this date is before the payoff date ---
                    if (!payoffDate || potentialDate < payoffDate) {
                        occurrences.push(potentialDate);
                    }
                }
            }
            break;

        case 'bi-annual':
            // Check if this month is the start month OR 6 months after the start month
            const startMonth = itemStartDate.getUTCMonth();
            const secondMonth = (startMonth + 6) % 12;
            
            if ((targetMonth === startMonth || targetMonth === secondMonth) && itemStartDate <= monthEnd) {
                 const potentialDate = new Date(Date.UTC(targetYear, targetMonth, itemStartDayOfMonth));
                 if (potentialDate.getUTCMonth() === targetMonth && potentialDate >= itemStartDate) {
                    // --- NEW: Check if this date is before the payoff date ---
                    if (!payoffDate || potentialDate < payoffDate) {
                        occurrences.push(potentialDate);
                    }
                 }
            }
            break;

        case 'quarterly':
            const monthDiff = (targetMonth - itemStartDate.getUTCMonth()) + (targetYear - itemStartDate.getUTCFullYear()) * 12;
            if (monthDiff >= 0 && monthDiff % 3 === 0 && itemStartDate <= monthEnd) {
                const potentialDate = new Date(Date.UTC(targetYear, targetMonth, itemStartDayOfMonth));
                if (potentialDate.getUTCMonth() === targetMonth && potentialDate >= itemStartDate) {
                     // --- NEW: Check if this date is before the payoff date ---
                    if (!payoffDate || potentialDate < payoffDate) {
                        occurrences.push(potentialDate);
                    }
                }
            }
            break;

        case 'weekly':
        case 'bi-weekly':
            const daysToAdd = (item.interval === 'weekly' ? 7 : 14);
            let currentDate = parseUTCDate(item.start_date);
            
            while (currentDate <= monthEnd) {
                // --- NEW: Stop loop if we're at or past the payoff date ---
                if (payoffDate && currentDate >= payoffDate) {
                    break;
                }

                if (currentDate >= monthStart) {
                    occurrences.push(new Date(currentDate.getTime())); // Add a copy
                }
                // Move to the next occurrence
                currentDate.setUTCDate(currentDate.getUTCDate() + daysToAdd);
            }
            break;

        default:
            console.warn(`Unknown interval: ${item.interval}`);
    }
    
    return occurrences;
}

/**
 * Calculates the payment number for a loan based on its occurrence date.
 * @param {string} startDateString - The 'YYYY-MM-DD' start date of the loan.
 * @param {Date} occurrenceDate - The UTC Date object of the specific payment.
 * @param {string} interval - The item's interval ('monthly', 'weekly', etc.).
 * @returns {number} The payment number (e.g., 1, 2, 30).
 */
export function calculatePaymentNumber(startDateString, occurrenceDate, interval) {
    try {
        const itemStartDate = parseUTCDate(startDateString);
        if (!itemStartDate) return null;

        // Use Math.round to account for small DST/leap second discrepancies
        const msPerDay = 1000 * 60 * 60 * 24;
        const diffInMs = occurrenceDate.getTime() - itemStartDate.getTime();
        const diffInDays = Math.round(diffInMs / msPerDay);

        switch (interval) {
            case 'monthly':
                const yearDiff = occurrenceDate.getUTCFullYear() - itemStartDate.getUTCFullYear();
                const monthDiff = occurrenceDate.getUTCMonth() - itemStartDate.getUTCMonth();
                return (yearDiff * 12) + monthDiff + 1;
            case 'annually':
                return (occurrenceDate.getUTCFullYear() - itemStartDate.getUTCFullYear()) + 1;
            case 'quarterly':
                const qYearDiff = occurrenceDate.getUTCFullYear() - itemStartDate.getUTCFullYear();
                const qMonthDiff = occurrenceDate.getUTCMonth() - itemStartDate.getUTCMonth();
                return ((qYearDiff * 12) + qMonthDiff) / 3 + 1;
            case 'weekly':
                return Math.round(diffInDays / 7) + 1;
            case 'bi-weekly':
                return Math.round(diffInDays / 14) + 1;
            default:
                return 1; // For 'one-time' or unknown
        }
    } catch (e) {
        console.error("Error calculating payment number:", e);
        return null;
    }
}