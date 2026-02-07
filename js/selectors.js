// === DOM SELECTORS ===
// All DOM element queries are centralized here and exported.
// Static selectors are grabbed once at module load (safe with type="module").
// Dynamic selectors use getEl() for elements that may not exist at load time.

/**
 * Lazy selector for elements that may be created/destroyed at runtime.
 * Use this for Travel app sub-views, dynamically rendered content, etc.
 * @param {string} id - The element ID to query.
 * @returns {HTMLElement|null}
 */
export function getEl(id) {
    return document.getElementById(id);
}

// === STATIC SELECTORS (Financial App — always in the DOM) ===

export const currentYearSpan = document.getElementById('current-year');
export const mainContainer = document.querySelector('main');
export const toggleDashboardBtn = document.getElementById('toggle-dashboard-btn');
export const userStatus = document.getElementById('user-status');
export const appModal = document.getElementById('app-modal');
export const modalTitle = document.getElementById('modal-title');
export const modalBody = document.getElementById('modal-body');
export const modalCloseBtn = document.getElementById('modal-close-btn');
export const modalCancelBtn = document.getElementById('modal-cancel-btn');
export const modalSaveBtn = document.getElementById('modal-save-btn');
export const showIncomeModalBtn = document.getElementById('show-income-modal-btn');
export const showExpenseModalBtn = document.getElementById('show-expense-modal-btn');
export const incomeList = document.getElementById('income-list');
export const expenseList = document.getElementById('expense-list');
export const dashboardSummary = document.getElementById('dashboard-summary');
export const summaryChartContainer = document.getElementById('summary-chart-container');
export const expenseChartCanvas = document.getElementById('expense-chart');
export const darkModeToggle = document.getElementById('dark-mode-toggle');
export const authModal = document.getElementById('auth-modal');
export const authModalCloseBtn = document.getElementById('auth-modal-close-btn');
export const emailAuthForm = document.getElementById('email-auth-form');
export const githubLoginBtn = document.getElementById('github-login-btn');
export const notificationContainer = document.getElementById('notification-container');
export const expandedDashboardContent = document.getElementById('expanded-dashboard-content');
export const dashboardTabsContainer = document.querySelector('.dashboard-tabs');
export const tabButtons = document.querySelectorAll('.tab-btn');
export const viewControlsContainer = document.querySelector('.dashboard-view-controls');
export const viewButtonGroups = document.querySelectorAll('.view-group');
export const gridViewButtons = document.querySelectorAll('.view-group[data-tab-group="grids"] .view-btn');
export const chartViewButtons = document.querySelectorAll('.view-group[data-tab-group="charts"] .view-btn');
export const tabContents = document.querySelectorAll('.tab-content');
export const gridContentArea = document.getElementById('grid-content');
export const gridMonthlyContent = document.getElementById('grid-monthly-content');
export const gridYearlyContent = document.getElementById('grid-yearly-content');
export const gridYearlySummaryPanel = document.getElementById('grid-yearly-summary-panel');
export const gridDetailContent = document.getElementById('grid-detail-content');
export const gridHistoricContent = document.getElementById('grid-historic-content');
export const gridHistoricYearPanel = document.getElementById('grid-historic-year-panel');
export const gridHistoricDetailContent = document.getElementById('grid-historic-detail-content');
export const chartContentArea = document.getElementById('chart-content');
export const expandedExpenseChartCanvas = document.getElementById('expanded-expense-chart'); 
export const expandedChartContainer = document.getElementById('expanded-expense-chart').parentElement;
export const gridContextMenu = document.getElementById('grid-context-menu');
export const bankingSection = document.getElementById('banking-section');
export const showAccountModalBtn = document.getElementById('show-account-modal-btn');
export const showTransferModalBtn = document.getElementById('show-transfer-modal-btn');
export const accountList = document.getElementById('account-list');
export const transferList = document.getElementById('transfer-list');
export const expensePieChartContainer = document.getElementById('expense-pie-chart-container');
export const loanChartContent = document.getElementById('loan-chart-content');
export const loanChartCanvas = document.getElementById('loan-chart-canvas');
export const loanChartSelectContainer = document.getElementById('loan-chart-select-container');
export const reconciliationViewContent = document.getElementById('reconciliation-view-content');
export const loanTimeframeSelect = document.getElementById('loan-timeframe-select');
export const dashboardForecast = document.getElementById('dashboard-forecast');

// === MAIN LAYOUT SELECTORS ===
export const sectionTabs = document.querySelectorAll('.section-tab-btn');
export const tabPanels = document.querySelectorAll('.tab-panel');

// === LIABILITIES SELECTORS ===
export const liabilitiesSection = document.getElementById('liabilities-section');
export const showCcModalBtn = document.getElementById('show-cc-modal-btn');
export const ccList = document.getElementById('cc-list');
export const loanList = document.getElementById('loan-list');

// === TRAVEL APP SELECTORS (use getEl() for sub-views added dynamically) ===
export const travelAppContainer = document.getElementById('travel-app');
export const travelList = document.getElementById('travel-list');
export const addTravelItemBtn = document.getElementById('add-travel-item-btn');