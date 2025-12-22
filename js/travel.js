// === TRAVEL MODULE ===
// Handles the Trip Planner logic, rendering, and currency math.

import * as s from './selectors.js';
import * as state from './state.js';
import * as ui from './ui.js';
import * as data from './data.js';
import * as currency from './currency.js';
import { parseUTCDate } from './calculations.js';
import { getExchangeRate, getAvailableCurrencies } from './currency.js';

export function initTravelApp() {
    // Listener for the "Add Destination" button
    if (s.addTravelItemBtn) {
        s.addTravelItemBtn.addEventListener('click', () => showTripModal());
    }
    
    // Listener for Trip List actions (Delete / Edit / Open)
    if (s.travelList) {
        s.travelList.addEventListener('click', handleTravelListClick);
    }
}

/**
 * Renders the list of trips.
 * Calculates "Live Purchasing Power" on the fly.
 */
export async function renderTripsList() {
    if (!s.travelList) return;
    s.travelList.innerHTML = '<li>Loading trips...</li>';

    const trips = state.appState.trips;
    
    if (!trips || trips.length === 0) {
        s.travelList.innerHTML = '<li><em>No upcoming trips planned. Add a destination!</em></li>';
        return;
    }

    s.travelList.innerHTML = ''; // Clear loading message

    // Sort by start date
    trips.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

    for (const trip of trips) {
        // 1. Fetch Live Rate
        // We use 'latest' to get the current real-world buying power
        const currentRate = await currency.getExchangeRate(trip.home_currency, trip.target_currency, 'latest');
        
        // 2. Calculate "Plan vs Actual" purchasing power
        const initialPower = trip.budget_home_currency * trip.initial_exchange_rate; // What you THOUGHT you'd get
        const currentPower = trip.budget_home_currency * currentRate;                // What you'd get TODAY
        const delta = currentPower - initialPower;
        
        // 3. Formatter for Home Currency (e.g., USD)
        const formatHome = new Intl.NumberFormat('en-US', { style: 'currency', currency: trip.home_currency }).format;
        // 4. Formatter for Target Currency (e.g., JPY)
        const formatTarget = new Intl.NumberFormat('en-US', { style: 'currency', currency: trip.target_currency }).format;

        // 5. Determine Health Arrow
        let healthHTML = '';
        if (trip.home_currency !== trip.target_currency) {
            const isGain = delta >= 0;
            const colorClass = isGain ? 'income-total' : 'expense-total'; // Reuse green/red classes
            const arrow = isGain ? '▲' : '▼';
            const pct = ((delta / initialPower) * 100).toFixed(1);
            
            healthHTML = `
                <div style="font-size: 0.85rem; margin-top: 4px;">
                    <span style="color: var(--secondary-btn-bg);">Planned: ${formatTarget(initialPower)}</span> <br>
                    <span style="font-weight: bold;">Live Power: ${formatTarget(currentPower)}</span>
                    <span class="${colorClass}" style="font-weight: bold; margin-left: 5px;">
                        ${arrow} ${formatTarget(Math.abs(delta))} (${isGain ? '+' : ''}${pct}%)
                    </span>
                </div>
            `;
        } else {
            healthHTML = `<div style="font-size: 0.85rem; color: var(--text-color);">Domestic Trip (No Exchange Rate)</div>`;
        }

        const dateRange = `${trip.start_date} to ${trip.end_date}`;
        
        // 6. Build the Card HTML
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="item-details">
                <strong style="font-size: 1.1rem;">${trip.name}</strong> 
                <span style="font-size: 0.9rem; color: var(--secondary-btn-bg);">(${dateRange})</span>
                <div style="margin-top: 5px;">
                    <strong>Budget: ${formatHome(trip.budget_home_currency)}</strong>
                </div>
                ${healthHTML}
            </div>
            <div class="item-controls">
                <button class="edit-btn" data-id="${trip.id}">Edit</button>
                <button class="delete-btn" data-id="${trip.id}">X</button>
            </div>
        `;
        s.travelList.appendChild(li);
    }
}

async function handleTravelListClick(event) {
    const target = event.target;
    const id = parseInt(target.dataset.id);
    if (!id) return;

    if (target.classList.contains('delete-btn')) {
        await data.deleteTrip(id);
        // Re-render handled by data.fetchData() -> data.js -> renderAll? 
        // We might need to manually trigger renderTripsList if renderAll doesn't cover it yet.
        renderTripsList();
    } else if (target.classList.contains('edit-btn')) {
        showTripModal(id);
    }
}

/**
 * Shows the modal to Add or Edit a trip.
 * Now fetches dynamic currencies from the API.
 */
export async function showTripModal(tripId = null) {
    const isEdit = tripId !== null;
    const trip = isEdit ? state.appState.trips.find(t => t.id === tripId) : null;
    
    s.modalTitle.textContent = isEdit ? 'Edit Trip' : 'Plan New Trip';

    // 1. Fetch Dynamic Currencies from API
    const currencies = await currency.getAvailableCurrencies();
    
    // 2. Generate Options (Sorted Alphabetically by Code)
    const currencyOptions = Object.entries(currencies)
        .sort(([codeA], [codeB]) => codeA.localeCompare(codeB))
        .map(([code, name]) => `<option value="${code}">${name} (${code})</option>`)
        .join('');

    s.modalBody.innerHTML = `
        <div class="form-group">
            <label>Destination Name:</label>
            <input type="text" id="trip-name" placeholder="e.g. Spring in Tokyo" value="${trip ? trip.name : ''}" required>
        </div>
        <div class="form-group">
            <label>Start Date:</label>
            <input type="date" id="trip-start" value="${trip ? trip.start_date : ''}" required>
        </div>
        <div class="form-group">
            <label>End Date:</label>
            <input type="date" id="trip-end" value="${trip ? trip.end_date : ''}" required>
        </div>
        <hr class="divider">
        <div class="form-group">
            <label>Budget (${trip ? trip.home_currency : 'USD'}):</label>
            <input type="number" id="trip-budget" placeholder="5000" value="${trip ? trip.budget_home_currency : ''}" required>
        </div>
        <div class="form-group">
            <label>Target Currency:</label>
            <select id="trip-target-currency">
                ${currencyOptions}
            </select>
        </div>
        <div id="rate-preview" style="font-size: 0.9rem; text-align: right; color: var(--secondary-btn-bg); margin-top: 5px;">
            Current Rate: Loading...
        </div>
    `;

    const currencySelect = document.getElementById('trip-target-currency');
    const ratePreview = document.getElementById('rate-preview');
    
    // Set default value (Trip's currency if editing, otherwise JPY, fallback to first available)
    if (trip && currencies[trip.target_currency]) {
        currencySelect.value = trip.target_currency;
    } else {
        currencySelect.value = currencies['JPY'] ? 'JPY' : Object.keys(currencies)[0];
    }

    // --- Helper to update rate preview ---
    const updateRatePreview = async () => {
        const target = currencySelect.value;
        const rate = await currency.getExchangeRate('USD', target, 'latest'); // Assuming USD home for now
        ratePreview.textContent = `Current Rate: 1 USD = ${rate} ${target}`;
    };
    
    currencySelect.addEventListener('change', updateRatePreview);
    updateRatePreview(); // Run once on open

    // --- Save Handler ---
    state.setOnSave(async () => {
        const name = document.getElementById('trip-name').value;
        const start = document.getElementById('trip-start').value;
        const end = document.getElementById('trip-end').value;
        const budget = parseFloat(document.getElementById('trip-budget').value);
        const targetCurr = document.getElementById('trip-target-currency').value;

        if (!name || !start || !budget) {
            alert("Please fill in the required fields.");
            return;
        }

        // Fetch the rate at the moment of saving (The "Anchor" rate)
        let initialRate = trip ? trip.initial_exchange_rate : null;
        if (!initialRate) {
            initialRate = await currency.getExchangeRate('USD', targetCurr, 'latest');
        }

        const tripData = {
            id: tripId, // undefined if new
            name,
            start_date: start,
            end_date: end,
            home_currency: 'USD', // Hardcoded for now
            target_currency: targetCurr,
            budget_home_currency: budget,
            initial_exchange_rate: initialRate
        };

        const success = await data.saveTrip(tripData);
        if (success) {
            ui.closeModal();
            renderTripsList();
        }
    });

    ui.openModal();
}