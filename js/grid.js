// === GRID & DASHBOARD FUNCTIONS ===
// This module contains all logic for rendering the dashboard,
// handling tab/view state, and generating the various grids.

import * as s from './selectors.js';
import * as state from './state.js';
import * as ui from './ui.js';
import * as calc from './calculations.js';
import { findTransactionStatus } from './data.js';
// === ⭐️ NEW STATIC IMPORT ===
import * as loanChart from './chart-loan.js';

// --- Main Render Function ---

export function renderAll() {
    renderIncomes();
    renderExpenses();
    renderDashboard();
    ui.renderBankingSection();

    if (state.lastNumYears !== null) {
        console.log(`Restoring state: ${state.lastNumYears} years, open year: ${state.lastOpenYear}`);
        // Set state directly
        state.setActiveDashboardTab('grids');
        state.setActiveGridView('yearly');

        // Update UI to match
        s.tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === 'grids'));
        s.viewButtonGroups.forEach(group => group.style.display = (group.dataset.tabGroup === 'grids') ? 'flex' : 'none');
        s.gridViewButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.view === 'yearly'));
        s.tabContents.forEach(content => content.classList.toggle('active', content.id === 'grid-content'));
        s.gridMonthlyContent.style.display = 'none';
        s.gridYearlyContent.style.display = 'flex';

        renderYearlySummaryTable(state.lastNumYears, true); // Pass isRestoring = true

        if (state.lastOpenYear !== null) {
             let startingNetTotal = 0;
             let yearStartAccountBalances = state.appState.accounts.reduce((acc, account) => {
                 acc[account.id] = account.current_balance;
                 return acc;
             }, {});
             
             const startYear = new Date().getFullYear();
             for (let y = startYear; y < state.lastOpenYear; y++) {
                 startingNetTotal += (calculateYearlyTotals(state.appState.incomes, y) - calculateYearlyTotals(state.appState.expenses, y));
                 yearStartAccountBalances = calculateAccountBalancesForYear(y, yearStartAccountBalances);
             }
            
            const startDate = new Date(Date.UTC(state.lastOpenYear, 0, 1));
            s.gridDetailContent.innerHTML = renderGridView(12, startDate, startingNetTotal, yearStartAccountBalances);
        } else {
             s.gridDetailContent.innerHTML = '<p>Click a year in the summary to see details.</p>';
        }

    } else if (s.mainContainer.classList.contains('dashboard-expanded')) {
        renderActiveDashboardContent();
        state.setLastNumYears(null);
        state.setLastOpenYear(null);
    } else {
         state.setLastNumYears(null);
         state.setLastOpenYear(null);
    }
}

// --- Dashboard Component Renders ---

function renderDashboard(){
    const format = num => num.toLocaleString('en-US',{style:'currency',currency:'USD'});

    // --- 1. Monthly Summary (Existing) ---
    const totalMonthlyIncome = calc.calculateMonthlyTotal(state.appState.incomes);
    const totalMonthlyExpenses = calc.calculateMonthlyTotal(state.appState.expenses);
    const netMonthly = totalMonthlyIncome - totalMonthlyExpenses;
    
    s.dashboardSummary.innerHTML=`
        <div class="summary-item">
            <h3 class="income-total">Total Monthly Income</h3>
            <p class="income-total">${format(totalMonthlyIncome)}</p>
        </div>
        <div class="summary-item">
            <h3 class="expense-total">Total Monthly Expenses</h3>
            <p class="expense-total">${format(totalMonthlyExpenses)}</p>
        </div>
        <div class="summary-item net-total">
            <h3>Net Monthly Balance</h3>
            <p>${format(netMonthly)}</p>
        </div>`;
    
    // --- 2. Forecast Summary (New) ---
    
    // A. Net Worth
    const netWorth = state.appState.accounts.reduce((total, acc) => {
        if (acc.type === 'credit_card') {
            return total - acc.current_balance; // Subtract CC balances
        }
        return total + acc.current_balance; // Add all others
    }, 0);

    // B. Estimated AGI
    // Define incomes that are *NOT* part of AGI (contributions or non-taxable)
    const nonAgiIncomeTypes = [
        'Investment Contribution', 
        'TSP', 
        'TSP Supplement', 
        'Social Security', 
        'Investment' // Dividends are taxed differently, exclude from simple AGI
    ];

    const annualTaxableIncome = calc.calculateAnnualTotal(
        state.appState.incomes,
        item => !nonAgiIncomeTypes.includes(item.type) // Filter function
    );
    
    // C. Estimated MAGI
    const annualMagiAddBacks = calc.calculateAnnualTotal(
        state.appState.expenses,
        item => item.advanced_data && item.advanced_data.is_magi_addback === true
    );
    
    const estimatedMagi = annualTaxableIncome + annualMagiAddBacks;
    
    // D. Render to the new div
    const forecastDiv = document.getElementById('dashboard-forecast');
    if (forecastDiv) { // Check if it exists
        forecastDiv.innerHTML = `
            <div class="summary-item">
                <h3>Est. Net Worth</h3>
                <p>${format(netWorth)}</p>
            </div>
            <div class="summary-item">
                <h3>Est. Annual AGI</h3>
                <p>${format(annualTaxableIncome)}</p>
            </div>
            <div class="summary-item">
                <h3>Est. Annual MAGI</h3>
                <p>${format(estimatedMagi)}</p>
            </div>
            <div class="summary-item net-total">
                <h3>MAGI Add-Backs</h3>
                <p>${format(annualMagiAddBacks)}</p>
            </div>
        `;
    }
}

