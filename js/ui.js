// === UI FUNCTIONS ===
// This module contains all functions that directly manipulate the DOM
// for UI purposes, such as modals, notifications, and rendering lists.

import * as s from './selectors.js';
import * as state from './state.js';
import { supabaseClient } from './supabase.js';
import { fetchData, getDynamicAmortization } from './data.js';
import { calculateAmortization, parseUTCDate } from './calculations.js';

// --- Notification Functions ---

export function showNotification(message, type = 'success') {
    const toast = document.createElement('div');
    toast.classList.add('toast', `toast--${type}`);
    toast.textContent = message;

    s.notificationContainer.appendChild(toast);

    // Remove the toast after the animation completes
    setTimeout(() => {
        toast.remove();
    }, 3000); // Duration of animation (2.5s) + buffer
}

// --- Dark/Light Mode Functions ---

export function setMode(mode) {
    localStorage.setItem('sunflower-mode', mode);
    if (mode === 'dark') {
        document.body.classList.add('dark-mode');
        s.darkModeToggle.checked = true;
    } else {
        document.body.classList.remove('dark-mode');
        s.darkModeToggle.checked = false;
    }
}

export function loadMode() {
    const savedMode = localStorage.getItem('sunflower-mode') || 'light'; // Default to light
    setMode(savedMode);
}

// --- Footer ---

export function initializeFooter() {
    if (s.currentYearSpan) {
        s.currentYearSpan.textContent = new Date().getFullYear();
    }
}

// --- Auth Modal Functions ---

export function openAuthModal() { 
    s.authModal.classList.remove('modal-hidden'); 
}
export function closeAuthModal() { 
    s.authModal.classList.add('modal-hidden'); 
}

// --- App Modal Functions ---

export function openModal() { 
    s.appModal.classList.remove('modal-hidden'); 
}

export function closeModal() {
    s.appModal.classList.add('modal-hidden');
    s.appModal.classList.remove('modal--read-only'); // Remove class on close
    s.modalBody.innerHTML = '';
    state.setOnSave(null);
}

// --- Data Modal Functions (Income, Expense, Account, Transfer) ---

export function showIncomeModal(incomeId, prefillData = null) {
    const isEditMode = incomeId !== undefined;
    const incomeToEdit = isEditMode && Array.isArray(state.appState.incomes) ? state.appState.incomes.find(i => i.id === incomeId) : null;
    s.modalTitle.textContent = isEditMode ? 'Edit Income' : 'Add New Income';

    const bankAccounts = state.appState.accounts.filter(acc => acc.type === 'checking' || acc.type === 'savings');
    let accountOptions = '<option value="">-- None --</option>';
    if (bankAccounts.length > 0) {
        accountOptions += bankAccounts.map(acc => `<option value="${acc.id}">${acc.name}</option>`).join('');
    } else {
        accountOptions = '<option value="" disabled>-- No bank accounts defined --</option>';
    }

    s.modalBody.innerHTML = `
        <div class="form-group"><label for="modal-income-type">Type:</label><select id="modal-income-type" required>...</select></div>
        <div class="form-group"><label for="modal-income-name">Description / Name:</label><input type="text" id="modal-income-name" placeholder="e.g., Vincent's TSP" required></div>
        <div class="form-group"><label for="modal-income-interval">Payment Interval:</label><select id="modal-income-interval" required>...</select></div>
        <div class="form-group"><label for="modal-income-amount">Payment Amount:</label><input type="number" id="modal-income-amount" placeholder="1500" min="0" step="0.01" required></div>
        <div class="form-group"><label for="modal-income-date">Payment Start Date:</label><input type="date" id="modal-income-date" required></div>
        <div class="form-group"><label for="modal-income-deposit-account">Deposit To Account:</label><select id="modal-income-deposit-account">${accountOptions}</select></div> `;

    document.getElementById('modal-income-interval').innerHTML = `<option value="monthly">Monthly</option><option value="annually">Annually</option><option value="quarterly">Quarterly</option><option value="bi-weekly">Bi-Weekly</option><option value="one-time">One-time</option>`;
    document.getElementById('modal-income-type').innerHTML = `<option value="">-- Select a Type --</option><option value="Pension">Pension</option><option value="TSP">TSP</option><option value="TSP Supplement">TSP Supplement</option><option value="Social Security">Social Security</option><option value="Investment">Investment Dividend</option><option value="Other">Other</option>`;

    if (isEditMode && incomeToEdit) {
        document.getElementById('modal-income-type').value = incomeToEdit.type || '';
        document.getElementById('modal-income-name').value = incomeToEdit.name || '';
        document.getElementById('modal-income-interval').value = incomeToEdit.interval || 'monthly';
        document.getElementById('modal-income-amount').value = incomeToEdit.amount || '';
        document.getElementById('modal-income-date').value = incomeToEdit.start_date || '';
        document.getElementById('modal-income-deposit-account').value = incomeToEdit.deposit_account_id || '';
    } else if (prefillData) {
        document.getElementById('modal-income-date').value = prefillData.startDate;
        if (prefillData.interval) {
            document.getElementById('modal-income-interval').value = prefillData.interval;
        }
    } else if (!isEditMode) {
        document.getElementById('modal-income-date').value = new Date().toISOString().split('T')[0];
    }

    state.setOnSave(async () => {
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) { return; }

        const startDateValue = document.getElementById('modal-income-date').value;
        const depositAccountId = document.getElementById('modal-income-deposit-account').value;

        const formItem = {
            user_id: user.id,
            type: document.getElementById('modal-income-type').value,
            name: document.getElementById('modal-income-name').value.trim(),
            interval: document.getElementById('modal-income-interval').value,
            amount: parseFloat(document.getElementById('modal-income-amount').value),
            start_date: startDateValue ? startDateValue : null,
            deposit_account_id: depositAccountId ? parseInt(depositAccountId) : null
        };

        if (!formItem.type || !formItem.name || isNaN(formItem.amount) || formItem.amount < 0 || !formItem.start_date) {
            alert("Please fill out all fields correctly, including a valid start date.");
            return;
        }

        let { error } = isEditMode
            ? await supabaseClient.from('incomes').update(formItem).eq('id', incomeId)
            : await supabaseClient.from('incomes').insert([formItem]).select();

        if (error) { console.error("Error saving income:", error); alert(`Error: ${error.message}`); }
        else { await fetchData(); }
        closeModal();
    });
    openModal();
}

