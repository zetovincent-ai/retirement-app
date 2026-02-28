# Jarvis Repository Payload

### File: base.css
```css
/* BASE.CSS
  Contains root variables (colors, themes) and default
  element styles (*, body, h1-h4, button, select, etc.)
*/

/* Define all our colors as variables in the :root (Light/Default Theme) */
:root {
    --background-color: #f4f7f6;
    --section-bg-color: #ffffff;
    --header-bg-color: #097969; 
    --header-text-color: #ffffff;
    --text-color: #334e68;
    --border-color: #dde1e7;
    --primary-btn-bg: #097969; 
    --primary-btn-hover: #0a8f7b;
    --secondary-btn-bg: #95a5a6;
    --secondary-btn-hover: #bdc3c7;
    --delete-btn-bg: #e74c3c;
    --delete-btn-hover: #c0392b;
    --edit-btn-bg: #f39c12;
    --edit-btn-hover: #e67e22;
    --income-total-color: #27ae60;
    --expense-total-color: #e74c3c;
    --net-total-color: #097969; 
    --list-item-bg: #f8f9fa;
    --transition-speed: 0.5s;
}

/* Dark Mode Theme Definition */
body.dark-mode {
    --background-color: #1a202c;
    --section-bg-color: #2d3748;
    --header-bg-color: #171923;
    --header-text-color: #e2e8f0;
    --text-color: #cbd5e0;
    --border-color: #4a5568;
    --primary-btn-bg: #097969; 
    --primary-btn-hover: #0a8f7b;
    --secondary-btn-bg: #4a5568;
    --secondary-btn-hover: #718096;
    --income-total-color: #48bb78;
    --expense-total-color: #f56565;
    --net-total-color: #27ae60;
    --list-item-bg: #4a5568;
}

/* === BASE ELEMENT STYLES === */

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    line-height: 1;
    background-color: var(--background-color);
    color: var(--text-color);
    transition: background-color 0.3s ease, color 0.3s ease;
}

h1 { 
    margin-bottom: 0; 
    font-size: 40px;
}

button {
    padding: 0.5rem 1rem;
    border: none;
    color: white;
    cursor: pointer;
    border-radius: 4px;
}

button:hover { 
    background-color: #777; 
}

select {
    width: 100%;
    padding: 8px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background-color: var(--section-bg-color);
    color: var(--text-color);
}

/* === BUTTON SKIN CLASSES === */

.btn-primary { background-color: var(--primary-btn-bg); }
.btn-primary:hover { background-color: var(--primary-btn-hover); }

.btn-secondary { background-color: var(--secondary-btn-bg); }
.btn-secondary:hover { background-color: var(--secondary-btn-hover); }

.delete-btn { background-color: var(--delete-btn-bg); }
.delete-btn:hover { background-color: var(--delete-btn-hover); }

.edit-btn { background-color: var(--edit-btn-bg); }
.edit-btn:hover { background-color: var(--edit-btn-hover); }

.btn-link {
    background: none;
    border: none;
    color: var(--net-total-color);
    text-decoration: underline;
    cursor: pointer;
    padding: 0;
    font-size: inherit;
    font-weight: bold;
}
.btn-link:hover {
    opacity: 0.8;
}

/* === UTILITY CLASSES === */

.divider { 
    margin-top: 1.5rem; 
    margin-bottom: 1.5rem; 
    border: 0; 
    border-top: 1px solid var(--border-color); 
}

.income-total { color: var(--income-total-color); }
.expense-total { color: var(--expense-total-color); }
.net-total { color: var(--net-total-color); border-top: 1px solid var(--border-color); }
```

### File: components.css
```css
/* COMPONENTS.CSS
  Contains styles for all reusable UI components:
  Modals, item-lists, notifications, context-menu,
  theme-toggle, auth-divider, etc.
*/

/* === Item List === */
.item-list { 
    list-style: none; 
    padding: 0; 
}

.item-list li {
    background-color: var(--list-item-bg);
    border: 1px solid var(--border-color);
    padding: 10px; 
    margin-bottom: 8px; 
    border-radius: 4px; 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
}

.item-controls { 
    display: flex; 
    gap: 8px; 
}

.edit-btn { 
    padding: 4px 8px; 
}

.delete-btn { 
    padding: 4px 8px; 
    font-weight: bold; 
}

.payment-number {
    font-size: 0.8rem;
    color: var(--secondary-btn-bg); /* Use a muted gray color */
    font-weight: normal;
    margin-left: 0.25rem;
}

.transfer-details {
    font-size: 0.85rem;
    color: var(--secondary-btn-bg); /* Use a muted color */
}


/* === Modals === */
.modal { 
    position: fixed; 
    top: 0; 
    left: 0; 
    width: 100%; 
    height: 100%; 
    background-color: rgba(0, 0, 0, 0.5); 
    display: flex; 
    justify-content: center; 
    align-items: center; 
    z-index: 1000; 
    opacity: 1; 
    transition: opacity 0.3s ease; 
}

.modal-hidden { 
    opacity: 0; 
    pointer-events: none; 
}

.modal-content { 
    background-color: var(--section-bg-color); 
    padding: 20px; 
    border-radius: 8px; 
    box-shadow: 0 4px 8px rgba(0,0,0,0.2); 
    width: 90%; 
    max-width: 500px; 
}

.modal-header { 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    border-bottom: 1px solid var(--border-color); 
    padding-bottom: 10px; 
    margin-bottom: 20px; 
}

.modal-footer { 
    display: flex; 
    justify-content: flex-end; 
    gap: 10px; 
    border-top: 1px solid var(--border-color); 
    padding-top: 20px; 
    margin-top: 20px; 
}

.modal--read-only .modal-footer {
    display: none;
}


.form-group {
    display: grid;
    grid-template-columns: 3fr 4fr; /* 1 part for label, 2 parts for input */
    gap: 5px; /* Space between label and input */
    align-items: center; /* Vertically align label and input */
    margin-bottom: 5px;
    font-size: 14px;
}

.form-group label {
    font-weight: bold;
    text-align: left; /* Ensures labels are right-aligned within their column */
}

.form-group-stack {
    display: block; /* Overrides the grid */
    margin-bottom: 5px;
}

.form-group-stack .form-group {
    /* Re-apply grid to the nested form-groups */
    display: grid;
    grid-template-columns: 3fr 4fr;
    gap: 5px;
    align-items: center;
    margin-bottom: 5px;
    font-size: 14px;
}

/* === Auth Modal === */
#user-status {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.9rem;
}

#user-status button { 
    margin-left: 10px; 
}

.auth-divider {
    display: flex;
    align-items: center;
    text-align: center;
    color: var(--text-color);
    margin: 1.5rem 0;
}

.auth-divider::before,
.auth-divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid var(--border-color);
}

.auth-divider:not(:empty)::before {
    margin-right: .5em;
}

.auth-divider:not(:empty)::after {
    margin-left: .5em;
}

#github-login-btn {
    width: 100%;
    background-color: #333; /* GitHub brand color */
}

#github-login-btn:hover {
    background-color: #555;
}


/* === Theme Toggle === */
.theme-toggle-group {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    gap: 150px;
}

.theme-switch-wrapper {
    top: 45px;
    right: 25px;
    display: flex;
    align-items: center;
}

.theme-switch {
    display: inline-block;
    height: 24px;
    position: relative;
    width: 48px;
}

.theme-switch input {
    display:none;
}

.slider {
    background-color: #ccc;
    bottom: 0;
    cursor: pointer;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    transition: .4s;
}

.slider:before {
    background-color: #fff;
    bottom: 4px;
    content: "";
    height: 16px;
    left: 4px;
    position: absolute;
    transition: .4s;
    width: 16px;
}

input:checked + .slider {
    background-color: var(--primary-btn-bg);
}

input:checked + .slider:before {
    transform: translateX(24px);
}

.slider.round {
    border-radius: 24px;
}

.slider.round:before {
    border-radius: 50%;
}


/* === Notifications (Toasts) === */
#notification-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 2000; /* Ensure it's above modals */
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.toast {
    padding: 1rem 1.5rem;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    color: #fff;
    opacity: 0;
    animation: slideIn 0.5s forwards, fadeOut 0.5s 2.5s forwards;
    transform: translateX(100%);
}

.toast--success {
    background-color: var(--income-total-color);
}

.toast--error {
    background-color: var(--expense-total-color);
}

@keyframes slideIn {
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes fadeOut {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
        transform: translateX(100%);
    }
}


/* === Context Menu === */
.context-menu {
    position: fixed;
    z-index: 10000;
    background-color: var(--section-bg-color);
    border: 1px solid var(--border-color);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    border-radius: 6px;
    padding: 0.5rem 0;
}

.context-menu ul {
    list-style: none;
    margin: 0;
    padding: 0;
}

.context-menu li {
    padding: 0.5rem 1.5rem;
    cursor: pointer;
}

.context-menu li:hover {
    background-color: var(--background-color);
}

.context-menu li[data-status="paid"]:hover { color: var(--income-total-color); }
.context-menu li[data-status="overdue"]:hover { color: var(--expense-total-color); }
.context-menu li[data-status="highlighted"]:hover { color: #3498db; }
.context-menu li[data-action="edit-amount"]:hover {
    color: var(--net-total-color);
}
.context-menu li[data-action="revert-amount"]:hover {
    color: var(--edit-btn-bg);
}
.context-menu li.menu-divider {
    border-top: 1px solid var(--border-color);
    margin-top: 0.5rem;
    padding-top: 0.5rem;
}

.form-group-checkbox {
    display: grid;
    grid-template-columns: 1fr 12fr; /* Small column for checkbox, large for label */
    gap: 10px;
    align-items: center;
    margin-bottom: 10px;
}

.form-group-checkbox label {
    font-weight: bold;
    text-align: left;
    margin-bottom: 0; /* Override any default */
}

.form-group-checkbox input {
    width: auto; /* Let checkbox be its natural size */
    justify-self: center; /* Center it in its small column */
}

/* === CARD GRID LAYOUT (Banking & Liabilities) === */

/* 1. Turn the list containers into Grids */
#account-list, 
#cc-list, 
#loan-list {
    display: grid;
    /* Auto-fit columns: at least 300px wide, but stretch to fill space */
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
    gap: 1.5rem;
    padding: 0.5rem; /* Add breathing room around grid */
}

/* 2. Style the Individual Cards */
#account-list li, 
#cc-list li, 
#loan-list li {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%; /* Make all cards in a row the same height */
    background-color: var(--section-bg-color);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); /* Subtle shadow for depth */
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* Hover Effect */
#account-list li:hover, 
#cc-list li:hover, 
#loan-list li:hover {
    transform: translateY(-3px); /* Lift up slightly */
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

/* 3. Color Coded Top Borders (The "Strips") */

/* Banking -> Blue/Green Accent */
#account-list li {
    border-top: 5px solid #3498db; /* Default Blue */
}

/* Credit Cards -> Purple Accent */
#cc-list li {
    border-top: 5px solid #9b59b6;
}

/* Loans -> Red Accent */
#loan-list li {
    border-top: 5px solid #e74c3c;
}

/* 4. Typography Updates inside Cards */

/* Make the Name bigger */
#account-list li .item-details strong,
#cc-list li .item-details strong,
#loan-list li .item-details strong {
    font-size: 1.1rem;
    display: block;
    margin-bottom: 0.5rem;
}

/* Make the Balance stand out heavily */
#account-list li .item-details span[class*="total"],
#account-list li .item-details span:not([class]) { /* Catch-all for balance spans */
    font-size: 1.6rem;
    font-weight: bold;
    display: block;
    margin: 1rem 0;
}

/* Add a line above the buttons */
#account-list li .item-controls,
#cc-list li .item-controls,
#loan-list li .item-controls {
    margin-top: auto; /* Push to bottom */
    padding-top: 1rem;
    border-top: 1px solid var(--border-color);
    justify-content: flex-end; /* Align buttons to right */
    gap: 0.5rem;
}

/* Tweak buttons to be smaller/outline style in cards? Optional. */
#account-list li .item-controls button,
#cc-list li .item-controls button,
#loan-list li .item-controls button {
    font-size: 0.85rem;
    padding: 0.3rem 0.6rem;
}

/* === LEDGER LAYOUT (Income & Expense Tables) === */

/* 1. The Header Row */
.ledger-header {
    display: grid;
    /* Updated Columns:
       1. Name: 1fr (Takes remaining space)
       2. Amount: 160px (Wider to fit long text)
       3. Actions: 230px (Much wider to fit Schedule + Edit + X)
    */
    grid-template-columns: 1fr 220px 230px; 
    gap: 1rem;
    padding: 0.8rem 1rem;
    background-color: var(--secondary-btn-bg); 
    color: #fff; 
    font-weight: bold;
    font-size: 0.9rem;
    border-radius: 8px 8px 0 0; 
    margin-bottom: 0; 
}

/* Align header text */
.ledger-header .col-amount { text-align: right; }
.ledger-header .col-actions { text-align: right; }

/* 2. The List Container */
#income-list, 
#expense-list {
    list-style: none;
    padding: 0;
    margin: 0;
    border: 1px solid var(--border-color);
    border-top: none; 
    border-radius: 0 0 8px 8px; 
}

/* 3. The Data Rows (List Items) */
#income-list li, 
#expense-list li {
    display: grid;
    /* Match the header: Content (1fr) | Actions (230px) */
    grid-template-columns: 1fr 230px; 
    gap: 1rem;
    padding: 0.8rem 1rem;
    border-bottom: 1px solid var(--border-color);
    background-color: var(--section-bg-color);
    align-items: center;
}

/* Zebra Striping */
#income-list li:nth-child(even), 
#expense-list li:nth-child(even) {
    background-color: rgba(0, 0, 0, 0.02);
}

/* 4. Column 1 Wrapper (Name & Amount) */
/* This sub-grid splits the first column into Name (fluid) and Amount (fixed) */
#income-list li .item-details, 
#expense-list li .item-details {
    display: grid;
    grid-template-columns: 1fr 220px; /* Matches Header Amount width */
    gap: 1rem;
    align-items: center;
}

/* Hide the <br> */
#income-list li .item-details br, 
#expense-list li .item-details br { display: none; }

/* Name Column Styling */
#income-list li .item-details strong, 
#expense-list li .item-details strong {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 0.95rem;
    color: var(--text-color);
}

/* Amount Column Styling */
#income-list li .item-details > span:last-child, 
#expense-list li .item-details > span:last-child {
    text-align: right;
    font-family: monospace;
    font-weight: 600;
    font-size: 1rem;
}

/* 5. Actions Column (The buttons) */
#income-list li .item-controls, 
#expense-list li .item-controls {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
}

#income-list li .item-controls button, 
#expense-list li .item-controls button {
    padding: 0.2rem 0.5rem;
    font-size: 0.8rem;
}

/* Styling for the button group in headers */
.header-controls-group {
    display: flex;
    gap: 10px; /* Space between the "Show All" and "Add" buttons */
    align-items: center;
}
```

