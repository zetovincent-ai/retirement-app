// === UI FUNCTIONS ===
// This module contains all functions that directly manipulate the DOM
// for UI purposes, such as modals, notifications, and rendering lists.

import * as s from './selectors.js';
import * as state from './state.js';
import { supabaseClient } from './supabase.js';
import { fetchData, getDynamicAmortization, getLoanAmortization } from './data.js';
import { parseUTCDate, getOccurrencesInMonth } from './calculations.js';

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

    // --- Account Options Setup (with Grouping) ---
    const bankAccounts = state.appState.accounts.filter(acc => acc.type === 'checking' || acc.type === 'savings');
    const investmentAccounts = state.appState.accounts.filter(acc => acc.type === 'investment');
    let accountOptions = '<option value="">-- None --</option>';
    
    if (bankAccounts.length > 0) {
        accountOptions += '<optgroup label="Bank Accounts">' + bankAccounts.map(acc => `<option value="${acc.id}">${acc.name}</option>`).join('') + '</optgroup>';
    }
    if (investmentAccounts.length > 0) {
        accountOptions += '<optgroup label="Investment Accounts">' + investmentAccounts.map(acc => `<option value="${acc.id}">${acc.name}</option>`).join('') + '</optgroup>';
    }
    if (bankAccounts.length === 0 && investmentAccounts.length === 0) {
        accountOptions = '<option value="" disabled>-- No accounts defined --</option>';
    }

    // --- Modal Body HTML ---
    s.modalBody.innerHTML = `
        <div class="form-group"><label for="modal-income-type">Type:</label><select id="modal-income-type" required>...</select></div>
        <div class="form-group"><label for="modal-income-name">Description / Name:</label><input type="text" id="modal-income-name" placeholder="e.g., Vincent's TSP" required></div>
        
        <div class="form-group"><label for="modal-income-interval">Payment Interval:</label><select id="modal-income-interval" required>...</select></div>
        <div class="form-group"><label for="modal-income-amount">Payment Amount (Net):</label><input type="number" id="modal-income-amount" placeholder="1500" min="0" step="0.01" required></div>

        <div id="gross-pay-group" class="form-group" style="display: none;">
            <label for="modal-income-gross-pay" id="gross-pay-label">Gross Pay:</label>
            <input type="number" id="modal-income-gross-pay" placeholder="e.g., 2500" min="0" step="0.01">
        </div>

        <div class="form-group"><label for="modal-income-date">Payment Start Date:</label><input type="date" id="modal-income-date" required></div>
        
        <div class="form-group"><label for="modal-income-end-date">End Date (Optional):</label><input type="date" id="modal-income-end-date"></div>
        
        <div class="form-group"><label for="modal-income-deposit-account">Deposit To Account:</label><select id="modal-income-deposit-account">${accountOptions}</select></div> `;

    // --- Element References ---
    const typeSelect = document.getElementById('modal-income-type');
    const grossPayGroup = document.getElementById('gross-pay-group');
    const grossPayLabel = document.getElementById('gross-pay-label');
    const intervalSelect = document.getElementById('modal-income-interval');

    // --- Dynamic Logic Functions ---
    
    // Update the label (e.g., "Monthly Gross Pay:")
    const updateGrossPayLabel = () => {
        if (typeSelect.value !== 'Regular Pay') return;
        
        const selectedOption = intervalSelect.options[intervalSelect.selectedIndex];
        const intervalText = selectedOption ? selectedOption.text : '';
        grossPayLabel.textContent = `${intervalText} Gross Pay:`;
    };

    // Toggle visibility of the Gross Pay field
    const toggleGrossPayField = () => {
        const show = (typeSelect.value === 'Regular Pay');
        grossPayGroup.style.display = show ? 'grid' : 'none';
        if (show) {
            updateGrossPayLabel(); 
        }
    };
    
    // Add listeners
    typeSelect.addEventListener('change', toggleGrossPayField);
    intervalSelect.addEventListener('change', updateGrossPayLabel); 

    // --- Populate Dropdowns ---
    document.getElementById('modal-income-interval').innerHTML = `
        <option value="monthly">Monthly</option>
        <option value="bi-annual">Bi-annual</option>
        <option value="annually">Annually</option>
        <option value="quarterly">Quarterly</option>
        <option value="bi-weekly">Bi-Weekly</option>
        <option value="weekly">Weekly</option>
        <option value="one-time">One-time</option>
    `;
    
    document.getElementById('modal-income-type').innerHTML = `
        <option value="">-- Select a Type --</option>
        <option value="Regular Pay">Regular Pay</option>
        <option value="Investment Contribution">Investment Contribution</option>
        <option value="Pension">Pension</option>
        <option value="TSP">TSP</option>
        <option value="TSP Supplement">TSP Supplement</option>
        <option value="Social Security">Social Security</option>
        <option value="Investment">Investment Dividend</option>
        <option value="Other">Other</option>
    `;

    // --- Populate Data (Edit Mode) ---
    if (isEditMode && incomeToEdit) {
        document.getElementById('modal-income-type').value = incomeToEdit.type || '';
        document.getElementById('modal-income-name').value = incomeToEdit.name || '';
        document.getElementById('modal-income-interval').value = incomeToEdit.interval || 'monthly';
        document.getElementById('modal-income-amount').value = incomeToEdit.amount || '';
        document.getElementById('modal-income-date').value = incomeToEdit.start_date || '';
        document.getElementById('modal-income-deposit-account').value = incomeToEdit.deposit_account_id || '';

        // Populate End Date
        document.getElementById('modal-income-end-date').value = incomeToEdit.end_date || '';

        // Populate Gross Pay
        if (incomeToEdit.advanced_data && incomeToEdit.advanced_data.gross_pay_amount) {
            document.getElementById('modal-income-gross-pay').value = incomeToEdit.advanced_data.gross_pay_amount;
        }

    } else if (prefillData) {
        document.getElementById('modal-income-date').value = prefillData.startDate;
        if (prefillData.interval) {
            document.getElementById('modal-income-interval').value = prefillData.interval;
        }
    } else if (!isEditMode) {
        document.getElementById('modal-income-date').value = new Date().toISOString().split('T')[0];
    }

    // Trigger toggle on initial load to set correct state
    toggleGrossPayField();

    // --- Save Handler ---
    state.setOnSave(async () => {
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) { return; }

        const startDateValue = document.getElementById('modal-income-date').value;
        const endDateValue = document.getElementById('modal-income-end-date').value; // Get End Date
        const depositAccountId = document.getElementById('modal-income-deposit-account').value;
        const type = document.getElementById('modal-income-type').value;

        // Save logic for Gross Pay
        let advancedData = null;
        if (type === 'Regular Pay') {
            const grossPayInput = document.getElementById('modal-income-gross-pay').value;
            if (grossPayInput) {
                const grossAmount = parseFloat(grossPayInput);
                if (grossAmount > 0) {
                    advancedData = { gross_pay_amount: grossAmount };
                }
            }
        }

        const formItem = {
            user_id: user.id,
            type: type,
            name: document.getElementById('modal-income-name').value.trim(),
            interval: document.getElementById('modal-income-interval').value,
            amount: parseFloat(document.getElementById('modal-income-amount').value),
            start_date: startDateValue ? startDateValue : null,
            end_date: endDateValue ? endDateValue : null, // Save End Date
            deposit_account_id: depositAccountId ? parseInt(depositAccountId) : null,
            advanced_data: advancedData // Contains gross_pay_amount
        };

        // Basic Validation
        if (!formItem.type || !formItem.name || isNaN(formItem.amount) || formItem.amount < 0 || !formItem.start_date) {
            alert("Please fill out all fields correctly, including a valid start date.");
            return;
        }

        // Gross Pay Validation
        if (type === 'Regular Pay' && advancedData && advancedData.gross_pay_amount) {
            if (advancedData.gross_pay_amount < formItem.amount) {
                alert("Gross Pay (per payment) cannot be less than the Net Pay (per payment). Please check your numbers.");
                return;
            }
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

    // --- Account Options ---
    const bankAccounts = state.appState.accounts.filter(acc => acc.type === 'checking' || acc.type === 'savings');
    const creditCards = state.appState.accounts.filter(acc => acc.type === 'credit_card');
    
    // ⭐️ NEW: Liability Accounts for "Pay To" ⭐️
    const liabilityAccounts = state.appState.accounts.filter(acc => acc.type === 'loan' || acc.type === 'credit_card');

    let payFromOptions = '<option value="">-- None --</option>';
    if (bankAccounts.length > 0) payFromOptions += '<optgroup label="Bank Accounts">' + bankAccounts.map(acc => `<option value="${acc.id}">${acc.name}</option>`).join('') + '</optgroup>';
    if (creditCards.length > 0) payFromOptions += '<optgroup label="Credit Cards">' + creditCards.map(acc => `<option value="${acc.id}">${acc.name}</option>`).join('') + '</optgroup>';

    // ⭐️ NEW: "Pay To" Options ⭐️
    let payToOptions = '<option value="">-- None (Pure Expense) --</option>';
    if (liabilityAccounts.length > 0) {
        payToOptions += liabilityAccounts.map(acc => `<option value="${acc.id}">${acc.name}</option>`).join('');
    }

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
                <option value="Savings/Debt">Savings/Debt</option>
                <option value="Other">Other</option>
            </select>
        </div>
        <div id="sub-type-container" class="form-group" style="display: none;">
            <label for="modal-expense-sub-type">Sub-Type:</label>
            <select id="modal-expense-sub-type"></select>
        </div>
        <div class="form-group">
            <label for="modal-expense-name">Description / Name:</label>
            <input type="text" id="modal-expense-name" placeholder="e.g., Electric Bill or Mortgage Payment" required>
        </div>
        <div class="form-group">
            <label for="modal-expense-interval">Payment Interval:</label>
            <select id="modal-expense-interval" required>
                <option value="monthly">Monthly</option>
                <option value="bi-annual">Bi-annual</option>
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
        <div class="form-group">
            <label for="modal-expense-end-date">End Date (Optional):</label>
            <input type="date" id="modal-expense-end-date">
        </div>

        <hr class="divider">
        
        <div class="form-group">
            <label for="modal-expense-payment-account">Pay From (Bank/CC):</label>
            <select id="modal-expense-payment-account">${payFromOptions}</select>
        </div>
        
        <div class="form-group">
            <label for="modal-expense-pay-to">Pay To Loan/Credit (Optional):</label>
            <select id="modal-expense-pay-to">${payToOptions}</select>
            <small style="color:var(--secondary-btn-bg); display:block; margin-top:4px; font-size:0.8rem;">
                Links this payment to a specific Loan or Credit Card to track payoff.
            </small>
        </div>
        
        <div id="advanced-loan-fields" style="display: none;">
            <hr class="divider">
            <h4>Legacy Loan Details (Optional)</h4>
             <div class="form-group"><label for="modal-loan-interest-rate">Interest Rate (%):</label><input type="number" id="modal-loan-interest-rate" placeholder="e.g., 6.5" min="0" step="0.001"></div>
             <div class="form-group"><label for="modal-loan-total-payments">Total Payments (Months):</label><input type="number" id="modal-loan-total-payments" placeholder="e.g., 360" min="1" step="1"></div>
             <div class="form-group"><label for="modal-loan-original-principal">Original Principal ($):</label><input type="number" id="modal-loan-original-principal" placeholder="e.g., 300000" min="0" step="0.01"></div>
        </div>

        <hr class="divider">
        <div class="form-group-checkbox">
            <input type="checkbox" id="modal-expense-magi-addback">
            <label for="modal-expense-magi-addback">Potential MAGI Add-Back?</label>
        </div>
        `;
    
    const categorySelect = document.getElementById('modal-expense-category');
    const subTypeContainer = document.getElementById('sub-type-container');
    const subTypeSelect = document.getElementById('modal-expense-sub-type');
    const advancedLoanFields = document.getElementById('advanced-loan-fields');
    const magiAddBackCheckbox = document.getElementById('modal-expense-magi-addback');

    const housingSubTypes = `<option value="">-- Select Sub-Type --</option><option value="Rent">Rent</option><option value="Mortgage/Loan">Mortgage/Loan</option><option value="HOA">HOA Dues</option><option value="Other">Other Housing</option>`;
    const transportSubTypes = `<option value="">-- Select Sub-Type --</option><option value="Car Loan">Car Loan</option><option value="Fuel">Fuel</option><option value="Insurance">Insurance</option><option value="Maintenance">Maintenance</option><option value="Other">Other Transport</option>`;

    function toggleAdvancedFields() {
        const category = categorySelect.value;
        const subType = subTypeSelect.value;
        
        if (category === 'Housing') {
            subTypeContainer.style.display = 'grid';
            if (subTypeSelect.innerHTML !== housingSubTypes) subTypeSelect.innerHTML = housingSubTypes;
        } else if (category === 'Transport') {
            subTypeContainer.style.display = 'grid';
            if (subTypeSelect.innerHTML !== transportSubTypes) subTypeSelect.innerHTML = transportSubTypes;
        } else {
            subTypeContainer.style.display = 'none';
        }
        
        // Hide Legacy Loan Fields if we are linking to a real account (preferred)
        const isLegacyLoan = (subType === 'Mortgage/Loan' || subType === 'Car Loan');
        advancedLoanFields.style.display = isLegacyLoan ? 'block' : 'none';
        
        if (category !== 'Housing' && category !== 'Transport') subTypeSelect.value = '';
    }

    categorySelect.addEventListener('change', toggleAdvancedFields);
    subTypeSelect.addEventListener('change', toggleAdvancedFields);

    if (isEditMode && expenseToEdit) {
        categorySelect.value = expenseToEdit.category || '';
        toggleAdvancedFields(); // Init sub-types
        
        document.getElementById('modal-expense-name').value = expenseToEdit.name || '';
        document.getElementById('modal-expense-interval').value = expenseToEdit.interval || 'monthly';
        document.getElementById('modal-expense-amount').value = expenseToEdit.amount || '';
        document.getElementById('modal-expense-date').value = expenseToEdit.start_date || '';
        document.getElementById('modal-expense-end-date').value = expenseToEdit.end_date || '';
        document.getElementById('modal-expense-payment-account').value = expenseToEdit.payment_account_id || '';

        if (expenseToEdit.advanced_data) {
             const advData = expenseToEdit.advanced_data;
             if (advData.item_type) subTypeSelect.value = advData.item_type;
             
             // ⭐️ Populate Pay To Link ⭐️
             if (advData.linked_loan_id) {
                 document.getElementById('modal-expense-pay-to').value = advData.linked_loan_id;
             }
             
             // Populate Legacy fields
             if (advData.interest_rate) document.getElementById('modal-loan-interest-rate').value = (advData.interest_rate * 100).toFixed(3);
             if (advData.total_payments) document.getElementById('modal-loan-total-payments').value = advData.total_payments;
             if (advData.original_principal) document.getElementById('modal-loan-original-principal').value = advData.original_principal;
             
             magiAddBackCheckbox.checked = !!advData.is_magi_addback;
        }
        toggleAdvancedFields(); 
    } else if (prefillData) {
        document.getElementById('modal-expense-date').value = prefillData.startDate;
        if (prefillData.interval) document.getElementById('modal-expense-interval').value = prefillData.interval;
        toggleAdvancedFields();
    } else {
        document.getElementById('modal-expense-date').value = new Date().toISOString().split('T')[0];
        toggleAdvancedFields();
    }

    state.setOnSave(async () => {
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) return;
        
        const category = categorySelect.value;
        const subType = subTypeSelect.value;
        const payToId = document.getElementById('modal-expense-pay-to').value; // ⭐️ Capture Pay To

        let advancedData = {};
        if (subType) advancedData.item_type = subType;
        
        // ⭐️ Save Pay To Link ⭐️
        if (payToId) {
            advancedData.linked_loan_id = parseInt(payToId);
        }

        const rateInput = document.getElementById('modal-loan-interest-rate').value;
        const paymentsInput = document.getElementById('modal-loan-total-payments').value;
        const principalInput = document.getElementById('modal-loan-original-principal').value;
        if (rateInput) advancedData.interest_rate = parseFloat(rateInput) / 100.0;
        if (paymentsInput) advancedData.total_payments = parseInt(paymentsInput);
        if (principalInput) advancedData.original_principal = parseFloat(principalInput);

        if (magiAddBackCheckbox.checked) advancedData.is_magi_addback = true;

        const formItem = {
            user_id: user.id,
            category: category,
            name: document.getElementById('modal-expense-name').value.trim(),
            interval: document.getElementById('modal-expense-interval').value,
            amount: parseFloat(document.getElementById('modal-expense-amount').value),
            start_date: document.getElementById('modal-expense-date').value || null,
            end_date: document.getElementById('modal-expense-end-date').value || null,
            payment_account_id: parseInt(document.getElementById('modal-expense-payment-account').value) || null,
            advanced_data: advancedData
        };

        if (!formItem.category || !formItem.name || isNaN(formItem.amount) || !formItem.start_date) {
             alert("Please fill out required fields."); return;
        }
        
        let { error } = isEditMode
            ? await supabaseClient.from('expenses').update(formItem).eq('id', expenseId)
            : await supabaseClient.from('expenses').insert([formItem]).select();
        
        if (error) { console.error("Error saving expense:", error); alert(`Error: ${error.message}`); }
        else { await fetchData(); }
        closeModal();
    });
    openModal();
}

export function showAccountModal(accountId, allowedTypes = null) {
    const isEditMode = accountId !== undefined;
    const accountToEdit = isEditMode && Array.isArray(state.appState.accounts) ? state.appState.accounts.find(a => a.id === accountId) : null;
    s.modalTitle.textContent = isEditMode ? 'Edit Account' : 'Add New Account';

    // ... (CC Fields Logic - Keep existing HTML string for ccFieldsHTML) ... 
    const ccFieldsHTML = `
        <div id="advanced-cc-fields" class="form-group-stack" style="display: none;">
             <hr class="divider">
             <h4>Liability Details (Optional)</h4>
             <div class="form-group"><label for="modal-cc-limit">Credit Limit / Orig. Principal ($):</label><input type="number" id="modal-cc-limit" placeholder="e.g., 10000" min="0" step="0.01"></div>
             <div class="form-group"><label for="modal-cc-statement-day">Due Day / Statement Day:</label><input type="number" id="modal-cc-statement-day" placeholder="(1-31) e.g., 20" min="1" max="31" step="1"></div>
             <div class="form-group"><label for="modal-cc-interest-rate">Interest Rate (APR %):</label><input type="number" id="modal-cc-interest-rate" placeholder="e.g., 21.99" min="0" step="0.01"></div>
        </div>
    `;

    const allTypes = {
        checking: 'Checking',
        savings: 'Savings',
        investment: 'Investment',
        credit_card: 'Credit Card',
        loan: 'Loan (Mortgage, Car, etc.)'
    };

    const typesToShow = allowedTypes ? allowedTypes : Object.keys(allTypes);
    
    let typeOptions = '<option value="">-- Select Type --</option>';
    typesToShow.forEach(key => {
        if (allTypes[key]) typeOptions += `<option value="${key}">${allTypes[key]}</option>`;
    });

    // ⭐️ ADDED: Checkbox for Dashboard Visibility
    s.modalBody.innerHTML = `
        <div class="form-group"><label for="modal-account-name">Account Name:</label><input type="text" id="modal-account-name" placeholder="e.g., Chase Checking" required></div>
        <div class="form-group"><label for="modal-account-type">Account Type:</label><select id="modal-account-type" required>${typeOptions}</select></div>
        <div class="form-group">
            <label for="modal-account-balance">Current Balance ($):</label>
            <input type="number" id="modal-account-balance" placeholder="1000" step="0.01" required>
            <small style="color:var(--secondary-btn-bg); display:block; margin-top:4px;">(Enter debts as negative numbers, e.g. -250000)</small>
        </div>
        
        <div id="growth-rate-group" class="form-group" style="display: none;">
            <label for="modal-account-growth">Est. Annual Growth (%):</label>
            <input type="number" id="modal-account-growth" placeholder="5" min="0" step="0.01">
        </div>

        <div id="dashboard-visibility-group" class="form-group-checkbox" style="margin-top:10px;">
            <input type="checkbox" id="modal-account-dashboard">
            <label for="modal-account-dashboard">Show in Dashboard "Liquid Cash"</label>
        </div>

        ${ccFieldsHTML} 
    `;

    const typeSelect = document.getElementById('modal-account-type');
    const growthGroup = document.getElementById('growth-rate-group');
    const ccFields = document.getElementById('advanced-cc-fields');
    const dashboardCheck = document.getElementById('modal-account-dashboard');
    const dashGroup = document.getElementById('dashboard-visibility-group');

    typeSelect.addEventListener('change', () => {
        const type = typeSelect.value;
        growthGroup.style.display = type === 'investment' ? 'grid' : 'none';
        ccFields.style.display = (type === 'credit_card' || type === 'loan') ? 'block' : 'none';
        
        // Only show "Liquid Cash" option for asset accounts, not loans
        if (['checking', 'savings', 'investment'].includes(type)) {
            dashGroup.style.display = 'grid';
        } else {
            dashGroup.style.display = 'none';
            dashboardCheck.checked = false; 
        }
    });

    if (isEditMode && accountToEdit) {
        document.getElementById('modal-account-name').value = accountToEdit.name || '';
        
        if (!typesToShow.includes(accountToEdit.type)) {
            const tempOption = document.createElement('option');
            tempOption.value = accountToEdit.type;
            tempOption.text = allTypes[accountToEdit.type] || accountToEdit.type;
            typeSelect.add(tempOption);
        }
        
        typeSelect.value = accountToEdit.type || '';
        document.getElementById('modal-account-balance').value = accountToEdit.current_balance || '';
        
        // ⭐️ LOAD CHECKBOX STATE
        if (accountToEdit.advanced_data && accountToEdit.advanced_data.show_on_dashboard) {
            dashboardCheck.checked = true;
        }

        if (accountToEdit.type === 'investment') {
            document.getElementById('modal-account-growth').value = accountToEdit.growth_rate ? (accountToEdit.growth_rate * 100).toFixed(2) : '';
            growthGroup.style.display = 'grid';
        }
        if ((accountToEdit.type === 'credit_card' || accountToEdit.type === 'loan') && accountToEdit.advanced_data) {
             const advData = accountToEdit.advanced_data;
             document.getElementById('modal-cc-limit').value = advData.credit_limit || '';
             document.getElementById('modal-cc-statement-day').value = advData.statement_day || '';
             document.getElementById('modal-cc-interest-rate').value = advData.interest_rate ? (advData.interest_rate * 100).toFixed(2) : '';
             ccFields.style.display = 'block';
        }
        // Trigger visibility logic
        typeSelect.dispatchEvent(new Event('change'));
    } else {
         growthGroup.style.display = 'none';
         ccFields.style.display = 'none';
         dashGroup.style.display = 'none'; // Hidden until type selected
    }

    state.setOnSave(async () => {
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) return;

        const type = typeSelect.value;
        let advancedData = accountToEdit?.advanced_data || {};
        
        // ⭐️ SAVE CHECKBOX STATE
        advancedData.item_type = type; // Ensure type is stored
        if (dashboardCheck.checked) {
            advancedData.show_on_dashboard = true;
        } else {
            // Remove the key if unchecked so we don't store junk
            delete advancedData.show_on_dashboard;
        }

        if (type === 'credit_card' || type === 'loan') {
            const limitInput = document.getElementById('modal-cc-limit').value;
            const statementDayInput = document.getElementById('modal-cc-statement-day').value;
            const rateInput = document.getElementById('modal-cc-interest-rate').value;
            if (limitInput) advancedData.credit_limit = parseFloat(limitInput);
            if (statementDayInput) advancedData.statement_day = parseInt(statementDayInput);
            if (rateInput) advancedData.interest_rate = parseFloat(rateInput) / 100.0;
        }

        const formItem = {
            user_id: user.id,
            name: document.getElementById('modal-account-name').value.trim(),
            type: type,
            current_balance: parseFloat(document.getElementById('modal-account-balance').value),
            growth_rate: (type === 'investment') ? parseFloat(document.getElementById('modal-account-growth').value || 0) / 100.0 : null,
            advanced_data: advancedData 
        };

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
                <option value="bi-annual">Bi-annual</option>
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
    const expenseItem = state.appState.expenses.find(e => e.id === expenseId);
    if (!expenseItem) return;

    const isLegacy = expenseItem.advanced_data && (expenseItem.advanced_data.item_type === 'Mortgage/Loan' || expenseItem.advanced_data.item_type === 'Car Loan');
    const isLinked = expenseItem.advanced_data && expenseItem.advanced_data.linked_loan_id;

    if (!isLegacy && !isLinked) {
        showNotification("No loan data found for this item.", "error");
        return;
    }
    
    // If linked, use the ACCOUNT amortization
    if (isLinked) {
        const account = state.appState.accounts.find(a => a.id === expenseItem.advanced_data.linked_loan_id);
        if (account) {
            const dynamicAmortization = getLoanAmortization(account);
            renderAmortizationTable(dynamicAmortization, `Amortization: ${account.name} (Linked)`);
            return;
        }
    }

    // Legacy Fallback
    const dynamicAmortization = getDynamicAmortization(expenseItem); 
    renderAmortizationTable(dynamicAmortization, `Amortization: ${expenseItem.name}`);
}

// Helper (make sure this is in the file too)
function renderAmortizationTable(data, title) {
    if (!data || !data.schedule || data.schedule.length === 0) {
        showNotification("Could not calculate schedule.", "error");
        return;
    }
    s.modalTitle.textContent = title;
    const schedule = data.schedule;
    const formatCurrency = num => num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    
    let tableHTML = `
        <div class="amortization-table-container">
            <table class="amortization-table">
                <thead><tr><th>Month</th><th>Payment</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead>
            <tbody>`;
    schedule.forEach(row => {
        tableHTML += `
            <tr>
                <td>${row.month}</td>
                <td>${formatCurrency(row.payment)}</td>
                <td>${formatCurrency(row.principalPayment)}</td>
                <td>${formatCurrency(row.interestPayment)}</td>
                <td>${formatCurrency(row.remainingBalance)}</td>
            </tr>`;
    });
    tableHTML += `</tbody></table></div>`;
    s.modalBody.innerHTML = tableHTML;
    s.appModal.classList.add('modal--read-only');
    openModal();
}

export function showReconcileModal(accountId) {
    const account = state.appState.accounts.find(a => a.id === accountId);
    if (!account) {
        showNotification("Could not find the account to reconcile.", "error");
        return;
    }

   const formatCurrency = (num) => num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    
    s.modalTitle.textContent = `Reconcile: ${account.name}`;
    s.modalBody.innerHTML = `
        <p>Enter the actual current balance from your bank or institution to update the balance in this app.</p>
        <div class="form-group">
            <label>Current Balance (in App):</label>
            <input type="text" id="modal-reconcile-old" value="${formatCurrency(account.current_balance)}" readonly>
        </div>
        <div class="form-group">
            <label for="modal-reconcile-new">Actual Balance (from Bank):</label>
            <input type="number" id="modal-reconcile-new" placeholder="e.g., 5280.50" step="0.01" required>
        </div>
        <div class="form-group">
            <label>Adjustment:</label>
            <input type="text" id="modal-reconcile-adjustment" value="$0.00" readonly>
        </div>
    `;

    const newBalanceInput = document.getElementById('modal-reconcile-new');
    const adjustmentInput = document.getElementById('modal-reconcile-adjustment');

    // Add listener to auto-calculate the adjustment
    newBalanceInput.addEventListener('input', () => {
        const newBalance = parseFloat(newBalanceInput.value) || 0;
        const adjustment = newBalance - account.current_balance;
        adjustmentInput.value = formatCurrency(adjustment);
    });

    // Set the save function
    state.setOnSave(async () => {
        const newBalanceString = newBalanceInput.value;
        if (!newBalanceString) {
            alert("Please enter the actual balance.");
            return;
        }

        const newBalance = parseFloat(newBalanceString);
        if (isNaN(newBalance)) {
            alert("Please enter a valid number for the balance.");
            return;
        }
        
        const oldBalance = account.current_balance;
        const adjustment = newBalance - oldBalance;
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) {
            showNotification("You must be logged in.", "error");
            return;
        }

        console.log(`Reconciling account ${accountId}. Old: ${oldBalance}, New: ${newBalance}, Adj: ${adjustment}`);

        try {
            // --- Step 1: Update the account balance ---
            const { error: updateError } = await supabaseClient
                .from('accounts')
                .update({ current_balance: newBalance })
                .eq('id', accountId);

            if (updateError) throw updateError;

            // --- Step 2: Log the reconciliation ---
            const { error: logError } = await supabaseClient
                .from('reconciliation_log')
                .insert({
                    account_id: accountId,
                    old_balance: oldBalance,
                    new_balance: newBalance,
                    adjustment: adjustment,
                    user_id: user.id // ⭐️ ADDED THIS LINE ⭐️
                });
            
            if (logError) throw logError;

            // --- Step 3: Success ---
            showNotification("Account reconciled successfully!", "success");
            closeModal();
            await fetchData(); // Refresh all data

        } catch (error) {
            console.error("Error during reconciliation:", error);
            showNotification(`Error: ${error.message}`, "error");
        }
    });

    openModal();
}

// --- List & Chart Rendering Functions ---

// In ui.js

export function renderList(items, listElement) {
    listElement.innerHTML = '';
    const listType = listElement.id.includes('income') ? 'income' : 'expense';
    let renderItems = [...items];
    
    // Filter if mode is NOT 'all'
    if (state.listDisplayMode[listType] !== 'all') {
        const utcMonth = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), 1));
        renderItems = items.filter(i => getOccurrencesInMonth(i, utcMonth).length > 0);
    }
    
    if (renderItems.length === 0) { listElement.innerHTML = `<li>No items found.</li>`; return; }

    // ⭐️ SORT A-Z BY NAME ⭐️
    renderItems.sort((a, b) => a.name.localeCompare(b.name));

    const fmt = n => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

    renderItems.forEach(item => {
        let badge = '';
        if (item.advanced_data?.linked_loan_id) {
            const acc = state.appState.accounts.find(a => a.id === item.advanced_data.linked_loan_id);
            if (acc) badge = `<span style="font-size:0.8rem; background:#e0e6ed; padding:2px 6px; border-radius:4px; margin-left:5px;">→ ${acc.name}</span>`;
        }
        
        let schedBtn = '';
        if (item.advanced_data?.item_type === 'Mortgage/Loan' || item.advanced_data?.linked_loan_id) {
            schedBtn = `<button class="schedule-btn btn-secondary" data-id="${item.id}">Schedule</button>`;
        }

        const li = document.createElement('li');
        li.innerHTML = `
            <div class="item-details"><strong>${item.name}</strong>${badge}<br><span>${fmt(item.amount)} / ${item.interval}</span></div>
            <div class="item-controls">${schedBtn}<button class="edit-btn" data-id="${item.id}">Edit</button><button class="delete-btn" data-id="${item.id}">X</button></div>`;
        listElement.appendChild(li);
    });
}

export function renderExpenseChart(isExpandedView = false) {
    const canvasElement = isExpandedView ? s.expandedExpenseChartCanvas : s.expenseChartCanvas;
    const containerElement = isExpandedView ? s.expandedChartContainer : s.summaryChartContainer;
    
    // ⭐️ NEW ⭐️: Get the new details list container
    const detailsElement = s.expandedChartContainer.querySelector('#expanded-expense-details');

    if (!canvasElement || !containerElement || (isExpandedView && !detailsElement)) {
         console.warn(`Chart/container elements not found for ${isExpandedView ? 'expanded' : 'summary'} view.`);
         return;
    }

    const dashboardIsExpanded = s.mainContainer.classList.contains('dashboard-expanded');
    if (!dashboardIsExpanded && isExpandedView) return;
    if (dashboardIsExpanded && !isExpandedView) return;

    // === ⭐️ 1. Get State & Date ⭐️ ===
    const creditCardAccountIds = new Set(state.appState.accounts.filter(acc => acc.type === 'credit_card').map(acc => acc.id));
    const currentDate = new Date();
    const currentMonthDateUTC = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), 1));
    const formatCurrency = (num) => num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    
    // === ⭐️ 2. Check if we are in "Details List" mode ⭐️ ===
    if (isExpandedView && state.expenseChartDetailCategory !== null) {
        // --- RENDER DETAILS LIST ---
        console.log(`Rendering details list for category: ${state.expenseChartDetailCategory}`);
        
        // Hide canvas, show details list
        canvasElement.style.display = 'none';
        detailsElement.style.display = 'block';

        // 1. Get the correct list of expenses
        let expensePool;
        if (state.expenseChartDrillDown) {
            // We are drilled into CCs, so get CC charges
            expensePool = state.appState.expenses.filter(exp => creditCardAccountIds.has(exp.payment_account_id));
        } else {
            // We are on cash flow, so get non-CC expenses
            expensePool = state.appState.expenses.filter(exp => !creditCardAccountIds.has(exp.payment_account_id));
        }

        // 2. Filter that list by the chosen category
        const categoryExpenses = expensePool.filter(exp => exp.category === state.expenseChartDetailCategory);

        // 3. Find all occurrences in the current month
        let listHTML = '';
        let total = 0;
        const allOccurrences = [];

        categoryExpenses.forEach(item => {
            const occurrences = getOccurrencesInMonth(item, currentMonthDateUTC);
            occurrences.forEach(date => {
                allOccurrences.push({ item, date });
                total += item.amount; // Note: We use base amount for this list
            });
        });
        
        allOccurrences.sort((a, b) => a.date.getUTCDate() - b.date.getUTCDate());

        // 4. Build HTML
        if (allOccurrences.length > 0) {
            allOccurrences.forEach(({ item, date }) => {
                listHTML += `
                    <li class="expense-details-entry">
                        <div>
                            <span class="expense-details-name">${item.name}</span><br>
                            <span class="expense-details-date">
                                ${date.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' })}
                                (${item.interval})
                            </span>
                        </div>
                        <span class="expense-details-amount">${formatCurrency(item.amount)}</span>
                    </li>
                `;
            });
        } else {
            listHTML = '<li>No specific charges found for this category this month.</li>';
        }

        detailsElement.innerHTML = `
            <button id="expense-details-back-btn" class="btn-secondary">← Back to Chart</button>
            <h3>${state.expenseChartDetailCategory}</h3>
            <p>Total: ${formatCurrency(total)}</p>
            <ul id="expense-details-list">
                ${listHTML}
            </ul>
        `;

        // 5. Add listener for the new "Back" button
        detailsElement.querySelector('#expense-details-back-btn').addEventListener('click', () => {
            state.setExpenseChartDetailCategory(null); // Go back to chart
            renderExpenseChart(isExpandedView); // Re-render
        });
        
        return; // Stop here, we are done
    }

    // === ⭐️ 3. RENDER PIE CHART ⭐️ ===
    // If we got here, it means we are rendering a pie chart.
    
    // Hide details list, show canvas
    if (isExpandedView) {
        canvasElement.style.display = 'block';
        detailsElement.style.display = 'none';
    }
    
    let chartTitle = '';
    let chartDataExpenses;
    let clickHandler;

    if (state.expenseChartDrillDown) {
        // --- Drilled-In View: Credit Card Spending ---
        chartTitle = 'Credit Card Spending (Current Month) (Click slice for details, empty space to go back)';
        chartDataExpenses = state.appState.expenses.filter(exp => 
            creditCardAccountIds.has(exp.payment_account_id)
        );
        
        clickHandler = (event, elements) => {
            if (elements && elements.length > 0) {
                // Clicked a slice - go to details list
                const label = elements[0].element.$context.chart.data.labels[elements[0].index];
                state.setExpenseChartDetailCategory(label);
            } else {
                // Clicked empty space - go back
                state.setExpenseChartDrillDown(false);
            }
            renderExpenseChart(true); // Re-render
        };

    } else {
        // --- Top-Level View: Cash Flow ---
        chartTitle = 'Monthly Expenses (Cash Flow - Current Month) (Click slice for details)';
        chartDataExpenses = state.appState.expenses.filter(exp => 
            !creditCardAccountIds.has(exp.payment_account_id)
        );
        
        clickHandler = (event, elements) => {
            if (elements && elements.length > 0) {
                const label = elements[0].element.$context.chart.data.labels[elements[0].index];
                
                if (label === 'Credit Card') {
                    // Clicked "Credit Card" - drill down
                    state.setExpenseChartDrillDown(true);
                } else {
                    // Clicked any other slice - go to details
                    state.setExpenseChartDetailCategory(label);
                }
                renderExpenseChart(true); // Re-render
            }
        };
    }

    // === ⭐️ 4. Calculate Totals (Same as before) ⭐️ ===
    const categoryTotals = {};
    if (chartDataExpenses && Array.isArray(chartDataExpenses)) {
        chartDataExpenses.forEach(expense => {
            if (!expense || typeof expense.amount !== 'number' || typeof expense.category !== 'string') {
                console.warn("Skipping invalid expense item for chart:", expense);
                return;
            }
            const occurrences = getOccurrencesInMonth(expense, currentMonthDateUTC);
            
            if (occurrences.length > 0) {
                if (!categoryTotals[expense.category]) {
                    categoryTotals[expense.category] = 0;
                }
                occurrences.forEach(occ => {
                    categoryTotals[expense.category] += expense.amount;
                });
            }
        });
    }
    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    // === ⭐️ 5. Destroy & Re-create Chart (Same as before) ⭐️ ===
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
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '16px Arial';
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-color') || '#333';
        ctx.fillText('No data to display for this month', canvasElement.width / 2, canvasElement.height / 2);
        ctx.restore();
        console.log("No expense data to render chart for current month.");
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
                        backgroundColor: ['#3498db', '#e74c3c', '#9b59b6', '#f1c40f', '#2ecc71', '#1abc9c', '#e67e22', '#95a5a6'],
                        hoverOffset: 4
                   }]
              },
              options: {
                   responsive: true,
                   maintainAspectRatio: false,
                   onClick: clickHandler,
                   plugins: {
                        title: {
                            display: true,
                            text: chartTitle,
                            font: {
                                size: 16
                            },
                            padding: {
                                top: 10,
                                bottom: 10
                            }
                        },
                        legend: {
                             position: 'top',
                        },
                        tooltip: {
                             callbacks: {
                                  label: function(context) {
                                       let label = context.label || '';
                                       if (label) { label += ': '; }
                                       if (context.parsed !== null) {
                                            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed);
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

// === ⭐️ Updated renderAccountsList to split Loans, Credit Cards, and Banking ===
export function renderAccountsList() {
    // Clear all lists
    s.accountList.innerHTML = ''; 
    s.ccList.innerHTML = ''; 
    if (s.loanList) s.loanList.innerHTML = ''; 

    if (!state.appState.accounts || state.appState.accounts.length === 0) {
        s.accountList.innerHTML = `<li>No accounts added yet.</li>`;
        return;
    }

    // Group them
    const groupedAccounts = { checking: [], savings: [], investment: [], credit_card: [], loan: [] };
    state.appState.accounts.forEach(acc => {
        if (groupedAccounts[acc.type]) {
            groupedAccounts[acc.type].push(acc);
        }
    });

    // Helper
    const renderGroup = (group, listElement) => {
        if (!group || !listElement) return;
        group.sort((a, b) => a.name.localeCompare(b.name));
        group.forEach(acc => {
            const li = document.createElement('li');
            const isNegative = acc.current_balance < 0;
            const balanceClass = isNegative ? 'expense-total' : '';
            let details = '';
            if ((acc.type === 'credit_card' || acc.type === 'loan') && acc.advanced_data) {
                if (acc.advanced_data.interest_rate) details += `${(acc.advanced_data.interest_rate * 100).toFixed(2)}% APR`;
            }
            li.innerHTML = `
                <div class="item-details">
                    <strong>${acc.name}</strong> <span style="font-size:0.85rem; color:#666;">${details}</span><br>
                    <span class="${balanceClass}">Balance: ${acc.current_balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                </div>
                <div class="item-controls">
                    <button class="reconcile-btn btn-secondary" data-id="${acc.id}" data-type="account">Reconcile</button>
                    <button class="edit-btn" data-id="${acc.id}" data-type="account">Edit</button>
                    <button class="delete-btn" data-id="${acc.id}" data-type="account">X</button>
                </div>`;
            listElement.appendChild(li);
        });
    };

    renderGroup(groupedAccounts.checking, s.accountList);
    renderGroup(groupedAccounts.savings, s.accountList);
    renderGroup(groupedAccounts.investment, s.accountList);
    renderGroup(groupedAccounts.credit_card, s.ccList);
    if (s.loanList) renderGroup(groupedAccounts.loan, s.loanList);
}

export function renderTransfersList() {
    s.transferList.innerHTML = '';
    
    let itemsToRender = [];
    const isAllView = state.listDisplayMode.transfer === 'all';
    const formatCurrency = num => num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

    if (isAllView) {
        // --- "All" View Logic ---
        itemsToRender = [...state.appState.transfers]; // Use ALL transfers
    } else {
        // --- "Current" View Logic (existing logic) ---
        const allRecurringTransfers = state.appState.transfers.filter(t => t.interval !== 'one-time');
        const currentDate = new Date();
        const currentMonthDateUTC = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), 1));

        itemsToRender = allRecurringTransfers.filter(item => {
            return getOccurrencesInMonth(item, currentMonthDateUTC).length > 0;
        });
    }

    if (itemsToRender.length === 0) {
        s.transferList.innerHTML = `<li>No transfers for this view.</li>`;
        return;
    }

    itemsToRender.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

    itemsToRender.forEach(transfer => {
        const fromAcc = state.appState.accounts.find(a => a.id === transfer.from_account_id);
        const toAcc = state.appState.accounts.find(a => a.id === transfer.to_account_id);
        const fromName = fromAcc ? fromAcc.name : 'Unknown';
        const toName = toAcc ? toAcc.name : 'Unknown';

        let dateText = '';
        if (isAllView) {
            // "All" view: Show start date
            if (transfer.start_date) {
                try {
                    const startDate = parseUTCDate(transfer.start_date);
                    dateText = ` (Starts: ${startDate.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric' })})`;
                } catch (e) {
                    dateText = ' (Invalid Date)';
                }
            }
        } else {
            // "Current" view: Show occurrences this month
            try {
                const currentDate = new Date();
                const currentMonthDateUTC = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), 1));
                const occurrences = getOccurrencesInMonth(transfer, currentMonthDateUTC);
                const days = occurrences.map(d => d.getUTCDate()).join(', ');
                dateText = ` (Day: ${days})`;
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
    // === ⭐️ FIX IS HERE ===
    const formatCurrency = num => num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    // === END FIX ===

    editedTransactions.forEach(edit => {
        let itemName = 'Unknown Item'; // Default

        if (edit.item_type === 'transfer') {
            itemName = 'Transfer'; // Use "Transfer" for all transfers
        } else {
            // Use existing logic for incomes and expenses
            const parentList = (edit.item_type === 'income') ? state.appState.incomes : state.appState.expenses;
            const parentItem = parentList.find(item => item.id === edit.item_id);
            if (parentItem) {
                itemName = parentItem.name;
            }
        }
        
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

/** * Renders the reconciliation log into its container.
 */
export function renderReconciliationList() {
    if (!s.reconciliationViewContent) return;

    const logs = state.appState.reconciliation_log;
    
    if (!logs || logs.length === 0) {
        s.reconciliationViewContent.innerHTML = '<h3>Reconciliation Log</h3><p>No reconciliations found.</p>';
        return;
    }

    // Sort by date, newest first
    logs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const formatCurrency = (num) => num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    
    let logHTML = '<ul class="reconciliation-log-list">';

    logs.forEach(log => {
        const account = state.appState.accounts.find(a => a.id === log.account_id);
        const accountName = account ? account.name : 'Unknown Account';
        
        // Supabase gives a full timestamp, so we can use new Date()
        const date = new Date(log.created_at);
        const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        
        const adjAmount = log.adjustment || 0;
        const adjClass = adjAmount >= 0 ? 'recon-positive' : 'recon-negative';
        const adjSign = adjAmount >= 0 ? '+' : '';

        logHTML += `
            <li class="reconciliation-log-entry">
                <div>
                    <span class="recon-account-name">${accountName}</span><br>
                    <span class="recon-date">${dateString}</span>
                </div>
                <div class="recon-details">
                    <span class="recon-amount ${adjClass}">${adjSign}${formatCurrency(adjAmount)}</span>
                    <span class="recon-balance">New Balance: ${formatCurrency(log.new_balance)}</span>
                </div>
            </li>
        `;
    });

    logHTML += '</ul>';
    
    s.reconciliationViewContent.innerHTML = `
        <h3>Reconciliation Log</h3>
        <p>A history of all manual balance adjustments.</p>
        ${logHTML}
    `;
}

// === DASHBOARD LOGIC ===
export function updateDashboard() {
    // 1. Calculate Net Worth (Existing Logic)
    const accounts = state.appState.accounts || [];
    const incomes = state.appState.incomes || [];
    const expenses = state.appState.expenses || [];

    // Helper to get monthly value
    const getMonthlyMultiplier = (interval) => {
        if (interval === 'monthly') return 1;
        if (interval === 'bi-weekly') return 2; 
        if (interval === 'weekly') return 4;    
        if (interval === 'annually') return 1/12;
        return 0; 
    };

    let totalIncome = incomes.reduce((sum, item) => sum + (item.amount * getMonthlyMultiplier(item.interval)), 0);
    let netWorth = accounts.reduce((sum, item) => sum + item.current_balance, 0);

    const fmt = n => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

    // Render Annual Overview (Net Worth)
    if (s.dashboardSummary) {
        s.dashboardSummary.innerHTML = `
            <div class="summary-item"><h3>Est. Net Worth</h3><p class="${netWorth >= 0 ? 'income-total' : 'expense-total'}">${fmt(netWorth)}</p></div>
        `;
    }

    // Render Annual Forecast
    const annualGross = totalIncome * 12;
    if (s.dashboardForecast) {
        s.dashboardForecast.innerHTML = `
            <div class="summary-item"><h3>Calc. Annual Gross Pay</h3><p>${fmt(annualGross)}</p></div>
            <div class="summary-item"><h3>Est. Annual AGI</h3><p>${fmt(annualGross)}</p></div>
            <div class="summary-item"><h3>Est. Annual MAGI</h3><p>${fmt(annualGross)}</p></div>
        `;
    }

    // 2. ⭐️ NEW LOGIC: Liquid Cash (Bank Balance) Summary
    const bankSummaryEl = document.getElementById('dashboard-bank-summary');
    if (bankSummaryEl) {
        const dashAccounts = accounts.filter(a => a.advanced_data && a.advanced_data.show_on_dashboard);
        const currentLiquid = dashAccounts.reduce((sum, a) => sum + a.current_balance, 0);

        // B. Calculate Remaining Cash Flow for CURRENT MONTH
        const today = new Date();
        const currentMonth = new Date(Date.UTC(today.getFullYear(), today.getMonth(), 1));
        
        const sumRemaining = (items) => {
            let total = 0;
            items.forEach(item => {
                const occurrences = getOccurrencesInMonth(item, currentMonth);
                occurrences.forEach(date => {
                    const occDate = new Date(date);
                    if (occDate.getDate() >= today.getDate()) {
                        total += item.amount;
                    }
                });
            });
            return total;
        };

        const remainingIncome = sumRemaining(incomes);
        const remainingExpense = sumRemaining(expenses);
        const forecastLiquid = currentLiquid + remainingIncome - remainingExpense;

        // C. Render
        if (dashAccounts.length === 0) {
            bankSummaryEl.innerHTML = `<p style="font-size:0.8rem; color:#888;">No accounts selected.<br>Edit an account and check "Show in Dashboard".</p>`;
        } else {
            // ⭐️ Generate Individual Rows
            let accountsHTML = dashAccounts.map(acc => `
                <div class="bank-summary-row">
                    <span class="bank-summary-label">${acc.name}</span>
                    <span class="bank-summary-value">${fmt(acc.current_balance)}</span>
                </div>
            `).join('');

            // ⭐️ Append Global Forecast
            accountsHTML += `
                <div class="bank-summary-row" style="margin-top: 1rem; padding-top: 0.5rem; border-top: 1px dashed var(--border-color);">
                    <span class="bank-summary-label">Forecast (End of Month)</span>
                    <span class="bank-summary-value forecast">${fmt(forecastLiquid)}</span>
                    <span class="bank-summary-subtext">Includes all selected + pending transactions</span>
                </div>
            `;
            
            bankSummaryEl.innerHTML = accountsHTML;
        }
    }
}

export function setupDashboardAccordion() {
    const headers = document.querySelectorAll('.dashboard-group-header');
    
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const targetId = header.dataset.target;
            const content = document.getElementById(targetId);
            const icon = header.querySelector('.toggle-icon');
            const group = header.parentElement;

            if (content.style.display === 'none') {
                // Expand
                content.style.display = 'block';
                icon.textContent = '▼';
                group.classList.remove('collapsed');
                group.classList.add('expanded');
            } else {
                // Collapse
                content.style.display = 'none';
                icon.textContent = '▶';
                group.classList.remove('expanded');
                group.classList.add('collapsed');
            }
        });
    });
}