export function showExpenseModal(expenseId, prefillData = null) {
    const isEditMode = expenseId !== undefined;
    const expenseToEdit = isEditMode && Array.isArray(state.appState.expenses) ? state.appState.expenses.find(e => e.id === expenseId) : null;
    s.modalTitle.textContent = isEditMode ? 'Edit Expense' : 'Add New Expense';

    // === ⭐️ MODIFIED: Separate accounts by type for <optgroup> ===
    const bankAccounts = state.appState.accounts.filter(acc => acc.type === 'checking' || acc.type === 'savings');
    const creditCards = state.appState.accounts.filter(acc => acc.type === 'credit_card');

    let accountOptions = '<option value="">-- None --</option>';
    
    if (bankAccounts.length > 0) {
        accountOptions += '<optgroup label="Bank Accounts">';
        accountOptions += bankAccounts.map(acc => `<option value="${acc.id}">${acc.name}</option>`).join('');
        accountOptions += '</optgroup>';
    }

    if (creditCards.length > 0) {
        accountOptions += '<optgroup label="Credit Cards">';
        accountOptions += creditCards.map(acc => `<option value="${acc.id}">${acc.name}</option>`).join('');
        accountOptions += '</optgroup>';
    }

    if (bankAccounts.length === 0 && creditCards.length === 0) {
        accountOptions = '<option value="" disabled>-- No accounts defined --</option>';
    }
    // === END MODIFICATION ===


    s.modalBody.innerHTML = `
        <div class="form-group">
            <label for="modal-expense-category">Category:</label>
            <select id="modal-expense-category" required>
                <option value="">-- Select a Category --</option>
                <option value="Housing">Housing</option>
                <option value="Groceries">Groceries</option>
                <option value="Utilities">Utilities</option>
                <option value="Transport">Transport</option>
                <option value="Health">Health</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Other">Other</option>
            </select>
        </div>
        <div id="sub-type-container" class="form-group" style="display: none;">
            <label for="modal-expense-sub-type">Sub-Type:</label>
            <select id="modal-expense-sub-type">
            </select>
        </div>
        <div class="form-group">
            <label for="modal-expense-name">Description / Name:</label>
            <input type="text" id="modal-expense-name" placeholder="e.g., Electric Bill or Car Payment" required>
        </div>
        <div class="form-group">
            <label for="modal-expense-interval">Payment Interval:</label>
            <select id="modal-expense-interval" required>
                <option value="monthly">Monthly</option>
                <option value="annually">Annually</option>
                <option value="quarterly">Quarterly</option>
                <option value="bi-weekly">Bi-Weekly</option>
                <option value="weekly">Weekly</option>
                <option value="one-time">One-time</option>
            </select>
        </div>
        <div class="form-group">
            <label for="modal-expense-amount">Typical Payment ($):</label>
            <input type="number" id="modal-expense-amount" placeholder="e.g., 100" min="0" step="0.01" required>
        </div>
        <div class="form-group">
            <label for="modal-expense-date">Payment Start Date:</label>
            <input type="date" id="modal-expense-date" required>
        </div>
        <div class="form-group"><label for="modal-expense-payment-account">Pay From Account:</label><select id="modal-expense-payment-account">${accountOptions}</select></div> 
        
        <div id="advanced-loan-fields" style="display: none;">
            <hr class="divider">
            <h4>Loan Details (Optional)</h4>
             <div class="form-group"><label for="modal-loan-interest-rate">Interest Rate (%):</label><input type="number" id="modal-loan-interest-rate" placeholder="e.g., 6.5" min="0" step="0.001"></div>
             <div class="form-group"><label for="modal-loan-total-payments">Total Payments (Months):</label><input type="number" id="modal-loan-total-payments" placeholder="e.g., 360" min="1" step="1"></div>
             <div class="form-group"><label for="modal-loan-original-principal">Original Principal ($):</label><input type="number" id="modal-loan-original-principal" placeholder="e.g., 300000" min="0" step="0.01"></div>
        </div>
        
        `;
    const categorySelect = document.getElementById('modal-expense-category');
    const subTypeContainer = document.getElementById('sub-type-container');
    const subTypeSelect = document.getElementById('modal-expense-sub-type');
    const advancedLoanFields = document.getElementById('advanced-loan-fields');
    // const advancedCCFields = document.getElementById('advanced-cc-fields'); // ⭐️ REMOVED
    const paymentAmountInput = document.getElementById('modal-expense-amount');
    const loanInterestInput = document.getElementById('modal-loan-interest-rate');
    const loanTermInput = document.getElementById('modal-loan-total-payments');
    const loanPrincipalInput = document.getElementById('modal-loan-original-principal');

    const housingSubTypes = `<option value="">-- Select Sub-Type --</option><option value="Rent">Rent</option><option value="Mortgage/Loan">Mortgage/Loan</option><option value="HOA">HOA Dues</option><option value="Other">Other Housing</option>`;
    const transportSubTypes = `<option value="">-- Select Sub-Type --</option><option value="Car Loan">Car Loan</option><option value="Fuel">Fuel</option><option value="Insurance">Insurance</option><option value="Maintenance">Maintenance</option><option value="Other">Other Transport</option>`;

    function calculateAndSetPayment() {
        const principal = parseFloat(loanPrincipalInput.value);
        const rate = parseFloat(loanInterestInput.value) / 100.0;
        const term = parseInt(loanTermInput.value);
        if (principal > 0 && rate >= 0 && term > 0) {
            const amortization = calculateAmortization(principal, rate, term);
            if (amortization) {
                paymentAmountInput.value = amortization.monthlyPayment.toFixed(2);
                paymentAmountInput.readOnly = true;
            }
        } else {
            paymentAmountInput.readOnly = false;
        }
    }

    // === ⭐️ MODIFIED: Simplified toggleAdvancedFields ===
    function toggleAdvancedFields() {
        const category = categorySelect.value;
        let subType = subTypeSelect.value;
        let showSubTypeDropdown = false;
        let showLoan = false;
        // let showCC = false; // ⭐️ REMOVED
        if (category === 'Housing') {
            showSubTypeDropdown = true;
            if (subTypeSelect.innerHTML !== housingSubTypes) { subTypeSelect.innerHTML = housingSubTypes; }
            showLoan = (subType === 'Mortgage/Loan');
        } else if (category === 'Transport') {
            showSubTypeDropdown = true;
            if (subTypeSelect.innerHTML !== transportSubTypes) { subTypeSelect.innerHTML = transportSubTypes; }
            showLoan = (subType === 'Car Loan');
        } 
        // else if (category === 'Credit Card') { // ⭐️ REMOVED
        //     showCC = true;
        // }
        subTypeContainer.style.display = showSubTypeDropdown ? 'grid' : 'none';
        advancedLoanFields.style.display = showLoan ? 'block' : 'none';
        // advancedCCFields.style.display = showCC ? 'block' : 'none'; // ⭐️ REMOVED
        if (showSubTypeDropdown) {
             const currentOptions = Array.from(subTypeSelect.options).map(opt => opt.value);
             if (!currentOptions.includes(subType)) {
                  subTypeSelect.value = '';
             } else {
                  subTypeSelect.value = subType;
             }
        } else {
             subTypeSelect.value = '';
        }
        calculateAndSetPayment();
    }

    categorySelect.addEventListener('change', toggleAdvancedFields);
    subTypeSelect.addEventListener('change', toggleAdvancedFields);
    loanInterestInput.addEventListener('input', calculateAndSetPayment);
    loanTermInput.addEventListener('input', calculateAndSetPayment);
    loanPrincipalInput.addEventListener('input', calculateAndSetPayment);

    if (isEditMode && expenseToEdit) {
        categorySelect.value = expenseToEdit.category || '';
        if (expenseToEdit.category === 'Housing') subTypeSelect.innerHTML = housingSubTypes;
        else if (expenseToEdit.category === 'Transport') subTypeSelect.innerHTML = transportSubTypes;
        document.getElementById('modal-expense-name').value = expenseToEdit.name || '';
        document.getElementById('modal-expense-interval').value = expenseToEdit.interval || 'monthly';
        document.getElementById('modal-expense-amount').value = expenseToEdit.amount || '';
        document.getElementById('modal-expense-date').value = expenseToEdit.start_date || '';
        document.getElementById('modal-expense-payment-account').value = expenseToEdit.payment_account_id || '';
        if (expenseToEdit.advanced_data) {
             const advData = expenseToEdit.advanced_data;
             if ((expenseToEdit.category === 'Housing' || expenseToEdit.category === 'Transport') && advData.item_type) {
                  subTypeSelect.value = advData.item_type;
             }
             if (advData.item_type === 'Mortgage/Loan' || advData.item_type === 'Car Loan') {
                document.getElementById('modal-loan-interest-rate').value = advData.interest_rate ? (advData.interest_rate * 100).toFixed(3) : '';
                document.getElementById('modal-loan-total-payments').value = advData.total_payments || '';
                document.getElementById('modal-loan-original-principal').value = advData.original_principal || '';
             }
             // === ⭐️ REMOVED: Logic to populate CC fields ===
        }
         toggleAdvancedFields();
    } else if (prefillData) {
        document.getElementById('modal-expense-date').value = prefillData.startDate;
        if (prefillData.interval) {
            document.getElementById('modal-expense-interval').value = prefillData.interval;
        }
        toggleAdvancedFields();
    } else if (!isEditMode) {
         document.getElementById('modal-expense-date').value = new Date().toISOString().split('T')[0];
         toggleAdvancedFields();
     }

    // === ⭐️ MODIFIED: Simplified Save logic ===
    state.setOnSave(async () => {
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) { alert("You must be logged in to save data."); return; }
        const category = categorySelect.value;
        const subType = subTypeSelect.value;
        const startDateValue = document.getElementById('modal-expense-date').value;
        const paymentAccountId = document.getElementById('modal-expense-payment-account').value;
        let advancedData = null;
        if ((category === 'Housing' || category === 'Transport') && subType) {
             advancedData = { item_type: subType };
             if (subType === 'Mortgage/Loan' || subType === 'Car Loan') {
                 const rateInput = document.getElementById('modal-loan-interest-rate').value;
                 const paymentsInput = document.getElementById('modal-loan-total-payments').value;
                 const principalInput = document.getElementById('modal-loan-original-principal').value;
                 if (rateInput) advancedData.interest_rate = parseFloat(rateInput) / 100.0;
                 if (paymentsInput) advancedData.total_payments = parseInt(paymentsInput);
                 if (principalInput) advancedData.original_principal = parseFloat(principalInput);
             }
        } 
        // === ⭐️ REMOVED: else if (category === 'Credit Card') block ===

        const formItem = {
            user_id: user.id,
            category: category,
            name: document.getElementById('modal-expense-name').value.trim(),
            interval: document.getElementById('modal-expense-interval').value,
            amount: parseFloat(document.getElementById('modal-expense-amount').value),
            start_date: startDateValue ? startDateValue : null,
            payment_account_id: paymentAccountId ? parseInt(paymentAccountId) : null,
            advanced_data: advancedData
        };
         if (!formItem.category || !formItem.name || isNaN(formItem.amount) || formItem.amount < 0 || !formItem.start_date) {
             alert("Please fill out required fields (Category, Name, Amount, Start Date).");
             return;
        }
        if ((category === 'Housing' || category === 'Transport') && !subType) {
             alert(`Please select a Sub-Type for the ${category} category.`);
             return;
        }
        // === ⭐️ REMOVED: CC statement day validation ===
        
        let { error } = isEditMode
            ? await supabaseClient.from('expenses').update(formItem).eq('id', expenseId)
            : await supabaseClient.from('expenses').insert([formItem]).select();
        if (error) { console.error("Error saving expense:", error); alert(`Error saving expense: ${error.message}`); }
        else { await fetchData(); }
        closeModal();
    });
    openModal();
}