export function renderIncomes(){
    ui.renderList(state.appState.incomes, s.incomeList);
}

export function renderExpenses(){
    ui.renderList(state.appState.expenses, s.expenseList);
}

// --- Dashboard Tab/View Management ---

export function setActiveDashboardTab(tabId) {
     if (state.activeDashboardTab === 'grids' && tabId !== 'grids') {
         state.setLastNumYears(null);
         state.setLastOpenYear(null);
         console.log("State cleared: Switched away from grids tab");
     }

    state.setActiveDashboardTab(tabId);
    
    s.tabButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    s.viewButtonGroups.forEach(group => {
        group.style.display = (group.dataset.tabGroup === tabId) ? 'flex' : 'none';
    });

    s.tabContents.forEach(content => {
        const contentId = (tabId === 'grids' || tabId === 'charts')
            ? `${tabId.slice(0, -1)}-content` // "grids" -> "grid"
            : `${tabId}-content`;
        content.classList.toggle('active', content.id === contentId);
    });

    renderActiveDashboardContent();
}

export function setActiveGridView(viewId) {
    if (state.activeGridView === 'yearly' && viewId !== 'yearly') {
        state.setLastNumYears(null);
        state.setLastOpenYear(null);
        console.log("State cleared: Switched away from yearly view");
    }

    state.setActiveGridView(viewId);
    s.gridViewButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === viewId);
    });

    // === ⭐️ MODIFIED FOR 3 PANELS ⭐️ ===
    if (viewId === 'yearly') {
        s.gridMonthlyContent.style.display = 'none';
        s.gridYearlyContent.style.display = 'flex';
        s.gridHistoricContent.style.display = 'none';
    } else if (viewId === 'historic') {
        s.gridMonthlyContent.style.display = 'none';
        s.gridYearlyContent.style.display = 'none';
        s.gridHistoricContent.style.display = 'flex';
    } else { // '2m' or '6m'
        s.gridMonthlyContent.style.display = 'flex';
        s.gridYearlyContent.style.display = 'none';
        s.gridHistoricContent.style.display = 'none';
    }
    // === END MODIFICATION ===

    renderActiveDashboardContent();
}

// === ⭐️ NOTE: setActiveChartView was correctly moved to app.js, so it is NOT here. ===

export async function renderActiveDashboardContent() {
    if (!s.mainContainer.classList.contains('dashboard-expanded')) return;

    if (state.activeDashboardTab === 'grids') {
        if (state.activeGridView === 'yearly') {
            renderYearlyConfigUI();
        } else if (state.activeGridView === 'historic') { // ⭐️ ADDED BLOCK
            renderHistoricConfigUI();
        } else {
            const months = (state.activeGridView === '6m') ? 6 : 2;
            s.gridMonthlyContent.innerHTML = renderGridView(months, new Date(), 0, null);
        }
    } else if (state.activeDashboardTab === 'charts') {
        
        if (state.activeChartView === 'expensePie') {
             ui.renderExpenseChart(true);
        } else if (state.activeChartView === 'loanChart') {
            try {
                loanChart.initializeLoanChart();
            } catch (err) {
                console.error("Failed to initialize loan chart:", err);
                ui.showNotification("Error loading loan chart. Check console.", "error");
            }
        // === ⭐️ ADDED THIS BLOCK ⭐️ ===
        } else if (state.activeChartView === 'reconciliationView') {
            ui.renderReconciliationList(); // Call the new function
        }
        // === END NEW BLOCK ===
    }
}

