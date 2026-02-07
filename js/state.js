// === STATE MANAGEMENT ===
// All shared state variables are exported from this module.
// State is grouped by domain for maintainability.

// --- Core App Data (from Supabase) ---
export let appState = { 
    incomes: [], 
    expenses: [], 
    transactions: [], 
    accounts: [], 
    transfers: [],
    reconciliation_log: [],
    trips: []
};

// --- Dashboard & UI State ---
export let dashboard = {
    activeDashboardTab: 'grids',
    activeGridView: '2m',
    activeChartView: 'expensePie',
    lastNumYears: null,
    lastOpenYear: null,
};

// --- Chart State ---
export let charts = {
    expenseChartInstance: null,
    loanChartInstance: null,
    expenseChartDrillDown: false,
    expenseChartDetailCategory: null,
    loanChartSelections: { loans: [], timeframe: 10 },
    loanChartInitialized: false, // Replaces fragile cloneNode listener cleanup
};

// --- UI Interaction State ---
export let onSave = null;
export let currentContextItem = null;
export let listDisplayMode = {
    income: 'all',
    expense: 'all',
    transfer: 'current'
};

// === SETTERS ===

// --- Core Data ---
export function setAppState(newState) {
    appState = newState;
}

// --- Dashboard (generic grouped setter) ---
export function setDashboard(key, value) {
    dashboard = { ...dashboard, [key]: value };
}

// Convenience aliases — keeps call sites readable
export function setActiveDashboardTab(tab) { setDashboard('activeDashboardTab', tab); }
export function setActiveGridView(view) { setDashboard('activeGridView', view); }
export function setActiveChartView(view) { setDashboard('activeChartView', view); }
export function setLastNumYears(years) { setDashboard('lastNumYears', years); }
export function setLastOpenYear(year) { setDashboard('lastOpenYear', year); }

// --- Charts (generic grouped setter) ---
export function setChart(key, value) {
    charts = { ...charts, [key]: value };
}

export function setExpenseChartInstance(instance) { setChart('expenseChartInstance', instance); }
export function setLoanChartInstance(instance) { setChart('loanChartInstance', instance); }
export function setExpenseChartDrillDown(isDrilled) { setChart('expenseChartDrillDown', isDrilled); }
export function setExpenseChartDetailCategory(category) { setChart('expenseChartDetailCategory', category); }
export function setLoanChartSelections(selections) { setChart('loanChartSelections', selections); }
export function setLoanChartInitialized(val) { setChart('loanChartInitialized', val); }

// --- UI Interaction ---
export function setOnSave(fn) { onSave = fn; }
export function setCurrentContextItem(item) { currentContextItem = item; }
export function setListDisplayMode(mode) { listDisplayMode = mode; }