export function showAccountModal(accountId) {
    const isEditMode = accountId !== undefined;
    const accountToEdit = isEditMode && Array.isArray(state.appState.accounts) ? state.appState.accounts.find(a => a.id === accountId) : null;
    s.modalTitle.textContent = isEditMode ? 'Edit Account' : 'Add New Account';

    // === ⭐️ NEW: HTML for credit card fields ===
    const ccFieldsHTML = `
        <div id="advanced-cc-fields" class="form-group-stack" style="display: none;">
             <hr class="divider">
             <h4>Credit Card Details (Optional)</h4>
             <div class="form-group"><label for="modal-cc-limit">Credit Limit ($):</label><input type="number" id="modal-cc-limit" placeholder="e.g., 10000" min="0" step="0.01"></div>
             <div class="form-group"><label for="modal-cc-statement-day">Statement Closing Day:</label><input type="number" id="modal-cc-statement-day" placeholder="(1-31) e.g., 20" min="1" max="31" step="1"></div>
             <div class="form-group"><label for="modal-cc-interest-rate">Interest Rate (APR %):</label><input type="number" id="modal-cc-interest-rate" placeholder="e.g., 21.99" min="0" step="0.01"></div>
        </div>
    `;

    s.modalBody.innerHTML = `
        <div class="form-group">
            <label for="modal-account-name">Account Name:</label>
            <input type="text" id="modal-account-name" placeholder="e.g., Chase Checking" required>
        </div>
        <div class="form-group">
            <label for="modal-account-type">Account Type:</label>
            <select id="modal-account-type" required>
                <option value="">-- Select Type --</option>
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
                <option value="investment">Investment</option>
                <option value="credit_card">Credit Card</option> </select>
        </div>
        <div class="form-group">
            <label for="modal-account-balance">Current Balance ($):</label>
            <input type="number" id="modal-account-balance" placeholder="1000" min="0" step="0.01" required>
        </div>
        <div id="growth-rate-group" class="form-group" style="display: none;">
            <label for="modal-account-growth">Est. Annual Growth (%):</label>
            <input type="number" id="modal-account-growth" placeholder="5" min="0" step="0.01">
        </div>
        ${ccFieldsHTML} `;

    const typeSelect = document.getElementById('modal-account-type');
    const growthGroup = document.getElementById('growth-rate-group');
    const balanceInput = document.getElementById('modal-account-balance');
    const ccFields = document.getElementById('advanced-cc-fields'); // ⭐️ ADDED

    // === ⭐️ MODIFIED: Event listener to show/hide fields based on type ===
    typeSelect.addEventListener('change', () => {
        const type = typeSelect.value;
        growthGroup.style.display = type === 'investment' ? 'grid' : 'none';
        ccFields.style.display = type === 'credit_card' ? 'block' : 'none';
    });

    if (isEditMode && accountToEdit) {
        document.getElementById('modal-account-name').value = accountToEdit.name || '';
        typeSelect.value = accountToEdit.type || '';
        balanceInput.value = accountToEdit.current_balance || '';
        
        if (accountToEdit.type === 'investment') {
            document.getElementById('modal-account-growth').value = accountToEdit.growth_rate ? (accountToEdit.growth_rate * 100).toFixed(2) : '';
            growthGroup.style.display = 'grid';
        }
        // === ⭐️ ADDED: Populate CC fields on edit ===
        if (accountToEdit.type === 'credit_card' && accountToEdit.advanced_data) {
             const advData = accountToEdit.advanced_data;
             document.getElementById('modal-cc-limit').value = advData.credit_limit || '';
             document.getElementById('modal-cc-statement-day').value = advData.statement_day || '';
             document.getElementById('modal-cc-interest-rate').value = advData.interest_rate ? (advData.interest_rate * 100).toFixed(2) : '';
             ccFields.style.display = 'block';
        }

    } else {
         growthGroup.style.display = 'none';
         ccFields.style.display = 'none';
    }

    // === ⭐️ MODIFIED: Save logic ===
    state.setOnSave(async () => {
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) { return; }

        const type = typeSelect.value;
        const growthRateInput = document.getElementById('modal-account-growth').value;
        let advancedData = null; // ⭐️ ADDED

        // === ⭐️ ADDED: Capture CC data ===
        if (type === 'credit_card') {
            advancedData = { item_type: 'credit_card' };
            const limitInput = document.getElementById('modal-cc-limit').value;
            const statementDayInput = document.getElementById('modal-cc-statement-day').value;
            const rateInput = document.getElementById('modal-cc-interest-rate').value;
            if (limitInput) advancedData.credit_limit = parseFloat(limitInput);
            if (statementDayInput) advancedData.statement_day = parseInt(statementDayInput);
            if (rateInput) advancedData.interest_rate = parseFloat(rateInput) / 100.0;
            
            if (advancedData.statement_day && (advancedData.statement_day < 1 || advancedData.statement_day > 31)) {
                 alert("Statement Closing Day must be between 1 and 31.");
                 return;
            }
        }

        const formItem = {
            user_id: user.id,
            name: document.getElementById('modal-account-name').value.trim(),
            type: type,
            current_balance: parseFloat(balanceInput.value),
            growth_rate: (type === 'investment' && growthRateInput) ? parseFloat(growthRateInput) / 100.0 : null,
            advanced_data: advancedData // ⭐️ ADDED
        };

        if (!formItem.name || !formItem.type || isNaN(formItem.current_balance)) {
            // Note: Balance can be negative for credit cards, so removed < 0 check
            alert("Please fill out Name, Type, and a valid Balance.");
            return;
        }
        if (formItem.type === 'investment' && formItem.growth_rate !== null && isNaN(formItem.growth_rate)) {
             alert("Please enter a valid growth rate or leave it blank.");
             return;
        }

        let { error } = isEditMode
            ? await supabaseClient.from('accounts').update(formItem).eq('id', accountId)
            : await supabaseClient.from('accounts').insert([formItem]).select();

        if (error) { console.error("Error saving account:", error); alert(`Error: ${error.message}`); }
        else { await fetchData(); }
        closeModal();
    });
    openModal();
}

