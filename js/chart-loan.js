// === LOAN CHART FUNCTIONS ===

import * as s from './selectors.js';
import * as state from './state.js';
import { getDynamicAmortization, getLoanAmortization } from './data.js'; 
import * as calc from './calculations.js';

const CHART_COLORS = ['#3498db', '#e74c3c', '#9b59b6', '#f1c40f', '#2ecc71', '#1abc9c', '#e67e22', '#95a5a6'];

export function initializeLoanChart() {
    populateLoanSelect();
    addLoanChartListeners();
    renderLoanChart(); 
}

function populateLoanSelect() {
    const container = s.loanChartSelectContainer;
    container.innerHTML = '';
    
    // 1. Find Legacy Loans (Expenses with type Mortgage/Loan)
    const legacyLoans = state.appState.expenses.filter(e => 
        e.advanced_data && (e.advanced_data.item_type === 'Mortgage/Loan' || e.advanced_data.item_type === 'Car Loan')
    );

    // 2. Find New Loan Accounts (Accounts with type Loan)
    const loanAccounts = state.appState.accounts.filter(a => a.type === 'loan');

    const allLoans = [
        ...legacyLoans.map(i => ({ id: i.id, name: i.name, type: 'legacy' })),
        ...loanAccounts.map(a => ({ id: a.id, name: a.name, type: 'account' }))
    ];

    if (allLoans.length === 0) {
        container.innerHTML = '<span style="color:#666; font-size:0.9rem;">No loans found. Add a Loan Account or Expense.</span>';
        return;
    }

    allLoans.forEach(item => {
        const div = document.createElement('div');
        div.className = 'checkbox-item';
        div.innerHTML = `
            <input type="checkbox" id="loan-select-${item.type}-${item.id}" value="${item.type}-${item.id}" checked>
            <label for="loan-select-${item.type}-${item.id}">${item.name}</label>
        `;
        container.appendChild(div);
    });
}

function addLoanChartListeners() {
    s.loanChartSelectContainer.addEventListener('click', (event) => {
        if (event.target.type !== 'checkbox') return;
        renderLoanChart();
    });
    s.loanTimeframeSelect.addEventListener('change', () => {
        state.setLoanChartSelections({ ...state.loanChartSelections, timeframe: parseInt(s.loanTimeframeSelect.value) });
        renderLoanChart();
    });
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

        if (type === 'legacy') {
            const item = state.appState.expenses.find(e => e.id === id);
            if (item) {
                name = item.name;
                const data = getDynamicAmortization(item); 
                if (data) schedule = data.schedule;
            }
        } else if (type === 'account') {
            const account = state.appState.accounts.find(a => a.id === id);
            if (account) {
                name = account.name;
                const data = getLoanAmortization(account); 
                if (data) schedule = data.schedule;
            }
        }

        if (schedule) {
            const dataPoints = [];
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