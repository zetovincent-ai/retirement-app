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
    const expenseChartCanvas = document.getElementById('expense-chart');
    const darkModeToggle = document.getElementById('dark-mode-toggle'); // New selector
    const authModal = document.getElementById('auth-modal');
    const authModalCloseBtn = document.getElementById('auth-modal-close-btn');
    const emailAuthForm = document.getElementById('email-auth-form');
    const githubLoginBtn = document.getElementById('github-login-btn');
    const notificationContainer = document.getElementById('notification-container');
    // === FUNCTIONS ===
    // --- NEW Dark/Light Mode Functions ---
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
             appState = { incomes: [], expenses: [] };
             renderAll();
             return;
        }
        console.log("Fetching incomes and expenses for user:", user.id);
        const { data: incomes, error: incomesError } = await supabaseClient.from('incomes').select('*').eq('user_id', user.id);
        if (incomesError) console.error('Error fetching incomes:', incomesError);
        else appState.incomes = incomes || [];

        const { data: expenses, error: expensesError } = await supabaseClient.from('expenses').select('*').eq('user_id', user.id);
        if (expensesError) console.error('Error fetching expenses:', expensesError);
        else appState.expenses = expenses || [];

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
        appModal.classList.add('modal-hidden'); modalBody.innerHTML = ''; 
        onSave = null; 
    }
    function showIncomeModal(incomeId) {
        const isEditMode = incomeId !== undefined;
        const incomeToEdit = isEditMode && Array.isArray(appState.incomes) ? appState.incomes.find(i => i.id === incomeId) : null;
        modalTitle.textContent = isEditMode ? 'Edit Income' : 'Add New Income';
        // Add the new "Day of Month" field to the modal HTML
        modalBody.innerHTML = `
            <div class="form-group"><label for="modal-income-type">Type:</label><select id="modal-income-type" required>...</select></div>
            <div class="form-group"><label for="modal-income-name">Description / Name:</label><input type="text" id="modal-income-name" placeholder="e.g., Vincent's TSP" required></div>
            <div class="form-group"><label for="modal-income-interval">Payment Interval:</label><select id="modal-income-interval" required>...</select></div>
            <div class="form-group"><label for="modal-income-amount">Payment Amount:</label><input type="number" id="modal-income-amount" placeholder="1500" min="0" step="0.01" required></div>
            <div class="form-group"><label for="modal-income-day">Due Day (1-31):</label><input type="number" id="modal-income-day" min="1" max="31" placeholder="e.g., 15"></div>
        `; // Simplified dropdowns above for brevity
        // Re-add full dropdown options here...
        document.getElementById('modal-income-type').innerHTML = `<option value="">-- Select a Type --</option><option value="Pension">Pension</option><option value="TSP">TSP</option><option value="TSP Supplement">TSP Supplement</option><option value="Social Security">Social Security</option><option value="Investment">Investment Dividend</option><option value="Other">Other</option>`;
        document.getElementById('modal-income-interval').innerHTML = `<option value="monthly">Monthly</option><option value="annually">Annually</option><option value="quarterly">Quarterly</option><option value="bi-weekly">Bi-Weekly</option>`;

        if (isEditMode && incomeToEdit) {
            document.getElementById('modal-income-type').value = incomeToEdit.type || '';
            document.getElementById('modal-income-name').value = incomeToEdit.name || '';
            document.getElementById('modal-income-interval').value = incomeToEdit.interval || 'monthly';
            document.getElementById('modal-income-amount').value = incomeToEdit.amount || '';
            document.getElementById('modal-income-day').value = incomeToEdit.day_of_month || ''; // Populate day
        }
        onSave = async () => {
            const { data: { user } } = await supabaseClient.auth.getUser();
            if (!user) { /* ... error handling ... */ return; }
            const dayOfMonthValue = document.getElementById('modal-income-day').value;
            const formItem = {
                user_id: user.id,
                type: document.getElementById('modal-income-type').value,
                name: document.getElementById('modal-income-name').value.trim(),
                interval: document.getElementById('modal-income-interval').value,
                amount: parseFloat(document.getElementById('modal-income-amount').value),
                day_of_month: dayOfMonthValue ? parseInt(dayOfMonthValue) : null // Save day_of_month (or null if empty)
            };
            // Add validation for day_of_month (1-31) if needed
            if (!formItem.type || !formItem.name || isNaN(formItem.amount) || formItem.amount < 0 || (formItem.day_of_month && (formItem.day_of_month < 1 || formItem.day_of_month > 31))) {
                alert("Please fill out all fields correctly. Day must be between 1 and 31.");
                return;
            }
            let { error } = isEditMode
                ? await supabaseClient.from('incomes').update(formItem).eq('id', incomeId)
                : await supabaseClient.from('incomes').insert([formItem]).select();
            if (error) { /* ... error handling ... */ }
            else { await fetchData(); }
            closeModal();
        };
        openModal();
    }
    function showExpenseModal(expenseId) {
        const isEditMode = expenseId !== undefined;
        // Ensure appState.expenses is an array before using find
        const expenseToEdit = isEditMode && Array.isArray(appState.expenses) ? appState.expenses.find(e => e.id === expenseId) : null;
        modalTitle.textContent = isEditMode ? 'Edit Expense' : 'Add New Expense';

        // Initial HTML structure for the modal body
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
                    <option value="Other">Other</option>
                </select>
            </div>
            <div id="sub-type-container" class="form-group" style="display: none;">
                <label for="modal-expense-sub-type">Sub-Type:</label>
                <select id="modal-expense-sub-type">
                    <option value="">-- Select Sub-Type --</option>
                    <option value="Rent">Rent</option>
                    <option value="Mortgage/Loan">Mortgage/Loan</option>
                    <option value="HOA">HOA Dues</option>
                    <option value="Other">Other Housing</option>
                </select>
            </div>
            <div class="form-group">
                <label for="modal-expense-name">Description / Name:</label>
                <input type="text" id="modal-expense-name" placeholder="e.g., Electric Bill" required>
            </div>
            <div class="form-group">
                <label for="modal-expense-interval">Payment Interval:</label>
                <select id="modal-expense-interval" required>
                    <option value="monthly">Monthly</option>
                    <option value="annually">Annually</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="bi-weekly">Bi-Weekly</option>
                    <option value="weekly">Weekly</option>
                </select>
            </div>
            <div class="form-group">
                <label for="modal-expense-amount">Amount:</label>
                <input type="number" id="modal-expense-amount" placeholder="100" min="0" step="0.01" required>
            </div>
            <div class="form-group">
                <label for="modal-expense-day">Day of Month (1-31):</label>
                <input type="number" id="modal-expense-day" min="1" max="31" placeholder="e.g., 1">
            </div>
            <div id="advanced-loan-fields" style="display: none;">
                <hr class="divider">
                <h4>Loan Details (Optional)</h4>
                <div class="form-group">
                    <label for="modal-loan-interest-rate">Interest Rate (%):</label>
                    <input type="number" id="modal-loan-interest-rate" placeholder="e.g., 6.5" min="0" step="0.001">
                </div>
                <div class="form-group">
                    <label for="modal-loan-total-payments">Total Payments (Months):</label>
                    <input type="number" id="modal-loan-total-payments" placeholder="e.g., 360" min="1" step="1">
                </div>
                 <div class="form-group">
                    <label for="modal-loan-original-principal">Original Principal ($):</label>
                    <input type="number" id="modal-loan-original-principal" placeholder="e.g., 300000" min="0" step="0.01">
                </div>
            </div>
        `;

        // --- Get references to the dynamic elements ---
        const categorySelect = document.getElementById('modal-expense-category');
        const subTypeContainer = document.getElementById('sub-type-container');
        const subTypeSelect = document.getElementById('modal-expense-sub-type');
        const advancedFieldsContainer = document.getElementById('advanced-loan-fields');

        // --- Function to show/hide advanced fields based on selections ---
        function toggleAdvancedFields() {
            const category = categorySelect.value;
            const subType = subTypeSelect.value;

            // Show sub-type only for Housing
            if (category === 'Housing') {
                subTypeContainer.style.display = 'grid'; // Use grid display like other form-groups
            } else {
                subTypeContainer.style.display = 'none';
                subTypeSelect.value = ''; // Reset sub-type if category changes
            }

            // Show loan fields only for Housing -> Mortgage/Loan
            if (category === 'Housing' && subType === 'Mortgage/Loan') {
                advancedFieldsContainer.style.display = 'block';
            } else {
                advancedFieldsContainer.style.display = 'none';
            }
        }

        // --- Add event listeners to category and sub-type dropdowns ---
        categorySelect.addEventListener('change', toggleAdvancedFields);
        subTypeSelect.addEventListener('change', toggleAdvancedFields);

        // --- Pre-populate fields if in Edit Mode ---
        if (isEditMode && expenseToEdit) {
            categorySelect.value = expenseToEdit.category || '';
            document.getElementById('modal-expense-name').value = expenseToEdit.name || '';
            document.getElementById('modal-expense-interval').value = expenseToEdit.interval || 'monthly';
            document.getElementById('modal-expense-amount').value = expenseToEdit.amount || '';
            document.getElementById('modal-expense-day').value = expenseToEdit.day_of_month || '';

            // Pre-populate advanced fields from advanced_data
            if (expenseToEdit.advanced_data) {
                 if (expenseToEdit.category === 'Housing' && expenseToEdit.advanced_data.item_type) {
                      subTypeSelect.value = expenseToEdit.advanced_data.item_type; // Pre-select sub-type
                 }
                 if (expenseToEdit.advanced_data.item_type === 'Mortgage/Loan') {
                    document.getElementById('modal-loan-interest-rate').value = expenseToEdit.advanced_data.interest_rate ? (expenseToEdit.advanced_data.interest_rate * 100).toFixed(3) : ''; // Convert decimal to %
                    document.getElementById('modal-loan-total-payments').value = expenseToEdit.advanced_data.total_payments || '';
                    document.getElementById('modal-loan-original-principal').value = expenseToEdit.advanced_data.original_principal || '';
                 }
                 // Add pre-population for other types (e.g., credit card) here later
            }
             toggleAdvancedFields(); // Ensure correct fields are visible on load
        } else if (isEditMode && !expenseToEdit) {
             console.error(`Expense item with ID ${expenseId} not found for editing.`);
             alert("Error: Could not find item to edit.");
             return; // Don't open modal if item not found
        }

        // --- Define the Save Action ---
        onSave = async () => {
            const { data: { user } } = await supabaseClient.auth.getUser();
            if (!user) { alert("You must be logged in to save data."); return; } // Simplified error handling

            const category = categorySelect.value;
            const subType = subTypeSelect.value;
            const dayOfMonthValue = document.getElementById('modal-expense-day').value;
            let advancedData = null;

            // Construct advancedData based on selections
            if (category === 'Housing' && subType) {
                 advancedData = { item_type: subType }; // Store sub-type like 'Rent' or 'Mortgage/Loan'
                 if (subType === 'Mortgage/Loan') {
                     const rateInput = document.getElementById('modal-loan-interest-rate').value;
                     const paymentsInput = document.getElementById('modal-loan-total-payments').value;
                     const principalInput = document.getElementById('modal-loan-original-principal').value;

                     // Only add loan details if provided
                     if (rateInput) advancedData.interest_rate = parseFloat(rateInput) / 100.0; // Store as decimal
                     if (paymentsInput) advancedData.total_payments = parseInt(paymentsInput);
                     if (principalInput) advancedData.original_principal = parseFloat(principalInput);
                 }
                 // Add logic for other sub-types or categories here later
            }


            const formItem = {
                user_id: user.id,
                category: category,
                name: document.getElementById('modal-expense-name').value.trim(),
                interval: document.getElementById('modal-expense-interval').value,
                amount: parseFloat(document.getElementById('modal-expense-amount').value),
                day_of_month: dayOfMonthValue ? parseInt(dayOfMonthValue) : null,
                advanced_data: advancedData // Add the advanced data object (or null)
                // payment_overrides remains null/untouched for V1
            };

            if (!formItem.category || !formItem.name || isNaN(formItem.amount) || formItem.amount < 0 || (formItem.day_of_month && (formItem.day_of_month < 1 || formItem.day_of_month > 31))) {
                 alert("Please fill out all required fields correctly. Day must be between 1 and 31.");
                 return;
            }
             // Add validation specific to advanced fields if needed (e.g., interest rate range)

            let { error } = isEditMode
                ? await supabaseClient.from('expenses').update(formItem).eq('id', expenseId)
                : await supabaseClient.from('expenses').insert([formItem]).select();

            if (error) { console.error("Error saving expense:", error); alert(`Error saving expense: ${error.message}`); } // Simplified error handling
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
        // Sort items by day_of_month before rendering
        items.sort((a, b) => (a.day_of_month || 99) - (b.day_of_month || 99)); // Put items without a day at the end

        items.forEach(item => {
            if (!item || item.id === undefined || item.id === null) { /* ... */ return; }
            const li = document.createElement('li');
            const formattedAmount = typeof item.amount === 'number' ? item.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : 'N/A';
            const intervalText = item.interval ? ` / ${item.interval}` : '';
            // Add day_of_month to the display if it exists
            const dayText = item.day_of_month ? ` (Day: ${item.day_of_month})` : '';
            const typeOrCategory = item.type || item.category || 'N/A';
            const name = item.name || 'Unnamed';
            li.innerHTML = `
                <div class="item-details">
                    <strong>${name}</strong> (${typeOrCategory})<br>
                    <span>${formattedAmount}${intervalText}${dayText}</span>
                </div>
                <div class="item-controls">
                    <button class="edit-btn" data-id="${item.id}">Edit</button>
                    <button class="delete-btn" data-id="${item.id}">X</button>
                </div>`;
            listElement.appendChild(li);
        });
    }
    function renderExpenseChart(){
        if(!expenseChartCanvas)return;
            const categoryTotals={};
        if(appState.expenses){appState.expenses.forEach(expense=>{
            if(!expense||typeof expense.amount!=='number')return;
                const monthlyAmount=calculateMonthlyTotal([expense]);
                    if(!categoryTotals[expense.category]){
                        categoryTotals[expense.category]=0}
                        categoryTotals[expense.category]+=monthlyAmount}
        )}
            const labels=Object.keys(categoryTotals);
            const data=Object.values(categoryTotals);
                if(expenseChartInstance){expenseChartInstance.destroy();
                    expenseChartInstance=null}
            const ctx=expenseChartCanvas.getContext('2d');
            ctx.clearRect(0,0,expenseChartCanvas.width,expenseChartCanvas.height);
                if(labels.length===0)return;
                    expenseChartInstance=new Chart(ctx,
                        {type:'pie',data:{labels:labels,datasets:[
                            {label:'Expenses by Category',data:data,backgroundColor:
                                ['#3498db','#e74c3c','#9b59b6','#f1c40f','#2ecc71','#1abc9c','#e67e22','#95a5a6'],
                                hoverOffset:4}
                        ]},
                            options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'top'}}}
                        }
                    )
    }
    async function handleListClick(event){
        const target=event.target;
            if(!target.classList.contains('edit-btn')&&!target.classList.contains('delete-btn'))return;
            const id=parseInt(target.dataset.id);
            if(isNaN(id))return;
            const listId=target.closest('.item-list')?.id;
            if(!listId)return;
            if(target.classList.contains('edit-btn')){
                if(listId==='income-list')showIncomeModal(id);
                else if(listId==='expense-list')showExpenseModal(id)
            }
        if(target.classList.contains('delete-btn')){
            const tableName=listId==='income-list'?'incomes':'expenses';
            const{error}=await supabaseClient.from(tableName).delete().eq('id',id);
            if(error)console.error(`Error deleting from ${tableName}:`,error);
            else await fetchData()
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
    // === EVENT LISTENERS ===
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
    toggleDashboardBtn.addEventListener('click', () => { mainContainer.classList.toggle('dashboard-expanded'); });
    darkModeToggle.addEventListener('change', () => {
        if (darkModeToggle.checked) {
            setMode('dark');
        } else {
            setMode('light');
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
    loadMode(); // Load the saved mode on startup
    initializeFooter();
});