export function showTransferModal(transferId) {
    const isEditMode = transferId !== undefined;
    const transferToEdit = isEditMode && Array.isArray(state.appState.transfers) ? state.appState.transfers.find(t => t.id === transferId) : null;
    s.modalTitle.textContent = isEditMode ? 'Edit Transfer' : 'Add New Transfer';

    let accountOptions = '<option value="">-- Select Account --</option>';
    if (state.appState.accounts.length > 0) {
        accountOptions += state.appState.accounts.map(acc => `<option value="${acc.id}">${acc.name}</option>`).join('');
    } else {
        accountOptions = '<option value="" disabled>-- No accounts defined --</option>';
    }

    s.modalBody.innerHTML = `
         <div class="form-group">
            <label for="modal-transfer-desc">Description (Optional):</label>
            <input type="text" id="modal-transfer-desc" placeholder="e.g., Monthly Savings">
        </div>
        <div class="form-group">
            <label for="modal-transfer-from">From Account:</label>
            <select id="modal-transfer-from" required>${accountOptions}</select>
        </div>
        <div class="form-group">
            <label for="modal-transfer-to">To Account:</label>
            <select id="modal-transfer-to" required>${accountOptions}</select>
        </div>
        <div class="form-group">
            <label for="modal-transfer-amount">Amount ($):</label>
            <input type="number" id="modal-transfer-amount" placeholder="100" min="0.01" step="0.01" required>
        </div>
         <div class="form-group">
            <label for="modal-transfer-interval">Interval:</label>
            <select id="modal-transfer-interval" required>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
                <option value="one-time">One-time</option>
                </select>
        </div>
        <div class="form-group">
            <label for="modal-transfer-date">Start/Transfer Date:</label>
            <input type="date" id="modal-transfer-date" required>
        </div>
    `;

    if (isEditMode && transferToEdit) {
        document.getElementById('modal-transfer-desc').value = transferToEdit.description || '';
        document.getElementById('modal-transfer-from').value = transferToEdit.from_account_id || '';
        document.getElementById('modal-transfer-to').value = transferToEdit.to_account_id || '';
        document.getElementById('modal-transfer-amount').value = transferToEdit.amount || '';
        document.getElementById('modal-transfer-interval').value = transferToEdit.interval || 'monthly';
        document.getElementById('modal-transfer-date').value = transferToEdit.start_date || '';
    } else if (!isEditMode) {
         document.getElementById('modal-transfer-date').value = new Date().toISOString().split('T')[0];
    }

    state.setOnSave(async () => {
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) { return; }

        const fromAccountId = parseInt(document.getElementById('modal-transfer-from').value);
        const toAccountId = parseInt(document.getElementById('modal-transfer-to').value);
        const amount = parseFloat(document.getElementById('modal-transfer-amount').value);
        const startDate = document.getElementById('modal-transfer-date').value;
        const interval = document.getElementById('modal-transfer-interval').value;

        if (!fromAccountId || !toAccountId) {
             alert("Please select both From and To accounts."); return;
        }
        if (fromAccountId === toAccountId) {
            alert("From and To accounts cannot be the same."); return;
        }
        if (isNaN(amount) || amount <= 0) {
             alert("Please enter a valid positive amount."); return;
        }
        if (!startDate || !interval) {
             alert("Please select an interval and start/transfer date."); return;
        }

        const formItem = {
            user_id: user.id,
            description: document.getElementById('modal-transfer-desc').value.trim() || null,
            from_account_id: fromAccountId,
            to_account_id: toAccountId,
            amount: amount,
            interval: interval,
            start_date: startDate,
        };

        let { error } = isEditMode
            ? await supabaseClient.from('transfers').update(formItem).eq('id', transferId)
            : await supabaseClient.from('transfers').insert([formItem]).select();

        if (error) { console.error("Error saving transfer:", error); alert(`Error: ${error.message}`); }
        else { await fetchData(); }
        closeModal();
    });
    openModal();
}

