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

    const importBtn = document.getElementById('import-btn');
    const exportBtn = document.getElementById('export-btn');

    // === FUNCTIONS ===
    
    /**
     * Handles the submission of the income form.
     * @param {Event} event - The form submission event.
     */
    function handleIncomeSubmit(event) {
        // 1. Prevent the default browser behavior of reloading the page.
        event.preventDefault();

        // 2. Create the new income object from the form values.
        const newIncome = {
            id: Date.now(), // Use a timestamp for a simple unique ID
            type: incomeTypeInput.value,
            name: incomeNameInput.value.trim(), // .trim() removes extra whitespace
            interval: incomeIntervalInput.value,
            amount: parseFloat(incomeAmountInput.value) // Convert amount to a number
        };

        // 3. For now, just log the new object to the console to verify.
        console.log("New Income Added:", newIncome);
        
        // 4. Reset the form fields for the next entry.
        incomeForm.reset();
    }
    
    function initializeApp() {
        console.log("App initialized!");
    }


    // === EVENT LISTENERS ===
    incomeForm.addEventListener('submit', handleIncomeSubmit);


    // === INITIALIZATION ===
    initializeApp();

});
