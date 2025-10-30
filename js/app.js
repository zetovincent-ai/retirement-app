// === APP.JS ===
// This is the main entry point for the application.
// It imports from all other modules and sets up event listeners.

import { supabaseClient } from './supabase.js';
import * as s from './selectors.js';
import * as state from './state.js';
import * as ui from './ui.js';
import * as auth from './auth.js';
import * as grid from './grid.js';
import * as data from './data.js';

// === EVENT HANDLERS ===

async function handleListClick(event) {
    const target = event.target;
    const idString = target.dataset.id;
    if (!idString) return;

    const id = parseInt(idString);
    if (isNaN(id)) { console.error(`Invalid ID found on button: ${idString}`); return; }

    const listElement = target.closest('.item-list');
    if (!listElement) { console.error("Could not find parent list for clicked button."); return; }
    const listId = listElement.id;

    if (target.classList.contains('edit-btn')) {
        console.log(`Edit button clicked for ID ${id} in list ${listId}`);
        if (listId === 'income-list') ui.showIncomeModal(id);
        else if (listId === 'expense-list') ui.showExpenseModal(id);
    }
    else if (target.classList.contains('delete-btn')) {
        console.log(`Delete button clicked for ID ${id} in list ${listId}`);
        if (confirm("Are you sure you want to delete this item?")) {
             const tableName = listId === 'income-list' ? 'incomes' : 'expenses';
             const { error } = await supabaseClient.from(tableName).delete().eq('id', id);
             if (error) { 
                 console.error(`Error deleting from ${tableName}:`, error); 
                 ui.showNotification(`Error deleting item: ${error.message}`, 'error');
             }
             else { 
                 console.log(`Successfully deleted item ID ${id} from ${tableName}`); 
                 await data.fetchData(); 
             }
        }
    }
    else if (target.classList.contains('schedule-btn')) {
         console.log(`Schedule button clicked for ID ${id}`);
         ui.showAmortizationModal(id);
    }
}

async function handleBankingListClick(event) {
    const target = event.target;
    const idString = target.dataset.id;
    const type = target.dataset.type; // 'account' or 'transfer'

    if (!idString || !type) return;

    const id = parseInt(idString);
    if (isNaN(id)) { console.error(`Invalid ID found: ${idString}`); return; }

    if (target.classList.contains('edit-btn')) {
        console.log(`Edit ${type} ID ${id}`);
        if (type === 'account') ui.showAccountModal(id);
        else if (type === 'transfer') ui.showTransferModal(id);

    } else if (target.classList.contains('delete-btn')) {
        console.log(`Delete ${type} ID ${id}`);
        const tableName = type === 'account' ? 'accounts' : 'transfers';
        if (confirm(`Are you sure you want to delete this ${type}?`)) {
             const { error } = await supabaseClient.from(tableName).delete().eq('id', id);
             if (error) { 
                 console.error(`Error deleting from ${tableName}:`, error); 
                 ui.showNotification(`Error: ${error.message}`, 'error');
             }
             else { 
                 console.log(`Successfully deleted ${type} ID ${id}`); 
                 await data.fetchData(); 
             }
        }
    }
}

function handleGridContentClick(event) {
    const target = event.target;

    // 1. Handle "Generate Summary" click
    if (target.id === 'btn-generate-yearly-summary') {
        const numYearsInput = s.gridYearlySummaryPanel.querySelector('#yearly-forecast-years');
        const numYears = numYearsInput ? parseInt(numYearsInput.value, 10) : NaN;
        grid.renderYearlySummaryTable(numYears);
        return;
    }

    // 2. Handle "Reset" click
    if (target.id === 'btn-reset-yearly-summary') {
        grid.renderYearlyConfigUI();
        state.setLastNumYears(null);
        state.setLastOpenYear(null);
        console.log("State cleared on Reset");
        return;
    }

    // 3. Handle click on a "Year" button (btn-link)
    const yearButton = target.closest('.btn-link[data-year]');
    if (yearButton) {
        const clickedYear = parseInt(yearButton.dataset.year, 10);
        if (isNaN(clickedYear)) return;

        let startingNetTotal = 0;
        let yearStartAccountBalances = state.appState.accounts.reduce((acc, account) => {
            acc[account.id] = account.current_balance;
            return acc;
        }, {});

        const startYear = new Date().getFullYear();
        for (let y = startYear; y < clickedYear; y++) {
            startingNetTotal += (grid.calculateYearlyTotals(state.appState.incomes, y) - grid.calculateYearlyTotals(state.appState.expenses, y));
            yearStartAccountBalances = grid.calculateAccountBalancesForYear(y, yearStartAccountBalances);
        }
        console.log(`Starting balances for ${clickedYear}:`, yearStartAccountBalances);

        const startDate = new Date(Date.UTC(clickedYear, 0, 1));
        s.gridDetailContent.innerHTML = grid.renderGridView(12, startDate, startingNetTotal, yearStartAccountBalances);

        state.setLastOpenYear(clickedYear);
        console.log(`State updated: lastOpenYear=${state.lastOpenYear}`);
        return;
    }

    // 4. Handle "Add Item" click (from monthly grid)
    const addButton = target.closest('[data-action="add-grid-item"]');
    if (addButton) {
        const prefillData = {
            startDate: addButton.dataset.date,
            interval: addButton.dataset.interval || null
        };
        const type = addButton.dataset.type;

        if (type === 'income') {
            ui.showIncomeModal(undefined, prefillData);
        } else if (type === 'expense') {
            ui.showExpenseModal(undefined, prefillData);
        }
        return;
    }
}

