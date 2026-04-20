const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { writeDB, getCurrentMonth, getTotalSpent, getRemaining, getSpentPercent, 
    getCategoryBreakdown, getExpenseCount, formatExpense, getProgressClass} = require('../helpers');

router.get('/', (req, res) => {
    const {month} = getCurrentMonth();
    const totalMoneySpent = getTotalSpent(month.expenses);
    const remaining = getRemaining(month.budget, totalMoneySpent);
    const spentPercent = getSpentPercent(month.budget, totalMoneySpent);
    const categoryBreakdown = getCategoryBreakdown(month.expenses, totalMoneySpent);

    const recentExpenses = [...month.expenses]
        .reverse()
        .slice(0, 5)
        .map(exp => ({
        ...exp,
        formattedDate: new Date(exp.date + 'T00:00:00')
        .toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    }));

    res.render('index', {budget: month.budget, totalMoneySpent, remaining, spentPercent, recentExpenses, 
        categoryBreakdown, expenseCount:getExpenseCount(month.expenses),
        progressClass:getProgressClass(spentPercent)});
});

router.post("/", (req, res) => {
    const { db, key } = getCurrentMonth();
    db.months[key].budget = Number(req.body.budgetAmount);
    writeDB(db);
    res.redirect('/');
})

router.get("/budget", (req, res) => { 
    res.render("budget")
})

router.post("/budget", (req, res) => {
    const { db, key} = getCurrentMonth();
    db.months[key].budget = Number(req.body.amount);
    writeDB(db);
    res.render("budget")
})

router.get("/expenses", (req, res) => {
    const { month } = getCurrentMonth();
    const { category } = req.query;  

    let expenses = [...month.expenses].reverse();

    if (category) {
        expenses = expenses.filter(e => e.category === category);
    }
    const totalSpent = month.expenses.reduce((s, e) => s + e.amount, 0);
    res.render('expenses', {expenses: expenses.map(formatExpense), expenseCount:getExpenseCount(month.expenses),
        totalSpent, selectedCategory: category || '',
        currentMonth:new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
  });
})

router.post('/expenses', (req, res) => {
    const { db, key } = getCurrentMonth();
    const newExpense  = {
        id: uuidv4(),
        name: req.body.name,
        amount: Number(req.body.amount),
        category: req.body.category,
        date: req.body.date
    };

    db.months[key].expenses.push(newExpense);
    writeDB(db);
    res.redirect('/');
});

router.delete("/expenses/:id", (req, res) => {
    const { db, key } = getCurrentMonth();
    db.months[key].expenses = db.months[key].expenses
        .filter(e => e.id !== req.params.id);
    writeDB(db);
    res.redirect('/');
})

module.exports = router;