// --- Grid Rendering ---

export function renderGridView(numberOfMonths, startDate, startingNetTotal = 0, startingAccountBalances = null) {
    console.log(`Rendering grid view for ${numberOfMonths} months starting from ${startDate.toISOString()} with starting net: ${startingNetTotal}`);

    const startOfMonthUTC = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), 1));
    const months = calc.getMonthsToRender(startOfMonthUTC, numberOfMonths);

    const formatCurrency = (num) => num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    const formatDay = date => date.getUTCDate();

    // === ⭐️ 1. Identify Credit Card Accounts & Charges ===
    const creditCardAccounts = state.appState.accounts.filter(acc => acc.type === 'credit_card');
    const creditCardAccountIds = new Set(creditCardAccounts.map(acc => acc.id));
    
    // Get all expenses paid with a credit card
    const creditCardCharges = state.appState.expenses.filter(i => 
        creditCardAccountIds.has(i.payment_account_id)
    );
    
    // === ⭐️ 2. Filter Main Expense Lists to EXCLUDE CC Charges ===
    // This is critical for not double-counting.
    const recurringIncomes = state.appState.incomes.filter(i => i.interval !== 'one-time');
    const recurringExpenses = state.appState.expenses.filter(i => 
        i.interval !== 'one-time' && !creditCardAccountIds.has(i.payment_account_id)
    );
    const oneTimeIncomes = state.appState.incomes.filter(i => i.interval === 'one-time');
    const oneTimeExpenses = state.appState.expenses.filter(i => 
        i.interval === 'one-time' && !creditCardAccountIds.has(i.payment_account_id)
    );
    // === End of new/modified section ===

    let finalHTML = '<div class="grid-view-container">';
    let runningOverallNet = startingNetTotal;

    let runningAccountBalances;
    if (startingAccountBalances) {
        console.log("Using provided starting account balances:", startingAccountBalances);
        runningAccountBalances = { ...startingAccountBalances };
    } else {
        console.log("Initializing account balances from appState");
        runningAccountBalances = state.appState.accounts.reduce((acc, account) => {
            acc[account.id] = account.current_balance;
            return acc;
        }, {});
    }

    months.forEach(monthDateUTC => {
        const monthYear = monthDateUTC.toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
        const monthString = monthDateUTC.toISOString().split('T')[0];

        const generateRows = (items, type) => {
            let rowsHTML = '';
            let hasItems = false;
            let sectionTotal = 0;
            const allOccurrences = [];
            items.forEach(item => {
                const occurrences = calc.getOccurrencesInMonth(item, monthDateUTC);
                occurrences.forEach(occ => {
                    allOccurrences.push({ item: item, date: occ });
                    const statusRecord = findTransactionStatus(item.id, type, occ);
                    sectionTotal += (statusRecord && statusRecord.edited_amount !== null) ? statusRecord.edited_amount : item.amount;
                });
            });
            allOccurrences.sort((a, b) => a.date.getUTCDate() - b.date.getUTCDate());
            if (allOccurrences.length > 0) {
                hasItems = true;
                allOccurrences.forEach(occurrence => {
                    const { item, date } = occurrence;
                    const statusRecord = findTransactionStatus(item.id, type, date);
                    let statusClass = 'row-pending';
                    if (statusRecord?.status === 'paid') statusClass = 'row-paid';
                    if (statusRecord?.status === 'overdue') statusClass = 'row-overdue';
                    if (statusRecord?.status === 'highlighted') statusClass = 'row-highlighted';
                    let displayAmount = item.amount;
                    if (statusRecord && statusRecord.edited_amount !== null) {
                        displayAmount = statusRecord.edited_amount;
                        statusClass += ' row-edited';
                    }
                    const dateString = date.toISOString().split('T')[0];
                    const dueDay = formatDay(date);
                    const amount = formatCurrency(displayAmount);
                    let itemName = item.name;
                    const totalPayments = item.advanced_data?.total_payments;
                    if (totalPayments && (item.advanced_data?.item_type === 'Mortgage/Loan' || item.advanced_data?.item_type === 'Car Loan')) {
                        const currentPaymentNum = calc.calculatePaymentNumber(item.start_date, date, item.interval);
                        if (currentPaymentNum) itemName += ` <span class="payment-number">(${currentPaymentNum} of ${totalPayments})</span>`;
                    }
                    rowsHTML += `<tr class="${statusClass}" data-item-id="${item.id}" data-item-type="${type}" data-date="${dateString}" data-amount="${item.amount}" title="Right-click to change status"><td>${itemName}</td><td>${dueDay}</td><td>${amount}</td></tr>`;
                });
            }
            if (!hasItems) rowsHTML = `<tr><td colspan="3">No recurring ${type.toLowerCase()}s this month.</td></tr>`;
            return { html: rowsHTML, total: sectionTotal };
        };

        const generateOneTimeRows = () => {
            let rowsHTML = '';
            let hasItems = false;
            let totalIncome = 0;
            let totalExpense = 0;
            const allOccurrences = [];
            oneTimeIncomes.forEach(item => {
                const occurrences = calc.getOccurrencesInMonth(item, monthDateUTC);
                occurrences.forEach(occ => {
                    allOccurrences.push({ item: item, date: occ, type: 'income' });
                    const statusRecord = findTransactionStatus(item.id, 'income', occ);
                    totalIncome += (statusRecord && statusRecord.edited_amount !== null) ? statusRecord.edited_amount : item.amount;
                });
            });
            oneTimeExpenses.forEach(item => {
                const occurrences = calc.getOccurrencesInMonth(item, monthDateUTC);
                occurrences.forEach(occ => {
                    allOccurrences.push({ item: item, date: occ, type: 'expense' });
                    const statusRecord = findTransactionStatus(item.id, 'expense', occ);
                    totalExpense += (statusRecord && statusRecord.edited_amount !== null) ? statusRecord.edited_amount : item.amount;
                });
            });
            allOccurrences.sort((a, b) => a.date.getUTCDate() - b.date.getUTCDate());
            if (allOccurrences.length > 0) {
                hasItems = true;
                allOccurrences.forEach(occurrence => {
                    const { item, date, type } = occurrence;
                    const statusRecord = findTransactionStatus(item.id, type, date);
                    let statusClass = 'row-pending';
                    if (statusRecord?.status === 'paid') statusClass = 'row-paid';
                    if (statusRecord?.status === 'overdue') statusClass = 'row-overdue';
                    if (statusRecord?.status === 'highlighted') statusClass = 'row-highlighted';
                    let displayAmount = item.amount;
                    if (statusRecord && statusRecord.edited_amount !== null) {
                        displayAmount = statusRecord.edited_amount;
                        statusClass += ' row-edited';
                    }
                    const typeClass = (type === 'income') ? 'row-income-text' : 'row-expense-text';
                    const dateString = date.toISOString().split('T')[0];
                    const dueDay = formatDay(date);
                    const amount = formatCurrency(displayAmount);
                    let itemName = item.name;
                    const totalPayments = item.advanced_data?.total_payments;
                     if (totalPayments && (item.advanced_data?.item_type === 'Mortgage/Loan' || item.advanced_data?.item_type === 'Car Loan')) {
                        const currentPaymentNum = calc.calculatePaymentNumber(item.start_date, date, item.interval);
                        if (currentPaymentNum) itemName += ` <span class="payment-number">(${currentPaymentNum} of ${totalPayments})</span>`;
                    }
                    rowsHTML += `<tr class="${statusClass} ${typeClass}" data-item-id="${item.id}" data-item-type="${type}" data-date="${dateString}" data-amount="${item.amount}" title="Right-click to change status"><td>${itemName}</td><td>${dueDay}</td><td>${amount}</td></tr>`;
                });
            }
            if (!hasItems) rowsHTML = `<tr><td colspan="3">No one-time items this month.</td></tr>`;
            const net = totalIncome - totalExpense;
            return { html: rowsHTML, net: net };
        };

        const incomeData = generateRows(recurringIncomes, 'income');
        const expenseData = generateRows(recurringExpenses, 'expense');

        // === ⭐️ 3. Generate Credit Card Sections ===
        let creditCardSectionsHTML = '';
        creditCardAccounts.forEach(cardAccount => {
            // Find all charges (recurring or one-time) for this specific card
            const chargesForThisCard = creditCardCharges.filter(
                charge => charge.payment_account_id === cardAccount.id
            );
            
            // We can reuse the same row-generation logic!
            // We pass 'expense' as the type so the context menu (edit/delete) still works
            const cardData = generateRows(chargesForThisCard, 'expense'); 
            
            // Only add a section if there are charges this month
            // We check total > 0 OR if html has a row, to account for $0 edited charges
            if (cardData.total > 0 || cardData.html.includes('<tr')) {
                 creditCardSectionsHTML += `
                    <tbody class="grid-group-creditcard">
                        <tr class="grid-group-header"><td colspan="3">
                            <div class="grid-header-content">
                                <span>${cardAccount.name}</span>
                                <button class="btn-grid-add" data-action="add-grid-item" data-type="expense" data-date="${monthString}">+ Add</button>
                            </div>
                        </td></tr>
                        ${cardData.html.replace('No recurring expenses this month.', 'No charges this month.')}
                        <tr class="grid-total-row">
                            <td colspan="2">Total Charges</td>
                            <td>${formatCurrency(cardData.total)}</td>
                        </tr>
                    </tbody>
                 `;
            }
        });
        // === End of new section ===
        
        const oneTimeData = generateOneTimeRows();

        // === ⭐️ 4. Calculate Net Totals (UNCHANGED) ===
        // This is correct because expenseData and oneTimeData.net were
        // already filtered to exclude credit card charges.
        const monthlyNetTotal = (incomeData.total - expenseData.total) + oneTimeData.net;
        runningOverallNet += monthlyNetTotal;

        // --- Calculate Banking Section ---
        const bankingMonthData = calculateAccountBalancesForMonth(monthDateUTC, runningAccountBalances);
        let bankingRowsHTML = '';
        
        if (state.appState.accounts.length === 0) {
             bankingRowsHTML = `<tr><td colspan="3">No accounts defined.</td></tr>`;
        } else {
             // === ⭐️ MODIFIED: Filter out CCs from banking balance view ===
             state.appState.accounts.filter(acc => acc.type !== 'credit_card').forEach(acc => {
                 const startBal = runningAccountBalances[acc.id] || 0;
                 const endBal = bankingMonthData.endingBalances[acc.id] || 0;
                 bankingRowsHTML += `
                     <tr>
                         <td>${acc.name}</td>
                         <td>${formatCurrency(startBal)}</td>
                         <td>${formatCurrency(endBal)}</td>
                     </tr>
                 `;
             });
        }

        let transferRowsHTML = '';
        const allTransferOccurrences = [];
        state.appState.transfers.forEach(transfer => {
            const occurrences = calc.getOccurrencesInMonth(transfer, monthDateUTC);
            occurrences.forEach(occDate => {
                allTransferOccurrences.push({ transfer, occDate });
            });
        });
        allTransferOccurrences.sort((a, b) => a.occDate.getUTCDate() - b.occDate.getUTCDate());

        if (allTransferOccurrences.length > 0) {
            transferRowsHTML += '<tr class="grid-group-header"><td colspan="3">Monthly Transfers</td></tr>';
            
            allTransferOccurrences.forEach(({ transfer, occDate }) => {
                const desc = transfer.description || 'Transfer';
                const day = formatDay(occDate);
                const dateString = occDate.toISOString().split('T')[0];
                const statusRecord = findTransactionStatus(transfer.id, 'transfer', occDate);
                let statusClass = 'grid-banking-transfer-row row-pending';
                if (statusRecord?.status === 'paid') statusClass = 'grid-banking-transfer-row row-paid';
                if (statusRecord?.status === 'overdue') statusClass = 'grid-banking-transfer-row row-overdue';
                if (statusRecord?.status === 'highlighted') statusClass = 'grid-banking-transfer-row row-highlighted';
                
                let displayAmount = transfer.amount;
                if (statusRecord && statusRecord.edited_amount !== null) {
                    displayAmount = statusRecord.edited_amount;
                    statusClass += ' row-edited';
                }
                const amount = formatCurrency(displayAmount);

                transferRowsHTML += `
                    <tr class="${statusClass}" 
                        data-item-id="${transfer.id}" 
                        data-item-type="transfer" 
                        data-date="${dateString}" 
                        data-amount="${transfer.amount}" 
                        title="Right-click to change status">
                        
                        <td>${desc}</td>
                        <td>${day}</td>
                        <td>${amount}</td>
                    </tr>`;
            });
        }
        
        bankingRowsHTML += transferRowsHTML;
        runningAccountBalances = bankingMonthData.endingBalances;
        
        const incomeTotalFormatted = formatCurrency(incomeData.total);
        const expenseTotalFormatted = formatCurrency(expenseData.total);
        const oneTimeNetFormatted = formatCurrency(oneTimeData.net);
        const monthlyNetTotalFormatted = formatCurrency(monthlyNetTotal);
        const overallNetTotalFormatted = formatCurrency(runningOverallNet);

        // === ⭐️ 5. Inject new HTML into the final string ===
        finalHTML += `
            <div class="month-grid-container">
                <h3 class="month-grid-header">${monthYear}</h3>
                <table class="month-grid-table">
                    <thead>
                        <tr><th>Name</th><th>Due Day(s)</th><th>Amount</th></tr>
                    </thead>
                    <tbody class="grid-grand-total">
                        <tr class="grid-monthly-net-total-row"><td colspan="2">MONTHLY NET TOTAL</td><td>${monthlyNetTotalFormatted}</td></tr>
                        <tr class="grid-overall-net-total-row"><td colspan="2">OVERALL NET TOTAL</td><td>${overallNetTotalFormatted}</td></tr>
                    </tbody>
                    <tbody class="grid-group-income">
                        <tr class="grid-group-header"><td colspan="3"><div class="grid-header-content"><span>Income</span><button class="btn-grid-add" data-action="add-grid-item" data-type="income" data-date="${monthString}">+ Add</button></div></td></tr>
                        ${incomeData.html}
                        <tr class="grid-total-row"><td colspan="2">Total Income</td><td>${incomeTotalFormatted}</td></tr>
                    </tbody>
                    <tbody class="grid-group-expense">
                        <tr class="grid-group-header"><td colspan="3"><div class="grid-header-content"><span>Expenses (Cash/Bank)</span><button class="btn-grid-add" data-action="add-grid-item" data-type="expense" data-date="${monthString}">+ Add</button></div></td></tr>
                        ${expenseData.html}
                        <tr class="grid-total-row"><td colspan="2">Total Expenses</td><td>${expenseTotalFormatted}</td></tr>
                    </tbody>
                    
                    ${creditCardSectionsHTML} <tbody class="grid-group-onetime">
                        <tr class="grid-group-header"><td colspan="3"><div class="grid-header-content"><span>One-time (Cash/Bank)</span><div class="grid-header-buttons"><button class="btn-grid-add" data-action="add-grid-item" data-type="income" data-date="${monthString}" data-interval="one-time">+ Income</button><button class="btn-grid-add" data-action="add-grid-item" data-type="expense" data-date="${monthString}" data-interval="one-time">+ Expense</button></div></div></td></tr>
                        ${oneTimeData.html}
                        <tr class="grid-total-row"><td colspan="2">One-time Net</td><td>${oneTimeNetFormatted}</td></tr>
                    </tbody>
                    <tbody class="grid-group-banking">
                        <tr class="grid-group-header"><td colspan="3"><div class="grid-header-content"><span>Banking</span></div></td></tr>
                        ${bankingRowsHTML}
                    </tbody>
                </table>
            </div>
        `;
    });

    finalHTML += '</div>';
    return finalHTML;
}

