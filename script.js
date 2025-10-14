// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // === STATE MANAGEMENT ===
    // This is where we will hold all our application data (income, expenses, etc.)
    // We will initialize it from localStorage or with default values.
    let appState = {
        incomes: [],
        expenses: []
    };

    // === DOM SELECTORS ===
    // Caching DOM elements for performance and convenience
    const incomeSection = document.getElementById('income-section');
    const expensesSection = document.getElementById('expenses-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const importBtn = document.getElementById('import-btn');
    const exportBtn = document.getElementById('export-btn');

    // === FUNCTIONS ===
    // All our functions for adding, deleting, rendering, and saving will go here.
    function initializeApp() {
        console.log("App initialized!");
        // Later, we'll load data from localStorage here.
    }


    // === EVENT LISTENERS ===
    // All our event bindings will go here.


    // === INITIALIZATION ===
    // Kicks everything off when the page loads.
    initializeApp();

});