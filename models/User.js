const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter name"],
  },
  username: {
    type: String,
    required: [true, "Please enter username"],
  },
  email: {
    type: String,
    required: [true, "Please enter email"],
  },
  password: {
    type: String,
    required: [true, "Please enter password"],
  },
  dob: {
    type: [Number],
    required: true,
  },
  balance: {
    type: Number,
    default: 10.0, //For testing
  },
  verified: {
    type: Boolean,
    default: false,
  },
  transactions: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      category: {
        type: String,
        enum: ["deposit", "withdrawal"],
      },
      party: {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          required: [true, "Please enter valid reference to transaction"],
        },
        email: {
          type: String,
          required: [true, "Please enter party's email"],
        },
        amount: {
          type: Number,
          required: [true, "Please enter the transaction about"],
        },
      },
    },
  ],
  accounts: [
    {
      // Bank ID
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      name: {
        type: String,
        required: [true, "Please enter bank name"],
      },
      branch: {
        type: String,
        required: [true, "Please enter bank branch"],
      },
      iifsc: {
        type: String,
        required: [true, "Please enter bank IIFSC"],
      },
    },
  ],
  cards: [
    {
      number: {
        type: Number,
        required: [true, "Please enter card number"],
      },
      holder: {
        type: String,
        required: [true, "Please enter holder name"],
      },
      expiry: {
        type: [Number],
        required: [true, "Please enter card expiry date"],
      },
    },
  ],
  otp: {
    value: String,
    expiry: Number,
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
