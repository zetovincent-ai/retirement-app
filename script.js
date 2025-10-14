// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // === STATE MANAGEMENT ===
    let appState = {
        incomes: [],
        expenses: []
    };

    // === DOM SELECTORS ===
    const incomeForm = document.getElementById('income-form');
    const incomeTypeInput = document.getElementById('income-type');
    const incomeNameInput = document.getElementById('income-name');
    const incomeIntervalInput = document.getElementById('income-interval');
    const incomeAmountInput = document.getElementById('income-amount');
    const incomeList = document.getElementById('income-list');
    const dashboardSummary = document.getElementById('dashboard-summary'); // New selector

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

    /**
     * Calculates the total monthly income from all sources.
     * @returns {number} The total monthly income.
     */
    function calculateTotalMonthlyIncome() {
        return appState.incomes.reduce((total, income) => {
            switch (income.interval) {
                case 'monthly':
                    return total + income.amount;
                case 'annually':
                    return total + (income.amount / 12);
                case 'quarterly':
                    return total + (income.amount / 3);
                case 'bi-weekly':
                    return total + ((income.amount * 26) / 12); // 26 bi-weekly periods in a year
                default:
                    return total;
            }
        }, 0);
    }

    /**
     * Renders the dashboard summary.
     */
    function renderDashboard() {
        const totalMonthlyIncome = calculateTotalMonthlyIncome();
        const formattedTotal = totalMonthlyIncome.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });

        dashboardSummary.innerHTML = `
            <h3>Total Monthly Income</h3>
            <p>${formattedTotal}</p>
        `;
    }

    function renderIncomes() {
        // ... (The rest of the renderIncomes function remains the same)
        incomeList.innerHTML = '';
        if (appState.incomes.length === 0) {
            incomeList.innerHTML = '<li>No income sources added yet.</li>';
            return;
        }
        appState.incomes.forEach(income => {
            const li = document.createElement('li');
            const formattedAmount = income.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            li.innerHTML = `
                <div class="item-details">
                    <strong>${income.name}</strong> (${income.type})<br>
                    <span>${formattedAmount} / ${income.interval}</span>
                </div>
                <button class="delete-btn" data-id="${income.id}">X</button>
            `;
            incomeList.appendChild(li);
        });
    }
    
    function handleIncomeSubmit(event) {
        event.preventDefault();
        const newIncome = { id: Date.now(), type: incomeTypeInput.value, name: incomeNameInput.value.trim(), interval: incomeIntervalInput.value, amount: parseFloat(incomeAmountInput.value) };
        appState.incomes.push(newIncome);
        saveState();
        renderIncomes();
        renderDashboard(); // Update dashboard
        incomeForm.reset();
    }
    
    function handleIncomeListClick(event) {
        if (event.target.classList.contains('delete-btn')) {
            const idToDelete = parseInt(event.target.dataset.id);
            appState.incomes = appState.incomes.filter(income => income.id !== idToDelete);
            saveState();
            renderIncomes();
            renderDashboard(); // Update dashboard
        }
    }

    function initializeApp() {
        loadState();
        renderIncomes();
        renderDashboard(); // Render initial dashboard state
    }

    // === EVENT LISTENERS ===
    incomeForm.addEventListener('submit', handleIncomeSubmit);
    incomeList.addEventListener('click', handleIncomeListClick);

    // === INITIALIZATION ===
    initializeApp();
});