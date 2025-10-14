// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // === STATE MANAGEMENT ===
    // Default state if nothing is saved
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

    const importBtn = document.getElementById('import-btn');
    const exportBtn = document.getElementById('export-btn');

    // === FUNCTIONS ===

    /**
     * Saves the current appState to localStorage.
     */
    function saveState() {
        localStorage.setItem('retirementAppData', JSON.stringify(appState));
    }

    /**
     * Loads the appState from localStorage.
     */
    function loadState() {
        const savedState = localStorage.getItem('retirementAppData');
        if (savedState) {
            appState = JSON.parse(savedState);
        }
    }

    /**
     * Renders the list of incomes to the page.
     */
    function renderIncomes() {
        incomeList.innerHTML = '';

        if (appState.incomes.length === 0) {
            incomeList.innerHTML = '<li>No income sources added yet.</li>';
            return;
        }

        appState.incomes.forEach(income => {
            const li = document.createElement('li');
            const formattedAmount = income.amount.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD'
            });
            
            li.innerHTML = `
                <strong>${income.name}</strong> (${income.type})
                <br>
                <span>${formattedAmount} / ${income.interval}</span>
            `;
            incomeList.appendChild(li);
        });
    }
    
    /**
     * Handles the submission of the income form.
     * @param {Event} event - The form submission event.
     */
    function handleIncomeSubmit(event) {
        event.preventDefault();

        const newIncome = {
            id: Date.now(),
            type: incomeTypeInput.value,
            name: incomeNameInput.value.trim(),
            interval: incomeIntervalInput.value,
            amount: parseFloat(incomeAmountInput.value)
        };

        appState.incomes.push(newIncome);
        
        saveState();      // Save the new state after adding an item
        renderIncomes();  // Re-render the list to show the new item
        
        incomeForm.reset();
    }
    
    function initializeApp() {
        loadState();      // Load any saved data first
        renderIncomes();  // Then render the list
    }


    // === EVENT LISTENERS ===
    incomeForm.addEventListener('submit', handleIncomeSubmit);


    // === INITIALIZATION ===
    initializeApp();

});