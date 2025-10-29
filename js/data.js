// === DATABASE FUNCTIONS ===
// This module handles all direct interactions with the Supabase database
// for fetching and saving application data.

import { supabaseClient } from './supabase.js';
import * as state from './state.js';
import { showNotification } from './ui.js';
import { parseUTCDate } from './calculations.js';
import { renderAll } from './grid.js'; // We'll create this in the next step

// --- Core Data Fetch ---

export async function fetchData() {
    console.log("Attempting to fetch data...");
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
         console.log("No user logged in for fetchData, clearing local state.");
         state.setAppState({ incomes: [], expenses: [], transactions: [], accounts: [], transfers: [] }); // Clear all
         renderAll();
         return;
    }
    console.log("Fetching data for user:", user.id);

    // Use Promise.all to fetch concurrently
    const [
        { data: incomes, error: incomesError },
        { data: expenses, error: expensesError },
        { data: transactions, error: transactionsError },
        { data: accounts, error: accountsError },
        { data: transfers, error: transfersError }
    ] = await Promise.all([
        supabaseClient.from('incomes').select('*').eq('user_id', user.id),
        supabaseClient.from('expenses').select('*').eq('user_id', user.id),
        supabaseClient.from('transaction_log').select('*').eq('user_id', user.id),
        supabaseClient.from('accounts').select('*').eq('user_id', user.id),
        supabaseClient.from('transfers').select('*').eq('user_id', user.id)
    ]);

    let newAppState = { ...state.appState };

    if (incomesError) console.error('Error fetching incomes:', incomesError);
    else newAppState.incomes = incomes || [];

    if (expensesError) console.error('Error fetching expenses:', expensesError);
    else newAppState.expenses = expenses || [];

    if (transactionsError) console.error('Error fetching transactions:', transactionsError);
    else newAppState.transactions = transactions || [];

    if (accountsError) console.error('Error fetching accounts:', accountsError);
    else newAppState.accounts = accounts || [];

    if (transfersError) console.error('Error fetching transfers:', transfersError);
    else newAppState.transfers = transfers || [];

    state.setAppState(newAppState);

    console.log("Data fetch complete, rendering UI.");
    renderAll();
}

// --- Transaction Log Functions ---

/**
 * Finds the status record for a specific item occurrence.
 * @param {number} itemId - The ID of the parent income/expense item.
 * @param {string} itemType - "income" or "expense".
 * @param {Date} occurrenceDate - The UTC Date object for the occurrence.
 * @returns {object | null} The transaction log entry, or null if not found.
 */
export function findTransactionStatus(itemId, itemType, occurrenceDate) {
    if (!state.appState.transactions) return null;
    
    // Convert the UTC date object to a 'YYYY-MM-DD' string for comparison
    const dateString = occurrenceDate.toISOString().split('T')[0];
    
    return state.appState.transactions.find(t =>
        t.item_id === itemId &&
        t.item_type === itemType &&
        t.occurrence_date === dateString
    );
}

/**
 * Saves or updates the status of a specific transaction.
 * @param {number} itemId
 * @param {string} itemType
 * @param {string} dateString - 'YYYY-MM-DD'
 * @param {string} newStatus - 'paid', 'overdue', 'pending'
 */