### File: dashboard.css
```css
/* DASHBOARD.CSS
  Contains all styles related to the dashboard section,
  including the summary, charts, tabs, grid views,
  yearly summary, amortization tables, and layout states.
*/

/* === Dashboard Summary (Collapsed View) === */
.summary-item { 
    margin-bottom: 1rem; 
}

.summary-item h3 { 
    margin-bottom: 0.25rem; 
    font-size: 1rem; 
    font-weight: normal; 
}

.summary-item p { 
    font-size: 1.75rem; 
    font-weight: bold; 
    margin: 0; 
}

#toggle-dashboard-btn {
    background: none;
    border: 1px solid var(--border-color);
    color: var(--text-color);
}
#toggle-dashboard-btn:hover { 
    background-color: var(--background-color); 
}

.chart-container { 
    margin-top: 2rem; 
    position: relative; 
    height: 300px; 
}

/* === Dashboard Tabs & Controls === */
.dashboard-tabs {
    display: flex;
    border-bottom: 2px solid var(--border-color);
    margin-bottom: 1rem;
}

.tab-btn {
    padding: 0.5rem 1rem;
    border: none;
    background-color: transparent;
    color: var(--text-color);
    cursor: pointer;
    border-bottom: 2px solid transparent; /* Placeholder for active indicator */
    margin-bottom: -2px; /* Overlap the container's border */
    font-size: 1rem;
}

.tab-btn.active {
    color: var(--primary-btn-bg); /* Use primary color for active tab */
    border-bottom-color: var(--primary-btn-bg);
    font-weight: bold;
}

.tab-btn:hover:not(.active) {
    background-color: var(--background-color); /* Subtle hover */
}

.dashboard-view-controls {
    margin-bottom: 1rem;
}

.view-group {
    display: flex;
    gap: 0.5rem;
}

.view-btn {
    padding: 0.25rem 0.75rem;
    font-size: 0.9rem;
    border: 1px solid var(--border-color);
    background-color: var(--section-bg-color);
    color: var(--text-color);
    cursor: pointer;
}

.view-btn.active {
    background-color: var(--primary-btn-bg);
    color: var(--header-text-color); /* White text on primary bg */
    border-color: var(--primary-btn-bg);
}

.view-btn:hover:not(.active) {
    background-color: var(--background-color);
}

.dashboard-content-area {
    flex-grow: 1; /* Allow content to fill remaining space */
    overflow-y: auto; /* Make content scrollable if needed */
    padding-top: 1rem;
}

.tab-content {
    display: none; /* Hide content by default */
}

.tab-content.active {
    display: block; /* Show active content */
}

/* Ensure chart inside tab content resizes */
#chart-content .chart-container {
    height: 400px; /* Adjust height as needed for expanded view */
}


/* === Amortization Table === */
.amortization-table-container {
    max-height: 400px; /* Limit height and make it scrollable */
    overflow-y: auto;
    margin-top: 1rem;
    border: 1px solid var(--border-color);
}

.amortization-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
}

.amortization-table th,
.amortization-table td {
    border: 1px solid var(--border-color);
    padding: 6px 8px;
    text-align: right;
}

.amortization-table th {
    background-color: var(--list-item-bg); /* Use list item background for header */
    position: sticky; /* Make header stick during scroll */
    top: 0;
}

.amortization-table tbody tr:nth-child(even) {
    background-color: var(--list-item-bg); /* Zebra striping */
}

.amortization-table tbody tr.edited-payment-row td {
    font-weight: bold;
    color: var(--net-total-color); /* Use a distinct color */
}
.amortization-table tbody tr.edited-payment-row:nth-child(even) {
     /* Ensure background doesn't clash with default zebra stripe */
    background-color: var(--list-item-bg); 
}
body.dark-mode .amortization-table tbody tr.edited-payment-row td {
     color: var(--income-total-color); /* Use a brighter color in dark mode */
}


/* === Monthly Grid View Styles === */
.grid-view-container {
    display: flex;
    flex-direction: row; /* Lay out months side-by-side */
    gap: 1.5rem;
    padding-bottom: 1rem; /* Space for scrollbar */
}

.month-grid-container {
    flex-shrink: 0; /* Prevent containers from shrinking */
    width: 450px; /* Give each month-table a fixed width */
    max-width: 100%;
}

.month-grid-header {
    background-color: var(--header-bg-color);
    color: var(--header-text-color);
    padding: 0.5rem 0.75rem;
    border-radius: 6px 6px 0 0;
    text-align: center;
    font-size: 1.25rem;
    margin: 0;
}

.month-grid-table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid var(--border-color);
    border-top: none; /* Header is the top */
}

.month-grid-table th,
.month-grid-table td {
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--border-color);
    text-align: left;
}

.month-grid-table th {
    background-color: var(--list-item-bg);
}

/* Make second and third columns right-aligned */
.month-grid-table th:nth-child(2),
.month-grid-table td:nth-child(2),
.month-grid-table th:nth-child(3),
.month-grid-table td:nth-child(3) {
    text-align: right;
    width: 25%; /* Give them a set width */
}

.grid-group-header td {
    font-weight: bold;
    font-size: 1.1rem;
    background-color: var(--list-item-bg);
}

/* Group Colors */
.grid-group-income .grid-group-header td {
    color: var(--income-total-color);
    border-left: 4px solid var(--income-total-color);
}
.grid-group-expense .grid-group-header td {
    color: var(--expense-total-color);
    border-left: 4px solid var(--expense-total-color);
}
.grid-group-banking .grid-group-header td {
    color: #3498db; /* Using a standard blue for now */
    border-left: 4px solid #3498db;
}
.grid-group-onetime .grid-group-header td {
    color: var(--secondary-btn-bg); /* Set text color to gray */
    border-left: 4px solid var(--secondary-btn-bg);
}

.month-grid-table tbody tr:not(.grid-group-header):hover {
    background-color: var(--background-color);
}
.grid-group-creditcard .grid-group-header td {
    color: #9b59b6; /* A nice purple */
    border-left: 4px solid #9b59b6;
}


/* === Grid Row Status Styles === */
.month-grid-table tr.row-paid {
    background-color: #27ae6020; /* Faint green */
}
.month-grid-table tr.row-paid:hover {
    background-color: #27ae6040; /* Stronger green on hover */
}
.month-grid-table tr.row-overdue {
    background-color: #e74c3c20; /* Faint red */
}
.month-grid-table tr.row-overdue:hover {
    background-color: #e74c3c40; /* Stronger red on hover */
}
body.dark-mode .month-grid-table tr.row-paid {
    background-color: #48bb7820;
}
body.dark-mode .month-grid-table tr.row-paid:hover {
    background-color: #48bb7840;
}
body.dark-mode .month-grid-table tr.row-overdue {
    background-color: #f5656520;
}
body.dark-mode .month-grid-table tr.row-overdue:hover {
    background-color: #f5656540;
}
.month-grid-table tr.row-highlighted {
    background-color: #3498db20; /* Faint blue */
}
.month-grid-table tr.row-highlighted:hover {
    background-color: #3498db40; /* Stronger blue on hover */
}
body.dark-mode .month-grid-table tr.row-highlighted {
    background-color: #3498db20;
}
body.dark-mode .month-grid-table tr.row-highlighted:hover {
    background-color: #3498db40;
}

/* Style the text color for one-time item rows */
.month-grid-table tr.row-income-text td {
    color: var(--income-total-color);
    font-weight: 500;
}
.month-grid-table tr.row-expense-text td {
    color: var(--expense-total-color);
    font-weight: 500;
}

/* Style for edited amount rows */
.month-grid-table tr.row-edited td:nth-child(3) {
    font-weight: bold;
    font-style: italic;
    color: var(--net-total-color);
}


/* === Grid Header & Total Styles === */
.grid-header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%; 
}
.grid-header-buttons {
    display: flex;
    gap: 0.5rem;
}
.btn-grid-add {
    padding: 0.2rem 0.5rem;
    font-size: 0.8rem;
    background-color: var(--background-color);
    border: 1px solid var(--border-color);
    color: var(--text-color);
    cursor: pointer;
    border-radius: 4px;
    font-weight: 500;
}
.btn-grid-add:hover {
    background-color: var(--list-item-bg);
    border-color: var(--text-color);
}

.grid-total-row td {
    font-weight: bold;
    background-color: var(--list-item-bg);
    border-top: 1px solid var(--border-color);
}
.grid-total-row td[colspan="2"] {
    text-align: right;
    padding-right: 0.75rem;
}
.grid-monthly-net-total-row td {
    font-weight: bold;
    font-size: 1.1rem; 
    color: var(--net-total-color);
    background-color: var(--background-color); 
    border-bottom: 1px dashed var(--border-color); /* Separator between the two totals */
}
.grid-monthly-net-total-row td[colspan="2"] {
    text-align: right;
    padding-right: 0.75rem;
}
.grid-grand-total {
    border-bottom: 1px solid var(--border-color);
}
.grid-overall-net-total-row td {
    font-weight: bold;
    font-size: 1.1rem; 
    color: var(--net-total-color);
    background-color: var(--background-color); 
}
.grid-overall-net-total-row td[colspan="2"] {
    text-align: right;
    padding-right: 0.75rem;
}


/* === Grid Banking Section Styles === */
.grid-group-banking .grid-group-header td {
    border-left: 4px solid #3498db;
    color: #3498db;
}
.grid-group-banking tr:not(.grid-group-header) td {
    font-size: 0.9rem;
    padding: 0.4rem 0.6rem;
    text-align: right; /* Right-align balances by default */
    font-weight: bold; /* Make all banking data rows bold */
}
.grid-group-banking tr:not(.grid-group-header) td:first-child {
    text-align: left; /* Left-align account name */
    font-style: normal; /* Override any inherited italic/light styling */
    color: inherit; /* Ensure color is not greyed out */
}
.grid-banking-divider td {
    font-weight: bold;
    font-size: 0.95rem;
    color: var(--text-color);
    background-color: var(--background-color);
    text-align: left;
    padding-top: 0.8rem;
    border-top: 1px dashed var(--border-color);
}
.grid-banking-transfer-row td {
    font-weight: normal; /* Make them regular weight */
    font-size: 0.9rem;
    color: var(--text-color);
}
.grid-banking-transfer-row td:first-child i {
    color: var(--secondary-btn-bg);
    font-style: italic;
}
.grid-group-banking tr.grid-banking-transfer-row td {
    font-weight: normal;
    font-style: normal;
}

/* === Yearly Summary View Styles === */
.grid-layout-container {
    display: flex;
    height: 100%;
    overflow: hidden;
}

#grid-monthly-content {
    flex-direction: column; 
    overflow: auto;
}

#grid-yearly-content,
#grid-historic-content {
    flex-direction: row; 
    gap: 1rem;
    height: 100%;
}

#grid-yearly-summary-panel,
#grid-historic-year-panel {
    flex-shrink: 0;
    width: 425px;
    height: 100%;
    overflow-y: auto; 
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 1rem;
    background-color: var(--background-color); 
}

#grid-detail-content,
#grid-historic-detail-content {
    flex-grow: 1; 
    height: 100%;
    overflow: auto; 
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 1rem;
}

#grid-yearly-summary-panel h3 {
    margin-bottom: 0.5rem; 
}
#grid-yearly-summary-panel p {
    margin-bottom: 0.5rem; 
}
#grid-yearly-summary-panel .form-group {
    margin-bottom: 0.5rem; 
}

.yearly-summary-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.5rem;
}

.yearly-summary-header h4 {
    margin: 0;
    font-size: 1.2rem;
}

.yearly-summary-header button {
    padding: 0.2rem 0.5rem;
    font-size: 0.8rem;
}

.yearly-summary-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
    font-size: 0.9rem;
}

.yearly-summary-table th,
.yearly-summary-table td {
    border: 1px solid var(--border-color);
    padding: 6px 8px;
    text-align: right;
}

.yearly-summary-table th {
    background-color: var(--list-item-bg);
}

.yearly-summary-table th:first-child,
.yearly-summary-table td:first-child {
    text-align: left;
    width: 20%;
}

.year-summary-row:hover {
    background-color: var(--background-color);
}


/* === Edits Log Styles === */
.edits-log-container {
    margin-top: 1.5rem;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background-color: var(--section-bg-color); 
}

.edits-log-summary {
    padding: 0.75rem 1rem;
    font-weight: bold;
    cursor: pointer;
    background-color: var(--list-item-bg); 
    border-bottom: 1px solid var(--border-color);
}

.edits-log-container[open] .edits-log-summary {
     border-bottom: 1px solid var(--border-color);
}

#edits-log-content {
    padding: 1rem;
    max-height: 300px;
    overflow-y: auto;
}

.edits-log-list {
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: 0.9rem;
}

.edits-log-entry {
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px dashed var(--border-color);
}

.edits-log-entry:last-child {
    border-bottom: none;
    margin-bottom: 0;
}

.edit-item-name {
    font-weight: 500;
}

.edit-log-date {
    font-weight: normal; 
}

.edit-amount {
    font-weight: bold;
    color: var(--net-total-color);
}

/* === Chart Controls Styles === */
.chart-container-wrapper {
    display: block; /* Will be toggled to 'none' */
}

.chart-controls-container {
    display: flex;
    gap: 2rem;
    padding: 1rem;
    background-color: var(--background-color);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    margin-bottom: 1rem;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
}

.chart-controls-container .form-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    margin-bottom: 0;
}

.chart-controls-container .form-group label {
    font-weight: bold;
    text-align: left;
}

.chart-controls-container select {
    width: 300px; /* Give selects a good width */
}

/* Style the multi-select box */
#loan-chart-select[multiple] {
    height: 120px; /* Give it a fixed height */
    overflow-y: auto; /* Allow scrolling */
    background-color: var(--section-bg-color);
    color: var(--text-color);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 0.5rem;
}

#loan-chart-select[multiple] option {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
}

/* Style for selected options in multi-select */
#loan-chart-select[multiple] option:checked {
    background-color: var(--primary-btn-bg);
    color: var(--header-text-color);
}

/* --- Chart Checkbox Controls --- */

.checkbox-container {
    max-height: 120px;
    overflow-y: auto;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 8px;
    background-color: var(--section-bg-color); /* Corrected variable */
}

.checkbox-item {
    display: flex;
    align-items: center;
    margin-bottom: 4px;
}

.checkbox-item label {
    margin-left: 8px;
    user-select: none;
    cursor: pointer;
}

.checkbox-item input {
    cursor: pointer;
}

/* Ensure the inner expanded content displays correctly */
#expanded-dashboard-content {
    display: none; /* Controlled by JS toggling style.display */
    flex-direction: column; 
    height: 100%;
}

/* === Chart Details List === */

#expanded-expense-details {
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background-color: var(--background-color);
    padding: 1rem;
    max-height: 400px; /* Same as pie chart height */
    overflow-y: auto;
    display: none; /* Will be toggled by JS */
}

#expense-details-back-btn {
    padding: 0.25rem 0.75rem;
    font-size: 0.9rem;
    margin-bottom: 1rem;
}

#expense-details-list {
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: 0.9rem;
}

.expense-details-entry {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px dashed var(--border-color);
}

.expense-details-entry:last-child {
    border-bottom: none;
}

.expense-details-name {
    font-weight: 500;
}

.expense-details-date {
    color: var(--secondary-btn-bg);
}

.expense-details-amount {
    font-weight: bold;
    color: var(--net-total-color);
}

/* === Reconciliation Log View === */

#reconciliation-view-content {
    padding: 1rem;
    max-width: 800px;
    margin: 0 auto; /* Center the list container */
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background-color: var(--background-color);
}

#reconciliation-view-content h3 {
    margin-bottom: 0.5rem;
}
#reconciliation-view-content p {
    margin-bottom: 1.5rem;
}

.reconciliation-log-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.reconciliation-log-entry {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0.5rem;
    border-bottom: 1px solid var(--border-color);
    font-size: 0.9rem;
}

.reconciliation-log-entry:last-child {
    border-bottom: none;
}

.recon-account-name {
    font-weight: bold;
    font-size: 1.1rem;
}

.recon-date {
    font-size: 0.85rem;
    color: var(--secondary-btn-bg);
}

.recon-details {
    text-align: right;
}

.recon-amount {
    font-weight: bold;
    font-size: 1.1rem;
}

.recon-balance {
    font-size: 0.85rem;
    color: var(--text-color);
    display: block; /* Puts it on its own line */
}

.recon-positive {
    color: var(--income-total-color);
}

.recon-negative {
    color: var(--expense-total-color);
}

/* === Collapsible Grid Sections === */

/* The arrow icon style */
.grid-section-toggle {
    cursor: pointer;
    margin-right: 8px;
    display: inline-block;
    transition: transform 0.2s ease;
    user-select: none;
    font-size: 0.85rem;
    color: var(--text-color);
}

/* Hover state for the arrow */
.grid-section-toggle:hover {
    color: var(--primary-btn-bg);
    transform: scale(1.2);
}

/* When the tbody has the 'collapsed' class: */

/* 1. Rotate the arrow to point right */
tbody.collapsed .grid-section-toggle {
    transform: rotate(-90deg);
}

/* 2. Hide all rows EXCEPT the header row */
tbody.collapsed tr:not(.grid-group-header) {
    display: none;
}

/* === Dashboard Accordion / Groups === */

.dashboard-group {
    margin-bottom: 0.5rem;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 0.5rem;
}

.dashboard-group:last-child {
    border-bottom: none;
}

.dashboard-group-header {
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    color: var(--text-color);
    display: flex;
    align-items: center;
    padding: 0.5rem 0;
    user-select: none;
    transition: color 0.2s;
}

.dashboard-group-header:hover {
    color: var(--primary-btn-bg);
}

.dashboard-group-header .toggle-icon {
    margin-right: 8px;
    font-size: 0.8rem;
    width: 15px; /* Fixed width to prevent text jumping */
    display: inline-block;
    text-align: center;
}

.dashboard-group-content {
    /* Will be toggled via JS */
    padding-left: 0.5rem;
    animation: fadeIn 0.3s ease;
}

/* === Bank Balance Summary Widget === */
#dashboard-bank-summary {
    background-color: var(--background-color);
    padding: 0.75rem;
    border-radius: 6px;
    margin-bottom: 0.5rem;
}

.bank-summary-row {
    margin-bottom: 0.75rem;
}

.bank-summary-row:last-child {
    margin-bottom: 0;
}

.bank-summary-label {
    display: block;
    font-size: 0.85rem;
    color: var(--secondary-btn-bg); /* Muted label */
    margin-bottom: 0.2rem;
}

.bank-summary-value {
    display: block;
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--text-color);
}

.bank-summary-value.forecast {
    color: var(--net-total-color); /* Highlight the forecast */
}

.bank-summary-subtext {
    display: block;
    font-size: 0.75rem;
    color: var(--text-color);
    opacity: 0.7;
    margin-top: 2px;
}

/* === Bank Summary Sub-Headers === */
.bank-summary-section-header {
    margin: 0.8rem 0 0.5rem 0;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--secondary-btn-bg);
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 4px;
}

.bank-summary-section-header:first-child {
    margin-top: 0;
}

/* === Grid Pagination Controls === */
.grid-pagination-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    padding: 0.5rem;
    background-color: var(--section-bg-color);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    width: fit-content;
}

.grid-page-label {
    font-weight: bold;
    color: var(--text-color);
    font-size: 0.9rem;
}

/* Ensure the grid container handles the scrolling, not the parent */
.scrollable-grid-region {
    width: 100%;
    overflow-x: auto; /* Allow horizontal scroll */
    padding-bottom: 1rem;
    /* Optional: Hide scrollbar visually if you purely want buttons */
    /* scrollbar-width: none; */ 
}
```

### File: layout.css
```css
/* LAYOUT.CSS
  Contains styles for the main page structure:
  header, main, footer, and .app-section layout.
*/

header {
    background-color: var(--header-bg-color);
    color: var(--header-text-color);
    padding: 1rem;
    position: relative;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: auto; 
    margin: 0 auto;
    padding: 0 1rem; 
}

.header-title-group {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.header-logo {
    height: 100px; /* Adjust size as needed */
}

.header-controls {
    display: flex;
    flex-direction: column; 
    align-items: flex-start; 
    gap: 5px;
}

footer {
    background-color: var(--header-bg-color);
    color: var(--header-text-color);
    padding: 1rem;
    font-size: 20px;
}

.footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: auto;
    margin: 0;
    flex-wrap: wrap;
}

.copyright-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.footer-logo {
    height: 50px; /* Adjust size as needed */
}

.footer-content .contact-link {
    color: var(--header-text-color);
    text-decoration: none;
    transition: opacity 0.3s ease;
}

.footer-content .contact-link:hover {
    opacity: 0.8;
}

@media (max-width: 600px) {
    .footer-content {
        flex-direction: column;
        gap: 0.5rem;
    }
}

main {
    display: flex;
    padding: 1rem;
    gap: 1rem;
    overflow: hidden;
}

.app-section {
    background-color: var(--section-bg-color);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 1rem;
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 0;
    min-width: 0;
    transition: all var(--transition-speed) ease;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.section-header h2 {
    writing-mode: horizontal-tb;
    transform: none;
    margin: 0 0 1rem 0;
    white-space: nowrap;
    opacity: 1;
}

.section-controls { 
    margin-bottom: 1rem; 
}

.app-nav-bar {
    background-color: #fff;
    border-bottom: 1px solid var(--border-color);
    padding: 0 1rem;
    display: flex;
    gap: 1rem;
}

.app-nav-btn {
    background: none;
    border: none;
    padding: 1rem 0.5rem;
    font-size: 1rem;
    color: var(--text-color);
    cursor: pointer;
    border-bottom: 3px solid transparent;
    opacity: 0.7;
    transition: all 0.3s ease;
    border-radius: 0; /* Remove default button radius */
}

.app-nav-btn:hover {
    background: none;
    opacity: 1;
}

.app-nav-btn.active {
    opacity: 1;
    font-weight: bold;
    /* The border color will inherit the current "app color" via JS if we want, 
       or we can stick to a neutral color. Let's use the primary color for now. */
    border-bottom-color: var(--header-bg-color); 
}

/*  App Containers */
.app-container {
    display: none;
    width: 100%;
    /* Flex column to handle stacking sections just like before */
    flex-direction: column;
    gap: 1rem;
}

.app-container.active {
    display: flex;
    
    /* ⭐️ HORIZONTAL LAYOUT (Side-by-Side) ⭐️ */
    flex-direction: row; 
    
    /* Ensure it fills the screen so sections can grow */
    width: 100%;
    flex-grow: 1;
    
    gap: 1rem;
    overflow: hidden; /* Prevents double scrollbars */
}

/* Navy Blue Theme Override  */
body.theme-travel {
    --header-bg-color: #00003d; /* Classic Navy Blue */
    --primary-btn-bg: #00003d;
    --primary-btn-hover: #68688b;
    --net-total-color: #00003d; /* Reuse navy for highlights */
}
/* === NEW LAYOUT: Sidebar + Main Content === */

/* 1. The Container */
.app-container.active {
    display: flex;
    flex-direction: row; /* Horizontal layout */
    align-items: flex-start; /* Align top */
    gap: 1.5rem;
    height: calc(100vh - 140px); /* Fill screen minus header/footer */
}

/* 2. The Sidebar (Dashboard) */
.app-sidebar {
    width: 380px; /* Fixed width */
    flex-shrink: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
}

#dashboard-section {
    height: 100%;
    overflow-y: auto; /* Scrollable sidebar */
}

/* 3. The Main Content Area (Tabs) */
.app-main-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-width: 0; /* Prevents flex overflow issues */
}

/* 4. Tab Navigation Bar */
.section-tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0; /* Tabs sit directly on top of content */
}

.section-tab-btn {
    padding: 0.75rem 1.5rem;
    background-color: #e0e6ed; /* Inactive tab color */
    border: 1px solid var(--border-color);
    border-bottom: none;
    border-radius: 8px 8px 0 0;
    color: var(--text-color);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    opacity: 0.8;
}

.section-tab-btn:hover {
    background-color: #d1d9e2;
    opacity: 1;
}

.section-tab-btn.active {
    background-color: var(--section-bg-color); /* Active tab matches content bg */
    border-color: var(--border-color);
    border-bottom: 1px solid var(--section-bg-color); /* Hide bottom border to merge */
    color: var(--primary-btn-bg);
    font-weight: bold;
    opacity: 1;
    margin-bottom: -1px; /* Overlap the panel border */
    z-index: 2;
}

/* 5. Tab Panels */
.tab-panel {
    display: none; /* Hidden by default */
    border-top-left-radius: 0; /* Remove top-left corner radius for tab merge */
    height: 100%;
    overflow-y: auto; /* Scrollable content */
}

.tab-panel.active {
    display: block; /* Show active */
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Dark Mode Tweaks for Tabs */
body.dark-mode .section-tab-btn {
    background-color: #2d3748;
    border-color: #4a5568;
}
body.dark-mode .section-tab-btn.active {
    background-color: var(--section-bg-color); /* Matches panel */
    border-bottom-color: var(--section-bg-color);
}

/* === DASHBOARD EXPANSION LOGIC === */

/* 1. Hide the Main Content (Tabs) when expanded */
main.dashboard-expanded #financial-app .app-main-content,
#financial-app.dashboard-expanded .app-main-content {
    display: none !important;
}

/* 2. Hide All Sidebar Groups (Liquid Cash & Overview) when expanded */
main.dashboard-expanded #financial-app .dashboard-group,
#financial-app.dashboard-expanded .dashboard-group {
    display: none !important;
}

/* 3. Force the Sidebar to take 100% width */
main.dashboard-expanded #financial-app .app-sidebar,
#financial-app.dashboard-expanded .app-sidebar {
    width: 100% !important;
    max-width: none !important;
    flex: 1 0 100% !important; /* Force grow to fill flex container */
    border-right: none !important;
}

/* 4. Ensure the inner content fills the height */
main.dashboard-expanded #financial-app #expanded-dashboard-content,
#financial-app.dashboard-expanded #expanded-dashboard-content {
    display: flex !important; /* Force it to show */
    flex-direction: column;
    height: 100%;
}
```

### File: travel.css
```css
/* TRAVEL.CSS
   Styles for the Trip Planner module.
   Extracted from inline styles in travel.js for proper theming & dark mode support.
*/

/* === Trip Card Layout === */
.trip-card-name {
    font-size: 1.1rem;
    font-weight: bold;
}

.trip-card-dates {
    font-size: 0.9rem;
    color: var(--secondary-btn-bg);
}

.trip-card-budget {
    margin-top: 5px;
    font-weight: bold;
}

/* === Exchange Rate Health Indicator === */
.trip-health {
    font-size: 0.85rem;
    margin-top: 4px;
}

.trip-health-planned {
    color: var(--secondary-btn-bg);
}

.trip-health-live {
    font-weight: bold;
}

.trip-health-delta {
    font-weight: bold;
    margin-left: 5px;
}

.trip-domestic-label {
    font-size: 0.85rem;
    color: var(--text-color);
}

/* === Rate Preview in Modal === */
.trip-rate-preview {
    font-size: 0.9rem;
    text-align: right;
    color: var(--secondary-btn-bg);
    margin-top: 5px;
}

/* === Account Details (inline style cleanup from ui.js) === */
.account-detail-info {
    font-size: 0.85rem;
    color: var(--secondary-btn-bg);
}

.linked-loan-badge {
    font-size: 0.8rem;
    background: var(--background-color);
    padding: 2px 6px;
    border-radius: 4px;
    margin-left: 5px;
}

```

