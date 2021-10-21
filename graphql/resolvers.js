const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Transaction = require("../models/Transaction");

const emailValid =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const passwordValid = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,100}$/;

const resolvers = {
  Query: {
    async user(_parent, args, _context, _info) {
      try {
        const uid = jwt.verify(args.jwt, process.env.SECRET);

        const user = await User.findById(uid);

        if (!user) {
          return {
            error: "User doesn't exist",
          };
        }

        return user;
      } catch (err) {
        console.log(err);
        return {
          error: "Internal Server Error. Please try again later.",
        };
      }
    },

    async previewUser(_parent, args, _context, _info) {
      try {
        const user = await User.findOne({
          $or: [{ username: args.identifier }, { email: args.identifier }],
        });

        if (!user) {
          return {
            error: "User doesn't exist",
          };
        }

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
        };
      } catch (err) {
        console.log(err);
        return {
          error: "Internal Server Error. Please try again later.",
        };
      }
    },
  },

  Mutation: {
    /* Auth */
    async signup(_parent, args, _context, _info) {
      try {
        // Valid Email or Password
        if (!emailValid.test(args.email)) {
          return {
            error: "Invalid email",
          };
        }

        if (!passwordValid.test(args.password)) {
          return {
            error:
              "Password must contain atleast 8 characters, one special character and a numebr",
          };
        }

        // User Already Exists
        const userExists = await User.findOne({
          $or: [{ username: args.username }, { email: args.email }],
        });
        if (userExists) {
          return {
            error: "Username / Email already taken",
          };
        }

        // Password Hash
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(args.password, salt);

        // Otp Generate
        const otp = Math.trunc(Math.random() * 99999999)
          .toString()
          .padStart(8, "0");

        // New User
        const user = new User({
          name: args.name,
          username: args.username,
          email: args.email,
          password: hashedPassword,
          img: args.img,
          phone: args.phone,
          otp: {
            value: otp,
            expiry: Date.now() + 2 * 24 * 60 * 60 * 1000,
          },
        });
        const updatedUser = await user.save();

        //Email Sent
        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: "errorless.nits@gmail.com",
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        transporter.sendMail(
          {
            from: '"Rusafe" <errorless.nits@gmail.com>',
            to: `${updatedUser.email}`,
            subject: "User Registered | Rusafe",
            text: `New user ${updatedUser.name} registered. Your OTP is ${updatedUser.otp.value} and it will expire in 48 hours from this mail.`,
          },
          (error) => {
            console.log(error);
          }
        );

        return {
          error: null,
        };
      } catch (err) {
        console.log(err);
        return {
          error: "Internal server error. Please try again later",
        };
      }
    },

    async otpVerify(_parent, args, _context, _info) {
      try {
        const user = await User.findOne({
          $or: [{ username: args.identifier }, { email: args.identifier }],
        });
        if (!user) {
          return {
            error: "User not found",
          };
        }

        if (Date.now() > user.otp.expiry) {
          return {
            error: "OTP Expired. Please request a new OTP",
          };
        }

        if (user.otp.value !== args.otp) {
          return {
            error: "OTP doesn't match",
          };
        }

        user.verified = true;
        user.otp.expiry = 0;

        const updatedUser = await user.save();

        const token = jwt.sign(updatedUser._id.toString(), process.env.SECRET);

        return {
          jwt: token,
          user: updatedUser,
        };
      } catch (err) {
        console.log(err);
        return {
          error: "Internal Server Error please try again",
        };
      }
    },

    // TODO: Update Login Auth System to 2FA using Auth Strings
    async login(_parent, args, _context, _info) {
      try {
        const user = await User.findOne({
          $or: [{ username: args.identifier }, { email: args.identifier }],
        });

        if (!user) {
          return {
            error: "User doesn't exist",
          };
        }

        const correctPassword = await bcrypt.compare(
          args.password,
          user.password
        );

        if (!correctPassword) {
          return {
            error: "Incorrect Password",
          };
        }

        if (!user.verified) {
          return {
            error: "User not verified. Please verify your OTP",
          };
        }

        const token = jwt.sign(user._id.toString(), process.env.SECRET);

        return {
          jwt: token,
          user,
        };
      } catch (err) {
        console.log(err);
        return {
          error: "Internal Server Error. Please try again later.",
        };
      }
    },

    async newOtp(_parent, args, _context, _info) {
      try {
        const user = await User.findOne({
          $or: [{ username: args.identifier }, { email: args.identifier }],
        });
        if (!user) {
          return {
            error: "User doesn't exist",
          };
        }

        if (user.verified) {
          return {
            error: "User already verfied",
          };
        }

        // Otp Generate
        const otp = Math.trunc(Math.random() * 99999999)
          .toString()
          .padStart(8, "0");

        user.otp.value = otp;
        user.otp.expiry = Date.now() + 2 * 24 * 60 * 60 * 1000;
        await user.save();

        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: "errorless.nits@gmail.com",
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        transporter.sendMail(
          {
            from: '"Rusafe" <errorless.nits@gmail.com>',
            to: `${updatedUser.email}`,
            subject: "New OTP Requested | Rusafe",
            text: `${updatedUser.name} request a new OTP. Your new OTP is ${updatedUser.otp.value} and it will expire in 48 hours from this mail.`,
          },
          (error) => {
            console.log(error);
          }
        );

        return {
          error: null,
        };
      } catch (err) {
        console.log(err);
        return {
          error: "Internal Server Error. Please try again later.",
        };
      }
    },

    //Forgot Password
    async generateString(_parent, args, _context, _info) {
      try {
        const user = await User.findOne({
          $or: [{ username: args.identifier }, { email: args.identifier }],
        });

        if (!user) {
          return {
            error: "User not found",
          };
        }

        if (!user.verified) {
          return {
            error: "Verify OTP first",
          };
        }

        const authenticationString = Math.trunc(
          Math.random() * 1125899906842624 //2^50
        ).toString(36);

        user.authString.value = authenticationString;
        user.authString.expiry = Date.now() + 2 * 24 * 60 * 60 * 1000;

        const updatedUser = await user.save();

        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: "errorless.nits@gmail.com",
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        transporter.sendMail(
          {
            from: '"Rusafe" <errorless.nits@gmail.com>',
            to: `${updatedUser.email}`,
            subject: "Forgot Password | Rusafe",
            text: `${updatedUser.name} forgot their password. Your authentication string is ${updatedUser.authString.value} and it will expire in 48 hours from this mail.`,
          },
          (error) => {
            console.log(error);
          }
        );
        return {
          error: null,
        };
      } catch (err) {
        console.log(err);
        return {
          error: "Internal server error. Please try again later",
        };
      }
    },

    // Generate AlphaNumeric String First
    async forgotPassword(_parent, args, _context, _info) {
      try {
        const user = await User.findOne({
          $or: [{ username: args.identifier }, { email: args.identifier }],
        });

        if (!user) {
          return {
            error: "User not found",
          };
        }

        if (Date.now() > user.authString.expiry) {
          return {
            error: "Authentication String Expired",
          };
        }

        if (args.authString !== user.authString.value) {
          return {
            error: "Incorrect Authentication String",
          };
        }

        // Password Hash
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(args.newPassword, salt);

        user.password = hashedNewPassword;
        user.authString.expiry = 0;
        const updatedUser = await user.save();

        const token = jwt.sign(updatedUser._id.toString(), process.env.SECRET);

        return {
          jwt: token,
          user: updatedUser,
        };
      } catch (err) {
        console.log(err);
        return {
          error: "Internal Server Error. Please try again later.",
        };
      }
    },

    /* Transactions */
    async transactions(_parent, args, _context, _info) {
      try {
        /* Getting Transaction Parties' Data */
        const payer = await User.findById(args.payer);
        const payee = await User.findById(args.payee);

        if (args.amount > payer.balance) {
          return {
            error: "Insufficient Funds",
          };
        }

        /* Creating Transaction Record */
        const transaction = new Transaction({
          payer: {
            _id: payer._id,
            name: payer.name,
            email: payer.email,
          },
          payee: {
            _id: payee._id,
            name: payee.name,
            email: payee.email,
          },
          amount: args.amount,
        });
        const updatedTransaction = await transaction.save();

        /* Updating Party Transaction Record */
        payer.transactions.unshift({
          _id: updatedTransaction._id,
          category: "withdrawal",
          party: {
            _id: payee._id,
            name: payee.email,
            email: payee.email,
          },
          amount: updatedTransaction.amount,
        });
        payer.markModified("transactions");
        payer.balance -= updatedTransaction.amount;
        payer.markModified("balance");
        const updatedPayer = await payer.save();

        payee.transactions.unshift({
          _id: updatedTransaction._id,
          category: "deposit",
          party: {
            _id: payer._id,
            name: payer.email,
            email: payer.email,
          },
          amount: updatedTransaction.amount,
        });
        payee.markModified("transactions");
        payee.balance += updatedTransaction.amount;
        payee.markModified("balance");
        const updatedPayee = await payee.save();

        /* Sending Email of Transaction */
        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: "errorless.nits@gmail.com",
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        // Payer Mail
        transporter.sendMail(
          {
            from: '"Rusafe" <errorless.nits@gmail.com>',
            to: `${payer.email}`,
            subject: "Payment Made | Rusafe",
            text: `Payment to ${payee.name} of amount ₹ ${transaction.amount} was made successfully. Current balance is ₹ ${updatedPayer.balance}`,
          },
          (error) => {
            console.log(error);
          }
        );

        //Payee Mail
        transporter.sendMail(
          {
            from: '"Rusafe" <errorless.nits@gmail.com>',
            to: `${payee.email}`,
            subject: "Payment Received | Rusafe",
            text: `Payment from ${payer.name} of amount ₹ ${transaction.amount} was received successfully. Current balance is ₹ ${updatedPayee.balance}`,
          },
          (error) => {
            console.log(error);
          }
        );
      } catch (err) {
        console.log(err);
        return {
          error: "Internal Server Error. Please try again later.",
        };
      }
    },
  },
};

module.exports = resolvers;
