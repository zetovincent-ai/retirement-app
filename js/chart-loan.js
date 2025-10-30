// === LOAN CHART FUNCTIONS ===
// This module handles all logic for the new loan forecast chart.

import * as s from './selectors.js';
import * as state from './state.js';
import { getDynamicAmortization } from './data.js';
import * as calc from './calculations.js';

// Chart.js instance is defined in state.js as loanChartInstance
// Chart settings are in state.js as loanChartSelections

// Color palette for the chart lines
const CHART_COLORS = [
    '#3498db', '#e74c3c', '#9b59b6', '#f1c40f', 
    '#2ecc71', '#1abc9c', '#e67e22', '#95a5a6'
];

/**
 * Main initialization function for the loan chart view.
 * Called when the user clicks the "Loans" tab.
 */
export function initializeLoanChart() {
    console.log("Initializing loan chart...");
    populateLoanSelect();
    addLoanChartListeners();
    renderLoanChart(); // Initial render
}

/**
 * Adds event listeners for the loan chart controls.
 * This is called once by initializeLoanChart.
 */
function addLoanChartListeners() {
    // We use 'change' for multi-select
    s.loanChartSelect.addEventListener('change', () => {
        const selectedOptions = Array.from(s.loanChartSelect.selectedOptions);
        const selectedLoanIds = selectedOptions.map(opt => parseInt(opt.value));
        
        state.setLoanChartSelections({
            ...state.loanChartSelections,
            loans: selectedLoanIds
        });
        console.log("Updated loan selection:", state.loanChartSelections.loans);
        renderLoanChart();
    });

    s.loanTimeframeSelect.addEventListener('change', () => {
        const newTimeframe = parseInt(s.loanTimeframeSelect.value);
        state.setLoanChartSelections({
            ...state.loanChartSelections,
            timeframe: newTimeframe
        });
        console.log("Updated timeframe:", state.loanChartSelections.timeframe);
        renderLoanChart();
    });
}

/**
 * Populates the multi-select dropdown with all available loans.
 */
function populateLoanSelect() {
    const allLoans = state.appState.expenses.filter(exp => 
        exp.advanced_data &&
        (exp.advanced_data.item_type === 'Mortgage/Loan' || exp.advanced_data.item_type === 'Car Loan')
    );

    s.loanChartSelect.innerHTML = ''; // Clear existing options
    if (allLoans.length === 0) {
        s.loanChartSelect.innerHTML = '<option value="" disabled>No loans found</option>';
        return;
    }

    allLoans.forEach(loan => {
        const option = document.createElement('option');
        option.value = loan.id;
        option.textContent = loan.name;
        // Pre-select if it was selected before
        if (state.loanChartSelections.loans.includes(loan.id)) {
            option.selected = true;
        }
        s.loanChartSelect.appendChild(option);
    });
}

/**
 * Generates the complete Chart.js data object based on current state.
 * @returns {object} Chart.js data object { labels, datasets }
 */
function generateLoanChartData() {
    const { loans: selectedLoanIds, timeframe } = state.loanChartSelections;
    
    // 1. Generate Labels (X-axis)
    // We'll show one label per year
    const startYear = new Date().getFullYear();
    const endYear = startYear + timeframe;
    const labels = [];
    for (let year = startYear; year <= endYear; year++) {
        labels.push(year);
    }

    let maxPrincipal = 0; // To set the Y-axis max

    // 2. Generate Datasets (the lines)
    const datasets = selectedLoanIds.map((loanId, index) => {
        const loan = state.appState.expenses.find(exp => exp.id === loanId);
        if (!loan) return null;

        // Update max Y-axis value
        if (loan.advanced_data.original_principal > maxPrincipal) {
            maxPrincipal = loan.advanced_data.original_principal;
        }

        // Get the full, dynamic amortization schedule
        const amortization = getDynamicAmortization(loan);
        if (!amortization) return null;

        const schedule = amortization.schedule;
        
        // Use a Map for efficient yearly balance lookup
        const yearlyBalanceMap = new Map();
        schedule.forEach(entry => {
            // Get the year for this payment month
            // Note: Amortization 'month' is 1-based, not 0-based
            const paymentDate = new Date(calc.parseUTCDate(loan.start_date).getTime());
            paymentDate.setUTCMonth(paymentDate.getUTCMonth() + (entry.month - 1));
            const year = paymentDate.getUTCFullYear();

            // Store the *last* remaining balance for each year
            yearlyBalanceMap.set(year, entry.remainingBalance);
        });

        // 3. Build the data array for this loan
        const data = [];
        let lastKnownBalance = loan.advanced_data.original_principal;
        
        for (const year of labels) {
            if (yearlyBalanceMap.has(year)) {
                // We have a balance for this year
                lastKnownBalance = yearlyBalanceMap.get(year);
            } else if (year < new Date(calc.parseUTCDate(loan.start_date).getTime()).getUTCFullYear()) {
                // Year is before the loan started, show original principal
                lastKnownBalance = loan.advanced_data.original_principal;
            }
            // If the year is past the last payment, lastKnownBalance will be 0
            
            data.push(lastKnownBalance);
        }
        
        const color = CHART_COLORS[index % CHART_COLORS.length];
        return {
            label: loan.name,
            data: data,
            borderColor: color,
            backgroundColor: `${color}33`, // Lighter fill
            fill: false,
            tension: 0.1
        };

    }).filter(ds => ds !== null); // Filter out any nulls

    return {
        labels,
        datasets,
        yAxisMax: maxPrincipal * 1.05 // Add 5% padding
    };
}

/**
 * Renders or updates the loan chart on the canvas.
 */
async function renderLoanChart() {
    
    // Destroy existing chart instance if it exists
    if (state.loanChartInstance) {
        state.loanChartInstance.destroy();
        state.setLoanChartInstance(null);
    }

    const { labels, datasets, yAxisMax } = generateLoanChartData();

    if (datasets.length === 0) {
        console.log("No loans selected to render.");
        // We could draw "Please select a loan" on the canvas here
        return;
    }

    const ctx = s.loanChartCanvas.getContext('2d');
    const newChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom', // Key at the bottom
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) { label += ': '; }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Remaining Principal'
                    },
                    beginAtZero: true,
                    max: yAxisMax // Dynamic Y-axis
                }
            }
        }
    });

    state.setLoanChartInstance(newChart);
}