### File: app.js
```javascript
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
import * as travel from './travel.js';

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
        if (listId === 'income-list') ui.showIncomeModal(id);
        else if (listId === 'expense-list') ui.showExpenseModal(id);
    }
    else if (target.classList.contains('delete-btn')) {
        if (confirm("Are you sure you want to delete this item?")) {
             const tableName = listId === 'income-list' ? 'incomes' : 'expenses';
             const { error } = await supabaseClient.from(tableName).delete().eq('id', id);
             if (error) { 
                 console.error(`Error deleting from ${tableName}:`, error); 
                 ui.showNotification(`Error deleting item: ${error.message}`, 'error');
             }
             else { 
                 await data.fetchData(); 
             }
        }
    }
    else if (target.classList.contains('schedule-btn')) {
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
        if (type === 'account') {
            // ⭐️ CHANGE: Determine allowed types based on the Section ID
            const sectionId = event.currentTarget.id;
            let allowedTypes = null;
            
            if (sectionId === 'banking-section') {
                allowedTypes = ['checking', 'savings', 'investment'];
            } else if (sectionId === 'liabilities-section') {
                allowedTypes = ['credit_card', 'loan'];
            }
            
            ui.showAccountModal(id, allowedTypes);
        }
        else if (type === 'transfer') ui.showTransferModal(id);

    } else if (target.classList.contains('delete-btn')) {
        const tableName = type === 'account' ? 'accounts' : 'transfers';
        if (confirm(`Are you sure you want to delete this ${type}?`)) {
             const { error } = await supabaseClient.from(tableName).delete().eq('id', id);
             if (error) { 
                 console.error(`Error deleting from ${tableName}:`, error); 
                 ui.showNotification(`Error: ${error.message}`, 'error');
             }
             else { 
                 await data.fetchData(); 
             }
        }
    } else if (target.classList.contains('reconcile-btn')) {
        if (type === 'account') {
            ui.showReconcileModal(id);
        }
    }
}

function handleGridContentClick(event) {
    const target = event.target;

    // === ⭐️ NEW: Handle Scroll Buttons (Updated for multiple grids) ===
    if (target.dataset.action === 'scroll-left' || target.dataset.action === 'scroll-right') {
        // Find the controls wrapper
        const controls = target.closest('.grid-pagination-controls');
        // The grid container is the immediate next sibling in the DOM
        const container = controls ? controls.nextElementSibling : null;

        if (container) {
            // Scroll width = (450px card width + 24px gap) * 3 months ≈ 1422px
            const scrollAmount = target.dataset.action === 'scroll-left' ? -1425 : 1425;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
        return; 
    }

    // === ⭐️ NEW: Handle Section Toggle (Arrow Click) ===
    if (target.classList.contains('grid-section-toggle')) {
        const tbody = target.closest('tbody');
        if (tbody) {
            tbody.classList.toggle('collapsed');
        }
        return; // Stop processing this click
    }

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

        const startDate = new Date(Date.UTC(clickedYear, 0, 1));
        s.gridDetailContent.innerHTML = grid.renderGridView(12, startDate, startingNetTotal, yearStartAccountBalances);

        state.setLastOpenYear(clickedYear);
        return;
    }

    // 4. Handle click on a "Historic Year" button (btn-link)
    const historicYearButton = target.closest('.btn-link[data-historic-year]');
    if (historicYearButton) {
        // === ⭐️ FIX WAS HERE ⭐️ ===
        // It's .dataset.historicYear, not .dataset.year
        const clickedYear = parseInt(historicYearButton.dataset.historicYear, 10);
        // === END FIX ===

        if (isNaN(clickedYear)) {
             console.error(`Invalid historic year clicked: ${historicYearButton.dataset.historicYear}`);
             return;
        }

        // Render a 12-month grid starting Jan 1st of that year
        const startDate = new Date(Date.UTC(clickedYear, 0, 1));
        
        // We pass 0 and null for starting balances, as it's a historic review
        s.gridHistoricDetailContent.innerHTML = grid.renderGridView(12, startDate, 0, null);
        return;
    }

    // 5. Handle "Add Item" click (from monthly grid)
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

async function setActiveChartView(viewId) {
    if (viewId !== 'expensePie') { 
        state.setExpenseChartDrillDown(false); 
        state.setExpenseChartDetailCategory(null);
    }

    state.setActiveChartView(viewId);
    s.chartViewButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === viewId);
    });

    // === ⭐️ MODIFIED: Now handles 3 views ===
    // Show/hide the correct chart container
    if (viewId === 'expensePie') {
        s.expensePieChartContainer.style.display = 'block';
        s.loanChartContent.style.display = 'none';
        s.reconciliationViewContent.style.display = 'none'; // ⭐️ ADDED
    } else if (viewId === 'loanChart') {
        s.expensePieChartContainer.style.display = 'none';
        s.loanChartContent.style.display = 'block';
        s.reconciliationViewContent.style.display = 'none'; // ⭐️ ADDED
    } else if (viewId === 'reconciliationView') { // ⭐️ ADDED BLOCK
        s.expensePieChartContainer.style.display = 'none';
        s.loanChartContent.style.display = 'none';
        s.reconciliationViewContent.style.display = 'block';
    }

    // Call the main render function
    grid.renderActiveDashboardContent();
}
/**
 * Handles the logic for toggling a list view between 'current' and 'all'.
 * @param {HTMLElement} target - The button element that was clicked.
 * @param {'income' | 'expense' | 'transfer'} type - The type of list.
 * @param {Function} renderFn - The function to call to re-render the list.
 */
function toggleListAndRender(target, type, renderFn) {
    const currentMode = state.listDisplayMode[type];
    const newMode = (currentMode === 'current') ? 'all' : 'current';
    
    const newDisplayMode = { ...state.listDisplayMode, [type]: newMode };
    state.setListDisplayMode(newDisplayMode);
    
    target.textContent = (newMode === 'all') ? 'Show Current' : 'Show All';
    renderFn();
}

function handleIncomeListViewToggle(event) {
    if (event.target.id === 'toggle-income-list-view') {
        toggleListAndRender(event.target, 'income', grid.renderIncomes);
    }
}

function handleExpenseListViewToggle(event) {
    if (event.target.id === 'toggle-expense-list-view') {
        toggleListAndRender(event.target, 'expense', grid.renderExpenses);
    }
}

function handleTransferListViewToggle(event) {
    if (event.target.id === 'toggle-transfer-list-view') {
        toggleListAndRender(event.target, 'transfer', ui.renderTransfersList);
    }
}

function handleAppSwitch(event) {
    const targetBtn = event.target.closest('.app-nav-btn');
    if (!targetBtn) return;

    const targetAppId = targetBtn.dataset.target;
    
    // 1. Update Tabs UI
    document.querySelectorAll('.app-nav-btn').forEach(btn => btn.classList.remove('active'));
    targetBtn.classList.add('active');

    // 2. Show/Hide App Containers
    document.querySelectorAll('.app-container').forEach(container => {
        if (container.id === targetAppId) {
            container.classList.add('active');
        } else {
            container.classList.remove('active');
        }
    });

    // 3. Handle Theme Switching (Navy Blue vs Green)
    if (targetAppId === 'travel-app') {
        document.body.classList.add('theme-travel');
        travel.renderTripsList();
    } else {
        document.body.classList.remove('theme-travel');
    }
}

// === INITIALIZATION ===

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Initial UI Setup ---
    ui.loadMode();
    ui.initializeFooter();
    ui.setupDashboardAccordion();
    
    // --- Auth Listeners ---
    auth.initializeAuthListener(); // Sets up the onAuthStateChange
    auth.addAuthEventListeners();  // Sets up modal/button clicks

    // --- Init Travel App ---
    travel.initTravelApp();

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
    s.showAccountModalBtn.addEventListener('click', () => {
        ui.showAccountModal(undefined, ['checking', 'savings', 'investment']);
    });
    s.showTransferModalBtn.addEventListener('click', () => ui.showTransferModal());

    if (s.showCcModalBtn) {
        s.showCcModalBtn.addEventListener('click', () => {
            ui.showAccountModal(undefined, ['credit_card', 'loan']);
        });
    }

    // List Edit/Delete
    s.incomeList.addEventListener('click', handleListClick);
    s.expenseList.addEventListener('click', handleListClick);
    s.bankingSection.addEventListener('click', handleBankingListClick);
    if (s.liabilitiesSection) {
        s.liabilitiesSection.addEventListener('click', handleBankingListClick);
    }

    // listen on the parent section to catch the button click
    s.incomeList.closest('.app-section').addEventListener('click', handleIncomeListViewToggle);
    s.expenseList.closest('.app-section').addEventListener('click', handleExpenseListViewToggle);
    s.bankingSection.addEventListener('click', handleTransferListViewToggle);

    // Dashboard
    s.toggleDashboardBtn.addEventListener('click', () => {
        const isExpanding = !s.mainContainer.classList.contains('dashboard-expanded');
        s.mainContainer.classList.toggle('dashboard-expanded');

        if (isExpanding) {
            s.dashboardSummary.style.display = 'none';
            s.summaryChartContainer.style.display = 'none';
            s.expandedDashboardContent.style.display = 'flex';
            grid.setActiveDashboardTab(state.activeDashboardTab);
            s.toggleDashboardBtn.textContent = 'Close Dashboard';

        } else {
            s.dashboardSummary.style.display = 'block';
            s.summaryChartContainer.style.display = 'none';
            s.expandedDashboardContent.style.display = 'none';
            s.tabContents.forEach(content => content.classList.remove('active')); 
            s.toggleDashboardBtn.textContent = 'Grids & Charts';
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

    // === Section Tab Switching ===
    s.sectionTabs.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;

            // 1. Update Buttons
            s.sectionTabs.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 2. Update Panels
            s.tabPanels.forEach(panel => {
                if (panel.id === targetId) {
                    panel.classList.add('active');
                } else {
                    panel.classList.remove('active');
                }
            });
        });
    });

    // Grid
    s.gridContentArea.addEventListener('click', handleGridContentClick);
    s.gridContentArea.addEventListener('contextmenu', handleGridContextMenu);
    s.gridContextMenu.addEventListener('click', handleContextMenuClick);
    
    // Global
    document.addEventListener('click', handleDocumentClick);

    // App Nav Listener 
    const appNavBar = document.querySelector('.app-nav-bar');
    if (appNavBar) {
        appNavBar.addEventListener('click', handleAppSwitch);
    }
});
```

### File: auth.js
```javascript
// === AUTH FUNCTIONS ===
// This module handles all Supabase authentication logic
// and updating the user status UI.

import { supabaseClient } from './supabase.js';
import * as s from './selectors.js';
import { showNotification, openAuthModal, closeAuthModal } from './ui.js';
import { fetchData } from './data.js';

// --- Auth Functions ---

async function handleGitHubLogin() {
    const { error } = await supabaseClient.auth.signInWithOAuth({ provider: 'github' });
    if (error) {
        console.error('Error logging in with GitHub:', error);
        showNotification(`GitHub Error: ${error.message}`, 'error');
    }
}

async function handleEmailAuth(event) {
    event.preventDefault();
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;

    // Try to sign in first
    const { error: signInError } = await supabaseClient.auth.signInWithPassword({ email, password });

    if (signInError) {
        // If sign-in fails, try to sign up
        const { data: signUpData, error: signUpError } = await supabaseClient.auth.signUp({ email, password });
        
        if (signUpError) {
            showNotification(`Error: ${signUpError.message}`, 'error');
        } else if (signUpData.user && signUpData.user.identities && signUpData.user.identities.length === 0) {
            showNotification("Sign-up successful! Please check your email to confirm your account.", "success");
            closeAuthModal();
        } else {
            showNotification("Login successful!", "success");
            closeAuthModal();
        }
    } else {
        // Sign-in was successful
        showNotification("Login successful!", "success");
        closeAuthModal();
    }
}

async function handleLogout() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
        console.error('Error logging out:', error);
        showNotification(`Logout Error: ${error.message}`, 'error');
    }
    // Auth state change listener will handle the rest
}

export function updateUserStatus(user) {
    if (user) {
        s.userStatus.innerHTML = `
            <span>LOGGED IN: ${user.email}</span>
            <button id="logout-btn" class="btn-secondary">Logout</button>
        `;
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
             logoutBtn.removeEventListener('click', handleLogout);
             logoutBtn.addEventListener('click', handleLogout);
        }
    } else {
        s.userStatus.innerHTML = `<button id="login-btn" class="btn-primary">Login / Sign Up</button>`;
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
             loginBtn.removeEventListener('click', openAuthModal);
             loginBtn.addEventListener('click', openAuthModal);
        }
    }
}

// --- Auth State Change Listener ---

export function initializeAuthListener() {
    supabaseClient.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event);
        updateUserStatus(session?.user);
        if (session) {
            fetchData();
        } else {
            // User logged out — clear ALL state keys (FIX: was missing reconciliation_log & trips)
            const { setAppState } = await import('./state.js');
            const { renderAll } = await import('./grid.js');
            setAppState({ 
                incomes: [], expenses: [], transactions: [], accounts: [], 
                transfers: [], reconciliation_log: [], trips: [] 
            });
            renderAll();
        }
    });
}

// --- Event Listeners ---

export function addAuthEventListeners() {
    s.authModalCloseBtn.addEventListener('click', closeAuthModal);
    s.authModal.addEventListener('click', (event) => { 
        if (event.target === s.authModal) closeAuthModal(); 
    });
    s.emailAuthForm.addEventListener('submit', handleEmailAuth);
    s.githubLoginBtn.addEventListener('click', handleGitHubLogin);
}

```

### File: calculations.js
```javascript
// === CALCULATION FUNCTIONS ===
// A module for all pure data-manipulation and calculation functions.
// These functions do not depend on DOM elements or other modules.

/**
 * Parses a 'YYYY-MM-DD' date string as UTC to avoid timezone issues.
 * @param {string} dateString - The date string to parse.
 * @returns {Date} A Date object set to midnight UTC for that date.
 */
export function parseUTCDate(dateString) {
    if (!dateString) return null;
    // T00:00:00Z specifies UTC (Zulu) time.
    const date = new Date(dateString + 'T00:00:00Z');
    if (isNaN(date.getTime())) {
         console.warn(`Invalid date string provided: ${dateString}`);
         return null;
    }
    return date;
}

/**
 * Calculates a total annual value for a list of items.
 * @param {Array} items - An array of income or expense items.
 * A filter function to apply to the list before summing.
 * @param {Function} [filterFn=null]
 * @returns {number} The total annual amount.
 */
export function calculateAnnualTotal(items, filterFn = null) {
    if (!items) return 0;

    const itemsToSum = filterFn ? items.filter(filterFn) : items;

    return itemsToSum.reduce((total, item) => {
        if (!item || typeof item.amount !== 'number' || item.amount < 0) return total;
        
        switch (item.interval) {
            case 'monthly':
                return total + (item.amount * 12);
            case 'annually':
                return total + item.amount;
            case 'bi-annual':
                return total + (item.amount * 2);
            case 'quarterly':
                return total + (item.amount * 4);
            case 'bi-weekly':
                return total + (item.amount * 26);
            case 'weekly':
                return total + (item.amount * 52);
            case 'one-time':
                return total + item.amount; // Include one-time amounts
            default:
                return total;
        }
    }, 0);
}

export function calculateMonthlyTotal(items){
    if(!items)return 0;
    return items.reduce((total,item)=>{
        if(!item||typeof item.amount!=='number'||item.amount<0)return total;
        switch(item.interval){
            case'monthly':return total+item.amount;
            case'annually':return total+(item.amount/12);
            case'bi-annual':return total+(item.amount/6); // 2 payments / 12 months
            case'quarterly':return total+(item.amount/3);
            case'bi-weekly':return total+((item.amount*26)/12);
            case'weekly':return total+((item.amount*52)/12);
            default:return total
        }
    },0)
}

/**
 * Calculates the monthly payment and amortization schedule for a loan.
 * @param {number} principal - The initial loan amount.
 * @param {number} annualRate - The annual interest rate (e.g., 0.065 for 6.5%).
 * @param {number} termMonths - The loan term in months (e.g., 360 for 30 years).
 * @returns {object | null} An object containing the monthly payment and the schedule array, or null if inputs are invalid.
 */
export function calculateAmortization(principal, annualRate, termMonths) {
    if (principal <= 0 || annualRate < 0 || termMonths <= 0) {
        console.error("Invalid input for amortization calculation.");
        return null;
    }

    const monthlyRate = annualRate / 12;
    let monthlyPayment;

    // Calculate monthly payment using the standard formula
    // Handle edge case of 0% interest
    if (monthlyRate === 0) {
        monthlyPayment = principal / termMonths;
    } else {
        monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
    }

    let remainingBalance = principal;
    const schedule = [];

    for (let month = 1; month <= termMonths; month++) {
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        remainingBalance -= principalPayment;

        // Ensure remaining balance doesn't go negative due to rounding at the end
        if (month === termMonths && Math.abs(remainingBalance) < 0.01) {
            remainingBalance = 0;
        }
         // Handle potential minor overpayment on the last month due to rounding
         const actualPayment = (month === termMonths && remainingBalance < 0) ? monthlyPayment + remainingBalance : monthlyPayment;


        schedule.push({
            month: month,
            payment: actualPayment, // Use potentially adjusted last payment
            principalPayment: principalPayment + (month === termMonths && remainingBalance < 0 ? remainingBalance : 0), // Adjust last principal payment
            interestPayment: interestPayment,
            remainingBalance: remainingBalance > 0 ? remainingBalance : 0 // Don't show negative balance
        });

        if (remainingBalance <= 0) break; // Exit loop if balance is paid off early (unlikely with fixed payments but good practice)
    }

    return {
        monthlyPayment: monthlyPayment,
        schedule: schedule
    };
}

/**
 * Generates an array of Date objects for the first of each month to render.
 * @param {Date} startDate - The date to start from (e.g., new Date()).
 * @param {number} numMonths - The number of months to generate.
 * @returns {Date[]} An array of Date objects, each set to the 1st of the month.
 */
export function getMonthsToRender(startDate, numMonths) {
    const months = [];
    // Get the year and month of the starting date
    const startYear = startDate.getUTCFullYear();
    const startMonth = startDate.getUTCMonth();

    for (let i = 0; i < numMonths; i++) {
        // Create a new date set to the 1st of the month
        // We use UTC methods to remain consistent
        const monthDate = new Date(Date.UTC(startYear, startMonth + i, 1));
        months.push(monthDate);
    }
    return months;
}

/**
 * Calculates all occurrences of a recurring item within a given month.
 * @param {object} item - The income or expense item (must have start_date and interval).
 * @param {Date} monthDate - A Date object representing the *start* of the target month (e.g., Oct 1, 2025).
 * @returns {Date[]} An array of Date objects for each occurrence in that month.
 */
export function getOccurrencesInMonth(item, monthDate) {
    const occurrences = [];
    const itemStartDate = parseUTCDate(item.start_date);
    
    // ⭐️ NEW: Parse the end date if it exists ⭐️
    const itemEndDate = item.end_date ? parseUTCDate(item.end_date) : null;

    if (!itemStartDate) return []; 

    // ... (Payoff date logic remains the same) ...
    let payoffDate = null;
    if (item.advanced_data && (item.advanced_data.item_type === 'Mortgage/Loan' || item.advanced_data.item_type === 'Car Loan')) {
        // ... (existing loan logic) ...
        const totalPayments = item.advanced_data.total_payments;
        if (totalPayments && totalPayments > 0) {
            payoffDate = new Date(itemStartDate.getTime());
            payoffDate.setUTCMonth(itemStartDate.getUTCMonth() + totalPayments);
        }
    }

    // ... (Month boundary logic remains the same) ...
    const targetYear = monthDate.getUTCFullYear();
    const targetMonth = monthDate.getUTCMonth();
    const monthStart = new Date(Date.UTC(targetYear, targetMonth, 1));
    const monthEnd = new Date(Date.UTC(targetYear, targetMonth + 1, 0, 23, 59, 59, 999));
    
    if (item.interval !== 'one-time' && itemStartDate > monthEnd) return [];
    if (payoffDate && payoffDate <= monthStart) return [];
    
    // ⭐️ NEW: Optimization - If item ended before this month, skip it ⭐️
    if (itemEndDate && itemEndDate < monthStart) return [];

    const itemStartDayOfMonth = itemStartDate.getUTCDate();

    // Helper to check if a specific date is valid given payoff and end dates
    const isValidDate = (date) => {
        if (payoffDate && date >= payoffDate) return false;
        // ⭐️ NEW: Check against End Date ⭐️
        if (itemEndDate && date > itemEndDate) return false;
        return true;
    };

    switch (item.interval) {
        case 'one-time':
            if (itemStartDate >= monthStart && itemStartDate <= monthEnd) {
                if (isValidDate(itemStartDate)) occurrences.push(itemStartDate);
            }
            break;

        case 'monthly':
            if (itemStartDate <= monthEnd) {
                const potentialDate = new Date(Date.UTC(targetYear, targetMonth, itemStartDayOfMonth));
                if (potentialDate.getUTCMonth() === targetMonth && potentialDate >= monthStart && potentialDate >= itemStartDate) {
                    if (isValidDate(potentialDate)) occurrences.push(potentialDate);
                }
            }
            break;

        case 'annually':
            if (itemStartDate.getUTCMonth() === targetMonth && itemStartDate <= monthEnd) {
                const potentialDate = new Date(Date.UTC(targetYear, targetMonth, itemStartDayOfMonth));
                if (potentialDate.getUTCMonth() === targetMonth && potentialDate >= itemStartDate) {
                    if (isValidDate(potentialDate)) occurrences.push(potentialDate);
                }
            }
            break;

        case 'bi-annual':
            const startMonth = itemStartDate.getUTCMonth();
            const secondMonth = (startMonth + 6) % 12;
            if ((targetMonth === startMonth || targetMonth === secondMonth) && itemStartDate <= monthEnd) {
                 const potentialDate = new Date(Date.UTC(targetYear, targetMonth, itemStartDayOfMonth));
                 if (potentialDate.getUTCMonth() === targetMonth && potentialDate >= itemStartDate) {
                    if (isValidDate(potentialDate)) occurrences.push(potentialDate);
                 }
            }
            break;

        case 'quarterly':
            const monthDiff = (targetMonth - itemStartDate.getUTCMonth()) + (targetYear - itemStartDate.getUTCFullYear()) * 12;
            if (monthDiff >= 0 && monthDiff % 3 === 0 && itemStartDate <= monthEnd) {
                const potentialDate = new Date(Date.UTC(targetYear, targetMonth, itemStartDayOfMonth));
                if (potentialDate.getUTCMonth() === targetMonth && potentialDate >= itemStartDate) {
                    if (isValidDate(potentialDate)) occurrences.push(potentialDate);
                }
            }
            break;

        case 'weekly':
        case 'bi-weekly':
            const daysToAdd = (item.interval === 'weekly' ? 7 : 14);
            let currentDate = parseUTCDate(item.start_date);
            
            while (currentDate <= monthEnd) {
                if (!isValidDate(currentDate)) break; // Stop if we hit end date or payoff

                if (currentDate >= monthStart) {
                    occurrences.push(new Date(currentDate.getTime()));
                }
                currentDate.setUTCDate(currentDate.getUTCDate() + daysToAdd);
            }
            break;

        default:
            console.warn(`Unknown interval: ${item.interval}`);
    }
    
    return occurrences;
}

/**
 * Calculates the payment number for a loan based on its occurrence date.
 * @param {string} startDateString - The 'YYYY-MM-DD' start date of the loan.
 * @param {Date} occurrenceDate - The UTC Date object of the specific payment.
 * @param {string} interval - The item's interval ('monthly', 'weekly', etc.).
 * @returns {number} The payment number (e.g., 1, 2, 30).
 */
export function calculatePaymentNumber(startDateString, occurrenceDate, interval) {
    try {
        const itemStartDate = parseUTCDate(startDateString);
        if (!itemStartDate) return null;

        // Use Math.round to account for small DST/leap second discrepancies
        const msPerDay = 1000 * 60 * 60 * 24;
        const diffInMs = occurrenceDate.getTime() - itemStartDate.getTime();
        const diffInDays = Math.round(diffInMs / msPerDay);

        switch (interval) {
            case 'monthly':
                const yearDiff = occurrenceDate.getUTCFullYear() - itemStartDate.getUTCFullYear();
                const monthDiff = occurrenceDate.getUTCMonth() - itemStartDate.getUTCMonth();
                return (yearDiff * 12) + monthDiff + 1;
            case 'annually':
                return (occurrenceDate.getUTCFullYear() - itemStartDate.getUTCFullYear()) + 1;
            case 'quarterly':
                const qYearDiff = occurrenceDate.getUTCFullYear() - itemStartDate.getUTCFullYear();
                const qMonthDiff = occurrenceDate.getUTCMonth() - itemStartDate.getUTCMonth();
                return ((qYearDiff * 12) + qMonthDiff) / 3 + 1;
            case 'weekly':
                return Math.round(diffInDays / 7) + 1;
            case 'bi-weekly':
                return Math.round(diffInDays / 14) + 1;
            default:
                return 1; // For 'one-time' or unknown
        }
    } catch (e) {
        console.error("Error calculating payment number:", e);
        return null;
    }
}
```

