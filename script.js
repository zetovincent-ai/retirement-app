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

    // --- THEME FUNCTIONS (Using localStorage) ---
    function applyTheme(themeName) {
        document.body.dataset.theme = themeName;
        localStorage.setItem('sunflower-theme', themeName); // Save to localStorage
    }

    function loadTheme() {
        const savedTheme = localStorage.getItem('sunflower-theme') || 'default';
        applyTheme(savedTheme);
        themeSwitcher.value = savedTheme;
    }

    // --- SETTINGS MODAL FUNCTIONS ---
    function openSettingsModal() { settingsModal.classList.remove('modal-hidden'); }
    function closeSettingsModal() { settingsModal.classList.add('modal-hidden'); }

    // --- DATABASE FUNCTIONS ---
    async function fetchData() {
        console.log("Attempting to fetch data..."); // Diagnostic log
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) {
             console.log("No user logged in, clearing data."); // Diagnostic log
             appState = { incomes: [], expenses: [] };
             renderAll();
             return;
        }
        console.log("User found, fetching incomes and expenses..."); // Diagnostic log
        const { data: incomes, error: incomesError } = await supabaseClient.from('incomes').select('*').eq('user_id', user.id);
        if (incomesError) console.error('Error fetching incomes:', incomesError);
        else appState.incomes = incomes || [];

        const { data: expenses, error: expensesError } = await supabaseClient.from('expenses').select('*').eq('user_id', user.id);
        if (expensesError) console.error('Error fetching expenses:', expensesError);
        else appState.expenses = expenses || [];

        console.log("Data fetched, rendering UI."); // Diagnostic log
        renderAll();
    }

    // --- AUTH FUNCTIONS ---
    async function handleLogin() {
        console.log("Login initiated..."); // Diagnostic log
        const { error } = await supabaseClient.auth.signInWithOAuth({ provider: 'github' });
        if (error) console.error('Error logging in:', error);
    }

    async function handleLogout() {
        console.log("Logout initiated..."); // Diagnostic log
        const { error } = await supabaseClient.auth.signOut();
        if (error) console.error('Error logging out:', error);
        // No need to clear state here, onAuthStateChange handles it
    }

    function updateUserStatus(user) {
        console.log("Updating user status UI for user:", user ? user.email : 'null'); // Diagnostic log
        if (user) {
            userStatus.innerHTML = `Logged in as ${user.email} <button id="logout-btn" class="btn-secondary">Logout</button>`;
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                 // Clean up previous listener before adding new one
                 logoutBtn.removeEventListener('click', handleLogout);
                 logoutBtn.addEventListener('click', handleLogout);
            } else {
                 console.error("Logout button not found after update."); // Diagnostic log
            }
        } else {
            userStatus.innerHTML = `<button id="login-btn" class="btn-primary">Login with GitHub</button>`;
            const loginBtn = document.getElementById('login-btn');
            if (loginBtn) {
                 // Clean up previous listener before adding new one
                 loginBtn.removeEventListener('click', handleLogin);
                 loginBtn.addEventListener('click', handleLogin);
            } else {
                 console.error("Login button not found after update."); // Diagnostic log
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
        if (isEditMode && incomeToEdit) {
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
            if (error) console.error("Error saving income:", error); else await fetchData();
            closeModal();
        };
        openModal();
    }

    function showExpenseModal(expenseId) {
        const isEditMode = expenseId !== undefined;
        const expenseToEdit = isEditMode ? appState.expenses.find(e => e.id === expenseId) : null;
        modalTitle.textContent = isEditMode ? 'Edit Expense' : 'Add New Expense';
        modalBody.innerHTML = `<div class="form-group"><label for="modal-expense-category">Category:</label><select id="modal-expense-category" required><option value="">-- Select a Category --</option><option value="Housing">Housing</option><option value="Groceries">Groceries</option><option value="Utilities">Utilities</option><option value="Transport">Transport</option><option value="Health">Health</option><option value="Entertainment">Entertainment</option><option value="Other">Other</option></select></div><div class="form-group"><label for="modal-expense-name">Description / Name:</label><input type="text" id="modal-expense-name" placeholder="e.g., Electric Bill" required></div><div class="form-group"><label for="modal-expense-interval">Payment Interval:</label><select id="modal-expense-interval" required><option value="monthly">Monthly</option><option value="annually">Annually</option><option value="quarterly">Quarterly</option><option value="bi-weekly">Bi-Weekly</option><option value="weekly">Weekly</option></select></div><div class="form-group"><label for="modal-expense-amount">Amount:</label><input type="number" id="modal-expense-amount" placeholder="100" min="0" step="0.01" required></div>`;
        if (isEditMode && expenseToEdit) {
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
            if (error) console.error("Error saving expense:", error); else await fetchData();
            closeModal();
        };
        openModal();
    }

    // --- RENDER & UTILITY FUNCTIONS ---
    function renderAll() {
        console.log("Rendering UI..."); // Diagnostic log
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
        if (!items || items.length === 0) {
             listElement.innerHTML = `<li>No ${listType}s added yet.</li>`;
             return;
        }
        items.forEach(item => {
            if (!item) return;
            const li = document.createElement('li');
            const formattedAmount = typeof item.amount === 'number' ? item.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : 'N/A';
            const intervalText = item.interval ? ` / ${item.interval}` : '';
            const typeOrCategory = item.type || item.category || 'N/A';
            const name = item.name || 'Unnamed';
            li.innerHTML = `<div class="item-details"><strong>${name}</strong> (${typeOrCategory})<br><span>${formattedAmount}${intervalText}</span></div><div class="item-controls"><button class="edit-btn" data-id="${item.id}">Edit</button><button class="delete-btn" data-id="${item.id}">X</button></div>`;
            listElement.appendChild(li);
        });
    }
    
    function renderExpenseChart() {
        if (!expenseChartCanvas) return;
        const categoryTotals = {};
        if (appState.expenses) {
            appState.expenses.forEach(expense => {
                if (!expense || typeof expense.amount !== 'number') return;
                const monthlyAmount = calculateMonthlyTotal([expense]);
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
            expenseChartInstance = null;
        }
        const ctx = expenseChartCanvas.getContext('2d');
        ctx.clearRect(0, 0, expenseChartCanvas.width, expenseChartCanvas.height);
        if (labels.length === 0) return;
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
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } } }
        });
    }

    async function handleListClick(event) {
        const target = event.target;
        if (!target.classList.contains('edit-btn') && !target.classList.contains('delete-btn')) return;
        const id = parseInt(target.dataset.id);
        if (isNaN(id)) return;
        const listId = target.closest('.item-list')?.id;
        if (!listId) return;
        if (target.classList.contains('edit-btn')) {
            if (listId === 'income-list') showIncomeModal(id);
            else if (listId === 'expense-list') showExpenseModal(id);
        }
        if (target.classList.contains('delete-btn')) {
            const tableName = listId === 'income-list' ? 'incomes' : 'expenses';
            const { error } = await supabaseClient.from(tableName).delete().eq('id', id);
            if (error) console.error(`Error deleting from ${tableName}:`, error);
            else await fetchData();
        }
    }

    function calculateMonthlyTotal(items) {
        if (!items) return 0;
        return items.reduce((total, item) => {
             if (!item || typeof item.amount !== 'number' || item.amount < 0) return total;
            switch (item.interval) {
                case 'monthly': return total + item.amount;
                case 'annually': return total + (item.amount / 12);
                case 'quarterly': return total + (item.amount / 3);
                case 'bi-weekly': return total + ((item.amount * 26) / 12);
                case 'weekly': return total + ((item.amount * 52) / 12);
                default: return total;
            }
        }, 0);
    }
    
    // === EVENT LISTENERS ===
    supabaseClient.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event); // Diagnostic log
        updateUserStatus(session?.user);
        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
             // Load theme only after confirming user session is established or user signed in
             await loadTheme();
             fetchData();
        } else if (event === 'SIGNED_OUT') {
             // When user logs out, clear state, render, and reset theme
             appState = { incomes: [], expenses: [] };
             renderAll();
             applyTheme('default'); // Reset theme to default on logout
             if(themeSwitcher) themeSwitcher.value = 'default'; // Reset dropdown
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

    // Initial theme load on page start (uses localStorage or default)
    loadTheme();
});