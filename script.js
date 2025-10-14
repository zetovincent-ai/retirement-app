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

    function renderIncomes() {
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
                    <strong>${income.name}</strong> (${income.type})
                    <br>
                    <span>${formattedAmount} / ${income.interval}</span>
                </div>
                <button class="delete-btn" data-id="${income.id}">X</button>
            `;
            incomeList.appendChild(li);
        });
    }
    
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
        saveState();
        renderIncomes();
        incomeForm.reset();
    }
    
    /**
     * Handles clicks on the income list for deleting items.
     * @param {Event} event - The click event.
     */
    function handleIncomeListClick(event) {
        // Check if a delete button was the target of the click
        if (event.target.classList.contains('delete-btn')) {
            // Get the ID from the button's data-id attribute
            const idToDelete = parseInt(event.target.dataset.id);
            
            // Filter the incomes array, keeping everything EXCEPT the item to delete
            appState.incomes = appState.incomes.filter(income => income.id !== idToDelete);
            
            saveState();
            renderIncomes();
        }
    }

    function initializeApp() {
        loadState();
        renderIncomes();
    }

    // === EVENT LISTENERS ===
    incomeForm.addEventListener('submit', handleIncomeSubmit);
    incomeList.addEventListener('click', handleIncomeListClick); // New listener for delete clicks

    // === INITIALIZATION ===
    initializeApp();
});