### File: chart-loan.js
```javascript
// === LOAN CHART FUNCTIONS ===

import * as s from './selectors.js';
import * as state from './state.js';
import { getLoanAmortization } from './data.js'; 

const CHART_COLORS = ['#3498db', '#e74c3c', '#9b59b6', '#f1c40f', '#2ecc71', '#1abc9c', '#e67e22', '#95a5a6'];

export function initializeLoanChart() {
    populateLoanSelect();

    // Only bind listeners once — tracked via state flag instead of fragile cloneNode
    if (!state.loanChartInitialized) {
        addLoanChartListeners();
        state.setLoanChartInitialized(true);
    }

    renderLoanChart(); 
}

function populateLoanSelect() {
    const container = s.loanChartSelectContainer;
    container.innerHTML = '';
    
    const loanAccounts = state.appState.accounts.filter(a => a.type === 'loan');

    if (loanAccounts.length === 0) {
        container.innerHTML = '<span style="color:#666; font-size:0.9rem;">No loan accounts found. Add one in "Loans & Credit".</span>';
        return;
    }

    loanAccounts.forEach(item => {
        const div = document.createElement('div');
        div.className = 'checkbox-item';
        div.innerHTML = `
            <input type="checkbox" id="loan-select-account-${item.id}" value="account-${item.id}" checked>
            <label for="loan-select-account-${item.id}">${item.name}</label>
        `;
        container.appendChild(div);
    });
}

function addLoanChartListeners() {
    // Delegate checkbox clicks via the static container — no need to rebind
    s.loanChartSelectContainer.addEventListener('click', (event) => {
        if (event.target.type !== 'checkbox') return;
        renderLoanChart();
    });
    
    s.loanTimeframeSelect.addEventListener('change', handleTimeframeChange);
}

function handleTimeframeChange() {
    state.setLoanChartSelections({ 
        ...state.loanChartSelections, 
        timeframe: parseInt(s.loanTimeframeSelect.value) 
    });
    renderLoanChart();
}

function renderLoanChart() {
    if (!state.loanChartInstance) {
        const ctx = s.loanChartCanvas.getContext('2d');
        const newChart = new Chart(ctx, { 
            type: 'line', 
            data: { labels: [], datasets: [] }, 
            options: { responsive: true, maintainAspectRatio: false } 
        });
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
            const startBal = schedule.length > 0 
                ? (schedule[0].remainingBalance + schedule[0].principalPayment) 
                : 0;
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

```

### File: currency.js
```javascript
// === CURRENCY SERVICE ===
// Handles interaction with the Frankfurter API for exchange rates.

const BASE_URL = 'https://api.frankfurter.app';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour cache
let rateCache = {}; // Simple in-memory cache: { "JPY-2024-01-01": { rate: 145.2, timestamp: 12345 } }

/**
 * Fetch exchange rate for a specific date and currency.
 * @param {string} fromCurrency - e.g., 'USD'
 * @param {string} toCurrency - e.g., 'JPY'
 * @param {string} date - ISO format 'YYYY-MM-DD' or 'latest'
 * @returns {Promise<number>} - The exchange rate
 */
export async function getExchangeRate(fromCurrency, toCurrency, date = 'latest') {
    // 1. Optimization: If currencies match, rate is always 1.0
    if (fromCurrency === toCurrency) return 1.0;

    // 2. Check Cache
    const cacheKey = `${fromCurrency}-${toCurrency}-${date}`;
    const now = Date.now();
    if (rateCache[cacheKey] && (now - rateCache[cacheKey].timestamp < CACHE_DURATION)) {
        console.log(`Using cached rate for ${cacheKey}`);
        return rateCache[cacheKey].rate;
    }

    // 3. Handle "Today" vs "Historical"
    // Frankfurter uses 'latest' for current, or YYYY-MM-DD for past
    // It does NOT support future dates, so we fallback to 'latest' for future plans.
    let queryDate = date;
    const today = new Date().toISOString().split('T')[0];
    if (date > today) {
        queryDate = 'latest';
    }

    const url = `${BASE_URL}/${queryDate}?from=${fromCurrency}&to=${toCurrency}`;

    try {
        console.log(`Fetching rate from: ${url}`);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Rate fetch failed: ${response.status}`);
        
        const data = await response.json();
        
        // API returns: { amount: 1.0, base: 'USD', date: '...', rates: { JPY: 148.5 } }
        const rate = data.rates[toCurrency];

        // 4. Update Cache
        rateCache[cacheKey] = { rate: rate, timestamp: now };
        
        return rate;
    } catch (error) {
        console.error("Currency API Error:", error);
        return null; // Return null so UI can ask user for manual input
    }
}

/**
 * Format a value in the target currency.
 * @param {number} amount 
 * @param {string} currencyCode 
 */
export function formatCurrency(amount, currencyCode) {
    return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: currencyCode 
    }).format(amount);
}

/**
 * Fetch the full list of supported currencies (e.g., { USD: "United States Dollar", ... })
 */
export async function getAvailableCurrencies() {
    try {
        // Optimistic caching: Check local storage first to save a network request
        const cached = localStorage.getItem('frankfurter_currencies');
        if (cached) return JSON.parse(cached);

        const response = await fetch(`${BASE_URL}/currencies`);
        if (!response.ok) throw new Error("Failed to fetch currencies");
        
        const data = await response.json();
        
        // Save to cache
        localStorage.setItem('frankfurter_currencies', JSON.stringify(data));
        return data;
    } catch (error) {
        console.error("Error fetching currency list:", error);
        // Fallback list if API fails
        return { 
            USD: "United States Dollar", EUR: "Euro", JPY: "Japanese Yen", 
            GBP: "British Pound", AUD: "Australian Dollar", CAD: "Canadian Dollar" 
        };
    }
}
```

### File: data.js
```javascript
// === DATABASE FUNCTIONS ===
// This module handles all direct interactions with the Supabase database
// for fetching and saving application data.

import { supabaseClient } from './supabase.js';
import * as state from './state.js';
import { showNotification } from './ui.js';
import { parseUTCDate, getOccurrencesInMonth } from './calculations.js'; 
import { renderAll } from './grid.js'; 

// --- Core Data Fetch ---

export async function fetchData() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
         state.setAppState({ 
             incomes: [], expenses: [], transactions: [], accounts: [], transfers: [], 
             reconciliation_log: [], trips: [] 
         });
         renderAll(); 
         return;
    }

    const [
        { data: incomes, error: incomesError },
        { data: expenses, error: expensesError },
        { data: transactions, error: transactionsError },
        { data: accounts, error: accountsError },
        { data: transfers, error: transfersError },
        { data: reconciliation_log, error: reconciliationError },
        { data: trips, error: tripsError }
    ] = await Promise.all([
        supabaseClient.from('incomes').select('*').eq('user_id', user.id),
        supabaseClient.from('expenses').select('*').eq('user_id', user.id),
        supabaseClient.from('transaction_log').select('*').eq('user_id', user.id),
        supabaseClient.from('accounts').select('*').eq('user_id', user.id),
        supabaseClient.from('transfers').select('*').eq('user_id', user.id),
        supabaseClient.from('reconciliation_log').select('*').eq('user_id', user.id),
        supabaseClient.from('trips').select('*').eq('user_id', user.id)
    ]);

    if (incomesError || expensesError || transactionsError || accountsError || transfersError || reconciliationError || tripsError) {
        console.error("Error fetching data:", incomesError || expensesError || transactionsError || accountsError || transfersError || reconciliationError || tripsError);
        showNotification("Error loading data. Please try refreshing.", "error");
        return; // Early return — don't update state with partial/empty data
    }

    state.setAppState({
        incomes: incomes || [],
        expenses: expenses || [],
        transactions: transactions || [], 
        accounts: accounts || [],
        transfers: transfers || [],
        reconciliation_log: reconciliation_log || [],
        trips: trips || []
    });

    renderAll();
    
    // Render trips list if travel module is loaded
    import('./travel.js').then(module => {
        if (module.renderTripsList) module.renderTripsList();
    });
}

// --- Transaction Status Management ---

// Helper to ensure we always work with YYYY-MM-DD strings
function ensureDateString(dateInput) {
    if (typeof dateInput === 'string') return dateInput.split('T')[0];
    if (dateInput instanceof Date) return dateInput.toISOString().split('T')[0];
    return '';
}

export function findTransactionStatus(itemId, itemType, date) {
    const dateString = ensureDateString(date);

    return state.appState.transactions.find(t => 
        t.item_id === itemId && 
        t.item_type === itemType && 
        t.occurrence_date === dateString
    );
}

export async function saveTransactionStatus(itemId, itemType, date, status) {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return;

    const dateString = ensureDateString(date);
    const existingRecord = findTransactionStatus(itemId, itemType, date);

    if (existingRecord) {
        const { error } = await supabaseClient
            .from('transaction_log') 
            .update({ status: status })
            .eq('id', existingRecord.id);
        if (error) console.error("Error updating status:", error);
    } else {
        const { error } = await supabaseClient
            .from('transaction_log') 
            .insert([{
                user_id: user.id,
                item_id: itemId,
                item_type: itemType,
                occurrence_date: dateString,
                status: status,
                edited_amount: null
            }]);
        if (error) console.error("Error inserting status:", error);
    }
    await fetchData();
}

export async function saveTransactionAmount(itemId, itemType, date, originalAmount, newAmount) {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return;

    const dateString = ensureDateString(date);
    const existingRecord = findTransactionStatus(itemId, itemType, date);

    if (existingRecord) {
        const { error } = await supabaseClient
            .from('transaction_log') 
            .update({ edited_amount: newAmount, original_amount: originalAmount }) 
            .eq('id', existingRecord.id);
        if (error) console.error("Error updating amount:", error);
    } else {
        const { error } = await supabaseClient
            .from('transaction_log') 
            .insert([{
                user_id: user.id,
                item_id: itemId,
                item_type: itemType,
                occurrence_date: dateString,
                status: 'pending',
                original_amount: originalAmount, 
                edited_amount: newAmount
            }]);
        if (error) console.error("Error inserting amount:", error);
    }
    await fetchData();
}

export async function revertTransactionAmount(itemId, itemType, date) {
    const existingRecord = findTransactionStatus(itemId, itemType, date);
    if (existingRecord) {
        const { error } = await supabaseClient
            .from('transaction_log') 
            .update({ edited_amount: null })
            .eq('id', existingRecord.id);
        if (error) console.error("Error reverting amount:", error);
        await fetchData();
    }
}

// --- Trip Management ---

export async function saveTrip(tripData) {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
        showNotification("You must be logged in to save trips.", 'error');
        return false;
    }

    const tripPayload = {
        ...tripData,
        user_id: user.id
    };

    let error;
    if (tripData.id) {
        const { error: updateError } = await supabaseClient
            .from('trips')
            .update(tripPayload)
            .eq('id', tripData.id);
        error = updateError;
    } else {
        delete tripPayload.id; 
        const { error: insertError } = await supabaseClient
            .from('trips')
            .insert([tripPayload]);
        error = insertError;
    }

    if (error) {
        console.error("Error saving trip:", error);
        showNotification(`Error saving trip: ${error.message}`, 'error');
        return false;
    } else {
        showNotification("Trip saved successfully!", "success");
        await fetchData();
        return true;
    }
}

export async function deleteTrip(tripId) {
    if (!confirm("Are you sure you want to delete this trip?")) return;
    
    const { error } = await supabaseClient
        .from('trips')
        .delete()
        .eq('id', tripId);

    if (error) {
        console.error("Error deleting trip:", error);
        showNotification(`Error deleting trip: ${error.message}`, 'error');
    } else {
        showNotification("Trip deleted.", "success");
        await fetchData();
        // renderTripsList is called directly from travel.js handleTravelListClick
    }
}

// === Loan Amortization Engine (Account-Centric) ===
export function getLoanAmortization(account) {
    if (!account || !account.advanced_data) return null;

    const principal = Math.abs(account.current_balance); 
    const annualRate = account.advanced_data.interest_rate || 0;
    const monthlyRate = annualRate / 12;

    const linkedExpenses = state.appState.expenses.filter(e => 
        e.advanced_data && e.advanced_data.linked_loan_id === account.id
    );

    const paymentSchedule = {}; 
    const startDate = new Date();
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();

    for (let i = 0; i < 360; i++) {
        const utcDate = new Date(Date.UTC(startYear, startMonth + i, 1));
        let monthlyPayment = 0;
        
        linkedExpenses.forEach(exp => {
            const occurrences = getOccurrencesInMonth(exp, utcDate);
            if (occurrences.length > 0) {
                monthlyPayment += (exp.amount * occurrences.length);
            }
        });
        
        const dateKey = `${utcDate.getUTCFullYear()}-${String(utcDate.getUTCMonth()+1).padStart(2,'0')}`;
        paymentSchedule[dateKey] = monthlyPayment;
    }

    let remainingBalance = principal;
    const schedule = [];
    let month = 1;

    for (let i = 0; i < 360; i++) {
        if (remainingBalance <= 0.01) break;

        const currentDate = new Date(startYear, startMonth + i, 1);
        const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2,'0')}`;
        
        const payment = paymentSchedule[dateKey] || 0;
        const interest = remainingBalance * monthlyRate;
        let principalPayment = payment - interest;

        if (remainingBalance + interest <= payment) {
            principalPayment = remainingBalance;
            remainingBalance = 0;
        } else {
            remainingBalance -= principalPayment;
        }

        schedule.push({
            month: month,
            date: dateKey,
            payment: payment,
            interestPayment: interest,
            principalPayment: principalPayment,
            remainingBalance: remainingBalance
        });
        month++;
    }

    return {
        schedule: schedule,
        trueTotalMonths: schedule.length
    };
}

// === Legacy Amortization Engine (Item-Centric) ===
export function getDynamicAmortization(item) {
    if (!item.advanced_data || !item.advanced_data.original_principal) return null;

    const edits = state.appState.transactions.filter(t => 
        t.item_id === item.id && 
        t.item_type === 'expense' && 
        t.edited_amount !== null
    ).reduce((acc, t) => {
        acc[t.occurrence_date] = t.edited_amount;
        return acc;
    }, {});

    const principal = item.advanced_data.original_principal;
    const annualRate = item.advanced_data.interest_rate || 0;
    const defaultPayment = item.amount;
    
    if (principal <= 0 || annualRate < 0) return null;

    const monthlyRate = annualRate / 12;
    let remainingBalance = principal;
    const schedule = [];
    let month = 1;

    while (remainingBalance > 0.01) {
        const currentDate = new Date(parseUTCDate(item.start_date).getTime());
        currentDate.setUTCMonth(currentDate.getUTCMonth() + (month - 1));
        const dateString = currentDate.toISOString().split('T')[0];
        
        const paymentAmount = edits[dateString] !== undefined ? edits[dateString] : defaultPayment;
        
        const interestPayment = remainingBalance * monthlyRate;
        let principalPayment = paymentAmount - interestPayment;
        
        if (remainingBalance + interestPayment <= paymentAmount) {
            principalPayment = remainingBalance;
            remainingBalance = 0;
        } else {
            remainingBalance -= principalPayment;
        }

        if (remainingBalance > principal * 2) break; 

        schedule.push({
            month: month,
            date: dateString,
            payment: principalPayment + interestPayment,
            principalPayment: principalPayment,
            interestPayment: interestPayment,
            remainingBalance: remainingBalance
        });
        
        if (month > 600) break; 
        month++;
    }

    return {
        schedule: schedule,
        trueTotalMonths: schedule.length
    };
}

```

