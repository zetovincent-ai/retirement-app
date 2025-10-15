document.addEventListener('DOMContentLoaded', () => {
    // === SUPABASE INITIALIZATION ===
    const SUPABASE_URL = 'https://mwuxrrwbgytbqrlhzwsc.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13dXhycndiZ3l0YnFybGh6d3NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MjcxNTYsImV4cCI6MjA3NjEwMzE1Nn0.up3JOKKXEyw6axEGhI2eESJbrZzoH-93zRmCSXukYZY';
    const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // === STATE MANAGEMENT ===
    let appState = {
        incomes: [],
        expenses: []
    };
    let onSave = null;

    // === DOM SELECTORS ===
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
    const importBtn = document.getElementById('import-btn');
    const exportBtn = document.getElementById('export-btn');
    const importFileInput = document.getElementById('import-file-input');

    // === FUNCTIONS ===

    // --- NEW AUTH FUNCTIONS ---
    async function handleLogin() {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
        });
        if (error) console.error('Error logging in:', error);
    }

    async function handleLogout() {
        const { error } = await supabase.auth.signOut();
        if (error) console.error('Error logging out:', error);
    }

    function updateUserStatus(user) {
        if (user) {
            userStatus.innerHTML = `
                Logged in as ${user.email}
                <button id="logout-btn" class="btn-secondary">Logout</button>
            `;
            document.getElementById('logout-btn').addEventListener('click', handleLogout);
        } else {
            userStatus.innerHTML = `
                <button id="login-btn" class="btn-primary">Login with GitHub</button>
            `;
            document.getElementById('login-btn').addEventListener('click', handleLogin);
        }
    }

    // --- EXISTING FUNCTIONS ---
    function saveState() {
        localStorage.setItem('retirementAppData', JSON.stringify(appState));
    }

    function loadState() {
        const savedState = localStorage.getItem('retirementAppData');
        if (savedState) {
            appState = JSON.parse(savedState);
        }
    }

    function openModal() { /* ... unchanged ... */ }
    function closeModal() { /* ... unchanged ... */ }
    function showIncomeModal(incomeId) { /* ... unchanged ... */ }
    function showExpenseModal(expenseId) { /* ... unchanged ... */ }
    function renderDashboard() { /* ... unchanged ... */ }
    function renderIncomes() { /* ... unchanged ... */ }
    function renderExpenses() { /* ... unchanged ... */ }
    function renderList(items, listElement) { /* ... unchanged ... */ }
    function handleListClick(event) { /* ... unchanged ... */ }
    function calculateMonthlyTotal(items) { /* ... unchanged ... */ }
    function handleExport() { /* ... unchanged ... */ }
    function handleImport(event) { /* ... unchanged ... */ }
    function updateAndSave() {
        saveState();
        renderIncomes();
        renderExpenses();
        renderDashboard();
    }

    function initializeApp() {
        loadState(); // We will remove this soon
        updateAndSave();
    }

    // === EVENT LISTENERS ===
    showIncomeModalBtn.addEventListener('click', () => showIncomeModal());
    showExpenseModalBtn.addEventListener('click', () => showExpenseModal());
    exportBtn.addEventListener('click', handleExport);
    importBtn.addEventListener('click', () => importFileInput.click());
    importFileInput.addEventListener('change', handleImport);
    modalSaveBtn.addEventListener('click', () => {
        if (onSave) onSave();
    });
    modalCloseBtn.addEventListener('click', closeModal);
    modalCancelBtn.addEventListener('click', closeModal);
    appModal.addEventListener('click', (event) => {
        if (event.target === appModal) closeModal();
    });
    incomeList.addEventListener('click', handleListClick);
    expenseList.addEventListener('click', handleListClick);

    // This is the new, key listener for authentication
    supabase.auth.onAuthStateChange((event, session) => {
        updateUserStatus(session?.user);
        // In the next step, we'll add logic here to load data from the database when a user logs in.
    });


    // === INITIALIZATION ===
    initializeApp();

    // --- UNCHANGED FUNCTIONS (for reference) ---
    function openModal(){appModal.classList.remove('modal-hidden')}
    function closeModal(){appModal.classList.add('modal-hidden');modalBody.innerHTML='';onSave=null}
    function showIncomeModal(incomeId){const isEditMode=incomeId!==undefined;const incomeToEdit=isEditMode?appState.incomes.find(i=>i.id===incomeId):null;modalTitle.textContent=isEditMode?'Edit Income':'Add New Income';modalBody.innerHTML=`<div class="form-group"><label for="modal-income-type">Type:</label><select id="modal-income-type" required><option value="">-- Select a Type --</option><option value="Pension">Pension</option><option value="TSP">TSP</option><option value="TSP Supplement">TSP Supplement</option><option value="Social Security">Social Security</option><option value="Investment">Investment Dividend</option><option value="Other">Other</option></select></div><div class="form-group"><label for="modal-income-name">Description / Name:</label><input type="text" id="modal-income-name" placeholder="e.g., Vincent's TSP" required></div><div class="form-group"><label for="modal-income-interval">Payment Interval:</label><select id="modal-income-interval" required><option value="monthly">Monthly</option><option value="annually">Annually</option><option value="quarterly">Quarterly</option><option value="bi-weekly">Bi-Weekly</option></select></div><div class="form-group"><label for="modal-income-amount">Payment Amount:</label><input type="number" id="modal-income-amount" placeholder="1500" min="0" step="0.01" required></div>`;if(isEditMode){document.getElementById('modal-income-type').value=incomeToEdit.type;document.getElementById('modal-income-name').value=incomeToEdit.name;document.getElementById('modal-income-interval').value=incomeToEdit.interval;document.getElementById('modal-income-amount').value=incomeToEdit.amount}
onSave=()=>{const item={id:isEditMode?incomeToEdit.id:Date.now(),type:document.getElementById('modal-income-type').value,name:document.getElementById('modal-income-name').value.trim(),interval:document.getElementById('modal-income-interval').value,amount:parseFloat(document.getElementById('modal-income-amount').value)};if(!item.type||!item.name||isNaN(item.amount)){alert("Please fill out all fields correctly.");return}
if(isEditMode){appState.incomes[appState.incomes.findIndex(i=>i.id===incomeId)]=item}else{appState.incomes.push(item)}
updateAndSave();closeModal()};openModal()}
    function showExpenseModal(expenseId){const isEditMode=expenseId!==undefined;const expenseToEdit=isEditMode?appState.expenses.find(e=>e.id===expenseId):null;modalTitle.textContent=isEditMode?'Edit Expense':'Add New Expense';modalBody.innerHTML=`<div class="form-group"><label for="modal-expense-category">Category:</label><select id="modal-expense-category" required><option value="">-- Select a Category --</option><option value="Housing">Housing</option><option value="Groceries">Groceries</option><option value="Utilities">Utilities</option><option value="Transport">Transport</option><option value="Health">Health</option><option value="Entertainment">Entertainment</option><option value="Other">Other</option></select></div><div class="form-group"><label for="modal-expense-name">Description / Name:</label><input type="text" id="modal-expense-name" placeholder="e.g., Electric Bill" required></div><div class="form-group"><label for="modal-expense-interval">Payment Interval:</label><select id="modal-expense-interval" required><option value="monthly">Monthly</option><option value="annually">Annually</option><option value="quarterly">Quarterly</option><option value="bi-weekly">Bi-Weekly</option><option value="weekly">Weekly</option></select></div><div class="form-group"><label for="modal-expense-amount">Amount:</label><input type="number" id="modal-expense-amount" placeholder="100" min="0" step="0.01" required></div>`;if(isEditMode){document.getElementById('modal-expense-category').value=expenseToEdit.category;document.getElementById('modal-expense-name').value=expenseToEdit.name;document.getElementById('modal-expense-interval').value=expenseToEdit.interval;document.getElementById('modal-expense-amount').value=expenseToEdit.amount}
onSave=()=>{const item={id:isEditMode?expenseToEdit.id:Date.now(),category:document.getElementById('modal-expense-category').value,name:document.getElementById('modal-expense-name').value.trim(),interval:document.getElementById('modal-expense-interval').value,amount:parseFloat(document.getElementById('modal-expense-amount').value)};if(!item.category||!item.name||isNaN(item.amount)){alert("Please fill out all fields correctly.");return}
if(isEditMode){appState.expenses[appState.expenses.findIndex(e=>e.id===expenseId)]=item}else{appState.expenses.push(item)}
updateAndSave();closeModal()};openModal()}
    function renderDashboard(){const totalMonthlyIncome=calculateMonthlyTotal(appState.incomes);const totalMonthlyExpenses=calculateMonthlyTotal(appState.expenses);const netMonthly=totalMonthlyIncome-totalMonthlyExpenses;const format=num=>num.toLocaleString('en-US',{style:'currency','currency':'USD'});dashboardSummary.innerHTML=`<div class="summary-item"><h3 class="income-total">Total Monthly Income</h3><p class="income-total">${format(totalMonthlyIncome)}</p></div><div class="summary-item"><h3 class="expense-total">Total Monthly Expenses</h3><p class="expense-total">${format(totalMonthlyExpenses)}</p></div><div class="summary-item net-total"><h3>Net Monthly Balance</h3><p>${format(netMonthly)}</p></div>`;}
    function renderList(items,listElement){listElement.innerHTML='';const listType=listElement.id.includes('income')?'income':'expense';if(items.length===0){listElement.innerHTML=`<li>No ${listType}s added yet.</li>`;return}
items.forEach(item=>{const li=document.createElement('li');const formattedAmount=item.amount.toLocaleString('en-US',{style:'currency','currency':'USD'});const intervalText=item.interval?` / ${item.interval}`:'';li.innerHTML=`<div class="item-details"><strong>${item.name}</strong> (${item.type||item.category})<br><span>${formattedAmount}${intervalText}</span></div><div class="item-controls"><button class="edit-btn" data-id="${item.id}">Edit</button><button class="delete-btn" data-id="${item.id}">X</button></div>`;listElement.appendChild(li);});}
    function handleListClick(event){const target=event.target;if(!target.classList.contains('edit-btn')&&!target.classList.contains('delete-btn'))return;const id=parseInt(target.dataset.id);const listId=target.closest('.item-list').id;if(target.classList.contains('edit-btn')){if(listId==='income-list'){showIncomeModal(id)}else if(listId==='expense-list'){showExpenseModal(id)}}
if(target.classList.contains('delete-btn')){if(listId==='income-list'){appState.incomes=appState.incomes.filter(i=>i.id!==id)}else if(listId==='expense-list'){appState.expenses=appState.expenses.filter(e=>e.id!==id)}
updateAndSave()}}
    function calculateMonthlyTotal(items){return items.reduce((total,item)=>{switch(item.interval){case'monthly':return total+item.amount;case'annually':return total+(item.amount/12);case'quarterly':return total+(item.amount/3);case'bi-weekly':return total+((item.amount*26)/12);case'weekly':return total+((item.amount*52)/12);default:return total}},0)}
    function handleExport(){if(appState.incomes.length===0&&appState.expenses.length===0){alert("There is no data to export.");return}
const jsonString=JSON.stringify(appState,null,2);const blob=new Blob([jsonString],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='retirement_data.json';document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url)}
    function handleImport(event){const file=event.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=(e)=>{try{const importedState=JSON.parse(e.target.result);if(!importedState.incomes||!importedState.expenses){throw new Error("Invalid file format.")}
if(confirm("This will overwrite all current data. Are you sure?")){appState=importedState;updateAndSave()}}catch(error){alert(`Error importing file: ${error.message}`)}finally{importFileInput.value=null}};reader.readAsText(file)}
});