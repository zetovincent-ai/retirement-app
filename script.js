// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // === STATE MANAGEMENT ===
    let appState = {
        incomes: [],
        expenses: []
    };

    // === DOM SELECTORS ===
    // Income selectors
    const incomeForm = document.getElementById('income-form');
    const incomeTypeInput = document.getElementById('income-type');
    const incomeNameInput = document.getElementById('income-name');
    const incomeIntervalInput = document.getElementById('income-interval');
    const incomeAmountInput = document.getElementById('income-amount');
    const incomeList = document.getElementById('income-list');
    
    // Expense selectors
    const expenseForm = document.getElementById('expense-form');
    const expenseCategoryInput = document.getElementById('expense-category');
    const expenseNameInput = document.getElementById('expense-name');
    const expenseAmountInput = document.getElementById('expense-amount');
    const expenseList = document.getElementById('expense-list');

    // Dashboard & Global selectors
    const dashboardSummary = document.getElementById('dashboard-summary');
    const importBtn = document.getElementById('import-btn');
    const exportBtn = document.getElementById('export-btn');

    // === FUNCTIONS ===

    function saveState() {
        localStorage.setItem('retirementAppData', JSON.stringify(appState));
    }

    function loadState() {
        const savedState = localStorage.getItem('retirementAppData');
        if (savedState) {
            appState = JSON.parse(savedState);
        }
    }

    // --- RENDER FUNCTIONS ---
    function renderDashboard() {
        const totalMonthlyIncome = appState.incomes.reduce((total, income) => {
            switch (income.interval) {
                case 'monthly': return total + income.amount;
                case 'annually': return total + (income.amount / 12);
                case 'quarterly': return total + (income.amount / 3);
                case 'bi-weekly': return total + ((income.amount * 26) / 12);
                default: return total;
            }
        }, 0);
        const formattedTotal = totalMonthlyIncome.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        dashboardSummary.innerHTML = `<h3>Total Monthly Income</h3><p>${formattedTotal}</p>`;
    }

    function renderIncomes() {
        incomeList.innerHTML = '';
        if (appState.incomes.length === 0) {
            incomeList.innerHTML = '<li>No income sources added yet.</li>';
            return;
        }
        appState.incomes.forEach(income => {
            const li = document.createElement('li');
            const formattedAmount = income.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            li.innerHTML = `<div class="item-details"><strong>${income.name}</strong> (${income.type})<br><span>${formattedAmount} / ${income.interval}</span></div><button class="delete-btn" data-id="${income.id}">X</button>`;
            incomeList.appendChild(li);
        });
    }

    function renderExpenses() {
        expenseList.innerHTML = '';
        if (appState.expenses.length === 0) {
            expenseList.innerHTML = '<li>No expenses added yet.</li>';
            return;
        }
        appState.expenses.forEach(expense => {
            const li = document.createElement('li');
            const formattedAmount = expense.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            li.innerHTML = `<div class="item-details"><strong>${expense.name}</strong> (${expense.category})<br><span>${formattedAmount}</span></div><button class="delete-btn" data-id="${expense.id}">X</button>`;
            expenseList.appendChild(li);
        });
    }

    // --- HANDLER FUNCTIONS ---
    function handleIncomeSubmit(event) {
        event.preventDefault();
        const newIncome = { id: Date.now(), type: incomeTypeInput.value, name: incomeNameInput.value.trim(), interval: incomeIntervalInput.value, amount: parseFloat(incomeAmountInput.value) };
        appState.incomes.push(newIncome);
        saveState();
        renderIncomes();
        renderDashboard();
        incomeForm.reset();
    }

    function handleExpenseSubmit(event) {
        event.preventDefault();
        const newExpense = {
            id: Date.now(),
            category: expenseCategoryInput.value,
            name: expenseNameInput.value.trim(),
            amount: parseFloat(expenseAmountInput.value)
        };
        appState.expenses.push(newExpense);
        saveState();
        renderExpenses();
        // We will update the dashboard with expense info in the next step
        expenseForm.reset();
    }
    
    function handleListClick(event) {
        if (!event.target.classList.contains('delete-btn')) return;
        
        const idToDelete = parseInt(event.target.dataset.id);
        const list = event.currentTarget; // The list (<ul>) that was clicked inside

        if (list.id === 'income-list') {
            appState.incomes = appState.incomes.filter(income => income.id !== idToDelete);
            renderIncomes();
            renderDashboard();
        } else if (list.id === 'expense-list') {
            appState.expenses = appState.expenses.filter(expense => expense.id !== idToDelete);
            renderExpenses();
            // We will update the dashboard with expense info in the next step
        }
        saveState();
    }

    function initializeApp() {
        loadState();
        renderIncomes();
        renderExpenses(); // Render expenses on load
        renderDashboard();
    }

    // === EVENT LISTENERS ===
    incomeForm.addEventListener('submit', handleIncomeSubmit);
    expenseForm.addEventListener('submit', handleExpenseSubmit); // New listener for expenses
    
    // Using one handler for both lists
    incomeList.addEventListener('click', handleListClick);
    expenseList.addEventListener('click', handleListClick);

    // === INITIALIZATION ===
    initializeApp();
});