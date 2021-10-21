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
  balance: {
    type: Number,
    default: 10.0, //For testing
  },
  verified: {
    type: Boolean,
    default: false,
  },
  img: {
    type: String,
    required: false,
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
        name: {
          type: String,
          required: [true, "Please enter party's name"],
        },
        email: {
          type: String,
          required: [true, "Please enter party's email"],
        },
      },
      amount: {
        type: Number,
        required: [true, "Please enter the transaction about"],
      },
    },
  ],
  phone: {
    type: Number,
    required: true,
  },
  otp: {
    value: String,
    expiry: Number,
  },
  authString: {
    value: String,
    expiry: Number,
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
