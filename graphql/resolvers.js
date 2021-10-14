const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const User = require("../models/User");

const emailValid =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const passwordValid = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,100}$/;

const resolvers = {
  Query: {
    async users() {
      return await User.find();
    },
  },

  Mutation: {
    // Auth
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
          dob: args.dob,
          otp: {
            value: otp,
            expiry: Date.now() + 2 * 24 * 60 * 60 * 1000,
          },
        });
        const updatedUser = await user.save();
        console.log(updatedUser);

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

        await transporter.sendMail(
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

    async login() {},
    async otpVerify() {},
    async newOtp() {},
    async forgotPassword() {},
  },
};

module.exports = resolvers;