### File: grid.js
```javascript
// === GRID & DASHBOARD FUNCTIONS ===
// This module contains all logic for rendering the dashboard,
// handling tab/view state, and generating the various grids.

import * as s from './selectors.js';
import * as state from './state.js';
import * as ui from './ui.js';
import * as calc from './calculations.js';
import { findTransactionStatus } from './data.js';
import { formatCurrency } from './utils.js';
// === ⭐️ NEW STATIC IMPORT ===
import * as loanChart from './chart-loan.js';

// --- Main Render Function ---

export function renderAll() {
    renderIncomes();
    renderExpenses();
    renderDashboard();
    ui.renderBankingSection();

    if (state.lastNumYears !== null) {
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
export function renderDashboard() {
    const format = formatCurrency;
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonthIndex = today.getMonth();
    const monthName = today.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    // ==========================================
    // 1. LIQUID CASH (New Top Section)
    // ==========================================
    const bankSummaryEl = document.getElementById('dashboard-bank-summary');
    if (bankSummaryEl) {
        const accounts = state.appState.accounts || [];
        const incomes = state.appState.incomes || [];
        const expenses = state.appState.expenses || [];

        // A. Filter for "Show on Dashboard" accounts
        const dashAccounts = accounts.filter(a => a.advanced_data && a.advanced_data.show_on_dashboard);
        
        // Sort them for consistency
        dashAccounts.sort((a, b) => a.name.localeCompare(b.name));

        if (dashAccounts.length === 0) {
            bankSummaryEl.innerHTML = `<p style="font-size:0.8rem; color:var(--text-color); opacity:0.7; padding:0.5rem;">No accounts selected.<br>Edit an account and check "Show in Dashboard".</p>`;
        } else {
            // B. Calculate Forecast Per Account
            // 1. Init forecast with current balances
            const forecastBalances = {};
            dashAccounts.forEach(a => forecastBalances[a.id] = a.current_balance);

            const currentMonthStart = new Date(Date.UTC(currentYear, currentMonthIndex, 1));

            // 2. Add Remaining Income
            incomes.forEach(item => {
                // Skip if not linked to a dashboard account
                if (!item.deposit_account_id || forecastBalances[item.deposit_account_id] === undefined) return;

                const occurrences = calc.getOccurrencesInMonth(item, currentMonthStart);
                occurrences.forEach(date => {
                    const occDate = new Date(date);
                    // Only count if it's today or in the future
                    if (occDate.getDate() >= today.getDate()) {
                        forecastBalances[item.deposit_account_id] += item.amount;
                    }
                });
            });

            // 3. Subtract Remaining Expenses
            expenses.forEach(item => {
                // Skip if not linked to a dashboard account
                if (!item.payment_account_id || forecastBalances[item.payment_account_id] === undefined) return;

                const occurrences = calc.getOccurrencesInMonth(item, currentMonthStart);
                occurrences.forEach(date => {
                    const occDate = new Date(date);
                    if (occDate.getDate() >= today.getDate()) {
                        forecastBalances[item.payment_account_id] -= item.amount;
                    }
                });
            });

            // C. Render HTML
            let html = `<h4 class="bank-summary-section-header">Current</h4>`;
            
            // Current Rows
            dashAccounts.forEach(acc => {
                html += `
                <div class="bank-summary-row">
                    <span class="bank-summary-label">${acc.name}</span>
                    <span class="bank-summary-value">${format(acc.current_balance)}</span>
                </div>`;
            });

            html += `<h4 class="bank-summary-section-header">Forecast (End of Month)</h4>`;

            // Forecast Rows
            dashAccounts.forEach(acc => {
                const endBalance = forecastBalances[acc.id];
                // Highlight if negative
                const valClass = endBalance < 0 ? 'bank-summary-value expense-total' : 'bank-summary-value forecast';
                
                html += `
                <div class="bank-summary-row">
                    <span class="bank-summary-label">${acc.name}</span>
                    <span class="bank-summary-value ${valClass}">${format(endBalance)}</span>
                </div>`;
            });

            bankSummaryEl.innerHTML = html;
        }
    }

    // ==========================================
    // 2. CURRENT MONTH SUMMARY (Existing Logic)
    // ==========================================
    
    // Reuse grid logic to ensure numbers match perfectly
    const startOfMonthUTC = new Date(Date.UTC(currentYear, currentMonthIndex, 1));
    const creditCardAccounts = state.appState.accounts.filter(acc => acc.type === 'credit_card');
    const creditCardAccountIds = new Set(creditCardAccounts.map(acc => acc.id));

    const getMonthSum = (items, type) => {
        let sum = 0;
        items.forEach(item => {
            if (type === 'expense' && creditCardAccountIds.has(item.payment_account_id)) return;

            const occurrences = calc.getOccurrencesInMonth(item, startOfMonthUTC);
            occurrences.forEach(occDate => {
                const statusRecord = findTransactionStatus(item.id, type, occDate);
                if (statusRecord && statusRecord.edited_amount !== null) {
                    sum += statusRecord.edited_amount;
                } else {
                    sum += item.amount;
                }
            });
        });
        return sum;
    };

    const monthlyIncome = getMonthSum(state.appState.incomes, 'income');
    const monthlyExpense = getMonthSum(state.appState.expenses, 'expense');
    const monthlyNet = monthlyIncome - monthlyExpense;
    
    // YTD Calc
    let overallNet = 0;
    try {
        // calculateYTDNet is defined at bottom of grid.js, so this call works
        overallNet = calculateYTDNet(currentYear, currentMonthIndex + 1);
    } catch (e) { console.warn("YTD Calc error", e); }


    s.dashboardSummary.innerHTML = `
        <div style="margin-bottom: 1rem; border-bottom: 2px solid var(--border-color); padding-bottom: 0.5rem;">
            <h3 style="margin: 0; font-size: 1.1rem; color: var(--text-color);">Current Month (${monthName})</h3>
        </div>
        
        <div class="summary-item">
            <h3 class="income-total">Income</h3>
            <p class="income-total">${format(monthlyIncome)}</p>
        </div>
        <div class="summary-item">
            <h3 class="expense-total">Expenses</h3>
            <p class="expense-total">${format(monthlyExpense)}</p>
        </div>
        <div class="summary-item net-total">
            <h3>Net Balance</h3>
            <p>${format(monthlyNet)}</p>
        </div>
        <div class="summary-item net-total" style="border-top: none; margin-top: 0.5rem;">
            <h3>YTD Net</h3>
            <p>${format(overallNet)}</p>
        </div>`;
    
    // ==========================================
    // 3. ANNUAL FORECAST (Existing Logic)
    // ==========================================
    const netWorth = state.appState.accounts.reduce((total, acc) => total + acc.current_balance, 0);

    const regularPayItems = state.appState.incomes.filter(i => i.type === 'Regular Pay');
    const calculatedAnnualGrossPay = regularPayItems.reduce((total, item) => {
        if (item.advanced_data && item.advanced_data.gross_pay_amount) {
            return total + calc.calculateAnnualTotal([{...item, amount: item.advanced_data.gross_pay_amount}]); 
        }
        return total + calc.calculateAnnualTotal([item]);
    }, 0);

    const annualPreTaxContributions = calc.calculateAnnualTotal(state.appState.incomes, i => i.type === 'Investment Contribution');
    const estimatedAGI = calculatedAnnualGrossPay - annualPreTaxContributions;
    const annualMagiAddBacks = calc.calculateAnnualTotal(state.appState.expenses, i => i.advanced_data?.is_magi_addback === true);
    const estimatedMagi = estimatedAGI + annualMagiAddBacks;
    
    if (s.dashboardForecast) { 
        s.dashboardForecast.innerHTML = `
            <div style="margin-bottom: 1rem; border-bottom: 2px solid var(--border-color); padding-bottom: 0.5rem; margin-top: 1.5rem;">
                <h3 style="margin: 0; font-size: 1.1rem; color: var(--text-color);">Annual Estimates</h3>
            </div>
            <div class="summary-item">
                <h3>Net Worth</h3>
                <p>${format(netWorth)}</p>
            </div>
            <div class="summary-item">
                <h3>Gross Pay</h3>
                <p>${format(calculatedAnnualGrossPay)}</p>
            </div>
            <div class="summary-item">
                <h3>Est. AGI</h3>
                <p>${format(estimatedAGI)}</p>
            </div>
            <div class="summary-item">
                <h3>Est. MAGI</h3>
                <p>${format(estimatedMagi)}</p>
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
        } else if (state.activeGridView === 'historic') {
            renderHistoricConfigUI();
        } else {
            // === ⭐️ FIX: "Grab" the previous month's ending total ⭐️ ===
            const months = (state.activeGridView === '6m') ? 6 : 2;
            const today = new Date();
            const currentYear = today.getFullYear();
            const currentMonthIndex = today.getMonth(); // 0-based (Dec = 11)

            // This sums Jan->Nov to give us the "Starting Balance" for Dec 1st
            const ytdNetTotal = calculateYTDNet(currentYear, currentMonthIndex);
            

            // Pass ytdNetTotal as the 3rd argument (startingNetTotal)
            s.gridMonthlyContent.innerHTML = renderGridView(months, today, ytdNetTotal, null);
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
        } else if (state.activeChartView === 'reconciliationView') {
            ui.renderReconciliationList(); 
        }
    }
}

