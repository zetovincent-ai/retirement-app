// === DATABASE FUNCTIONS ===
// This module handles all direct interactions with the Supabase database
// for fetching and saving application data.

import { supabaseClient } from './supabase.js';
import * as state from './state.js';
import { showNotification } from './ui.js';
import { parseUTCDate } from './calculations.js';
import { renderAll } from './grid.js'; 

// --- Core Data Fetch ---

export async function fetchData() {
    console.log("Attempting to fetch data...");
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
         console.log("No user logged in for fetchData, clearing local state.");
         state.setAppState({ 
             incomes: [], expenses: [], transactions: [], accounts: [], transfers: [], 
             reconciliation_log: [], trips: [] 
         });
         renderAll(); // Note: We might need a renderTravel() here later
         return;
    }
    console.log("Fetching data for user:", user.id);

    // Use Promise.all to fetch concurrently
    const [
        { data: incomes, error: incomesError },
        { data: expenses, error: expensesError },
        { data: transactions, error: transactionsError },
        { data: accounts, error: accountsError },
        { data: transfers, error: transfersError },
        { data: reconciliation_log, error: reconciliationError },
        // ⭐️ NEW: Fetch Trips ⭐️
        { data: trips, error: tripsError }
    ] = await Promise.all([
        supabaseClient.from('incomes').select('*').eq('user_id', user.id),
        supabaseClient.from('expenses').select('*').eq('user_id', user.id),
        supabaseClient.from('transaction_log').select('*').eq('user_id', user.id),
        supabaseClient.from('accounts').select('*').eq('user_id', user.id),
        supabaseClient.from('transfers').select('*').eq('user_id', user.id),
        supabaseClient.from('reconciliation_log').select('*').eq('user_id', user.id),
        // ⭐️ NEW ⭐️
        supabaseClient.from('trips').select('*').eq('user_id', user.id)
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

    if (reconciliationError) console.error('Error fetching reconciliation_log:', reconciliationError);
    else newAppState.reconciliation_log = reconciliation_log || [];

    // ⭐️ NEW ⭐️
    if (tripsError) console.error('Error fetching trips:', tripsError);
    else newAppState.trips = trips || [];

    state.setAppState(newAppState);

    console.log("Data fetch complete, rendering UI.");
    renderAll(); 
    // We will hook up the specific Trip Planner render function in the next step
}

// --- Transaction Log Functions ---

export function findTransactionStatus(itemId, itemType, occurrenceDate) {
    if (!state.appState.transactions) return null;
    const dateString = occurrenceDate.toISOString().split('T')[0];
    return state.appState.transactions.find(t =>
        t.item_id === itemId &&
        t.item_type === itemType &&
        t.occurrence_date === dateString
    );
}

export async function saveTransactionStatus(itemId, itemType, dateString, newStatus) {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
        showNotification("You must be logged in.", "error");
        return;
    }

    const existingRecordIndex = state.appState.transactions.findIndex(t =>
        t.item_id === itemId &&
        t.item_type === itemType &&
        t.occurrence_date === dateString
    );
    const existingRecord = existingRecordIndex !== -1 ? state.appState.transactions[existingRecordIndex] : null;
    
    let error;
    let updatedRecordData = { 
         user_id: user.id,
         item_id: itemId,
         item_type: itemType,
         occurrence_date: dateString,
         status: newStatus 
    };

    if (existingRecord) {
        updatedRecordData.id = existingRecord.id; 
        const { error: updateError } = await supabaseClient
            .from('transaction_log')
            .update({ status: newStatus })
            .eq('id', existingRecord.id);
        error = updateError;
    } else {
        const { data: insertedData, error: insertError } = await supabaseClient
            .from('transaction_log')
            .insert({
                user_id: user.id,
                item_id: itemId,
                item_type: itemType,
                occurrence_date: dateString,
                status: newStatus
            })
            .select('id')
            .single();
        
        if (insertedData) {
            updatedRecordData.id = insertedData.id;
        }
        error = insertError;
    }

    if (error) {
        console.error("Error saving transaction status:", error);
        showNotification(`Error saving status: ${error.message}`, "error");
    } else {
        let newTransactions = [...state.appState.transactions];
        if (existingRecordIndex !== -1) {
            newTransactions[existingRecordIndex] = { ...existingRecord, status: newStatus };
        } else {
             newTransactions.push({ 
                  ...updatedRecordData, 
                  original_amount: null, 
                  edited_amount: null 
             }); 
        }
        state.setAppState({ ...state.appState, transactions: newTransactions });

        try {
             const s = await import('./selectors.js');
             const gridContainer = s.gridMonthlyContent.style.display !== 'none' ? s.gridMonthlyContent : s.gridDetailContent;
             const rowSelector = `tr[data-item-id="${itemId}"][data-item-type="${itemType}"][data-date="${dateString}"]`;
             const rowElement = gridContainer.querySelector(rowSelector);

             if (rowElement) {
                 rowElement.classList.remove('row-paid', 'row-overdue', 'row-highlighted', 'row-pending');
                 if (newStatus !== 'pending') {
                      rowElement.classList.add(`row-${newStatus}`);
                 }
             }
        } catch(domError) {
             console.error("Error updating DOM directly:", domError);
        }
        
        showNotification("Status updated!", "success");
    }
}

