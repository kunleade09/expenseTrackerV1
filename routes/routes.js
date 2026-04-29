const express = require('express');
const router = express.Router();
const Budget = require('../models/budget');
const Expense = require('../models/expense');
const { v4: uuidv4 } = require('uuid');
const {  getMonthKey, getSpentPercent, getCategoryBreakdown, formatExpense, getProgressClass} = require('../helpers');

router.get('/', async (req, res) => {
    const monthKey = getMonthKey();

    const budgetDoc = await Budget.findOne({monthKey});
    const budget = budgetDoc ? budgetDoc.amount : 0;

    const expenses = await Expense.find({monthKey}).sort({createdAt: -1});

    const totalMoneySpent = expenses.reduce((s, e) => s + e.amount, 0);
    const remaining = budget - totalMoneySpent;
    const spentPercent = getSpentPercent(budget, totalMoneySpent);
    const categoryBreakdown = getCategoryBreakdown(expenses, totalMoneySpent);

    const recentExpenses = expenses.slice(0, 5).map(formatExpense);


    res.render('index', {budget, totalMoneySpent, remaining, spentPercent, recentExpenses, 
        categoryBreakdown, expenseCount: expenses.length, progressClass:getProgressClass(spentPercent), currentMonth: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })});
});

router.post("/", async (req, res) => {
    try {
        const monthKey = getMonthKey();
        await Budget.findOneAndUpdate(
            { monthKey },
            { amount: Number(req.body.amount) },
            { upsert: true, returnDocument: 'after' }
        );
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
})

router.get("/budget", (req, res) => { 
    res.render("budget")
})

router.post("/budget", async (req, res) => {
    try {
        const monthKey = getMonthKey();
        
        await Budget.findOneAndUpdate(
            { monthKey },
            { amount: Number(req.body.amount) },
            { upsert: true, new: true }
        );
        res.redirect('/budget');
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
})

router.get("/expenses", async (req, res) => {
    try {
        const monthKey = getMonthKey();
        const { category } = req.query;

        const query = { monthKey };
        if (category) {
            query.category = category;
        }

        const expenses   = await Expense.find(query).sort({ createdAt: -1 });
        const allExpenses = await Expense.find({ monthKey });
        const totalSpent = allExpenses.reduce((s, e) => s + e.amount, 0);
        res.render('expenses', {expenses: expenses.map(formatExpense), expenseCount:allExpenses.length,
            totalSpent, selectedCategory: category || '',
            currentMonth:new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
            });

    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
})

router.post('/expenses', async (req, res) => {
   try {
        await Expense.create({
        monthKey: getMonthKey(),
        name: req.body.name,
        amount: Number(req.body.amount),
        category: req.body.category,
        date: req.body.date
    });
    res.redirect('/');

    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
});

router.delete("/expenses/:id", async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.redirect('back');

    } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
})

module.exports = router;