export function showAmortizationModal(expenseId) {
    console.log(`Showing amortization for expense ID: ${expenseId}`);
    const expenseItem = state.appState.expenses.find(e => e.id === expenseId);

    if (!expenseItem || !expenseItem.advanced_data ||
        (expenseItem.advanced_data.item_type !== 'Mortgage/Loan' && expenseItem.advanced_data.item_type !== 'Car Loan') ) {
        console.error("Could not find valid loan data (Mortgage/Loan or Car Loan) for this item:", expenseItem);
        showNotification("No valid loan data found for this item.", "error");
        return;
    }

    const dynamicAmortization = getDynamicAmortization(expenseItem); 
    
    if (!dynamicAmortization || !dynamicAmortization.schedule || dynamicAmortization.schedule.length === 0) {
         showNotification("Could not calculate dynamic amortization schedule.", "error");
         console.error("Dynamic amortization calculation failed for item:", expenseItem);
         return;
    }

    const schedule = dynamicAmortization.schedule;
    const trueTotalMonths = dynamicAmortization.trueTotalMonths; 
    const firstPayment = schedule.length > 0 ? schedule[0].payment : expenseItem.amount; 

    s.modalTitle.textContent = `Amortization: ${expenseItem.name}`;
    
    let tableHTML = `
        <p><strong>Original Principal:</strong> ${expenseItem.advanced_data.original_principal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
        <p><strong>Interest Rate:</strong> ${(expenseItem.advanced_data.interest_rate * 100).toFixed(3)}%</p>
        <p><strong>Actual Term:</strong> ${trueTotalMonths} months</p> 
        <p><strong>First Calculated Payment:</strong> ${firstPayment.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} (Note: Payments may vary due to edits)</p>
        <div class="amortization-table-container">
            <table class="amortization-table">
                <thead>
                    <tr><th>Month</th><th>Payment</th><th>Principal</th><th>Interest</th><th>Balance</th></tr>
                </thead>
            <tbody>
    `;
    
    const formatCurrency = num => num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    
    schedule.forEach(row => {
        const isEdited = Math.abs(row.payment - firstPayment) > 0.01; 
        const rowClass = isEdited ? 'edited-payment-row' : '';
        
        tableHTML += `
            <tr class="${rowClass}">
                <td>${row.month}</td>
                <td>${formatCurrency(row.payment)}</td>
                <td>${formatCurrency(row.principalPayment)}</td>
                <td>${formatCurrency(row.interestPayment)}</td>
                <td>${formatCurrency(row.remainingBalance)}</td>
            </tr>
        `;
    });
    
    tableHTML += `</tbody></table></div>`;
    s.modalBody.innerHTML = tableHTML;

    s.appModal.classList.add('modal--read-only'); // Add class to hide footer
    openModal();
}