export function getDynamicAmortization(item) {
    const edits = state.appState.transactions.filter(t => 
        t.item_id === item.id && 
        t.item_type === 'expense' && 
        t.edited_amount !== null
    ).reduce((acc, t) => {
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
        const currentDate = new Date(parseUTCDate(item.start_date).getTime());
        currentDate.setUTCMonth(currentDate.getUTCMonth() + (month - 1));
        const dateString = currentDate.toISOString().split('T')[0];
        
        const paymentAmount = edits[dateString] || defaultPayment;
        const interestPayment = remainingBalance * monthlyRate;
        let principalPayment = paymentAmount - interestPayment;
        
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
        
        if (month > 1000) break; 
        month++;
    }

    return {
        schedule: schedule,
        trueTotalMonths: schedule.length
    };
}

export async function saveTransactionAmount(itemId, itemType, dateString, originalAmount, newAmount) {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
        showNotification("You must be logged in.", "error");
        return;
    }

    if (state.activeDashboardTab === 'grids' && state.activeGridView === 'yearly') {
        const s = await import('./selectors.js');
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
    } else {
         state.setLastNumYears(null);
         state.setLastOpenYear(null);
    }

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

    let parentItem;
    if (itemType === 'expense') {
        parentItem = state.appState.expenses.find(i => i.id === itemId);
    } else if (itemType === 'income') {
        parentItem = state.appState.incomes.find(i => i.id === itemId);
    } else if (itemType === 'transfer') {
        parentItem = state.appState.transfers.find(i => i.id === itemId);
    }

    if (parentItem && parentItem.advanced_data && (parentItem.advanced_data.item_type === 'Mortgage/Loan' || parentItem.advanced_data.item_type === 'Car Loan')) {
        showNotification("Recalculating loan forecast...", "success");

        const { data: transactions, error: transactionsError } = await supabaseClient
            .from('transaction_log').select('*').eq('user_id', user.id).eq('item_id', itemId);

        if (transactionsError) {
             console.error("Error fetching transactions for recalc:", transactionsError);
        } else {
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

    await fetchData(); 
}

export async function revertTransactionAmount(itemId, itemType, dateString) {
    const existingRecord = findTransactionStatus(itemId, itemType, parseUTCDate(dateString));
    
    if (!existingRecord || existingRecord.edited_amount === null) {
        showNotification("Amount is already set to original.", "success");
        return;
    }

    const { error } = await supabaseClient
        .from('transaction_log')
        .update({ edited_amount: null })
        .eq('id', existingRecord.id);

    if (error) {
        console.error("Error reverting amount:", error);
        showNotification(`Error reverting amount: ${error.message}`, "error");
    } else {
        await saveTransactionAmount(itemId, itemType, dateString, 0, null);
    }
}

// === ⭐️ NEW: TRIP FUNCTIONS ⭐️ ===

export async function saveTrip(tripData) {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) { showNotification("You must be logged in.", "error"); return; }

    const tripPayload = {
        ...tripData,
        user_id: user.id
    };

    let error;
    if (tripData.id) {
        // Update
        const { error: updateError } = await supabaseClient
            .from('trips')
            .update(tripPayload)
            .eq('id', tripData.id);
        error = updateError;
    } else {
        // Insert
        const { error: insertError } = await supabaseClient
            .from('trips')
            .insert([tripPayload]);
        error = insertError;
    }

    if (error) {
        console.error("Error saving trip:", error);
        showNotification(`Error saving trip: ${error.message}`, 'error');
        return false;
    } else {
        showNotification("Trip saved successfully!", "success");
        await fetchData();
        return true;
    }
}

export async function deleteTrip(tripId) {
    if (!confirm("Are you sure you want to delete this trip?")) return;
    
    const { error } = await supabaseClient
        .from('trips')
        .delete()
        .eq('id', tripId);

    if (error) {
        console.error("Error deleting trip:", error);
        showNotification(`Error deleting trip: ${error.message}`, 'error');
    } else {
        showNotification("Trip deleted.", "success");
        await fetchData();
    }
}