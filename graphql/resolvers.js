const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

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
        const user = await User.findOne({ email: args.email });

        if (!user) {
          return {
            error: "User not found",
          };
        }

        if (Date.now() > user.otp.expiry) {
          return {
            error: "OTP Expired, please request a new OTP",
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

    async login(_parent, args, _context, _info) {
      const user = await User.findOne({
        $or: [{ username: args.identifier }, { email: args.identifier }],
      });

      if (!user) {
        return {
          error: "User doesn't exist",
        };
      }

      if (!user.verified) {
        return {
          error: "User not verified. Please verify your OTP",
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

      const token = jwt.sign(user._id.toString(), process.env.SECRET);

      return {
        jwt: token,
        user,
      };
    },
    // async newOtp() {},
    // async forgotPassword() {},
  },
};

module.exports = resolvers;
