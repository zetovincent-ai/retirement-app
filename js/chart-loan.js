// === LOAN CHART FUNCTIONS ===

import * as s from './selectors.js';
import * as state from './state.js';
import { getLoanAmortization } from './data.js'; 
// Removed 'getDynamicAmortization' as we no longer chart expenses directly

const CHART_COLORS = ['#3498db', '#e74c3c', '#9b59b6', '#f1c40f', '#2ecc71', '#1abc9c', '#e67e22', '#95a5a6'];

export function initializeLoanChart() {
    populateLoanSelect();
    addLoanChartListeners();
    renderLoanChart(); 
}

function populateLoanSelect() {
    const container = s.loanChartSelectContainer;
    container.innerHTML = '';
    
    // ⭐️ UPDATED: Only fetch real Loan Accounts (ignore legacy expenses)
    const loanAccounts = state.appState.accounts.filter(a => a.type === 'loan');

    if (loanAccounts.length === 0) {
        container.innerHTML = '<span style="color:#666; font-size:0.9rem;">No loan accounts found. Add one in "Loans & Credit".</span>';
        return;
    }

    loanAccounts.forEach(item => {
        const div = document.createElement('div');
        div.className = 'checkbox-item';
        // We simplified the ID since we don't need 'legacy-' or 'account-' prefixes anymore,
        // but keeping "account-" prefix ensures uniqueness if we expand later.
        div.innerHTML = `
            <input type="checkbox" id="loan-select-account-${item.id}" value="account-${item.id}" checked>
            <label for="loan-select-account-${item.id}">${item.name}</label>
        `;
        container.appendChild(div);
    });
}

function addLoanChartListeners() {
    // Remove existing listeners to prevent duplicates if re-initialized
    const newContainer = s.loanChartSelectContainer.cloneNode(true);
    s.loanChartSelectContainer.parentNode.replaceChild(newContainer, s.loanChartSelectContainer);
    s.loanChartSelectContainer = newContainer; // Update selector reference (conceptually) if we were re-exporting, 
                                               // but for this simple app, just adding the listener is usually fine 
                                               // if we don't call initialize multiple times. 
                                               // To be safe, we'll just add the listener directly as before.
    
    s.loanChartSelectContainer.addEventListener('click', (event) => {
        if (event.target.type !== 'checkbox') return;
        renderLoanChart();
    });
    
    // Handle timeframe changes
    s.loanTimeframeSelect.removeEventListener('change', handleTimeframeChange); // Clean up old if possible
    s.loanTimeframeSelect.addEventListener('change', handleTimeframeChange);
}

function handleTimeframeChange() {
    state.setLoanChartSelections({ ...state.loanChartSelections, timeframe: parseInt(s.loanTimeframeSelect.value) });
    renderLoanChart();
}

function renderLoanChart() {
    if (!state.loanChartInstance) {
        const ctx = s.loanChartCanvas.getContext('2d');
        const newChart = new Chart(ctx, { type: 'line', data: { labels: [], datasets: [] }, options: { responsive: true, maintainAspectRatio: false } });
        state.setLoanChartInstance(newChart);
    }
    
    const chart = state.loanChartInstance;
    const checkboxes = s.loanChartSelectContainer.querySelectorAll('input[type="checkbox"]:checked');
    const selectedIds = Array.from(checkboxes).map(cb => cb.value); 
    
    const years = parseInt(s.loanTimeframeSelect.value);
    const labels = Array.from({ length: years + 1 }, (_, i) => `Year ${i}`);
    
    const datasets = [];
    
    selectedIds.forEach((val, index) => {
        const [type, idStr] = val.split('-');
        const id = parseInt(idStr);
        let schedule = null;
        let name = '';

        // ⭐️ UPDATED: Only handle 'account' type
        if (type === 'account') {
            const account = state.appState.accounts.find(a => a.id === id);
            if (account) {
                name = account.name;
                const data = getLoanAmortization(account); 
                if (data) schedule = data.schedule;
            }
        }

        if (schedule) {
            const dataPoints = [];
            // Calculate starting balance from the first month's data
            const startBal = schedule.length > 0 ? (schedule[0].remainingBalance + schedule[0].principalPayment) : 0;
            dataPoints.push(startBal);

            for (let y = 1; y <= years; y++) {
                const monthIndex = (y * 12) - 1; 
                if (monthIndex < schedule.length) {
                    dataPoints.push(schedule[monthIndex].remainingBalance);
                } else {
                    dataPoints.push(0);
                }
            }

            datasets.push({
                label: name,
                data: dataPoints,
                borderColor: CHART_COLORS[index % CHART_COLORS.length],
                backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                tension: 0.1
            });
        }
    });

    chart.data.labels = labels;
    chart.data.datasets = datasets;
    chart.update();
}