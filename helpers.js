const fs = require("fs");
const path = require("path");
const DB_PATH = path.join(__dirname, 'data/db.json');


function readDB(){
    const data = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(data);
}

function writeDB(data){
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function getExpenseCount(expenses) {
  return expenses.length;
}

function getMonthKey() {
  return new Date().toISOString().slice(0, 7);
}

function getCurrentMonth() {
    const db  = readDB();
    const key = getMonthKey();

    if (!db.months[key]){
        db.months[key] = { budget: 0, expenses: [] };
        writeDB(db);
    }
  return { db, key, month: db.months[key] };
}

function getTotalSpent(expenses){
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
}

function getRemaining(budget, totalExpenses){
    return budget - totalExpenses;
}

function getSpentPercent(budget, totalSpent) {
  if (budget === 0) return 0;
  return Math.min(Math.round((totalSpent / budget) * 100), 100);
}

function getCategoryBreakdown(expenses, totalSpent) {
    const emojiMap = {
        Food: '🍔', Transport: '🚌', Bills: '💡',
        Shopping: '🛍️', Health: '💊', Entertainment: '🎬', Others: '📦'
    };

    const totals = {};
    expenses.forEach(exp => {
        totals[exp.category] = (totals[exp.category] || 0) + exp.amount;
    });

    return Object.entries(totals).map(([name, total]) => ({
        name,
        emoji:   emojiMap[name] || '📦',
        total,
        percent: totalSpent > 0 ? Math.round((total / totalSpent) * 100) : 0
    }));
}

function formatExpense(exp) {
  return {
    ...exp,
    formattedDate: new Date(exp.date + 'T00:00:00')
      .toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  };
}

// CSS class for progress bar colour
function getProgressClass(percent) {
  if (percent >= 90) return 'danger';
  if (percent >= 70) return 'warn';
  return '';
}


module.exports = {
    readDB, writeDB, getMonthKey, getCurrentMonth, 
    getTotalSpent, getRemaining, getSpentPercent, 
    getCategoryBreakdown, getExpenseCount, formatExpense,
    getProgressClass
};