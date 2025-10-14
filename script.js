document.addEventListener('DOMContentLoaded', () => {
    // === STATE MANAGEMENT ===
    let appState = { incomes: [], expenses: [] };

    // === DOM SELECTORS ===
    const incomeForm = document.getElementById('income-form');
    const incomeTypeInput = document.getElementById('income-type');
    const incomeNameInput = document.getElementById('income-name');
    const incomeIntervalInput = document.getElementById('income-interval');
    const incomeAmountInput = document.getElementById('income-amount');
    const incomeList = document.getElementById('income-list');
    
    const expenseForm = document.getElementById('expense-form');
    const expenseCategoryInput = document.getElementById('expense-category');
    const expenseNameInput = document.getElementById('expense-name');
    const expenseIntervalInput = document.getElementById('expense-interval'); // New selector
    const expenseAmountInput = document.getElementById('expense-amount');
    const expenseList = document.getElementById('expense-list');

    const dashboardSummary = document.getElementById('dashboard-summary');
    const importBtn = document.getElementById('import-btn');
    const exportBtn = document.getElementById('export-btn');

    // === FUNCTIONS ===
    function saveState() { localStorage.setItem('retirementAppData', JSON.stringify(appState)); }
    function loadState() {
        const savedState = localStorage.getItem('retirementAppData');
        if (savedState) appState = JSON.parse(savedState);
    }

    // --- RENDER FUNCTIONS ---
    function renderDashboard() {
        const totalMonthlyIncome = calculateMonthlyTotal(appState.incomes);
        const totalMonthlyExpenses = calculateMonthlyTotal(appState.expenses); // Now using expenses
        const netMonthly = totalMonthlyIncome - totalMonthlyExpenses;

        const format = (num) => num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

        dashboardSummary.innerHTML = `
            <div class="summary-item"><h3 class="income-total">Total Monthly Income</h3><p class="income-total">${format(totalMonthlyIncome)}</p></div>
            <div class="summary-item"><h3 class="expense-total">Total Monthly Expenses</h3><p class="expense-total">${format(totalMonthlyExpenses)}</p></div>
            <div class="summary-item net-total"><h3>Net Monthly Balance</h3><p>${format(netMonthly)}</p></div>
        `;
    }

    function renderIncomes() {
        renderList(appState.incomes, incomeList);
    }

    function renderExpenses() {
        renderList(appState.expenses, expenseList);
    }
    
    // Generic function to render either list
    function renderList(items, listElement) {
        listElement.innerHTML = '';
        const listType = listElement.id.includes('income') ? 'income' : 'expense';
        if (items.length === 0) {
            listElement.innerHTML = `<li>No ${listType}s added yet.</li>`;
            return;
        }
        items.forEach(item => {
            const li = document.createElement('li');
            const formattedAmount = item.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            const intervalText = item.interval ? ` / ${item.interval}` : '';
            li.innerHTML = `<div class="item-details"><strong>${item.name}</strong> (${item.type || item.category})<br><span>${formattedAmount}${intervalText}</span></div><button class="delete-btn" data-id="${item.id}">X</button>`;
            listElement.appendChild(li);
        });
    }

    // --- HANDLER FUNCTIONS ---
    function handleIncomeSubmit(event) {
        event.preventDefault();
        const newIncome = { id: Date.now(), type: incomeTypeInput.value, name: incomeNameInput.value.trim(), interval: incomeIntervalInput.value, amount: parseFloat(incomeAmountInput.value) };
        appState.incomes.push(newIncome);
        updateAndSave();
        incomeForm.reset();
    }

    function handleExpenseSubmit(event) {
        event.preventDefault();
        const newExpense = { id: Date.now(), category: expenseCategoryInput.value, name: expenseNameInput.value.trim(), interval: expenseIntervalInput.value, amount: parseFloat(expenseAmountInput.value) };
        appState.expenses.push(newExpense);
        updateAndSave();
        expenseForm.reset();
    }
    
    function handleListClick(event) {
        if (!event.target.classList.contains('delete-btn')) return;
        const idToDelete = parseInt(event.target.dataset.id);
        const listId = event.currentTarget.id;

        if (listId === 'income-list') appState.incomes = appState.incomes.filter(i => i.id !== idToDelete);
        else if (listId === 'expense-list') appState.expenses = appState.expenses.filter(e => e.id !== idToDelete);
        
        updateAndSave();
    }
    
    // --- UTILITY FUNCTIONS ---
    function calculateMonthlyTotal(items) {
        return items.reduce((total, item) => {
            switch (item.interval) {
                case 'monthly': return total + item.amount;
                case 'annually': return total + (item.amount / 12);
                case 'quarterly': return total + (item.amount / 3);
                case 'bi-weekly': return total + ((item.amount * 26) / 12);
                case 'weekly': return total + ((item.amount * 52) / 12);
                default: return total; // For items with no interval
            }
        }, 0);
    }

    function updateAndSave() {
        saveState();
        renderIncomes();
        renderExpenses();
        renderDashboard();
    }

    function initializeApp() {
        loadState();
        updateAndSave(); // Initial render of everything
    }

    // === EVENT LISTENERS ===
    incomeForm.addEventListener('submit', handleIncomeSubmit);
    expenseForm.addEventListener('submit', handleExpenseSubmit);
    incomeList.addEventListener('click', handleListClick);
    expenseList.addEventListener('click', handleListClick);

    // === INITIALIZATION ===
    initializeApp();
});