// --- Yearly Summary & Banking Calculations ---

export function renderYearlyConfigUI() {
    s.gridYearlySummaryPanel.innerHTML = `
        <h3>Yearly Forecast</h3>
        <p>Select the number of years to forecast.</p>
        <div class="form-group">
            <label for="yearly-forecast-years">Years (1-30):</label>
            <input type="number" id="yearly-forecast-years" value="10" min="1" max="30" step="1">
        </div>
        <button id="btn-generate-yearly-summary" class="btn-primary">Generate Summary</button>
        <div id="yearly-summary-table-container">
            </div>

        <details id="edits-log-details" class="edits-log-container">
            <summary class="edits-log-summary">Edits Log</summary>
            <div id="edits-log-content">
                <p>No edits found.</p> 
            </div>
        </details>
    `;
    s.gridDetailContent.innerHTML = '<p>Click a year in the summary to see details.</p>';
}

export function calculateYearlyTotals(items, year) {
    let yearTotal = 0;
    const itemType = items === state.appState.incomes ? 'income' : 'expense';

    items.forEach(item => {
        let itemYearTotal = 0;
        const itemStartDate = calc.parseUTCDate(item.start_date);
        if (!itemStartDate) return;
        
        for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
            const monthDate = new Date(Date.UTC(year, monthIndex, 1));
            const occurrences = calc.getOccurrencesInMonth(item, monthDate); 

            occurrences.forEach(occurrenceDate => {
                const statusRecord = findTransactionStatus(item.id, itemType, occurrenceDate);
                if (statusRecord && statusRecord.edited_amount !== null) {
                    itemYearTotal += statusRecord.edited_amount;
                } else {
                    itemYearTotal += item.amount;
                }
            });
        }
        yearTotal += itemYearTotal;
    });

    return yearTotal;
}