function handleGridContextMenu(event) {
    event.preventDefault();
    const row = event.target.closest('tr');
    if (!row || !row.dataset.itemId) {
        s.gridContextMenu.classList.add('modal-hidden');
        return;
    }

    state.setCurrentContextItem({
        itemId: parseInt(row.dataset.itemId),
        itemType: row.dataset.itemType,
        dateString: row.dataset.date,
        originalAmount: parseFloat(row.dataset.amount)
    });

    s.gridContextMenu.style.top = `${event.clientY}px`;
    s.gridContextMenu.style.left = `${event.clientX}px`;
    s.gridContextMenu.classList.remove('modal-hidden');
}

function handleContextMenuClick(event) {
    const target = event.target.closest('li');
    if (!target) return;

    const status = target.dataset.status;
    const action = target.dataset.action;
    const currentItem = state.currentContextItem;

    if (currentItem) {
        if (status) {
            data.saveTransactionStatus(
                currentItem.itemId,
                currentItem.itemType,
                currentItem.dateString,
                status
            );
        } else if (action === 'edit-amount') {
            const newAmountString = prompt("Enter the new amount for this month:", currentItem.originalAmount);
            if (newAmountString !== null) {
                const newAmount = parseFloat(newAmountString);
                if (!isNaN(newAmount) && newAmount >= 0) {
                    data.saveTransactionAmount(
                        currentItem.itemId,
                        currentItem.itemType,
                        currentItem.dateString,
                        currentItem.originalAmount,
                        newAmount
                    );
                } else {
                    alert("Please enter a valid, non-negative number.");
                }
            }
        } else if (action === 'revert-amount') {
            data.revertTransactionAmount(
                currentItem.itemId,
                currentItem.itemType,
                currentItem.dateString
            );
        }
    }
    
    s.gridContextMenu.classList.add('modal-hidden');
    state.setCurrentContextItem(null);
}

function handleDocumentClick(event) {
    if (!s.gridContextMenu.contains(event.target)) {
        s.gridContextMenu.classList.add('modal-hidden');
        state.setCurrentContextItem(null);
    }
}

function setActiveChartView(viewId) {
    state.setActiveChartView(viewId);
    s.chartViewButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === viewId);
    });

    // Show/hide the correct chart container
    if (viewId === 'expensePie') {
        s.expensePieChartContainer.style.display = 'block';
        s.loanChartContent.style.display = 'none';
    } else if (viewId === 'loanChart') {
        s.expensePieChartContainer.style.display = 'none';
        s.loanChartContent.style.display = 'block';
    }

    // Call the main render function
    grid.renderActiveDashboardContent();
}

// === INITIALIZATION ===

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Initial UI Setup ---
    ui.loadMode();
    ui.initializeFooter();
    
    // --- Auth Listeners ---
    auth.initializeAuthListener(); // Sets up the onAuthStateChange
    auth.addAuthEventListeners();  // Sets up modal/button clicks

    // --- Main App Listeners ---
    s.darkModeToggle.addEventListener('change', () => {
        ui.setMode(s.darkModeToggle.checked ? 'dark' : 'light');
    });

    // Modals
    s.modalSaveBtn.addEventListener('click', () => { if (state.onSave) state.onSave(); });
    s.modalCloseBtn.addEventListener('click', ui.closeModal);
    s.modalCancelBtn.addEventListener('click', ui.closeModal);
    s.appModal.addEventListener('click', (event) => { if (event.target === s.appModal) ui.closeModal(); });

    // Section "Add" Buttons
    s.showIncomeModalBtn.addEventListener('click', () => ui.showIncomeModal());
    s.showExpenseModalBtn.addEventListener('click', () => ui.showExpenseModal());
    s.showAccountModalBtn.addEventListener('click', () => ui.showAccountModal());
    s.showTransferModalBtn.addEventListener('click', () => ui.showTransferModal());

    // List Edit/Delete
    s.incomeList.addEventListener('click', handleListClick);
    s.expenseList.addEventListener('click', handleListClick);
    s.bankingSection.addEventListener('click', handleBankingListClick);

    // Dashboard
    s.toggleDashboardBtn.addEventListener('click', () => {
        const isExpanding = !s.mainContainer.classList.contains('dashboard-expanded');
        s.mainContainer.classList.toggle('dashboard-expanded');

        if (isExpanding) {
            s.dashboardSummary.style.display = 'none';
            s.summaryChartContainer.style.display = 'none';
            s.expandedDashboardContent.style.display = 'flex';
            grid.setActiveDashboardTab(state.activeDashboardTab);
        } else {
            s.dashboardSummary.style.display = 'block';
            s.summaryChartContainer.style.display = 'none';
            s.expandedDashboardContent.style.display = 'none';
            s.tabContents.forEach(content => content.classList.remove('active')); 
        }
    });

    s.dashboardTabsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('tab-btn')) {
            grid.setActiveDashboardTab(event.target.dataset.tab);
        }
    });

    s.viewControlsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('view-btn')) {
            const viewId = event.target.dataset.view;
            if (state.activeDashboardTab === 'grids') {
                grid.setActiveGridView(viewId);
            } else if (state.activeDashboardTab === 'charts') {
                setActiveChartView(viewId);
            }
        }
    });

    // Grid
    s.gridContentArea.addEventListener('click', handleGridContentClick);
    s.gridContentArea.addEventListener('contextmenu', handleGridContextMenu);
    s.gridContextMenu.addEventListener('click', handleContextMenuClick);
    
    // Global
    document.addEventListener('click', handleDocumentClick);

    console.log("Application initialized.");
});