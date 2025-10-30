// === STATE MANAGEMENT ===
// All shared state variables are exported from this module.
// Other modules will import these.

export let appState = { 
    incomes: [], 
    expenses: [], 
    transactions: [], 
    accounts: [], 
    transfers: [] 
};

export let onSave = null;
export let expenseChartInstance = null;
export let activeDashboardTab = 'grids'; 
export let activeGridView = '2m'; 
export let activeChartView = 'loanChart'; 
export let currentContextItem = null;
export let lastNumYears = null; 
export let lastOpenYear = null; 
export let loanChartInstance = null;
export let loanChartSelections = {
    loans: [],
    timeframe: 10
};

// We also provide "setter" functions for state variables
// that other modules will need to modify.

export function setAppState(newState) {
    appState = newState;
}
export function setOnSave(fn) {
    onSave = fn;
}
export function setExpenseChartInstance(instance) {
    expenseChartInstance = instance;
}
export function setActiveDashboardTab(tab) {
    activeDashboardTab = tab;
}
export function setActiveGridView(view) {
    activeGridView = view;
}
export function setActiveChartView(view) {
    activeChartView = view;
}
export function setCurrentContextItem(item) {
    currentContextItem = item;
}
export function setLastNumYears(years) {
    lastNumYears = years;
}
export function setLastOpenYear(year) {
    lastOpenYear = year;
}
export function setLoanChartInstance(instance) {
    loanChartInstance = instance;
}
export function setLoanChartSelections(selections) {
    loanChartSelections = selections;
}