// --- List & Chart Rendering Functions ---

export function renderList(items, listElement) {
    listElement.innerHTML = '';
    const listType = listElement.id.includes('income') ? 'income' : 'expense';
    if (!items || items.length === 0) {
         listElement.innerHTML = `<li>No ${listType}s added yet.</li>`;
         return;
    }
    
    items.sort((a, b) => {
        if (a.start_date && b.start_date) return new Date(b.start_date) - new Date(a.start_date);
        if (a.start_date) return -1;
        if (b.start_date) return 1;
        return 0;
    });

    items.forEach(item => {
        if (!item || item.id === undefined || item.id === null) { console.warn("Skipping rendering invalid item:", item); return; }
        const li = document.createElement('li');
        const formattedAmount = typeof item.amount === 'number' ? item.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : 'N/A';
        const intervalText = item.interval ? ` / ${item.interval}` : '';
        
        let dateText = '';
        if (item.start_date) {
            try {
                const date = new Date(item.start_date + 'T00:00:00'); 
                dateText = ` (Starts: ${date.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric' })})`;
            } catch (e) {
                console.warn(`Invalid date format for item ${item.id}: ${item.start_date}`);
                dateText = ' (Invalid Date)';
            }
        }
        
        const typeOrCategory = item.type || item.category || 'N/A';
        const name = item.name || 'Unnamed';
        let subTypeText = '';
         if (item.advanced_data && item.advanced_data.item_type && (item.category === 'Housing' || item.category === 'Transport')) {
              subTypeText = ` - ${item.advanced_data.item_type}`;
         }

        let scheduleButtonHTML = '';
        if (listType === 'expense' && item.advanced_data?.item_type &&
           (item.advanced_data.item_type === 'Mortgage/Loan' || item.advanced_data.item_type === 'Car Loan')) {
             scheduleButtonHTML = `<button class="schedule-btn btn-secondary" data-id="${item.id}">Schedule</button>`;
        }

        li.innerHTML = `
            <div class="item-details">
                <strong>${name}</strong> (${typeOrCategory}${subTypeText})<br>
                <span>${formattedAmount}${intervalText}${dateText}</span>
            </div>
            <div class="item-controls">
                ${scheduleButtonHTML}
                <button class="edit-btn" data-id="${item.id}">Edit</button>
                <button class="delete-btn" data-id="${item.id}">X</button>
            </div>`;
        listElement.appendChild(li);
    });
}

