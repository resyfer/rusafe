const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Void {
    error: String
  }

  # User
  type UserTransactionParty {
    _id: ID
    email: String
  }

  type UserTransaction {
    _id: ID
    category: String
    party: UserTransactionParty
    amount: Float
  }

  type Otp {
    value: String
    expiry: Int
  }

  type AuthString {
    value: String
    expiry: Int
  }

  type User {
    _id: ID
    name: String
    username: String
    email: String
    password: String
    dob: [Int]
    balance: Float
    verified: Boolean
    transactions: [UserTransaction]
    phone: Float
    otp: Otp
    authString: AuthString
    error: String
  }

  type Query {
    users: [User]
  }

  type Credentials {
    jwt: String
    user: User
    error: String
  }

  type Mutation {
    # Auth
    signup(
      name: String!
      username: String!
      email: String!
      password: String!
      dob: [Int!]!
      phone: Float!
    ): Void

    otpVerify(email: String!, otp: String!): Credentials

    login(identifier: String!, password: String!): Credentials

    newOtp(email: String!): Void

    # Forgot Password
    generateString(identifier: String!): Void
    forgotPassword(
      identifier: String!
      authString: String!
      newPassword: String!
    ): Credentials

    # Transactions
    transactions(payer: ID!, payee: ID!, amount: Float!): Void
  }
`;

module.exports = typeDefs;
