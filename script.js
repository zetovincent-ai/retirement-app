document.addEventListener('DOMContentLoaded', () => {
    // === SUPABASE INITIALIZATION ===
    const SUPABASE_URL = 'https://mwuxrrwbgytbqrlhzwsc.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13dXhycndiZ3l0YnFybGh6d3NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MjcxNTYsImV4cCI6MjA3NjEwMzE1Nn0.up3JOKKXEyw6axEGhI2eESJbrZzoH-93zRmCSXukYZY';
    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    // === STATE MANAGEMENT ===
    let appState = { incomes: [], expenses: [], transactions: [] };
    let onSave = null;
    let expenseChartInstance = null;
    let activeDashboardTab = 'grids'; 
    let activeGridView = '2m'; 
    let activeChartView = 'expensePie'; 
    let currentContextItem = null;
    // === DOM SELECTORS ===
    const currentYearSpan = document.getElementById('current-year'); // New selector
    const mainContainer = document.querySelector('main');
    const toggleDashboardBtn = document.getElementById('toggle-dashboard-btn');
    const userStatus = document.getElementById('user-status');
    const appModal = document.getElementById('app-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');
    const modalSaveBtn = document.getElementById('modal-save-btn');
    const showIncomeModalBtn = document.getElementById('show-income-modal-btn');
    const showExpenseModalBtn = document.getElementById('show-expense-modal-btn');
    const incomeList = document.getElementById('income-list');
    const expenseList = document.getElementById('expense-list');
    const dashboardSummary = document.getElementById('dashboard-summary');
    const summaryChartContainer = document.getElementById('summary-chart-container');
    const expenseChartCanvas = document.getElementById('expense-chart');
    const darkModeToggle = document.getElementById('dark-mode-toggle'); // New selector
    const authModal = document.getElementById('auth-modal');
    const authModalCloseBtn = document.getElementById('auth-modal-close-btn');
    const emailAuthForm = document.getElementById('email-auth-form');
    const githubLoginBtn = document.getElementById('github-login-btn');
    const notificationContainer = document.getElementById('notification-container');
    const expandedDashboardContent = document.getElementById('expanded-dashboard-content');
    const dashboardTabsContainer = document.querySelector('.dashboard-tabs');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const viewControlsContainer = document.querySelector('.dashboard-view-controls');
    const viewButtonGroups = document.querySelectorAll('.view-group');
    const gridViewButtons = document.querySelectorAll('.view-group[data-tab-group="grids"] .view-btn');
    const chartViewButtons = document.querySelectorAll('.view-group[data-tab-group="charts"] .view-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const gridContentArea = document.getElementById('grid-content');
    const gridMonthlyContent = document.getElementById('grid-monthly-content');
    const gridYearlyContent = document.getElementById('grid-yearly-content');
    const gridYearlySummaryPanel = document.getElementById('grid-yearly-summary-panel');
    const gridDetailContent = document.getElementById('grid-detail-content');
    const chartContentArea = document.getElementById('chart-content');
    const expandedExpenseChartCanvas = document.getElementById('expanded-expense-chart'); 
    const expandedChartContainer = document.getElementById('expanded-expense-chart').parentElement;
    const gridContextMenu = document.getElementById('grid-context-menu');
    // === FUNCTIONS ===
    // --- Dashboard Tab/View Management ---
    function setActiveDashboardTab(tabId) {
        activeDashboardTab = tabId;
        // Update tab button active states
        tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });
        // Show/Hide corresponding view button groups
        viewButtonGroups.forEach(group => {
            group.style.display = (group.dataset.tabGroup === tabId) ? 'flex' : 'none';
        });
        
        // Show/Hide corresponding content areas
        tabContents.forEach(content => {
            // *** CORRECTED LINE ***
            // Match 'grids' -> 'grid-content' and 'charts' -> 'chart-content'
            const contentId = (tabId === 'grids' || tabId === 'charts') 
                ? `${tabId.slice(0, -1)}-content` // "grids" -> "grid"
                : `${tabId}-content`;

            content.classList.toggle('active', content.id === contentId);
        });

        // Trigger render for the newly active content
        renderActiveDashboardContent();
    }
    function setActiveGridView(viewId) {
        activeGridView = viewId;
        gridViewButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === viewId);
        });

        // --- NEW: Show/Hide the correct grid layout container ---
        if (viewId === 'yearly') {
            gridMonthlyContent.style.display = 'none';
            gridYearlyContent.style.display = 'flex'; // Use 'flex' for the left/right layout
        } else {
            gridMonthlyContent.style.display = 'flex'; // Use 'flex' for the 2m/6m layout
            gridYearlyContent.style.display = 'none';
        }
        
        renderActiveDashboardContent();
    }
    function setActiveChartView(viewId) {
        activeChartView = viewId;
        chartViewButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === viewId);
        });
        renderActiveDashboardContent();
    }
    function renderActiveDashboardContent() {
        if (!mainContainer.classList.contains('dashboard-expanded')) return;

        if (activeDashboardTab === 'grids') {
            // --- UPDATED LOGIC ---
            if (activeGridView === 'yearly') {
                renderYearlyConfigUI();
            } else {
                // Default to 2 months if not 6m
                const months = (activeGridView === '6m') ? 6 : 2;
                gridMonthlyContent.innerHTML = renderGridView(months, new Date());
            }
        } else if (activeDashboardTab === 'charts') {
            if (activeChartView === 'expensePie') {
                renderExpenseChart(true); 
            }
        }
    }
    /**
     * Renders the 2-month or 6-month grid view.
     * @param {number} numberOfMonths - The number of months to show.
     * @param {Date} startDate - The date to start the grid from.
     * @param {number} [startingNetTotal=0] - The starting net total to carry over.
     */
    function renderGridView(numberOfMonths, startDate, startingNetTotal = 0) {
        console.log(`Rendering grid view for ${numberOfMonths} months starting from ${startDate.toISOString()} with starting net: ${startingNetTotal}`);
        
        // Use UTC methods to read the date, avoiding local timezone conversion
        const startOfMonth = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), 1));
        
        const months = getMonthsToRender(startOfMonth, numberOfMonths);
        
        const formatCurrency = num => num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        const formatDay = date => date.getUTCDate();

        // --- Filter items into recurring and one-time lists ---
        const recurringIncomes = appState.incomes.filter(i => i.interval !== 'one-time');
        const recurringExpenses = appState.expenses.filter(i => i.interval !== 'one-time');
        const oneTimeIncomes = appState.incomes.filter(i => i.interval === 'one-time');
        const oneTimeExpenses = appState.expenses.filter(i => i.interval === 'one-time');

        let finalHTML = '<div class="grid-view-container">'; 
        let runningOverallNet = startingNetTotal; 

        months.forEach(monthDate => {
            const monthYear = monthDate.toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
            const monthString = monthDate.toISOString().split('T')[0];

            // --- Generate Rows for RECURRING items ---
            const generateRows = (items, type) => {
                let rowsHTML = '';
                let hasItems = false;
                let sectionTotal = 0; 
                const allOccurrences = [];

                items.forEach(item => {
                    // This function is now payoff-aware and will only return valid occurrences
                    const occurrences = getOccurrencesInMonth(item, monthDate); 
                    occurrences.forEach(occ => {
                        allOccurrences.push({ item: item, date: occ });
                        sectionTotal += item.amount; 
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
                        const dateString = date.toISOString().split('T')[0];
                        const dueDay = formatDay(date);
                        const amount = formatCurrency(item.amount);

                        // --- NEW: Add (X of Y) for loans ---
                        letitemName = item.name;
                        const totalPayments = item.advanced_data?.total_payments;
                        if (totalPayments && (item.advanced_data?.item_type === 'Mortgage/Loan' || item.advanced_data?.item_type === 'Car Loan')) {
                            const currentPaymentNum = calculatePaymentNumber(item.start_date, date, item.interval);
                            if (currentPaymentNum) {
                                itemName += ` <span class="payment-number">(${currentPaymentNum} of ${totalPayments})</span>`;
                            }
                        }
                        
                        rowsHTML += `
                            <tr class="${statusClass}" 
                                data-item-id="${item.id}" 
                                data-item-type="${type}" 
                                data-date="${dateString}"
                                title="Right-click to change status">
                                <td>${itemName}</td>
                                <td>${dueDay}</td>
                                <td>${amount}</td>
                            </tr>
                        `;
                    });
                }
                if (!hasItems) {
                    rowsHTML = `<tr><td colspan="3">No recurring ${type.toLowerCase()}s this month.</td></tr>`;
                }
                return { html: rowsHTML, total: sectionTotal };
            };

            // --- Generate Rows for ONE-TIME items ---
            const generateOneTimeRows = () => {
                let rowsHTML = '';
                let hasItems = false;
                let totalIncome = 0; 
                let totalExpense = 0; 
                const allOccurrences = [];

                oneTimeIncomes.forEach(item => {
                    const occurrences = getOccurrencesInMonth(item, monthDate);
                    occurrences.forEach(occ => {
                        allOccurrences.push({ item: item, date: occ, type: 'income' });
                        totalIncome += item.amount; 
                    });
                });
                oneTimeExpenses.forEach(item => {
                    const occurrences = getOccurrencesInMonth(item, monthDate);
                    occurrences.forEach(occ => {
                        allOccurrences.push({ item: item, date: occ, type: 'expense' });
                        totalExpense += item.amount; 
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
                        const typeClass = (type === 'income') ? 'row-income-text' : 'row-expense-text';
                        const dateString = date.toISOString().split('T')[0];
                        const dueDay = formatDay(date);
                        const amount = formatCurrency(item.amount);

                        // --- NEW: Add (X of Y) for one-time loans (if any) ---
                        let itemName = item.name;
                        const totalPayments = item.advanced_data?.total_payments;
                         if (totalPayments && (item.advanced_data?.item_type === 'Mortgage/Loan' || item.advanced_data?.item_type === 'Car Loan')) {
                            const currentPaymentNum = calculatePaymentNumber(item.start_date, date, item.interval);
                            if (currentPaymentNum) {
                                itemName += ` <span class="payment-number">(${currentPaymentNum} of ${totalPayments})</span>`;
                            }
                        }

                        rowsHTML += `
                            <tr class="${statusClass} ${typeClass}" 
                                data-item-id="${item.id}" 
                                data-item-type="${type}" 
                                data-date="${dateString}"
                                title="Right-click to change status">
                                <td>${itemName}</td>
                                <td>${dueDay}</td>
                                <td>${amount}</td>
                            </tr>
                        `;
                    });
                }
                if (!hasItems) {
                    rowsHTML = `<tr><td colspan="3">No one-time items this month.</td></tr>`;
                }
                const net = totalIncome - totalExpense; 
                return { html: rowsHTML, net: net }; 
            };


            // --- Generate all row sections and get data ---
            const incomeData = generateRows(recurringIncomes, 'income');
            const expenseData = generateRows(recurringExpenses, 'expense');
            const oneTimeData = generateOneTimeRows();
            
            // --- Calculate totals ---
            const monthlyNetTotal = (incomeData.total - expenseData.total) + oneTimeData.net;
            runningOverallNet += monthlyNetTotal;
            
            // --- Format totals for display ---
            const incomeTotalFormatted = formatCurrency(incomeData.total);
            const expenseTotalFormatted = formatCurrency(expenseData.total);
            const oneTimeNetFormatted = formatCurrency(oneTimeData.net);
            const monthlyNetTotalFormatted = formatCurrency(monthlyNetTotal);
            const overallNetTotalFormatted = formatCurrency(runningOverallNet); 

            // --- Assemble the final table HTML ---
            finalHTML += `
                <div class="month-grid-container">
                    <h3 class="month-grid-header">${monthYear}</h3>
                    <table class="month-grid-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Due Day(s)</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody class="grid-grand-total">
                            <tr class="grid-monthly-net-total-row">
                                <td colspan="2">MONTHLY NET TOTAL</td>
                                <td>${monthlyNetTotalFormatted}</td>
                            </tr>
                            <tr class="grid-overall-net-total-row">
                                <td colspan="2">OVERALL NET TOTAL</td>
                                <td>${overallNetTotalFormatted}</td>
                            </tr>
                        </tbody>
                        <tbody class="grid-group-income">
                            <tr class="grid-group-header">
                                <td colspan="3">
                                    <div class="grid-header-content">
                                        <span>Income</span>
                                        <button class="btn-grid-add" data-action="add-grid-item" data-type="income" data-date="${monthString}">+ Add</button>
                                    </div>
                                </td>
                            </tr>
                            ${incomeData.html}
                            <tr class="grid-total-row">
                                <td colspan="2">Total Income</td>
                                <td>${incomeTotalFormatted}</td>
                            </tr>
                        </tbody>
                        <tbody class="grid-group-expense">
                            <tr class="grid-group-header">
                                <td colspan="3">
                                    <div class="grid-header-content">
                                        <span>Expenses</span>
                                        <button class="btn-grid-add" data-action="add-grid-item" data-type="expense" data-date="${monthString}">+ Add</button>
                                    </div>
                                </td>
                            </tr>
                            ${expenseData.html}
                            <tr class="grid-total-row">
                                <td colspan="2">Total Expenses</td>
                                <td>${expenseTotalFormatted}</td>
                            </tr>
                        </tbody>
                        <tbody class="grid-group-onetime">
                            <tr class="grid-group-header">
                                <td colspan="3">
                                    <div class="grid-header-content">
                                        <span>One-time</span>
                                        <div class="grid-header-buttons">
                                            <button class="btn-grid-add" data-action="add-grid-item" data-type="income" data-date="${monthString}" data-interval="one-time">+ Income</button>
                                            <button class="btn-grid-add" data-action="add-grid-item" data-type="expense" data-date="${monthString}" data-interval="one-time">+ Expense</button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            ${oneTimeData.html}
                            <tr class="grid-total-row">
                                <td colspan="2">One-time Net</td>
                                <td>${oneTimeNetFormatted}</td>
                            </tr>
                        </tbody>
                        <tbody class="grid-group-banking">
                            <tr class="grid-group-header">
                                <td colspan="3">
                                    <div class="grid-header-content">
                                        <span>Banking</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="3">*Net Totals (Coming Soon)*</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;
        });

        finalHTML += '</div>';
        
        // This function returns the HTML string to be injected by the caller
        return finalHTML;
    }
    // --- Dark/Light Mode Functions ---
    function setMode(mode) {
        localStorage.setItem('sunflower-mode', mode);
        if (mode === 'dark') {
            document.body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        } else {
            document.body.classList.remove('dark-mode');
            darkModeToggle.checked = false;
        }
    }
    function loadMode() {
        const savedMode = localStorage.getItem('sunflower-mode') || 'light'; // Default to light
        setMode(savedMode);
    }
    // --- Initialize Footer ---
    function initializeFooter() {
        if (currentYearSpan) {
            currentYearSpan.textContent = new Date().getFullYear();
        }
    }
    function openAuthModal() { 
        authModal.classList.remove('modal-hidden'); 
    }
    function closeAuthModal() { 
        authModal.classList.add('modal-hidden'); 
    }
    // --- DATABASE FUNCTIONS ---
    async function fetchData() {
        console.log("Attempting to fetch data...");
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) {
             console.log("No user logged in for fetchData, clearing local state.");
             appState = { incomes: [], expenses: [], transactions: [] }; // Clear all
             renderAll();
             return;
        }
        console.log("Fetching data for user:", user.id);
        
        // Use Promise.all to fetch concurrently
        const [
            { data: incomes, error: incomesError },
            { data: expenses, error: expensesError },
            { data: transactions, error: transactionsError }
        ] = await Promise.all([
            supabaseClient.from('incomes').select('*').eq('user_id', user.id),
            supabaseClient.from('expenses').select('*').eq('user_id', user.id),
            supabaseClient.from('transaction_log').select('*').eq('user_id', user.id) // Fetch new log
        ]);

        if (incomesError) console.error('Error fetching incomes:', incomesError);
        else appState.incomes = incomes || [];

        if (expensesError) console.error('Error fetching expenses:', expensesError);
        else appState.expenses = expenses || [];

        if (transactionsError) console.error('Error fetching transactions:', transactionsError);
        else appState.transactions = transactions || []; // Store transactions

        console.log("Data fetch complete, rendering UI.");
        renderAll();
    }
    // --- NOTIFICATION FUNCTIONS ---
    function showNotification(message, type = 'success') {
        const toast = document.createElement('div');
        toast.classList.add('toast', `toast--${type}`);
        toast.textContent = message;

        notificationContainer.appendChild(toast);

        // Remove the toast after the animation completes
        setTimeout(() => {
            toast.remove();
        }, 3000); // Duration of animation (2.5s) + buffer
    }
    // --- AUTH FUNCTIONS ---
    async function handleLogin() {
        console.log("Login initiated...");
        const { error } = await supabaseClient.auth.signInWithOAuth({ provider: 'github' });
        if (error) console.error('Error logging in:', error);
    }
    async function handleGitHubLogin() {
        const { error } = await supabaseClient.auth.signInWithOAuth({ provider: 'github' });
        if (error) console.error('Error logging in with GitHub:', error);
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
                showNotification("Sign-up successful! Please check your email to confirm your account.");
                closeAuthModal();
            } else {
                showNotification("Login successful!");
                closeAuthModal();
            }
        } else {
            // Sign-in was successful
            showNotification("Login successful!");
            closeAuthModal();
        }
    }
    async function handleLogout() {
        console.log("Logout function called");
        const { error } = await supabaseClient.auth.signOut();
        if (error) {
            console.error('Error logging out:', error);
        } else {
            console.log("Logout successful via function call.");
        }
    }
    function updateUserStatus(user) {
    if (user) {
        // Re-add the user's email to the display
        userStatus.innerHTML = `
            <span>LOGGED IN: ${user.email}</span>
            <button id="logout-btn" class="btn-secondary">Logout</button>
        `;
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
             logoutBtn.removeEventListener('click', handleLogout); // Clean up previous listener
             logoutBtn.addEventListener('click', handleLogout);
        }
    } else {
        userStatus.innerHTML = `<button id="login-btn" class="btn-primary">Login / Sign Up</button>`;
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
             loginBtn.removeEventListener('click', openAuthModal); // Clean up previous listener
             loginBtn.addEventListener('click', openAuthModal);
        }
    }
}
    // --- DATA MODAL FUNCTIONS ---
    function openModal() { 
        appModal.classList.remove('modal-hidden'); 
    }
    function closeModal() {
        appModal.classList.add('modal-hidden');
        appModal.classList.remove('modal--read-only'); // Remove class on close
        modalBody.innerHTML = '';
        onSave = null;
    }
    function showIncomeModal(incomeId, prefillData = null) {
        const isEditMode = incomeId !== undefined;
        const incomeToEdit = isEditMode && Array.isArray(appState.incomes) ? appState.incomes.find(i => i.id === incomeId) : null;
        modalTitle.textContent = isEditMode ? 'Edit Income' : 'Add New Income';
        
        // Change "Due Day" to "Start Date"
        modalBody.innerHTML = `
            <div class="form-group"><label for="modal-income-type">Type:</label><select id="modal-income-type" required>...</select></div>
            <div class="form-group"><label for="modal-income-name">Description / Name:</label><input type="text" id="modal-income-name" placeholder="e.g., Vincent's TSP" required></div>
            <div class="form-group"><label for="modal-income-interval">Payment Interval:</label><select id="modal-income-interval" required>...</select></div>
            <div class="form-group"><label for="modal-income-amount">Payment Amount:</label><input type="number" id="modal-income-amount" placeholder="1500" min="0" step="0.01" required></div>
            <div class="form-group"><label for="modal-income-date">Payment Start Date:</label><input type="date" id="modal-income-date" required></div>
        `; // Simplified dropdowns above for brevity
        
        // Re-add full dropdown options here...
        document.getElementById('modal-income-interval').innerHTML = `<option value="monthly">Monthly</option><option value="annually">Annually</option><option value="quarterly">Quarterly</option><option value="bi-weekly">Bi-Weekly</option><option value="one-time">One-time</option>`;
        document.getElementById('modal-income-type').innerHTML = `<option value="">-- Select a Type --</option><option value="Pension">Pension</option><option value="TSP">TSP</option><option value="TSP Supplement">TSP Supplement</option><option value="Social Security">Social Security</option><option value="Investment">Investment Dividend</option><option value="Other">Other</option>`;

        if (isEditMode && incomeToEdit) {
            // --- EDIT MODE ---
            document.getElementById('modal-income-type').value = incomeToEdit.type || '';
            document.getElementById('modal-income-name').value = incomeToEdit.name || '';
            document.getElementById('modal-income-interval').value = incomeToEdit.interval || 'monthly';
            document.getElementById('modal-income-amount').value = incomeToEdit.amount || '';
            document.getElementById('modal-income-date').value = incomeToEdit.start_date || ''; 
        } else if (prefillData) {
            // --- NEW: PRE-FILL MODE (from grid) ---
            document.getElementById('modal-income-date').value = prefillData.startDate;
            if (prefillData.interval) {
                document.getElementById('modal-income-interval').value = prefillData.interval;
            }
        } else if (!isEditMode) {
            // --- DEFAULT ADD MODE (from main button) ---
            document.getElementById('modal-income-date').value = new Date().toISOString().split('T')[0];
        }

        onSave = async () => {
            const { data: { user } } = await supabaseClient.auth.getUser();
            if (!user) { /* ... error handling ... */ return; }
            
            const startDateValue = document.getElementById('modal-income-date').value;
            
            const formItem = {
                user_id: user.id,
                type: document.getElementById('modal-income-type').value,
                name: document.getElementById('modal-income-name').value.trim(),
                interval: document.getElementById('modal-income-interval').value,
                amount: parseFloat(document.getElementById('modal-income-amount').value),
                start_date: startDateValue ? startDateValue : null
            };
            
            if (!formItem.type || !formItem.name || isNaN(formItem.amount) || formItem.amount < 0 || !formItem.start_date) {
                alert("Please fill out all fields correctly, including a valid start date.");
                return;
            }
            
            let { error } = isEditMode
                ? await supabaseClient.from('incomes').update(formItem).eq('id', incomeId)
                : await supabaseClient.from('incomes').insert([formItem]).select();
            
            if (error) { console.error("Error saving income:", error); alert(`Error: ${error.message}`); }
            else { await fetchData(); }
            closeModal();
        };
        openModal();
    }
    function showExpenseModal(expenseId, prefillData = null) {
        const isEditMode = expenseId !== undefined;
        const expenseToEdit = isEditMode && Array.isArray(appState.expenses) ? appState.expenses.find(e => e.id === expenseId) : null;
        modalTitle.textContent = isEditMode ? 'Edit Expense' : 'Add New Expense';

        modalBody.innerHTML = `
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
                    <option value="Other">Other</option>
                </select>
            </div>
            <div id="sub-type-container" class="form-group" style="display: none;">
                <label for="modal-expense-sub-type">Sub-Type:</label>
                <select id="modal-expense-sub-type">
                </select>
            </div>
            <div class="form-group">
                <label for="modal-expense-name">Description / Name:</label>
                <input type="text" id="modal-expense-name" placeholder="e.g., Electric Bill or Car Payment" required>
            </div>
            <div class="form-group">
                <label for="modal-expense-interval">Payment Interval:</label>
                <select id="modal-expense-interval" required>
                    <option value="monthly">Monthly</option>
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
            <div id="advanced-loan-fields" style="display: none;">
                <hr class="divider">
                <h4>Loan Details (Optional)</h4>
                 <div class="form-group"><label for="modal-loan-interest-rate">Interest Rate (%):</label><input type="number" id="modal-loan-interest-rate" placeholder="e.g., 6.5" min="0" step="0.001"></div>
                 <div class="form-group"><label for="modal-loan-total-payments">Total Payments (Months):</label><input type="number" id="modal-loan-total-payments" placeholder="e.g., 360" min="1" step="1"></div>
                 <div class="form-group"><label for="modal-loan-original-principal">Original Principal ($):</label><input type="number" id="modal-loan-original-principal" placeholder="e.g., 300000" min="0" step="0.01"></div>
            </div>
            <div id="advanced-cc-fields" style="display: none;">
                 <hr class="divider">
                 <h4>Credit Card Details (Optional)</h4>
                 <div class="form-group"><label for="modal-cc-limit">Credit Limit ($):</label><input type="number" id="modal-cc-limit" placeholder="e.g., 10000" min="0" step="0.01"></div>
                 <div class="form-group"><label for="modal-cc-statement-day">Statement Closing Day:</label><input type="number" id="modal-cc-statement-day" placeholder="(1-31) e.g., 20" min="1" max="31" step="1"></div>
                 <div class="form-group"><label for="modal-cc-interest-rate">Interest Rate (APR %):</label><input type="number" id="modal-cc-interest-rate" placeholder="e.g., 21.99" min="0" step="0.01"></div>
            </div>
        `;
        // --- Get references ---
        const categorySelect = document.getElementById('modal-expense-category');
        const subTypeContainer = document.getElementById('sub-type-container');
        const subTypeSelect = document.getElementById('modal-expense-sub-type');
        const advancedLoanFields = document.getElementById('advanced-loan-fields');
        const advancedCCFields = document.getElementById('advanced-cc-fields');
        
        // --- NEW: Get refs for auto-calculation ---
        const paymentAmountInput = document.getElementById('modal-expense-amount');
        const loanInterestInput = document.getElementById('modal-loan-interest-rate');
        const loanTermInput = document.getElementById('modal-loan-total-payments');
        const loanPrincipalInput = document.getElementById('modal-loan-original-principal');


        // --- Define Sub-Type Options ---
        const housingSubTypes = `<option value="">-- Select Sub-Type --</option><option value="Rent">Rent</option><option value="Mortgage/Loan">Mortgage/Loan</option><option value="HOA">HOA Dues</option><option value="Other">Other Housing</option>`;
        const transportSubTypes = `<option value="">-- Select Sub-Type --</option><option value="Car Loan">Car Loan</option><option value="Fuel">Fuel</option><option value="Insurance">Insurance</option><option value="Maintenance">Maintenance</option><option value="Other">Other Transport</option>`;

        // --- NEW: Helper to calculate payment ---
        function calculateAndSetPayment() {
            const principal = parseFloat(loanPrincipalInput.value);
            const rate = parseFloat(loanInterestInput.value) / 100.0; // Convert % to decimal
            const term = parseInt(loanTermInput.value);

            // Only calculate if all fields are valid
            if (principal > 0 && rate >= 0 && term > 0) {
                const amortization = calculateAmortization(principal, rate, term);
                if (amortization) {
                    paymentAmountInput.value = amortization.monthlyPayment.toFixed(2);
                    paymentAmountInput.readOnly = true;
                }
            } else {
                // If fields are invalid or empty, unlock the payment field
                paymentAmountInput.readOnly = false;
            }
        }

        function toggleAdvancedFields() {
            const category = categorySelect.value;
            let subType = subTypeSelect.value;
            let showSubTypeDropdown = false;
            let showLoan = false;
            let showCC = false;
            if (category === 'Housing') {
                showSubTypeDropdown = true;
                if (subTypeSelect.innerHTML !== housingSubTypes) { subTypeSelect.innerHTML = housingSubTypes; }
                showLoan = (subType === 'Mortgage/Loan');
            } else if (category === 'Transport') {
                showSubTypeDropdown = true;
                if (subTypeSelect.innerHTML !== transportSubTypes) { subTypeSelect.innerHTML = transportSubTypes; }
                showLoan = (subType === 'Car Loan');
            } else if (category === 'Credit Card') {
                showCC = true;
            }
            subTypeContainer.style.display = showSubTypeDropdown ? 'grid' : 'none';
            advancedLoanFields.style.display = showLoan ? 'block' : 'none';
            advancedCCFields.style.display = showCC ? 'block' : 'none';
            if (showSubTypeDropdown) {
                 const currentOptions = Array.from(subTypeSelect.options).map(opt => opt.value);
                 if (!currentOptions.includes(subType)) {
                      subTypeSelect.value = '';
                 } else {
                      subTypeSelect.value = subType;
                 }
            } else {
                 subTypeSelect.value = '';
            }
            
            // Re-run calculation in case fields were hidden/shown
            calculateAndSetPayment(); 
        }

        // --- Add event listeners ---
        categorySelect.addEventListener('change', toggleAdvancedFields);
        subTypeSelect.addEventListener('change', toggleAdvancedFields);
        
        // --- NEW: Add listeners to loan fields ---
        loanInterestInput.addEventListener('input', calculateAndSetPayment);
        loanTermInput.addEventListener('input', calculateAndSetPayment);
        loanPrincipalInput.addEventListener('input', calculateAndSetPayment);


        if (isEditMode && expenseToEdit) {
            // --- EDIT MODE ---
            categorySelect.value = expenseToEdit.category || '';
            if (expenseToEdit.category === 'Housing') subTypeSelect.innerHTML = housingSubTypes;
            else if (expenseToEdit.category === 'Transport') subTypeSelect.innerHTML = transportSubTypes;
            document.getElementById('modal-expense-name').value = expenseToEdit.name || '';
            document.getElementById('modal-expense-interval').value = expenseToEdit.interval || 'monthly';
            document.getElementById('modal-expense-amount').value = expenseToEdit.amount || '';
            document.getElementById('modal-expense-date').value = expenseToEdit.start_date || ''; 
            if (expenseToEdit.advanced_data) {
                 const advData = expenseToEdit.advanced_data;
                 if ((expenseToEdit.category === 'Housing' || expenseToEdit.category === 'Transport') && advData.item_type) {
                      subTypeSelect.value = advData.item_type;
                 }
                 if (advData.item_type === 'Mortgage/Loan' || advData.item_type === 'Car Loan') {
                    document.getElementById('modal-loan-interest-rate').value = advData.interest_rate ? (advData.interest_rate * 100).toFixed(3) : '';
                    document.getElementById('modal-loan-total-payments').value = advData.total_payments || '';
                    document.getElementById('modal-loan-original-principal').value = advData.original_principal || '';
                 }
                 if (expenseToEdit.category === 'Credit Card') {
                      document.getElementById('modal-cc-limit').value = advData.credit_limit || '';
                      document.getElementById('modal-cc-statement-day').value = advData.statement_day || '';
                      document.getElementById('modal-cc-interest-rate').value = advData.interest_rate ? (advData.interest_rate * 100).toFixed(2) : '';
                 }
            }
             toggleAdvancedFields();
             // calculateAndSetPayment(); // Already called by toggleAdvancedFields
        } else if (prefillData) {
            // --- NEW: PRE-FILL MODE (from grid) ---
            document.getElementById('modal-expense-date').value = prefillData.startDate;
            if (prefillData.interval) {
                document.getElementById('modal-expense-interval').value = prefillData.interval;
            }
            toggleAdvancedFields();
        } else if (!isEditMode) {
             // --- DEFAULT ADD MODE (from main button) ---
             document.getElementById('modal-expense-date').value = new Date().toISOString().split('T')[0];
             toggleAdvancedFields();
         }

        onSave = async () => {
            // ... (onSave function remains unchanged) ...
            const { data: { user } } = await supabaseClient.auth.getUser();
            if (!user) { alert("You must be logged in to save data."); return; }
            const category = categorySelect.value;
            const subType = subTypeSelect.value;
            const startDateValue = document.getElementById('modal-expense-date').value;
            let advancedData = null;
            if ((category === 'Housing' || category === 'Transport') && subType) {
                 advancedData = { item_type: subType };
                 if (subType === 'Mortgage/Loan' || subType === 'Car Loan') {
                     const rateInput = document.getElementById('modal-loan-interest-rate').value;
                     const paymentsInput = document.getElementById('modal-loan-total-payments').value;
                     const principalInput = document.getElementById('modal-loan-original-principal').value;
                     if (rateInput) advancedData.interest_rate = parseFloat(rateInput) / 100.0;
                     if (paymentsInput) advancedData.total_payments = parseInt(paymentsInput);
                     if (principalInput) advancedData.original_principal = parseFloat(principalInput);
                 }
            } else if (category === 'Credit Card') {
                 advancedData = { item_type: 'credit_card' };
                 const limitInput = document.getElementById('modal-cc-limit').value;
                 const statementDayInput = document.getElementById('modal-cc-statement-day').value;
                 const rateInput = document.getElementById('modal-cc-interest-rate').value;
                 if (limitInput) advancedData.credit_limit = parseFloat(limitInput);
                 if (statementDayInput) advancedData.statement_day = parseInt(statementDayInput);
                 if (rateInput) advancedData.interest_rate = parseFloat(rateInput) / 100.0;
            }
            const formItem = {
                user_id: user.id,
                category: category,
                name: document.getElementById('modal-expense-name').value.trim(),
                interval: document.getElementById('modal-expense-interval').value,
                amount: parseFloat(document.getElementById('modal-expense-amount').value),
                start_date: startDateValue ? startDateValue : null,
                advanced_data: advancedData
            };
            if (!formItem.category || !formItem.name || isNaN(formItem.amount) || formItem.amount < 0 || !formItem.start_date) {
                 alert("Please fill out required fields (Category, Name, Amount, Start Date).");
                 return;
            }
            if ((category === 'Housing' || category === 'Transport') && !subType) {
                 alert(`Please select a Sub-Type for the ${category} category.`);
                 return;
            }
            if (advancedData && advancedData.item_type === 'credit_card' && advancedData.statement_day && (advancedData.statement_day < 1 || advancedData.statement_day > 31)) {
                 alert("Statement Closing Day must be between 1 and 31.");
                 return;
            }
            let { error } = isEditMode
                ? await supabaseClient.from('expenses').update(formItem).eq('id', expenseId)
                : await supabaseClient.from('expenses').insert([formItem]).select();
            if (error) { console.error("Error saving expense:", error); alert(`Error saving expense: ${error.message}`); }
            else { await fetchData(); }
            closeModal();
        };
        openModal();
    }
    // --- RENDER & UTILITY FUNCTIONS ---
    function renderAll() {
        renderIncomes();
        renderExpenses();
        renderDashboard(); 
        if (mainContainer.classList.contains('dashboard-expanded')) {
             renderActiveDashboardContent();
        }
    }
    function renderDashboard(){
        const totalMonthlyIncome=calculateMonthlyTotal(appState.incomes);
        const totalMonthlyExpenses=calculateMonthlyTotal(appState.expenses);
        const netMonthly=totalMonthlyIncome-totalMonthlyExpenses;
        const format=num=>num.toLocaleString('en-US',{style:'currency',currency:'USD'});
        dashboardSummary.innerHTML=`
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
            </div>`
    }
    function renderIncomes(){
        renderList(appState.incomes,incomeList)
    }
    function renderExpenses(){
        renderList(appState.expenses,expenseList)
    }
    function renderList(items, listElement) {
        listElement.innerHTML = '';
        const listType = listElement.id.includes('income') ? 'income' : 'expense';
        if (!items || items.length === 0) {
             listElement.innerHTML = `<li>No ${listType}s added yet.</li>`;
             return;
        }
        
        // Sort by start_date (newest first, or handle nulls)
        items.sort((a, b) => {
            if (a.start_date && b.start_date) return new Date(b.start_date) - new Date(a.start_date);
            if (a.start_date) return -1; // a comes first
            if (b.start_date) return 1;  // b comes first
            return 0;
        });

        items.forEach(item => {
            if (!item || item.id === undefined || item.id === null) { console.warn("Skipping rendering invalid item:", item); return; }
            const li = document.createElement('li');
            const formattedAmount = typeof item.amount === 'number' ? item.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : 'N/A';
            const intervalText = item.interval ? ` / ${item.interval}` : '';
            
            // Format the start_date for display
            let dateText = '';
            if (item.start_date) {
                try {
                    // Create date object assuming YYYY-MM-DD (which is UTC)
                    const date = new Date(item.start_date + 'T00:00:00'); 
                    dateText = ` (Starts: ${date.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric' })})`;
                } catch (e) {
                    console.warn(`Invalid date format for item ${item.id}: ${item.start_date}`);
                    dateText = ' (Invalid Date)';
                }
            }
            
            const typeOrCategory = item.type || item.category || 'N/A';
            const name = item.name || 'Unnamed';
            let subTypeText = ''; // Display sub-type if relevant
             if (item.advanced_data && item.advanced_data.item_type && (item.category === 'Housing' || item.category === 'Transport')) {
                  subTypeText = ` - ${item.advanced_data.item_type}`;
             }


            // --- Conditionally add "View Schedule" button ---
            let scheduleButtonHTML = '';
            // Show for both Mortgage/Loan and Car Loan
            if (listType === 'expense' && item.advanced_data?.item_type &&
               (item.advanced_data.item_type === 'Mortgage/Loan' || item.advanced_data.item_type === 'Car Loan')) {
                 scheduleButtonHTML = `<button class="schedule-btn btn-secondary" data-id="${item.id}">Schedule</button>`;
            }

            li.innerHTML = `
                <div class="item-details">
                    <strong>${name}</strong> (${typeOrCategory}${subTypeText})<br>
                    <span>${formattedAmount}${intervalText}${dateText}</span>
                </div>
                <div class="item-controls">
                    ${scheduleButtonHTML}
                    <button class="edit-btn" data-id="${item.id}">Edit</button>
                    <button class="delete-btn" data-id="${item.id}">X</button>
                </div>`;
            listElement.appendChild(li);
        });
    }
    function renderExpenseChart(isExpandedView = false) {
        // Determine which canvas and container to use
        const canvasElement = isExpandedView ? expandedExpenseChartCanvas : expenseChartCanvas;
        const containerElement = isExpandedView ? expandedChartContainer : summaryChartContainer;

        // Exit if the necessary elements aren't found for the current view
        if (!canvasElement || !containerElement) {
             console.warn(`Canvas or container not found for ${isExpandedView ? 'expanded' : 'summary'} chart view.`);
             return;
        }

        // Only render the chart if its container is potentially visible
        // Check offsetParent; null means element or ancestor has display:none
        // Allow rendering if dashboard is expanding OR if it's the default view
        const dashboardIsExpanded = mainContainer.classList.contains('dashboard-expanded');
        if (!dashboardIsExpanded && isExpandedView) return; // Don't render expanded if not expanded
        if (dashboardIsExpanded && !isExpandedView) return; // Don't render default if expanded


        // --- Data Aggregation ---
        const categoryTotals = {};
        if (appState.expenses && Array.isArray(appState.expenses)) {
            appState.expenses.forEach(expense => {
                // Ensure expense item is valid before processing
                if (!expense || typeof expense.amount !== 'number' || typeof expense.category !== 'string') {
                    console.warn("Skipping invalid expense item for chart:", expense);
                    return; // Skip this invalid item
                }
                const monthlyAmount = calculateMonthlyTotal([expense]); // Calculate based on valid item
                if (!categoryTotals[expense.category]) {
                    categoryTotals[expense.category] = 0;
                }
                categoryTotals[expense.category] += monthlyAmount;
            });
        }
        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);

        // --- Chart Lifecycle Management ---
        // Destroy existing instance *only if it belongs to the currently targeted canvas*
        if (expenseChartInstance && expenseChartInstance.canvas === canvasElement) {
            console.log(`Destroying existing chart instance on canvas: ${canvasElement.id}`);
            expenseChartInstance.destroy();
            expenseChartInstance = null; // Reset instance
        } else if (expenseChartInstance && expenseChartInstance.canvas !== canvasElement) {
             // If an instance exists but belongs to the *other* canvas, destroy it too
             // This prevents having two charts active if the user toggles expand/collapse quickly
             console.log(`Destroying chart instance on inactive canvas: ${expenseChartInstance.canvas.id}`);
             expenseChartInstance.destroy();
             expenseChartInstance = null;
        }

        // --- Chart Rendering ---
        const ctx = canvasElement.getContext('2d');
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height); // Clear explicitly before drawing

        if (labels.length === 0) {
            console.log("No expense data to render chart.");
            // Optionally display a "No data" message on the canvas
            // ctx.textAlign = 'center';
            // ctx.fillText('No expense data available', canvasElement.width / 2, canvasElement.height / 2);
            return; // Exit if no valid data
        }

        console.log(`Rendering expense chart on canvas: ${canvasElement.id} with labels:`, labels, "and data:", data);
        try {
             expenseChartInstance = new Chart(ctx, {
                  type: 'pie',
                  data: {
                       labels: labels,
                       datasets: [{
                            label: 'Expenses by Category',
                            data: data,
                            backgroundColor: ['#3498db', '#e74c3c', '#9b59b6', '#f1c40f', '#2ecc71', '#1abc9c', '#e67e22', '#95a5a6'], // Cycle colors if more categories
                            hoverOffset: 4
                       }]
                  },
                  options: {
                       responsive: true,
                       maintainAspectRatio: false, // Important for fitting in container
                       plugins: {
                            legend: {
                                 position: 'top',
                            },
                            tooltip: { // Improved tooltips
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
        } catch (error) {
             console.error("Error creating Chart.js instance:", error);
             // Handle potential chart creation errors
        }
    }
    async function handleListClick(event) {
        const target = event.target;
        const idString = target.dataset.id;
        if (!idString) return; // Ignore clicks on elements without data-id

        const id = parseInt(idString);
        if (isNaN(id)) { console.error(`Invalid ID found on button: ${idString}`); return; }

        const listElement = target.closest('.item-list');
        if (!listElement) { console.error("Could not find parent list for clicked button."); return; }
        const listId = listElement.id;

        if (target.classList.contains('edit-btn')) {
            console.log(`Edit button clicked for ID ${id} in list ${listId}`);
            if (listId === 'income-list') showIncomeModal(id);
            else if (listId === 'expense-list') showExpenseModal(id);
        }
        else if (target.classList.contains('delete-btn')) {
            console.log(`Delete button clicked for ID ${id} in list ${listId}`);
            if (confirm("Are you sure you want to delete this item?")) {
                 const tableName = listId === 'income-list' ? 'incomes' : 'expenses';
                 const { error } = await supabaseClient.from(tableName).delete().eq('id', id);
                 if (error) { console.error(`Error deleting from ${tableName}:`, error); alert(`Error deleting item: ${error.message}`); }
                 else { console.log(`Successfully deleted item ID ${id} from ${tableName}`); await fetchData(); }
            }
        }
        // --- NEW: Handle clicks on the Schedule button ---
        else if (target.classList.contains('schedule-btn')) {
             console.log(`Schedule button clicked for ID ${id}`);
             showAmortizationModal(id); // Call the new modal function
        }
    }
    function calculateMonthlyTotal(items){
        if(!items)return 0;
        return items.reduce((total,item)=>{
            if(!item||typeof item.amount!=='number'||item.amount<0)return total;
            switch(item.interval){case'monthly':return total+item.amount;
                case'annually':return total+(item.amount/12);
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
    function calculateAmortization(principal, annualRate, termMonths) {
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
    function showAmortizationModal(expenseId) {
        console.log(`Showing amortization for expense ID: ${expenseId}`);
        const expenseItem = appState.expenses.find(e => e.id === expenseId);

        // *** CORRECTED CHECK: Allow both Mortgage/Loan and Car Loan ***
        if (!expenseItem || !expenseItem.advanced_data ||
            (expenseItem.advanced_data.item_type !== 'Mortgage/Loan' && expenseItem.advanced_data.item_type !== 'Car Loan') ) {
            console.error("Could not find valid loan data (Mortgage/Loan or Car Loan) for this item:", expenseItem);
            showNotification("No valid loan data found for this item.", "error");
            return;
        }

        // Check if required fields exist within advanced_data
        const principal = expenseItem.advanced_data.original_principal;
        const annualRate = expenseItem.advanced_data.interest_rate;
        const termMonths = expenseItem.advanced_data.total_payments;

        if (principal === undefined || annualRate === undefined || termMonths === undefined) {
             console.error("Missing required loan details (principal, rate, or term). Item data:", expenseItem.advanced_data);
             showNotification("Missing principal, rate, or term for calculation.", "error");
             return;
        }

        const amortization = calculateAmortization(principal, annualRate, termMonths);
        if (!amortization) {
             showNotification("Could not calculate amortization schedule.", "error");
             return;
        }

        modalTitle.textContent = `Amortization: ${expenseItem.name}`;
        let tableHTML = `<p><strong>Monthly Payment:</strong> ${amortization.monthlyPayment.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p><div class="amortization-table-container"><table class="amortization-table"><thead><tr><th>Month</th><th>Payment</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead><tbody>`;
        const formatCurrency = num => num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        amortization.schedule.forEach(row => {
            tableHTML += `<tr><td>${row.month}</td><td>${formatCurrency(row.payment)}</td><td>${formatCurrency(row.principalPayment)}</td><td>${formatCurrency(row.interestPayment)}</td><td>${formatCurrency(row.remainingBalance)}</td></tr>`;
        });
        tableHTML += `</tbody></table></div>`;
        modalBody.innerHTML = tableHTML;

        appModal.classList.add('modal--read-only'); // Add class to hide footer
        openModal(); // Open the main app modal
    }
    /**
     * Parses a 'YYYY-MM-DD' date string as UTC to avoid timezone issues.
     * @param {string} dateString - The date string to parse.
     * @returns {Date} A Date object set to midnight UTC for that date.
     */
    function parseUTCDate(dateString) {
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
     * Generates an array of Date objects for the first of each month to render.
     * @param {Date} startDate - The date to start from (e.g., new Date()).
     * @param {number} numMonths - The number of months to generate.
     * @returns {Date[]} An array of Date objects, each set to the 1st of the month.
     */
    function getMonthsToRender(startDate, numMonths) {
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
    function getOccurrencesInMonth(item, monthDate) {
        const occurrences = [];
        const itemStartDate = parseUTCDate(item.start_date);

        if (!itemStartDate) return []; // No start date, can't calculate

        // --- NEW: Determine the payoff date for loans ---
        let payoffDate = null;
        if (item.advanced_data && (item.advanced_data.item_type === 'Mortgage/Loan' || item.advanced_data.item_type === 'Car Loan')) {
            const totalPayments = item.advanced_data.total_payments;
            if (totalPayments && totalPayments > 0) {
                payoffDate = new Date(itemStartDate.getTime());
                // Set the date to the *first day* it is paid off
                // e.g., 30 payments. Start Jan 1. Last payment is June 1 (month 5 + 29). 
                // payoffDate will be July 1 (month 0 + 30).
                payoffDate.setUTCMonth(itemStartDate.getUTCMonth() + totalPayments);
            }
        }

        // Get the boundaries of the target month in UTC
        const targetYear = monthDate.getUTCFullYear();
        const targetMonth = monthDate.getUTCMonth();
        
        const monthStart = new Date(Date.UTC(targetYear, targetMonth, 1));
        // Get the *end* of the month (start of next month, minus 1 millisecond)
        const monthEnd = new Date(Date.UTC(targetYear, targetMonth + 1, 0, 23, 59, 59, 999));
        
        // Optimization: If the item starts *after* this month ends, skip it.
        if (item.interval !== 'one-time' && itemStartDate > monthEnd) {
            return [];
        }
        
        // --- NEW: Optimization: If the payoff date is *before* this month starts, skip it. ---
        if (payoffDate && payoffDate <= monthStart) {
            return [];
        }

        const itemStartDayOfMonth = itemStartDate.getUTCDate(); // e.g., 15

        switch (item.interval) {
            case 'one-time':
                if (itemStartDate >= monthStart && itemStartDate <= monthEnd) {
                    // Check against payoff date (for a 1-payment loan, this would be true)
                    if (!payoffDate || itemStartDate < payoffDate) {
                        occurrences.push(itemStartDate);
                    }
                }
                break;

            case 'monthly':
                if (itemStartDate <= monthEnd) {
                    const potentialDate = new Date(Date.UTC(targetYear, targetMonth, itemStartDayOfMonth));
                    if (potentialDate.getUTCMonth() === targetMonth && potentialDate >= monthStart && potentialDate >= itemStartDate) {
                        // --- NEW: Check if this date is before the payoff date ---
                        if (!payoffDate || potentialDate < payoffDate) {
                            occurrences.push(potentialDate);
                        }
                    }
                }
                break;

            case 'annually':
                if (itemStartDate.getUTCMonth() === targetMonth && itemStartDate <= monthEnd) {
                    const potentialDate = new Date(Date.UTC(targetYear, targetMonth, itemStartDayOfMonth));
                    if (potentialDate.getUTCMonth() === targetMonth && potentialDate >= itemStartDate) {
                         // --- NEW: Check if this date is before the payoff date ---
                        if (!payoffDate || potentialDate < payoffDate) {
                            occurrences.push(potentialDate);
                        }
                    }
                }
                break;

            case 'quarterly':
                const monthDiff = (targetMonth - itemStartDate.getUTCMonth()) + (targetYear - itemStartDate.getUTCFullYear()) * 12;
                if (monthDiff >= 0 && monthDiff % 3 === 0 && itemStartDate <= monthEnd) {
                    const potentialDate = new Date(Date.UTC(targetYear, targetMonth, itemStartDayOfMonth));
                    if (potentialDate.getUTCMonth() === targetMonth && potentialDate >= itemStartDate) {
                         // --- NEW: Check if this date is before the payoff date ---
                        if (!payoffDate || potentialDate < payoffDate) {
                            occurrences.push(potentialDate);
                        }
                    }
                }
                break;

            case 'weekly':
            case 'bi-weekly':
                const daysToAdd = (item.interval === 'weekly' ? 7 : 14);
                let currentDate = parseUTCDate(item.start_date);
                
                while (currentDate <= monthEnd) {
                    // --- NEW: Stop loop if we're at or past the payoff date ---
                    if (payoffDate && currentDate >= payoffDate) {
                        break;
                    }

                    if (currentDate >= monthStart) {
                        occurrences.push(new Date(currentDate.getTime())); // Add a copy
                    }
                    // Move to the next occurrence
                    currentDate.setUTCDate(currentDate.getUTCDate() + daysToAdd);
                }
                break;

            default:
                console.warn(`Unknown interval: ${item.interval}`);
        }
        
        return occurrences;
    }
    /**
     * Finds the status record for a specific item occurrence.
     * @param {number} itemId - The ID of the parent income/expense item.
     * @param {string} itemType - "income" or "expense".
     * @param {Date} occurrenceDate - The UTC Date object for the occurrence.
     * @returns {object | null} The transaction log entry, or null if not found.
     */
    function findTransactionStatus(itemId, itemType, occurrenceDate) {
        if (!appState.transactions) return null;
        
        // Convert the UTC date object to a 'YYYY-MM-DD' string for comparison
        const dateString = occurrenceDate.toISOString().split('T')[0];
        
        return appState.transactions.find(t =>
            t.item_id === itemId &&
            t.item_type === itemType &&
            t.occurrence_date === dateString
        );
    }
    /**
     * Saves or updates the status of a specific transaction.
     * @param {number} itemId
     * @param {string} itemType
     * @param {string} dateString - 'YYYY-MM-DD'
     * @param {string} newStatus - 'paid', 'overdue', 'pending'
     */
    async function saveTransactionStatus(itemId, itemType, dateString, newStatus) {
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) {
            showNotification("You must be logged in.", "error");
            return;
        }

        // 1. Check if a record already exists
        const existingRecord = appState.transactions.find(t =>
            t.item_id === itemId &&
            t.item_type === itemType &&
            t.occurrence_date === dateString
        );
        
        let error;

        if (existingRecord) {
            // 2. Update existing record
            console.log(`Updating status to ${newStatus} for record ${existingRecord.id}`);
            const { error: updateError } = await supabaseClient
                .from('transaction_log')
                .update({ status: newStatus })
                .eq('id', existingRecord.id);
            error = updateError;
        } else {
            // 3. Insert new record
            console.log(`Inserting new ${newStatus} record for item ${itemId} on ${dateString}`);
            const { error: insertError } = await supabaseClient
                .from('transaction_log')
                .insert({
                    user_id: user.id,
                    item_id: itemId,
                    item_type: itemType,
                    occurrence_date: dateString,
                    status: newStatus
                });
            error = insertError;
        }

        if (error) {
            console.error("Error saving transaction status:", error);
            showNotification(`Error saving status: ${error.message}`, "error");
        } else {
            // 4. Refresh data to show the change
            await fetchData();
            showNotification("Status updated!", "success");
        }
    }
    /**
     * Renders the initial configuration UI for the Yearly Summary view.
     */
    function renderYearlyConfigUI() {
        // Render the config UI into the left panel
        gridYearlySummaryPanel.innerHTML = `
            <h3>Yearly Forecast</h3>
            <p>Select the number of years to forecast.</p>
            <div class="form-group">
                <label for="yearly-forecast-years">Years (1-30):</label>
                <input type="number" id="yearly-forecast-years" value="10" min="1" max="30" step="1">
            </div>
            <button id="btn-generate-yearly-summary" class="btn-primary">Generate Summary</button>
            <div id="yearly-summary-table-container">
                </div>
        `;
        
        // Clear the right (detail) panel
        gridDetailContent.innerHTML = '<p>Click a year in the summary to see details.</p>';
    }
    /**
     * Calculates the total annual value of a list of items for a specific year.
     * @param {object[]} items - The array of income or expense items.
     * @param {number} year - The specific year (e.g., 2025) to calculate for.
     * @returns {number} The total value of all items for that year.
     */
    function calculateYearlyTotals(items, year) {
        let total = 0;

        items.forEach(item => {
            const itemStartDate = parseUTCDate(item.start_date);
            if (!itemStartDate) return; // Skip items without a start date
            
            const itemStartYear = itemStartDate.getUTCFullYear();
            const itemStartMonth = itemStartDate.getUTCMonth(); // 0-11

            // Item hasn't started yet, so it contributes 0
            if (year < itemStartYear) {
                return; 
            }

            let amountPerYear = 0;

            switch (item.interval) {
                case 'monthly':
                    amountPerYear = item.amount * 12;
                    break;
                case 'annually':
                    amountPerYear = item.amount;
                    break;
                case 'quarterly':
                    amountPerYear = item.amount * 4;
                    break;
                case 'bi-weekly':
                    amountPerYear = item.amount * 26;
                    break;
                case 'weekly':
                    amountPerYear = item.amount * 52;
                    break;
                case 'one-time':
                    // Only add if the item's start year is this year
                    if (itemStartYear === year) {
                        amountPerYear = item.amount;
                    }
                    break;
                default:
                    amountPerYear = 0;
            }

            // Special handling for the item's first year
            if (year === itemStartYear) {
                // Prorate the first year based on the start month
                const monthsRemaining = 12 - itemStartMonth;
                
                switch (item.interval) {
                    case 'monthly':
                        amountPerYear = item.amount * monthsRemaining;
                        break;
                    case 'annually':
                        amountPerYear = item.amount; // Already counted
                        break;
                    case 'quarterly':
                        // Count how many quarters are left
                        let quarters = 0;
                        for (let m = itemStartMonth; m < 12; m += 3) {
                            quarters++;
                        }
                        amountPerYear = item.amount * quarters;
                        break;
                    // For weekly/bi-weekly, a simple proration is close enough for a high-level summary
                    case 'bi-weekly':
                        amountPerYear = (item.amount * 26) * (monthsRemaining / 12);
                        break;
                    case 'weekly':
                        amountPerYear = (item.amount * 52) * (monthsRemaining / 12);
                        break;
                    case 'one-time':
                        amountPerYear = item.amount; // Already counted
                        break;
                }
            }
            
            // --- CORRECTED LOAN PAYOFF LOGIC ---
            if (item.advanced_data && (item.advanced_data.item_type === 'Mortgage/Loan' || item.advanced_data.item_type === 'Car Loan')) {
                const totalPayments = item.advanced_data.total_payments; // in months
                if (totalPayments) {
                    // Calculate the exact payoff date
                    const payoffDate = new Date(itemStartDate.getTime());
                    payoffDate.setUTCMonth(itemStartDate.getUTCMonth() + totalPayments);

                    const payoffYear = payoffDate.getUTCFullYear();
                    const payoffMonth = payoffDate.getUTCMonth(); // 0-11
                    
                    if (year > payoffYear) {
                        amountPerYear = 0; // Loan is paid off
                    } else if (year === payoffYear) {
                        // Prorate the final year
                        // payoffMonth is 0-indexed, so 0 (Jan) means 1 month of payment.
                        const monthsInLastYear = payoffMonth + 1; 

                         switch (item.interval) {
                            case 'monthly':
                                // If it also started this year, don't double-dip proration
                                // Use the smaller of the two partial year values
                                const firstYearMonths = 12 - itemStartMonth;
                                amountPerYear = item.amount * (year === itemStartYear ? Math.min(monthsInLastYear, firstYearMonths) : monthsInLastYear);
                                break;
                            // Add other intervals if loans can be non-monthly
                            default:
                                // Fallback for safety
                                amountPerYear = item.amount * (year === itemStartYear ? Math.min(monthsInLastYear, 12 - itemStartMonth) : monthsInLastYear);
                         }
                    }
                }
            }
            
            total += amountPerYear;
        });

        return total;
    }
    /**
     * Calculates and renders the N-year summary table into the left panel.
     */
    function renderYearlySummaryTable() {
        const numYearsInput = document.getElementById('yearly-forecast-years');
        const numYears = parseInt(numYearsInput.value, 10);

        if (isNaN(numYears) || numYears < 1 || numYears > 30) {
            showNotification("Please enter a number of years between 1 and 30.", "error");
            return;
        }

        const tableContainer = document.getElementById('yearly-summary-table-container');
        if (!tableContainer) {
            console.error("Could not find #yearly-summary-table-container");
            return;
        }

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
                    <tr>
                        <th>Year</th>
                        <th>Income</th>
                        <th>Expenses</th>
                        <th>Yearly Net</th>
                        <th>Overall Net</th>
                    </tr>
                </thead>
                <tbody>
        `;

        for (let i = 0; i < numYears; i++) {
            const currentYear = startYear + i;
            
            // Calculate totals for the current year
            const totalIncome = calculateYearlyTotals(appState.incomes, currentYear);
            const totalExpense = calculateYearlyTotals(appState.expenses, currentYear);
            const yearlyNet = totalIncome - totalExpense;
            runningOverallNet += yearlyNet;

            // Add the row
            tableHTML += `
                <tr class="year-summary-row" data-year="${currentYear}">
                    <td><button class="btn-link" data-year="${currentYear}">${currentYear}</button></td>
                    <td>${formatCurrency(totalIncome)}</td>
                    <td>${formatCurrency(totalExpense)}</td>
                    <td>${formatCurrency(yearlyNet)}</td>
                    <td>${formatCurrency(runningOverallNet)}</td>
                </tr>
            `;
        }

        tableHTML += `</tbody></table>`;
        tableContainer.innerHTML = tableHTML;
        
        // Hide the config UI
        document.getElementById('yearly-forecast-years').style.display = 'none';
        document.getElementById('btn-generate-yearly-summary').style.display = 'none';
    }
    /**
     * Calculates the payment number for a loan based on its occurrence date.
     * @param {string} startDateString - The 'YYYY-MM-DD' start date of the loan.
     * @param {Date} occurrenceDate - The UTC Date object of the specific payment.
     * @param {string} interval - The item's interval ('monthly', 'weekly', etc.).
     * @returns {number} The payment number (e.g., 1, 2, 30).
     */
    function calculatePaymentNumber(startDateString, occurrenceDate, interval) {
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
    // === EVENT LISTENERS ===
    gridContentArea.addEventListener('contextmenu', (event) => {
        event.preventDefault(); // Stop the default right-click menu
        
        const row = event.target.closest('tr');
        if (!row || !row.dataset.itemId) { // Not a valid data row
            gridContextMenu.classList.add('modal-hidden');
            return;
        }

        // Store the data from the row
        currentContextItem = {
            itemId: parseInt(row.dataset.itemId),
            itemType: row.dataset.itemType,
            dateString: row.dataset.date
        };

        // Position and show the menu
        gridContextMenu.style.top = `${event.clientY}px`;
        gridContextMenu.style.left = `${event.clientX}px`;
        gridContextMenu.classList.remove('modal-hidden');
    });
    gridContextMenu.addEventListener('click', (event) => {
        const newStatus = event.target.dataset.status;
        if (newStatus && currentContextItem) {
            // Call our save function
            saveTransactionStatus(
                currentContextItem.itemId,
                currentContextItem.itemType,
                currentContextItem.dateString,
                newStatus
            );
        }
        // Hide the menu and clear the temp data
        gridContextMenu.classList.add('modal-hidden');
        currentContextItem = null;
    });
    document.addEventListener('click', (event) => {
        // Hide if the click is outside the menu
        if (!gridContextMenu.contains(event.target)) {
            gridContextMenu.classList.add('modal-hidden');
            currentContextItem = null;
        }
    });
    supabaseClient.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event);
        updateUserStatus(session?.user);
        if (session) {
            fetchData();
        } else {
            appState = { incomes: [], expenses: [] };
            renderAll();
        }
    });
    toggleDashboardBtn.addEventListener('click', () => {
        const isExpanding = !mainContainer.classList.contains('dashboard-expanded');
        mainContainer.classList.toggle('dashboard-expanded');

        // Show/Hide default vs expanded content
        if (isExpanding) {
            dashboardSummary.style.display = 'none';
            summaryChartContainer.style.display = 'none';
            expandedDashboardContent.style.display = 'flex'; // Use flex display
            setActiveDashboardTab(activeDashboardTab); // Ensure correct initial tab/view renders
        } else {
            dashboardSummary.style.display = 'block';
            summaryChartContainer.style.display = 'block';
            expandedDashboardContent.style.display = 'none';
        }
    });
    darkModeToggle.addEventListener('change', () => {
        if (darkModeToggle.checked) {
            setMode('dark');
        } else {
            setMode('light');
        }
    });
    dashboardTabsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('tab-btn')) {
            setActiveDashboardTab(event.target.dataset.tab);
        }
    });
    viewControlsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('view-btn')) {
            const viewId = event.target.dataset.view;
            if (activeDashboardTab === 'grids') {
                setActiveGridView(viewId);
            } else if (activeDashboardTab === 'charts') {
                setActiveChartView(viewId);
            }
        }
    });
    gridContentArea.addEventListener('click', (event) => {
        const target = event.target;

        // 1. Handle "Generate Summary" click
        if (target.id === 'btn-generate-yearly-summary') {
            renderYearlySummaryTable();
            return; 
        }
        
        // 2. Handle "Reset" click
        if (target.id === 'btn-reset-yearly-summary') {
            renderYearlyConfigUI(); // Re-render the initial config UI
            return; 
        }
        
        // 3. Handle click on a "Year" button (btn-link)
        if (target.classList.contains('btn-link') && target.dataset.year) {
            const clickedYear = parseInt(target.dataset.year, 10);
            if (isNaN(clickedYear)) return;
            
            // --- NEW: Calculate the starting net total from all *previous* years ---
            let startingNetTotal = 0;
            const startYear = new Date().getFullYear();
            
            for (let y = startYear; y < clickedYear; y++) {
                const yearIncome = calculateYearlyTotals(appState.incomes, y);
                const yearExpense = calculateYearlyTotals(appState.expenses, y);
                startingNetTotal += (yearIncome - yearExpense);
            }
            // --- END NEW CALCULATION ---
            
            // Create a start date for Jan 1 of the *clicked* year
            const startDate = new Date(Date.UTC(clickedYear, 0, 1));
            
            // Clear the detail panel and render the 12-month grid, passing the starting total
            gridDetailContent.innerHTML = renderGridView(12, startDate, startingNetTotal); 
            
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
                showIncomeModal(undefined, prefillData);
            } else if (type === 'expense') {
                showExpenseModal(undefined, prefillData);
            }
            return; 
        }
    });
    authModalCloseBtn.addEventListener('click', closeAuthModal);
    authModal.addEventListener('click', (event) => { if (event.target === authModal) closeAuthModal(); });
    emailAuthForm.addEventListener('submit', handleEmailAuth);
    githubLoginBtn.addEventListener('click', handleGitHubLogin);
    showIncomeModalBtn.addEventListener('click', () => showIncomeModal());
    showExpenseModalBtn.addEventListener('click', () => showExpenseModal());
    modalSaveBtn.addEventListener('click', () => { if (onSave) onSave(); });
    modalCloseBtn.addEventListener('click', closeModal);
    modalCancelBtn.addEventListener('click', closeModal);
    appModal.addEventListener('click', (event) => { if (event.target === appModal) closeModal(); });
    incomeList.addEventListener('click', handleListClick);
    expenseList.addEventListener('click', handleListClick);
    // === INITIALIZATION ===
    loadMode(); 
    initializeFooter();
});