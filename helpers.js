function getMonthKey() {
  return new Date().toISOString().slice(0, 7);
}

function getSpentPercent(budget, totalSpent) {
  if (budget === 0) return 0;
  return Math.min(Math.round((totalSpent / budget) * 100), 100);
}

function getProgressClass(percent) {
  if (percent >= 90) return 'danger';
  if (percent >= 70) return 'warn';
  return '';
}

function getRemainingClass(remaining) {
  return remaining < 0 ? 'over' : 'ov-safe';
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
        ...exp._doc,  // ← _doc extracts the plain data from a Mongoose object
        formattedDate: new Date(exp.date + 'T00:00:00')
        .toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };
}

module.exports = {
  getMonthKey, getSpentPercent, getProgressClass,
  getRemainingClass, getCategoryBreakdown, formatExpense
};