export function renderYearlySummaryTable(numYears, isRestoring = false) {
    if (isNaN(numYears) || numYears < 1 || numYears > 30) {
         const numYearsInput = s.gridYearlySummaryPanel.querySelector('#yearly-forecast-years');
         numYears = numYearsInput ? parseInt(numYearsInput.value, 10) : NaN;
         if (isNaN(numYears) || numYears < 1 || numYears > 30) {
              ui.showNotification("Please enter a number of years between 1 and 30.", "error");
              return;
         }
    }
    const tableContainer = s.gridYearlySummaryPanel.querySelector('#yearly-summary-table-container');
    if (!tableContainer) { return; }
    
    const formatCurrency = num => num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    const startYear = new Date().getFullYear();
    let runningOverallNet = 0;
    let tableHTML = `
        <div class="yearly-summary-header">
            <h4>${numYears}-Year Summary</h4>
            <button id="btn-reset-yearly-summary" class="btn-secondary">Reset</button>
        </div>
        <table class="yearly-summary-table">
            <thead>
                <tr><th>Year</th><th>Income</th><th>Expenses</th><th>Yearly Net</th><th>Overall Net</th></tr>
            </thead>
            <tbody>
    `;
    for (let i = 0; i < numYears; i++) {
        const currentYear = startYear + i;
        const totalIncome = calculateYearlyTotals(state.appState.incomes, currentYear);
        const totalExpense = calculateYearlyTotals(state.appState.expenses, currentYear);
        const yearlyNet = totalIncome - totalExpense;
        runningOverallNet += yearlyNet;
        tableHTML += `
            <tr class="year-summary-row" data-year="${currentYear}">
                <td><button class="btn-link" data-year="${currentYear}">${currentYear}</button></td>
                <td>${formatCurrency(totalIncome)}</td><td>${formatCurrency(totalExpense)}</td>
                <td>${formatCurrency(yearlyNet)}</td><td>${formatCurrency(runningOverallNet)}</td>
            </tr>
        `;
    }
    tableHTML += `</tbody></table>`;
    tableContainer.innerHTML = tableHTML;

    const numYearsInputEl = s.gridYearlySummaryPanel.querySelector('#yearly-forecast-years');
    const generateBtnEl = s.gridYearlySummaryPanel.querySelector('#btn-generate-yearly-summary');
    if (numYearsInputEl) numYearsInputEl.style.display = 'none';
    if (generateBtnEl) generateBtnEl.style.display = 'none';

    ui.renderEditsLog();

    if (!isRestoring) {
        state.setLastNumYears(numYears);
        state.setLastOpenYear(null);
        console.log(`State updated (not restoring): lastNumYears=${state.lastNumYears}, lastOpenYear=${state.lastOpenYear}`);
    } else {
         state.setLastNumYears(numYears);
         console.log(`State maintained (restoring): lastNumYears=${state.lastNumYears}, lastOpenYear=${state.lastOpenYear}`);
    }
}

