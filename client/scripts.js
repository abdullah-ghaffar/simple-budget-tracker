const apiUrl = 'http://localhost:3000/api/transactions';

async function getTransactions() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const tableBody = document.getElementById('transactionTableBody');
    tableBody.innerHTML = '';

    data.income.forEach(transaction => {
        const row = createTransactionRow(transaction, 'income');
        tableBody.appendChild(row);
    });

    data.expenses.forEach(transaction => {
        const row = createTransactionRow(transaction, 'expense');
        tableBody.appendChild(row);
    });
}

function createTransactionRow(transaction, type) {
    const row = document.createElement('tr');
    row.dataset.id = transaction.id;
    row.dataset.type = type;
    row.innerHTML = `
        <td>${type.charAt(0).toUpperCase() + type.slice(1)}</td>
        <td class="amount">${transaction.amount}</td>
        <td class="description">${transaction.description}</td>
        <td>${new Date(transaction.date).toLocaleDateString()}</td>
        <td class="actions">
            <div class="button-group">
                <button onclick="editTransaction(this)">Edit</button>
                <button onclick="deleteTransaction(${transaction.id}, '${type}')">Delete</button>
            </div>
        </td>
    `;
    return row;
}

document.getElementById('incomeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const amount = document.getElementById('incomeAmount').value;
    const description = document.getElementById('incomeDescription').value;
    await fetch('http://localhost:3000/api/income', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, description })
    });
    getTransactions(); // Fetch updated transactions
});

document.getElementById('expenseForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const amount = document.getElementById('expenseAmount').value;
    const description = document.getElementById('expenseDescription').value;
    await fetch('http://localhost:3000/api/expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, description })
    });
    getTransactions(); // Fetch updated transactions
});

async function deleteTransaction(id, type) {
    await fetch(`http://localhost:3000/api/${type}/${id}`, {
        method: 'DELETE'
    });
    getTransactions(); // Fetch updated transactions
}

function editTransaction(button) {
    const row = button.closest('tr');
    const id = row.dataset.id;
    const type = row.dataset.type;

    const amountCell = row.querySelector('.amount');
    const descriptionCell = row.querySelector('.description');
    const actionsCell = row.querySelector('.actions');

    const originalAmount = amountCell.textContent;
    const originalDescription = descriptionCell.textContent;

    amountCell.innerHTML = `<input type="number" value="${originalAmount}">`;
    descriptionCell.innerHTML = `<input type="text" value="${originalDescription}">`;
    actionsCell.innerHTML = `
        <button onclick="saveTransaction(${id}, '${type}')">Save</button>
        <button onclick="cancelEdit(this)">Cancel</button>
    `;
}

async function saveTransaction(id, type) {
    const row = document.querySelector(`tr[data-id='${id}'][data-type='${type}']`);
    const amount = row.querySelector('.amount input').value;
    const description = row.querySelector('.description input').value;

    await fetch(`http://localhost:3000/api/${type}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, description })
    });

    getTransactions(); // Fetch updated transactions
}

function cancelEdit(button) {
    getTransactions(); // Refresh the table to revert changes
}

// Initial load
getTransactions();
