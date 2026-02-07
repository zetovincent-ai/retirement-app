// === TRAVEL MODULE ===
// Handles the Trip Planner logic, rendering, and currency math.

import * as s from './selectors.js';
import * as state from './state.js';
import * as ui from './ui.js';
import * as data from './data.js';
import * as currency from './currency.js';
import { formatCurrency } from './utils.js';

export function initTravelApp() {
    if (s.addTravelItemBtn) {
        s.addTravelItemBtn.addEventListener('click', () => showTripModal());
    }
    if (s.travelList) {
        s.travelList.addEventListener('click', handleTravelListClick);
    }
}

/**
 * Renders the list of trips.
 * Calculates "Live Purchasing Power" on the fly.
 * Wrapped in try/catch so a currency API failure doesn't break the whole list.
 */
export async function renderTripsList() {
    if (!s.travelList) return;
    s.travelList.innerHTML = '<li>Loading trips...</li>';

    const trips = state.appState.trips;
    
    if (!trips || trips.length === 0) {
        s.travelList.innerHTML = '<li><em>No upcoming trips planned. Add a destination!</em></li>';
        return;
    }

    s.travelList.innerHTML = '';

    // Sort by start date
    trips.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

    for (const trip of trips) {
        try {
            // 1. Fetch Live Rate (may fail if API is down)
            const currentRate = await currency.getExchangeRate(trip.home_currency, trip.target_currency, 'latest');
            
            // 2. Build formatters
            const formatHome = new Intl.NumberFormat('en-US', { style: 'currency', currency: trip.home_currency }).format;
            const formatTarget = new Intl.NumberFormat('en-US', { style: 'currency', currency: trip.target_currency }).format;

            // 3. Calculate purchasing power delta
            let healthHTML = '';
            if (trip.home_currency !== trip.target_currency && currentRate !== null) {
                const initialPower = trip.budget_home_currency * trip.initial_exchange_rate;
                const currentPower = trip.budget_home_currency * currentRate;
                const delta = currentPower - initialPower;
                const isGain = delta >= 0;
                const colorClass = isGain ? 'income-total' : 'expense-total';
                const arrow = isGain ? '▲' : '▼';
                const pct = ((delta / initialPower) * 100).toFixed(1);
                
                healthHTML = `
                    <div class="trip-health">
                        <span class="trip-health-planned">Planned: ${formatTarget(initialPower)}</span><br>
                        <span class="trip-health-live">Live Power: ${formatTarget(currentPower)}</span>
                        <span class="trip-health-delta ${colorClass}">
                            ${arrow} ${formatTarget(Math.abs(delta))} (${isGain ? '+' : ''}${pct}%)
                        </span>
                    </div>
                `;
            } else if (currentRate === null) {
                healthHTML = `<div class="trip-domestic-label">Exchange rate unavailable — check connection.</div>`;
            } else {
                healthHTML = `<div class="trip-domestic-label">Domestic Trip (No Exchange Rate)</div>`;
            }

            const dateRange = `${trip.start_date} to ${trip.end_date}`;
            
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="item-details">
                    <span class="trip-card-name">${trip.name}</span> 
                    <span class="trip-card-dates">(${dateRange})</span>
                    <div class="trip-card-budget">
                        Budget: ${formatHome(trip.budget_home_currency)}
                    </div>
                    ${healthHTML}
                </div>
                <div class="item-controls">
                    <button class="edit-btn" data-id="${trip.id}">Edit</button>
                    <button class="delete-btn" data-id="${trip.id}">X</button>
                </div>
            `;
            s.travelList.appendChild(li);

        } catch (err) {
            // Render the trip card without live rate data rather than failing silently
            console.warn(`Failed to render trip "${trip.name}" with live rates:`, err);
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="item-details">
                    <span class="trip-card-name">${trip.name}</span>
                    <span class="trip-card-dates">(${trip.start_date} to ${trip.end_date})</span>
                    <div class="trip-domestic-label">Could not load live exchange rate.</div>
                </div>
                <div class="item-controls">
                    <button class="edit-btn" data-id="${trip.id}">Edit</button>
                    <button class="delete-btn" data-id="${trip.id}">X</button>
                </div>
            `;
            s.travelList.appendChild(li);
        }
    }
}

async function handleTravelListClick(event) {
    const target = event.target;
    const id = parseInt(target.dataset.id);
    if (!id) return;

    if (target.classList.contains('delete-btn')) {
        await data.deleteTrip(id);
        renderTripsList(); // Direct call — no self-import needed
    } else if (target.classList.contains('edit-btn')) {
        showTripModal(id);
    }
}

/**
 * Shows the modal to Add or Edit a trip.
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
        <div id="rate-preview" class="trip-rate-preview">
            Current Rate: Loading...
        </div>
    `;

    const currencySelect = document.getElementById('trip-target-currency');
    const ratePreview = document.getElementById('rate-preview');
    
    // Set default value
    if (trip && currencies[trip.target_currency]) {
        currencySelect.value = trip.target_currency;
    } else {
        currencySelect.value = currencies['JPY'] ? 'JPY' : Object.keys(currencies)[0];
    }

    // --- Helper to update rate preview ---
    const updateRatePreview = async () => {
        const target = currencySelect.value;
        const rate = await currency.getExchangeRate('USD', target, 'latest');
        ratePreview.textContent = rate !== null 
            ? `Current Rate: 1 USD = ${rate} ${target}`
            : `Current Rate: Unavailable`;
    };
    
    currencySelect.addEventListener('change', updateRatePreview);
    updateRatePreview();

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

        let initialRate = trip ? trip.initial_exchange_rate : null;
        
        if (!initialRate) {
            initialRate = await currency.getExchangeRate('USD', targetCurr, 'latest');
        }

        const tripData = {
            id: tripId,
            name,
            start_date: start,
            end_date: end,
            home_currency: 'USD',
            target_currency: targetCurr,
            budget_home_currency: budget,
            initial_exchange_rate: initialRate
        };

        const success = await data.saveTrip(tripData);
        if (success) {
            ui.closeModal();
            renderTripsList(); // Direct call — no self-import
        }
    });

    ui.openModal();
}