// --- Grid Rendering ---
export function renderGridView(numberOfMonths, startDate, startingNetTotal = 0, startingAccountBalances = null) {

    const startOfMonthUTC = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), 1));
    const months = calc.getMonthsToRender(startOfMonthUTC, numberOfMonths);

    const formatDay = date => date.getUTCDate();
    const toggleIcon = '<span class="grid-section-toggle" title="Toggle Section">▼</span>';

    // === 1. Identify Credit Card Accounts & Charges ===
    const creditCardAccounts = state.appState.accounts.filter(acc => acc.type === 'credit_card');
    const creditCardAccountIds = new Set(creditCardAccounts.map(acc => acc.id));
    const creditCardCharges = state.appState.expenses.filter(i => creditCardAccountIds.has(i.payment_account_id));
    
    // === 2. Filter Main Expense Lists ===
    const recurringExpenses = state.appState.expenses.filter(i => i.interval !== 'one-time' && !creditCardAccountIds.has(i.payment_account_id));
    const oneTimeIncomes = state.appState.incomes.filter(i => i.interval === 'one-time');
    const oneTimeExpenses = state.appState.expenses.filter(i => i.interval === 'one-time' && !creditCardAccountIds.has(i.payment_account_id));

    // === 3. Split Income into Regular vs TSP ===
    const allRecurringIncomes = state.appState.incomes.filter(i => i.interval !== 'one-time');
    const tspIncomes = allRecurringIncomes.filter(i => i.name && i.name.toUpperCase().includes('TSP'));
    const regularIncomes = allRecurringIncomes.filter(i => !i.name || !i.name.toUpperCase().includes('TSP'));

    // ⭐️ NEW: Add Pagination Controls at the top
    let finalHTML = `
        <div class="grid-pagination-controls">
            <button class="btn-secondary" data-action="scroll-left">◀ Prev 3 Months</button>
            <span class="grid-page-label">Horizontal Navigation</span>
            <button class="btn-secondary" data-action="scroll-right">Next 3 Months ▶</button>
        </div>
        <div class="grid-view-container scrollable-grid-region">
    `;
    
    let runningOverallNet = startingNetTotal;
    let runningAccountBalances;
    if (startingAccountBalances) {
        runningAccountBalances = { ...startingAccountBalances };
    } else {
        runningAccountBalances = state.appState.accounts.reduce((acc, account) => {
            acc[account.id] = account.current_balance;
            return acc;
        }, {});
    }

    months.forEach(monthDateUTC => {
        const monthYear = monthDateUTC.toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
        const monthString = monthDateUTC.toISOString().split('T')[0];

        // --- Helper: Generate Rows ---
        const generateRows = (items, type, emptyMessage) => {
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
            if (!hasItems) rowsHTML = `<tr><td colspan="3">${emptyMessage}</td></tr>`;
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
                    rowsHTML += `<tr class="${statusClass} ${typeClass}" data-item-id="${item.id}" data-item-type="${type}" data-date="${dateString}" data-amount="${item.amount}" title="Right-click to change status"><td>${itemName}</td><td>${dueDay}</td><td>${amount}</td></tr>`;
                });
            }
            if (!hasItems) rowsHTML = `<tr><td colspan="3">No one-time items this month.</td></tr>`;
            const net = totalIncome - totalExpense;
            return { html: rowsHTML, net: net };
        };

        // === Generate Data ===
        const regularIncomeData = generateRows(regularIncomes, 'income', 'No regular income.');
        const tspIncomeData = generateRows(tspIncomes, 'income', 'No TSP distributions.');
        const expenseData = generateRows(recurringExpenses, 'expense', 'No recurring expenses.');
        
        // Generate Credit Card Sections
        let creditCardSectionsHTML = '';
        creditCardAccounts.forEach(cardAccount => {
            const chargesForThisCard = creditCardCharges.filter(charge => charge.payment_account_id === cardAccount.id);
            const cardData = generateRows(chargesForThisCard, 'expense', 'No charges this month.');
            
            if (cardData.total > 0 || cardData.html.includes('<tr')) {
                 creditCardSectionsHTML += `
                    <tbody class="grid-group-creditcard">
                        <tr class="grid-group-header"><td colspan="3">
                            <div class="grid-header-content">
                                <div>${toggleIcon} <span>${cardAccount.name}</span></div>
                                <button class="btn-grid-add" data-action="add-grid-item" data-type="expense" data-date="${monthString}">+ Add</button>
                            </div>
                        </td></tr>
                        ${cardData.html}
                        <tr class="grid-total-row">
                            <td colspan="2">Total Charges</td>
                            <td>${formatCurrency(cardData.total)}</td>
                        </tr>
                    </tbody>
                 `;
            }
        });
        
        const oneTimeData = generateOneTimeRows();

        // === Calculate Net Totals ===
        const monthlyNetTotal = (regularIncomeData.total + tspIncomeData.total - expenseData.total) + oneTimeData.net;
        runningOverallNet += monthlyNetTotal;

        // --- Calculate Banking Section ---
        const bankingMonthData = calculateAccountBalancesForMonth(monthDateUTC, runningAccountBalances);
        let bankingRowsHTML = '';
        
        if (state.appState.accounts.length === 0) {
             bankingRowsHTML = `<tr><td colspan="3">No accounts defined.</td></tr>`;
        } else {
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
                transferRowsHTML += `
                    <tr class="${statusClass}" data-item-id="${transfer.id}" data-item-type="transfer" data-date="${dateString}" data-amount="${transfer.amount}" title="Right-click to change status">
                        <td>${desc}</td><td>${day}</td><td>${formatCurrency(displayAmount)}</td>
                    </tr>`;
            });
        }
        
        bankingRowsHTML += transferRowsHTML;
        runningAccountBalances = bankingMonthData.endingBalances;
        
        const incomeTotalFormatted = formatCurrency(regularIncomeData.total);
        const tspTotalFormatted = formatCurrency(tspIncomeData.total);
        const expenseTotalFormatted = formatCurrency(expenseData.total);
        const oneTimeNetFormatted = formatCurrency(oneTimeData.net);
        const monthlyNetTotalFormatted = formatCurrency(monthlyNetTotal);
        const overallNetTotalFormatted = formatCurrency(runningOverallNet);

        // === 4. Construct Final HTML ===
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
                        <tr class="grid-group-header"><td colspan="3"><div class="grid-header-content"><div>${toggleIcon} <span>Income</span></div><button class="btn-grid-add" data-action="add-grid-item" data-type="income" data-date="${monthString}">+ Add</button></div></td></tr>
                        ${regularIncomeData.html}
                        <tr class="grid-total-row"><td colspan="2">Total Income</td><td>${incomeTotalFormatted}</td></tr>
                    </tbody>

                    <tbody class="grid-group-income">
                        <tr class="grid-group-header"><td colspan="3"><div class="grid-header-content"><div>${toggleIcon} <span>TSP Distributions</span></div></div></td></tr>
                        ${tspIncomeData.html}
                        <tr class="grid-total-row"><td colspan="2">Total TSP</td><td>${tspTotalFormatted}</td></tr>
                    </tbody>

                    <tbody class="grid-group-expense">
                        <tr class="grid-group-header"><td colspan="3"><div class="grid-header-content"><div>${toggleIcon} <span>Expenses (Cash/Bank)</span></div><button class="btn-grid-add" data-action="add-grid-item" data-type="expense" data-date="${monthString}">+ Add</button></div></td></tr>
                        ${expenseData.html}
                        <tr class="grid-total-row"><td colspan="2">Total Expenses</td><td>${expenseTotalFormatted}</td></tr>
                    </tbody>
                    
                    ${creditCardSectionsHTML}
                    
                    <tbody class="grid-group-onetime">
                        <tr class="grid-group-header"><td colspan="3"><div class="grid-header-content"><div>${toggleIcon} <span>One-time (Cash/Bank)</span></div><div class="grid-header-buttons"><button class="btn-grid-add" data-action="add-grid-item" data-type="income" data-date="${monthString}" data-interval="one-time">+ Income</button><button class="btn-grid-add" data-action="add-grid-item" data-type="expense" data-date="${monthString}" data-interval="one-time">+ Expense</button></div></div></td></tr>
                        ${oneTimeData.html}
                        <tr class="grid-total-row"><td colspan="2">One-time Net</td><td>${oneTimeNetFormatted}</td></tr>
                    </tbody>

                    <tbody class="grid-group-banking">
                        <tr class="grid-group-header"><td colspan="3"><div class="grid-header-content"><div>${toggleIcon} <span>Banking</span></div></div></td></tr>
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
    } else {
         state.setLastNumYears(numYears);
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

/**
 * Calculates the Net Total (Income - Expenses) from Jan 1st of the given year
 * up to (but not including) the target month index.
 */
function calculateYTDNet(year, upToMonthIndex) {
    let totalIncome = 0;
    let totalExpense = 0;

    // 1. Identify Credit Card Accounts to exclude their charges
    const creditCardAccounts = state.appState.accounts.filter(acc => acc.type === 'credit_card');
    const creditCardAccountIds = new Set(creditCardAccounts.map(acc => acc.id));

    const sumItems = (items, type) => {
        let sum = 0;
        items.forEach(item => {
            const itemStartDate = calc.parseUTCDate(item.start_date);
            if (!itemStartDate) return;

            // ⭐️ FIX: Skip expenses that are paid by Credit Card
            if (type === 'expense' && creditCardAccountIds.has(item.payment_account_id)) {
                return;
            }

            // Loop from Jan (0) up to the target month
            for (let m = 0; m < upToMonthIndex; m++) {
                const monthDate = new Date(Date.UTC(year, m, 1));
                
                // Get occurrences for this specific past month
                const occurrences = calc.getOccurrencesInMonth(item, monthDate);
                
                occurrences.forEach(occurrenceDate => {
                    const statusRecord = findTransactionStatus(item.id, type, occurrenceDate);
                    if (statusRecord && statusRecord.edited_amount !== null) {
                        sum += statusRecord.edited_amount;
                    } else {
                        sum += item.amount;
                    }
                });
            }
        });
        return sum;
    };

    totalIncome = sumItems(state.appState.incomes, 'income');
    totalExpense = sumItems(state.appState.expenses, 'expense');

    return totalIncome - totalExpense;
}
```

### File: selectors.js
```javascript
// === DOM SELECTORS ===
// All DOM element queries are centralized here and exported.
// Static selectors are grabbed once at module load (safe with type="module").
// Dynamic selectors use getEl() for elements that may not exist at load time.

/**
 * Lazy selector for elements that may be created/destroyed at runtime.
 * Use for Trip Planner sub-views, dynamically rendered content, etc.
 * @param {string} id - The element ID to query.
 * @returns {HTMLElement|null}
 */
export function getEl(id) {
    return document.getElementById(id);
}

// === STATIC SELECTORS ===

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

```

### File: state.js
```javascript
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

```

### File: supabase.js
```javascript
// === SUPABASE INITIALIZATION ===
// This module initializes the Supabase client and exports it
// for other modules to use.

const SUPABASE_URL = 'https://mwuxrrwbgytbqrlhzwsc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13dXhycndiZ3l0YnFybGh6d3NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MjcxNTYsImV4cCI6MjA3NjEwMzE1Nn0.up3JOKKXEyw6axEGhI2eESJbrZzoH-93zRmCSXukYZY';

// The global supabase object is available from the <script> tag in index.html
export const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

### File: travel.js
```javascript
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
 * Wrapped in try/catch per trip so a currency API failure doesn't break the whole list.
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
            // Render trip card without live rate data rather than failing silently
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

```

### File: ui.js
```javascript
// === UI FUNCTIONS ===
// This module contains all functions that directly manipulate the DOM
// for UI purposes, such as modals, notifications, and rendering lists.

import * as s from './selectors.js';
import * as state from './state.js';
import { supabaseClient } from './supabase.js';
import { fetchData, getDynamicAmortization, getLoanAmortization } from './data.js';
import { parseUTCDate, getOccurrencesInMonth } from './calculations.js';
import { formatCurrency } from './utils.js';

// --- Notification Functions ---

export function showNotification(message, type = 'success') {
    const toast = document.createElement('div');
    toast.classList.add('toast', `toast--${type}`);
    toast.textContent = message;

    s.notificationContainer.appendChild(toast);

    // Remove the toast after the animation completes
    setTimeout(() => {
        toast.remove();
    }, 3000); // Duration of animation (2.5s) + buffer
}

// --- Dark/Light Mode Functions ---

export function setMode(mode) {
    localStorage.setItem('sunflower-mode', mode);
    if (mode === 'dark') {
        document.body.classList.add('dark-mode');
        s.darkModeToggle.checked = true;
    } else {
        document.body.classList.remove('dark-mode');
        s.darkModeToggle.checked = false;
    }
}

export function loadMode() {
    const savedMode = localStorage.getItem('sunflower-mode') || 'light'; // Default to light
    setMode(savedMode);
}

// --- Footer ---

export function initializeFooter() {
    if (s.currentYearSpan) {
        s.currentYearSpan.textContent = new Date().getFullYear();
    }
}

// --- Auth Modal Functions ---

export function openAuthModal() { 
    s.authModal.classList.remove('modal-hidden'); 
}
export function closeAuthModal() { 
    s.authModal.classList.add('modal-hidden'); 
}

// --- App Modal Functions ---

export function openModal() { 
    s.appModal.classList.remove('modal-hidden'); 
}

export function closeModal() {
    s.appModal.classList.add('modal-hidden');
    s.appModal.classList.remove('modal--read-only'); // Remove class on close
    s.modalBody.innerHTML = '';
    state.setOnSave(null);
}

// --- Data Modal Functions (Income, Expense, Account, Transfer) ---

export function showIncomeModal(incomeId, prefillData = null) {
    const isEditMode = incomeId !== undefined;
    const incomeToEdit = isEditMode && Array.isArray(state.appState.incomes) ? state.appState.incomes.find(i => i.id === incomeId) : null;
    s.modalTitle.textContent = isEditMode ? 'Edit Income' : 'Add New Income';

    // --- Account Options Setup (with Grouping) ---
    const bankAccounts = state.appState.accounts.filter(acc => acc.type === 'checking' || acc.type === 'savings');
    const investmentAccounts = state.appState.accounts.filter(acc => acc.type === 'investment');
    let accountOptions = '<option value="">-- None --</option>';
    
    if (bankAccounts.length > 0) {
        accountOptions += '<optgroup label="Bank Accounts">' + bankAccounts.map(acc => `<option value="${acc.id}">${acc.name}</option>`).join('') + '</optgroup>';
    }
    if (investmentAccounts.length > 0) {
        accountOptions += '<optgroup label="Investment Accounts">' + investmentAccounts.map(acc => `<option value="${acc.id}">${acc.name}</option>`).join('') + '</optgroup>';
    }
    if (bankAccounts.length === 0 && investmentAccounts.length === 0) {
        accountOptions = '<option value="" disabled>-- No accounts defined --</option>';
    }

    // --- Modal Body HTML ---
    s.modalBody.innerHTML = `
        <div class="form-group"><label for="modal-income-type">Type:</label><select id="modal-income-type" required>...</select></div>
        <div class="form-group"><label for="modal-income-name">Description / Name:</label><input type="text" id="modal-income-name" placeholder="e.g., Vincent's TSP" required></div>
        
        <div class="form-group"><label for="modal-income-interval">Payment Interval:</label><select id="modal-income-interval" required>...</select></div>
        <div class="form-group"><label for="modal-income-amount">Payment Amount (Net):</label><input type="number" id="modal-income-amount" placeholder="1500" min="0" step="0.01" required></div>

        <div id="gross-pay-group" class="form-group" style="display: none;">
            <label for="modal-income-gross-pay" id="gross-pay-label">Gross Pay:</label>
            <input type="number" id="modal-income-gross-pay" placeholder="e.g., 2500" min="0" step="0.01">
        </div>

        <div class="form-group"><label for="modal-income-date">Payment Start Date:</label><input type="date" id="modal-income-date" required></div>
        
        <div class="form-group"><label for="modal-income-end-date">End Date (Optional):</label><input type="date" id="modal-income-end-date"></div>
        
        <div class="form-group"><label for="modal-income-deposit-account">Deposit To Account:</label><select id="modal-income-deposit-account">${accountOptions}</select></div> `;

    // --- Element References ---
    const typeSelect = document.getElementById('modal-income-type');
    const grossPayGroup = document.getElementById('gross-pay-group');
    const grossPayLabel = document.getElementById('gross-pay-label');
    const intervalSelect = document.getElementById('modal-income-interval');

    // --- Dynamic Logic Functions ---
    
    // Update the label (e.g., "Monthly Gross Pay:")
    const updateGrossPayLabel = () => {
        if (typeSelect.value !== 'Regular Pay') return;
        
        const selectedOption = intervalSelect.options[intervalSelect.selectedIndex];
        const intervalText = selectedOption ? selectedOption.text : '';
        grossPayLabel.textContent = `${intervalText} Gross Pay:`;
    };

    // Toggle visibility of the Gross Pay field
    const toggleGrossPayField = () => {
        const show = (typeSelect.value === 'Regular Pay');
        grossPayGroup.style.display = show ? 'grid' : 'none';
        if (show) {
            updateGrossPayLabel(); 
        }
    };
    
    // Add listeners
    typeSelect.addEventListener('change', toggleGrossPayField);
    intervalSelect.addEventListener('change', updateGrossPayLabel); 

    // --- Populate Dropdowns ---
    document.getElementById('modal-income-interval').innerHTML = `
        <option value="monthly">Monthly</option>
        <option value="bi-annual">Bi-annual</option>
        <option value="annually">Annually</option>
        <option value="quarterly">Quarterly</option>
        <option value="bi-weekly">Bi-Weekly</option>
        <option value="weekly">Weekly</option>
        <option value="one-time">One-time</option>
    `;
    
    document.getElementById('modal-income-type').innerHTML = `
        <option value="">-- Select a Type --</option>
        <option value="Regular Pay">Regular Pay</option>
        <option value="Investment Contribution">Investment Contribution</option>
        <option value="Pension">Pension</option>
        <option value="TSP">TSP</option>
        <option value="TSP Supplement">TSP Supplement</option>
        <option value="Social Security">Social Security</option>
        <option value="Investment">Investment Dividend</option>
        <option value="Other">Other</option>
    `;

    // --- Populate Data (Edit Mode) ---
    if (isEditMode && incomeToEdit) {
        document.getElementById('modal-income-type').value = incomeToEdit.type || '';
        document.getElementById('modal-income-name').value = incomeToEdit.name || '';
        document.getElementById('modal-income-interval').value = incomeToEdit.interval || 'monthly';
        document.getElementById('modal-income-amount').value = incomeToEdit.amount || '';
        document.getElementById('modal-income-date').value = incomeToEdit.start_date || '';
        document.getElementById('modal-income-deposit-account').value = incomeToEdit.deposit_account_id || '';

        // Populate End Date
        document.getElementById('modal-income-end-date').value = incomeToEdit.end_date || '';

        // Populate Gross Pay
        if (incomeToEdit.advanced_data && incomeToEdit.advanced_data.gross_pay_amount) {
            document.getElementById('modal-income-gross-pay').value = incomeToEdit.advanced_data.gross_pay_amount;
        }

    } else if (prefillData) {
        document.getElementById('modal-income-date').value = prefillData.startDate;
        if (prefillData.interval) {
            document.getElementById('modal-income-interval').value = prefillData.interval;
        }
    } else if (!isEditMode) {
        document.getElementById('modal-income-date').value = new Date().toISOString().split('T')[0];
    }

    // Trigger toggle on initial load to set correct state
    toggleGrossPayField();

    // --- Save Handler ---
    state.setOnSave(async () => {
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) { return; }

        const startDateValue = document.getElementById('modal-income-date').value;
        const endDateValue = document.getElementById('modal-income-end-date').value; // Get End Date
        const depositAccountId = document.getElementById('modal-income-deposit-account').value;
        const type = document.getElementById('modal-income-type').value;

        // Save logic for Gross Pay
        let advancedData = null;
        if (type === 'Regular Pay') {
            const grossPayInput = document.getElementById('modal-income-gross-pay').value;
            if (grossPayInput) {
                const grossAmount = parseFloat(grossPayInput);
                if (grossAmount > 0) {
                    advancedData = { gross_pay_amount: grossAmount };
                }
            }
        }

        const formItem = {
            user_id: user.id,
            type: type,
            name: document.getElementById('modal-income-name').value.trim(),
            interval: document.getElementById('modal-income-interval').value,
            amount: parseFloat(document.getElementById('modal-income-amount').value),
            start_date: startDateValue ? startDateValue : null,
            end_date: endDateValue ? endDateValue : null, // Save End Date
            deposit_account_id: depositAccountId ? parseInt(depositAccountId) : null,
            advanced_data: advancedData // Contains gross_pay_amount
        };

        // Basic Validation
        if (!formItem.type || !formItem.name || isNaN(formItem.amount) || formItem.amount < 0 || !formItem.start_date) {
            alert("Please fill out all fields correctly, including a valid start date.");
            return;
        }

        // Gross Pay Validation
        if (type === 'Regular Pay' && advancedData && advancedData.gross_pay_amount) {
            if (advancedData.gross_pay_amount < formItem.amount) {
                alert("Gross Pay (per payment) cannot be less than the Net Pay (per payment). Please check your numbers.");
                return;
            }
        }

        let { error } = isEditMode
            ? await supabaseClient.from('incomes').update(formItem).eq('id', incomeId)
            : await supabaseClient.from('incomes').insert([formItem]).select();

        if (error) { console.error("Error saving income:", error); alert(`Error: ${error.message}`); }
        else { await fetchData(); }
        closeModal();
    });
    openModal();
}

export function showExpenseModal(expenseId, prefillData = null) {
    const isEditMode = expenseId !== undefined;
    const expenseToEdit = isEditMode && Array.isArray(state.appState.expenses) ? state.appState.expenses.find(e => e.id === expenseId) : null;
    s.modalTitle.textContent = isEditMode ? 'Edit Expense' : 'Add New Expense';

    // --- Account Options ---
    const bankAccounts = state.appState.accounts.filter(acc => acc.type === 'checking' || acc.type === 'savings');
    const creditCards = state.appState.accounts.filter(acc => acc.type === 'credit_card');
    
    // ⭐️ NEW: Liability Accounts for "Pay To" ⭐️
    const liabilityAccounts = state.appState.accounts.filter(acc => acc.type === 'loan' || acc.type === 'credit_card');

    let payFromOptions = '<option value="">-- None --</option>';
    if (bankAccounts.length > 0) payFromOptions += '<optgroup label="Bank Accounts">' + bankAccounts.map(acc => `<option value="${acc.id}">${acc.name}</option>`).join('') + '</optgroup>';
    if (creditCards.length > 0) payFromOptions += '<optgroup label="Credit Cards">' + creditCards.map(acc => `<option value="${acc.id}">${acc.name}</option>`).join('') + '</optgroup>';

    // ⭐️ NEW: "Pay To" Options ⭐️
    let payToOptions = '<option value="">-- None (Pure Expense) --</option>';
    if (liabilityAccounts.length > 0) {
        payToOptions += liabilityAccounts.map(acc => `<option value="${acc.id}">${acc.name}</option>`).join('');
    }

    s.modalBody.innerHTML = `
        <div class="form-group">
            <label for="modal-expense-category">Category:</label>
            <select id="modal-expense-category" required>
                <option value="">-- Select a Category --</option>
                <option value="Housing">Housing</option>
                <option value="Groceries">Groceries</option>
                <option value="Utilities">Utilities</option>
                <option value="Transport">Transport</option>
                <option value="Health">Health</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Savings/Debt">Savings/Debt</option>
                <option value="Other">Other</option>
            </select>
        </div>
        <div id="sub-type-container" class="form-group" style="display: none;">
            <label for="modal-expense-sub-type">Sub-Type:</label>
            <select id="modal-expense-sub-type"></select>
        </div>
        <div class="form-group">
            <label for="modal-expense-name">Description / Name:</label>
            <input type="text" id="modal-expense-name" placeholder="e.g., Electric Bill or Mortgage Payment" required>
        </div>
        <div class="form-group">
            <label for="modal-expense-interval">Payment Interval:</label>
            <select id="modal-expense-interval" required>
                <option value="monthly">Monthly</option>
                <option value="bi-annual">Bi-annual</option>
                <option value="annually">Annually</option>
                <option value="quarterly">Quarterly</option>
                <option value="bi-weekly">Bi-Weekly</option>
                <option value="weekly">Weekly</option>
                <option value="one-time">One-time</option>
            </select>
        </div>
        <div class="form-group">
            <label for="modal-expense-amount">Typical Payment ($):</label>
            <input type="number" id="modal-expense-amount" placeholder="e.g., 100" min="0" step="0.01" required>
        </div>
        <div class="form-group">
            <label for="modal-expense-date">Payment Start Date:</label>
            <input type="date" id="modal-expense-date" required>
        </div>
        <div class="form-group">
            <label for="modal-expense-end-date">End Date (Optional):</label>
            <input type="date" id="modal-expense-end-date">
        </div>

        <hr class="divider">
        
        <div class="form-group">
            <label for="modal-expense-payment-account">Pay From (Bank/CC):</label>
            <select id="modal-expense-payment-account">${payFromOptions}</select>
        </div>
        
        <div class="form-group">
            <label for="modal-expense-pay-to">Pay To Loan/Credit (Optional):</label>
            <select id="modal-expense-pay-to">${payToOptions}</select>
            <small style="color:var(--secondary-btn-bg); display:block; margin-top:4px; font-size:0.8rem;">
                Links this payment to a specific Loan or Credit Card to track payoff.
            </small>
        </div>
        
        <div id="advanced-loan-fields" style="display: none;">
            <hr class="divider">
            <h4>Legacy Loan Details (Optional)</h4>
             <div class="form-group"><label for="modal-loan-interest-rate">Interest Rate (%):</label><input type="number" id="modal-loan-interest-rate" placeholder="e.g., 6.5" min="0" step="0.001"></div>
             <div class="form-group"><label for="modal-loan-total-payments">Total Payments (Months):</label><input type="number" id="modal-loan-total-payments" placeholder="e.g., 360" min="1" step="1"></div>
             <div class="form-group"><label for="modal-loan-original-principal">Original Principal ($):</label><input type="number" id="modal-loan-original-principal" placeholder="e.g., 300000" min="0" step="0.01"></div>
        </div>

        <hr class="divider">
        <div class="form-group-checkbox">
            <input type="checkbox" id="modal-expense-magi-addback">
            <label for="modal-expense-magi-addback">Potential MAGI Add-Back?</label>
        </div>
        `;
    
    const categorySelect = document.getElementById('modal-expense-category');
    const subTypeContainer = document.getElementById('sub-type-container');
    const subTypeSelect = document.getElementById('modal-expense-sub-type');
    const advancedLoanFields = document.getElementById('advanced-loan-fields');
    const magiAddBackCheckbox = document.getElementById('modal-expense-magi-addback');

    const housingSubTypes = `<option value="">-- Select Sub-Type --</option><option value="Rent">Rent</option><option value="Mortgage/Loan">Mortgage/Loan</option><option value="HOA">HOA Dues</option><option value="Other">Other Housing</option>`;
    const transportSubTypes = `<option value="">-- Select Sub-Type --</option><option value="Car Loan">Car Loan</option><option value="Fuel">Fuel</option><option value="Insurance">Insurance</option><option value="Maintenance">Maintenance</option><option value="Other">Other Transport</option>`;

    function toggleAdvancedFields() {
        const category = categorySelect.value;
        const subType = subTypeSelect.value;
        
        if (category === 'Housing') {
            subTypeContainer.style.display = 'grid';
            if (subTypeSelect.innerHTML !== housingSubTypes) subTypeSelect.innerHTML = housingSubTypes;
        } else if (category === 'Transport') {
            subTypeContainer.style.display = 'grid';
            if (subTypeSelect.innerHTML !== transportSubTypes) subTypeSelect.innerHTML = transportSubTypes;
        } else {
            subTypeContainer.style.display = 'none';
        }
        
        // Hide Legacy Loan Fields if we are linking to a real account (preferred)
        const isLegacyLoan = (subType === 'Mortgage/Loan' || subType === 'Car Loan');
        advancedLoanFields.style.display = isLegacyLoan ? 'block' : 'none';
        
        if (category !== 'Housing' && category !== 'Transport') subTypeSelect.value = '';
    }

    categorySelect.addEventListener('change', toggleAdvancedFields);
    subTypeSelect.addEventListener('change', toggleAdvancedFields);

    if (isEditMode && expenseToEdit) {
        categorySelect.value = expenseToEdit.category || '';
        toggleAdvancedFields(); // Init sub-types
        
        document.getElementById('modal-expense-name').value = expenseToEdit.name || '';
        document.getElementById('modal-expense-interval').value = expenseToEdit.interval || 'monthly';
        document.getElementById('modal-expense-amount').value = expenseToEdit.amount || '';
        document.getElementById('modal-expense-date').value = expenseToEdit.start_date || '';
        document.getElementById('modal-expense-end-date').value = expenseToEdit.end_date || '';
        document.getElementById('modal-expense-payment-account').value = expenseToEdit.payment_account_id || '';

        if (expenseToEdit.advanced_data) {
             const advData = expenseToEdit.advanced_data;
             if (advData.item_type) subTypeSelect.value = advData.item_type;
             
             // ⭐️ Populate Pay To Link ⭐️
             if (advData.linked_loan_id) {
                 document.getElementById('modal-expense-pay-to').value = advData.linked_loan_id;
             }
             
             // Populate Legacy fields
             if (advData.interest_rate) document.getElementById('modal-loan-interest-rate').value = (advData.interest_rate * 100).toFixed(3);
             if (advData.total_payments) document.getElementById('modal-loan-total-payments').value = advData.total_payments;
             if (advData.original_principal) document.getElementById('modal-loan-original-principal').value = advData.original_principal;
             
             magiAddBackCheckbox.checked = !!advData.is_magi_addback;
        }
        toggleAdvancedFields(); 
    } else if (prefillData) {
        document.getElementById('modal-expense-date').value = prefillData.startDate;
        if (prefillData.interval) document.getElementById('modal-expense-interval').value = prefillData.interval;
        toggleAdvancedFields();
    } else {
        document.getElementById('modal-expense-date').value = new Date().toISOString().split('T')[0];
        toggleAdvancedFields();
    }

    state.setOnSave(async () => {
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) return;
        
        const category = categorySelect.value;
        const subType = subTypeSelect.value;
        const payToId = document.getElementById('modal-expense-pay-to').value; // ⭐️ Capture Pay To

        let advancedData = {};
        if (subType) advancedData.item_type = subType;
        
        // ⭐️ Save Pay To Link ⭐️
        if (payToId) {
            advancedData.linked_loan_id = parseInt(payToId);
        }

        const rateInput = document.getElementById('modal-loan-interest-rate').value;
        const paymentsInput = document.getElementById('modal-loan-total-payments').value;
        const principalInput = document.getElementById('modal-loan-original-principal').value;
        if (rateInput) advancedData.interest_rate = parseFloat(rateInput) / 100.0;
        if (paymentsInput) advancedData.total_payments = parseInt(paymentsInput);
        if (principalInput) advancedData.original_principal = parseFloat(principalInput);

        if (magiAddBackCheckbox.checked) advancedData.is_magi_addback = true;

        const formItem = {
            user_id: user.id,
            category: category,
            name: document.getElementById('modal-expense-name').value.trim(),
            interval: document.getElementById('modal-expense-interval').value,
            amount: parseFloat(document.getElementById('modal-expense-amount').value),
            start_date: document.getElementById('modal-expense-date').value || null,
            end_date: document.getElementById('modal-expense-end-date').value || null,
            payment_account_id: parseInt(document.getElementById('modal-expense-payment-account').value) || null,
            advanced_data: advancedData
        };

        if (!formItem.category || !formItem.name || isNaN(formItem.amount) || !formItem.start_date) {
             alert("Please fill out required fields."); return;
        }
        
        let { error } = isEditMode
            ? await supabaseClient.from('expenses').update(formItem).eq('id', expenseId)
            : await supabaseClient.from('expenses').insert([formItem]).select();
        
        if (error) { console.error("Error saving expense:", error); alert(`Error: ${error.message}`); }
        else { await fetchData(); }
        closeModal();
    });
    openModal();
}

export function showAccountModal(accountId, allowedTypes = null) {
    const isEditMode = accountId !== undefined;
    const accountToEdit = isEditMode && Array.isArray(state.appState.accounts) ? state.appState.accounts.find(a => a.id === accountId) : null;
    s.modalTitle.textContent = isEditMode ? 'Edit Account' : 'Add New Account';

    // ... (CC Fields Logic - Keep existing HTML string for ccFieldsHTML) ... 
    const ccFieldsHTML = `
        <div id="advanced-cc-fields" class="form-group-stack" style="display: none;">
             <hr class="divider">
             <h4>Liability Details (Optional)</h4>
             <div class="form-group"><label for="modal-cc-limit">Credit Limit / Orig. Principal ($):</label><input type="number" id="modal-cc-limit" placeholder="e.g., 10000" min="0" step="0.01"></div>
             <div class="form-group"><label for="modal-cc-statement-day">Due Day / Statement Day:</label><input type="number" id="modal-cc-statement-day" placeholder="(1-31) e.g., 20" min="1" max="31" step="1"></div>
             <div class="form-group"><label for="modal-cc-interest-rate">Interest Rate (APR %):</label><input type="number" id="modal-cc-interest-rate" placeholder="e.g., 21.99" min="0" step="0.01"></div>
        </div>
    `;

    const allTypes = {
        checking: 'Checking',
        savings: 'Savings',
        investment: 'Investment',
        credit_card: 'Credit Card',
        loan: 'Loan (Mortgage, Car, etc.)'
    };

    const typesToShow = allowedTypes ? allowedTypes : Object.keys(allTypes);
    
    let typeOptions = '<option value="">-- Select Type --</option>';
    typesToShow.forEach(key => {
        if (allTypes[key]) typeOptions += `<option value="${key}">${allTypes[key]}</option>`;
    });

    // ⭐️ ADDED: Checkbox for Dashboard Visibility
    s.modalBody.innerHTML = `
        <div class="form-group"><label for="modal-account-name">Account Name:</label><input type="text" id="modal-account-name" placeholder="e.g., Chase Checking" required></div>
        <div class="form-group"><label for="modal-account-type">Account Type:</label><select id="modal-account-type" required>${typeOptions}</select></div>
        <div class="form-group">
            <label for="modal-account-balance">Current Balance ($):</label>
            <input type="number" id="modal-account-balance" placeholder="1000" step="0.01" required>
            <small style="color:var(--secondary-btn-bg); display:block; margin-top:4px;">(Enter debts as negative numbers, e.g. -250000)</small>
        </div>
        
        <div id="growth-rate-group" class="form-group" style="display: none;">
            <label for="modal-account-growth">Est. Annual Growth (%):</label>
            <input type="number" id="modal-account-growth" placeholder="5" min="0" step="0.01">
        </div>

        <div id="dashboard-visibility-group" class="form-group-checkbox" style="margin-top:10px;">
            <input type="checkbox" id="modal-account-dashboard">
            <label for="modal-account-dashboard">Show in Dashboard "Liquid Cash"</label>
        </div>

        ${ccFieldsHTML} 
    `;

    const typeSelect = document.getElementById('modal-account-type');
    const growthGroup = document.getElementById('growth-rate-group');
    const ccFields = document.getElementById('advanced-cc-fields');
    const dashboardCheck = document.getElementById('modal-account-dashboard');
    const dashGroup = document.getElementById('dashboard-visibility-group');

    typeSelect.addEventListener('change', () => {
        const type = typeSelect.value;
        growthGroup.style.display = type === 'investment' ? 'grid' : 'none';
        ccFields.style.display = (type === 'credit_card' || type === 'loan') ? 'block' : 'none';
        
        // Only show "Liquid Cash" option for asset accounts, not loans
        if (['checking', 'savings', 'investment'].includes(type)) {
            dashGroup.style.display = 'grid';
        } else {
            dashGroup.style.display = 'none';
            dashboardCheck.checked = false; 
        }
    });

    if (isEditMode && accountToEdit) {
        document.getElementById('modal-account-name').value = accountToEdit.name || '';
        
        if (!typesToShow.includes(accountToEdit.type)) {
            const tempOption = document.createElement('option');
            tempOption.value = accountToEdit.type;
            tempOption.text = allTypes[accountToEdit.type] || accountToEdit.type;
            typeSelect.add(tempOption);
        }
        
        typeSelect.value = accountToEdit.type || '';
        document.getElementById('modal-account-balance').value = accountToEdit.current_balance || '';
        
        // ⭐️ LOAD CHECKBOX STATE
        if (accountToEdit.advanced_data && accountToEdit.advanced_data.show_on_dashboard) {
            dashboardCheck.checked = true;
        }

        if (accountToEdit.type === 'investment') {
            document.getElementById('modal-account-growth').value = accountToEdit.growth_rate ? (accountToEdit.growth_rate * 100).toFixed(2) : '';
            growthGroup.style.display = 'grid';
        }
        if ((accountToEdit.type === 'credit_card' || accountToEdit.type === 'loan') && accountToEdit.advanced_data) {
             const advData = accountToEdit.advanced_data;
             document.getElementById('modal-cc-limit').value = advData.credit_limit || '';
             document.getElementById('modal-cc-statement-day').value = advData.statement_day || '';
             document.getElementById('modal-cc-interest-rate').value = advData.interest_rate ? (advData.interest_rate * 100).toFixed(2) : '';
             ccFields.style.display = 'block';
        }
        // Trigger visibility logic
        typeSelect.dispatchEvent(new Event('change'));
    } else {
         growthGroup.style.display = 'none';
         ccFields.style.display = 'none';
         dashGroup.style.display = 'none'; // Hidden until type selected
    }

    state.setOnSave(async () => {
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) return;

        const type = typeSelect.value;
        let advancedData = accountToEdit?.advanced_data || {};
        
        // ⭐️ SAVE CHECKBOX STATE
        advancedData.item_type = type; // Ensure type is stored
        if (dashboardCheck.checked) {
            advancedData.show_on_dashboard = true;
        } else {
            // Remove the key if unchecked so we don't store junk
            delete advancedData.show_on_dashboard;
        }

        if (type === 'credit_card' || type === 'loan') {
            const limitInput = document.getElementById('modal-cc-limit').value;
            const statementDayInput = document.getElementById('modal-cc-statement-day').value;
            const rateInput = document.getElementById('modal-cc-interest-rate').value;
            if (limitInput) advancedData.credit_limit = parseFloat(limitInput);
            if (statementDayInput) advancedData.statement_day = parseInt(statementDayInput);
            if (rateInput) advancedData.interest_rate = parseFloat(rateInput) / 100.0;
        }

        const formItem = {
            user_id: user.id,
            name: document.getElementById('modal-account-name').value.trim(),
            type: type,
            current_balance: parseFloat(document.getElementById('modal-account-balance').value),
            growth_rate: (type === 'investment') ? parseFloat(document.getElementById('modal-account-growth').value || 0) / 100.0 : null,
            advanced_data: advancedData 
        };

        let { error } = isEditMode
            ? await supabaseClient.from('accounts').update(formItem).eq('id', accountId)
            : await supabaseClient.from('accounts').insert([formItem]).select();

        if (error) { console.error("Error saving account:", error); alert(`Error: ${error.message}`); }
        else { await fetchData(); }
        closeModal();
    });
    openModal();
}

export function showTransferModal(transferId) {
    const isEditMode = transferId !== undefined;
    const transferToEdit = isEditMode && Array.isArray(state.appState.transfers) ? state.appState.transfers.find(t => t.id === transferId) : null;
    s.modalTitle.textContent = isEditMode ? 'Edit Transfer' : 'Add New Transfer';

    let accountOptions = '<option value="">-- Select Account --</option>';
    if (state.appState.accounts.length > 0) {
        accountOptions += state.appState.accounts.map(acc => `<option value="${acc.id}">${acc.name}</option>`).join('');
    } else {
        accountOptions = '<option value="" disabled>-- No accounts defined --</option>';
    }

    s.modalBody.innerHTML = `
         <div class="form-group">
            <label for="modal-transfer-desc">Description (Optional):</label>
            <input type="text" id="modal-transfer-desc" placeholder="e.g., Monthly Savings">
        </div>
        <div class="form-group">
            <label for="modal-transfer-from">From Account:</label>
            <select id="modal-transfer-from" required>${accountOptions}</select>
        </div>
        <div class="form-group">
            <label for="modal-transfer-to">To Account:</label>
            <select id="modal-transfer-to" required>${accountOptions}</select>
        </div>
        <div class="form-group">
            <label for="modal-transfer-amount">Amount ($):</label>
            <input type="number" id="modal-transfer-amount" placeholder="100" min="0.01" step="0.01" required>
        </div>
         <div class="form-group">
            <label for="modal-transfer-interval">Interval:</label>
            <select id="modal-transfer-interval" required>
                <option value="monthly">Monthly</option>
                <option value="bi-annual">Bi-annual</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
                <option value="one-time">One-time</option>
                </select>
        </div>
        <div class="form-group">
            <label for="modal-transfer-date">Start/Transfer Date:</label>
            <input type="date" id="modal-transfer-date" required>
        </div>
    `;

    if (isEditMode && transferToEdit) {
        document.getElementById('modal-transfer-desc').value = transferToEdit.description || '';
        document.getElementById('modal-transfer-from').value = transferToEdit.from_account_id || '';
        document.getElementById('modal-transfer-to').value = transferToEdit.to_account_id || '';
        document.getElementById('modal-transfer-amount').value = transferToEdit.amount || '';
        document.getElementById('modal-transfer-interval').value = transferToEdit.interval || 'monthly';
        document.getElementById('modal-transfer-date').value = transferToEdit.start_date || '';
    } else if (!isEditMode) {
         document.getElementById('modal-transfer-date').value = new Date().toISOString().split('T')[0];
    }

    state.setOnSave(async () => {
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) { return; }

        const fromAccountId = parseInt(document.getElementById('modal-transfer-from').value);
        const toAccountId = parseInt(document.getElementById('modal-transfer-to').value);
        const amount = parseFloat(document.getElementById('modal-transfer-amount').value);
        const startDate = document.getElementById('modal-transfer-date').value;
        const interval = document.getElementById('modal-transfer-interval').value;

        if (!fromAccountId || !toAccountId) {
             alert("Please select both From and To accounts."); return;
        }
        if (fromAccountId === toAccountId) {
            alert("From and To accounts cannot be the same."); return;
        }
        if (isNaN(amount) || amount <= 0) {
             alert("Please enter a valid positive amount."); return;
        }
        if (!startDate || !interval) {
             alert("Please select an interval and start/transfer date."); return;
        }

        const formItem = {
            user_id: user.id,
            description: document.getElementById('modal-transfer-desc').value.trim() || null,
            from_account_id: fromAccountId,
            to_account_id: toAccountId,
            amount: amount,
            interval: interval,
            start_date: startDate,
        };

        let { error } = isEditMode
            ? await supabaseClient.from('transfers').update(formItem).eq('id', transferId)
            : await supabaseClient.from('transfers').insert([formItem]).select();

        if (error) { console.error("Error saving transfer:", error); alert(`Error: ${error.message}`); }
        else { await fetchData(); }
        closeModal();
    });
    openModal();
}

export function showAmortizationModal(expenseId) {
    const expenseItem = state.appState.expenses.find(e => e.id === expenseId);
    if (!expenseItem) return;

    const isLegacy = expenseItem.advanced_data && (expenseItem.advanced_data.item_type === 'Mortgage/Loan' || expenseItem.advanced_data.item_type === 'Car Loan');
    const isLinked = expenseItem.advanced_data && expenseItem.advanced_data.linked_loan_id;

    if (!isLegacy && !isLinked) {
        showNotification("No loan data found for this item.", "error");
        return;
    }
    
    // If linked, use the ACCOUNT amortization
    if (isLinked) {
        const account = state.appState.accounts.find(a => a.id === expenseItem.advanced_data.linked_loan_id);
        if (account) {
            const dynamicAmortization = getLoanAmortization(account);
            renderAmortizationTable(dynamicAmortization, `Amortization: ${account.name} (Linked)`);
            return;
        }
    }

    // Legacy Fallback
    const dynamicAmortization = getDynamicAmortization(expenseItem); 
    renderAmortizationTable(dynamicAmortization, `Amortization: ${expenseItem.name}`);
}

// Helper (make sure this is in the file too)
function renderAmortizationTable(data, title) {
    if (!data || !data.schedule || data.schedule.length === 0) {
        showNotification("Could not calculate schedule.", "error");
        return;
    }
    s.modalTitle.textContent = title;
    const schedule = data.schedule;
    
    let tableHTML = `
        <div class="amortization-table-container">
            <table class="amortization-table">
                <thead><tr><th>Month</th><th>Payment</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead>
            <tbody>`;
    schedule.forEach(row => {
        tableHTML += `
            <tr>
                <td>${row.month}</td>
                <td>${formatCurrency(row.payment)}</td>
                <td>${formatCurrency(row.principalPayment)}</td>
                <td>${formatCurrency(row.interestPayment)}</td>
                <td>${formatCurrency(row.remainingBalance)}</td>
            </tr>`;
    });
    tableHTML += `</tbody></table></div>`;
    s.modalBody.innerHTML = tableHTML;
    s.appModal.classList.add('modal--read-only');
    openModal();
}

export function showReconcileModal(accountId) {
    const account = state.appState.accounts.find(a => a.id === accountId);
    if (!account) {
        showNotification("Could not find the account to reconcile.", "error");
        return;
    }

    
    s.modalTitle.textContent = `Reconcile: ${account.name}`;
    s.modalBody.innerHTML = `
        <p>Enter the actual current balance from your bank or institution to update the balance in this app.</p>
        <div class="form-group">
            <label>Current Balance (in App):</label>
            <input type="text" id="modal-reconcile-old" value="${formatCurrency(account.current_balance)}" readonly>
        </div>
        <div class="form-group">
            <label for="modal-reconcile-new">Actual Balance (from Bank):</label>
            <input type="number" id="modal-reconcile-new" placeholder="e.g., 5280.50" step="0.01" required>
        </div>
        <div class="form-group">
            <label>Adjustment:</label>
            <input type="text" id="modal-reconcile-adjustment" value="$0.00" readonly>
        </div>
    `;

    const newBalanceInput = document.getElementById('modal-reconcile-new');
    const adjustmentInput = document.getElementById('modal-reconcile-adjustment');

    // Add listener to auto-calculate the adjustment
    newBalanceInput.addEventListener('input', () => {
        const newBalance = parseFloat(newBalanceInput.value) || 0;
        const adjustment = newBalance - account.current_balance;
        adjustmentInput.value = formatCurrency(adjustment);
    });

    // Set the save function
    state.setOnSave(async () => {
        const newBalanceString = newBalanceInput.value;
        if (!newBalanceString) {
            alert("Please enter the actual balance.");
            return;
        }

        const newBalance = parseFloat(newBalanceString);
        if (isNaN(newBalance)) {
            alert("Please enter a valid number for the balance.");
            return;
        }
        
        const oldBalance = account.current_balance;
        const adjustment = newBalance - oldBalance;
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) {
            showNotification("You must be logged in.", "error");
            return;
        }


        try {
            // --- Step 1: Update the account balance ---
            const { error: updateError } = await supabaseClient
                .from('accounts')
                .update({ current_balance: newBalance })
                .eq('id', accountId);

            if (updateError) throw updateError;

            // --- Step 2: Log the reconciliation ---
            const { error: logError } = await supabaseClient
                .from('reconciliation_log')
                .insert({
                    account_id: accountId,
                    old_balance: oldBalance,
                    new_balance: newBalance,
                    adjustment: adjustment,
                    user_id: user.id // ⭐️ ADDED THIS LINE ⭐️
                });
            
            if (logError) throw logError;

            // --- Step 3: Success ---
            showNotification("Account reconciled successfully!", "success");
            closeModal();
            await fetchData(); // Refresh all data

        } catch (error) {
            console.error("Error during reconciliation:", error);
            showNotification(`Error: ${error.message}`, "error");
        }
    });

    openModal();
}

// --- List & Chart Rendering Functions ---

// In ui.js

export function renderList(items, listElement) {
    listElement.innerHTML = '';
    const listType = listElement.id.includes('income') ? 'income' : 'expense';
    let renderItems = [...items];
    
    // Filter if mode is NOT 'all'
    if (state.listDisplayMode[listType] !== 'all') {
        const utcMonth = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), 1));
        renderItems = items.filter(i => getOccurrencesInMonth(i, utcMonth).length > 0);
    }
    
    if (renderItems.length === 0) { listElement.innerHTML = `<li>No items found.</li>`; return; }

    // ⭐️ SORT A-Z BY NAME ⭐️
    renderItems.sort((a, b) => a.name.localeCompare(b.name));

    renderItems.forEach(item => {
        let badge = '';
        if (item.advanced_data?.linked_loan_id) {
            const acc = state.appState.accounts.find(a => a.id === item.advanced_data.linked_loan_id);
            if (acc) badge = `<span style="font-size:0.8rem; background:#e0e6ed; padding:2px 6px; border-radius:4px; margin-left:5px;">→ ${acc.name}</span>`;
        }
        
        let schedBtn = '';
        if (item.advanced_data?.item_type === 'Mortgage/Loan' || item.advanced_data?.linked_loan_id) {
            schedBtn = `<button class="schedule-btn btn-secondary" data-id="${item.id}">Schedule</button>`;
        }

        const li = document.createElement('li');
        li.innerHTML = `
            <div class="item-details"><strong>${item.name}</strong>${badge}<br><span>${formatCurrency(item.amount)} / ${item.interval}</span></div>
            <div class="item-controls">${schedBtn}<button class="edit-btn" data-id="${item.id}">Edit</button><button class="delete-btn" data-id="${item.id}">X</button></div>`;
        listElement.appendChild(li);
    });
}

export function renderExpenseChart(isExpandedView = false) {
    const canvasElement = isExpandedView ? s.expandedExpenseChartCanvas : s.expenseChartCanvas;
    const containerElement = isExpandedView ? s.expandedChartContainer : s.summaryChartContainer;
    
    // ⭐️ NEW ⭐️: Get the new details list container
    const detailsElement = s.expandedChartContainer.querySelector('#expanded-expense-details');

    if (!canvasElement || !containerElement || (isExpandedView && !detailsElement)) {
         console.warn(`Chart/container elements not found for ${isExpandedView ? 'expanded' : 'summary'} view.`);
         return;
    }

    const dashboardIsExpanded = s.mainContainer.classList.contains('dashboard-expanded');
    if (!dashboardIsExpanded && isExpandedView) return;
    if (dashboardIsExpanded && !isExpandedView) return;

    // === ⭐️ 1. Get State & Date ⭐️ ===
    const creditCardAccountIds = new Set(state.appState.accounts.filter(acc => acc.type === 'credit_card').map(acc => acc.id));
    const currentDate = new Date();
    const currentMonthDateUTC = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), 1));
    
    // === ⭐️ 2. Check if we are in "Details List" mode ⭐️ ===
    if (isExpandedView && state.expenseChartDetailCategory !== null) {
        // --- RENDER DETAILS LIST ---
        
        // Hide canvas, show details list
        canvasElement.style.display = 'none';
        detailsElement.style.display = 'block';

        // 1. Get the correct list of expenses
        let expensePool;
        if (state.expenseChartDrillDown) {
            // We are drilled into CCs, so get CC charges
            expensePool = state.appState.expenses.filter(exp => creditCardAccountIds.has(exp.payment_account_id));
        } else {
            // We are on cash flow, so get non-CC expenses
            expensePool = state.appState.expenses.filter(exp => !creditCardAccountIds.has(exp.payment_account_id));
        }

        // 2. Filter that list by the chosen category
        const categoryExpenses = expensePool.filter(exp => exp.category === state.expenseChartDetailCategory);

        // 3. Find all occurrences in the current month
        let listHTML = '';
        let total = 0;
        const allOccurrences = [];

        categoryExpenses.forEach(item => {
            const occurrences = getOccurrencesInMonth(item, currentMonthDateUTC);
            occurrences.forEach(date => {
                allOccurrences.push({ item, date });
                total += item.amount; // Note: We use base amount for this list
            });
        });
        
        allOccurrences.sort((a, b) => a.date.getUTCDate() - b.date.getUTCDate());

        // 4. Build HTML
        if (allOccurrences.length > 0) {
            allOccurrences.forEach(({ item, date }) => {
                listHTML += `
                    <li class="expense-details-entry">
                        <div>
                            <span class="expense-details-name">${item.name}</span><br>
                            <span class="expense-details-date">
                                ${date.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' })}
                                (${item.interval})
                            </span>
                        </div>
                        <span class="expense-details-amount">${formatCurrency(item.amount)}</span>
                    </li>
                `;
            });
        } else {
            listHTML = '<li>No specific charges found for this category this month.</li>';
        }

        detailsElement.innerHTML = `
            <button id="expense-details-back-btn" class="btn-secondary">← Back to Chart</button>
            <h3>${state.expenseChartDetailCategory}</h3>
            <p>Total: ${formatCurrency(total)}</p>
            <ul id="expense-details-list">
                ${listHTML}
            </ul>
        `;

        // 5. Add listener for the new "Back" button
        detailsElement.querySelector('#expense-details-back-btn').addEventListener('click', () => {
            state.setExpenseChartDetailCategory(null); // Go back to chart
            renderExpenseChart(isExpandedView); // Re-render
        });
        
        return; // Stop here, we are done
    }

    // === ⭐️ 3. RENDER PIE CHART ⭐️ ===
    // If we got here, it means we are rendering a pie chart.
    
    // Hide details list, show canvas
    if (isExpandedView) {
        canvasElement.style.display = 'block';
        detailsElement.style.display = 'none';
    }
    
    let chartTitle = '';
    let chartDataExpenses;
    let clickHandler;

    if (state.expenseChartDrillDown) {
        // --- Drilled-In View: Credit Card Spending ---
        chartTitle = 'Credit Card Spending (Current Month) (Click slice for details, empty space to go back)';
        chartDataExpenses = state.appState.expenses.filter(exp => 
            creditCardAccountIds.has(exp.payment_account_id)
        );
        
        clickHandler = (event, elements) => {
            if (elements && elements.length > 0) {
                // Clicked a slice - go to details list
                const label = elements[0].element.$context.chart.data.labels[elements[0].index];
                state.setExpenseChartDetailCategory(label);
            } else {
                // Clicked empty space - go back
                state.setExpenseChartDrillDown(false);
            }
            renderExpenseChart(true); // Re-render
        };

    } else {
        // --- Top-Level View: Cash Flow ---
        chartTitle = 'Monthly Expenses (Cash Flow - Current Month) (Click slice for details)';
        chartDataExpenses = state.appState.expenses.filter(exp => 
            !creditCardAccountIds.has(exp.payment_account_id)
        );
        
        clickHandler = (event, elements) => {
            if (elements && elements.length > 0) {
                const label = elements[0].element.$context.chart.data.labels[elements[0].index];
                
                if (label === 'Credit Card') {
                    // Clicked "Credit Card" - drill down
                    state.setExpenseChartDrillDown(true);
                } else {
                    // Clicked any other slice - go to details
                    state.setExpenseChartDetailCategory(label);
                }
                renderExpenseChart(true); // Re-render
            }
        };
    }

    // === ⭐️ 4. Calculate Totals (Same as before) ⭐️ ===
    const categoryTotals = {};
    if (chartDataExpenses && Array.isArray(chartDataExpenses)) {
        chartDataExpenses.forEach(expense => {
            if (!expense || typeof expense.amount !== 'number' || typeof expense.category !== 'string') {
                console.warn("Skipping invalid expense item for chart:", expense);
                return;
            }
            const occurrences = getOccurrencesInMonth(expense, currentMonthDateUTC);
            
            if (occurrences.length > 0) {
                if (!categoryTotals[expense.category]) {
                    categoryTotals[expense.category] = 0;
                }
                occurrences.forEach(occ => {
                    categoryTotals[expense.category] += expense.amount;
                });
            }
        });
    }
    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    // === ⭐️ 5. Destroy & Re-create Chart (Same as before) ⭐️ ===
    if (state.expenseChartInstance && state.expenseChartInstance.canvas === canvasElement) {
        state.expenseChartInstance.destroy();
        state.setExpenseChartInstance(null);
    } else if (state.expenseChartInstance && state.expenseChartInstance.canvas !== canvasElement) {
         state.expenseChartInstance.destroy();
         state.setExpenseChartInstance(null);
    }

    const ctx = canvasElement.getContext('2d');
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    if (labels.length === 0) {
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '16px Arial';
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-color') || '#333';
        ctx.fillText('No data to display for this month', canvasElement.width / 2, canvasElement.height / 2);
        ctx.restore();
        return;
    }

    try {
         const newChart = new Chart(ctx, {
              type: 'pie',
              data: {
                   labels: labels,
                   datasets: [{
                        label: 'Expenses by Category',
                        data: data,
                        backgroundColor: ['#3498db', '#e74c3c', '#9b59b6', '#f1c40f', '#2ecc71', '#1abc9c', '#e67e22', '#95a5a6'],
                        hoverOffset: 4
                   }]
              },
              options: {
                   responsive: true,
                   maintainAspectRatio: false,
                   onClick: clickHandler,
                   plugins: {
                        title: {
                            display: true,
                            text: chartTitle,
                            font: {
                                size: 16
                            },
                            padding: {
                                top: 10,
                                bottom: 10
                            }
                        },
                        legend: {
                             position: 'top',
                        },
                        tooltip: {
                             callbacks: {
                                  label: function(context) {
                                       let label = context.label || '';
                                       if (label) { label += ': '; }
                                       if (context.parsed !== null) {
                                            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed);
                                       }
                                       return label;
                                  }
                             }
                        }
                   }
              }
         });
         state.setExpenseChartInstance(newChart);
    } catch (error) {
         console.error("Error creating Chart.js instance:", error);
    }
}

export function renderBankingSection() {
    renderAccountsList();
    renderTransfersList();
}

// === ⭐️ Updated renderAccountsList to split Loans, Credit Cards, and Banking ===
export function renderAccountsList() {
    // Clear all lists
    s.accountList.innerHTML = ''; 
    s.ccList.innerHTML = ''; 
    if (s.loanList) s.loanList.innerHTML = ''; 

    if (!state.appState.accounts || state.appState.accounts.length === 0) {
        s.accountList.innerHTML = `<li>No accounts added yet.</li>`;
        return;
    }

    // Group them
    const groupedAccounts = { checking: [], savings: [], investment: [], credit_card: [], loan: [] };
    state.appState.accounts.forEach(acc => {
        if (groupedAccounts[acc.type]) {
            groupedAccounts[acc.type].push(acc);
        }
    });

    // Helper
    const renderGroup = (group, listElement) => {
        if (!group || !listElement) return;
        group.sort((a, b) => a.name.localeCompare(b.name));
        group.forEach(acc => {
            const li = document.createElement('li');
            const isNegative = acc.current_balance < 0;
            const balanceClass = isNegative ? 'expense-total' : '';
            let details = '';
            if ((acc.type === 'credit_card' || acc.type === 'loan') && acc.advanced_data) {
                if (acc.advanced_data.interest_rate) details += `${(acc.advanced_data.interest_rate * 100).toFixed(2)}% APR`;
            }
            li.innerHTML = `
                <div class="item-details">
                    <strong>${acc.name}</strong> <span style="font-size:0.85rem; color:#666;">${details}</span><br>
                    <span class="${balanceClass}">Balance: ${formatCurrency(acc.current_balance)}</span>
                </div>
                <div class="item-controls">
                    <button class="reconcile-btn btn-secondary" data-id="${acc.id}" data-type="account">Reconcile</button>
                    <button class="edit-btn" data-id="${acc.id}" data-type="account">Edit</button>
                    <button class="delete-btn" data-id="${acc.id}" data-type="account">X</button>
                </div>`;
            listElement.appendChild(li);
        });
    };

    renderGroup(groupedAccounts.checking, s.accountList);
    renderGroup(groupedAccounts.savings, s.accountList);
    renderGroup(groupedAccounts.investment, s.accountList);
    renderGroup(groupedAccounts.credit_card, s.ccList);
    if (s.loanList) renderGroup(groupedAccounts.loan, s.loanList);
}

export function renderTransfersList() {
    s.transferList.innerHTML = '';
    
    let itemsToRender = [];
    const isAllView = state.listDisplayMode.transfer === 'all';

    if (isAllView) {
        // --- "All" View Logic ---
        itemsToRender = [...state.appState.transfers]; // Use ALL transfers
    } else {
        // --- "Current" View Logic (existing logic) ---
        const allRecurringTransfers = state.appState.transfers.filter(t => t.interval !== 'one-time');
        const currentDate = new Date();
        const currentMonthDateUTC = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), 1));

        itemsToRender = allRecurringTransfers.filter(item => {
            return getOccurrencesInMonth(item, currentMonthDateUTC).length > 0;
        });
    }

    if (itemsToRender.length === 0) {
        s.transferList.innerHTML = `<li>No transfers for this view.</li>`;
        return;
    }

    itemsToRender.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

    itemsToRender.forEach(transfer => {
        const fromAcc = state.appState.accounts.find(a => a.id === transfer.from_account_id);
        const toAcc = state.appState.accounts.find(a => a.id === transfer.to_account_id);
        const fromName = fromAcc ? fromAcc.name : 'Unknown';
        const toName = toAcc ? toAcc.name : 'Unknown';

        let dateText = '';
        if (isAllView) {
            // "All" view: Show start date
            if (transfer.start_date) {
                try {
                    const startDate = parseUTCDate(transfer.start_date);
                    dateText = ` (Starts: ${startDate.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric' })})`;
                } catch (e) {
                    dateText = ' (Invalid Date)';
                }
            }
        } else {
            // "Current" view: Show occurrences this month
            try {
                const currentDate = new Date();
                const currentMonthDateUTC = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), 1));
                const occurrences = getOccurrencesInMonth(transfer, currentMonthDateUTC);
                const days = occurrences.map(d => d.getUTCDate()).join(', ');
                dateText = ` (Day: ${days})`;
            } catch (e) { dateText = ' (Invalid Date)'; }
        }

        const li = document.createElement('li');
        li.innerHTML = `
            <div class="item-details">
                <strong>${transfer.description || 'Transfer'}</strong><br>
                <span>${formatCurrency(transfer.amount)} / ${transfer.interval}</span><br>
                <span class="transfer-details">From: ${fromName} -> To: ${toName}${dateText}</span>
            </div>
            <div class="item-controls">
                <button class="edit-btn" data-id="${transfer.id}" data-type="transfer">Edit</button>
                <button class="delete-btn" data-id="${transfer.id}" data-type="transfer">X</button>
            </div>`;
        s.transferList.appendChild(li);
    });
}

