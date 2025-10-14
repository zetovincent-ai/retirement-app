document.addEventListener('DOMContentLoaded', () => {
    // === STATE MANAGEMENT ===
    let appState = { incomes: [], expenses: [] };
    let onSave = null; // A variable to hold the save function for the modal

    // === DOM SELECTORS ===
    const appModal = document.getElementById('app-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');
    const modalSaveBtn = document.getElementById('modal-save-btn');
    const showIncomeModalBtn = document.getElementById('show-income-modal-btn');
    const incomeList = document.getElementById('income-list');
    const expenseForm = document.getElementById('expense-form');
    const expenseCategoryInput = document.getElementById('expense-category');
    const expenseNameInput = document.getElementById('expense-name');
    const expenseIntervalInput = document.getElementById('expense-interval');
    const expenseAmountInput = document.getElementById('expense-amount');
    const expenseList = document.getElementById('expense-list');
    const dashboardSummary = document.getElementById('dashboard-summary');

    // === FUNCTIONS ===
    function saveState() { localStorage.setItem('retirementAppData', JSON.stringify(appState)); }
    function loadState() {
        const savedState = localStorage.getItem('retirementAppData');
        if (savedState) appState = JSON.parse(savedState);
    }
    
    // --- MODAL FUNCTIONS ---
    function openModal() { appModal.classList.remove('modal-hidden'); }
    function closeModal() { appModal.classList.add('modal-hidden'); modalBody.innerHTML = ''; onSave = null; }

    function showIncomeModal(incomeId) {
        const isEditMode = incomeId !== undefined;
        const incomeToEdit = isEditMode ? appState.incomes.find(i => i.id === incomeId) : null;
        modalTitle.textContent = isEditMode ? 'Edit Income' : 'Add New Income';
        modalBody.innerHTML = `
            <div class="form-group"><label for="modal-income-type">Type:</label><select id="modal-income-type" required><option value="">-- Select a Type --</option><option value="Pension">Pension</option><option value="TSP">TSP</option><option value="TSP Supplement">TSP Supplement</option><option value="Social Security">Social Security</option><option value="Investment">Investment Dividend</option><option value="Other">Other</option></select></div>
            <div class="form-group"><label for="modal-income-name">Description / Name:</label><input type="text" id="modal-income-name" placeholder="e.g., Vincent's TSP" required></div>
            <div class="form-group"><label for="modal-income-interval">Payment Interval:</label><select id="modal-income-interval" required><option value="monthly">Monthly</option><option value="annually">Annually</option><option value="quarterly">Quarterly</option><option value="bi-weekly">Bi-Weekly</option></select></div>
            <div class="form-group"><label for="modal-income-amount">Payment Amount:</label><input type="number" id="modal-income-amount" placeholder="1500" min="0" step="0.01" required></div>
        `;
        if (isEditMode) {
            document.getElementById('modal-income-type').value = incomeToEdit.type;
            document.getElementById('modal-income-name').value = incomeToEdit.name;
            document.getElementById('modal-income-interval').value = incomeToEdit.interval;
            document.getElementById('modal-income-amount').value = incomeToEdit.amount;
        }
        onSave = () => {
            const updatedIncome = { id: isEditMode ? incomeToEdit.id : Date.now(), type: document.getElementById('modal-income-type').value, name: document.getElementById('modal-income-name').value.trim(), interval: document.getElementById('modal-income-interval').value, amount: parseFloat(document.getElementById('modal-income-amount').value) };
            if (!updatedIncome.type || !updatedIncome.name || isNaN(updatedIncome.amount)) { alert("Please fill out all fields correctly."); return; }
            if (isEditMode) {
                const index = appState.incomes.findIndex(i => i.id === incomeId);
                appState.incomes[index] = updatedIncome;
            } else {
                appState.incomes.push(updatedIncome);
            }
            updateAndSave();
            closeModal();
        };
        openModal();
    }

    // --- RENDER & UTILITY FUNCTIONS ---
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
        if (items.length === 0) { listElement.innerHTML = `<li>No ${listType}s added yet.</li>`; return; }
        items.forEach(item => {
            const li = document.createElement('li');
            const formattedAmount = item.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            const intervalText = item.interval ? ` / ${item.interval}` : '';
            li.innerHTML = `<div class="item-details"><strong>${item.name}</strong> (${item.type || item.category})<br><span>${formattedAmount}${intervalText}</span></div><div class="item-controls"><button class="edit-btn" data-id="${item.id}">Edit</button><button class="delete-btn" data-id="${item.id}">X</button></div>`;
            listElement.appendChild(li);
        });
    }
    function handleExpenseSubmit(event) {
        event.preventDefault();
        const newExpense = { id: Date.now(), category: expenseCategoryInput.value, name: expenseNameInput.value.trim(), interval: expenseIntervalInput.value, amount: parseFloat(expenseAmountInput.value) };
        appState.expenses.push(newExpense);
        updateAndSave();
        expenseForm.reset();
    }
    function handleListClick(event) {
        const target = event.target;
        const id = parseInt(target.dataset.id);
        if (target.classList.contains('edit-btn')) {
            const listId = target.closest('.item-list').id;
            if (listId === 'income-list') { showIncomeModal(id); }
        }
        if (target.classList.contains('delete-btn')) {
            const listId = target.closest('.item-list').id;
            if (listId === 'income-list') appState.incomes = appState.incomes.filter(i => i.id !== id);
            else if (listId === 'expense-list') appState.expenses = appState.expenses.filter(e => e.id !== id);
            updateAndSave();
        }
    }
    function calculateMonthlyTotal(items) {
        return items.reduce((total, item) => {
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
    function updateAndSave() { saveState(); renderIncomes(); renderExpenses(); renderDashboard(); }
    function initializeApp() { loadState(); updateAndSave(); }

    // === EVENT LISTENERS ===
    showIncomeModalBtn.addEventListener('click', () => showIncomeModal());
    modalSaveBtn.addEventListener('click', () => { if (onSave) onSave(); });
    modalCloseBtn.addEventListener('click', closeModal);
    modalCancelBtn.addEventListener('click', closeModal);
    appModal.addEventListener('click', (event) => { if (event.target === appModal) closeModal(); });
    expenseForm.addEventListener('submit', handleExpenseSubmit);
    incomeList.addEventListener('click', handleListClick);
    expenseList.addEventListener('click', handleListClick);

    // === INITIALIZATION ===
    initializeApp();
});