/**
 * Finds all unique past years from the data to populate the Historic view.
 */
function getHistoricYears() {
    const allItems = [...state.appState.incomes, ...state.appState.expenses];
    if (allItems.length === 0) return [new Date().getFullYear()]; // ⭐️ Return current year if no data

    let minYear = new Date().getFullYear();
    allItems.forEach(item => {
        const itemDate = calc.parseUTCDate(item.start_date);
        if (itemDate) {
            const itemYear = itemDate.getUTCFullYear();
            if (itemYear < minYear) {
                minYear = itemYear;
            }
        }
    });

    const currentYear = new Date().getFullYear();
    const years = [];
    
    // === ⭐️ FIX IS HERE: Use <= to include the current year ===
    for (let y = minYear; y <= currentYear; y++) {
        years.push(y);
    }
    return years.sort((a, b) => b - a); // Sort descending (e.g., 2025, 2024, 2023)
}

/**
 * Renders the UI for selecting a historic year to review.
 */
export function renderHistoricConfigUI() {
    const historicYears = getHistoricYears();
    let buttonsHTML = '';

    if (historicYears.length > 0) {
        buttonsHTML = historicYears.map(year => 
            `<button class="btn-link" data-historic-year="${year}">${year}</button>`
        ).join('<br>'); // Simple list of buttons
    } else {
        buttonsHTML = '<p>No historic data found (from years prior to this one).</p>';
    }

    s.gridHistoricYearPanel.innerHTML = `
        <h3>Historic Review</h3>
        <p>Select a year to review:</p>
        <div class="historic-year-list">
            ${buttonsHTML}
        </div>
    `;

    s.gridHistoricDetailContent.innerHTML = '<p>Click a year in the list to see the 12-month review.</p>';
}

