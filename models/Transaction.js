const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ["deposit", "withdrawal"],
  },
  payer: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: [true, "Please enter payer name"],
    },
  },
  payee: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: [true, "Please enter payee name"],
    },
  },
  amount: {
    type: Number,
    required: [true, "Please enter transaction amount"],
  },
});

const Transaction = mongoose.model("transaction", transactionSchema);

module.exports = Transaction;