export async function renderExpenseChart(isExpandedView = false) {
    const canvasElement = isExpandedView ? s.expandedExpenseChartCanvas : s.expenseChartCanvas;
    const containerElement = isExpandedView ? s.expandedChartContainer : s.summaryChartContainer;

    if (!canvasElement || !containerElement) {
         console.warn(`Canvas or container not found for ${isExpandedView ? 'expanded' : 'summary'} chart view.`);
         return;
    }

    const dashboardIsExpanded = s.mainContainer.classList.contains('dashboard-expanded');
    if (!dashboardIsExpanded && isExpandedView) return;
    if (dashboardIsExpanded && !isExpandedView) return;

    const categoryTotals = {};
    if (state.appState.expenses && Array.isArray(state.appState.expenses)) {
        // We need calculateMonthlyTotal from the calculations module
        // This await is why the function must be async
        const { calculateMonthlyTotal } = await import('./calculations.js'); 
        state.appState.expenses.forEach(expense => {
            if (!expense || typeof expense.amount !== 'number' || typeof expense.category !== 'string') {
                console.warn("Skipping invalid expense item for chart:", expense);
                return;
            }
            const monthlyAmount = calculateMonthlyTotal([expense]);
            if (!categoryTotals[expense.category]) {
                categoryTotals[expense.category] = 0;
            }
            categoryTotals[expense.category] += monthlyAmount;
        });
    }
    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    if (state.expenseChartInstance && state.expenseChartInstance.canvas === canvasElement) {
        state.expenseChartInstance.destroy();
        state.setExpenseChartInstance(null);
    } else if (state.expenseChartInstance && state.expenseChartInstance.canvas !== canvasElement) {
         state.expenseChartInstance.destroy();
         state.setExpenseChartInstance(null);
    }

    const ctx = canvasElement.getContext('2d');
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    if (labels.length === 0) {
        console.log("No expense data to render chart.");
        return;
    }

    console.log(`Rendering expense chart on canvas: ${canvasElement.id} with labels:`, labels, "and data:", data);
    try {
         const newChart = new Chart(ctx, {
              type: 'pie',
              data: {
                   labels: labels,
                   datasets: [{
                        label: 'Expenses by Category',
                        data: data,
                        backgroundColor: ['#3498db', '#e74c3c', '#9b59b6', '#f1c40f', '#2ecc71', '#1abc9c', '#e67e22', '#95a56'],
                        hoverOffset: 4
                   }]
              },
              options: {
                   responsive: true,
                   maintainAspectRatio: false,
                   plugins: {
                        legend: {
                             position: 'top',
                        },
                        tooltip: {
                             callbacks: {
                                  label: function(context) {
                                       let label = context.label || '';
                                       if (label) { label += ': '; }
                                       if (context.parsed !== null) {
                                            // === ⭐️ FIX IS HERE ===
                                            // It should be currency: 'USD' not 'USD'
                                            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed);
                                            // === END FIX ===
                                       }
                                       return label;
                                  }
                             }
                        }
                   }
              }
         });
         state.setExpenseChartInstance(newChart);
    } catch (error) {
         console.error("Error creating Chart.js instance:", error);
    }
}