export function calculateAccountBalancesForMonth(monthDateUTC, startingBalances) {
    const endingBalances = { ...startingBalances };
    const deltas = {};

    state.appState.accounts.forEach(acc => {
        deltas[acc.id] = { deposits: 0, transfers: 0, payments: 0, growth: 0 };
        if (endingBalances[acc.id] === undefined) {
            endingBalances[acc.id] = 0;
        }
    });

    state.appState.accounts.forEach(acc => {
        if (acc.type === 'investment' && acc.growth_rate && acc.growth_rate > 0) {
            
            // === ⭐️ FIX IS HERE ⭐️ ===
            // Old logic (incorrect): const monthlyGrowthRate = acc.growth_rate / 12;
            // New logic: Find the monthly rate that compounds to the annual rate.
            const monthlyGrowthRate = Math.pow(1 + acc.growth_rate, 1 / 12) - 1;
            // === END FIX ===

            const growthAmount = (endingBalances[acc.id] || 0) * monthlyGrowthRate;
            endingBalances[acc.id] = (endingBalances[acc.id] || 0) + growthAmount;
            deltas[acc.id].growth += growthAmount;
        }
    });

    state.appState.incomes.forEach(income => {
        if (income.deposit_account_id) {
            const occurrences = calc.getOccurrencesInMonth(income, monthDateUTC);
            occurrences.forEach(occDate => {
                const statusRecord = findTransactionStatus(income.id, 'income', occDate);
                const amount = (statusRecord && statusRecord.edited_amount !== null) ? statusRecord.edited_amount : income.amount;
                endingBalances[income.deposit_account_id] = (endingBalances[income.deposit_account_id] || 0) + amount;
                deltas[income.deposit_account_id].deposits += amount;
            });
        }
    });

    state.appState.expenses.forEach(expense => {
        if (expense.payment_account_id) {
            const occurrences = calc.getOccurrencesInMonth(expense, monthDateUTC);
            occurrences.forEach(occDate => {
                const statusRecord = findTransactionStatus(expense.id, 'expense', occDate);
                const amount = (statusRecord && statusRecord.edited_amount !== null) ? statusRecord.edited_amount : expense.amount;
                endingBalances[expense.payment_account_id] = (endingBalances[expense.payment_account_id] || 0) - amount;
                deltas[expense.payment_account_id].payments -= amount;
            });
        }
    });

    state.appState.transfers.forEach(transfer => {
        const occurrences = calc.getOccurrencesInMonth(transfer, monthDateUTC);
        occurrences.forEach(() => {
            endingBalances[transfer.from_account_id] = (endingBalances[transfer.from_account_id] || 0) - transfer.amount;
            deltas[transfer.from_account_id].transfers -= transfer.amount;
            endingBalances[transfer.to_account_id] = (endingBalances[transfer.to_account_id] || 0) + transfer.amount;
            deltas[transfer.to_account_id].transfers += transfer.amount;
        });
    });

    return { endingBalances, deltas };
}

export function calculateAccountBalancesForYear(year, startingBalances) {
    let runningBalances = { ...startingBalances };

    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
        const monthDate = new Date(Date.UTC(year, monthIndex, 1));
        const monthData = calculateAccountBalancesForMonth(monthDate, runningBalances);
        runningBalances = monthData.endingBalances; 
    }
    
    return runningBalances;
}