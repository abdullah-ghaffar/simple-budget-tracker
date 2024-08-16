const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Path to the budget data file
const dataFilePath = path.join(__dirname, 'budgetData.json');

// Initialize the JSON file if it doesn't exist
if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify({ income: [], expenses: [] }, null, 2));
}

// Serve the client files (index.html, etc.)
app.use(express.static(path.join(__dirname, '../client')));

// Route to get all transactions
app.get('/api/transactions', (req, res) => {
    const data = JSON.parse(fs.readFileSync(dataFilePath));
    res.json(data);
});

// Route to add a new income
app.post('/api/income', (req, res) => {
    const { amount, description } = req.body;
    const data = JSON.parse(fs.readFileSync(dataFilePath));
    const newId = Date.now();
    data.income.push({ id: newId, amount, description, date: new Date() });
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    res.json({ message: 'Income added successfully', id: newId });
});

// Route to add a new expense
app.post('/api/expense', (req, res) => {
    const { amount, description } = req.body;
    const data = JSON.parse(fs.readFileSync(dataFilePath));
    const newId = Date.now();
    data.expenses.push({ id: newId, amount, description, date: new Date() });
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    res.json({ message: 'Expense added successfully', id: newId });
});

// Route to delete an income
app.delete('/api/income/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const data = JSON.parse(fs.readFileSync(dataFilePath));
    data.income = data.income.filter(transaction => transaction.id !== id);
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    res.json({ message: 'Income deleted successfully' });
});

// Route to delete an expense
app.delete('/api/expense/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const data = JSON.parse(fs.readFileSync(dataFilePath));
    data.expenses = data.expenses.filter(transaction => transaction.id !== id);
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    res.json({ message: 'Expense deleted successfully' });
});

// Route to update an income
app.put('/api/income/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { amount, description } = req.body;
    const data = JSON.parse(fs.readFileSync(dataFilePath));
    const index = data.income.findIndex(transaction => transaction.id === id);
    if (index !== -1) {
        data.income[index] = { ...data.income[index], amount, description };
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
        res.json({ message: 'Income updated successfully' });
    } else {
        res.status(404).json({ message: 'Income not found' });
    }
});

// Route to update an expense
app.put('/api/expense/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { amount, description } = req.body;
    const data = JSON.parse(fs.readFileSync(dataFilePath));
    const index = data.expenses.findIndex(transaction => transaction.id === id);
    if (index !== -1) {
        data.expenses[index] = { ...data.expenses[index], amount, description };
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
        res.json({ message: 'Expense updated successfully' });
    } else {
        res.status(404).json({ message: 'Expense not found' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
