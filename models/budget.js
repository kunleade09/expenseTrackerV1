const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema ({
    monthKey: {type: String, required: true, unique: true},
    amount: {type: Number, required: true, default: 0}
})

module.exports = mongoose.model('Budget', budgetSchema);
