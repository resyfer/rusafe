const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter valid bank name"],
  },
  customers: {
    type: Number,
    default: 0,
  },
  branches: [
    {
      name: {
        type: String,
        required: [true, "Please enter valid branch name"],
      },
      iifsc: {
        type: String,
        required: [true, "Please enter valid bank branch IIFSC"],
      },
    },
  ],
});

const Bank = mongoose.model("bank", bankSchema);

module.exports = Bank;
