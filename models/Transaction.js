const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  payer: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: [true, "Please enter payer name"],
    },
    username: {
      type: String,
      required: [true, "Please enter payer username"],
    },
    email: {
      type: String,
      required: [true, "Please enter payer email"],
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
    username: {
      type: String,
      required: [true, "Please enter payee username"],
    },
    email: {
      type: String,
      required: [true, "Please enter payee email"],
    },
  },
  amount: {
    type: Number,
    required: [true, "Please enter transaction amount"],
  },
});

const Transaction = mongoose.model("transaction", transactionSchema);

module.exports = Transaction;
