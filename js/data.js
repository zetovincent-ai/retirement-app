// === DATABASE FUNCTIONS ===
// This module handles all direct interactions with the Supabase database
// for fetching and saving application data.

import { supabaseClient } from './supabase.js';
import * as state from './state.js';
import { showNotification } from './ui.js';
import { parseUTCDate, getOccurrencesInMonth } from './calculations.js'; 
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
         renderAll(); 
         return;
    }
    console.log("Fetching data for user:", user.id);

    const [
        { data: incomes, error: incomesError },
        { data: expenses, error: expensesError },
        { data: transactions, error: transactionsError },
        { data: accounts, error: accountsError },
        { data: transfers, error: transfersError },
        { data: reconciliation_log, error: reconciliationError },
        { data: trips, error: tripsError }
    ] = await Promise.all([
        supabaseClient.from('incomes').select('*').eq('user_id', user.id),
        supabaseClient.from('expenses').select('*').eq('user_id', user.id),
        supabaseClient.from('transactions').select('*').eq('user_id', user.id),
        supabaseClient.from('accounts').select('*').eq('user_id', user.id),
        supabaseClient.from('transfers').select('*').eq('user_id', user.id),
        supabaseClient.from('reconciliation_log').select('*').eq('user_id', user.id),
        supabaseClient.from('trips').select('*').eq('user_id', user.id)
    ]);

    if (incomesError || expensesError || transactionsError || accountsError || transfersError || reconciliationError || tripsError) {
        console.error("Error fetching data:", incomesError || expensesError || transactionsError);
        return;
    }

    state.setAppState({
        incomes: incomes || [],
        expenses: expenses || [],
        transactions: transactions || [],
        accounts: accounts || [],
        transfers: transfers || [],
        reconciliation_log: reconciliation_log || [],
        trips: trips || []
    });

    console.log("Data fetched successfully. App State:", state.appState);
    renderAll();
    
    // Trigger travel render if available
    if (typeof window.renderTripsList === 'function') {
        window.renderTripsList();
    } else {
        import('./travel.js').then(module => {
            if (module.renderTripsList) module.renderTripsList();
        });
    }
}

// --- Transaction Status Management ---

export function findTransactionStatus(itemId, itemType, date) {
    const dateString = date.toISOString().split('T')[0];
    return state.appState.transactions.find(t => 
        t.item_id === itemId && 
        t.item_type === itemType && 
        t.occurrence_date === dateString
    );
}

export async function saveTransactionStatus(itemId, itemType, date, status) {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return;

    const dateString = date.toISOString().split('T')[0];
    const existingRecord = findTransactionStatus(itemId, itemType, date);

    if (existingRecord) {
        const { error } = await supabaseClient
            .from('transactions')
            .update({ status: status })
            .eq('id', existingRecord.id);
        if (error) console.error("Error updating status:", error);
    } else {
        const { error } = await supabaseClient
            .from('transactions')
            .insert([{
                user_id: user.id,
                item_id: itemId,
                item_type: itemType,
                occurrence_date: dateString,
                status: status,
                edited_amount: null
            }]);
        if (error) console.error("Error inserting status:", error);
    }
    await fetchData();
}

export async function saveTransactionAmount(itemId, itemType, date, newAmount) {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return;

    const dateString = date.toISOString().split('T')[0];
    const existingRecord = findTransactionStatus(itemId, itemType, date);

    if (existingRecord) {
        const { error } = await supabaseClient
            .from('transactions')
            .update({ edited_amount: newAmount })
            .eq('id', existingRecord.id);
        if (error) console.error("Error updating amount:", error);
    } else {
        const { error } = await supabaseClient
            .from('transactions')
            .insert([{
                user_id: user.id,
                item_id: itemId,
                item_type: itemType,
                occurrence_date: dateString,
                status: 'pending',
                edited_amount: newAmount
            }]);
        if (error) console.error("Error inserting amount:", error);
    }
    await fetchData();
}

export async function revertTransactionAmount(itemId, itemType, date) {
    const existingRecord = findTransactionStatus(itemId, itemType, date);
    if (existingRecord) {
        const { error } = await supabaseClient
            .from('transactions')
            .update({ edited_amount: null })
            .eq('id', existingRecord.id);
        if (error) console.error("Error reverting amount:", error);
        await fetchData();
    }
}

// --- Trip Management ---

