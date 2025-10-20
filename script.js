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
    // NOTE: saveSettingsBtn selector is removed as the button doesn't exist in this version's HTML

    // === FUNCTIONS ===

    // --- THEME FUNCTIONS (Using localStorage) ---
    function applyTheme(themeName) {
        document.body.dataset.theme = themeName;
        localStorage.setItem('sunflower-theme', themeName); // Save to localStorage
    }

    function loadTheme() {
        const savedTheme = localStorage.getItem('sunflower-theme') || 'default';
        applyTheme(savedTheme);
        if(themeSwitcher) {
            themeSwitcher.value = savedTheme;
        } else {
            // This might happen briefly on initial load before all elements are ready
            // console.warn("Theme switcher element not found during loadTheme.");
        }
    }

    // --- SETTINGS MODAL FUNCTIONS ---
    function openSettingsModal() { settingsModal.classList.remove('modal-hidden'); }
    function closeSettingsModal() { settingsModal.classList.add('modal-hidden'); }

    // --- DATABASE FUNCTIONS ---
    async function fetchData() {
        console.log("Attempting to fetch data...");
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) {
             console.log("No user logged in for fetchData, clearing local state.");
             appState = { incomes: [], expenses: [] };
             renderAll();
             return;
        }
        console.log("Fetching incomes and expenses for user:", user.id);
        // Use Promise.all to fetch both concurrently
        const [incomesRes, expensesRes] = await Promise.all([
            supabaseClient.from('incomes').select('*').eq('user_id', user.id),
            supabaseClient.from('expenses').select('*').eq('user_id', user.id)
        ]);

        if (incomesRes.error) console.error('Error fetching incomes:', incomesRes.error);
        else appState.incomes = incomesRes.data || [];

        if (expensesRes.error) console.error('Error fetching expenses:', expensesRes.error);
        else appState.expenses = expensesRes.data || [];

        console.log("Data fetch complete, rendering UI.");
        renderAll();
    }

    // --- AUTH FUNCTIONS ---
    async function handleLogin() {
        console.log("Login initiated...");
        const { error } = await supabaseClient.auth.signInWithOAuth({ provider: 'github' });
        if (error) console.error('Error logging in:', error);
    }

    async function handleLogout() {
        console.log("Logout function called");
        const { error } = await supabaseClient.auth.signOut();
        if (error) {
            console.error('Error logging out:', error);
        } else {
            console.log("Logout successful via function call.");
            // Clear local state and UI is handled by onAuthStateChange
        }
    }

    function updateUserStatus(user) {
        console.log("Updating user status UI for user:", user ? user.email : 'null');
        if (user) {
            userStatus.innerHTML = `Logged in as ${user.email} <button id="logout-btn" class="btn-secondary">Logout</button>`;
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                 logoutBtn.removeEventListener('click', handleLogout); // Clean up just in case
                 logoutBtn.addEventListener('click', handleLogout);
            } else { console.error("Logout button not found after update."); }
        } else {
            userStatus.innerHTML = `<button id="login-btn" class="btn-primary">Login with GitHub</button>`;
            const loginBtn = document.getElementById('login-btn');
            if (loginBtn) {
                 loginBtn.removeEventListener('click', handleLogin); // Clean up just in case
                 loginBtn.addEventListener('click', handleLogin);
            } else { console.error("Login button not found after update."); }
        }
    }

    // --- DATA MODAL FUNCTIONS ---
    function openModal() { appModal.classList.remove('modal-hidden'); } // For data entry
    function closeModal() { appModal.classList.add('modal-hidden'); modalBody.innerHTML = ''; onSave = null; } // For data entry

    function showIncomeModal(incomeId) {
        const isEditMode = incomeId !== undefined;
        // Ensure appState.incomes is an array before using find
        const incomeToEdit = isEditMode && Array.isArray(appState.incomes) ? appState.incomes.find(i => i.id === incomeId) : null;
        modalTitle.textContent = isEditMode ? 'Edit Income' : 'Add New Income';
        modalBody.innerHTML = `<div class="form-group"><label for="modal-income-type">Type:</label><select id="modal-income-type" required><option value="">-- Select a Type --</option><option value="Pension">Pension</option><option value="TSP">TSP</option><option value="TSP Supplement">TSP Supplement</option><option value="Social Security">Social Security</option><option value="Investment">Investment Dividend</option><option value="Other">Other</option></select></div><div class="form-group"><label for="modal-income-name">Description / Name:</label><input type="text" id="modal-income-name" placeholder="e.g., Vincent's TSP" required></div><div class="form-group"><label for="modal-income-interval">Payment Interval:</label><select id="modal-income-interval" required><option value="monthly">Monthly</option><option value="annually">Annually</option><option value="quarterly">Quarterly</option><option value="bi-weekly">Bi-Weekly</option></select></div><div class="form-group"><label for="modal-income-amount">Payment Amount:</label><input type="number" id="modal-income-amount" placeholder="1500" min="0" step="0.01" required></div>`;
        if (isEditMode && incomeToEdit) {
            document.getElementById('modal-income-type').value = incomeToEdit.type;
            document.getElementById('modal-income-name').value = incomeToEdit.name;
            document.getElementById('modal-income-interval').value = incomeToEdit.interval;
            document.getElementById('modal-income-amount').value = incomeToEdit.amount;
        } else if (isEditMode && !incomeToEdit) {
             console.error(`Income item with ID ${incomeId} not found for editing.`);
             alert("Error: Could not find item to edit.");
             return; // Don't open modal if item not found
        }
        onSave = async () => {
            const { data: { user } } = await supabaseClient.auth.getUser();
            if (!user) { alert("You must be logged in to save data."); return; }
            const formItem = { user_id: user.id, type: document.getElementById('modal-income-type').value, name: document.getElementById('modal-income-name').value.trim(), interval: document.getElementById('modal-income-interval').value, amount: parseFloat(document.getElementById('modal-income-amount').value) };
            if (!formItem.type || !formItem.name || isNaN(formItem.amount) || formItem.amount < 0) { alert("Please fill out all fields correctly (amount cannot be negative)."); return; }
            let { error } = isEditMode ? await supabaseClient.from('incomes').update(formItem).eq('id', incomeId) : await supabaseClient.from('incomes').insert([formItem]).select(); // Use insert with array and select
            if (error) { console.error("Error saving income:", error); alert(`Error saving income: ${error.message}`); }
            else { await fetchData(); } // Refetch data on success
            closeModal();
        };
        openModal();
    }

    function showExpenseModal(expenseId) {
        const isEditMode = expenseId !== undefined;
        // Ensure appState.expenses is an array before using find
        const expenseToEdit = isEditMode && Array.isArray(appState.expenses) ? appState.expenses.find(e => e.id === expenseId) : null;
        modalTitle.textContent = isEditMode ? 'Edit Expense' : 'Add New Expense';
        modalBody.innerHTML = `<div class="form-group"><label for="modal-expense-category">Category:</label><select id="modal-expense-category" required><option value="">-- Select a Category --</option><option value="Housing">Housing</option><option value="Groceries">Groceries</option><option value="Utilities">Utilities</option><option value="Transport">Transport</option><option value="Health">Health</option><option value="Entertainment">Entertainment</option><option value="Other">Other</option></select></div><div class="form-group"><label for="modal-expense-name">Description / Name:</label><input type="text" id="modal-expense-name" placeholder="e.g., Electric Bill" required></div><div class="form-group"><label for="modal-expense-interval">Payment Interval:</label><select id="modal-expense-interval" required><option value="monthly">Monthly</option><option value="annually">Annually</option><option value="quarterly">Quarterly</option><option value="bi-weekly">Bi-Weekly</option><option value="weekly">Weekly</option></select></div><div class="form-group"><label for="modal-expense-amount">Amount:</label><input type="number" id="modal-expense-amount" placeholder="100" min="0" step="0.01" required></div>`;
        if (isEditMode && expenseToEdit) {
            document.getElementById('modal-expense-category').value = expenseToEdit.category;
            document.getElementById('modal-expense-name').value = expenseToEdit.name;
            document.getElementById('modal-expense-interval').value = expenseToEdit.interval;
            document.getElementById('modal-expense-amount').value = expenseToEdit.amount;
        } else if (isEditMode && !expenseToEdit) {
             console.error(`Expense item with ID ${expenseId} not found for editing.`);
             alert("Error: Could not find item to edit.");
             return; // Don't open modal if item not found
        }
        onSave = async () => {
            const { data: { user } } = await supabaseClient.auth.getUser();
            if (!user) { alert("You must be logged in to save data."); return; }
            const formItem = { user_id: user.id, category: document.getElementById('modal-expense-category').value, name: document.getElementById('modal-expense-name').value.trim(), interval: document.getElementById('modal-expense-interval').value, amount: parseFloat(document.getElementById('modal-expense-amount').value) };
            if (!formItem.category || !formItem.name || isNaN(formItem.amount) || formItem.amount < 0) { alert("Please fill out all fields correctly (amount cannot be negative)."); return; }
            let { error } = isEditMode ? await supabaseClient.from('expenses').update(formItem).eq('id', expenseId) : await supabaseClient.from('expenses').insert([formItem]).select(); // Use insert with array and select
            if (error) { console.error("Error saving expense:", error); alert(`Error saving expense: ${error.message}`); }
            else { await fetchData(); } // Refetch data on success
            closeModal();
        };
        openModal();
    }

    // --- RENDER & UTILITY FUNCTIONS ---
    function renderAll() {
        console.log("Rendering UI...");
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
            if (!item || item.id === undefined || item.id === null) {
                console.warn("Skipping rendering invalid item:", item);
                return; // Skip rendering if item is invalid or lacks id
            }
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
        if (appState.expenses && Array.isArray(appState.expenses)) { // Ensure it's an array
            appState.expenses.forEach(expense => {
                // Add more robust check for valid expense item
                if (!expense || typeof expense.amount !== 'number' || typeof expense.category !== 'string') {
                    console.warn("Skipping invalid expense item for chart:", expense);
                    return;
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
        if (expenseChartInstance) {
            expenseChartInstance.destroy();
            expenseChartInstance = null;
        }
        const ctx = expenseChartCanvas.getContext('2d');
        ctx.clearRect(0, 0, expenseChartCanvas.width, expenseChartCanvas.height); // Clear canvas explicitly
        if (labels.length === 0) {
            console.log("No expense data to render chart."); // Diagnostic log
            return; // Exit if no valid data
        }
        console.log("Rendering expense chart with labels:", labels, "and data:", data); // Diagnostic log
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
                 plugins: {
                      legend: { position: 'top' },
                      tooltip: { // Optional: Improve tooltips
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
    }

    async function handleListClick(event) {
        const target = event.target;
        if (!target.classList.contains('edit-btn') && !target.classList.contains('delete-btn')) return;
        const idString = target.dataset.id; // Get ID as string first
        if (!idString) { console.error("Button clicked without a data-id attribute."); return; }
        const id = parseInt(idString); // Then parse
        if (isNaN(id)) { console.error(`Invalid ID found on button: ${idString}`); return; }

        const listElement = target.closest('.item-list');
        if (!listElement) { console.error("Could not find parent list for clicked button."); return; }
        const listId = listElement.id;

        if (target.classList.contains('edit-btn')) {
            console.log(`Edit button clicked for ID ${id} in list ${listId}`); // Diagnostic log
            if (listId === 'income-list') showIncomeModal(id);
            else if (listId === 'expense-list') showExpenseModal(id);
        }
        if (target.classList.contains('delete-btn')) {
            console.log(`Delete button clicked for ID ${id} in list ${listId}`); // Diagnostic log
            if (confirm("Are you sure you want to delete this item?")) { // Add confirmation
                 const tableName = listId === 'income-list' ? 'incomes' : 'expenses';
                 const { error } = await supabaseClient.from(tableName).delete().eq('id', id);
                 if (error) { console.error(`Error deleting from ${tableName}:`, error); alert(`Error deleting item: ${error.message}`); }
                 else {
                      console.log(`Successfully deleted item ID ${id} from ${tableName}`); // Diagnostic log
                      await fetchData(); // Refetch data on success
                 }
            }
        }
    }

    function calculateMonthlyTotal(items) {
        if (!items || !Array.isArray(items)) return 0; // Ensure items is an array
        return items.reduce((total, item) => {
             if (!item || typeof item.amount !== 'number' || item.amount < 0) {
                  // console.warn("Skipping invalid item in calculateMonthlyTotal:", item); // Optional: log invalid items
                  return total;
             }
            switch (item.interval) {
                case 'monthly': return total + item.amount;
                case 'annually': return total + (item.amount / 12);
                case 'quarterly': return total + (item.amount / 3);
                case 'bi-weekly': return total + ((item.amount * 26) / 12);
                case 'weekly': return total + ((item.amount * 52) / 12);
                default:
                     // console.warn("Unknown interval in calculateMonthlyTotal:", item.interval); // Optional: log unknown intervals
                     return total;
            }
        }, 0);
    }

    // === EVENT LISTENERS ===
    supabaseClient.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event, "Session:", session ? "Exists" : "Null");
        updateUserStatus(session?.user); // Update UI first

        // Load theme using localStorage immediately
        loadTheme();

        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') { // Added TOKEN_REFRESHED
             if (session) {
                  console.log("Session valid, calling fetchData.");
                  // Prevent multiple fetches if already fetching or recently fetched? (Advanced)
                  await fetchData(); // Fetch data for the logged-in user
             } else {
                  console.log(`${event} event, but no session found. Clearing data.`);
                  appState = { incomes: [], expenses: [] };
                  renderAll();
             }
        } else if (event === 'SIGNED_OUT') {
             console.log("SIGNED_OUT event, clearing data and resetting theme.");
             appState = { incomes: [], expenses: [] };
             renderAll();
             // Reset theme visually and in dropdown on logout
             applyTheme('default'); // Use applyTheme to reset and save to localStorage
             if(themeSwitcher) themeSwitcher.value = 'default';
        }
    });

    toggleDashboardBtn.addEventListener('click', () => { mainContainer.classList.toggle('dashboard-expanded'); });
    themeSwitcher.addEventListener('change', (event) => applyTheme(event.target.value)); // applyTheme saves to localStorage
    settingsBtn.addEventListener('click', openSettingsModal);
    settingsModalCloseBtn.addEventListener('click', closeSettingsModal);
    settingsModal.addEventListener('click', (event) => { if (event.target === settingsModal) closeSettingsModal(); });
    showIncomeModalBtn.addEventListener('click', () => showIncomeModal());
    showExpenseModalBtn.addEventListener('click', () => showExpenseModal());
    modalSaveBtn.addEventListener('click', () => { if (onSave) onSave(); }); // For data modal save
    modalCloseBtn.addEventListener('click', closeModal); // For data modal close
    modalCancelBtn.addEventListener('click', closeModal); // For data modal cancel
    appModal.addEventListener('click', (event) => { if (event.target === appModal) closeModal(); }); // For data modal background click
    incomeList.addEventListener('click', handleListClick);
    expenseList.addEventListener('click', handleListClick);

    // Initial theme load on page start (uses localStorage or default)
    loadTheme();
});