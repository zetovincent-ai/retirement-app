document.addEventListener('DOMContentLoaded', () => {
    // === SUPABASE INITIALIZATION ===
    const SUPABASE_URL = 'https://mwuxrrwbgytbqrlhzwsc.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13dXhycndiZ3l0YnFybGh6d3NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MjcxNTYsImV4cCI6MjA3NjEwMzE1Nn0.up3JOKKXEyw6axEGhI2eESJbrZzoH-93zRmCSXukYZY';
    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // === STATE MANAGEMENT ===
    let appState = { incomes: [], expenses: [] };
    let onSave = null;
    let expenseChartInstance = null;

    // === DOM SELECTORS ===
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
    const expenseChartCanvas = document.getElementById('expense-chart');
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const settingsModalCloseBtn = document.getElementById('settings-modal-close-btn');
    const themeSwitcher = document.getElementById('theme-switcher');

    // === FUNCTIONS ===

    // --- THEME FUNCTIONS (Now with DB persistence) ---
    async function applyTheme(themeName) {
        document.body.dataset.theme = themeName; // Apply theme visually immediately

        const { data: { user } } = await supabaseClient.auth.getUser();
        if (user) {
            // Upsert saves the theme setting to the database
            // It tries to update the row matching user_id; if it doesn't exist, it inserts it.
            const { error } = await supabaseClient
                .from('user_settings')
                .upsert({ user_id: user.id, settings: { theme: themeName } }, { onConflict: 'user_id' }); // Specify user_id as the conflict target

            if (error) console.error('Error saving theme:', error);
        } else {
            // Fallback to localStorage if user is not logged in (optional, good for immediate visual feedback)
            localStorage.setItem('sunflower-theme-local', themeName);
        }
    }

    async function loadTheme() {
        const { data: { user } } = await supabaseClient.auth.getUser();
        let theme = 'default'; // Default theme

        if (user) {
            // Try loading theme from the database for the logged-in user
            const { data, error } = await supabaseClient
                .from('user_settings')
                .select('settings')
                .eq('user_id', user.id)
                .single(); // We expect only one row per user

            // Ignore "PGRST116" error which means no settings row found yet for this user
            if (error && error.code !== 'PGRST116') {
                 console.error('Error loading theme:', error);
            }
            // If settings exist and have a theme property, use it
            if (data && data.settings && data.settings.theme) {
                theme = data.settings.theme;
            }
        } else {
            // Fallback to localStorage if not logged in
            theme = localStorage.getItem('sunflower-theme-local') || 'default';
        }

        document.body.dataset.theme = theme; // Apply the loaded theme
        if (themeSwitcher) { // Check if element exists before setting value
            themeSwitcher.value = theme; // Set the dropdown to the correct value
        }
    }

    // --- SETTINGS MODAL FUNCTIONS ---
    function openSettingsModal() { settingsModal.classList.remove('modal-hidden'); }
    function closeSettingsModal() { settingsModal.classList.add('modal-hidden'); }

    // --- DATABASE FUNCTIONS ---
    async function fetchData() {
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) {
             // If no user, clear the state and render empty lists/dashboard
             appState = { incomes: [], expenses: [] };
             renderAll();
             return;
        }
        // Fetch incomes for the logged-in user
        const { data: incomes, error: incomesError } = await supabaseClient.from('incomes').select('*').eq('user_id', user.id);
        if (incomesError) console.error('Error fetching incomes:', incomesError);
        else appState.incomes = incomes || []; // Ensure it's an array even if null

        // Fetch expenses for the logged-in user
        const { data: expenses, error: expensesError } = await supabaseClient.from('expenses').select('*').eq('user_id', user.id);
        if (expensesError) console.error('Error fetching expenses:', expensesError);
        else appState.expenses = expenses || []; // Ensure it's an array even if null

        renderAll(); // Re-render the UI with the fetched data
    }

    // --- AUTH FUNCTIONS ---
    async function handleLogin() {
        const { error } = await supabaseClient.auth.signInWithOAuth({ provider: 'github' });
        if (error) console.error('Error logging in:', error);
    }

    async function handleLogout() {
        const { error } = await supabaseClient.auth.signOut();
        if (error) console.error('Error logging out:', error);
    }

    function updateUserStatus(user) {
        if (user) {
            userStatus.innerHTML = `Logged in as ${user.email} <button id="logout-btn" class="btn-secondary">Logout</button>`;
            // Ensure listener is only added once
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                 // Remove previous listener if exists to prevent duplicates
                 logoutBtn.removeEventListener('click', handleLogout);
                 logoutBtn.addEventListener('click', handleLogout);
            }
        } else {
            userStatus.innerHTML = `<button id="login-btn" class="btn-primary">Login with GitHub</button>`;
            // Ensure listener is only added once
            const loginBtn = document.getElementById('login-btn');
            if (loginBtn) {
                 // Remove previous listener if exists
                 loginBtn.removeEventListener('click', handleLogin);
                 loginBtn.addEventListener('click', handleLogin);
            }
        }
    }

    // --- DATA MODAL FUNCTIONS ---
    function openModal() { appModal.classList.remove('modal-hidden'); }
    function closeModal() { appModal.classList.add('modal-hidden'); modalBody.innerHTML = ''; onSave = null; }

    function showIncomeModal(incomeId) {
        const isEditMode = incomeId !== undefined;
        const incomeToEdit = isEditMode ? appState.incomes.find(i => i.id === incomeId) : null;
        modalTitle.textContent = isEditMode ? 'Edit Income' : 'Add New Income';
        modalBody.innerHTML = `<div class="form-group"><label for="modal-income-type">Type:</label><select id="modal-income-type" required><option value="">-- Select a Type --</option><option value="Pension">Pension</option><option value="TSP">TSP</option><option value="TSP Supplement">TSP Supplement</option><option value="Social Security">Social Security</option><option value="Investment">Investment Dividend</option><option value="Other">Other</option></select></div><div class="form-group"><label for="modal-income-name">Description / Name:</label><input type="text" id="modal-income-name" placeholder="e.g., Vincent's TSP" required></div><div class="form-group"><label for="modal-income-interval">Payment Interval:</label><select id="modal-income-interval" required><option value="monthly">Monthly</option><option value="annually">Annually</option><option value="quarterly">Quarterly</option><option value="bi-weekly">Bi-Weekly</option></select></div><div class="form-group"><label for="modal-income-amount">Payment Amount:</label><input type="number" id="modal-income-amount" placeholder="1500" min="0" step="0.01" required></div>`;
        if (isEditMode && incomeToEdit) { // Check if incomeToEdit is found
            document.getElementById('modal-income-type').value = incomeToEdit.type;
            document.getElementById('modal-income-name').value = incomeToEdit.name;
            document.getElementById('modal-income-interval').value = incomeToEdit.interval;
            document.getElementById('modal-income-amount').value = incomeToEdit.amount;
        }
        onSave = async () => {
            const { data: { user } } = await supabaseClient.auth.getUser();
            if (!user) { alert("You must be logged in to save data."); return; }
            const formItem = { user_id: user.id, type: document.getElementById('modal-income-type').value, name: document.getElementById('modal-income-name').value.trim(), interval: document.getElementById('modal-income-interval').value, amount: parseFloat(document.getElementById('modal-income-amount').value) };
            if (!formItem.type || !formItem.name || isNaN(formItem.amount) || formItem.amount < 0) { alert("Please fill out all fields correctly (amount cannot be negative)."); return; }
            let { error } = isEditMode ? await supabaseClient.from('incomes').update(formItem).eq('id', incomeId) : await supabaseClient.from('incomes').insert(formItem);
            if (error) console.error("Error saving income:", error); else await fetchData(); // Refetch data on success
            closeModal();
        };
        openModal();
    }

    function showExpenseModal(expenseId) {
        const isEditMode = expenseId !== undefined;
        const expenseToEdit = isEditMode ? appState.expenses.find(e => e.id === expenseId) : null;
        modalTitle.textContent = isEditMode ? 'Edit Expense' : 'Add New Expense';
        modalBody.innerHTML = `<div class="form-group"><label for="modal-expense-category">Category:</label><select id="modal-expense-category" required><option value="">-- Select a Category --</option><option value="Housing">Housing</option><option value="Groceries">Groceries</option><option value="Utilities">Utilities</option><option value="Transport">Transport</option><option value="Health">Health</option><option value="Entertainment">Entertainment</option><option value="Other">Other</option></select></div><div class="form-group"><label for="modal-expense-name">Description / Name:</label><input type="text" id="modal-expense-name" placeholder="e.g., Electric Bill" required></div><div class="form-group"><label for="modal-expense-interval">Payment Interval:</label><select id="modal-expense-interval" required><option value="monthly">Monthly</option><option value="annually">Annually</option><option value="quarterly">Quarterly</option><option value="bi-weekly">Bi-Weekly</option><option value="weekly">Weekly</option></select></div><div class="form-group"><label for="modal-expense-amount">Amount:</label><input type="number" id="modal-expense-amount" placeholder="100" min="0" step="0.01" required></div>`;
        if (isEditMode && expenseToEdit) { // Check if expenseToEdit is found
            document.getElementById('modal-expense-category').value = expenseToEdit.category;
            document.getElementById('modal-expense-name').value = expenseToEdit.name;
            document.getElementById('modal-expense-interval').value = expenseToEdit.interval;
            document.getElementById('modal-expense-amount').value = expenseToEdit.amount;
        }
        onSave = async () => {
            const { data: { user } } = await supabaseClient.auth.getUser();
            if (!user) { alert("You must be logged in to save data."); return; }
            const formItem = { user_id: user.id, category: document.getElementById('modal-expense-category').value, name: document.getElementById('modal-expense-name').value.trim(), interval: document.getElementById('modal-expense-interval').value, amount: parseFloat(document.getElementById('modal-expense-amount').value) };
            if (!formItem.category || !formItem.name || isNaN(formItem.amount) || formItem.amount < 0) { alert("Please fill out all fields correctly (amount cannot be negative)."); return; }
            let { error } = isEditMode ? await supabaseClient.from('expenses').update(formItem).eq('id', expenseId) : await supabaseClient.from('expenses').insert(formItem);
            if (error) console.error("Error saving expense:", error); else await fetchData(); // Refetch data on success
            closeModal();
        };
        openModal();
    }

    // --- RENDER & UTILITY FUNCTIONS ---
    function renderAll() {
        renderIncomes();
        renderExpenses();
        renderDashboard();
        renderExpenseChart();
    }
    
    function renderDashboard() {
        const totalMonthlyIncome = calculateMonthlyTotal(appState.incomes);
        const totalMonthlyExpenses = calculateMonthlyTotal(appState.expenses);
        const netMonthly = totalMonthlyIncome - totalMonthlyExpenses;
        const format = num => num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        dashboardSummary.innerHTML = `<div class="summary-item"><h3 class="income-total">Total Monthly Income</h3><p class="income-total">${format(totalMonthlyIncome)}</p></div><div class="summary-item"><h3 class="expense-total">Total Monthly Expenses</h3><p class="expense-total">${format(totalMonthlyExpenses)}</p></div><div class="summary-item net-total"><h3>Net Monthly Balance</h3><p>${format(netMonthly)}</p></div>`;
    }

    function renderIncomes() { renderList(appState.incomes, incomeList); }
    function renderExpenses() { renderList(appState.expenses, expenseList); }

    function renderList(items, listElement) {
        listElement.innerHTML = '';
        const listType = listElement.id.includes('income') ? 'income' : 'expense';
        if (!items || items.length === 0) { // Add null check for items
             listElement.innerHTML = `<li>No ${listType}s added yet.</li>`;
             return;
        }
        items.forEach(item => {
            // Check for null item (safety check)
            if (!item) return;

            const li = document.createElement('li');
            // Check if amount is a number before formatting
            const formattedAmount = typeof item.amount === 'number'
                ? item.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                : 'N/A';
            const intervalText = item.interval ? ` / ${item.interval}` : '';
            const typeOrCategory = item.type || item.category || 'N/A'; // Provide default if missing
            const name = item.name || 'Unnamed'; // Provide default if missing

            li.innerHTML = `<div class="item-details"><strong>${name}</strong> (${typeOrCategory})<br><span>${formattedAmount}${intervalText}</span></div><div class="item-controls"><button class="edit-btn" data-id="${item.id}">Edit</button><button class="delete-btn" data-id="${item.id}">X</button></div>`;
            listElement.appendChild(li);
        });
    }
    
    function renderExpenseChart() {
        if (!expenseChartCanvas) return; // Ensure canvas exists

        const categoryTotals = {};
        if (appState.expenses) { // Check if expenses exist
            appState.expenses.forEach(expense => {
                if (!expense || typeof expense.amount !== 'number') return; // Skip invalid expense items
                const monthlyAmount = calculateMonthlyTotal([expense]); // Calculate based on valid item
                if (!categoryTotals[expense.category]) {
                    categoryTotals[expense.category] = 0;
                }
                categoryTotals[expense.category] += monthlyAmount;
            });
        }

        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);

        if (expenseChartInstance) {
            expenseChartInstance.destroy();
            expenseChartInstance = null; // Reset instance after destroying
        }
        // Also clear the canvas if there's no data
        const ctx = expenseChartCanvas.getContext('2d');
        ctx.clearRect(0, 0, expenseChartCanvas.width, expenseChartCanvas.height);

        if (labels.length === 0) return; // Exit if no valid data

        expenseChartInstance = new Chart(ctx, {
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
                plugins: { legend: { position: 'top' } }
            }
        });
    }

    async function handleListClick(event) {
        const target = event.target;
        if (!target.classList.contains('edit-btn') && !target.classList.contains('delete-btn')) return;
        const id = parseInt(target.dataset.id); // Supabase IDs are numbers
        if (isNaN(id)) return; // Ensure ID is valid

        const listId = target.closest('.item-list')?.id; // Use optional chaining
        if (!listId) return;

        if (target.classList.contains('edit-btn')) {
            if (listId === 'income-list') showIncomeModal(id);
            else if (listId === 'expense-list') showExpenseModal(id);
        }
        if (target.classList.contains('delete-btn')) {
            const tableName = listId === 'income-list' ? 'incomes' : 'expenses';
            const { error } = await supabaseClient.from(tableName).delete().eq('id', id);
            if (error) console.error(`Error deleting from ${tableName}:`, error);
            else await fetchData(); // Refetch data on success
        }
    }

    function calculateMonthlyTotal(items) {
        if (!items) return 0; // Handle case where items might be null/undefined
        return items.reduce((total, item) => {
             // Basic validation within reduce
             if (!item || typeof item.amount !== 'number' || item.amount < 0) {
                  return total;
             }
            switch (item.interval) {
                case 'monthly': return total + item.amount;
                case 'annually': return total + (item.amount / 12);
                case 'quarterly': return total + (item.amount / 3);
                case 'bi-weekly': return total + ((item.amount * 26) / 12);
                case 'weekly': return total + ((item.amount * 52) / 12);
                default: return total; // Ignore if interval is unknown
            }
        }, 0);
    }
    
    // === EVENT LISTENERS ===
    supabaseClient.auth.onAuthStateChange(async (event, session) => {
        updateUserStatus(session?.user);
        await loadTheme(); // Load theme when auth state changes (login/logout/initial load)
        if (session) {
            fetchData(); // Fetch main data after theme is potentially loaded
        } else {
            // Clear state and UI if logged out
            appState = { incomes: [], expenses: [] };
            renderAll();
        }
    });

    toggleDashboardBtn.addEventListener('click', () => { mainContainer.classList.toggle('dashboard-expanded'); });
    themeSwitcher.addEventListener('change', (event) => applyTheme(event.target.value));
    settingsBtn.addEventListener('click', openSettingsModal);
    settingsModalCloseBtn.addEventListener('click', closeSettingsModal);
    settingsModal.addEventListener('click', (event) => { if (event.target === settingsModal) closeSettingsModal(); });
    showIncomeModalBtn.addEventListener('click', () => showIncomeModal());
    showExpenseModalBtn.addEventListener('click', () => showExpenseModal());
    modalSaveBtn.addEventListener('click', () => { if (onSave) onSave(); });
    modalCloseBtn.addEventListener('click', closeModal);
    modalCancelBtn.addEventListener('click', closeModal);
    appModal.addEventListener('click', (event) => { if (event.target === appModal) closeModal(); });
    incomeList.addEventListener('click', handleListClick);
    expenseList.addEventListener('click', handleListClick);

    // No initial loadTheme() here, it's handled by onAuthStateChange
});