/**
 * Renders the list of edited transactions into the Edits Log section.
 */
export function renderEditsLog() {
    const logContent = s.gridYearlySummaryPanel.querySelector('#edits-log-content');
    if (!logContent) return;

    const editedTransactions = state.appState.transactions.filter(t => t.edited_amount !== null);

    if (editedTransactions.length === 0) {
        logContent.innerHTML = '<p>No edits found.</p>';
        return;
    }

    editedTransactions.sort((a, b) => new Date(a.occurrence_date) - new Date(b.occurrence_date));

    let logHTML = '<ul class="edits-log-list">';

    editedTransactions.forEach(edit => {
        let itemName = 'Unknown Item'; // Default

        if (edit.item_type === 'transfer') {
            itemName = 'Transfer'; // Use "Transfer" for all transfers
        } else {
            // Use existing logic for incomes and expenses
            const parentList = (edit.item_type === 'income') ? state.appState.incomes : state.appState.expenses;
            const parentItem = parentList.find(item => item.id === edit.item_id);
            if (parentItem) {
                itemName = parentItem.name;
            }
        }
        
        const date = parseUTCDate(edit.occurrence_date);
        const dateString = date ? date.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }) : 'Invalid Date';
        const year = date ? date.getUTCFullYear() : null;

        logHTML += `
            <li class="edits-log-entry">
                <span class="edit-item-name">${itemName}</span> - 
                <button class="btn-link edit-log-date" data-year="${year}">${dateString}</button>: 
                <span class="edit-amount">${formatCurrency(edit.edited_amount)}</span>
            </li>
        `;
    });

    logHTML += '</ul>';
    logContent.innerHTML = logHTML;
}