export async function saveTrip(tripData) {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
        showNotification("You must be logged in to save trips.", 'error');
        return false;
    }

    const tripPayload = {
        ...tripData,
        user_id: user.id
    };

    let error;
    if (tripData.id) {
        const { error: updateError } = await supabaseClient
            .from('trips')
            .update(tripPayload)
            .eq('id', tripData.id);
        error = updateError;
    } else {
        delete tripPayload.id; 
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
        // Trigger render
         import('./travel.js').then(module => {
            if (module.renderTripsList) module.renderTripsList();
        });
    }
}

// === ⭐️ NEW: Loan Amortization Engine (Account-Centric) ⭐️ ===
// Calculates payoff for a specific Loan Account by finding all linked expenses.
export function getLoanAmortization(account) {
    if (!account || !account.advanced_data) return null;

    // Debt is stored as negative (e.g., -200,000), but logic is easier with positive principal
    const principal = Math.abs(account.current_balance); 
    const annualRate = account.advanced_data.interest_rate || 0;
    const monthlyRate = annualRate / 12;

    // 1. Find all linked expenses (The "Feeders")
    const linkedExpenses = state.appState.expenses.filter(e => 
        e.advanced_data && e.advanced_data.linked_loan_id === account.id
    );

    // 2. Build a map of "Payment by Month" for next 30 years
    const paymentSchedule = {}; // "YYYY-MM": amount
    
    const startDate = new Date();
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth(); // 0-11

    // Pre-calculate payments for the next 360 months
    for (let i = 0; i < 360; i++) {
        const utcDate = new Date(Date.UTC(startYear, startMonth + i, 1));
        
        let monthlyPayment = 0;
        
        linkedExpenses.forEach(exp => {
            // Check if this expense occurs in this month
            const occurrences = getOccurrencesInMonth(exp, utcDate);
            if (occurrences.length > 0) {
                // Sum up payments (e.g. if weekly, might be 4 or 5)
                monthlyPayment += (exp.amount * occurrences.length);
            }
        });
        
        const dateKey = `${utcDate.getUTCFullYear()}-${String(utcDate.getUTCMonth()+1).padStart(2,'0')}`;
        paymentSchedule[dateKey] = monthlyPayment;
    }

    // 3. Run Amortization Loop
    let remainingBalance = principal;
    const schedule = [];
    let month = 1;

    for (let i = 0; i < 360; i++) {
        if (remainingBalance <= 0.01) break;

        const currentDate = new Date(startYear, startMonth + i, 1);
        const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2,'0')}`;
        
        const payment = paymentSchedule[dateKey] || 0;
        const interest = remainingBalance * monthlyRate;
        let principalPayment = payment - interest;

        // Cap payment at remaining balance
        if (remainingBalance + interest <= payment) {
            principalPayment = remainingBalance;
            remainingBalance = 0;
        } else {
            remainingBalance -= principalPayment;
        }

        schedule.push({
            month: month,
            date: dateKey,
            payment: payment,
            interestPayment: interest,
            principalPayment: principalPayment,
            remainingBalance: remainingBalance
        });
        month++;
    }

    return {
        schedule: schedule,
        trueTotalMonths: schedule.length
    };
}

// === UPDATED: Legacy function for single-item loans ===
// Used for expenses that define their OWN loan terms (not linked to an account)
export function getDynamicAmortization(item) {
    if (!item.advanced_data || !item.advanced_data.original_principal) return null;

    // 1. Get all edits
    const edits = state.appState.transactions.filter(t => 
        t.item_id === item.id && 
        t.item_type === 'expense' && 
        t.edited_amount !== null
    ).reduce((acc, t) => {
        acc[t.occurrence_date] = t.edited_amount;
        return acc;
    }, {});

    const principal = item.advanced_data.original_principal;
    const annualRate = item.advanced_data.interest_rate || 0;
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
        
        const paymentAmount = edits[dateString] !== undefined ? edits[dateString] : defaultPayment;
        
        const interestPayment = remainingBalance * monthlyRate;
        let principalPayment = paymentAmount - interestPayment;
        
        if (remainingBalance + interestPayment <= paymentAmount) {
            principalPayment = remainingBalance;
            remainingBalance = 0;
        } else {
            remainingBalance -= principalPayment;
        }

        if (remainingBalance > principal * 2) break; // Safety break

        schedule.push({
            month: month,
            date: dateString,
            payment: principalPayment + interestPayment,
            principalPayment: principalPayment,
            interestPayment: interestPayment,
            remainingBalance: remainingBalance
        });
        
        if (month > 600) break; 
        month++;
    }

    return {
        schedule: schedule,
        trueTotalMonths: schedule.length
    };
}