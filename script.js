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
    const incomeList = document.getElementById('income-list'); // New selector for our list

    const importBtn = document.getElementById('import-btn');
    const exportBtn = document.getElementById('export-btn');

    // === FUNCTIONS ===

    /**
     * Renders the list of incomes to the page.
     */
    function renderIncomes() {
        // 1. Clear the current list to prevent duplicates
        incomeList.innerHTML = '';

        // 2. If there are no incomes, show a message
        if (appState.incomes.length === 0) {
            incomeList.innerHTML = '<li>No income sources added yet.</li>';
            return;
        }

        // 3. Loop through each income in the state and create an HTML list item for it
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

        // Push the new object into our state array
        appState.incomes.push(newIncome);

        // Re-render the list to show the new item
        renderIncomes();
        
        incomeForm.reset();
    }
    
    function initializeApp() {
        console.log("App initialized!");
        renderIncomes(); // Render the initial list on page load
    }


    // === EVENT LISTENERS ===
    incomeForm.addEventListener('submit', handleIncomeSubmit);


    // === INITIALIZATION ===
    initializeApp();

});