/** * Renders the reconciliation log into its container.
 */
export function renderReconciliationList() {
    if (!s.reconciliationViewContent) return;

    const logs = state.appState.reconciliation_log;
    
    if (!logs || logs.length === 0) {
        s.reconciliationViewContent.innerHTML = '<h3>Reconciliation Log</h3><p>No reconciliations found.</p>';
        return;
    }

    // Sort by date, newest first
    logs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    
    let logHTML = '<ul class="reconciliation-log-list">';

    logs.forEach(log => {
        const account = state.appState.accounts.find(a => a.id === log.account_id);
        const accountName = account ? account.name : 'Unknown Account';
        
        // Supabase gives a full timestamp, so we can use new Date()
        const date = new Date(log.created_at);
        const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        
        const adjAmount = log.adjustment || 0;
        const adjClass = adjAmount >= 0 ? 'recon-positive' : 'recon-negative';
        const adjSign = adjAmount >= 0 ? '+' : '';

        logHTML += `
            <li class="reconciliation-log-entry">
                <div>
                    <span class="recon-account-name">${accountName}</span><br>
                    <span class="recon-date">${dateString}</span>
                </div>
                <div class="recon-details">
                    <span class="recon-amount ${adjClass}">${adjSign}${formatCurrency(adjAmount)}</span>
                    <span class="recon-balance">New Balance: ${formatCurrency(log.new_balance)}</span>
                </div>
            </li>
        `;
    });

    logHTML += '</ul>';
    
    s.reconciliationViewContent.innerHTML = `
        <h3>Reconciliation Log</h3>
        <p>A history of all manual balance adjustments.</p>
        ${logHTML}
    `;
}

export function setupDashboardAccordion() {
    const headers = document.querySelectorAll('.dashboard-group-header');
    
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const targetId = header.dataset.target;
            const content = document.getElementById(targetId);
            const icon = header.querySelector('.toggle-icon');
            const group = header.parentElement;

            if (content.style.display === 'none') {
                // Expand
                content.style.display = 'block';
                icon.textContent = '▼';
                group.classList.remove('collapsed');
                group.classList.add('expanded');
            } else {
                // Collapse
                content.style.display = 'none';
                icon.textContent = '▶';
                group.classList.remove('expanded');
                group.classList.add('collapsed');
            }
        });
    });
}
```

### File: utils.js
```javascript
// === UTILITY FUNCTIONS ===
// Shared helper functions used across multiple modules.
// Keep this file free of DOM or state dependencies.

/**
 * Formats a number as USD currency string.
 * @param {number} num - The number to format.
 * @returns {string} Formatted currency string (e.g., "$1,234.56").
 */
export function formatCurrency(num) {
    return num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

```

### File: index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sunflower Retirement</title>
    <link rel="stylesheet" href="style.css">
    <link rel="icon" type="image/png" href="./favicon.png">
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script type="module" src="./js/currency.js"></script>
    <script type="module" src="./js/app.js"></script>
</head>
<body>
    <header>
        <div class="header-content">
            <div class="header-title-group">
                <img src="./FinancialSun.png" alt="Financial Sun logo" class="header-logo">
                <h1>Sunflower Retirement</h1>
            </div>
            <div class="header-controls">
                <div id="user-status"></div>
                <div class="theme-toggle-group">
                    <span class="theme-label">Dark/Light Mode</span>
                    <div class="theme-switch-wrapper">
                        <label class="theme-switch" for="dark-mode-toggle">
                            <input type="checkbox" id="dark-mode-toggle" />
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </header>
    <nav class="app-nav-bar">
        <button class="app-nav-btn active" data-target="financial-app">Financial</button>
        <button class="app-nav-btn" data-target="travel-app">Trip Planner</button>
    </nav>
    <main>
        <div id="financial-app" class="app-container active">
    
            <aside class="app-sidebar">
                <section id="dashboard-section" class="app-section">
                    <div class="section-header">
                        <h2>Dashboard</h2>
                        <button id="toggle-dashboard-btn" title="Toggle Dashboard View">Grids & Charts</button>
                    </div>

                    <div class="dashboard-group expanded" id="dash-group-banks">
                        <h3 class="dashboard-group-header" data-target="dash-content-banks">
                            <span class="toggle-icon">▼</span> Bank Balances
                        </h3>
                        <div id="dash-content-banks" class="dashboard-group-content">
                            <div id="dashboard-bank-summary">
                                <p class="bank-summary-loading">Loading...</p>
                            </div>
                        </div>
                    </div>

                    <div class="dashboard-group collapsed" id="dash-group-overview">
                        <h3 class="dashboard-group-header" data-target="dash-content-overview">
                            <span class="toggle-icon">▶</span> Overview
                        </h3>
                        <div id="dash-content-overview" class="dashboard-group-content" style="display: none;">
                            <div id="dashboard-summary"></div> <div id="dashboard-forecast" class="dashboard-summary"></div> <div class="chart-container" id="summary-chart-container">
                                <canvas id="expense-chart"></canvas>
                            </div>
                        </div>
                    </div>

                    <div id="expanded-dashboard-content" style="display: none;">
                        <div class="dashboard-tabs">
                            <button class="tab-btn active" data-tab="grids">Grids</button>
                            <button class="tab-btn" data-tab="charts">Charts</button>
                        </div>
                        <div class="dashboard-view-controls">
                            <div class="view-group" data-tab-group="grids">
                                <button class="view-btn active" data-view="2m">2 Month</button>
                                <button class="view-btn" data-view="6m">6 Month</button>
                                <button class="view-btn" data-view="yearly">Yearly Summary</button>
                                <button class="view-btn" data-view="historic">Historic</button> 
                            </div> 
                            <div class="view-group" data-tab-group="charts" style="display: none;">
                                <button class="view-btn active" data-view="expensePie">Expenses</button>
                                <button class="view-btn" data-view="loanChart">Loans</button>
                                <button class="view-btn" data-view="reconciliationView">Reconciliations</button>
                            </div>
                        </div>
                        <div class="dashboard-content-area">
                            <div id="grid-content" class="tab-content active">
                                <div id="grid-monthly-content" class="grid-layout-container"></div>
                                <div id="grid-yearly-content" class="grid-layout-container" style="display: none;">
                                    <div id="grid-yearly-summary-panel">Yearly Summary Panel</div>
                                    <div id="grid-detail-content">Detail Panel</div>
                                </div>
                                <div id="grid-historic-content" class="grid-layout-container" style="display: none;">
                                    <div id="grid-historic-year-panel"></div>
                                    <div id="grid-historic-detail-content"></div>
                                </div>
                            </div>
                            <div id="chart-content" class="tab-content">
                                <div id="expense-pie-chart-container" class="chart-container-wrapper">
                                    <div class="chart-container">
                                        <canvas id="expanded-expense-chart"></canvas>
                                        <div id="expanded-expense-details" style="display: none;"></div>
                                    </div>
                                </div>
                                <div id="loan-chart-content" class="chart-container-wrapper" style="display: none;">
                                    <div id="loan-chart-controls" class="chart-controls-container">
                                        <div class="form-group">
                                            <label>Select Loans:</label>
                                            <div id="loan-chart-select-container" class="checkbox-container"></div>
                                        </div>
                                        <div class="form-group">
                                            <label for="loan-timeframe-select">Select Timeframe:</label>
                                            <select id="loan-timeframe-select">
                                                <option value="10">10 Years</option>
                                                <option value="15">15 Years</option>
                                                <option value="20">20 Years</option>
                                                <option value="25">25 Years</option>
                                                <option value="30">30 Years</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="chart-container"><canvas id="loan-chart-canvas"></canvas></div>
                                </div>
                                <div id="reconciliation-view-content" class="chart-container-wrapper" style="display: none;"></div>
                            </div>
                        </div>
                    </div>
                </section>
            </aside>

            <div class="app-main-content">
                
                <nav class="section-tabs">
                    <button class="section-tab-btn" data-target="income-section">Income Sources</button>
                    <button class="section-tab-btn active" data-target="expense-section">Expense Log</button>
                    <button class="section-tab-btn" data-target="banking-section">Banking & Investment</button>
                    <button class="section-tab-btn" data-target="liabilities-section">Loans & Credit</button>
                </nav>

                <section id="income-section" class="app-section tab-panel">
                    <div class="section-header">
                        <h2>Incomes</h2>
                        <div class="header-controls-group">
                            <button id="toggle-income-list-view" class="btn-secondary">Show Current</button>
                            <button id="show-income-modal-btn" class="btn-primary">Add Income</button>
                        </div>
                    </div>
                    
                    <div class="ledger-header">
                        <span class="col-name">Name / Description</span>
                        <span class="col-amount">Amount</span>
                        <span class="col-actions">Actions</span>
                    </div>
                    <ul id="income-list" class="item-list"><li>Loading...</li></ul>
                </section>
                
                <section id="expense-section" class="app-section tab-panel active">
                    <div class="section-header">
                        <h2>Expenses</h2>
                        <div class="header-controls-group">
                            <button id="toggle-expense-list-view" class="btn-secondary">Show Current</button>
                            <button id="show-expense-modal-btn" class="btn-primary">Add Expense</button>
                        </div>
                    </div>

                    <div class="ledger-header">
                        <span class="col-name">Name / Category</span>
                        <span class="col-amount">Amount</span>
                        <span class="col-actions">Actions</span>
                    </div>
                    <ul id="expense-list" class="item-list"><li>Loading...</li></ul>
                </section>
                
                <section id="banking-section" class="app-section tab-panel">
                    <div class="section-header"><h2>Banking & Investment</h2></div>
                    <div class="section-controls">
                        <button id="show-account-modal-btn" class="btn-primary">Add Account</button>
                        <button id="show-transfer-modal-btn" class="btn-primary">Add Transfer</button>
                        <button id="toggle-transfer-list-view" class="btn-secondary" data-type="transfer">Show All</button>
                    </div>
                    <hr class="divider">
                    <div id="banking-list-container">
                        <h3>Accounts</h3>
                        <ul id="account-list" class="item-list"></ul>
                        <hr class="divider">
                        <h3>Recurring Transfers</h3>
                        <ul id="transfer-list" class="item-list"></ul>
                    </div>
                </section>

                <section id="liabilities-section" class="app-section tab-panel">
                    <div class="section-header"><h2>Loans & Credit</h2></div>
                    <div class="section-controls">
                        <button id="show-cc-modal-btn" class="btn-primary">Add Liability</button>
                    </div>
                    <hr class="divider">
                    <div id="liabilities-list-container">
                        <h3>Loans (Mortgages, Vehicles, etc.)</h3>
                        <ul id="loan-list" class="item-list"><li><em>No loans added yet.</em></li></ul>
                        
                        <hr class="divider">
                        
                        <h3>Credit Cards</h3>
                        <ul id="cc-list" class="item-list"><li><em>No credit cards added yet.</em></li></ul>
                    </div>
                </section>

            </div>
        </div>
        <div id="travel-app" class="app-container">
            <section class="app-section">
                <div class="section-header">
                    <h2>Trip Planner</h2>
                </div>
                <p>Welcome to your Bucket List. (AI features coming soon!)</p>
                <div class="section-controls">
                     <button id="add-travel-item-btn" class="btn-primary">Add Destination</button>
                </div>
                <hr class="divider">
                <div id="travel-list-container">
                    <ul id="travel-list" class="item-list">
                        <li><em>No trips added yet.</em></li>
                    </ul>
                </div>
            </section>
        </div>
    </main>
    <footer>
       <div class="footer-content">
            <div class="copyright-group">
                <img src="./SunflowerApplications.png" alt="SunflowerApplications logo" class="footer-logo">
                <span class="copyright">© <span id="current-year"></span> Sunflower Applications Inc.</span>
            </div>
            <span class="version">v1.0.0</span>
        </div>
    </footer>
    <div id="app-modal" class="modal modal-hidden">
        <div class="modal-content">
            <div class="modal-header"><h2 id="modal-title">Modal Title</h2><button id="modal-close-btn" class="delete-btn">X</button></div>
            <div id="modal-body"></div>
            <div class="modal-footer"><button id="modal-cancel-btn" class="btn-secondary">Cancel</button><button id="modal-save-btn" class="btn-primary">Save</button></div>
        </div>
    </div>
    <div id="auth-modal" class="modal modal-hidden">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Login or Sign Up</h2>
                <button id="auth-modal-close-btn" class="delete-btn">X</button>
            </div>
            <div class="modal-body">
                <form id="email-auth-form">
                    <div class="form-group">
                        <label for="auth-email">Email:</label>
                        <input type="email" id="auth-email" placeholder="you@example.com" required>
                    </div>
                    <div class="form-group">
                        <label for="auth-password">Password:</label>
                        <input type="password" id="auth-password" placeholder="••••••••" required>
                    </div>
                    <button type="submit" class="btn-primary">Continue with Email</button>
                </form>
                <div class="auth-divider">
                    <span>or</span>
                </div>
                <button id="github-login-btn" class="btn-secondary">Continue with GitHub</button>
            </div>
        </div>
    </div>
    <div id="notification-container">
    </div>
    <div id="grid-context-menu" class="context-menu modal-hidden">
        <ul>
            <li data-action="edit-amount">Edit Amount...</li>
            <li data-action="revert-amount">Revert to Original Amount</li>
            <li class="menu-divider" data-status="paid">Mark Green</li>
            <li data-status="overdue">Mark Red</li>
            <li data-status="highlighted">Mark Blue</li>
            <li data-status="pending">Clear Status</li>
        </ul>
    </div>
</body>
</html>
```

### File: style.css
```css
/* MAIN STYLESHEET — Table of contents */
@import url('./css/base.css');
@import url('./css/layout.css');
@import url('./css/components.css');
@import url('./css/dashboard.css');
@import url('./css/travel.css');

```

