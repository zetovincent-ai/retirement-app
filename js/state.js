// === STATE MANAGEMENT ===
// All shared state variables are exported from this module.
// Other modules import these directly.

export let appState = { 
    incomes: [], 
    expenses: [], 
    transactions: [], 
    accounts: [], 
    transfers: [],
    reconciliation_log: [],
    trips: []
};

export let onSave = null;
export let expenseChartInstance = null;
export let activeDashboardTab = 'grids'; 
export let activeGridView = '2m'; 
export let activeChartView = 'expensePie'; 
export let currentContextItem = null;
export let lastNumYears = null; 
export let lastOpenYear = null; 
export let loanChartInstance = null;
export let loanChartSelections = {
    loans: [],
    timeframe: 10
};
export let expenseChartDrillDown = false;
export let expenseChartDetailCategory = null;
export let listDisplayMode = {
    income: 'all',
    expense: 'all',
    transfer: 'current'
};
// NEW: Tracks whether loan chart listeners have been bound (prevents duplicate binding)
export let loanChartInitialized = false;

// === SETTERS ===

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
export function setExpenseChartDrillDown(isDrilled) {
    expenseChartDrillDown = isDrilled;
}
export function setExpenseChartDetailCategory(category) {
    expenseChartDetailCategory = category;
}
export function setListDisplayMode(mode) {
    listDisplayMode = mode;
}
export function setLoanChartInitialized(val) {
    loanChartInitialized = val;
}