export async function saveTransactionStatus(itemId, itemType, dateString, newStatus) {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
        showNotification("You must be logged in.", "error");
        return;
    }

    // 1. Find existing record in local state first
    const existingRecordIndex = state.appState.transactions.findIndex(t =>
        t.item_id === itemId &&
        t.item_type === itemType &&
        t.occurrence_date === dateString
    );
    const existingRecord = existingRecordIndex !== -1 ? state.appState.transactions[existingRecordIndex] : null;
    
    let error;
    let updatedRecordData = { // Prepare data for local update
         user_id: user.id,
         item_id: itemId,
         item_type: itemType,
         occurrence_date: dateString,
         status: newStatus 
    };

    if (existingRecord) {
        // 2. Update existing record in Supabase
        console.log(`Updating status to ${newStatus} for record ${existingRecord.id}`);
        updatedRecordData.id = existingRecord.id; // Include ID for local update
        const { error: updateError } = await supabaseClient
            .from('transaction_log')
            .update({ status: newStatus })
            .eq('id', existingRecord.id);
        error = updateError;
    } else {
        // 3. Insert new record in Supabase
        console.log(`Inserting new ${newStatus} record for item ${itemId} on ${dateString}`);
         // We need the ID back for local state if inserting
        const { data: insertedData, error: insertError } = await supabaseClient
            .from('transaction_log')
            .insert({
                user_id: user.id,
                item_id: itemId,
                item_type: itemType,
                occurrence_date: dateString,
                status: newStatus
            })
            .select('id') // Get the new ID back
            .single(); // Expecting only one row
        
        if (insertedData) {
            updatedRecordData.id = insertedData.id; // Add new ID for local update
        }
        error = insertError;
    }

    if (error) {
        console.error("Error saving transaction status:", error);
        showNotification(`Error saving status: ${error.message}`, "error");
    } else {
        // 4. Update local appState
        let newTransactions = [...state.appState.transactions];
        if (existingRecordIndex !== -1) {
            // Update existing entry
            newTransactions[existingRecordIndex] = { ...existingRecord, status: newStatus };
        } else {
             // Add new entry
             newTransactions.push({ 
                  ...updatedRecordData, 
                  original_amount: null, // Add default nulls
                  edited_amount: null 
             }); 
        }
        state.setAppState({ ...state.appState, transactions: newTransactions });

        // 5. Update the specific row in the DOM directly
        try {
             // Find the row using data attributes
             const s = await import('./selectors.js'); // Dynamically import selectors
             const gridContainer = s.gridMonthlyContent.style.display !== 'none' ? s.gridMonthlyContent : s.gridDetailContent;
             const rowSelector = `tr[data-item-id="${itemId}"][data-item-type="${itemType}"][data-date="${dateString}"]`;
             const rowElement = gridContainer.querySelector(rowSelector);

             if (rowElement) {
                 // Remove old status classes, add new one
                 rowElement.classList.remove('row-paid', 'row-overdue', 'row-highlighted', 'row-pending');
                 if (newStatus !== 'pending') {
                      rowElement.classList.add(`row-${newStatus}`);
                 }
                 console.log(`Updated DOM row class for ${itemId} on ${dateString} to ${newStatus}`);
             } else {
                  console.warn(`Could not find DOM row element to update for ${itemId} on ${dateString}.`);
             }
        } catch(domError) {
             console.error("Error updating DOM directly:", domError);
        }
        
        showNotification("Status updated!", "success");
        // DO NOT CALL fetchData() here for status changes.
    }
}

/**
 * The "Brain": Calculates a fully dynamic amortization schedule.
 * Scans the transaction_log for any edited payments.
 * @param {object} item - The parent expense item (must be a loan).
 * @returns {object} An object containing the new { schedule, trueTotalMonths }.
 */
export function getDynamicAmortization(item) {
    // Find all edited transactions for *this specific loan*
    const edits = state.appState.transactions.filter(t => 
        t.item_id === item.id && 
        t.item_type === 'expense' && 
        t.edited_amount !== null
    ).reduce((acc, t) => {
        // Create a map for fast lookup: 'YYYY-MM-DD' -> amount
        acc[t.occurrence_date] = t.edited_amount;
        return acc;
    }, {});

    const principal = item.advanced_data.original_principal;
    const annualRate = item.advanced_data.interest_rate;
    const defaultPayment = item.amount;
    
    if (principal <= 0 || annualRate < 0) return null;

    const monthlyRate = annualRate / 12;
    let remainingBalance = principal;
    const schedule = [];
    let month = 1;

    while (remainingBalance > 0.01) {
        // 1. Determine the payment for *this* month
        const currentDate = new Date(parseUTCDate(item.start_date).getTime());
        currentDate.setUTCMonth(currentDate.getUTCMonth() + (month - 1));
        const dateString = currentDate.toISOString().split('T')[0];
        
        const paymentAmount = edits[dateString] || defaultPayment;
        
        // 2. Run the calculation
        const interestPayment = remainingBalance * monthlyRate;
        let principalPayment = paymentAmount - interestPayment;
        
        // 3. Handle the final payment
        if (remainingBalance + interestPayment <= paymentAmount) {
            principalPayment = remainingBalance;
            remainingBalance = 0;
        } else {
            remainingBalance -= principalPayment;
        }

        schedule.push({
            month: month,
            payment: principalPayment + interestPayment,
            principalPayment: principalPayment,
            interestPayment: interestPayment,
            remainingBalance: remainingBalance
        });
        
        // Safety break after 1000 payments (83 years)
        if (month > 1000) break; 
        month++;
    }

    return {
        schedule: schedule,
        trueTotalMonths: schedule.length
    };
}

/**
 * The "Trigger": Saves a new amount, stores the original, and recalculates loans.
 */