export function renderBankingSection() {
    renderAccountsList();
    renderTransfersList();
}

export function renderAccountsList() {
    s.accountList.innerHTML = '';
    if (!state.appState.accounts || state.appState.accounts.length === 0) {
        s.accountList.innerHTML = `<li>No accounts added yet.</li>`;
        return;
    }

    const groupedAccounts = { checking: [], savings: [], investment: [] };
    state.appState.accounts.forEach(acc => {
        if (groupedAccounts[acc.type]) {
            groupedAccounts[acc.type].push(acc);
        }
    });

    const renderGroup = (group, title) => {
        if (group.length > 0) {
            group.sort((a, b) => a.name.localeCompare(b.name));
            group.forEach(acc => {
                const li = document.createElement('li');
                const formattedBalance = acc.current_balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                const growthText = acc.type === 'investment' && acc.growth_rate ? ` (${(acc.growth_rate * 100).toFixed(1)}% growth)` : '';

                li.innerHTML = `
                    <div class="item-details">
                        <strong>${acc.name}</strong> (${acc.type})${growthText}<br>
                        <span>Balance: ${formattedBalance}</span>
                    </div>
                    <div class="item-controls">
                        <button class="edit-btn" data-id="${acc.id}" data-type="account">Edit</button>
                        <button class="delete-btn" data-id="${acc.id}" data-type="account">X</button>
                    </div>`;
                s.accountList.appendChild(li);
            });
        }
    };

    renderGroup(groupedAccounts.checking, 'Checking');
    renderGroup(groupedAccounts.savings, 'Savings');
    renderGroup(groupedAccounts.investment, 'Investment');
}

export function renderTransfersList() {
    s.transferList.innerHTML = '';
    const recurringTransfers = state.appState.transfers.filter(t => t.interval !== 'one-time');

    if (!recurringTransfers || recurringTransfers.length === 0) {
        s.transferList.innerHTML = `<li>No recurring transfers added yet.</li>`;
        return;
    }

    recurringTransfers.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

    const formatCurrency = num => num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

    recurringTransfers.forEach(transfer => {
        const fromAcc = state.appState.accounts.find(a => a.id === transfer.from_account_id);
        const toAcc = state.appState.accounts.find(a => a.id === transfer.to_account_id);
        const fromName = fromAcc ? fromAcc.name : 'Unknown';
        const toName = toAcc ? toAcc.name : 'Unknown';

        let dateText = '';
        if (transfer.start_date) {
             try {
                 const date = new Date(transfer.start_date + 'T00:00:00');
                 dateText = ` (Starts: ${date.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric' })})`;
             } catch (e) { dateText = ' (Invalid Date)'; }
        }

        const li = document.createElement('li');
        li.innerHTML = `
            <div class="item-details">
                <strong>${transfer.description || 'Transfer'}</strong><br>
                <span>${formatCurrency(transfer.amount)} / ${transfer.interval}</span><br>
                <span class="transfer-details">From: ${fromName} -> To: ${toName}${dateText}</span>
            </div>
            <div class="item-controls">
                <button class="edit-btn" data-id="${transfer.id}" data-type="transfer">Edit</button>
                <button class="delete-btn" data-id="${transfer.id}" data-type="transfer">X</button>
            </div>`;
        s.transferList.appendChild(li);
    });
}

/**
 * Renders the list of edited transactions into the Edits Log section.
 */
export function renderEditsLog() {
    const logContent = s.gridYearlySummaryPanel.querySelector('#edits-log-content');
    if (!logContent) return;

    const editedTransactions = state.appState.transactions.filter(t => t.edited_amount !== null);

    if (editedTransactions.length === 0) {
        logContent.innerHTML = '<p>No edits found.</p>';
        return;
    }

    editedTransactions.sort((a, b) => new Date(a.occurrence_date) - new Date(b.occurrence_date));

    let logHTML = '<ul class="edits-log-list">';
    const formatCurrency = num => num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

    editedTransactions.forEach(edit => {
        const parentItem = (edit.item_type === 'income' ? state.appState.incomes : state.appState.expenses)
                           .find(item => item.id === edit.item_id);
        const itemName = parentItem ? parentItem.name : 'Unknown Item';
        
        const date = parseUTCDate(edit.occurrence_date);
        const dateString = date ? date.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }) : 'Invalid Date';
        const year = date ? date.getUTCFullYear() : null;

        logHTML += `
            <li class="edits-log-entry">
                <span class="edit-item-name">${itemName}</span> - 
                <button class="btn-link edit-log-date" data-year="${year}">${dateString}</button>: 
                <span class="edit-amount">${formatCurrency(edit.edited_amount)}</span>
            </li>
        `;
    });

    logHTML += '</ul>';
    logContent.innerHTML = logHTML;
}