export async function saveTransactionAmount(itemId, itemType, dateString, originalAmount, newAmount) {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
        showNotification("You must be logged in.", "error");
        return;
    }

    // --- Remember state before potential refresh ---
    if (state.activeDashboardTab === 'grids' && state.activeGridView === 'yearly') {
        const s = await import('./selectors.js'); // Dynamic import
        const numYearsInput = s.gridYearlySummaryPanel.querySelector('#yearly-forecast-years');
        const summaryHeader = s.gridYearlySummaryPanel.querySelector('.yearly-summary-header h4');

        if (numYearsInput && numYearsInput.style.display !== 'none') {
            state.setLastNumYears(parseInt(numYearsInput.value, 10));
        } else if (summaryHeader) {
            const match = summaryHeader.textContent.match(/^(\d+)-Year Summary$/);
            if (match) state.setLastNumYears(parseInt(match[1], 10));
        }

        const detailGridHeader = s.gridDetailContent.querySelector('.month-grid-header');
        if (detailGridHeader) {
            const yearMatch = detailGridHeader.textContent.match(/\b(\d{4})\b$/);
            if (yearMatch) state.setLastOpenYear(parseInt(yearMatch[1], 10));
        }
        console.log(`Remembering state: ${state.lastNumYears} years, open year: ${state.lastOpenYear}`);
    } else {
         state.setLastNumYears(null);
         state.setLastOpenYear(null);
    }
    // --- END Remember state ---


    const existingRecord = findTransactionStatus(itemId, itemType, parseUTCDate(dateString));
    let error;

    let updateData = {
        edited_amount: newAmount,
        user_id: user.id,
        item_id: itemId,
        item_type: itemType,
        occurrence_date: dateString
    };

    if (existingRecord) {
        if (existingRecord.original_amount === null) {
            updateData.original_amount = originalAmount;
        }
        const { error: updateError } = await supabaseClient
            .from('transaction_log')
            .update(updateData)
            .eq('id', existingRecord.id);
        error = updateError;
    } else {
        updateData.original_amount = originalAmount;
        const { error: insertError } = await supabaseClient
            .from('transaction_log')
            .insert(updateData);
        error = insertError;
    }

    if (error) {
        console.error("Error saving transaction amount:", error);
        showNotification(`Error saving amount: ${error.message}`, "error");
        state.setLastNumYears(null);
        state.setLastOpenYear(null);
        return;
    }

    // --- RECALCULATION STEP ---
    const parentItem = (itemType === 'expense' ? state.appState.expenses : state.appState.incomes).find(i => i.id === itemId);

    if (parentItem && parentItem.advanced_data && (parentItem.advanced_data.item_type === 'Mortgage/Loan' || parentItem.advanced_data.item_type === 'Car Loan')) {
        showNotification("Recalculating loan forecast...", "success");

        const { data: transactions, error: transactionsError } = await supabaseClient
            .from('transaction_log').select('*').eq('user_id', user.id).eq('item_id', itemId);

        if (transactionsError) {
             console.error("Error fetching transactions for recalc:", transactionsError);
        } else {
            // Update transactions in state
            const newTransactions = [
                ...state.appState.transactions.filter(t => t.item_id !== itemId),
                ...transactions
            ];
            state.setAppState({ ...state.appState, transactions: newTransactions });
        }

        const dynamicSchedule = getDynamicAmortization(parentItem);

        if (dynamicSchedule) {
            const newTotalPayments = dynamicSchedule.trueTotalMonths;
            const newAdvancedData = { ...parentItem.advanced_data, total_payments: newTotalPayments };

            const { error: parentUpdateError } = await supabaseClient
                .from('expenses')
                .update({ advanced_data: newAdvancedData })
                .eq('id', parentItem.id);

            if (parentUpdateError) {
                console.error("Error updating parent loan item:", parentUpdateError);
                showNotification("Error updating loan term.", "error");
                state.setLastNumYears(null);
                state.setLastOpenYear(null);
            } else {
                showNotification(`Loan term updated to ${newTotalPayments} months!`, "success");
            }
        } else {
             state.setLastNumYears(null);
             state.setLastOpenYear(null);
        }
    }

    await fetchData(); // Full refresh will trigger renderAll, which now handles restore
}

/**
 * Reverts an edited amount back to its original value.
 */
export async function revertTransactionAmount(itemId, itemType, dateString) {
    const existingRecord = findTransactionStatus(itemId, itemType, parseUTCDate(dateString));
    
    if (!existingRecord || existingRecord.edited_amount === null) {
        showNotification("Amount is already set to original.", "success");
        return;
    }

    // Simply set edited_amount to null. The original_amount stays as a historical record.
    const { error } = await supabaseClient
        .from('transaction_log')
        .update({ edited_amount: null })
        .eq('id', existingRecord.id);

    if (error) {
        console.error("Error reverting amount:", error);
        showNotification(`Error reverting amount: ${error.message}`, "error");
    } else {
        // Trigger the same save logic to force a recalc
        await saveTransactionAmount(itemId, itemType, dateString, 0, null);
    }
}